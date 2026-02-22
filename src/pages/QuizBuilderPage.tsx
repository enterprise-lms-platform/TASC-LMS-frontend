import React, { useState } from 'react';
import { Box, CssBaseline, Paper, Typography, Toolbar } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Layout components
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// Import all quiz builder components
import QuizBuilderTopBar from '../components/instructor/quiz-builder/QuizBuilderTopBar';
import QuizBuilderFooter from '../components/instructor/quiz-builder/QuizBuilderFooter';
import QuizInfoCard from '../components/instructor/quiz-builder/QuizInfoCard';
import QuestionToolbar from '../components/instructor/quiz-builder/QuestionToolbar';
import QuestionCard from '../components/instructor/quiz-builder/QuestionCard';
import type { QuestionType } from '../components/instructor/quiz-builder/QuestionCard';
import AddQuestionCard from '../components/instructor/quiz-builder/AddQuestionCard';
import MultipleChoiceQuestion from '../components/instructor/quiz-builder/MultipleChoiceQuestion';
import type { AnswerOption } from '../components/instructor/quiz-builder/MultipleChoiceQuestion';
import TrueFalseQuestion from '../components/instructor/quiz-builder/TrueFalseQuestion';
import ShortAnswerQuestion from '../components/instructor/quiz-builder/ShortAnswerQuestion';
import EssayQuestion from '../components/instructor/quiz-builder/EssayQuestion';
import MatchingQuestion from '../components/instructor/quiz-builder/MatchingQuestion';
import type { MatchingPair } from '../components/instructor/quiz-builder/MatchingQuestion';
import FillBlankQuestion from '../components/instructor/quiz-builder/FillBlankQuestion';
import QuizSummaryCard from '../components/instructor/quiz-builder/QuizSummaryCard';
import QuizSettingsCard from '../components/instructor/quiz-builder/QuizSettingsCard';
import QuestionBankCard from '../components/instructor/quiz-builder/QuestionBankCard';
import type { QuestionBank } from '../components/instructor/quiz-builder/QuestionBankCard';
import QuizTipsCard from '../components/instructor/quiz-builder/QuizTipsCard';

// Question data interface
interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  points: number;
  isExpanded: boolean;
  // Type-specific data
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

// Sample question banks
const sampleBanks: QuestionBank[] = [
  { id: '1', name: 'React Basics', questionCount: 25, iconBg: '#dbeafe', iconColor: '#3b82f6' },
  { id: '2', name: 'JavaScript Fundamentals', questionCount: 40, iconBg: '#fef3c7', iconColor: '#f59e0b' },
  { id: '3', name: 'Web Development', questionCount: 35, iconBg: '#d1fae5', iconColor: '#10b981' },
];

const QuizBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonTitle = searchParams.get('lesson') || '';
  const courseTitle = searchParams.get('course') || 'Course';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Quiz info state
  const [quizTitle, setQuizTitle] = useState(lessonTitle ? `${lessonTitle} Quiz` : '');
  const [quizDescription, setQuizDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);

  // Quiz settings state
  const [showTimer, setShowTimer] = useState(true);
  const [allowBackNavigation, setAllowBackNavigation] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'immediate' | 'after-submit' | 'never'>('after-submit');

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);

  // Save state
  const [isSaving] = useState(false);
  const [lastSaved] = useState<string | null>(null);

  // Create default question data based on type
  const createDefaultQuestion = (type: QuestionType): Question => {
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
  };

  // Add question
  const handleAddQuestion = (type: QuestionType) => {
    setQuestions([...questions, createDefaultQuestion(type)]);
  };

  // Update question
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  // Duplicate question
  const duplicateQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      const newQuestion = { ...question, id: `q-${Date.now()}` };
      const index = questions.findIndex((q) => q.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, newQuestion);
      setQuestions(newQuestions);
    }
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Expand/Collapse all
  const expandAll = () => setQuestions(questions.map((q) => ({ ...q, isExpanded: true })));
  const collapseAll = () => setQuestions(questions.map((q) => ({ ...q, isExpanded: false })));

  // Calculate totals
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

              <QuestionBankCard
                banks={sampleBanks}
                onSelectBank={(id) => console.log('Selected bank:', id)}
              />

              <QuizTipsCard />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <QuizBuilderFooter
          isSaving={isSaving}
          lastSaved={lastSaved}
          onSaveDraft={() => console.log('Save draft')}
          onPublish={() => console.log('Publish')}
          onCancel={() => navigate(-1)}
        />
      </Box>
    </Box>
  );
};

export default QuizBuilderPage;
