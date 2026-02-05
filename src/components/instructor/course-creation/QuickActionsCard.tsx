import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import {
  CreateNewFolder as ModuleIcon,
  AddCircle as LessonIcon,
  Checklist as QuizIcon,
  Assignment as AssignmentIcon,
  VideoLibrary as VideoIcon,
  FileUpload as ScormIcon,
} from '@mui/icons-material';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickActionsCardProps {
  onAddModule?: () => void;
  onAddLesson?: () => void;
  onAddQuiz?: () => void;
  onAddAssignment?: () => void;
  onUploadVideo?: () => void;
  onImportScorm?: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onAddModule,
  onAddLesson,
  onAddQuiz,
  onAddAssignment,
  onUploadVideo,
  onImportScorm,
}) => {
  const actions: QuickAction[] = [
    { id: 'module', label: 'Add Module', icon: <ModuleIcon />, onClick: onAddModule || (() => {}) },
    { id: 'lesson', label: 'Add Lesson', icon: <LessonIcon />, onClick: onAddLesson || (() => {}) },
    { id: 'quiz', label: 'Add Quiz', icon: <QuizIcon />, onClick: onAddQuiz || (() => {}) },
    { id: 'assignment', label: 'Add Assignment', icon: <AssignmentIcon />, onClick: onAddAssignment || (() => {}) },
    { id: 'video', label: 'Upload Video', icon: <VideoIcon />, onClick: onUploadVideo || (() => {}) },
    { id: 'scorm', label: 'Import SCORM', icon: <ScormIcon />, onClick: onImportScorm || (() => {}) },
  ];

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      <Typography fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outlined"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{
              justifyContent: 'flex-start',
              py: 1.25,
              px: 2,
              bgcolor: 'grey.50',
              border: 1,
              borderColor: 'grey.200',
              color: 'text.secondary',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(255, 164, 36, 0.05)',
                borderColor: 'primary.main',
                color: 'primary.main',
              },
              '& .MuiButton-startIcon': {
                color: 'primary.main',
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default QuickActionsCard;
