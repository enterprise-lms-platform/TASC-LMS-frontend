import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
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
