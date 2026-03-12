import React, { useMemo } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  People as UsersIcon,
  MenuBook as CoursesIcon,
  School as EnrollmentsIcon,
  TrendingUp as CompletionIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../services/users.service';
import { courseApi } from '../../services/catalogue.services';
import { enrollmentApi } from '../../services/learning.services';

const KPIGrid: React.FC = () => {
  const { data: usersData } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => usersApi.getAll({ page_size: 1 }).then(r => r.data),
  });
  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'all'],
    queryFn: () => courseApi.getAll({}).then(r => r.data),
  });
  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments', 'all'],
    queryFn: () => enrollmentApi.getAll({}).then(r => r.data),
  });

  const totalUsers = (usersData as any)?.count || 0;
  const courses = (coursesData as any)?.results || (coursesData as any) || [];
  const activeCourses = courses.filter((c: any) => c.is_published).length;
  const enrollments = (enrollmentsData as any)?.results || (enrollmentsData as any) || [];
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter((e: any) => e.progress_percentage >= 100).length;
  const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

  const kpiData = useMemo(() => [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: <UsersIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Active Courses', value: activeCourses.toString(), icon: <CoursesIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
    { label: 'Total Enrollments', value: totalEnrollments.toLocaleString(), icon: <EnrollmentsIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: <CompletionIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
  ], [totalUsers, activeCourses, totalEnrollments, completionRate]);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {kpiData.map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Paper elevation={0} sx={{
              bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
              position: 'relative', minHeight: 160, display: 'flex',
              flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)' },
            }}>
              <Box sx={{
                position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                borderRadius: '50%', bgcolor: s.iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'white',
                '& svg': { fontSize: 20 },
              }}>{s.icon}</Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: s.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: s.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIGrid;
