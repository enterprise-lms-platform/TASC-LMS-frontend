import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { TableChart as RubricIcon, Fullscreen as ExpandIcon } from '@mui/icons-material';
import RubricCriterionGrading from './RubricCriterionGrading';
import type { GradingCriterion } from './RubricCriterionGrading';
import { formatGrade, getGradeColor, createDefaultGradingConfig } from '../../../utils/gradingUtils';
import type { GradingConfig } from '../../../utils/gradingUtils';

interface RubricPanelProps {
  criteria: GradingCriterion[];
  onSelectLevel: (criterionId: string, levelKey: string) => void;
  onScoreChange: (criterionId: string, score: number) => void;
  gradingConfig?: GradingConfig;
}

const RubricPanel: React.FC<RubricPanelProps> = ({
  criteria,
  onSelectLevel,
  onScoreChange,
  gradingConfig,
}) => {
  const config = gradingConfig ?? createDefaultGradingConfig();
  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxScore = criteria.reduce((sum, c) => sum + c.maxPoints, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const gradeDisplay = formatGrade(percentage, config);
  const _gradeColor = getGradeColor(percentage, config);
  void _gradeColor;

  return (
    <Box
      sx={{
        width: 400,
        bgcolor: 'white',
        borderLeft: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, px: 2.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <RubricIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            Grading Rubric
          </Typography>
          <IconButton size="small">
            <ExpandIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Score Summary */}
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            borderRadius: 1,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {totalScore}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              / {maxScore} points
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body1" fontWeight={600}>
              {percentage}%
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: config.gradingScale === 'pass_fail' ? '0.75rem' : '1.25rem',
            }}
          >
            {gradeDisplay}
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {criteria.map((criterion) => (
          <RubricCriterionGrading
            key={criterion.id}
            criterion={criterion}
            onSelectLevel={(levelKey) => onSelectLevel(criterion.id, levelKey)}
            onScoreChange={(score) => onScoreChange(criterion.id, score)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RubricPanel;
