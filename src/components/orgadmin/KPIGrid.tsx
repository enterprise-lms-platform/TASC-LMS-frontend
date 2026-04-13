import React from 'react';
import { Box, Grid, Paper, Typography, Skeleton } from '@mui/material';
import { People as PeopleIcon, CheckCircle as ActiveIcon, MenuBook as CoursesIcon, TrendingUp as CompletionIcon } from '@mui/icons-material';
import { useOrgAdminMembers, useOrgBillingUsage } from '../../hooks/useOrgAdmin';

const KPIGrid: React.FC = () => {
  const { data: membersData, isLoading: membersLoading } = useOrgAdminMembers({ page_size: 1 });
  const { data: billingData, isLoading: billingLoading, error: billingError } = useOrgBillingUsage();

  const totalMembers = membersData?.count ?? 0;
  const activeUsers = billingData?.active_users ?? 0;
  const activeCourses = billingData?.active_courses ?? 0;

  const kpiData = [
    {
      label: 'Total Members',
      value: totalMembers,
      icon: <PeopleIcon />,
      bgcolor: '#dcfce7',
      iconBg: '#4ade80',
      color: '#14532d',
      subColor: '#166534',
      isLoading: membersLoading,
    },
    {
      label: 'Active Members',
      value: activeUsers,
      icon: <ActiveIcon />,
      bgcolor: 'rgba(99,102,241,0.08)',
      iconBg: '#6366f1',
      color: '#312e81',
      subColor: '#4338ca',
      isLoading: billingLoading,
    },
    {
      label: 'Active Courses',
      value: activeCourses,
      icon: <CoursesIcon />,
      bgcolor: '#fff3e0',
      iconBg: '#ffa424',
      color: '#7c2d12',
      subColor: '#9a3412',
      isLoading: billingLoading,
    },
    {
      label: 'Completion Rate',
      value: 'N/A',
      icon: <CompletionIcon />,
      bgcolor: '#f4f4f5',
      iconBg: '#a1a1aa',
      color: '#27272a',
      subColor: '#3f3f46',
      isLoading: false,
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {kpiData.map((kpi) => (
          <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: kpi.bgcolor,
                borderRadius: '20px',
                p: 3,
                position: 'relative',
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: kpi.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  '& svg': { fontSize: 20 },
                }}
              >
                {kpi.icon}
              </Box>
              {kpi.isLoading ? (
                <Skeleton variant="text" width={60} height={48} />
              ) : (
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: kpi.color,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}
              >
                {kpi.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIGrid;