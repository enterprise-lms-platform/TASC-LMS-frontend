import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import {
  Info as InfoIcon,
  AccountTree as ProjectIcon,
  Description as EssayIcon,
  Code as CodeIcon,
  Slideshow as PresentationIcon,
  Search as ResearchIcon,
} from '@mui/icons-material';

type AssignmentType = 'project' | 'essay' | 'code' | 'presentation' | 'research';

const assignmentTypes: Array<{ type: AssignmentType; icon: React.ReactNode; label: string }> = [
  { type: 'project', icon: <ProjectIcon />, label: 'Project' },
  { type: 'essay', icon: <EssayIcon />, label: 'Essay' },
  { type: 'code', icon: <CodeIcon />, label: 'Code Submission' },
  { type: 'presentation', icon: <PresentationIcon />, label: 'Presentation' },
  { type: 'research', icon: <ResearchIcon />, label: 'Research' },
];

interface BasicInfoSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  module: string;
  onModuleChange: (value: string) => void;
  lesson: string;
  onLessonChange: (value: string) => void;
  assignmentType: AssignmentType;
  onTypeChange: (type: AssignmentType) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  onTitleChange,
  module,
  onModuleChange,
  lesson,
  onLessonChange,
  assignmentType,
  onTypeChange,
}) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon sx={{ color: 'primary.main' }} />
          Basic Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define the assignment title, description, and placement
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Assignment Title <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., Build a Custom React Hook Library"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <Typography variant="caption" color="text.secondary">
            Make it clear and descriptive (max 100 characters)
          </Typography>
        </Box>

        {/* Module & Lesson */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Course Module *</InputLabel>
              <Select value={module} onChange={(e) => onModuleChange(e.target.value)} label="Course Module *">
                <MenuItem value="">Select a module</MenuItem>
                <MenuItem value="m1">Module 1: Introduction</MenuItem>
                <MenuItem value="m2">Module 2: React Hooks</MenuItem>
                <MenuItem value="m3">Module 3: Advanced Patterns</MenuItem>
                <MenuItem value="m4">Module 4: Custom Hooks</MenuItem>
                <MenuItem value="m5">Module 5: Final Project</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Lesson (Optional)</InputLabel>
              <Select value={lesson} onChange={(e) => onLessonChange(e.target.value)} label="Lesson (Optional)">
                <MenuItem value="">Select a lesson</MenuItem>
                <MenuItem value="l1">Lesson 1: Introduction to Custom Hooks</MenuItem>
                <MenuItem value="l2">Lesson 2: Building Your First Hook</MenuItem>
                <MenuItem value="l3">Lesson 3: Advanced Hook Patterns</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Assignment Type */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Assignment Type
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {assignmentTypes.map((at) => (
              <Chip
                key={at.type}
                icon={at.icon as React.ReactElement}
                label={at.label}
                onClick={() => onTypeChange(at.type)}
                variant={assignmentType === at.type ? 'filled' : 'outlined'}
                sx={{
                  px: 1,
                  fontWeight: 500,
                  borderWidth: 2,
                  borderColor: assignmentType === at.type ? 'primary.main' : 'divider',
                  bgcolor: assignmentType === at.type ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                  color: assignmentType === at.type ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default BasicInfoSection;
export type { AssignmentType };
