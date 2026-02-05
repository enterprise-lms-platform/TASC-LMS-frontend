import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import {
  Check as CheckIcon,
  PriorityHigh as WarningIcon,
  Circle as IncompleteIcon,
} from '@mui/icons-material';

type StatusType = 'complete' | 'incomplete' | 'warning';

interface StatusItem {
  id: string;
  label: string;
  status: StatusType;
}

interface CompletionStatusProps {
  status: 'draft' | 'published' | 'review';
  items: StatusItem[];
}

const statusBadgeColors: Record<string, { bgcolor: string; color: string }> = {
  draft: { bgcolor: '#fef3c7', color: '#f59e0b' },
  published: { bgcolor: '#d1fae5', color: '#10b981' },
  review: { bgcolor: '#dbeafe', color: '#3b82f6' },
};

const StatusIcon: React.FC<{ status: StatusType }> = ({ status }) => {
  const iconStyles = {
    complete: { bgcolor: '#d1fae5', color: '#10b981' },
    incomplete: { bgcolor: '#e4e4e7', color: '#71717a' },
    warning: { bgcolor: '#fef3c7', color: '#f59e0b' },
  };

  const style = iconStyles[status];

  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: style.bgcolor,
        color: style.color,
      }}
    >
      {status === 'complete' && <CheckIcon sx={{ fontSize: 14 }} />}
      {status === 'warning' && <WarningIcon sx={{ fontSize: 14 }} />}
      {status === 'incomplete' && <IncompleteIcon sx={{ fontSize: 8 }} />}
    </Box>
  );
};

const CompletionStatus: React.FC<CompletionStatusProps> = ({ status, items }) => {
  const badgeStyle = statusBadgeColors[status];

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography fontWeight={700} color="text.primary">
          Completion Status
        </Typography>
        <Chip
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          size="small"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            bgcolor: badgeStyle.bgcolor,
            color: badgeStyle.color,
          }}
        />
      </Box>

      {/* Status Items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
            }}
          >
            <StatusIcon status={item.status} />
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default CompletionStatus;
export type { StatusItem, StatusType };
