import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const objectives = [
  "Master advanced React Hooks patterns including custom hooks, useReducer, and useContext for complex state management",
  "Implement compound components, render props, and higher-order components for reusable UI patterns",
  "Optimize React application performance with memoization, code splitting, and lazy loading techniques",
  "Build scalable state management solutions using Context API, Redux, and Zustand",
  "Write type-safe React applications with TypeScript integration and best practices",
  "Implement effective testing strategies with React Testing Library and Jest",
  "Design and build accessible React components following WCAG guidelines",
  "Apply real-world architectural patterns used at companies like Google, Meta, and Netflix"
];

const CourseObjectives: React.FC = () => {
  return (
    <Box id="objectives" className="course-section" sx={{ mb: 8, scrollMarginTop: '140px' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#18181b' }}>What You'll Learn</Typography>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3 }}>
        <Grid container spacing={2}>
          {objectives.map((objective, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <CheckIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.5 }} />
                <Typography sx={{ fontSize: '0.95rem', color: '#52525b', lineHeight: 1.6 }}>{objective}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CourseObjectives;
