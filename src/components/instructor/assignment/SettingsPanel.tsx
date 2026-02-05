import React from 'react';
import { Box, Paper, Typography, Switch } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

interface SettingOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface SettingsPanelProps {
  settings: SettingOption[];
  onToggle: (id: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onToggle }) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 2.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          Settings
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {settings.map((setting, index) => (
          <Box
            key={setting.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
              mb: index < settings.length - 1 ? 1 : 0,
            }}
          >
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {setting.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {setting.description}
              </Typography>
            </Box>
            <Switch
              checked={setting.enabled}
              onChange={() => onToggle(setting.id)}
              color="primary"
              size="small"
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SettingsPanel;
export type { SettingOption };
