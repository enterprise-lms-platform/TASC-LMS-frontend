import React, { useCallback, useEffect, useState } from 'react';
import { Box, CssBaseline, Paper, Typography, Toolbar, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

// Layout components
import InstructorSidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import ManagerSidebar from '../../components/manager/Sidebar';

// Hooks
import {
  useQuizDetail,
  usePatchQuiz,
  usePutQuizQuestions,
  usePartialUpdateSession,
} from '../../hooks/useCatalogue';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../hooks/queryKeys';
import axios from 'axios';
import { getErrorMessage } from '../../utils/config';
import type { QuizQuestion, QuizSettings } from '../../types/types';

// Import all quiz builder components
import QuizBuilderTopBar from '../../components/instructor/quiz-builder/QuizBuilderTopBar';
import QuizBuilderFooter from '../../components/instructor/quiz-builder/QuizBuilderFooter';
import QuizInfoCard from '../../components/instructor/quiz-builder/QuizInfoCard';
import QuestionToolbar from '../../components/instructor/quiz-builder/QuestionToolbar';
import QuestionCard from '../../components/instructor/quiz-builder/QuestionCard';
import type { QuestionType } from '../../components/instructor/quiz-builder/QuestionCard';
import AddQuestionCard from '../../components/instructor/quiz-builder/AddQuestionCard';
import MultipleChoiceQuestion from '../../components/instructor/quiz-builder/MultipleChoiceQuestion';
import type { AnswerOption } from '../../components/instructor/quiz-builder/MultipleChoiceQuestion';
import TrueFalseQuestion from '../../components/instructor/quiz-builder/TrueFalseQuestion';
import ShortAnswerQuestion from '../../components/instructor/quiz-builder/ShortAnswerQuestion';
import EssayQuestion from '../../components/instructor/quiz-builder/EssayQuestion';
import MatchingQuestion from '../../components/instructor/quiz-builder/MatchingQuestion';
import type { MatchingPair } from '../../components/instructor/quiz-builder/MatchingQuestion';
import FillBlankQuestion from '../../components/instructor/quiz-builder/FillBlankQuestion';
import QuizSummaryCard from '../../components/instructor/quiz-builder/QuizSummaryCard';
import QuizSettingsCard from '../../components/instructor/quiz-builder/QuizSettingsCard';
import QuestionBankCard from '../../components/instructor/quiz-builder/QuestionBankCard';
import QuizTipsCard from '../../components/instructor/quiz-builder/QuizTipsCard';

// Question data interface (builder state)
interface Question {
  id: string;
  backendId?: number;
  type: QuestionType;
  questionText: string;
  points: number;
  isExpanded: boolean;
  options?: AnswerOption[];
  allowMultiple?: boolean;
  correctAnswer?: boolean | null;
  sampleAnswer?: string;
  charLimit?: number;
  guidelines?: string;
  minWords?: number;
  maxWords?: number;
  pairs?: MatchingPair[];
  textWithBlanks?: string;
  blanks?: string[];
}

/** Map API quiz question to builder Question */
function apiQuestionToBuilder(q: QuizQuestion): Question {
  const id = `q-${q.id}`;
  const payload = q.answer_payload ?? {};
  const base: Question = {
    id,
    backendId: q.id,
    type: q.question_type as QuestionType,
    questionText: q.question_text,
    points: q.points ?? 10,
    isExpanded: false,
  };
  switch (q.question_type) {
    case 'multiple-choice': {
      type Opt = { id?: string; text?: string; is_correct?: boolean; isCorrect?: boolean };
      const opts = (payload.options as Opt[] | undefined) ?? [];
      return {
        ...base,
        options: opts.map((o, i) => ({
          id: o.id ?? `opt-${i}`,
          text: o.text ?? '',
          isCorrect: (o as Opt).is_correct ?? (o as Opt).isCorrect ?? false,
        })),
        allowMultiple: Boolean(
          (payload as { allow_multiple?: boolean; allowMultiple?: boolean }).allow_multiple ??
          (payload as { allow_multiple?: boolean; allowMultiple?: boolean }).allowMultiple
        ),
      };
    }
    case 'true-false': {
      const correct = (payload as { correct_answer?: boolean; correctAnswer?: boolean }).correct_answer ??
        (payload as { correct_answer?: boolean; correctAnswer?: boolean }).correctAnswer;
      return { ...base, correctAnswer: (correct === true || correct === false ? correct : null) };
    }
    case 'short-answer':
      return {
        ...base,
        sampleAnswer: ((payload as { sample_answer?: string; sampleAnswer?: string }).sample_answer ??
          (payload as { sample_answer?: string; sampleAnswer?: string }).sampleAnswer) ?? '',
        charLimit: ((payload as { char_limit?: number; charLimit?: number }).char_limit ??
          (payload as { char_limit?: number; charLimit?: number }).charLimit) ?? 500,
      };
    case 'essay':
      return {
        ...base,
        guidelines: ((payload as { guidelines?: string }).guidelines) ?? '',
        minWords: ((payload as { min_words?: number; minWords?: number }).min_words ??
          (payload as { min_words?: number; minWords?: number }).minWords) ?? 100,
        maxWords: ((payload as { max_words?: number; maxWords?: number }).max_words ??
          (payload as { max_words?: number; maxWords?: number }).maxWords) ?? 500,
      };
    case 'matching': {
      const prs = (payload.pairs as Array<{ id?: string; left?: string; right?: string }> | undefined) ?? [];
      return {
        ...base,
        pairs: prs.map((p, i) => ({
          id: p.id ?? `pair-${i}`,
          left: p.left ?? '',
          right: p.right ?? '',
        })),
      };
    }
    case 'fill-blank': {
      const rawBlanks = (payload as { blanks?: string[] }).blanks;
      const blanks = Array.isArray(rawBlanks) ? (rawBlanks.length > 0 ? rawBlanks : ['']) : [''];
      return {
        ...base,
        textWithBlanks: ((payload as { text_with_blanks?: string; textWithBlanks?: string }).text_with_blanks ??
          (payload as { text_with_blanks?: string; textWithBlanks?: string }).textWithBlanks) ?? '',
        blanks,
      };
    }
    default:
      return base;
  }
}

/** Build answer_payload from builder Question */
function builderQuestionToPayload(q: Question): Record<string, unknown> {
  switch (q.type) {
    case 'multiple-choice':
      return {
        options: (q.options ?? []).map((o) => ({ id: o.id, text: o.text, is_correct: o.isCorrect })),
        allow_multiple: q.allowMultiple ?? false,
      };
    case 'true-false':
      return { correct_answer: q.correctAnswer };
    case 'short-answer':
      return { sample_answer: q.sampleAnswer ?? '', char_limit: q.charLimit ?? 500 };
    case 'essay':
      return {
        guidelines: q.guidelines ?? '',
        min_words: q.minWords ?? 100,
        max_words: q.maxWords ?? 500,
      };
    case 'matching':
      return { pairs: (q.pairs ?? []).map((p) => ({ id: p.id, left: p.left, right: p.right })) };
    case 'fill-blank':
      return { text_with_blanks: q.textWithBlanks ?? '', blanks: q.blanks ?? [''] };
    default:
      return {};
  }
}

/** Build QuizSettings from builder state */
function buildSettingsPayload(state: {
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  showTimer: boolean;
  allowBackNavigation: boolean;
  shuffleAnswers: boolean;
  showFeedback: string;
}): QuizSettings {
  return {
    time_limit_minutes: state.timeLimit,
    passing_score_percent: state.passingScore,
    max_attempts: state.maxAttempts,
    shuffle_questions: state.shuffleQuestions,
    show_correct_answers: state.showCorrectAnswers,
    show_timer: state.showTimer,
    allow_back_navigation: state.allowBackNavigation,
    shuffle_answers: state.shuffleAnswers,
    show_feedback: state.showFeedback,
  };
}

const QuizBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get('sessionId');
  const sessionId = sessionIdParam ? Number(sessionIdParam) : null;
  const courseTitle = searchParams.get('course') || 'Course';

  // Detect role context from URL to keep navigation within the correct dashboard
  const isManager = pathname.startsWith('/manager/');
  const Sidebar = isManager ? ManagerSidebar : InstructorSidebar;
  const basePath = isManager
    ? `/manager/courses/${courseId}`
    : `/instructor/course/${courseId}`;
  const dashboardPath = isManager ? '/manager' : '/instructor';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    data: quizData,
    isLoading: quizLoading,
    isError: quizError,
    error: quizErrorDetail,
  } = useQuizDetail(sessionId);
  const queryClient = useQueryClient();
  const patchQuiz = usePatchQuiz(sessionId ?? 0);
  const putQuestions = usePutQuizQuestions(sessionId ?? 0);
  const updateSession = usePartialUpdateSession();

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [allowBackNavigation, setAllowBackNavigation] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'immediate' | 'after-submit' | 'never'>('after-submit');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isSaving =
    patchQuiz.isPending || putQuestions.isPending || updateSession.isPending;
  const lastSaved: string | null = null;

  useEffect(() => {
    if (quizData && !hasInitialized) {
      setQuizTitle(quizData.session.title);
      setQuizDescription(quizData.session.description ?? '');
      const s = quizData.settings;
      setTimeLimit(s.time_limit_minutes ?? 30);
      setPassingScore(s.passing_score_percent ?? 70);
      setMaxAttempts(s.max_attempts ?? 3);
      setShuffleQuestions(s.shuffle_questions ?? false);
      setShowCorrectAnswers(s.show_correct_answers ?? true);
      setShowTimer(s.show_timer ?? true);
      setAllowBackNavigation(s.allow_back_navigation ?? true);
      setShuffleAnswers(s.shuffle_answers ?? false);
      setShowFeedback(
        (s.show_feedback as 'immediate' | 'after-submit' | 'never') ?? 'after-submit'
      );
      const sorted = [...(quizData.questions ?? [])].sort((a, b) => a.order - b.order);
      setQuestions(sorted.map(apiQuestionToBuilder));
      setHasInitialized(true);
    }
  }, [quizData, hasInitialized]);

  const createDefaultQuestion = useCallback((type: QuestionType): Question => {
    const baseQuestion = {
      id: `q-${Date.now()}`,
      type,
      questionText: '',
      points: 10,
      isExpanded: true,
    };

    switch (type) {
      case 'multiple-choice':
        return {
          ...baseQuestion,
          options: [
            { id: 'opt-1', text: '', isCorrect: false },
            { id: 'opt-2', text: '', isCorrect: false },
            { id: 'opt-3', text: '', isCorrect: false },
            { id: 'opt-4', text: '', isCorrect: false },
          ],
          allowMultiple: false,
        };
      case 'true-false':
        return { ...baseQuestion, correctAnswer: null };
      case 'short-answer':
        return { ...baseQuestion, sampleAnswer: '', charLimit: 500 };
      case 'essay':
        return { ...baseQuestion, guidelines: '', minWords: 100, maxWords: 500 };
      case 'matching':
        return {
          ...baseQuestion,
          pairs: [
            { id: 'pair-1', left: '', right: '' },
            { id: 'pair-2', left: '', right: '' },
            { id: 'pair-3', left: '', right: '' },
          ],
        };
      case 'fill-blank':
        return { ...baseQuestion, textWithBlanks: '', blanks: [''] };
      default:
        return baseQuestion;
    }
  }, []);

  const handleAddQuestion = (type: QuestionType) => {
    setQuestions((prev) => [...prev, createDefaultQuestion(type)]);
  };

  // Update question
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  // Duplicate question
  const duplicateQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      const newQuestion = { ...question, id: `q-${Date.now()}`, backendId: undefined };
      const index = questions.findIndex((q) => q.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, newQuestion);
      setQuestions(newQuestions);
    }
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const expandAll = () =>
    setQuestions((prev) => prev.map((q) => ({ ...q, isExpanded: true })));
  const collapseAll = () =>
    setQuestions((prev) => prev.map((q) => ({ ...q, isExpanded: false })));

  const saveDraft = async () => {
    if (!sessionId || !Number.isFinite(sessionId) || sessionId <= 0) return;
    try {
      await updateSession.mutateAsync({
        id: sessionId,
        data: { title: quizTitle, description: quizDescription },
      });
      await patchQuiz.mutateAsync({
        settings: buildSettingsPayload({
          timeLimit,
          passingScore,
          maxAttempts,
          shuffleQuestions,
          showCorrectAnswers,
          showTimer,
          allowBackNavigation,
          shuffleAnswers,
          showFeedback,
        }),
      });
      const { questions: savedQuestions } = await putQuestions.mutateAsync({
        questions: questions.map((q, i) => ({
          ...(q.backendId != null && { id: q.backendId }),
          order: i,
          question_type: q.type,
          question_text: q.questionText,
          points: q.points,
          answer_payload: builderQuestionToPayload(q),
        })),
      });
      setQuestions((prev) =>
        prev.map((q, i) => {
          const server = savedQuestions?.[i];
          return server ? { ...q, id: `q-${server.id}`, backendId: server.id } : q;
        })
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.detail(sessionId) });
      setSnackbar({ open: true, message: 'Quiz saved as draft.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to save quiz. Please try again.'),
        severity: 'error',
      });
    }
  };

  const publishQuiz = async () => {
    if (!sessionId || !Number.isFinite(sessionId) || sessionId <= 0) return;
    try {
      await updateSession.mutateAsync({
        id: sessionId,
        data: { title: quizTitle, description: quizDescription },
      });
      await patchQuiz.mutateAsync({
        settings: buildSettingsPayload({
          timeLimit,
          passingScore,
          maxAttempts,
          shuffleQuestions,
          showCorrectAnswers,
          showTimer,
          allowBackNavigation,
          shuffleAnswers,
          showFeedback,
        }),
      });
      const { questions: savedQuestions } = await putQuestions.mutateAsync({
        questions: questions.map((q, i) => ({
          ...(q.backendId != null && { id: q.backendId }),
          order: i,
          question_type: q.type,
          question_text: q.questionText,
          points: q.points,
          answer_payload: builderQuestionToPayload(q),
        })),
      });
      setQuestions((prev) =>
        prev.map((q, i) => {
          const server = savedQuestions?.[i];
          return server ? { ...q, id: `q-${server.id}`, backendId: server.id } : q;
        })
      );
      await updateSession.mutateAsync({
        id: sessionId,
        data: { status: 'published', title: quizTitle, description: quizDescription },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.detail(sessionId) });
      setSnackbar({ open: true, message: 'Quiz published successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to publish quiz. Please try again.'),
        severity: 'error',
      });
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  // Render question content based on type
  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            options={question.options || []}
            allowMultiple={question.allowMultiple || false}
            onOptionsChange={(options) => updateQuestion(question.id, { options })}
          />
        );
      case 'true-false':
        return (
          <TrueFalseQuestion
            correctAnswer={question.correctAnswer ?? null}
            onAnswerChange={(answer) => updateQuestion(question.id, { correctAnswer: answer })}
          />
        );
      case 'short-answer':
        return (
          <ShortAnswerQuestion
            sampleAnswer={question.sampleAnswer || ''}
            charLimit={question.charLimit || 500}
            onSampleAnswerChange={(value) => updateQuestion(question.id, { sampleAnswer: value })}
            onCharLimitChange={(value) => updateQuestion(question.id, { charLimit: value })}
          />
        );
      case 'essay':
        return (
          <EssayQuestion
            guidelines={question.guidelines || ''}
            minWords={question.minWords || 100}
            maxWords={question.maxWords || 500}
            onGuidelinesChange={(value) => updateQuestion(question.id, { guidelines: value })}
            onMinWordsChange={(value) => updateQuestion(question.id, { minWords: value })}
            onMaxWordsChange={(value) => updateQuestion(question.id, { maxWords: value })}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            pairs={question.pairs || []}
            onPairsChange={(pairs) => updateQuestion(question.id, { pairs })}
          />
        );
      case 'fill-blank':
        return (
          <FillBlankQuestion
            textWithBlanks={question.textWithBlanks || ''}
            blanks={question.blanks || ['']}
            onTextChange={(value) => updateQuestion(question.id, { textWithBlanks: value })}
            onBlanksChange={(blanks) => updateQuestion(question.id, { blanks })}
          />
        );
      default:
        return null;
    }
  };

  if (!sessionIdParam || sessionId == null || !Number.isFinite(sessionId) || sessionId <= 0) {
    return (
      <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
        <CssBaseline />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
          <Typography color="error.main" fontWeight={600}>
            Missing quiz session. Please create a quiz lesson from the course structure first.
          </Typography>
          <Typography
            component="span"
            color="primary.main"
            sx={{ cursor: 'pointer', display: 'inline-block', mt: 2, textDecoration: 'underline' }}
            onClick={() => navigate(courseId ? `${basePath}/structure` : dashboardPath)}
          >
            Return to course structure
          </Typography>
        </Box>
      </Box>
    );
  }

  if (quizLoading && !quizData) {
    return (
      <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
        <CssBaseline />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (quizError || !quizData) {
    const msg =
      axios.isAxiosError(quizErrorDetail) && quizErrorDetail.response?.status === 404
        ? 'This session is not a quiz or does not exist. Please return to the course structure.'
        : 'Failed to load quiz. Please try again.';
    return (
      <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
        <CssBaseline />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
          <Typography color="error.main" fontWeight={600}>
            {msg}
          </Typography>
          <Typography
            component="span"
            color="primary.main"
            sx={{ cursor: 'pointer', display: 'inline-block', mt: 2, textDecoration: 'underline' }}
            onClick={() => navigate(courseId ? `${basePath}/structure` : dashboardPath)}
          >
            Return to course structure
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Top Bar */}
      <QuizBuilderTopBar
        quizTitle={quizTitle}
        courseTitle={courseTitle}
        onPreview={() => console.log('Preview')}
        onSettings={() => console.log('Settings')}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
              gap: { xs: 2, md: 3 },
              maxWidth: 1400,
              mx: 'auto',
            }}
          >
            {/* Left Column - Main */}
            <Box>
              {/* Quiz Info */}
              <QuizInfoCard
                title={quizTitle}
                description={quizDescription}
                timeLimit={timeLimit}
                passingScore={passingScore}
                maxAttempts={maxAttempts}
                shuffleQuestions={shuffleQuestions}
                showCorrectAnswers={showCorrectAnswers}
                onTitleChange={setQuizTitle}
                onDescriptionChange={setQuizDescription}
                onTimeLimitChange={setTimeLimit}
                onPassingScoreChange={setPassingScore}
                onMaxAttemptsChange={setMaxAttempts}
                onShuffleChange={setShuffleQuestions}
                onShowAnswersChange={setShowCorrectAnswers}
              />

              {/* Questions Section */}
              <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
                <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight={700} fontSize="1.125rem">Questions</Typography>
                  <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{questions.length}</Box> questions
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{totalPoints}</Box> points
                    </Box>
                  </Box>
                </Box>

                <QuestionToolbar
                  questionCount={questions.length}
                  totalPoints={totalPoints}
                  onAddQuestion={handleAddQuestion}
                  onExpandAll={expandAll}
                  onCollapseAll={collapseAll}
                />

                <Box sx={{ p: 2, minHeight: 300 }}>
                  {questions.length === 0 ? (
                    <AddQuestionCard onClick={() => handleAddQuestion('multiple-choice')} />
                  ) : (
                    questions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        number={index + 1}
                        type={question.type}
                        questionText={question.questionText}
                        points={question.points}
                        isExpanded={question.isExpanded}
                        onToggleExpand={() => updateQuestion(question.id, { isExpanded: !question.isExpanded })}
                        onQuestionTextChange={(value) => updateQuestion(question.id, { questionText: value })}
                        onPointsChange={(value) => updateQuestion(question.id, { points: value })}
                        onDuplicate={() => duplicateQuestion(question.id)}
                        onDelete={() => deleteQuestion(question.id)}
                      >
                        {renderQuestionContent(question)}
                      </QuestionCard>
                    ))
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Right Column - Sidebar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <QuizSummaryCard
                totalQuestions={questions.length}
                totalPoints={totalPoints}
                estimatedTime={timeLimit}
                passingScore={passingScore}
              />

              <QuizSettingsCard
                showTimer={showTimer}
                allowBackNavigation={allowBackNavigation}
                shuffleAnswers={shuffleAnswers}
                showFeedback={showFeedback}
                onShowTimerChange={setShowTimer}
                onAllowBackNavChange={setAllowBackNavigation}
                onShuffleAnswersChange={setShuffleAnswers}
                onShowFeedbackChange={setShowFeedback}
              />

              <QuestionBankCard />

              <QuizTipsCard />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <QuizBuilderFooter
          isSaving={isSaving}
          lastSaved={lastSaved}
          onSaveDraft={saveDraft}
          onPublish={publishQuiz}
          onCancel={() => navigate(-1)}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizBuilderPage;
