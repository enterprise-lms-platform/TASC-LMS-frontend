import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  Storage as DatabaseIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  Add as AddIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

interface QuestionBankTopBarProps {
  onImport: () => void;
  onExport: () => void;
  onCreateQuestion: () => void;
  onMobileMenuToggle: () => void;
}

const QuestionBankTopBar: React.FC<QuestionBankTopBarProps> = ({
  onImport,
  onExport,
  onCreateQuestion,
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DatabaseIcon sx={{ color: 'info.main', fontSize: { xs: 24, sm: 28 } }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Question Bank
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                Manage and organize your reusable questions
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Section - Actions */}
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1.5 } }}>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={onImport}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderColor: 'divider',
              color: 'text.secondary',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={onExport}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderColor: 'divider',
              color: 'text.secondary',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Export
          </Button>
          
          {/* Create - icon only on xs */}
          <IconButton
            color="primary"
            onClick={onCreateQuestion}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <AddIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateQuestion}
            sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default QuestionBankTopBar;
