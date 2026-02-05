import React from 'react';
import { Box, Paper, Typography, TextField } from '@mui/material';
import ImageUpload from './ImageUpload';

interface MediaData {
  thumbnail: string | null;
  thumbnailFile: File | null;
  banner: string | null;
  bannerFile: File | null;
  promoVideoUrl: string;
}

interface MediaSectionProps {
  data: MediaData;
  onChange: (data: MediaData) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ data, onChange }) => {
  const handleThumbnailChange = (file: File | null, preview: string | null) => {
    onChange({ ...data, thumbnailFile: file, thumbnail: preview });
  };

  const handleBannerChange = (file: File | null, preview: string | null) => {
    onChange({ ...data, bannerFile: file, banner: preview });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Section Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          Course Media
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add visual elements to attract learners
        </Typography>
      </Box>

      {/* Course Thumbnail */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Course Thumbnail <Typography component="span" color="error.main">*</Typography>
        </Typography>
        <ImageUpload
          value={data.thumbnail}
          onChange={handleThumbnailChange}
          hint="PNG, JPG or WEBP"
          recommendedSize="1280x720px"
          aspectRatio="16/9"
        />
      </Box>

      {/* Course Banner */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Course Banner (Optional)
        </Typography>
        <ImageUpload
          value={data.banner}
          onChange={handleBannerChange}
          hint="PNG, JPG or WEBP"
          recommendedSize="1920x400px"
          aspectRatio="1920/400"
        />
      </Box>

      {/* Promotional Video URL */}
      <Box>
        <TextField
          fullWidth
          label="Promotional Video URL (Optional)"
          placeholder="https://www.youtube.com/watch?v=..."
          value={data.promoVideoUrl}
          onChange={(e) => onChange({ ...data, promoVideoUrl: e.target.value })}
          helperText="A short video introducing your course (YouTube or Vimeo link)"
        />
      </Box>
    </Paper>
  );
};

export default MediaSection;
export type { MediaData };
