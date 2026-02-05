import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Folder as FolderIcon,
  PlaylistAdd as AddToQuizIcon,
  Download as ExportIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface BulkActionsBarProps {
  selectedCount: number;
  onMove: () => void;
  onAddToQuiz: () => void;
  onExport: () => void;
  onDelete: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onMove,
  onAddToQuiz,
  onExport,
  onDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        p: 1.5,
        px: 3,
        bgcolor: 'info.light',
        borderBottom: 1,
        borderColor: 'info.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'info.main' }}>
        <CheckIcon />
        <Typography fontWeight={500}>
          <strong>{selectedCount}</strong> questions selected
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FolderIcon />}
          onClick={onMove}
          sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          Move to Category
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddToQuizIcon />}
          onClick={onAddToQuiz}
          sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          Add to Quiz
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={onExport}
          sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          Export
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          sx={{ textTransform: 'none' }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default BulkActionsBar;
