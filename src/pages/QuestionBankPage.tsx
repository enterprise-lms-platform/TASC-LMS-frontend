import React, { useState } from 'react';
import { Box, CssBaseline, Paper, Typography, Toolbar, Button, Chip, Grid } from '@mui/material';
import { CheckBoxOutlineBlank as SelectIcon } from '@mui/icons-material';

// Layout components
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// Question Bank components
import QuestionBankTopBar from '../components/instructor/question-bank/QuestionBankTopBar';
import QuestionBankStats from '../components/instructor/question-bank/QuestionBankStats';
import CategoriesPanel from '../components/instructor/question-bank/CategoriesPanel';
import TagsCloud from '../components/instructor/question-bank/TagsCloud';
import SearchFilterBar from '../components/instructor/question-bank/SearchFilterBar';
import type { ViewMode, QuestionType, Difficulty, Status } from '../components/instructor/question-bank/SearchFilterBar';
import BulkActionsBar from '../components/instructor/question-bank/BulkActionsBar';
import QuestionBankCard from '../components/instructor/question-bank/QuestionBankCard';
import type { Question } from '../components/instructor/question-bank/QuestionBankCard';
import QuestionsPagination from '../components/instructor/question-bank/QuestionsPagination';
import CreateQuestionModal from '../components/instructor/question-bank/CreateQuestionModal';

// Sample data
const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    text: 'What hook is used for managing state in functional components?',
    category: 'React Hooks',
    points: 10,
    difficulty: 'easy',
    usedInQuizzes: 5,
    successRate: 85,
    tags: ['hooks', 'useState', 'state'],
    options: [
      { text: 'useState', isCorrect: true },
      { text: 'useEffect', isCorrect: false },
      { text: 'useContext', isCorrect: false },
      { text: 'useReducer', isCorrect: false },
    ],
    explanation: 'useState is the primary hook for managing local state in React functional components.',
    stats: { attempts: 452, correctRate: 85, avgTime: '18s' },
  },
  {
    id: '2',
    type: 'true-false',
    text: 'useEffect runs after every render by default.',
    category: 'React Hooks',
    points: 10,
    difficulty: 'medium',
    usedInQuizzes: 3,
    successRate: 72,
    tags: ['hooks', 'useEffect', 'lifecycle'],
    options: [
      { text: 'True', isCorrect: true },
      { text: 'False', isCorrect: false },
    ],
    explanation: 'By default, useEffect runs after every completed render unless you specify dependencies.',
    stats: { attempts: 289, correctRate: 72, avgTime: '12s' },
  },
  {
    id: '3',
    type: 'short-answer',
    text: 'What JavaScript method is used to add an element to the end of an array?',
    category: 'JavaScript Basics',
    points: 5,
    difficulty: 'easy',
    usedInQuizzes: 8,
    successRate: 92,
    tags: ['arrays', 'ES6', 'functions'],
    explanation: 'The push() method adds one or more elements to the end of an array.',
    stats: { attempts: 621, correctRate: 92, avgTime: '15s' },
  },
  {
    id: '4',
    type: 'essay',
    text: 'Explain the difference between let, const, and var in JavaScript.',
    category: 'JavaScript Basics',
    points: 25,
    difficulty: 'medium',
    usedInQuizzes: 2,
    successRate: 78,
    tags: ['ES6', 'variables', 'scope'],
    stats: { attempts: 156, correctRate: 78, avgTime: '4m 30s' },
  },
  {
    id: '5',
    type: 'matching',
    text: 'Match the React hook with its primary purpose.',
    category: 'React Hooks',
    points: 15,
    difficulty: 'hard',
    usedInQuizzes: 4,
    successRate: 65,
    tags: ['hooks', 'components', 'state'],
    stats: { attempts: 198, correctRate: 65, avgTime: '2m 15s' },
  },
];

const QuestionBankPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<QuestionType>('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('');
  const [statusFilter, setStatusFilter] = useState<Status>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Selection state
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleQuestionSelect = (id: string) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === sampleQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(sampleQuestions.map((q) => q.id)));
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* TopBar */}
      <QuestionBankTopBar
        onImport={() => console.log('Import')}
        onExport={() => console.log('Export')}
        onCreateQuestion={() => setCreateModalOpen(true)}
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
          {/* Stats Row */}
          <QuestionBankStats />

          {/* Main Layout - Categories + Questions */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Categories Sidebar */}
            <Grid size={{ xs: 12, lg: 3 }}>
              <CategoriesPanel
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                onAddCategory={() => console.log('Add category')}
              />
              <TagsCloud selectedTags={selectedTags} onTagToggle={handleTagToggle} />
            </Grid>

            {/* Questions Panel */}
            <Grid size={{ xs: 12, lg: 9 }}>
              <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                {/* Header */}
                <Box
                  sx={{
                    p: 2,
                    px: 3,
                    bgcolor: 'grey.50',
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      All Questions
                    </Typography>
                    <Chip label={sampleQuestions.length} size="small" sx={{ bgcolor: 'primary.light', fontWeight: 600 }} />
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<SelectIcon />}
                    onClick={handleSelectAll}
                    sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
                  >
                    {selectedQuestions.size === sampleQuestions.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </Box>

                {/* Search/Filter Bar */}
                <SearchFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  typeFilter={typeFilter}
                  onTypeChange={setTypeFilter}
                  difficultyFilter={difficultyFilter}
                  onDifficultyChange={setDifficultyFilter}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />

                {/* Bulk Actions */}
                <BulkActionsBar
                  selectedCount={selectedQuestions.size}
                  onMove={() => console.log('Move')}
                  onAddToQuiz={() => console.log('Add to quiz')}
                  onExport={() => console.log('Export')}
                  onDelete={() => console.log('Delete')}
                />

                {/* Questions List */}
                <Box sx={{ p: 2 }}>
                  {sampleQuestions.map((question) => (
                    <QuestionBankCard
                      key={question.id}
                      question={question}
                      selected={selectedQuestions.has(question.id)}
                      expanded={expandedQuestion === question.id}
                      onSelect={() => handleQuestionSelect(question.id)}
                      onExpand={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                      onEdit={() => console.log('Edit', question.id)}
                      onDuplicate={() => console.log('Duplicate', question.id)}
                      onAddToQuiz={() => console.log('Add to quiz', question.id)}
                      onDelete={() => console.log('Delete', question.id)}
                    />
                  ))}
                </Box>

                {/* Pagination */}
                <QuestionsPagination
                  currentPage={currentPage}
                  totalPages={5}
                  totalItems={248}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Create Question Modal */}
      <CreateQuestionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={(question) => console.log('Create question:', question)}
      />
    </Box>
  );
};

export default QuestionBankPage;
