import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Button, Paper, LinearProgress, Chip,
  Radio, RadioGroup, FormControlLabel, Checkbox, TextField,
  Alert, IconButton, Divider,
} from '@mui/material';
import {
  Timer as TimerIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  Flag as FlagIcon,
  Send as SubmitIcon,
  Replay as RetryIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { QuizSettings, QuizQuestion } from '../../../types/types';
import { quizSubmissionApi } from '../../../services/learning.services';

/* ── Types ── */
type Answer = string | string[] | boolean | null;

interface QuizAttempt {
  answers: Record<number, Answer>;
  flagged: Set<number>;
  score: number | null;
  passed: boolean | null;
  submitted: boolean;
}

interface QuizPlayerProps {
  sessionId: number;
  settings: QuizSettings;
  questions: QuizQuestion[];
  /** Number of previous attempts the learner has used */
  previousAttempts?: number;
  onComplete?: (score: number, passed: boolean) => void;
}

/* ── Timer Hook ── */
const useCountdown = (totalSeconds: number, running: boolean) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const label = `${mins}:${secs.toString().padStart(2, '0')}`;
  const urgent = remaining <= 60;

  return { remaining, label, urgent };
};

/* ── Grade helper ── */
const gradeQuiz = (
  questions: QuizQuestion[],
  answers: Record<number, Answer>,
): number => {
  let earned = 0;
  let total = 0;

  for (const q of questions) {
    total += q.points;
    const ans = answers[q.id];
    if (ans == null) continue;

    const payload = q.answer_payload;

    switch (q.question_type) {
      case 'multiple-choice': {
        const correct = (payload.options as { text: string; is_correct: boolean }[])
          ?.filter((o) => o.is_correct)
          .map((o) => o.text);
        const selected = Array.isArray(ans) ? ans : [ans];
        if (
          correct &&
          correct.length === selected.length &&
          correct.every((c) => selected.includes(c))
        ) {
          earned += q.points;
        }
        break;
      }
      case 'true-false': {
        if (ans === payload.correct_answer) earned += q.points;
        break;
      }
      case 'short-answer': {
        const sample = String(payload.sample_answer ?? '').toLowerCase().trim();
        if (String(ans).toLowerCase().trim() === sample) earned += q.points;
        break;
      }
      case 'fill-blank': {
        const blanks = payload.blanks as { answer: string }[] | undefined;
        const filled = Array.isArray(ans) ? ans : [];
        if (blanks && blanks.length === filled.length) {
          const allCorrect = blanks.every(
            (b, i) => b.answer.toLowerCase().trim() === (filled[i] ?? '').toLowerCase().trim(),
          );
          if (allCorrect) earned += q.points;
        }
        break;
      }
      // essay and matching are instructor-graded; give 0 for auto-grade
      default:
        break;
    }
  }

  return total > 0 ? Math.round((earned / total) * 100) : 0;
};

