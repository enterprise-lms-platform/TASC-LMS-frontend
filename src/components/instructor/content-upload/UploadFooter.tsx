import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Close as CancelIcon, Add as AddMoreIcon, CheckCircle as CompleteIcon } from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

interface UploadFooterProps {
  uploadCount: number;
  onCancel: () => void;
  onAddMore: () => void;
  onComplete: () => void;
}

const UploadFooter: React.FC<UploadFooterProps> = ({ uploadCount, onCancel, onAddMore, onComplete }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, md: DRAWER_WIDTH },
        right: 0,
        p: 2,
        px: 3,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        zIndex: 1100,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {uploadCount} {uploadCount === 1 ? 'file' : 'files'} ready to upload
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel} sx={{ borderColor: 'grey.300', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant="outlined" startIcon={<AddMoreIcon />} onClick={onAddMore} sx={{ borderColor: 'grey.300', color: 'text.secondary' }}>
          Add More Content
        </Button>
        <Button variant="contained" startIcon={<CompleteIcon />} onClick={onComplete} disabled={uploadCount === 0}>
          Complete Upload
        </Button>
      </Box>
    </Box>
  );
};

export default UploadFooter;
