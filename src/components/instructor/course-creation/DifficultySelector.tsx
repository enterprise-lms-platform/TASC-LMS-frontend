import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  SpaOutlined as BeginnerIcon,
  TrendingUp as IntermediateIcon,
  Rocket as AdvancedIcon,
} from '@mui/icons-material';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

const difficultyOptions: {
  level: DifficultyLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}[] = [
  {
    level: 'beginner',
    label: 'Beginner',
    description: 'No prior experience needed',
    icon: <BeginnerIcon />,
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  {
    level: 'intermediate',
    label: 'Intermediate',
    description: 'Some experience required',
    icon: <IntermediateIcon />,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  {
    level: 'advanced',
    label: 'Advanced',
    description: 'Expert-level content',
    icon: <AdvancedIcon />,
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {difficultyOptions.map((option) => {
        const isSelected = value === option.level;
        return (
          <Paper
            key={option.level}
            onClick={() => onChange(option.level)}
            elevation={0}
            sx={{
              flex: 1,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              border: 2,
              borderColor: isSelected ? option.color : 'grey.200',
              bgcolor: isSelected ? option.bgColor : 'transparent',
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: option.color,
              },
            }}
          >
            <Box
              sx={{
                fontSize: '1.5rem',
                mb: 1,
                color: option.color,
              }}
            >
              {option.icon}
            </Box>
            <Typography
              fontWeight={600}
              color="text.primary"
              sx={{ mb: 0.5 }}
            >
              {option.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.description}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default DifficultySelector;
export type { DifficultyLevel };
