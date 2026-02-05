import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Check as CheckIcon, RadioButtonUnchecked as UncheckedIcon } from '@mui/icons-material';

interface ChecklistItem {
  id: string;
  label: string;
  complete: boolean;
}

interface ChecklistWidgetProps {
  items: ChecklistItem[];
}

const ChecklistWidget: React.FC<ChecklistWidgetProps> = ({ items }) => {
  const completedCount = items.filter((i) => i.complete).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Completion Checklist
        </Typography>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: progress === 100 ? 'success.main' : 'text.secondary' }}
        >
          {completedCount}/{items.length} complete
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: item.complete ? 'success.main' : 'grey.200',
                color: item.complete ? 'white' : 'text.disabled',
              }}
            >
              {item.complete ? (
                <CheckIcon sx={{ fontSize: 14 }} />
              ) : (
                <UncheckedIcon sx={{ fontSize: 14 }} />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: item.complete ? 'text.secondary' : 'text.primary',
                textDecoration: item.complete ? 'line-through' : 'none',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ChecklistWidget;
export type { ChecklistItem };
