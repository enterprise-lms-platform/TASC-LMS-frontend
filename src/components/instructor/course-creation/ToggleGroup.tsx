import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

interface ToggleGroupProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: 'grey.50',
        borderRadius: 1,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'primary.main',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            bgcolor: 'primary.main',
          },
        }}
      />
    </Box>
  );
};

export default ToggleGroup;
