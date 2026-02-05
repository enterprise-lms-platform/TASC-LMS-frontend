import React, { useMemo } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { ChevronLeft as PrevIcon, ChevronRight as NextIcon } from '@mui/icons-material';

interface CalendarPreviewProps {
  selectedDate: string;
  sessionDates?: string[];
  onDateChange: (date: string) => void;
}

const CalendarPreview: React.FC<CalendarPreviewProps> = ({
  selectedDate,
  sessionDates = [],
  onDateChange,
}) => {
  const [viewMonth, setViewMonth] = React.useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return { month: d.getMonth(), year: d.getFullYear() };
  });

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewMonth.year, viewMonth.month, 1);
    const lastDay = new Date(viewMonth.year, viewMonth.month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(viewMonth.year, viewMonth.month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(viewMonth.year, viewMonth.month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(viewMonth.year, viewMonth.month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(viewMonth.year, viewMonth.month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewMonth]);

  const monthName = new Date(viewMonth.year, viewMonth.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

  const navigate = (direction: -1 | 1) => {
    setViewMonth((prev) => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      return { month: newMonth, year: newYear };
    });
  };

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          {monthName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(-1)}>
            <PrevIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(1)}>
            <NextIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ p: 2 }}>
        {/* Weekdays */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
          {weekdays.map((day, i) => (
            <Typography
              key={i}
              variant="caption"
              fontWeight={600}
              color="text.disabled"
              sx={{ textAlign: 'center', py: 0.5 }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Days */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {calendarDays.map((day, index) => {
            const dateStr = formatDateStr(day.date);
            const isSelected = dateStr === selectedDate;
            const isToday = day.date.getTime() === today.getTime();
            const hasSession = sessionDates.includes(dateStr);

            return (
              <Box
                key={index}
                onClick={() => day.isCurrentMonth && onDateChange(dateStr)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  cursor: day.isCurrentMonth ? 'pointer' : 'default',
                  position: 'relative',
                  fontSize: '0.875rem',
                  fontWeight: isSelected || isToday ? 600 : 400,
                  color: !day.isCurrentMonth
                    ? 'text.disabled'
                    : isSelected
                    ? 'white'
                    : 'text.secondary',
                  bgcolor: isSelected
                    ? 'primary.main'
                    : isToday
                    ? 'grey.200'
                    : 'transparent',
                  '&:hover': day.isCurrentMonth
                    ? { bgcolor: isSelected ? 'primary.main' : 'grey.100' }
                    : {},
                  transition: 'all 0.2s',
                }}
              >
                {day.date.getDate()}
                {hasSession && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: isSelected ? 'white' : '#ef4444',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarPreview;
