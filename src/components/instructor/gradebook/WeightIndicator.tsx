import React from 'react';
import { Box, Typography } from '@mui/material';
import type { GradeCategory, WeightingMode } from '../../../utils/gradingUtils';

interface WeightIndicatorProps {
  categories: GradeCategory[];
  weightingMode: WeightingMode;
}

const WeightIndicator: React.FC<WeightIndicatorProps> = ({ categories, weightingMode }) => {
  if (weightingMode === 'equal_points') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">Equal Points</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ display: 'flex', height: 6, borderRadius: 1, overflow: 'hidden', width: 120 }}>
        {categories.map((cat) => (
          <Box
            key={cat.id}
            sx={{ width: `${cat.weight}%`, bgcolor: cat.color, minWidth: cat.weight > 0 ? 2 : 0 }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {categories.map((cat) => (
          <Box key={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: cat.color }} />
            <Typography variant="caption" color="text.secondary">{cat.weight}%</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WeightIndicator;
