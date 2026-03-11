import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Close as CloseIcon,
  FormatListBulleted as MCIcon,
  ToggleOn as TFIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import type { BankQuestion, QuestionCategory } from '../../../types/types';
import type { BankQuestionCreatePayload } from '../../../services/catalogue.services';
import { answerPayloadToOptions } from './answerPayloadHelpers';

type SupportedQuestionType = 'multiple-choice' | 'true-false';

const supportedQuestionTypes: Array<{
  type: SupportedQuestionType;
  icon: React.ReactNode;
  label: string;
  color: string;
}> = [
  { type: 'multiple-choice', icon: <MCIcon />, label: 'Multiple Choice', color: '#3b82f6' },
  { type: 'true-false', icon: <TFIcon />, label: 'True/False', color: '#10b981' },
];

interface CreateQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: BankQuestionCreatePayload) => void;
  /** Categories for the Category dropdown. Defaults to [] when omitted. */
  categories?: QuestionCategory[];
  /** Suggested tags for Autocomplete. Defaults to [] when omitted. */
  suggestedTags?: string[];
  editingQuestion?: BankQuestion | null;
  isEditLoading?: boolean;
  isSubmitting?: boolean;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  open,
  onClose,
  onSave,
  categories = [],
  suggestedTags = [],
  editingQuestion,
  isEditLoading = false,
  isSubmitting = false,
}) => {
  const isEdit = !!editingQuestion;

  const [selectedType, setSelectedType] = useState<SupportedQuestionType>('multiple-choice');
  const [questionText, setQuestionText] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [points, setPoints] = useState(10);
  const [tags, setTags] = useState<string[]>([]);
  const [options, setOptions] = useState<Array<{ text: string; isCorrect: boolean }>>([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    if (open && editingQuestion) {
      setSelectedType(
        (editingQuestion.question_type === 'multiple-choice' || editingQuestion.question_type === 'true-false'
          ? editingQuestion.question_type
          : 'multiple-choice') as SupportedQuestionType
      );
      setQuestionText(editingQuestion.question_text);
      const cat = editingQuestion.category;
      setCategoryId(
        cat === null || cat === undefined
          ? ''
          : typeof cat === 'object' && cat !== null && 'id' in cat
            ? (cat as { id: number }).id
            : Number(cat)
      );
      const d = (editingQuestion.difficulty || '').toLowerCase();
      setDifficulty(d === 'easy' || d === 'medium' || d === 'hard' ? d : 'medium');
      setPoints(editingQuestion.points ?? 10);
      setTags(Array.isArray(editingQuestion.tags) ? editingQuestion.tags : []);
      setExplanation(editingQuestion.explanation || '');

      const opts = answerPayloadToOptions(
        editingQuestion.answer_payload,
        editingQuestion.question_type === 'multiple-choice' || editingQuestion.question_type === 'true-false'
          ? editingQuestion.question_type
          : 'multiple-choice'
      );
      if (opts && opts.length > 0) {
        setOptions(opts);
      }
    } else if (open && !editingQuestion) {
      setSelectedType('multiple-choice');
      setQuestionText('');
      setCategoryId('');
      setDifficulty('medium');
      setPoints(10);
      setTags([]);
      setExplanation('');
      setOptions([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    }
  }, [open, editingQuestion]);

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  };

  const handleCorrectToggle = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: selectedType === 'multiple-choice' ? i === index : i === index ? !opt.isCorrect : opt.isCorrect,
    }));
    setOptions(newOptions);
  };

  const handleSave = () => {
    let answer_payload: Record<string, unknown> = {};
    if (selectedType === 'multiple-choice') {
      answer_payload = {
        options: options.map((o) => ({ text: o.text, is_correct: o.isCorrect })),
      };
    } else if (selectedType === 'true-false') {
      const correctIndex = options.findIndex((o) => o.isCorrect);
      const correctAnswer = correctIndex === 0;
      answer_payload = { correct_answer: correctAnswer };
    }

    const payload: BankQuestionCreatePayload = {
      question_type: selectedType,
      question_text: questionText.trim(),
      category: categoryId === '' ? null : Number(categoryId),
      points: Math.max(0, points),
      answer_payload,
      difficulty,
      tags,
      explanation: explanation.trim(),
    };
    onSave(payload);
  };

  const isValid =
    questionText.trim().length > 0 &&
    (selectedType === 'true-false' ||
      (selectedType === 'multiple-choice' &&
        options.some((o) => o.text.trim()) &&
        options.some((o) => o.isCorrect)));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? 'Edit Question' : 'Create New Question'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isEditLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Loading question…
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              MVP supports Multiple Choice and True/False only.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Question Type <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Grid container spacing={1.5}>
                {supportedQuestionTypes.map((qt) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={qt.type}>
                    <Box
                      onClick={() => setSelectedType(qt.type)}
                      sx={{
                        p: 2,
                        border: 2,
                        borderColor: selectedType === qt.type ? qt.color : 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: selectedType === qt.type ? `${qt.color}15` : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: qt.color },
                      }}
                    >
                      <Box sx={{ color: qt.color, mb: 0.5 }}>{qt.icon}</Box>
                      <Typography variant="body2" fontWeight={500}>
                        {qt.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Question Text <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Answer Options <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {options.map((opt, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      bgcolor: opt.isCorrect ? 'success.light' : 'grey.50',
                      border: 1,
                      borderColor: opt.isCorrect ? 'success.main' : 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      onClick={() => handleCorrectToggle(idx)}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: 2,
                        borderColor: opt.isCorrect ? 'success.main' : 'grey.400',
                        bgcolor: opt.isCorrect ? 'success.main' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s',
                      }}
                    >
                      {opt.isCorrect && <CheckIcon sx={{ fontSize: 16 }} />}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={
                        selectedType === 'true-false' ? (idx === 0 ? 'True' : 'False') : `Option ${String.fromCharCode(65 + idx)}`
                      }
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                    {selectedType === 'multiple-choice' && options.length > 2 && (
                      <IconButton size="small" onClick={() => handleRemoveOption(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                {selectedType === 'multiple-choice' && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddOption}
                    sx={{
                      textTransform: 'none',
                      border: '2px dashed',
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                    }}
                  >
                    Add Option
                  </Button>
                )}
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryId === '' ? '' : String(categoryId)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCategoryId(v === '' ? '' : Number(v));
                    }}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    label="Difficulty"
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Points"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Tags
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                options={suggestedTags}
                value={tags}
                onChange={(_, newValue) => setTags(newValue.map((v) => (typeof v === 'string' ? v : '')))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Add tags..." />
                )}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Explanation{' '}
                <Typography component="span" variant="caption" color="text.secondary">
                  (Optional)
                </Typography>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Provide an explanation for the correct answer..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isEditLoading || !isValid || isSubmitting}
          sx={{ textTransform: 'none' }}
        >
          {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuestionModal;
