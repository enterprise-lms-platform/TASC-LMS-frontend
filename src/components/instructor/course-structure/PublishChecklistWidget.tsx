import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Check as CheckIcon, Circle as CircleIcon } from '@mui/icons-material';

interface ChecklistItem {
  id: string;
  text: string;
  complete: boolean;
}

interface PublishChecklistWidgetProps {
  items: ChecklistItem[];
}

const defaultItems: ChecklistItem[] = [
  { id: '1', text: 'Course info complete', complete: true },
  { id: '2', text: 'Thumbnail uploaded', complete: true },
  { id: '3', text: 'At least 5 lessons', complete: true },
  { id: '4', text: 'Pricing configured', complete: true },
  { id: '5', text: 'All modules published', complete: false },
  { id: '6', text: 'Preview video added', complete: false },
];

const PublishChecklistWidget: React.FC<PublishChecklistWidgetProps> = ({ items = defaultItems }) => {
  const completedCount = items.filter((i) => i.complete).length;
  const totalCount = items.length;

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Publish Checklist</Typography>
        <Typography variant="body2" fontWeight={600} color="success.main">
          {completedCount}/{totalCount}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: item.complete ? 'success.main' : 'grey.200',
                color: item.complete ? 'white' : 'grey.500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.complete ? <CheckIcon sx={{ fontSize: 14 }} /> : <CircleIcon sx={{ fontSize: 8 }} />}
            </Box>
            <Typography
              variant="body2"
              color={item.complete ? 'text.secondary' : 'text.primary'}
              sx={{ textDecoration: item.complete ? 'line-through' : 'none' }}
            >
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PublishChecklistWidget;
export type { ChecklistItem };
