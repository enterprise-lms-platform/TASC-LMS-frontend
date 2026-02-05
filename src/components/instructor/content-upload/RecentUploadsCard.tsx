import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { VideoFile as VideoIcon, Description as DocIcon, ViewInAr as ScormIcon } from '@mui/icons-material';

interface RecentUploadItem {
  id: string;
  name: string;
  type: 'video' | 'document' | 'scorm';
  time: string;
}

interface RecentUploadsCardProps {
  uploads: RecentUploadItem[];
  onViewAll?: () => void;
}

const iconMap = {
  video: { icon: <VideoIcon fontSize="small" />, bg: '#dbeafe', color: '#3b82f6' },
  document: { icon: <DocIcon fontSize="small" />, bg: '#d1fae5', color: '#10b981' },
  scorm: { icon: <ScormIcon fontSize="small" />, bg: '#ede9fe', color: '#8b5cf6' },
};

const RecentUploadsCard: React.FC<RecentUploadsCardProps> = ({ uploads, onViewAll }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Recent Uploads</Typography>
        {onViewAll && (
          <Button size="small" onClick={onViewAll}>
            View All
          </Button>
        )}
      </Box>
      <Box sx={{ p: 2 }}>
        {uploads.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            No recent uploads
          </Typography>
        ) : (
          uploads.map((upload) => {
            const config = iconMap[upload.type];
            return (
              <Box
                key={upload.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: config.bg,
                    color: config.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {config.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {upload.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {upload.time}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default RecentUploadsCard;
export type { RecentUploadItem };
