import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  Edit as GradingIcon,
  Settings as SettingsIcon,
  Download as ExportIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from '../Sidebar';

interface GradingTopBarProps {
  assignmentName: string;
  onSettings?: () => void;
  onExportGrades?: () => void;
  onMobileMenuToggle: () => void;
}

const GradingTopBar: React.FC<GradingTopBarProps> = ({
  assignmentName,
  onSettings,
  onExportGrades,
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
        bgcolor: 'white',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
        {/* Mobile menu toggle */}
        <IconButton
          onClick={onMobileMenuToggle}
          sx={{ display: { md: 'none' }, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Back button */}
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}
        >
          Back
        </Button>

        {/* Page title */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <GradingIcon sx={{ color: '#8b5cf6' }} />
            Grading Interface
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Grade submissions with rubrics, annotations, and feedback
          </Typography>
        </Box>

        {/* Assignment indicator */}
        <Chip
          icon={<TaskIcon sx={{ fontSize: 16 }} />}
          label={assignmentName}
          size="small"
          sx={{
            bgcolor: '#ede9fe',
            color: '#8b5cf6',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#8b5cf6' },
            display: { xs: 'none', sm: 'flex' },
          }}
        />

        {/* Actions */}
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={onSettings}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderColor: 'divider',
            color: 'text.secondary',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          Settings
        </Button>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={onExportGrades}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderColor: 'divider',
            color: 'text.secondary',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          Export Grades
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default GradingTopBar;
