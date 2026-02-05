import React from 'react';
import { Box, Paper, Typography, Switch, Select, MenuItem, FormControl } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

interface QuizSettingsCardProps {
  showTimer: boolean;
  allowBackNavigation: boolean;
  shuffleAnswers: boolean;
  showFeedback: 'immediate' | 'after-submit' | 'never';
  onShowTimerChange: (value: boolean) => void;
  onAllowBackNavChange: (value: boolean) => void;
  onShuffleAnswersChange: (value: boolean) => void;
  onShowFeedbackChange: (value: 'immediate' | 'after-submit' | 'never') => void;
}

const QuizSettingsCard: React.FC<QuizSettingsCardProps> = ({
  showTimer,
  allowBackNavigation,
  shuffleAnswers,
  showFeedback,
  onShowTimerChange,
  onAllowBackNavChange,
  onShuffleAnswersChange,
  onShowFeedbackChange,
}) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography fontWeight={700}>Quiz Settings</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>Show Timer</Typography>
            <Typography variant="caption" color="text.secondary">Display countdown during quiz</Typography>
          </Box>
          <Switch checked={showTimer} onChange={(e) => onShowTimerChange(e.target.checked)} size="small" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>Allow Back Navigation</Typography>
            <Typography variant="caption" color="text.secondary">Let students go back to previous questions</Typography>
          </Box>
          <Switch checked={allowBackNavigation} onChange={(e) => onAllowBackNavChange(e.target.checked)} size="small" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>Shuffle Answers</Typography>
            <Typography variant="caption" color="text.secondary">Randomize answer order</Typography>
          </Box>
          <Switch checked={shuffleAnswers} onChange={(e) => onShuffleAnswersChange(e.target.checked)} size="small" />
        </Box>

        <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight={600} mb={1}>Show Feedback</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={showFeedback}
              onChange={(e) => onShowFeedbackChange(e.target.value as 'immediate' | 'after-submit' | 'never')}
            >
              <MenuItem value="immediate">Immediately after each answer</MenuItem>
              <MenuItem value="after-submit">After quiz submission</MenuItem>
              <MenuItem value="never">Never show feedback</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuizSettingsCard;
