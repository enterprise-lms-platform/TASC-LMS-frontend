import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';

export interface SubmissionData {
  id: string;
  studentName: string;
  studentInitials: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'returned';
  score?: number;
  maxScore?: number;
  isLate?: boolean;
  previewText: string;
}

interface SubmissionItemProps {
  submission: SubmissionData;
  isActive: boolean;
  onClick: () => void;
}

const getStatusBadge = (status: 'pending' | 'graded' | 'returned') => {
  const config = {
    pending: { bg: '#fef3c7', color: '#f59e0b', label: 'Pending' },
    graded: { bg: '#d1fae5', color: '#10b981', label: 'Graded' },
    returned: { bg: '#dbeafe', color: '#3b82f6', label: 'Returned' },
  };
  return config[status];
};

const SubmissionItem: React.FC<SubmissionItemProps> = ({ submission, isActive, onClick }) => {
  const statusBadge = getStatusBadge(submission.status);

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'grey.100',
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderLeft: isActive ? '3px solid' : '3px solid transparent',
        borderLeftColor: isActive ? 'primary.main' : 'transparent',
        bgcolor: isActive ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
        opacity: submission.status === 'graded' ? 0.7 : 1,
        '&:hover': { bgcolor: 'grey.50' },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: '0.75rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          }}
        >
          {submission.studentInitials}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            noWrap
          >
            {submission.studentName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {submission.submittedAt}
            </Typography>
            {submission.isLate && (
              <Typography variant="caption" color="error.main" fontWeight={600}>
                Late
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 10,
              bgcolor: statusBadge.bg,
              color: statusBadge.color,
              fontSize: '0.625rem',
              fontWeight: 600,
            }}
          >
            {statusBadge.label}
          </Box>
          {submission.status === 'graded' && submission.score !== undefined && (
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {submission.score}/{submission.maxScore}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Preview */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4,
        }}
      >
        {submission.previewText}
      </Typography>
    </Box>
  );
};

export default SubmissionItem;
