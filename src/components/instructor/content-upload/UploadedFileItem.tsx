import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import {
  VideoFile as VideoIcon,
  Description as DocIcon,
  ViewInAr as ScormIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

type FileStatus = 'processing' | 'ready' | 'error';

interface UploadedFileItemProps {
  id: string;
  name: string;
  type: 'video' | 'document' | 'scorm';
  size: string;
  duration?: string;
  status: FileStatus;
  thumbnail?: string;
  onPreview?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const iconMap = {
  video: <VideoIcon sx={{ fontSize: 24 }} />,
  document: <DocIcon sx={{ fontSize: 24 }} />,
  scorm: <ScormIcon sx={{ fontSize: 24 }} />,
};

const statusConfig: Record<FileStatus, { label: string; bgcolor: string; color: string }> = {
  processing: { label: 'Processing', bgcolor: '#fef3c7', color: '#f59e0b' },
  ready: { label: 'Ready', bgcolor: '#d1fae5', color: '#10b981' },
  error: { label: 'Error', bgcolor: '#fee2e2', color: '#ef4444' },
};

const UploadedFileItem: React.FC<UploadedFileItemProps> = ({
  name,
  type,
  size,
  duration,
  status,
  thumbnail,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const statusInfo = statusConfig[status];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.light',
          bgcolor: 'white',
        },
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 60,
          borderRadius: 1,
          bgcolor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {thumbnail ? (
          <Box component="img" src={thumbnail} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Box sx={{ color: 'grey.500' }}>{iconMap[type]}</Box>
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={600} noWrap mb={0.5}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            {size}
          </Typography>
          {duration && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14 }} />
              {duration}
            </Typography>
          )}
        </Box>
      </Box>

      <Chip
        label={statusInfo.label}
        size="small"
        sx={{
          bgcolor: statusInfo.bgcolor,
          color: statusInfo.color,
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {onPreview && (
          <IconButton size="small" onClick={onPreview} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <PreviewIcon fontSize="small" />
          </IconButton>
        )}
        {onEdit && (
          <IconButton size="small" onClick={onEdit} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton size="small" onClick={onDelete} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default UploadedFileItem;
export type { FileStatus };
