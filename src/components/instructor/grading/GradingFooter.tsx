import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  Check as SavedIcon,
  Save as SaveIcon,
  Send as SubmitIcon,
} from '@mui/icons-material';

interface GradingFooterProps {
  lastSaved?: Date;
  onSaveDraft: () => void;
  onSubmitNext: () => void;
}

const GradingFooter: React.FC<GradingFooterProps> = ({
  lastSaved,
  onSaveDraft,
  onSubmitNext,
}) => {
  const formatTime = (date?: Date) => {
    if (!date) return null;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box
      sx={{
        p: 2,
        px: 3,
        bgcolor: 'white',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Left - Autosave */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {lastSaved && (
          <>
            <SavedIcon sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="body2" color="success.main">
              Saved at {formatTime(lastSaved)}
            </Typography>
          </>
        )}
      </Box>

      {/* Right - Actions */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          width: { xs: '100%', sm: 'auto' },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={onSaveDraft}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderColor: 'divider',
            color: 'text.secondary',
            flex: { xs: 1, sm: 'initial' },
          }}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          startIcon={<SubmitIcon />}
          onClick={onSubmitNext}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' },
            flex: { xs: 1, sm: 'initial' },
          }}
        >
          Submit & Next
        </Button>
      </Box>
    </Box>
  );
};

export default GradingFooter;
