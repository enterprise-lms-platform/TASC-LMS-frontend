import React from 'react';
import { Box, Button } from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  FileUpload as ImportIcon,
  AddCircle as NewCourseIcon,
  GroupAdd as BulkEnrollIcon,
  Videocam as SessionIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';

const quickActions = [
  { icon: <PersonAddIcon />, label: 'Add User', color: '#6366f1' },
  { icon: <ImportIcon />, label: 'Bulk Import', color: '#8b5cf6' },
  { icon: <NewCourseIcon />, label: 'New Course', color: '#ffa424' },
  { icon: <BulkEnrollIcon />, label: 'Bulk Enroll', color: '#10b981' },
  { icon: <SessionIcon />, label: 'Schedule Session', color: '#3b82f6' },
  { icon: <ExportIcon />, label: 'Export Data', color: '#71717a' },
];

const QuickActions: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 3,
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        overflowX: 'auto',
        pb: 1,
        mx: { xs: -2, md: 0 },
        px: { xs: 2, md: 0 },
        '&::-webkit-scrollbar': { height: 3 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 },
      }}
    >
      {quickActions.map((action, idx) => (
        <Button
          key={idx}
          variant="outlined"
          startIcon={action.icon}
          size="small"
          sx={{
            bgcolor: 'white',
            borderColor: 'rgba(0,0,0,0.06)',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            py: 1,
            borderRadius: '12px',
            fontSize: '0.82rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: action.color,
              bgcolor: `${action.color}0a`,
              color: action.color,
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${action.color}20`,
            },
            '& .MuiButton-startIcon': {
              color: action.color,
            },
          }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};

export default QuickActions;
