import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';

interface LevelDescription {
  excellent: string;
  good: string;
  satisfactory: string;
  needsImprovement: string;
}

export interface RubricCriterionData {
  id: string;
  name: string;
  description: string;
  points: number;
  levels: LevelDescription;
}

interface RubricCriterionProps {
  criterion: RubricCriterionData;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (data: Partial<RubricCriterionData>) => void;
  onDelete: () => void;
}

const levelConfig = [
  { key: 'excellent', label: 'Excellent', color: 'success.main', percent: 100 },
  { key: 'good', label: 'Good', color: 'info.main', percent: 75 },
  { key: 'satisfactory', label: 'Satisfactory', color: 'warning.main', percent: 50 },
  { key: 'needsImprovement', label: 'Needs Improvement', color: 'error.main', percent: 25 },
] as const;

const RubricCriterion: React.FC<RubricCriterionProps> = ({
  criterion,
  expanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}) => {
  const handleLevelChange = (levelKey: keyof LevelDescription, value: string) => {
    onUpdate({
      levels: {
        ...criterion.levels,
        [levelKey]: value,
      },
    });
  };

  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        mb: 1.5,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          px: 2,
          bgcolor: 'grey.100',
          borderBottom: expanded ? 1 : 0,
          borderColor: 'divider',
        }}
      >
        <DragIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />
        
        <TextField
          value={criterion.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          variant="standard"
          placeholder="Criterion Name"
          InputProps={{ disableUnderline: true }}
          sx={{
            flex: 1,
            '& .MuiInputBase-input': { fontWeight: 600, color: 'text.primary' },
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type="number"
            value={criterion.points}
            onChange={(e) => onUpdate({ points: Number(e.target.value) })}
            size="small"
            sx={{ width: 70 }}
            InputProps={{
              sx: { fontSize: '0.875rem' },
            }}
          />
          <Typography variant="body2" color="text.secondary">pts</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={onToggleExpand}>
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
          <IconButton size="small" onClick={onDelete} sx={{ '&:hover': { color: 'error.main' } }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Description */}
          <TextField
            fullWidth
            placeholder="Describe what this criterion evaluates..."
            value={criterion.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            size="small"
            sx={{ mb: 2 }}
          />

          {/* Levels Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 1.5,
            }}
          >
            {levelConfig.map((level) => (
              <Paper
                key={level.key}
                elevation={0}
                sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: level.color }}>
                    {level.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ bgcolor: 'grey.100', px: 1, py: 0.25, borderRadius: 1 }}
                  >
                    {Math.round(criterion.points * level.percent / 100)} pts
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder={`Describe ${level.label.toLowerCase()} performance...`}
                  value={criterion.levels[level.key]}
                  onChange={(e) => handleLevelChange(level.key, e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.75rem' },
                  }}
                />
              </Paper>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default RubricCriterion;
