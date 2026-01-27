import React, { useState } from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';

const CourseNavigation: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const sectionIds = ['objectives', 'curriculum', 'instructor', 'reviews', 'faq'];
    const element = document.getElementById(sectionIds[newValue]);
    if (element) {
      const offset = 140; // Height of header + nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'sticky', top: 72, bgcolor: 'white', zIndex: 50, borderBottom: 1, borderColor: 'divider', mb: 6 }}>
      <Container maxWidth="lg">
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 64, fontSize: '0.9rem' }, '& .Mui-selected': { color: '#ffa424 !important' }, '& .MuiTabs-indicator': { bgcolor: '#ffa424', height: 3 } }}
        >
          <Tab label="What You'll Learn" />
          <Tab label="Curriculum" />
          <Tab label="Instructor" />
          <Tab label="Reviews" />
          <Tab label="FAQ" />
        </Tabs>
      </Container>
    </Box>
  );
};

export default CourseNavigation;
