import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Switch,
  Button,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayCircleOutline as VideoIcon,
  Description as DocIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  ViewInAr as ScormIcon,
  CellTower as LiveIcon,
  Code as HtmlIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import type { LessonType } from './LessonItem';

interface AddLessonModalProps {
  open: boolean;
  moduleTitle: string;
  onClose: () => void;
  onSave: (data: LessonFormData) => void;
}

interface LessonFormData {
  title: string;
  type: LessonType;
  description: string;
  isFreePreview: boolean;
}

const typeOptions: { value: LessonType; label: string; hint: string; icon: React.ReactNode; color: string }[] = [
  { value: 'video', label: 'Video', hint: 'Upload a video file', icon: <VideoIcon />, color: '#3b82f6' },
  { value: 'document', label: 'Document', hint: 'Upload PDF, DOCX, PPTX', icon: <DocIcon />, color: '#10b981' },
  { value: 'quiz', label: 'Quiz', hint: 'Build a quiz with questions', icon: <QuizIcon />, color: '#8b5cf6' },
  { value: 'assignment', label: 'Assignment', hint: 'Create a graded assignment', icon: <AssignmentIcon />, color: '#f59e0b' },
  { value: 'scorm', label: 'SCORM', hint: 'Upload a SCORM package', icon: <ScormIcon />, color: '#ef4444' },
  { value: 'livestream', label: 'Livestream', hint: 'Schedule a live session', icon: <LiveIcon />, color: '#f97316' },
  { value: 'html', label: 'HTML / Text', hint: 'Rich text content', icon: <HtmlIcon />, color: '#3f3f46' },
];

const nextStepLabel: Record<LessonType, string> = {
  video: 'Save & Upload Video',
  document: 'Save & Upload Document',
  scorm: 'Save & Upload SCORM',
  quiz: 'Save & Build Quiz',
  assignment: 'Save & Create Assignment',
  livestream: 'Save & Schedule Session',
  html: 'Save Lesson',
};

const defaultFormData: LessonFormData = {
  title: '',
  type: 'video',
  description: '',
  isFreePreview: false,
};

const AddLessonModal: React.FC<AddLessonModalProps> = ({ open, moduleTitle, onClose, onSave }) => {
  const [formData, setFormData] = useState<LessonFormData>(defaultFormData);

  const handleChange = (field: keyof LessonFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave(formData);
      setFormData(defaultFormData);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const selectedType = typeOptions.find((t) => t.value === formData.type);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Add New Lesson
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adding to: {moduleTitle}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'grey.100' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Lesson Title"
            required
            fullWidth
            placeholder="e.g., Introduction to React Hooks"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            helperText="A clear title for this lesson"
          />

          {/* Content Type Selector */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Content Type
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1 }}>
              {typeOptions.map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => handleChange('type', opt.value)}
                  sx={{
                    p: 1.5,
                    borderRadius: '0.75rem',
                    border: 2,
                    borderColor: formData.type === opt.value ? opt.color : 'grey.200',
                    bgcolor: formData.type === opt.value ? `${opt.color}10` : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: opt.color,
                      bgcolor: `${opt.color}08`,
                    },
                  }}
                >
                  <Box sx={{ color: formData.type === opt.value ? opt.color : 'grey.500', '& svg': { fontSize: 22 } }}>
                    {opt.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={formData.type === opt.value ? 600 : 500}
                    color={formData.type === opt.value ? 'text.primary' : 'text.secondary'}
                    textAlign="center"
                  >
                    {opt.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <TextField
            label="Description"
            multiline
            rows={2}
            fullWidth
            placeholder="Brief description of this lesson's content..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          {/* Settings */}
          <Box sx={{ borderTop: 1, borderColor: 'grey.100', pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Free Preview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Allow non-enrolled users to access this lesson
                </Typography>
              </Box>
              <Switch
                checked={formData.isFreePreview}
                onChange={(e) => handleChange('isFreePreview', e.target.checked)}
              />
            </Box>
          </Box>

          {/* Next step hint */}
          {formData.type !== 'html' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: '0.75rem',
                bgcolor: `${selectedType?.color}08`,
                border: 1,
                borderColor: `${selectedType?.color}30`,
              }}
            >
              <Box sx={{ color: selectedType?.color, '& svg': { fontSize: 20 } }}>
                {selectedType?.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Next: {selectedType?.hint}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  You'll be taken to add content after saving this lesson
                </Typography>
              </Box>
              <ArrowIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button variant="outlined" onClick={handleClose} sx={{ borderColor: 'grey.300', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!formData.title.trim()}
          endIcon={formData.type !== 'html' ? <ArrowIcon /> : undefined}
        >
          {nextStepLabel[formData.type]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLessonModal;
export type { LessonFormData };
