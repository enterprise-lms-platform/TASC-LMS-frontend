import React from 'react';
import { Box, Paper, Typography, Avatar, Chip, Skeleton } from '@mui/material';
import { Person as InstructorIcon, MenuBook as BookIcon, People as StudentsIcon, Star as StarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../services/users.services';
import type { InstructorListItem } from '../../services/users.services';
import type { PaginatedResponse } from '../../types/types';

const avatarColors = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #11998e, #38ef7d)',
  'linear-gradient(135deg, #fa709a, #fee140)',
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const InstructorPerformance: React.FC = () => {
  const navigate = useNavigate();

  const { data: instructorsRaw, isLoading } = useQuery({
    queryKey: ['manager', 'instructors', 'performance'],
    queryFn: () => usersApi.getInstructors({ page_size: 3 }).then(r => r.data),
  });

  const instructors = (instructorsRaw as PaginatedResponse<InstructorListItem> | undefined)?.results ?? [];

  const instructorsData = instructors.map((inst, i) => {
    const initials = `${(inst.first_name || '')[0] || ''}${(inst.last_name || '')[0] || ''}`.toUpperCase() || inst.email[0].toUpperCase();
    return {
      name: inst.name || `${inst.first_name} ${inst.last_name}`,
      initials,
      avatarColor: avatarColors[i % avatarColors.length],
      courses: inst.courses_count || 0,
      learners: inst.students_count || 0,
      rating: inst.rating || 0,
    };
  });

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InstructorIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Instructor Performance</Typography>
        </Box>
        <Chip label="View All" size="small" clickable
          onClick={() => navigate('/manager/users')}
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } }} />
      </Box>

      {isLoading ? (
        [0, 1, 2].map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3, borderBottom: i < 2 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}><Skeleton width="50%" /><Skeleton width="70%" /></Box>
          </Box>
        ))
      ) : instructorsData.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No instructors found</Typography>
        </Box>
      ) : (
        instructorsData.map((inst, i) => (
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
        ))
      )}
    </Paper>
  );
};

export default InstructorPerformance;
