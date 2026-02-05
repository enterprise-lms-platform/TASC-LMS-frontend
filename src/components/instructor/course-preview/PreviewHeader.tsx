import React from 'react';
import { AppBar, Toolbar, Box, Button, Chip, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  Visibility as PreviewIcon,
  DesktopWindows as DesktopIcon,
  Tablet as TabletIcon,
  PhoneAndroid as MobileIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  CloudUpload as PublishIcon,
} from '@mui/icons-material';

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'student' | 'instructor';

interface PreviewHeaderProps {
  deviceType: DeviceType;
  viewMode: ViewMode;
  courseStatus?: 'draft' | 'published';
  onDeviceChange: (device: DeviceType) => void;
  onViewChange: (view: ViewMode) => void;
  onEdit?: () => void;
  onShare?: () => void;
  onPublish?: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  deviceType,
  viewMode,
  courseStatus = 'draft',
  onDeviceChange,
  onViewChange,
  onEdit,
  onShare,
  onPublish,
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #27272a, #18181b)',
        color: 'white',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px !important', px: 3 }}>
        {/* Left */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<PreviewIcon sx={{ fontSize: 14 }} />}
            label="Preview Mode"
            size="small"
            sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
          />
          <Chip
            label={courseStatus === 'draft' ? 'Draft' : 'Published'}
            size="small"
            sx={{
              bgcolor: courseStatus === 'draft' ? '#f59e0b' : '#10b981',
              color: courseStatus === 'draft' ? '#18181b' : 'white',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Center - Device & View Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Device Toggle */}
          <ToggleButtonGroup
            value={deviceType}
            exclusive
            onChange={(_, value) => value && onDeviceChange(value)}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiToggleButton-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
                '&:hover': { color: 'white' },
              },
            }}
          >
            <ToggleButton value="desktop">
              <DesktopIcon sx={{ fontSize: 18, mr: 0.5 }} />
              Desktop
            </ToggleButton>
            <ToggleButton value="tablet">
              <TabletIcon sx={{ fontSize: 18, mr: 0.5 }} />
              Tablet
            </ToggleButton>
            <ToggleButton value="mobile">
              <MobileIcon sx={{ fontSize: 18, mr: 0.5 }} />
              Mobile
            </ToggleButton>
          </ToggleButtonGroup>

          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && onViewChange(value)}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiToggleButton-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                '&.Mui-selected': {
                  bgcolor: 'white',
                  color: '#27272a',
                  '&:hover': { bgcolor: '#f4f4f5' },
                },
                '&:hover': { color: 'white' },
              },
            }}
          >
            <ToggleButton value="student">Student View</ToggleButton>
            <ToggleButton value="instructor">Instructor View</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Right - Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onEdit && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Edit
            </Button>
          )}
          {onShare && (
            <IconButton onClick={onShare} sx={{ color: 'white' }}>
              <ShareIcon />
            </IconButton>
          )}
          {onPublish && (
            <Button variant="contained" color="success" startIcon={<PublishIcon />} onClick={onPublish}>
              Publish
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PreviewHeader;
export type { DeviceType, ViewMode };
