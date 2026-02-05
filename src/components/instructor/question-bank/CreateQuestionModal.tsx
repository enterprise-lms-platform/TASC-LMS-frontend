import React, { useState } from 'react';
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
  ShortText as ShortIcon,
  Article as EssayIcon,
  CompareArrows as MatchIcon,
  SpaceBar as BlankIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';

const questionTypes: Array<{ type: QuestionType; icon: React.ReactNode; label: string; color: string }> = [
  { type: 'multiple-choice', icon: <MCIcon />, label: 'Multiple Choice', color: '#3b82f6' },
  { type: 'true-false', icon: <TFIcon />, label: 'True/False', color: '#10b981' },
  { type: 'short-answer', icon: <ShortIcon />, label: 'Short Answer', color: '#f59e0b' },
  { type: 'essay', icon: <EssayIcon />, label: 'Essay', color: '#8b5cf6' },
  { type: 'matching', icon: <MatchIcon />, label: 'Matching', color: '#ec4899' },
  { type: 'fill-blank', icon: <BlankIcon />, label: 'Fill in Blank', color: '#06b6d4' },
];

const categories = [
  'React Hooks', 'JavaScript Basics', 'TypeScript', 'CSS & Styling',
  'State Management', 'Testing', 'Performance',
];

const existingTags = [
  'hooks', 'useState', 'useEffect', 'components', 'props',
  'state', 'async', 'ES6', 'arrays', 'functions',
];

interface CreateQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: unknown) => void;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ open, onClose, onSave }) => {
  const [selectedType, setSelectedType] = useState<QuestionType>('multiple-choice');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('');
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

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectToggle = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: selectedType === 'multiple-choice' ? i === index : (i === index ? !opt.isCorrect : opt.isCorrect),
    }));
    setOptions(newOptions);
  };

  const handleSave = () => {
    onSave({
      type: selectedType,
      text: questionText,
      category,
      difficulty,
      points,
      tags,
      options: selectedType === 'multiple-choice' || selectedType === 'true-false' ? options : undefined,
      explanation,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Create New Question
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Question Type Selector */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Question Type <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <Grid container spacing={1.5}>
            {questionTypes.map((qt) => (
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
                    bgcolor: selectedType === qt.type ? `${qt.color}10` : 'transparent',
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

        {/* Question Text */}
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

        {/* Answer Options (for MC/TF) */}
        {(selectedType === 'multiple-choice' || selectedType === 'true-false') && (
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
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    value={opt.text}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                  />
                  {options.length > 2 && (
                    <IconButton size="small" onClick={() => handleRemoveOption(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
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
            </Box>
          </Box>
        )}

        {/* Settings Row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')} label="Difficulty">
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
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </Grid>
        </Grid>

        {/* Tags */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Tags
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={existingTags}
            value={tags}
            onChange={(_, newValue) => setTags(newValue)}
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

        {/* Explanation */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Explanation <Typography component="span" variant="caption" color="text.secondary">(Optional)</Typography>
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
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!questionText.trim()}
          sx={{ textTransform: 'none' }}
        >
          Create Question
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuestionModal;
