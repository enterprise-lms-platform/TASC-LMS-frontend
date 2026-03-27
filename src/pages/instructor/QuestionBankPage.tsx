import React, { useMemo, useState } from 'react';
import {
  Box,
  CssBaseline,
  Paper,
  Typography,
  Toolbar,
  Button,
  Chip,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { CheckBoxOutlineBlank as SelectIcon, Add as AddIcon } from '@mui/icons-material';

// Layout components
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';

// Question Bank components
import QuestionBankStats from '../../components/instructor/question-bank/QuestionBankStats';
import CategoriesPanel from '../../components/instructor/question-bank/CategoriesPanel';
import type { CategoryOption } from '../../components/instructor/question-bank/CategoriesPanel';
import TagsCloud from '../../components/instructor/question-bank/TagsCloud';
import SearchFilterBar from '../../components/instructor/question-bank/SearchFilterBar';
import type { ViewMode, QuestionType, Difficulty } from '../../components/instructor/question-bank/SearchFilterBar';
import BulkActionsBar from '../../components/instructor/question-bank/BulkActionsBar';
import QuestionBankCard from '../../components/instructor/question-bank/QuestionBankCard';
import { bankQuestionToDisplay } from '../../components/instructor/question-bank/QuestionBankCard';
import QuestionsPagination from '../../components/instructor/question-bank/QuestionsPagination';
import CreateQuestionModal from '../../components/instructor/question-bank/CreateQuestionModal';
import SelectQuizModal from '../../components/instructor/question-bank/SelectQuizModal';

// Hooks
import {
  useBankQuestions,
  useQuestionCategories,
  useBankQuestion,
  useCreateBankQuestion,
  useCreateQuestionCategory,
  usePatchBankQuestion,
  useDeleteBankQuestion,
  useAddQuestionsFromBank,
} from '../../hooks/useCatalogue';
import { getErrorMessage } from '../../utils/config';
import type { BankQuestion, QuestionCategory } from '../../types/types';

const QuestionBankPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<QuestionType>('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Selection state (numeric IDs)
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);
  const [addToQuizModalOpen, setAddToQuizModalOpen] = useState(false);
  const [selectedQuizSessionId, setSelectedQuizSessionId] = useState<number | null>(null);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Build API params from UI state
  const listParams = useMemo(() => {
    const params: {
      page?: number;
      page_size?: number;
      category?: number;
      search?: string;
      question_type?: string;
      difficulty?: string;
      tags?: string;
    } = {
      page: currentPage,
      page_size: itemsPerPage,
    };
    if (selectedCategory !== 'all') {
      const catNum = Number(selectedCategory);
      if (Number.isFinite(catNum)) params.category = catNum;
    }
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (typeFilter) params.question_type = typeFilter;
    if (difficultyFilter) params.difficulty = difficultyFilter;
    if (selectedTags.length > 0) params.tags = selectedTags.join(',');
    return params;
  }, [currentPage, itemsPerPage, selectedCategory, searchQuery, typeFilter, difficultyFilter, selectedTags]);

  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
    error: questionsErrorDetail,
  } = useBankQuestions(listParams);

  const { data: categoriesData } = useQuestionCategories({ page_size: 100 });
  const { data: expandedQuestionDetail, isLoading: expandedLoading } = useBankQuestion(expandedQuestionId);

  const createQuestion = useCreateBankQuestion();
  const createCategory = useCreateQuestionCategory();
  const patchQuestion = usePatchBankQuestion(editingQuestion?.id ?? null);
  const deleteQuestion = useDeleteBankQuestion();
  const addToQuiz = useAddQuestionsFromBank();

  const questions = questionsData?.results ?? [];
  const totalCount = questionsData?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const categories: CategoryOption[] = useMemo(() => {
    const all: CategoryOption = { id: 'all', name: 'All Questions', isAll: true };
    if (!Array.isArray(categoriesData)) return [all];
    const raw = categoriesData as Array<{ id: number; name: string; order?: number }>;
    const list = raw.map((c) => ({
      id: c.id,
      name: c.name,
      isAll: false,
    }));
    return [all, ...list];
  }, [categoriesData]);

  const categoriesForModal: QuestionCategory[] = useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    const raw = categoriesData as Array<{ id: number; name: string; order?: number }>;
    return raw.map((c) => ({ id: c.id, name: c.name, order: c.order ?? 0 }));
  }, [categoriesData]);

  const suggestedTags = useMemo(() => {
    const tags = new Set<string>();
    questions.forEach((q) => {
      if (Array.isArray(q.tags)) q.tags.forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [questions]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleQuestionSelect = (id: number) => {
    setSelectedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map((q) => q.id)));
    }
  };

  const handleCreateSave = async (payload: Parameters<typeof createQuestion.mutateAsync>[0]) => {
    try {
      await createQuestion.mutateAsync(payload);
      setCreateModalOpen(false);
      if (payload.category == null) {
        setSelectedCategory('all');
      }
      setSnackbar({ open: true, message: 'Question created successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to create question.'),
        severity: 'error',
      });
    }
  };

  const handleEditSave = async (payload: Parameters<typeof patchQuestion.mutateAsync>[0]) => {
    if (!editingQuestion) return;
    try {
      await patchQuestion.mutateAsync(payload);
      setEditingQuestion(null);
      setSnackbar({ open: true, message: 'Question updated successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to update question.'),
        severity: 'error',
      });
    }
  };

  const handleEdit = (q: BankQuestion) => {
    setEditingQuestion(q);
  };

  const handleEditClose = () => {
    setEditingQuestion(null);
  };

  const handleDuplicate = async (q: BankQuestion) => {
    const payload = {
      question_type: q.question_type,
      question_text: q.question_text,
      category: typeof q.category === 'object' && q.category !== null ? (q.category as { id: number }).id : q.category as number,
      points: q.points,
      answer_payload: q.answer_payload,
      difficulty: q.difficulty,
      tags: q.tags ?? [],
      explanation: q.explanation ?? '',
    };
    try {
      await createQuestion.mutateAsync(payload);
      setSnackbar({ open: true, message: 'Question duplicated.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to duplicate question.'),
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion.mutateAsync(id);
      setSelectedQuestions((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setSnackbar({ open: true, message: 'Question deleted.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to delete question.'),
        severity: 'error',
      });
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedQuestions);
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => deleteQuestion.mutateAsync(id)));
      setSelectedQuestions(new Set());
      setSnackbar({ open: true, message: `${ids.length} question(s) deleted.`, severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to delete questions.'),
        severity: 'error',
      });
    }
  };

  const handleAddToQuizOpen = () => {
    setSelectedQuizSessionId(null);
    setAddToQuizModalOpen(true);
  };

  const handleAddCategoryOpen = () => {
    setNewCategoryName('');
    setAddCategoryModalOpen(true);
  };

  const handleAddCategoryClose = () => {
    setAddCategoryModalOpen(false);
    setNewCategoryName('');
  };

  const handleAddCategorySubmit = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      await createCategory.mutateAsync({ name });
      handleAddCategoryClose();
      setSnackbar({ open: true, message: 'Category created successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to create category.'),
        severity: 'error',
      });
    }
  };

  const handleAddToQuizConfirm = async () => {
    if (!selectedQuizSessionId || selectedQuestions.size === 0) return;
    const bank_question_ids = Array.from(selectedQuestions);
    try {
      await addToQuiz.mutateAsync({ sessionId: selectedQuizSessionId, bank_question_ids });
      setAddToQuizModalOpen(false);
      setSelectedQuestions(new Set());
      setSnackbar({
        open: true,
        message: `${bank_question_ids.length} question(s) added to quiz.`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err, 'Failed to add questions to quiz.'),
        severity: 'error',
      });
    }
  };

  const displayQuestions = useMemo(
    () => questions.map((q) => bankQuestionToDisplay(q)),
    [questions]
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

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
          <QuestionBankStats
            totalQuestions={totalCount}
            categoryCount={categories.filter((c) => c.id !== 'all' && !c.isAll).length}
          />

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, lg: 3 }}>
              <CategoriesPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={(id) => {
                  setSelectedCategory(id);
                  setCurrentPage(1);
                }}
                onAddCategory={handleAddCategoryOpen}
              />
              <TagsCloud
                tags={suggestedTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 9 }}>
              <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
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
                    <Chip label={totalCount} size="small" sx={{ bgcolor: 'primary.light', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setCreateModalOpen(true)}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Add Question
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SelectIcon />}
                      onClick={handleSelectAll}
                      disabled={questions.length === 0}
                      sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
                    >
                      {selectedQuestions.size === questions.length && questions.length > 0
                        ? 'Deselect All'
                        : 'Select All'}
                    </Button>
                  </Box>
                </Box>

                <SearchFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                  typeFilter={typeFilter}
                  onTypeChange={(t) => { setTypeFilter(t); setCurrentPage(1); }}
                  difficultyFilter={difficultyFilter}
                  onDifficultyChange={(d) => { setDifficultyFilter(d); setCurrentPage(1); }}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  hideStatusFilter
                />

                <BulkActionsBar
                  selectedCount={selectedQuestions.size}
                  onAddToQuiz={handleAddToQuizOpen}
                  onDelete={handleBulkDelete}
                />

                <Box sx={{ p: 2 }}>
                  {questionsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                      <CircularProgress size={40} />
                    </Box>
                  ) : questionsError ? (
                    <Typography color="error.main" sx={{ py: 4, textAlign: 'center' }}>
                      {getErrorMessage(questionsErrorDetail, 'Failed to load questions.')}
                    </Typography>
                  ) : displayQuestions.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No questions found. Create your first question to get started.
                    </Typography>
                  ) : (
                    displayQuestions.map((displayQ) => (
                      <QuestionBankCard
                        key={displayQ.id}
                        question={displayQ}
                        fullQuestionForPreview={
                          expandedQuestionId === displayQ.id ? (expandedQuestionDetail ?? null) : null
                        }
                        isPreviewLoading={
                          expandedQuestionId === displayQ.id && expandedLoading
                        }
                        selected={selectedQuestions.has(Number(displayQ.id))}
                        expanded={expandedQuestionId === displayQ.id}
                        onSelect={() => handleQuestionSelect(Number(displayQ.id))}
                        onExpand={() =>
                          setExpandedQuestionId((prev) =>
                            prev === displayQ.id ? null : Number(displayQ.id)
                          )
                        }
                        onEdit={() => handleEdit(questions.find((q) => q.id === displayQ.id)!)}
                        onDuplicate={() =>
                          handleDuplicate(questions.find((q) => q.id === displayQ.id)!)
                        }
                        onAddToQuiz={() => {
                          setSelectedQuestions(new Set([Number(displayQ.id)]));
                          setAddToQuizModalOpen(true);
                        }}
                        onDelete={() => handleDelete(Number(displayQ.id))}
                      />
                    ))
                  )}
                </Box>

                <QuestionsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(n) => {
                    setItemsPerPage(n);
                    setCurrentPage(1);
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <CreateQuestionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateSave}
        categories={categoriesForModal}
        suggestedTags={suggestedTags}
        isSubmitting={createQuestion.isPending}
      />

      <CreateQuestionModal
        open={!!editingQuestion}
        onClose={handleEditClose}
        onSave={handleEditSave}
        editingQuestion={editingQuestion}
        isEditLoading={false}
        categories={categoriesForModal}
        suggestedTags={suggestedTags}
        isSubmitting={patchQuestion.isPending}
      />

      <Dialog open={addCategoryModalOpen} onClose={handleAddCategoryClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategorySubmit()}
            margin="normal"
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleAddCategoryClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCategorySubmit}
            disabled={!newCategoryName.trim() || createCategory.isPending}
            sx={{ textTransform: 'none' }}
          >
            {createCategory.isPending ? 'Creating…' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <SelectQuizModal
        open={addToQuizModalOpen}
        onClose={() => setAddToQuizModalOpen(false)}
        selectedSessionId={selectedQuizSessionId}
        selectedCount={selectedQuestions.size}
        onSessionSelect={setSelectedQuizSessionId}
        onConfirm={handleAddToQuizConfirm}
        isSubmitting={addToQuiz.isPending}
      />

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

export default QuestionBankPage;
