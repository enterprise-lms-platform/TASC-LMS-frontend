import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';

const modules = [
  {
    title: "Module 1: Advanced Hooks Deep Dive",
    lectures: 8,
    duration: "2h 45m",
    lessons: [
      { title: "1.1 Course Introduction & Setup", duration: "08:24", type: "video", preview: true },
      { title: "1.2 Understanding useReducer for Complex State", duration: "18:32", type: "video", preview: true },
      { title: "1.3 Building Custom Hooks", duration: "24:15", type: "video" },
      { title: "1.4 useCallback & useMemo Optimization", duration: "21:08", type: "video" },
      { title: "Project: Build a Custom Form Hook Library", duration: "45:00", type: "assignment" },
      { title: "Module 1 Quiz", duration: "10 questions", type: "quiz" }
    ]
  },
  {
    title: "Module 2: Component Composition Patterns",
    lectures: 10,
    duration: "3h 20m",
    lessons: [
      { title: "2.1 Compound Components Pattern", duration: "22:15", type: "video" },
      { title: "2.2 Render Props Pattern", duration: "19:45", type: "video" },
      { title: "2.3 Higher-Order Components (HOCs)", duration: "25:30", type: "video" }
    ]
  },
  {
    title: "Module 3: State Management at Scale",
    lectures: 9,
    duration: "3h 05m",
    lessons: []
  },
  {
    title: "Module 4: Performance Optimization",
    lectures: 11,
    duration: "3h 45m",
    lessons: []
  }
];

const CourseCurriculum: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('panel0');

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box id="curriculum" className="course-section" sx={{ mb: 8, scrollMarginTop: '140px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#18181b' }}>Course Curriculum</Typography>
        <Button sx={{ color: '#ffa424', fontWeight: 600, textTransform: 'none' }}>Expand all sections</Button>
      </Stack>
      
      <Typography sx={{ mb: 3, color: '#52525b', fontSize: '0.9rem' }}>
        8 sections • 72 lectures • 24h 30m total length
      </Typography>

      <Box sx={{ border: '1px solid #e4e4e7', borderRadius: 3, overflow: 'hidden' }}>
        {modules.map((module, index) => (
          <Accordion 
            key={index} 
            expanded={expanded === `panel${index}`} 
            onChange={handleChange(`panel${index}`)}
            disableGutters
            elevation={0}
            sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #e4e4e7', '&:last-child': { borderBottom: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#fafafa', px: 3, py: 1 }}>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mr: 2 }}>
                <Typography sx={{ fontWeight: 600, color: '#27272a' }}>{module.title}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>{module.lectures} lectures • {module.duration}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {module.lessons.map((lesson, idx) => (
                  <ListItem key={idx} sx={{ px: 4, py: 1.5, borderBottom: '1px solid #f4f4f5', '&:last-child': { borderBottom: 'none' }, '&:hover': { bgcolor: '#fafafa' } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {lesson.type === 'video' ? <PlayCircleOutlineIcon fontSize="small" color="primary" /> : 
                       lesson.type === 'quiz' ? <QuizIcon fontSize="small" color="warning" /> :
                       <AssignmentIcon fontSize="small" color="success" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography fontSize="0.9rem">{lesson.title}</Typography>
                          {lesson.preview && <Typography fontSize="0.75rem" color="primary" fontWeight={600}>Preview</Typography>}
                        </Stack>
                      } 
                    />
                    <Typography fontSize="0.875rem" color="text.secondary">{lesson.duration}</Typography>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default CourseCurriculum;
