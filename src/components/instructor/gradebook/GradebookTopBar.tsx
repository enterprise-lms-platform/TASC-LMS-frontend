import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  FileDownload as ExportIcon,
  Settings as SettingsIcon,
  AutoStories as BookIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

interface GradebookTopBarProps {
  courseName: string;
  onBack: () => void;
  onExport: () => void;
  onSettings: () => void;
  onMobileMenuToggle: () => void;
}

const GradebookTopBar: React.FC<GradebookTopBarProps> = ({
  courseName,
  onBack,
  onExport,
  onSettings,
  onMobileMenuToggle,
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
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Gradebook
              </Typography>
              <Chip
                icon={<BookIcon sx={{ fontSize: 14 }} />}
                label={courseName}
                size="small"
                sx={{ bgcolor: '#ffe0b2', color: 'text.primary', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              View and manage student grades
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={onExport}
            sx={{ borderColor: 'grey.300', color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={onSettings}
            sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
          >
            Settings
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GradebookTopBar;
