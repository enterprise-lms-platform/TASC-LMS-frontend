import React from 'react';
import { Grid } from '@mui/material';
import {
  MenuBook as CoursesIcon,
  School as LearnersIcon,
  TrendingUp as CompletionIcon,
  Assignment as GradingIcon,
} from '@mui/icons-material';
import StatCard from './StatCard';

// KPI data (will come from backend later)
const kpiData = [
  {
    icon: <CoursesIcon />,
    value: '4',
    label: 'Active Courses',
    colorScheme: 'primary' as const,
  },
  {
    icon: <LearnersIcon />,
    value: '842',
    label: 'Total Learners',
    colorScheme: 'info' as const,
  },
  {
    icon: <CompletionIcon />,
    value: '78%',
    label: 'Avg. Completion',
    colorScheme: 'success' as const,
  },
  {
    icon: <GradingIcon />,
    value: '12',
    label: 'Pending Grading',
    colorScheme: 'warning' as const,
  },
];

const KPIGrid: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {kpiData.map((kpi) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.label}>
          <StatCard
            icon={kpi.icon}
            value={kpi.value}
            label={kpi.label}
            colorScheme={kpi.colorScheme}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIGrid;
