import React from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';

interface QuestionsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}

const QuestionsPagination: React.FC<QuestionsPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box
      sx={{
        p: 2,
        px: 3,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalItems} questions
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Show:
          </Typography>
          <FormControl size="small">
            <Select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(e.target.value as number)}
              sx={{ minWidth: 70 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            <PrevIcon />
          </IconButton>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                size="small"
                variant={currentPage === pageNum ? 'contained' : 'outlined'}
                onClick={() => onPageChange(pageNum)}
                sx={{
                  minWidth: 36,
                  height: 36,
                  p: 0,
                  borderColor: 'divider',
                  ...(currentPage !== pageNum && { color: 'text.secondary' }),
                }}
              >
                {pageNum}
              </Button>
            );
          })}

          <IconButton
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            <NextIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionsPagination;