/* ── Component ── */
const QuizPlayer: React.FC<QuizPlayerProps> = ({
  sessionId,
  settings,
  questions: rawQuestions,
  previousAttempts = 0,
  onComplete,
}) => {
  // Possibly shuffle questions
  const questions = useMemo(() => {
    if (!settings.shuffle_questions) return rawQuestions;
    return [...rawQuestions].sort(() => Math.random() - 0.5);
  }, [rawQuestions, settings.shuffle_questions]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [attempt, setAttempt] = useState<QuizAttempt>({
    answers: {},
    flagged: new Set(),
    score: null,
    passed: null,
    submitted: false,
  });
  const [started, setStarted] = useState(false);

  const maxAttempts = settings.max_attempts ?? Infinity;
  const attemptsLeft = maxAttempts - previousAttempts;
  const passingScore = settings.passing_score_percent ?? 0;
  const timeLimitSecs = (settings.time_limit_minutes ?? 0) * 60;

  const { label: timerLabel, urgent: timerUrgent, remaining } = useCountdown(
    timeLimitSecs,
    started && !attempt.submitted && timeLimitSecs > 0,
  );

  // Auto-submit on time expiry
  useEffect(() => {
    if (started && timeLimitSecs > 0 && remaining <= 0 && !attempt.submitted) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const currentQuestion = questions[currentIdx];

  const setAnswer = useCallback((questionId: number, value: Answer) => {
    setAttempt((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  }, []);

  const toggleFlag = useCallback((questionId: number) => {
    setAttempt((prev) => {
      const next = new Set(prev.flagged);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return { ...prev, flagged: next };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    // Client-side grading as immediate feedback
    const score = gradeQuiz(questions, attempt.answers);
    const passed = score >= passingScore;
    setAttempt((prev) => ({ ...prev, score, passed, submitted: true }));
    onComplete?.(score, passed);

    const answers = questions.map((q) => ({
      question: q.id,
      selected_answer: { value: attempt.answers[q.id] ?? null },
    }));
    quizSubmissionApi.create({ quiz: sessionId, enrollment: 0, answers }).catch(() => {
      // Backend submission failed silently — client-side grade is already shown
    });
  }, [questions, attempt.answers, passingScore, onComplete, sessionId]);

  const handleRetry = useCallback(() => {
    setAttempt({ answers: {}, flagged: new Set(), score: null, passed: null, submitted: false });
    setCurrentIdx(0);
    setStarted(false);
  }, []);

  const answeredCount = Object.keys(attempt.answers).filter((k) => attempt.answers[Number(k)] != null).length;

  /* ── Pre-start screen ── */
  if (!started) {
    return (
      <Paper elevation={0} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2, border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Quiz
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="body2">{questions.length} questions</Typography>
          </Box>
          {timeLimitSecs > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography variant="body2">Time limit: {settings.time_limit_minutes} minutes</Typography>
            </Box>
          )}
          {passingScore > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="body2">Passing score: {passingScore}%</Typography>
            </Box>
          )}
          {maxAttempts < Infinity && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RetryIcon sx={{ color: 'info.main', fontSize: 20 }} />
              <Typography variant="body2">
                Attempts remaining: {attemptsLeft} of {maxAttempts}
              </Typography>
            </Box>
          )}
          {!settings.allow_back_navigation && (
            <Alert severity="info" sx={{ mt: 1 }}>You cannot go back to previous questions once you move forward.</Alert>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => setStarted(true)}
          disabled={attemptsLeft <= 0}
          sx={{ fontWeight: 600, color: '#fff' }}
        >
          {attemptsLeft <= 0 ? 'No Attempts Remaining' : 'Start Quiz'}
        </Button>
      </Paper>
    );
  }

  /* ── Results screen ── */
  if (attempt.submitted) {
    return (
      <Paper elevation={0} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 2, border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {attempt.passed ? (
            <CheckIcon sx={{ fontSize: 64, color: 'success.main' }} />
          ) : (
            <WrongIcon sx={{ fontSize: 64, color: 'error.main' }} />
          )}
          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
            {attempt.score}%
          </Typography>
          <Chip
            label={attempt.passed ? 'PASSED' : 'FAILED'}
            color={attempt.passed ? 'success' : 'error'}
            sx={{ fontWeight: 700, mt: 1 }}
          />
          {passingScore > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Passing score: {passingScore}%
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You answered {answeredCount} of {questions.length} questions.
        </Typography>

        {/* Show correct answers if settings allow */}
        {settings.show_correct_answers && settings.show_feedback !== 'never' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {questions.map((q, idx) => {
              const ans = attempt.answers[q.id];
              return (
                <Box key={q.id} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {idx + 1}. {q.question_text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your answer: {ans == null ? 'Skipped' : String(ans)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {attemptsLeft - 1 > 0 && !attempt.passed && (
          <Button variant="outlined" startIcon={<RetryIcon />} fullWidth onClick={handleRetry} sx={{ fontWeight: 600 }}>
            Try Again ({attemptsLeft - 1} attempts left)
          </Button>
        )}
      </Paper>
    );
  }

  /* ── Active quiz ── */
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      {/* Top bar: timer + progress */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentIdx + 1} of {questions.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {timeLimitSecs > 0 && settings.show_timer && (
              <Chip
                icon={<TimerIcon />}
                label={timerLabel}
                size="small"
                color={timerUrgent ? 'error' : 'default'}
                variant={timerUrgent ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600, fontFamily: 'monospace' }}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {answeredCount}/{questions.length} answered
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={((currentIdx + 1) / questions.length) * 100}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Paper>

      {/* Question navigation dots */}
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
        {questions.map((q, idx) => {
          const answered = attempt.answers[q.id] != null;
          const flagged = attempt.flagged.has(q.id);
          const active = idx === currentIdx;
          return (
            <Box
              key={q.id}
              onClick={() => (settings.allow_back_navigation !== false || idx >= currentIdx) && setCurrentIdx(idx)}
              sx={{
                width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: settings.allow_back_navigation !== false || idx >= currentIdx ? 'pointer' : 'not-allowed',
                fontSize: '0.75rem', fontWeight: 600,
                bgcolor: active ? 'primary.main' : answered ? 'success.light' : 'grey.100',
                color: active ? '#fff' : answered ? 'success.contrastText' : 'text.secondary',
                border: flagged ? '2px solid' : '1px solid',
                borderColor: flagged ? 'warning.main' : 'grey.200',
                opacity: settings.allow_back_navigation === false && idx < currentIdx ? 0.4 : 1,
              }}
            >
              {idx + 1}
            </Box>
          );
        })}
      </Box>

      {/* Question card */}
      {currentQuestion && (
        <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'grey.200', borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {currentQuestion.question_text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => toggleFlag(currentQuestion.id)}
              sx={{ color: attempt.flagged.has(currentQuestion.id) ? 'warning.main' : 'grey.400' }}
            >
              <FlagIcon />
            </IconButton>
          </Box>

          <QuestionInput
            question={currentQuestion}
            answer={attempt.answers[currentQuestion.id]}
            onChange={(val) => setAnswer(currentQuestion.id, val)}
            shuffleAnswers={settings.shuffle_answers}
          />
        </Paper>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<PrevIcon />}
          disabled={currentIdx === 0 || settings.allow_back_navigation === false}
          onClick={() => setCurrentIdx((i) => i - 1)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Previous
        </Button>

        {currentIdx < questions.length - 1 ? (
          <Button
            endIcon={<NextIcon />}
            variant="contained"
            onClick={() => setCurrentIdx((i) => i + 1)}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#fff' }}
          >
            Next
          </Button>
        ) : (
          <Button
            endIcon={<SubmitIcon />}
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#fff' }}
          >
            Submit Quiz
          </Button>
        )}
      </Box>
    </Box>
  );
};

/* ── Question Input Renderer ── */
interface QuestionInputProps {
  question: QuizQuestion;
  answer: Answer;
  onChange: (val: Answer) => void;
  shuffleAnswers?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, answer, onChange, shuffleAnswers }) => {
  const { question_type, answer_payload } = question;

  switch (question_type) {
    case 'multiple-choice': {
      const options = (answer_payload.options as { text: string; is_correct: boolean }[]) ?? [];
      const displayOptions = useMemo(
        () => (shuffleAnswers ? [...options].sort(() => Math.random() - 0.5) : options),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [question.id, shuffleAnswers],
      );
      const allowMultiple = !!answer_payload.allow_multiple;

      if (allowMultiple) {
        const selected = Array.isArray(answer) ? answer : [];
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {displayOptions.map((opt) => (
              <FormControlLabel
                key={opt.text}
                control={
                  <Checkbox
                    checked={selected.includes(opt.text)}
                    onChange={() => {
                      const next = selected.includes(opt.text)
                        ? selected.filter((s) => s !== opt.text)
                        : [...selected, opt.text];
                      onChange(next);
                    }}
                  />
                }
                label={opt.text}
                sx={{ m: 0, p: 1, borderRadius: 1, border: 1, borderColor: selected.includes(opt.text) ? 'primary.main' : 'grey.200', '&:hover': { bgcolor: 'grey.50' } }}
              />
            ))}
          </Box>
        );
      }

      return (
        <RadioGroup value={answer ?? ''} onChange={(e) => onChange(e.target.value)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {displayOptions.map((opt) => (
              <FormControlLabel
                key={opt.text}
                value={opt.text}
                control={<Radio />}
                label={opt.text}
                sx={{ m: 0, p: 1, borderRadius: 1, border: 1, borderColor: answer === opt.text ? 'primary.main' : 'grey.200', '&:hover': { bgcolor: 'grey.50' } }}
              />
            ))}
          </Box>
        </RadioGroup>
      );
    }

    case 'true-false':
      return (
        <RadioGroup value={answer == null ? '' : String(answer)} onChange={(e) => onChange(e.target.value === 'true')}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {['true', 'false'].map((val) => (
              <FormControlLabel
                key={val}
                value={val}
                control={<Radio />}
                label={val === 'true' ? 'True' : 'False'}
                sx={{ flex: 1, m: 0, p: 1.5, borderRadius: 1, border: 1, borderColor: String(answer) === val ? 'primary.main' : 'grey.200', justifyContent: 'center', '&:hover': { bgcolor: 'grey.50' } }}
              />
            ))}
          </Box>
        </RadioGroup>
      );

    case 'short-answer':
      return (
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Type your answer..."
          value={answer ?? ''}
          onChange={(e) => onChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      );

    case 'essay':
      return (
        <TextField
          fullWidth
          multiline
          minRows={5}
          placeholder="Write your essay response..."
          value={answer ?? ''}
          onChange={(e) => onChange(e.target.value)}
          helperText={
            answer
              ? `${String(answer).split(/\s+/).filter(Boolean).length} words`
              : undefined
          }
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      );

    case 'matching': {
      const pairs = (answer_payload.pairs as { left: string; right: string }[]) ?? [];
      const currentAnswers = (Array.isArray(answer) ? answer : new Array(pairs.length).fill('')) as string[];
      const rightOptions = useMemo(
        () => pairs.map((p) => p.right),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [question.id],
      );
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {pairs.map((pair, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 120 }}>
                {pair.left}
              </Typography>
              <TextField
                select
                size="small"
                value={currentAnswers[idx] ?? ''}
                onChange={(e) => {
                  const next = [...currentAnswers];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                SelectProps={{ native: true }}
                sx={{ flex: 1 }}
              >
                <option value="">-- Select --</option>
                {rightOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </TextField>
            </Box>
          ))}
        </Box>
      );
    }

    case 'fill-blank': {
      const blanks = (answer_payload.blanks as { answer: string }[]) ?? [];
      const filled = (Array.isArray(answer) ? answer : new Array(blanks.length).fill('')) as string[];
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {blanks.map((_, idx) => (
            <TextField
              key={idx}
              size="small"
              placeholder={`Blank ${idx + 1}`}
              value={filled[idx] ?? ''}
              onChange={(e) => {
                const next = [...filled];
                next[idx] = e.target.value;
                onChange(next);
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          ))}
        </Box>
      );
    }

    default:
      return (
        <Alert severity="warning">
          This question type ({question_type}) is not supported in the quiz player yet.
        </Alert>
      );
  }
};

export default QuizPlayer;
