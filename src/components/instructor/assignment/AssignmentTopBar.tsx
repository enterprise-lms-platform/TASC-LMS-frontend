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
  Task as TaskIcon,
  ArrowBack as BackIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Menu as MenuIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from '../Sidebar';

interface AssignmentTopBarProps {
  courseName: string;
  onPreview: () => void;
  onSave: () => void;
  onMobileMenuToggle: () => void;
}

const AssignmentTopBar: React.FC<AssignmentTopBarProps> = ({
  courseName,
  onPreview,
  onSave,
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
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, minWidth: 0 }}>
          <IconButton
            onClick={onMobileMenuToggle}
            sx={{ display: { md: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              color: 'text.secondary',
            }}
          >
            <BackIcon />
          </IconButton>

          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Back
          </Button>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <TaskIcon sx={{ color: 'warning.main', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Create Assignment
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Design assignments with detailed instructions and grading rubrics
              </Typography>
            </Box>
          </Box>

          {/* Mobile title */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.primary"
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            Assignment
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 } }}>
          <Chip
            icon={<BookIcon sx={{ fontSize: 16 }} />}
            label={courseName}
            size="small"
            sx={{
              bgcolor: 'info.light',
              color: 'info.main',
              fontWeight: 600,
              display: { xs: 'none', lg: 'flex' },
            }}
          />

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
            sx={{
              display: { xs: 'none', sm: 'flex' },
              textTransform: 'none',
              fontWeight: 500,
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          >
            Preview
          </Button>

          {/* Save - icon only on mobile */}
          <IconButton
            onClick={onSave}
            color="primary"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <SaveIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSave}
            sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', fontWeight: 600 }}
          >
            Save
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AssignmentTopBar;
