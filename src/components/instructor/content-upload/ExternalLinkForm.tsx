import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { Link as LinkIcon, Language as WebIcon } from '@mui/icons-material';

interface ExternalLinkFormProps {
  onAdd: (url: string) => void;
}

const ExternalLinkForm: React.FC<ExternalLinkFormProps> = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleAdd = () => {
    if (url.trim()) {
      onAdd(url);
      setUrl('');
      setShowPreview(false);
    }
  };

  const handlePreview = () => {
    if (url.trim()) {
      setShowPreview(true);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter YouTube, Vimeo, or website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" onClick={handlePreview} disabled={!url.trim()}>
          Preview
        </Button>
        <Button variant="contained" onClick={handleAdd} disabled={!url.trim()}>
          Add Link
        </Button>
      </Box>

      {showPreview && url && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: 120,
                height: 90,
                borderRadius: 1,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <WebIcon sx={{ fontSize: 32, color: 'grey.500' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} mb={0.5}>
                External Link Preview
              </Typography>
              <Typography variant="body2" color="primary" mb={1} sx={{ wordBreak: 'break-all' }}>
                {url}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'white',
                  borderRadius: 0.5,
                  color: 'text.secondary',
                }}
              >
                <WebIcon sx={{ fontSize: 14 }} />
                {url.includes('youtube') ? 'YouTube' : url.includes('vimeo') ? 'Vimeo' : 'External Website'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ExternalLinkForm;
