import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  Check as SaveIcon,
  Publish as PublishIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

interface QuizBuilderFooterProps {
  isSaving: boolean;
  lastSaved: string | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

const QuizBuilderFooter: React.FC<QuizBuilderFooterProps> = ({
  isSaving,
  lastSaved,
  onSaveDraft,
  onPublish,
  onCancel,
}) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        bgcolor: 'white',
        borderTop: 1,
        borderColor: 'grey.200',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        bottom: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: isSaving ? 'text.secondary' : 'success.main',
          }}
        >
          {isSaving ? (
            <SyncIcon fontSize="small" sx={{ animation: 'spin 1s linear infinite', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
          ) : (
            <SaveIcon fontSize="small" />
          )}
          <Typography variant="body2">
            {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved}` : 'All changes saved'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={onSaveDraft}
          sx={{ textTransform: 'none' }}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<PublishIcon />}
          onClick={onPublish}
          sx={{ textTransform: 'none' }}
        >
          Publish Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default QuizBuilderFooter;
