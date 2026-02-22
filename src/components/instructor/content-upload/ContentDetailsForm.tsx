import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

interface ContentDetailsFormProps {
  requireCompletion: boolean;
  includeInProgress: boolean;
  downloadable: boolean;
  onRequireCompletionChange: (checked: boolean) => void;
  onIncludeInProgressChange: (checked: boolean) => void;
  onDownloadableChange: (checked: boolean) => void;
}

const ContentDetailsForm: React.FC<ContentDetailsFormProps> = ({
  requireCompletion,
  includeInProgress,
  downloadable,
  onRequireCompletionChange,
  onIncludeInProgressChange,
  onDownloadableChange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            Require completion
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Learners must finish before proceeding
          </Typography>
        </Box>
        <Switch checked={requireCompletion} onChange={(e) => onRequireCompletionChange(e.target.checked)} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            Include in progress
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Count towards course completion
          </Typography>
        </Box>
        <Switch checked={includeInProgress} onChange={(e) => onIncludeInProgressChange(e.target.checked)} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            Downloadable
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Allow learners to download
          </Typography>
        </Box>
        <Switch checked={downloadable} onChange={(e) => onDownloadableChange(e.target.checked)} />
      </Box>
    </Box>
  );
};

export default ContentDetailsForm;
