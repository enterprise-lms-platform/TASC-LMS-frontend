import React from 'react';
import { Grid } from '@mui/material';
import {
  MenuBook as CoursesIcon,
  School as LearnersIcon,
  TrendingUp as CompletionIcon,
  Assignment as GradingIcon,
} from '@mui/icons-material';
import KPICard from '../superadmin/KPICard';

// KPI data — matches learner QuickStats color themes
const kpiData = [
  {
    icon: <CoursesIcon />,
    value: '4',
    title: 'Active Courses',
    // Green Theme
    bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534'
  },
  {
    icon: <LearnersIcon />,
    value: '842',
    title: 'Total Learners',
    // Grey Theme
    bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46'
  },
  {
    icon: <CompletionIcon />,
    value: '78%',
    title: 'Avg. Completion',
    // Orange Theme
    bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#7c2d12', labelColor: '#9a3412'
  },
  {
    icon: <GradingIcon />,
    value: '12',
    title: 'Pending Grading',
    // Alt Green Theme
    bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534'
  },
];

const KPIGrid: React.FC = () => {
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
