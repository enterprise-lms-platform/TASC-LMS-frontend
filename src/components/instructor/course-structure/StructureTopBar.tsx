import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  Visibility as PreviewIcon,
  Settings as SettingsIcon,
  Rocket as PublishIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

interface StructureTopBarProps {
  courseTitle?: string;
  onBack: () => void;
  onMobileMenuToggle: () => void;
  onPreview: () => void;
  onSettings: () => void;
  onPublish: () => void;
}

const StructureTopBar: React.FC<StructureTopBarProps> = ({
  courseTitle = 'Advanced React Patterns',
  onBack,
  onMobileMenuToggle,
  onPreview,
  onSettings,
  onPublish,
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
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onMobileMenuToggle} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>

          <Button
            startIcon={<BackIcon />}
            onClick={onBack}
            sx={{ color: 'text.secondary', fontWeight: 500, '&:hover': { bgcolor: 'grey.100' } }}
          >
            Back to Course
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Course Structure
              </Typography>
              <Chip
                icon={<BookIcon sx={{ fontSize: 14 }} />}
                label={courseTitle}
                size="small"
                sx={{ bgcolor: '#ffe0b2', color: 'text.primary', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Organize modules and lessons with drag-and-drop
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={onPreview}
            sx={{ borderColor: 'grey.300', color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={onSettings}
            sx={{ borderColor: 'grey.300', color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
          >
            Settings
          </Button>
          <Button variant="contained" startIcon={<PublishIcon />} onClick={onPublish}>
            Publish Changes
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default StructureTopBar;
