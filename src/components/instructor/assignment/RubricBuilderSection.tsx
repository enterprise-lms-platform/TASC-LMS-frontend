import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { TableChart as RubricIcon, Add as AddIcon } from '@mui/icons-material';
import RubricCriterion from './RubricCriterion';
import type { RubricCriterionData } from './RubricCriterion';

interface RubricBuilderSectionProps {
  criteria: RubricCriterionData[];
  expandedCriterion: string | null;
  onToggleCriterion: (id: string) => void;
  onUpdateCriterion: (id: string, data: Partial<RubricCriterionData>) => void;
  onDeleteCriterion: (id: string) => void;
  onAddCriterion: () => void;
}

const RubricBuilderSection: React.FC<RubricBuilderSectionProps> = ({
  criteria,
  expandedCriterion,
  onToggleCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
  onAddCriterion,
}) => {
  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RubricIcon sx={{ color: 'primary.main' }} />
              Grading Rubric
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define criteria and performance levels for grading
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600} color="primary.main">
            Total: {totalPoints} points
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Criteria List */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Criteria ({criteria.length})
        </Typography>
        <Box sx={{ mb: 2 }}>
          {criteria.map((c) => (
            <RubricCriterion
              key={c.id}
              criterion={c}
              expanded={expandedCriterion === c.id}
              onToggleExpand={() => onToggleCriterion(c.id)}
              onUpdate={(data) => onUpdateCriterion(c.id, data)}
              onDelete={() => onDeleteCriterion(c.id)}
            />
          ))}
        </Box>

        {/* Add Criterion Button */}
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={onAddCriterion}
          sx={{
            p: 2,
            border: '2px dashed',
            borderColor: 'divider',
            color: 'text.secondary',
            fontWeight: 500,
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'rgba(255, 164, 36, 0.05)',
            },
          }}
        >
          Add Criterion
        </Button>
      </Box>
    </Paper>
  );
};

export default RubricBuilderSection;
