import React from 'react';
import { Box, Typography, LinearProgress, IconButton } from '@mui/material';
import {
  VideoFile as VideoIcon,
  Description as DocIcon,
  ViewInAr as ScormIcon,
  Close as CloseIcon,
  Refresh as RetryIcon,
  CheckCircle as CompleteIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

type UploadStatus = 'uploading' | 'complete' | 'error';

interface UploadProgressProps {
  fileName: string;
  fileSize: string;
  fileType: 'video' | 'document' | 'scorm';
  progress: number;
  status: UploadStatus;
  onCancel?: () => void;
  onRetry?: () => void;
}

const iconMap = {
  video: <VideoIcon />,
  document: <DocIcon />,
  scorm: <ScormIcon />,
};

const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  fileSize,
  fileType,
  progress,
  status,
  onCancel,
  onRetry,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'success.main';
      case 'error': return 'error.main';
      default: return 'info.main';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'complete': return 'success';
      case 'error': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        p: 2,
        mb: 1.5,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: getStatusColor(),
          borderRadius: '4px 0 0 4px',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: status === 'complete' ? 'success.light' : status === 'error' ? 'error.light' : 'info.light',
            color: getStatusColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {iconMap[fileType]}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} noWrap>
            {fileName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fileSize}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {status === 'error' && onRetry && (
            <IconButton size="small" onClick={onRetry} sx={{ color: 'text.secondary' }}>
              <RetryIcon fontSize="small" />
            </IconButton>
          )}
          {status === 'uploading' && onCancel && (
            <IconButton size="small" onClick={onCancel} sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          {status === 'complete' && (
            <CompleteIcon sx={{ color: 'success.main' }} />
          )}
          {status === 'error' && (
            <ErrorIcon sx={{ color: 'error.main' }} />
          )}
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={getProgressColor()}
        sx={{ height: 8, borderRadius: 1, mb: 1 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color={status === 'error' ? 'error.main' : status === 'complete' ? 'success.main' : 'text.secondary'}>
          {status === 'uploading' && `Uploading... ${progress}%`}
          {status === 'complete' && 'Upload complete'}
          {status === 'error' && 'Upload failed - Click retry'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {status === 'uploading' && 'Remaining: 2m 15s'}
        </Typography>
      </Box>
    </Box>
  );
};

export default UploadProgress;
export type { UploadStatus };
