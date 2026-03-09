import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface FeedbackSnackbarProps {
  message: string | null;
  onClose: () => void;
  severity?: AlertColor;
  autoHideDuration?: number;
}

const FeedbackSnackbar: React.FC<FeedbackSnackbarProps> = ({
  message,
  onClose,
  severity = 'error',
  autoHideDuration = 6000,
}) => (
  <Snackbar
    open={!!message}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity={severity} onClose={onClose} variant="filled">
      {message}
    </Alert>
  </Snackbar>
);

export default FeedbackSnackbar;
