import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  CloudUpload as UploadIcon,
  FolderOpen as FolderIcon,
  Upload as BulkUploadIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

interface UploadTopBarProps {
  courseTitle?: string;
  onBack: () => void;
  onMobileMenuToggle: () => void;
  onContentLibrary: () => void;
  onBulkUpload: () => void;
}

const UploadTopBar: React.FC<UploadTopBarProps> = ({
  courseTitle = 'Advanced React Patterns',
  onBack,
  onMobileMenuToggle,
  onContentLibrary,
  onBulkUpload,
}) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '72px !important', px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onMobileMenuToggle} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>

          <Button
            startIcon={<BackIcon />}
            onClick={onBack}
            sx={{ color: 'text.secondary', fontWeight: 500, '&:hover': { bgcolor: 'grey.100' } }}
          >
            Back
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UploadIcon color="primary" />
                Upload Content
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Upload videos, documents, SCORM packages, or add external links
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            icon={<BookIcon sx={{ fontSize: 14 }} />}
            label={courseTitle}
            size="small"
            sx={{ bgcolor: '#ffe0b2', color: 'text.primary', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
          />
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={onContentLibrary}
            sx={{ borderColor: 'grey.300', color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
          >
            Content Library
          </Button>
          <Button variant="contained" startIcon={<BulkUploadIcon />} onClick={onBulkUpload}>
            Bulk Upload
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UploadTopBar;
