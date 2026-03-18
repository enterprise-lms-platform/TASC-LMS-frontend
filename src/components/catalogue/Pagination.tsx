import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';

interface PaginationProps {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ count, page, onPageChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <MuiPagination
        count={count}
        page={page}
        onChange={(_, newPage) => onPageChange(newPage)}
        variant="outlined"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            borderColor: '#d4d4d8',
            color: '#52525b',
            fontWeight: 500,
            '&.Mui-selected': { bgcolor: '#ffa424', borderColor: '#ffa424', color: 'white', '&:hover': { bgcolor: '#f97316' } },
            '&:hover': { borderColor: '#ffb74d', color: '#ffa424', bgcolor: 'transparent' },
          },
        }}
      />
    </Box>
  );
};

export default Pagination;
