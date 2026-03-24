import React from 'react';
import { Grid } from '@mui/material';
import {
  People as UsersIcon,
  Business as OrganizationsIcon,
  AttachMoney as RevenueIcon,
  MenuBook as CoursesIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../services/users.services';
import { organizationApi } from '../../services/organization.services';
import { courseApi } from '../../services/catalogue.services';
import { transactionApi } from '../../services/payments.services';
import type { PaginatedResponse } from '../../types/types';
import KPICard from './KPICard';

const KPIGrid: React.FC = () => {
  const { data: usersData, isLoading: lu } = useQuery({
    queryKey: ['superadmin', 'users', 'kpi'],
    queryFn: () => usersApi.getAll({ page_size: 1 }).then(r => r.data),
  });
  const { data: orgsData, isLoading: lo } = useQuery({
    queryKey: ['superadmin', 'orgs', 'kpi'],
    queryFn: () => organizationApi.getAll({ page_size: 1 }).then(r => r.data),
  });
  const { data: coursesData, isLoading: lc } = useQuery({
    queryKey: ['superadmin', 'courses', 'kpi'],
    queryFn: () => courseApi.getAll({ is_published: true, page_size: 1 }).then(r => r.data),
  });
  const { data: txData, isLoading: lt } = useQuery({
    queryKey: ['superadmin', 'transactions', 'kpi'],
    queryFn: () => transactionApi.getAll({ page_size: 1 }).then(r => r.data),
  });

  const totalUsers = (usersData as PaginatedResponse<unknown> | undefined)?.count ?? 0;
  const activeOrgs = (orgsData as PaginatedResponse<unknown> | undefined)?.count ?? 0;
  const activeCourses = (coursesData as PaginatedResponse<unknown> | undefined)?.count ?? 0;
  const txResults = (txData as PaginatedResponse<{ amount?: string }> | undefined)?.results ?? [];
  const monthlyRevenue = txResults.reduce((sum, t) => sum + (parseFloat(t.amount || '0') || 0), 0);
  const revenueStr = monthlyRevenue >= 1000 ? `$${(monthlyRevenue / 1000).toFixed(0)}K` : `$${monthlyRevenue.toFixed(0)}`;

  const loading = lu || lo || lc || lt;

  const kpiData = [
    { title: 'Total Users', value: loading ? '—' : totalUsers.toLocaleString(), icon: <UsersIcon />,
      bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#388e3c' },
    { title: 'Active Organizations', value: loading ? '—' : activeOrgs.toLocaleString(), icon: <OrganizationsIcon />,
      bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { title: 'Monthly Revenue', value: loading ? '—' : revenueStr, icon: <RevenueIcon />,
      bgColor: '#fff3e0', badgeColor: '#ffb74d', valueColor: '#e65100', labelColor: '#f57c00' },
    { title: 'Active Courses', value: loading ? '—' : activeCourses.toLocaleString(), icon: <CoursesIcon />,
      bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534' },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ mb: 3 }}>
      {kpiData.map((kpi, index) => (
        <Grid key={kpi.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard {...kpi} index={index} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIGrid;
