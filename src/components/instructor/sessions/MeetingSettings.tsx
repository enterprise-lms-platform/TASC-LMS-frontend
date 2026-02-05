import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

interface MeetingSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface MeetingSettingsProps {
  settings: MeetingSetting[];
  onSettingChange: (key: string, enabled: boolean) => void;
}

const MeetingSettings: React.FC<MeetingSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {settings.map((setting) => (
        <Box
          key={setting.key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {setting.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {setting.description}
            </Typography>
          </Box>
          <Switch
            checked={setting.enabled}
            onChange={(e) => onSettingChange(setting.key, e.target.checked)}
            color="primary"
          />
        </Box>
      ))}
    </Box>
  );
};

export default MeetingSettings;
export type { MeetingSetting };
