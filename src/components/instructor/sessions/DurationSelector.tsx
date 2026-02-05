import React from 'react';
import { Box, Chip, TextField, Typography } from '@mui/material';

interface DurationSelectorProps {
  duration: number;
  onDurationChange: (minutes: number) => void;
}

const presetDurations = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

const DurationSelector: React.FC<DurationSelectorProps> = ({ duration, onDurationChange }) => {
  const isCustom = !presetDurations.some((d) => d.value === duration);

  return (
    <Box>
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
            borderColor: isCustom ? 'primary.main' : 'divider',
            bgcolor: isCustom ? 'rgba(255, 164, 36, 0.1)' : 'white',
            color: isCustom ? 'primary.main' : 'text.secondary',
            fontWeight: 500,
            '&:hover': { borderColor: 'primary.light' },
          }}
        />
      </Box>

      {isCustom && (
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
  );
};

export default DurationSelector;
