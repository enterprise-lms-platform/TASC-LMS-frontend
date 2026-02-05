import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import ToggleGroup from './ToggleGroup';

interface SettingsData {
  isPublic: boolean;
  selfEnrollment: boolean;
  certificate: boolean;
  discussions: boolean;
  sequential: boolean;
  enrollmentLimit: number | null;
  accessDuration: string;
  startDate: string;
  endDate: string;
}

interface SettingsSectionProps {
  data: SettingsData;
  onChange: (data: SettingsData) => void;
}

const accessDurationOptions = [
  { value: 'lifetime', label: 'Lifetime Access' },
  { value: '1-year', label: '1 Year' },
  { value: '6-months', label: '6 Months' },
  { value: '3-months', label: '3 Months' },
  { value: '1-month', label: '1 Month' },
];

const SettingsSection: React.FC<SettingsSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof SettingsData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Section Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          Course Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure visibility and access settings
        </Typography>
      </Box>

      {/* Toggle Settings */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
        <ToggleGroup
          label="Public Course"
          description="Make this course visible in the catalog"
          checked={data.isPublic}
          onChange={(checked) => handleChange('isPublic', checked)}
        />
        <ToggleGroup
          label="Allow Self-Enrollment"
          description="Learners can enroll without approval"
          checked={data.selfEnrollment}
          onChange={(checked) => handleChange('selfEnrollment', checked)}
        />
        <ToggleGroup
          label="Certificate on Completion"
          description="Issue certificate when course is completed"
          checked={data.certificate}
          onChange={(checked) => handleChange('certificate', checked)}
        />
        <ToggleGroup
          label="Enable Discussions"
          description="Allow learners to discuss course content"
          checked={data.discussions}
          onChange={(checked) => handleChange('discussions', checked)}
        />
        <ToggleGroup
          label="Sequential Learning"
          description="Learners must complete lessons in order"
          checked={data.sequential}
          onChange={(checked) => handleChange('sequential', checked)}
        />
      </Box>

      {/* Enrollment & Access */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <TextField
            fullWidth
            label="Enrollment Limit (Optional)"
            placeholder="Unlimited"
            type="number"
            value={data.enrollmentLimit || ''}
            onChange={(e) =>
              handleChange('enrollmentLimit', e.target.value ? parseInt(e.target.value) : null)
            }
            inputProps={{ min: 1 }}
          />
          <FormHelperText>Maximum number of learners</FormHelperText>
        </Box>

        <FormControl fullWidth>
          <InputLabel>Access Duration</InputLabel>
          <Select
            value={data.accessDuration}
            label="Access Duration"
            onChange={(e) => handleChange('accessDuration', e.target.value)}
          >
            {accessDurationOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Date Fields */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Box>
          <TextField
            fullWidth
            label="Start Date (Optional)"
            type="date"
            value={data.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <FormHelperText>When the course becomes available</FormHelperText>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="End Date (Optional)"
            type="date"
            value={data.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <FormHelperText>When enrollment closes</FormHelperText>
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsSection;
export type { SettingsData };
