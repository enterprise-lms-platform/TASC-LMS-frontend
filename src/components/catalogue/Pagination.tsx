import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';

const Pagination: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <MuiPagination
        count={24}
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
