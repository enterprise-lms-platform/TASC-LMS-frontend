import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AddModuleCardProps {
  onClick: () => void;
}

const AddModuleCard: React.FC<AddModuleCardProps> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: 2,
        borderStyle: 'dashed',
        borderColor: 'grey.300',
        borderRadius: 2,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        cursor: 'pointer',
        bgcolor: 'white',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(255, 164, 36, 0.05)',
        },
        '&:hover .add-icon': {
          bgcolor: 'primary.main',
          color: 'white',
        },
      }}
    >
      <Box
        className="add-icon"
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'grey.500',
          transition: 'all 0.2s',
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Box>
      <Typography fontWeight={600} color="text.secondary">
        Add New Module
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Create a new section for your course content
      </Typography>
    </Box>
  );
};

interface AddLessonButtonProps {
  onClick: () => void;
}

const AddLessonButton: React.FC<AddLessonButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      fullWidth
      startIcon={<AddIcon />}
      sx={{
        mt: 1.5,
        py: 1,
        border: 2,
        borderStyle: 'dashed',
        borderColor: 'grey.300',
        color: 'grey.500',
        fontWeight: 500,
        '&:hover': {
          borderColor: 'primary.main',
          color: 'primary.main',
          bgcolor: 'rgba(255, 164, 36, 0.05)',
        },
      }}
    >
      Add Lesson
    </Button>
  );
};

export { AddModuleCard, AddLessonButton };
