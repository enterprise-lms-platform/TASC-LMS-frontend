import React from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CatalogPagination: React.FC<CatalogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(i);
    }
    return pages;
  };

  const buttonStyle = (isActive: boolean) => ({
    width: 40,
    height: 40,
    borderRadius: 1,
    border: '1px solid #d4d4d8',
    bgcolor: isActive ? '#ffa424' : 'white',
    color: isActive ? 'white' : '#52525b',
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:hover': {
      bgcolor: isActive ? '#e59420' : 'rgba(255, 164, 36, 0.05)',
      borderColor: '#ffa424',
    },
    '&.Mui-disabled': {
      opacity: 0.5,
    },
  });

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ mt: 6 }}
    >
      {/* Previous */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={buttonStyle(false)}
      >
        <ChevronLeft />
      </IconButton>

      {/* Page numbers */}
      {getPageNumbers().map((page) => (
        <Box
          key={page}
          component="button"
          onClick={() => onPageChange(page)}
          sx={{
            ...buttonStyle(page === currentPage),
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {page}
        </Box>
      ))}

      {/* Next */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={buttonStyle(false)}
      >
        <ChevronRight />
      </IconButton>
    </Stack>
  );
};

export default CatalogPagination;
