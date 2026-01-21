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
        gap: { xs: 1, md: 1.5 },
        mb: 3,
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        overflowX: 'auto',
        pb: 1,
        mx: { xs: -2, md: 0 },
        px: { xs: 2, md: 0 },
        '&::-webkit-scrollbar': {
          height: 4,
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'grey.100',
          borderRadius: 2,
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'grey.300',
          borderRadius: 2,
        },
      }}
    >
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outlined"
          startIcon={action.icon}
          size="small"
          sx={{
            bgcolor: 'background.paper',
            borderColor: 'divider',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 500,
            px: { xs: 1.5, md: 2 },
            py: { xs: 0.75, md: 1 },
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            flexShrink: 0,
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
              color: 'primary.dark',
            },
            '& .MuiButton-startIcon': {
              color: 'primary.dark',
              mr: { xs: 0.5, md: 1 },
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
