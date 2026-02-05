import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  Check as CheckIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';

interface AssignmentFooterProps {
  lastSaved?: Date;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const AssignmentFooter: React.FC<AssignmentFooterProps> = ({
  lastSaved,
  onSaveDraft,
  onPublish,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        px: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 1.5, sm: 2 },
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
      }}
    >
      {/* Left - Autosave Indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
        {lastSaved && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'success.main',
            }}
          >
            <CheckIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              Saved at {formatTime(lastSaved)}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right - Actions */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 } }}>
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
          }}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<PublishIcon />}
          onClick={onPublish}
          fullWidth
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Publish
        </Button>
      </Box>
    </Box>
  );
};

export default AssignmentFooter;
