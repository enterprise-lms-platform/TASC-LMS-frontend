import React, { useCallback, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface ImageUploadProps {
  hint?: string;
  value?: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  aspectRatio?: string;
  recommendedSize?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  hint = 'PNG, JPG or WEBP',
  value,
  onChange,
  aspectRatio = '16/9',
  recommendedSize = '1280x720px',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleFile(files[0]);
      }
    },
    [onChange]
  );

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          aspectRatio,
          cursor: 'pointer',
          '&:hover .overlay': {
            opacity: 1,
          },
        }}
        onClick={handleClick}
      >
        <Box
          component="img"
          src={value}
          alt="Preview"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        >
          <IconButton
            size="small"
            sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </Box>
    );
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      sx={{
        border: 2,
        borderStyle: 'dashed',
        borderColor: isDragOver ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragOver ? 'rgba(255, 164, 36, 0.1)' : 'grey.50',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(255, 164, 36, 0.05)',
        },
      }}
    >
      <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        <Typography component="span" fontWeight={600} color="primary.main">
          Click to upload
        </Typography>{' '}
        or drag and drop
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hint} (Recommended: {recommendedSize})
      </Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default ImageUpload;
