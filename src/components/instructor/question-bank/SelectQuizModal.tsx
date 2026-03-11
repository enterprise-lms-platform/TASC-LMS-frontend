import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Quiz as QuizIcon } from '@mui/icons-material';
import { useSessions, useCourses } from '../../../hooks/useCatalogue';

interface SelectQuizModalProps {
  open: boolean;
  onClose: () => void;
  selectedSessionId: number | null;
  selectedCount: number;
  onSessionSelect: (sessionId: number) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const SelectQuizModal: React.FC<SelectQuizModalProps> = ({
  open,
  onClose,
  selectedSessionId,
  selectedCount = 0,
  onSessionSelect,
  onConfirm,
  isSubmitting = false,
}) => {
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions({
    type: 'quiz',
    page_size: 100,
  });
  const { data: coursesData, isLoading: coursesLoading } = useCourses({
    page_size: 200,
  });

  const sessions = Array.isArray(sessionsData) ? sessionsData : [];
  const courses = coursesData?.results ?? [];
  const courseMap = useMemo(() => {
    const m: Record<number, string> = {};
    courses.forEach((c) => {
      m[c.id] = c.title ?? '';
    });
    return m;
  }, [courses]);

  const isLoading = sessionsLoading || coursesLoading;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuizIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Add to Quiz
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose a quiz session to add the selected questions to.
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : sessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No quiz sessions found. Create a quiz session in one of your courses first.
          </Typography>
        ) : (
          <List dense disablePadding>
            {sessions.map((s) => (
              <ListItemButton
                key={s.id}
                selected={selectedSessionId === s.id}
                onClick={() => onSessionSelect(s.id)}
              >
                <ListItemText
                  primary={s.title}
                  secondary={courseMap[s.course] ? `${courseMap[s.course]}` : `Course #${s.course}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={!selectedSessionId || isSubmitting || selectedCount === 0}
          sx={{ textTransform: 'none' }}
        >
          {isSubmitting ? 'Adding…' : 'Add Questions'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectQuizModal;
