import React from 'react';
import { Box, Typography, IconButton, Checkbox } from '@mui/material';
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  MoreVert as MoreIcon,
  PlayCircleOutline as VideoIcon,
  Description as DocIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  ViewInAr as ScormIcon,
  CellTower as LiveIcon,
  Code as HtmlIcon,
} from '@mui/icons-material';

type LessonType = 'video' | 'document' | 'quiz' | 'assignment' | 'scorm' | 'livestream' | 'html';

interface LessonData {
  id: string;
  title: string;
  type: LessonType;
  duration?: string;
  meta?: string;
  isComplete?: boolean;
  isFreePreview?: boolean;
}

interface LessonItemProps {
  lesson: LessonData;
  onEdit?: () => void;
  onPreview?: () => void;
  onMore?: () => void;
  onToggleComplete?: () => void;
}

const typeConfig: Record<LessonType, { icon: React.ReactNode; bg: string; color: string }> = {
  video: { icon: <VideoIcon />, bg: '#dbeafe', color: '#3b82f6' },
  document: { icon: <DocIcon />, bg: '#d1fae5', color: '#10b981' },
  quiz: { icon: <QuizIcon />, bg: '#ede9fe', color: '#8b5cf6' },
  assignment: { icon: <AssignmentIcon />, bg: '#fef3c7', color: '#f59e0b' },
  scorm: { icon: <ScormIcon />, bg: '#fee2e2', color: '#ef4444' },
  livestream: { icon: <LiveIcon />, bg: '#ffe0b2', color: '#f97316' },
  html: { icon: <HtmlIcon />, bg: '#e4e4e7', color: '#3f3f46' },
};

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  onEdit,
  onPreview,
  onMore,
  onToggleComplete,
}) => {
  const config = typeConfig[lesson.type];

  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        mb: 1,
        '&:last-child': { mb: 0 },
        '&:hover': { borderColor: 'primary.main' },
        '&:hover .lesson-actions': { opacity: 1 },
      }}
    >
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Drag Handle */}
        <Box sx={{ color: 'grey.400', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
          <DragIcon fontSize="small" />
        </Box>

        {/* Checkbox */}
        <Checkbox
          checked={lesson.isComplete}
          onChange={onToggleComplete}
          size="small"
          sx={{
            p: 0,
            color: 'grey.300',
            '&.Mui-checked': { color: 'success.main' },
          }}
        />

        {/* Type Icon */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: config.bg,
            color: config.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': { fontSize: 18 },
          }}
        >
          {config.icon}
        </Box>

        {/* Lesson Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {lesson.title}
            </Typography>
            {lesson.isFreePreview && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  bgcolor: '#dbeafe',
                  color: '#3b82f6',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                Free Preview
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 0.25 }}>
            <Typography variant="caption" color="text.secondary">
              {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
            </Typography>
            {lesson.duration && (
              <Typography variant="caption" color="text.secondary">
                {lesson.duration}
              </Typography>
            )}
            {lesson.meta && (
              <Typography variant="caption" color="text.secondary">
                {lesson.meta}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        <Box
          className="lesson-actions"
          sx={{ display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.2s' }}
        >
          <IconButton size="small" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onPreview}>
            <PreviewIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onMore}>
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonItem;
export type { LessonData, LessonType };
