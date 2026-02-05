import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import { Public as GlobeIcon } from '@mui/icons-material';

interface DateTimeSectionProps {
  date: string;
  time: string;
  timezone: string;
  duration: number;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
  onDurationChange: (minutes: number) => void;
}

const presetDurations = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

const timezones = [
  { value: 'Africa/Nairobi', label: 'East Africa Time (EAT) - UTC+3' },
  { value: 'Africa/Lagos', label: 'West Africa Time (WAT) - UTC+1' },
  { value: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST) - UTC+2' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'America/New_York', label: 'Eastern Time (ET) - UTC-5' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - UTC-8' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - UTC+0' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) - UTC+4' },
];

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  time,
  timezone,
  duration,
  onDateChange,
  onTimeChange,
  onTimezoneChange,
  onDurationChange,
}) => {
  const isCustomDuration = !presetDurations.some((d) => d.value === duration);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Date and Time */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="Start Time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Box>

      {/* Timezone Selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <GlobeIcon sx={{ color: 'text.disabled' }} />
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <Select value={timezone} onChange={(e) => onTimezoneChange(e.target.value)}>
            {timezones.map((tz) => (
              <MenuItem key={tz.value} value={tz.value}>
                {tz.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Duration */}
      <Box>
        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1.5 }}>
          Duration
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {presetDurations.map((preset) => (
            <Chip
              key={preset.value}
              label={preset.label}
              onClick={() => onDurationChange(preset.value)}
              sx={{
                border: 2,
                borderColor: duration === preset.value ? 'primary.main' : 'divider',
                bgcolor: duration === preset.value ? 'rgba(255, 164, 36, 0.1)' : 'white',
                color: duration === preset.value ? 'primary.main' : 'text.secondary',
                fontWeight: 500,
                '&:hover': { borderColor: 'primary.light' },
              }}
            />
          ))}
          <Chip
            label="Custom"
            onClick={() => onDurationChange(75)}
            sx={{
              border: 2,
              borderColor: isCustomDuration ? 'primary.main' : 'divider',
              bgcolor: isCustomDuration ? 'rgba(255, 164, 36, 0.1)' : 'white',
              color: isCustomDuration ? 'primary.main' : 'text.secondary',
              fontWeight: 500,
              '&:hover': { borderColor: 'primary.light' },
            }}
          />
        </Box>

        {isCustomDuration && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              type="number"
              size="small"
              value={duration}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              sx={{ width: 80 }}
              inputProps={{ min: 15, max: 480 }}
            />
            <Typography variant="body2" color="text.secondary">
              minutes
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DateTimeSection;
