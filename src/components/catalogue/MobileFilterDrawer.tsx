import React from 'react';
import { Drawer, Box, Typography, IconButton, Button, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FiltersSidebar from './FiltersSidebar';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { width: 320, maxWidth: '90%' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Filters</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <FiltersSidebar />
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e4e4e7', bgcolor: 'white' }}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" fullWidth onClick={onClose} sx={{ color: '#52525b', borderColor: '#d4d4d8' }}>Clear All</Button>
            <Button variant="contained" fullWidth onClick={onClose} sx={{ bgcolor: '#ffa424', '&:hover': { bgcolor: '#f97316' } }}>Show Results</Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileFilterDrawer;
