import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  Cloud as CloudIcon,
  CheckCircle as SavedIcon,
  Autorenew as SavingIcon,
  Visibility as PreviewIcon,
  Rocket as PublishIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from '../Sidebar';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface CourseTopBarProps {
  title?: string;
  subtitle?: string;
  saveStatus: SaveStatus;
  onMobileMenuToggle: () => void;
  onBack: () => void;
  onPreview: () => void;
  onPublish: () => void;
}

const CourseTopBar: React.FC<CourseTopBarProps> = ({
  title = 'Create New Course',
  subtitle = 'Fill in the details to create your course',
  saveStatus,
  onMobileMenuToggle,
  onBack,
  onPreview,
  onPublish,
}) => {
  const renderSaveIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'info.main' }}>
            <SavingIcon sx={{ fontSize: 18, animation: 'spin 1s linear infinite' }} />
            <Typography variant="body2">Saving...</Typography>
          </Box>
        );
      case 'saved':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <SavedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">All changes saved</Typography>
          </Box>
        );
      default:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <CloudIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">All changes saved</Typography>
          </Box>
        );
    }
  };

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
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '72px !important', px: { xs: 1.5, sm: 2, md: 3 }, gap: 1 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, minWidth: 0 }}>
          {/* Mobile Menu Toggle */}
          <IconButton
            onClick={onMobileMenuToggle}
            sx={{ display: { md: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Back Button - icon only on xs */}
          <IconButton
            onClick={onBack}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: 'text.secondary' }}
          >
            <BackIcon />
          </IconButton>
          <Button
            startIcon={<BackIcon />}
            onClick={onBack}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              color: 'text.secondary',
              fontWeight: 500,
              '&:hover': { bgcolor: 'grey.100', color: 'text.primary' },
            }}
          >
            <Box component="span" sx={{ display: { sm: 'none', md: 'inline' } }}>Back to </Box>Courses
          </Button>

          {/* Mobile title */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.primary"
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            New Course
          </Typography>

          {/* Desktop Title */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 } }}>
          {/* Autosave Indicator */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>{renderSaveIndicator()}</Box>

          {/* Preview Button - icon only on xs */}
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
              borderColor: 'grey.300',
              color: 'text.secondary',
              '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
            }}
          >
            Preview
          </Button>

          {/* Publish Button - icon only on xs */}
          <IconButton
            onClick={onPublish}
            color="primary"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <PublishIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            onClick={onPublish}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Publish
          </Button>
        </Box>
      </Toolbar>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AppBar>
  );
};

export default CourseTopBar;
export type { SaveStatus };
