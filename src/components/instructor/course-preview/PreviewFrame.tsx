import React from 'react';
import { Box, Paper } from '@mui/material';
import type { DeviceType } from './PreviewHeader';

interface PreviewFrameProps {
  deviceType: DeviceType;
  children: React.ReactNode;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ deviceType, children }) => {
  const getFrameStyles = () => {
    switch (deviceType) {
      case 'tablet':
        return {
          width: 768,
          minHeight: 1024,
          border: '16px solid #27272a',
          borderRadius: 6,
        };
      case 'mobile':
        return {
          width: 375,
          minHeight: 812,
          border: '12px solid #27272a',
          borderRadius: '40px',
          position: 'relative' as const,
          '&::before': {
            content: '""',
            display: 'block',
            width: 150,
            height: 30,
            bgcolor: '#27272a',
            margin: '0 auto',
            borderRadius: '0 0 20px 20px',
            position: 'relative',
            top: -12,
          },
        };
      default: // desktop
        return {
          width: '100%',
          maxWidth: 1400,
          minHeight: 'calc(100vh - 200px)',
        };
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        p: 3,
        bgcolor: '#e4e4e7',
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          ...getFrameStyles(),
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1, overflowY: 'auto' }}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default PreviewFrame;
