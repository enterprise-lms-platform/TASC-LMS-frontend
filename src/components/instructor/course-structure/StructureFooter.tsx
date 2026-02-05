import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  Cloud as CloudIcon,
  CheckCircle as SavedIcon,
  Autorenew as SavingIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface StructureFooterProps {
  saveStatus: SaveStatus;
  lastEdited?: string;
  onSaveDraft: () => void;
  onPreview: () => void;
}

const StructureFooter: React.FC<StructureFooterProps> = ({
  saveStatus,
  lastEdited = '5 minutes ago',
  onSaveDraft,
  onPreview,
}) => {
  const renderSaveIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'info.main' }}>
            <SavingIcon sx={{ fontSize: 18, animation: 'spin 1s linear infinite' }} />
            <Typography variant="body2">Saving...</Typography>
          </Box>
        );
      case 'saved':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <SavedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">All changes saved</Typography>
          </Box>
        );
      default:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <CloudIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">All changes saved</Typography>
          </Box>
        );
    }
  };

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
      {/* Left: Save status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {renderSaveIndicator()}
        <Typography variant="body2" color="text.secondary">
          Last edited: {lastEdited}
        </Typography>
      </Box>

      {/* Right: Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={onSaveDraft}
          sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
        >
          Save Draft
        </Button>
        <Button variant="contained" startIcon={<PreviewIcon />} onClick={onPreview}>
          Preview Course
        </Button>
      </Box>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default StructureFooter;
export type { SaveStatus };
