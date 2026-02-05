import React from 'react';
import { Box, Paper, Typography, TextField, Switch } from '@mui/material';
import { Quiz as QuizIcon } from '@mui/icons-material';

interface QuizInfoCardProps {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTimeLimitChange: (value: number) => void;
  onPassingScoreChange: (value: number) => void;
  onMaxAttemptsChange: (value: number) => void;
  onShuffleChange: (value: boolean) => void;
  onShowAnswersChange: (value: boolean) => void;
}

const QuizInfoCard: React.FC<QuizInfoCardProps> = ({
  title,
  description,
  timeLimit,
  passingScore,
  maxAttempts,
  shuffleQuestions,
  showCorrectAnswers,
  onTitleChange,
  onDescriptionChange,
  onTimeLimitChange,
  onPassingScoreChange,
  onMaxAttemptsChange,
  onShuffleChange,
  onShowAnswersChange,
}) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mb: 3 }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
        <QuizIcon sx={{ color: '#8b5cf6' }} />
        <Typography fontWeight={700} fontSize="1.125rem">Quiz Information</Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Quiz Title <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter quiz title..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Description <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>(optional)</Box>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Describe this quiz..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </Box>

        {/* Settings Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>Time Limit</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                type="number"
                value={timeLimit}
                onChange={(e) => onTimeLimitChange(Number(e.target.value))}
                sx={{ width: 80, mr: 1 }}
                inputProps={{ min: 0 }}
              />
              <Typography variant="body2" color="text.secondary">minutes</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>Passing Score</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                type="number"
                value={passingScore}
                onChange={(e) => onPassingScoreChange(Number(e.target.value))}
                sx={{ width: 80, mr: 1 }}
                inputProps={{ min: 0, max: 100 }}
              />
              <Typography variant="body2" color="text.secondary">%</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>Max Attempts</Typography>
            <TextField
              size="small"
              type="number"
              value={maxAttempts}
              onChange={(e) => onMaxAttemptsChange(Number(e.target.value))}
              sx={{ width: 80 }}
              inputProps={{ min: 1 }}
            />
          </Box>
        </Box>

        {/* Toggle Settings */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>Shuffle Questions</Typography>
              <Typography variant="caption" color="text.secondary">Randomize question order for each attempt</Typography>
            </Box>
            <Switch checked={shuffleQuestions} onChange={(e) => onShuffleChange(e.target.checked)} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>Show Correct Answers</Typography>
              <Typography variant="caption" color="text.secondary">Display correct answers after submission</Typography>
            </Box>
            <Switch checked={showCorrectAnswers} onChange={(e) => onShowAnswersChange(e.target.checked)} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuizInfoCard;
