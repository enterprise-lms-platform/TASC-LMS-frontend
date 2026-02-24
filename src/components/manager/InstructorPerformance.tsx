import React from 'react';
import { Box, Paper, Typography, Avatar, Chip } from '@mui/material';
import { Person as InstructorIcon, MenuBook as BookIcon, People as StudentsIcon, Star as StarIcon } from '@mui/icons-material';

const instructorsData = [
  { name: 'Michael Rodriguez', initials: 'MR', avatarColor: 'linear-gradient(135deg, #667eea, #764ba2)', courses: 4, learners: 842, rating: 4.8 },
  { name: 'David Wilson', initials: 'DW', avatarColor: 'linear-gradient(135deg, #f093fb, #f5576c)', courses: 3, learners: 567, rating: 4.6 },
  { name: 'Amina Nakato', initials: 'AN', avatarColor: 'linear-gradient(135deg, #11998e, #38ef7d)', courses: 2, learners: 423, rating: 4.9 },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const InstructorPerformance: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InstructorIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Instructor Performance</Typography>
        </Box>
        <Chip label="View All" size="small" clickable
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } }} />
      </Box>

      {instructorsData.map((inst, i) => (
        <Box key={i} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3,
          borderBottom: i < instructorsData.length - 1 ? 1 : 0, borderColor: 'divider',
          cursor: 'pointer', transition: 'all 0.15s',
          '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
        }}>
          <Avatar sx={{
            width: 40, height: 40, background: inst.avatarColor,
            fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
          }}>{inst.initials}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{inst.name}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BookIcon sx={{ fontSize: 13, color: '#a1a1aa' }} />
                <Typography variant="caption" color="text.secondary">{inst.courses} courses</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StudentsIcon sx={{ fontSize: 13, color: '#a1a1aa' }} />
                <Typography variant="caption" color="text.secondary">{inst.learners} learners</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <StarIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                <Typography variant="caption" fontWeight={700} sx={{ color: '#f59e0b' }}>{inst.rating}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default InstructorPerformance;
