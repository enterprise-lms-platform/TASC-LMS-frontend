import React from 'react';
import { Box, Paper, Typography, IconButton, Chip, Collapse, TextField } from '@mui/material';
import {
  DragIndicator as DragIcon,
  ChevronRight as ExpandIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';

interface QuestionCardProps {
  number: number;
  type: QuestionType;
  questionText: string;
  points: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onQuestionTextChange: (value: string) => void;
  onPointsChange: (value: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

const typeLabels: Record<QuestionType, { label: string; bg: string; color: string }> = {
  'multiple-choice': { label: 'Multiple Choice', bg: '#dbeafe', color: '#3b82f6' },
  'true-false': { label: 'True/False', bg: '#d1fae5', color: '#10b981' },
  'short-answer': { label: 'Short Answer', bg: '#fef3c7', color: '#f59e0b' },
  'essay': { label: 'Essay', bg: '#ede9fe', color: '#8b5cf6' },
  'matching': { label: 'Matching', bg: '#fce7f3', color: '#ec4899' },
  'fill-blank': { label: 'Fill in Blank', bg: '#cffafe', color: '#06b6d4' },
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  number,
  type,
  questionText,
  points,
  isExpanded,
  onToggleExpand,
  onQuestionTextChange,
  onPointsChange,
  onDuplicate,
  onDelete,
  children,
}) => {
  const typeInfo = typeLabels[type];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 2,
        mb: 2,
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Header */}
      <Box
        onClick={onToggleExpand}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'grey.100' },
        }}
      >
        <DragIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />

        <Box
          sx={{
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s',
            color: 'text.secondary',
          }}
        >
          <ExpandIcon />
        </Box>

        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          {number}
        </Box>

        <Chip
          label={typeInfo.label}
          size="small"
          sx={{ bgcolor: typeInfo.bg, color: typeInfo.color, fontWeight: 600 }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            fontWeight={500}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {questionText || 'Untitled question'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {points} {points === 1 ? 'point' : 'points'}
          </Typography>
        </Box>

        <Box
          sx={{ display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.2s', '.MuiPaper-root:hover &': { opacity: 1 } }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton size="small" onClick={onDuplicate}>
            <DuplicateIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Body */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: 2, pt: 0, borderTop: 1, borderColor: 'grey.200', bgcolor: 'white' }}>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Question <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="Enter your question..."
              value={questionText}
              onChange={(e) => onQuestionTextChange(e.target.value)}
            />
          </Box>

          {/* Question-specific content */}
          {children}

          {/* Settings Row */}
          <Box sx={{ pt: 2, mt: 2, borderTop: 1, borderColor: 'grey.200', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Points:</Typography>
              <TextField
                size="small"
                type="number"
                value={points}
                onChange={(e) => onPointsChange(Number(e.target.value))}
                sx={{ width: 70 }}
                inputProps={{ min: 0 }}
              />
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default QuestionCard;
export type { QuestionType };
