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

// Quick actions data (will come from backend later)
const quickActions = [
  { icon: <PersonAddIcon />, label: 'Add User' },
  { icon: <ImportIcon />, label: 'Bulk Import' },
  { icon: <NewCourseIcon />, label: 'New Course' },
  { icon: <BulkEnrollIcon />, label: 'Bulk Enroll' },
  { icon: <SessionIcon />, label: 'Schedule Session' },
  { icon: <ExportIcon />, label: 'Export Data' },
];

const QuickActions: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 3,
        flexWrap: 'wrap',
        overflowX: { xs: 'auto', md: 'visible' },
        pb: { xs: 1, md: 0 },
      }}
    >
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outlined"
          startIcon={action.icon}
          sx={{
            bgcolor: 'background.paper',
            borderColor: 'divider',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            flexShrink: 0,
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
              color: 'primary.dark',
            },
            '& .MuiButton-startIcon': {
              color: 'primary.dark',
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
