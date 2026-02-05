import React from 'react';
import { Box, Paper, Typography, Radio } from '@mui/material';
import { Folder as ModuleIcon, Description as LessonIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

interface Destination {
  id: string;
  type: 'module' | 'lesson';
  name: string;
  path: string;
}

interface DestinationSelectorProps {
  destinations: Destination[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({ destinations, selectedId, onSelect }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
        <Typography fontWeight={700}>Destination</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {destinations.map((dest) => {
          const isSelected = dest.id === selectedId;
          return (
            <Box
              key={dest.id}
              onClick={() => onSelect(dest.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                border: 1,
                borderColor: isSelected ? 'primary.main' : 'grey.200',
                borderRadius: 1,
                mb: 1,
                cursor: 'pointer',
                bgcolor: isSelected ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.light',
                  bgcolor: 'rgba(255, 164, 36, 0.05)',
                },
                '&:last-child': {
                  mb: 0,
                },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: isSelected ? 'primary.main' : 'grey.100',
                  color: isSelected ? 'white' : 'grey.600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {dest.type === 'module' ? <ModuleIcon fontSize="small" /> : <LessonIcon fontSize="small" />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {dest.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dest.path}
                </Typography>
              </Box>
              {isSelected ? (
                <CheckIcon sx={{ color: 'primary.main' }} />
              ) : (
                <Radio checked={isSelected} sx={{ p: 0 }} />
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default DestinationSelector;
export type { Destination };
