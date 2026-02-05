import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceQuestionProps {
  options: AnswerOption[];
  allowMultiple: boolean;
  onOptionsChange: (options: AnswerOption[]) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  allowMultiple,
  onOptionsChange,
}) => {
  const handleOptionTextChange = (id: string, text: string) => {
    onOptionsChange(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  const handleToggleCorrect = (id: string) => {
    if (allowMultiple) {
      onOptionsChange(options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)));
    } else {
      onOptionsChange(options.map((opt) => ({ ...opt, isCorrect: opt.id === id })));
    }
  };

  const handleDeleteOption = (id: string) => {
    if (options.length > 2) {
      onOptionsChange(options.filter((opt) => opt.id !== id));
    }
  };

  const handleAddOption = () => {
    onOptionsChange([
      ...options,
      { id: `opt-${Date.now()}`, text: '', isCorrect: false },
    ]);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {options.map((option, index) => (
        <Box
          key={option.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            bgcolor: option.isCorrect ? '#d1fae5' : 'grey.50',
            border: 1,
            borderColor: option.isCorrect ? '#10b981' : 'grey.200',
            borderRadius: 1,
            mb: 1,
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <DragIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />

          <Box
            onClick={() => handleToggleCorrect(option.id)}
            sx={{
              width: 20,
              height: 20,
              border: 2,
              borderColor: option.isCorrect ? '#10b981' : 'grey.300',
              borderRadius: allowMultiple ? 0.5 : '50%',
              bgcolor: option.isCorrect ? '#10b981' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {option.isCorrect && <CheckIcon sx={{ fontSize: 14, color: 'white' }} />}
          </Box>

          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder={`Option ${index + 1}`}
            value={option.text}
            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ '& input': { bgcolor: 'transparent' } }}
          />

          <IconButton
            size="small"
            onClick={() => handleDeleteOption(option.id)}
            disabled={options.length <= 2}
            sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Box
        onClick={handleAddOption}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 1.5,
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'grey.300',
          borderRadius: 1,
          color: 'text.secondary',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'rgba(255, 164, 36, 0.05)',
          },
        }}
      >
        <AddIcon fontSize="small" />
        Add Option
      </Box>
    </Box>
  );
};

export default MultipleChoiceQuestion;
export type { AnswerOption };
