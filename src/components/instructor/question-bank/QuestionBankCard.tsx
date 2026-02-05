import React from 'react';
import { Box, Paper, Typography, Checkbox, IconButton, Chip, Collapse } from '@mui/material';
import {
  FormatListBulleted as MCIcon,
  ToggleOn as TFIcon,
  ShortText as ShortIcon,
  Article as EssayIcon,
  CompareArrows as MatchIcon,
  SpaceBar as BlankIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  AddCircle as AddToQuizIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Star as PointsIcon,
  BarChart as StatsIcon,
  ExpandMore as ExpandIcon,
  Lightbulb as TipIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';
  text: string;
  category: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  usedInQuizzes: number;
  successRate: number;
  tags: string[];
  options?: Array<{ text: string; isCorrect: boolean }>;
  explanation?: string;
  stats?: { attempts: number; correctRate: number; avgTime: string };
}

interface QuestionBankCardProps {
  question: Question;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onAddToQuiz: () => void;
  onDelete: () => void;
}

const typeConfig = {
  'multiple-choice': { icon: <MCIcon />, bgColor: '#dbeafe', color: '#3b82f6' },
  'true-false': { icon: <TFIcon />, bgColor: '#d1fae5', color: '#10b981' },
  'short-answer': { icon: <ShortIcon />, bgColor: '#fef3c7', color: '#f59e0b' },
  'essay': { icon: <EssayIcon />, bgColor: '#ede9fe', color: '#8b5cf6' },
  'matching': { icon: <MatchIcon />, bgColor: '#fce7f3', color: '#ec4899' },
  'fill-blank': { icon: <BlankIcon />, bgColor: '#cffafe', color: '#06b6d4' },
};

const difficultyConfig = {
  easy: { bgColor: '#d1fae5', color: '#10b981' },
  medium: { bgColor: '#fef3c7', color: '#f59e0b' },
  hard: { bgColor: '#fee2e2', color: '#ef4444' },
};

const QuestionBankCard: React.FC<QuestionBankCardProps> = ({
  question,
  selected,
  expanded,
  onSelect,
  onExpand,
  onEdit,
  onDuplicate,
  onAddToQuiz,
  onDelete,
}) => {
  const typeInfo = typeConfig[question.type];
  const diffInfo = difficultyConfig[question.difficulty];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: selected ? 'rgba(255, 164, 36, 0.05)' : 'grey.50',
        border: 1,
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 2,
        mb: 1.5,
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: 2,
        },
        '& .action-buttons': { opacity: 0 },
        '&:hover .action-buttons': { opacity: 1 },
      }}
    >
      {/* Card Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Checkbox
          checked={selected}
          onChange={onSelect}
          size="small"
          sx={{ mt: -0.5 }}
        />

        {/* Type Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: typeInfo.bgColor,
            color: typeInfo.color,
            flexShrink: 0,
          }}
        >
          {typeInfo.icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
            {question.text}
          </Typography>

          {/* Meta Info */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FolderIcon sx={{ fontSize: 14 }} />
              {question.category}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PointsIcon sx={{ fontSize: 14 }} />
              {question.points} points
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: diffInfo.bgColor,
                color: diffInfo.color,
              }}
            >
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StatsIcon sx={{ fontSize: 14 }} />
              Used in {question.usedInQuizzes} quizzes
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {question.successRate}% success rate
            </Box>
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {question.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  bgcolor: 'grey.200',
                  color: 'text.secondary',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="action-buttons" sx={{ display: 'flex', gap: 0.5, transition: 'opacity 0.2s' }}>
          <IconButton size="small" title="Preview" onClick={onExpand}>
            {expanded ? <ExpandIcon /> : <PreviewIcon />}
          </IconButton>
          <IconButton size="small" title="Edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" title="Duplicate" onClick={onDuplicate}>
            <CopyIcon />
          </IconButton>
          <IconButton size="small" title="Add to Quiz" onClick={onAddToQuiz}>
            <AddToQuizIcon />
          </IconButton>
          <IconButton size="small" title="Delete" onClick={onDelete} sx={{ '&:hover': { color: 'error.main' } }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Preview Panel */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 0, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          {/* Answer Options */}
          {question.options && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Answer Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {question.options.map((opt, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: opt.isCorrect ? 'success.light' : 'grey.50',
                      border: opt.isCorrect ? 1 : 0,
                      borderColor: 'success.main',
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: opt.isCorrect ? 'success.main' : 'grey.300',
                        color: opt.isCorrect ? 'white' : 'text.secondary',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {opt.isCorrect ? <CheckIcon sx={{ fontSize: 16 }} /> : String.fromCharCode(65 + idx)}
                    </Box>
                    <Typography variant="body2">{opt.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Explanation */}
          {question.explanation && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Explanation
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'info.light',
                  borderLeft: 3,
                  borderColor: 'info.main',
                  display: 'flex',
                  gap: 1,
                }}
              >
                <TipIcon sx={{ color: 'info.main', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  {question.explanation}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Performance Stats */}
          {question.stats && (
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Performance Statistics
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {question.stats.attempts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Attempts
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {question.stats.correctRate}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Correct Rate
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {question.stats.avgTime}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg. Time
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default QuestionBankCard;
