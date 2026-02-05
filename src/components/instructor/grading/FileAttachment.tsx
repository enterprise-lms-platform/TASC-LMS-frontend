import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  FolderZip as ZipIcon,
  Code as CodeIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

export interface FileData {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'zip' | 'code';
  uploadedAt?: string;
}

interface FileAttachmentProps {
  file: FileData;
  onView?: () => void;
  onDownload?: () => void;
}

const getFileIcon = (type: string) => {
  const config: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
    pdf: { icon: <PdfIcon />, bg: '#fee2e2', color: '#ef4444' },
    doc: { icon: <DocIcon />, bg: '#dbeafe', color: '#3b82f6' },
    zip: { icon: <ZipIcon />, bg: '#fef3c7', color: '#f59e0b' },
    code: { icon: <CodeIcon />, bg: '#ede9fe', color: '#8b5cf6' },
  };
  return config[type] || config.doc;
};

const FileAttachment: React.FC<FileAttachmentProps> = ({ file, onView, onDownload }) => {
  const fileStyle = getFileIcon(file.type);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.light',
          bgcolor: 'white',
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          bgcolor: fileStyle.bg,
          color: fileStyle.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {fileStyle.icon}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500} color="text.primary">
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {file.size}
          {file.uploadedAt && ` • ${file.uploadedAt}`}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton size="small" onClick={onView} sx={{ color: 'text.secondary' }}>
          <ViewIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={onDownload} sx={{ color: 'text.secondary' }}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FileAttachment;
