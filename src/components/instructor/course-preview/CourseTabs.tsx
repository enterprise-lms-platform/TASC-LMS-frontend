import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface CourseTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const tabs = ['Overview', 'Curriculum', 'Instructor', 'Reviews'];

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        sx={{
          '& .MuiTab-root': {
            fontSize: '1rem',
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 120,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab} label={tab} />
        ))}
      </Tabs>
    </Box>
  );
};

export default CourseTabs;
