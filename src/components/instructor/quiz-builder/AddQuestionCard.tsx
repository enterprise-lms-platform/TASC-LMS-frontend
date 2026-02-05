import React from 'react';
import { Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AddQuestionCardProps {
  onClick: () => void;
}

const AddQuestionCard: React.FC<AddQuestionCardProps> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: 2,
        borderStyle: 'dashed',
        borderColor: 'grey.300',
        borderRadius: 2,
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
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
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        <AddIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
      </Box>
      <Typography fontWeight={600} color="text.secondary">
        Add Your First Question
      </Typography>
      <Typography variant="body2" color="text.disabled">
        Click to add a question or use the toolbar above
      </Typography>
    </Box>
  );
};

export default AddQuestionCard;
