import React from 'react';
import { Grid } from '@mui/material';
import {
  MenuBook as CoursesIcon,
  School as LearnersIcon,
  TrendingUp as CompletionIcon,
  Assignment as GradingIcon,
} from '@mui/icons-material';
import KPICard from '../superadmin/KPICard';

// KPI data with pastel themes
const kpiData = [
  {
    icon: <CoursesIcon />,
    value: '4',
    title: 'Active Courses',
    // Soft Blue Theme
    bgColor: '#e3f2fd', badgeColor: '#64b5f6', valueColor: '#1565c0', labelColor: '#0d47a1'
  },
  {
    icon: <LearnersIcon />,
    value: '842',
    title: 'Total Learners',
    // Mint Green Theme
    bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
  },
  {
    icon: <CompletionIcon />,
    value: '78%',
    title: 'Avg. Completion',
    // Light Amber Theme
    bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
  },
  {
    icon: <GradingIcon />,
    value: '12',
    title: 'Pending Grading',
    // Soft Rose Theme
    bgColor: '#fce4ec', badgeColor: '#f06292', valueColor: '#ad1457', labelColor: '#880e4f'
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
