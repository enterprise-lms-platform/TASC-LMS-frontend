import React from 'react';
import { Grid } from '@mui/material';
import {
  MenuBook as CoursesIcon,
  School as LearnersIcon,
  TrendingUp as CompletionIcon,
  Assignment as GradingIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../../services/catalogue.services';
import { enrollmentApi, submissionApi } from '../../services/learning.services';
import type { PaginatedResponse } from '../../types/types';
import KPICard from '../superadmin/KPICard';

const KPIGrid: React.FC = () => {
  const { data: coursesData, isLoading: lc } = useQuery({
    queryKey: ['instructor', 'courses', 'kpi'],
    queryFn: () => courseApi.getAll({}).then(r => r.data),
  });
  const { data: enrollmentsData, isLoading: le } = useQuery({
    queryKey: ['instructor', 'enrollments', 'kpi'],
    queryFn: () => enrollmentApi.getAll({}).then(r => r.data),
  });
  const { data: submissionsData, isLoading: ls } = useQuery({
    queryKey: ['instructor', 'submissions', 'kpi'],
    queryFn: () => submissionApi.getAll({ status: 'pending' }).then(r => r.data),
  });

  const courses = (coursesData as PaginatedResponse<{ is_published: boolean }> | undefined)?.results ?? [];
  const activeCourses = courses.filter(c => c.is_published).length;
  const enrollments = (enrollmentsData as PaginatedResponse<{ progress_percentage: number }> | undefined)?.results ?? [];
  const totalLearners = enrollments.length;
  const avgCompletion = totalLearners > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / totalLearners) : 0;
  const pendingGrading = (submissionsData as PaginatedResponse<unknown> | undefined)?.count
    ?? (submissionsData as PaginatedResponse<unknown> | undefined)?.results?.length ?? 0;
  const loading = lc || le || ls;

  const kpiData = [
    { icon: <CoursesIcon />, value: loading ? '—' : String(activeCourses), title: 'Active Courses',
      bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534' },
    { icon: <LearnersIcon />, value: loading ? '—' : totalLearners.toLocaleString(), title: 'Total Learners',
      bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { icon: <CompletionIcon />, value: loading ? '—' : `${avgCompletion}%`, title: 'Avg. Completion',
      bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#7c2d12', labelColor: '#9a3412' },
    { icon: <GradingIcon />, value: loading ? '—' : String(pendingGrading), title: 'Pending Grading',
      bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {kpiData.map((kpi, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.title}>
          <KPICard
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            bgColor={kpi.bgColor}
            badgeColor={kpi.badgeColor}
            valueColor={kpi.valueColor}
            labelColor={kpi.labelColor}
            index={index}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIGrid;
