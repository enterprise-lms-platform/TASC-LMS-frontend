import React from 'react';
import { TableCell, Typography, Box } from '@mui/material';
import type { GradeCategory } from '../../../utils/gradingUtils';

interface CategoryHeaderProps {
  category: GradeCategory;
  itemCount: number;
  showWeight: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, itemCount, showWeight }) => {
  return (
    <TableCell
      colSpan={itemCount}
      align="center"
      sx={{
        bgcolor: 'grey.50',
        borderBottom: `3px solid ${category.color}`,
        p: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: category.color }} />
        <Typography variant="caption" fontWeight={700} color="text.primary">
          {category.name}
        </Typography>
        {showWeight && (
          <Typography variant="caption" color="text.secondary">
            ({category.weight}%)
          </Typography>
        )}
      </Box>
    </TableCell>
  );
};

export default CategoryHeader;
