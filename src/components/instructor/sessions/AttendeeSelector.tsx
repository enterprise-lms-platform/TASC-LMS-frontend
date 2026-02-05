import React from 'react';
import { Box, Typography, Paper, Radio } from '@mui/material';

export type AttendeeType = 'all' | 'module' | 'groups' | 'individual';

interface AttendeeOption {
  key: AttendeeType;
  label: string;
  description: string;
  count?: string;
}

interface AttendeeSelectorProps {
  selected: AttendeeType;
  onSelect: (type: AttendeeType) => void;
}

const options: AttendeeOption[] = [
  { key: 'all', label: 'All Enrolled Learners', description: 'Everyone enrolled in this course', count: '452 learners' },
  { key: 'module', label: 'Module Participants', description: 'Only learners who reached this module', count: '287 learners' },
  { key: 'groups', label: 'Specific Groups', description: 'Select specific learner groups' },
  { key: 'individual', label: 'Individual Selection', description: 'Choose specific learners' },
];

const AttendeeSelector: React.FC<AttendeeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {options.map((option) => (
        <Paper
          key={option.key}
          elevation={0}
          onClick={() => onSelect(option.key)}
          sx={{
            p: 2,
            border: 2,
            borderColor: selected === option.key ? 'primary.main' : 'divider',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            bgcolor: selected === option.key ? 'rgba(255, 164, 36, 0.05)' : 'white',
            transition: 'all 0.2s',
            '&:hover': { borderColor: 'primary.light' },
          }}
        >
          <Radio checked={selected === option.key} size="small" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {option.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.description}
            </Typography>
          </Box>
          {option.count && (
            <Typography variant="caption" fontWeight={600} color="primary.main">
              {option.count}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default AttendeeSelector;
