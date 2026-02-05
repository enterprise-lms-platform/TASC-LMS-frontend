import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Visibility as PreviewIcon } from '@mui/icons-material';

interface PreviewItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}

interface AssignmentPreviewCardProps {
  items: PreviewItem[];
  onPreview: () => void;
}

const AssignmentPreviewCard: React.FC<AssignmentPreviewCardProps> = ({ items, onPreview }) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Preview
        </Typography>
        <Button
          size="small"
          startIcon={<PreviewIcon />}
          onClick={onPreview}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Full Preview
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              py: 1.5,
              borderBottom: index < items.length - 1 ? 1 : 0,
              borderColor: 'grey.100',
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: item.iconBg,
                color: item.iconColor,
                fontSize: 16,
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default AssignmentPreviewCard;
