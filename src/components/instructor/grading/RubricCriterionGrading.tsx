import React from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';

export interface CriterionLevel {
  key: 'excellent' | 'good' | 'satisfactory' | 'needsWork';
  name: string;
  points: number;
  color: string;
}

export interface GradingCriterion {
  id: string;
  name: string;
  maxPoints: number;
  selectedLevel: string | null;
  score: number;
  levels: CriterionLevel[];
}

interface RubricCriterionGradingProps {
  criterion: GradingCriterion;
  onSelectLevel: (levelKey: string) => void;
  onScoreChange: (score: number) => void;
}

const levelColors: Record<string, { border: string; bg: string }> = {
  excellent: { border: '#10b981', bg: '#d1fae5' },
  good: { border: '#3b82f6', bg: '#dbeafe' },
  satisfactory: { border: '#f59e0b', bg: '#fef3c7' },
  needsWork: { border: '#ef4444', bg: '#fee2e2' },
};

const RubricCriterionGrading: React.FC<RubricCriterionGradingProps> = ({
  criterion,
  onSelectLevel,
  onScoreChange,
}) => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
          px: 2,
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {criterion.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {criterion.score}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            / {criterion.maxPoints}
          </Typography>
        </Box>
      </Box>

      {/* Levels */}
      <Box
        sx={{
          p: 1.5,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
        }}
      >
        {criterion.levels.map((level) => {
          const isSelected = criterion.selectedLevel === level.key;
          const colors = levelColors[level.key];
          return (
            <Paper
              key={level.key}
              elevation={0}
              onClick={() => onSelectLevel(level.key)}
              sx={{
                p: 1,
                textAlign: 'center',
                cursor: 'pointer',
                border: 2,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'rgba(255, 164, 36, 0.1)' : 'white',
                borderRadius: 1,
                borderTop: `3px solid ${colors.border}`,
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.light' },
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.primary"
                display="block"
                sx={{ mb: 0.25 }}
              >
                {level.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {level.points} pts
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Quick Score Input */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          Custom Score:
        </Typography>
        <TextField
          type="number"
          size="small"
          value={criterion.score}
          onChange={(e) => onScoreChange(Number(e.target.value))}
          inputProps={{ min: 0, max: criterion.maxPoints }}
          sx={{
            width: 60,
            '& .MuiInputBase-input': {
              textAlign: 'center',
              fontWeight: 600,
              p: 0.5,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default RubricCriterionGrading;
