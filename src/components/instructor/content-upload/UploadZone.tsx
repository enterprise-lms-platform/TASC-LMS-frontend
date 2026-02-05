import React, { useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  VideoFile as VideoFileIcon,
  InsertDriveFile as FileIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import type { ContentType } from './UploadTypeSelector';

interface UploadZoneProps {
  type: ContentType;
  onFilesSelected: (files: File[]) => void;
}

const typeConfig: Record<ContentType, { title: string; formats: string; maxSize: string; accept: string; gradient: string }> = {
  video: {
    title: 'Drag & Drop Video Files Here',
    formats: 'MP4, WebM, MOV, AVI',
    maxSize: 'Maximum 2GB per file',
    accept: 'video/*',
    gradient: 'linear-gradient(135deg, #ffb74d, #f97316)',
  },
  document: {
    title: 'Drag & Drop Documents Here',
    formats: 'PDF, DOCX, PPTX, XLSX',
    maxSize: 'Maximum 50MB per file',
    accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  scorm: {
    title: 'Drag & Drop SCORM Package Here',
    formats: 'ZIP files only',
    maxSize: 'Maximum 500MB',
    accept: '.zip',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
  link: {
    title: 'Enter External URL',
    formats: 'YouTube, Vimeo, Website URLs',
    maxSize: '',
    accept: '',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
};

const UploadZone: React.FC<UploadZoneProps> = ({ type, onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = typeConfig[type];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  };

  if (type === 'link') return null;

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      sx={{
        border: 3,
        borderStyle: 'dashed',
        borderColor: isDragOver ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 6,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragOver ? 'rgba(255, 164, 36, 0.1)' : 'grey.50',
        transition: 'all 0.3s',
        transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(255, 164, 36, 0.05)',
        },
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={config.accept}
        multiple={type !== 'scorm'}
        hidden
      />

      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: config.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          color: 'white',
          boxShadow: 3,
        }}
      >
        <UploadIcon sx={{ fontSize: 36 }} />
      </Box>

      <Typography variant="h6" fontWeight={700} mb={0.5}>
        {config.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        or <Typography component="span" color="primary" fontWeight={600} sx={{ cursor: 'pointer' }}>click to browse</Typography> from your computer
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoFileIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          {config.formats}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          {config.maxSize}
        </Typography>
        {type !== 'scorm' && (
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            Multiple files supported
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UploadZone;
