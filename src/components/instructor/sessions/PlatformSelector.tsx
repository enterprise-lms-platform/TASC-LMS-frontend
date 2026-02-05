import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  Videocam as ZoomIcon,
  Groups as TeamsIcon,
  VideoCall as MeetIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export type Platform = 'zoom' | 'teams' | 'meet';

interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

const platforms: Array<{
  key: Platform;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  colors: { main: string; light: string };
}> = [
  {
    key: 'zoom',
    name: 'Zoom',
    icon: <ZoomIcon />,
    connected: true,
    colors: { main: '#2d8cff', light: '#e8f4ff' },
  },
  {
    key: 'teams',
    name: 'Microsoft Teams',
    icon: <TeamsIcon />,
    connected: true,
    colors: { main: '#6264a7', light: '#ecedf8' },
  },
  {
    key: 'meet',
    name: 'Google Meet',
    icon: <MeetIcon />,
    connected: false,
    colors: { main: '#00897b', light: '#e0f2f1' },
  },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onSelect }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {platforms.map((platform) => {
        const isSelected = selected === platform.key;
        return (
          <Paper
            key={platform.key}
            elevation={0}
            onClick={() => onSelect(platform.key)}
            sx={{
              p: 3,
              border: 2,
              borderColor: isSelected ? platform.colors.main : 'divider',
              borderRadius: 2,
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              bgcolor: isSelected ? platform.colors.light : 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                bgcolor: platform.colors.main,
              },
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
          >
            {/* Selection check */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: platform.colors.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSelected ? 1 : 0,
                transform: isSelected ? 'scale(1)' : 'scale(0)',
                transition: 'all 0.3s',
              }}
            >
              <CheckIcon sx={{ fontSize: 14 }} />
            </Box>

            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: platform.colors.light,
                color: platform.colors.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
                fontSize: 28,
              }}
            >
              {platform.icon}
            </Box>

            {/* Name */}
            <Typography variant="body1" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
              {platform.name}
            </Typography>

            {/* Status */}
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                color: platform.connected ? 'success.main' : 'text.disabled',
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: platform.connected ? 'success.main' : 'grey.400',
                }}
              />
              {platform.connected ? 'Connected' : 'Not connected'}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default PlatformSelector;
