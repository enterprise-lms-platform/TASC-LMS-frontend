import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Slider,
  Grid,
} from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

interface DueDateSectionProps {
  dueDate: string;
  onDueDateChange: (value: string) => void;
  dueTime: string;
  onDueTimeChange: (value: string) => void;
  availableFrom: string;
  onAvailableFromChange: (value: string) => void;
  availableFromTime: string;
  onAvailableFromTimeChange: (value: string) => void;
  allowLate: boolean;
  onAllowLateChange: (value: boolean) => void;
  lateCutoffDate: string;
  onLateCutoffDateChange: (value: string) => void;
  penaltyType: string;
  onPenaltyTypeChange: (value: string) => void;
  penaltyPercent: number;
  onPenaltyPercentChange: (value: number) => void;
}

const DueDateSection: React.FC<DueDateSectionProps> = ({
  dueDate,
  onDueDateChange,
  dueTime,
  onDueTimeChange,
  availableFrom,
  onAvailableFromChange,
  availableFromTime,
  onAvailableFromTimeChange,
  allowLate,
  onAllowLateChange,
  lateCutoffDate,
  onLateCutoffDateChange,
  penaltyType,
  onPenaltyTypeChange,
  penaltyPercent,
  onPenaltyPercentChange,
}) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ color: 'primary.main' }} />
          Due Date & Schedule
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set deadlines and availability windows
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Due Date & Available From */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Due Date <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="date"
                value={dueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                type="time"
                value={dueTime}
                onChange={(e) => onDueTimeChange(e.target.value)}
                sx={{ width: 140 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Students will see this deadline in their timezone
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Available From <Typography component="span" variant="caption" color="text.secondary">(Optional)</Typography>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="date"
                value={availableFrom}
                onChange={(e) => onAvailableFromChange(e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                type="time"
                value={availableFromTime}
                onChange={(e) => onAvailableFromTimeChange(e.target.value)}
                sx={{ width: 140 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              When students can start the assignment
            </Typography>
          </Grid>
        </Grid>

        {/* Late Submission Policy */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Late Submission Policy
        </Typography>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>Allow Late Submissions</Typography>
              <Typography variant="caption" color="text.secondary">
                Students can submit after the due date with penalties
              </Typography>
            </Box>
            <Switch
              checked={allowLate}
              onChange={(e) => onAllowLateChange(e.target.checked)}
              color="primary"
            />
          </Box>

          {allowLate && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>Late Cutoff Date</Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={lateCutoffDate}
                    onChange={(e) => onLateCutoffDateChange(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>Penalty Type</Typography>
                  <FormControl fullWidth size="small">
                    <Select value={penaltyType} onChange={(e) => onPenaltyTypeChange(e.target.value)}>
                      <MenuItem value="percentage">Percentage per day</MenuItem>
                      <MenuItem value="fixed">Fixed percentage</MenuItem>
                      <MenuItem value="none">No penalty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {penaltyType !== 'none' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Penalty: {penaltyPercent}% {penaltyType === 'percentage' ? 'per day' : 'total'}
                  </Typography>
                  <Slider
                    value={penaltyPercent}
                    onChange={(_, value) => onPenaltyPercentChange(value as number)}
                    min={0}
                    max={50}
                    step={5}
                    marks
                    sx={{ color: 'primary.main' }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">0%</Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={600}>{penaltyPercent}%</Typography>
                    <Typography variant="caption" color="text.secondary">50%</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DueDateSection;
