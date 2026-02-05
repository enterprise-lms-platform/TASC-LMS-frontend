import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  PlayCircle as VideoIcon,
  Description as DocIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  ViewInAr as ScormIcon,
  CellTower as LiveIcon,
} from '@mui/icons-material';

type ContentType = 'video' | 'document' | 'quiz' | 'assignment' | 'scorm' | 'livestream';

interface QuickAddItem {
  type: ContentType;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  color: string;
}

const quickAddItems: QuickAddItem[] = [
  { type: 'video', label: 'Video', icon: <VideoIcon />, bgColor: '#dbeafe', color: '#3b82f6' },
  { type: 'document', label: 'Document', icon: <DocIcon />, bgColor: '#d1fae5', color: '#10b981' },
  { type: 'quiz', label: 'Quiz', icon: <QuizIcon />, bgColor: '#ede9fe', color: '#8b5cf6' },
  { type: 'assignment', label: 'Assignment', icon: <AssignmentIcon />, bgColor: '#fef3c7', color: '#f59e0b' },
  { type: 'scorm', label: 'SCORM', icon: <ScormIcon />, bgColor: '#fee2e2', color: '#ef4444' },
  { type: 'livestream', label: 'Livestream', icon: <LiveIcon />, bgColor: '#ffe0b2', color: '#f97316' },
];

interface QuickAddWidgetProps {
  onAdd: (type: ContentType) => void;
}

const QuickAddWidget: React.FC<QuickAddWidgetProps> = ({ onAdd }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography fontWeight={700}>Quick Add Content</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          {quickAddItems.map((item) => (
            <Grid size={6} key={item.type}>
              <Box
                onClick={() => onAdd(item.type)}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(255, 164, 36, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: item.bgColor,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default QuickAddWidget;
export type { ContentType };
