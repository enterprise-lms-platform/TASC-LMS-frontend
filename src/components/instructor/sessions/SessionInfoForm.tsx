import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface SessionInfoFormProps {
  title: string;
  description: string;
  date: string;
  time: string;
  course: string;
  module: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onModuleChange: (value: string) => void;
}

const SessionInfoForm: React.FC<SessionInfoFormProps> = ({
  title,
  description,
  date,
  time,
  course,
  module,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onTimeChange,
  onCourseChange,
  onModuleChange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Session Title */}
      <TextField
        fullWidth
        label="Session Title"
        placeholder="e.g., Live Q&A: React Hooks Deep Dive"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
      />

      {/* Description */}
      <TextField
        fullWidth
        label="Description"
        placeholder="Describe what will be covered in this session..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        multiline
        minRows={3}
      />

      {/* Date and Time */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="Time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Box>

      {/* Course and Module */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select value={course} onChange={(e) => onCourseChange(e.target.value)} label="Course">
            <MenuItem value="react-advanced">Advanced React Development</MenuItem>
            <MenuItem value="react-basics">React Fundamentals</MenuItem>
            <MenuItem value="typescript">TypeScript Mastery</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Module (Optional)</InputLabel>
          <Select value={module} onChange={(e) => onModuleChange(e.target.value)} label="Module (Optional)">
            <MenuItem value="">None</MenuItem>
            <MenuItem value="module-1">Module 1: Introduction</MenuItem>
            <MenuItem value="module-2">Module 2: Hooks</MenuItem>
            <MenuItem value="module-3">Module 3: State Management</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SessionInfoForm;
