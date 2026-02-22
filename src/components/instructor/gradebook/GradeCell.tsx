import React from 'react';
import { Typography, TableCell } from '@mui/material';
import { formatGrade, getGradeColor } from '../../../utils/gradingUtils';
import type { GradingConfig } from '../../../utils/gradingUtils';

type GradeStatus = 'graded' | 'submitted' | 'pending' | 'missing';

interface GradeCellProps {
  earned: number | null;
  possible: number;
  gradingConfig: GradingConfig;
  status: GradeStatus;
  onClick: () => void;
  compact?: boolean;
}

const statusBg: Record<GradeStatus, string> = {
  graded: 'transparent',
  submitted: 'rgba(59, 130, 246, 0.06)',
  pending: 'rgba(245, 158, 11, 0.06)',
  missing: 'rgba(239, 68, 68, 0.06)',
};

const GradeCell: React.FC<GradeCellProps> = ({
  earned,
  possible,
  gradingConfig,
  status,
  onClick,
  compact = false,
}) => {
  if (earned === null) {
    return (
      <TableCell
        align="center"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          bgcolor: statusBg[status],
          '&:hover': { bgcolor: 'rgba(255, 164, 36, 0.08)' },
          p: compact ? 0.75 : 1,
          minWidth: 60,
        }}
      >
        <Typography variant="caption" color="text.disabled">
          {status === 'submitted' ? 'Review' : status === 'missing' ? '—' : '·'}
        </Typography>
      </TableCell>
    );
  }

  const pct = possible > 0 ? (earned / possible) * 100 : 0;
  const display = formatGrade(pct, gradingConfig);
  const color = getGradeColor(pct, gradingConfig);

  return (
    <TableCell
      align="center"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(255, 164, 36, 0.08)' },
        p: compact ? 0.75 : 1,
        minWidth: 60,
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ color }}>
        {display}
      </Typography>
      {!compact && (
        <Typography variant="caption" color="text.secondary" display="block">
          {earned}/{possible}
        </Typography>
      )}
    </TableCell>
  );
};

export default GradeCell;
export type { GradeStatus };
