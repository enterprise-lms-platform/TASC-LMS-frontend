import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingQuestionProps {
  pairs: MatchingPair[];
  onPairsChange: (pairs: MatchingPair[]) => void;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ pairs, onPairsChange }) => {
  const handlePairChange = (id: string, side: 'left' | 'right', value: string) => {
    onPairsChange(pairs.map((pair) => (pair.id === id ? { ...pair, [side]: value } : pair)));
  };

  const handleDeletePair = (id: string) => {
    if (pairs.length > 2) {
      onPairsChange(pairs.filter((pair) => pair.id !== id));
    }
  };

  const handleAddPair = () => {
    onPairsChange([
      ...pairs,
      { id: `pair-${Date.now()}`, left: '', right: '' },
    ]);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {pairs.map((pair, index) => (
        <Box
          key={pair.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto',
            gap: 1.5,
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={`Item ${index + 1}`}
            value={pair.left}
            onChange={(e) => handlePairChange(pair.id, 'left', e.target.value)}
          />

          <ArrowIcon sx={{ color: 'text.disabled' }} />

          <TextField
            fullWidth
            size="small"
            placeholder={`Match ${index + 1}`}
            value={pair.right}
            onChange={(e) => handlePairChange(pair.id, 'right', e.target.value)}
          />

          <IconButton
            size="small"
            onClick={() => handleDeletePair(pair.id)}
            disabled={pairs.length <= 2}
            sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Box
        onClick={handleAddPair}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 1.5,
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'grey.300',
          borderRadius: 1,
          color: 'text.secondary',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'rgba(255, 164, 36, 0.05)',
          },
        }}
      >
        <AddIcon fontSize="small" />
        Add Pair
      </Box>
    </Box>
  );
};

export default MatchingQuestion;
export type { MatchingPair };
