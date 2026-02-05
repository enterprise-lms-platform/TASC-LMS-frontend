import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Visibility as PreviewIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from '../Sidebar';

interface QuizBuilderTopBarProps {
  quizTitle: string;
  courseTitle: string;
  onPreview: () => void;
  onSettings: () => void;
  onMobileMenuToggle: () => void;
}

const QuizBuilderTopBar: React.FC<QuizBuilderTopBarProps> = ({
  quizTitle,
  courseTitle,
  onPreview,
  onSettings,
  onMobileMenuToggle,
}) => {
  const navigate = useNavigate();

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
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '72px !important', px: { xs: 1.5, sm: 2, md: 3 }, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, minWidth: 0 }}>
          <IconButton
            onClick={onMobileMenuToggle}
            sx={{ display: { md: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Back - icon only on xs */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: 'text.secondary' }}
          >
            <BackIcon />
          </IconButton>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            sx={{ display: { xs: 'none', sm: 'flex' }, color: 'text.secondary', textTransform: 'none' }}
          >
            Back
          </Button>

          {/* Mobile title */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.primary"
            noWrap
            sx={{ display: { xs: 'block', sm: 'none' }, maxWidth: 120 }}
          >
            Quiz Builder
          </Typography>

          {/* Desktop title */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                {quizTitle || 'Untitled Quiz'}
              </Typography>
              <Chip
                label={courseTitle}
                size="small"
                sx={{ bgcolor: '#ede9fe', color: '#8b5cf6', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
              Build your quiz by adding questions below
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
          {/* Preview - icon only on mobile */}
          <IconButton
            onClick={onPreview}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: 'text.secondary' }}
          >
            <PreviewIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={onPreview}
            sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderColor: 'grey.300', color: 'text.secondary' }}
          >
            Preview
          </Button>
          <IconButton onClick={onSettings} sx={{ color: 'text.secondary' }}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default QuizBuilderTopBar;
