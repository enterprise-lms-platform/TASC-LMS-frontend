import React from 'react';
import { Box, Typography, Switch, Chip, TextField, Radio } from '@mui/material';

interface RecurringSettingsProps {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  selectedDays: number[];
  endType: 'date' | 'occurrences';
  endDate: string;
  occurrences: number;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  onDaysChange: (days: number[]) => void;
  onEndTypeChange: (type: 'date' | 'occurrences') => void;
  onEndDateChange: (date: string) => void;
  onOccurrencesChange: (count: number) => void;
}

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const frequencies = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
] as const;

const RecurringSettings: React.FC<RecurringSettingsProps> = ({
  enabled,
  frequency,
  selectedDays,
  endType,
  endDate,
  occurrences,
  onEnabledChange,
  onFrequencyChange,
  onDaysChange,
  onEndTypeChange,
  onEndDateChange,
  onOccurrencesChange,
}) => {
  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      onDaysChange(selectedDays.filter((d) => d !== index));
    } else {
      onDaysChange([...selectedDays, index]);
    }
  };

  return (
    <Box>
      {/* Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1,
          mb: enabled ? 2 : 0,
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Recurring Session
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Schedule this session to repeat automatically
          </Typography>
        </Box>
        <Switch checked={enabled} onChange={(e) => onEnabledChange(e.target.checked)} color="primary" />
      </Box>

      {enabled && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          {/* Frequency */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              Frequency
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {frequencies.map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  onClick={() => onFrequencyChange(f.key)}
                  sx={{
                    border: 2,
                    borderColor: frequency === f.key ? 'primary.main' : 'divider',
                    bgcolor: frequency === f.key ? 'rgba(255, 164, 36, 0.1)' : 'white',
                    color: frequency === f.key ? 'primary.main' : 'text.secondary',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Day Selector (for weekly) */}
          {frequency === 'weekly' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Repeat on
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {days.map((day, index) => (
                  <Box
                    key={index}
                    onClick={() => toggleDay(index)}
                    sx={{
                      width: 40,
                      height: 40,
                      border: 2,
                      borderColor: selectedDays.includes(index) ? 'primary.main' : 'divider',
                      bgcolor: selectedDays.includes(index) ? 'primary.main' : 'white',
                      color: selectedDays.includes(index) ? 'white' : 'text.secondary',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.light' },
                    }}
                  >
                    {day}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* End Options */}
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              Ends
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                onClick={() => onEndTypeChange('date')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  border: 1,
                  borderColor: endType === 'date' ? 'primary.main' : 'divider',
                  bgcolor: endType === 'date' ? 'rgba(255, 164, 36, 0.05)' : 'white',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              >
                <Radio checked={endType === 'date'} size="small" />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  On date
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  sx={{ width: 160 }}
                  InputProps={{ sx: { fontSize: '0.875rem' } }}
                />
              </Box>
              <Box
                onClick={() => onEndTypeChange('occurrences')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  border: 1,
                  borderColor: endType === 'occurrences' ? 'primary.main' : 'divider',
                  bgcolor: endType === 'occurrences' ? 'rgba(255, 164, 36, 0.05)' : 'white',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              >
                <Radio checked={endType === 'occurrences'} size="small" />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  After
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={occurrences}
                  onChange={(e) => onOccurrencesChange(Number(e.target.value))}
                  sx={{ width: 70 }}
                  inputProps={{ min: 1, max: 52 }}
                />
                <Typography variant="body2" color="text.secondary">
                  occurrences
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RecurringSettings;
