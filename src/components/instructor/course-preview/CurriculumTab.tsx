import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  PlayCircle as VideoIcon,
  Description as DocIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  duration: string;
  isPreview?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessonCount: number;
  duration: string;
  lessons: Lesson[];
}

interface CurriculumTabProps {
  modules: Module[];
  totalSections: number;
  totalLessons: number;
  totalDuration: string;
}

const lessonIcons = {
  video: <VideoIcon fontSize="small" />,
  document: <DocIcon fontSize="small" />,
  quiz: <QuizIcon fontSize="small" />,
  assignment: <AssignmentIcon fontSize="small" />,
};

const lessonColors = {
  video: { bg: '#dbeafe', color: '#3b82f6' },
  document: { bg: '#d1fae5', color: '#10b981' },
  quiz: { bg: '#ede9fe', color: '#8b5cf6' },
  assignment: { bg: '#fef3c7', color: '#f59e0b' },
};

const CurriculumTab: React.FC<CurriculumTabProps> = ({ modules, totalSections, totalLessons, totalDuration }) => {
  const [expanded, setExpanded] = useState<string | false>(modules[0]?.id || false);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Course Curriculum
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalSections} sections • {totalLessons} lectures • {totalDuration}
        </Typography>
      </Box>

      {/* Modules */}
      {modules.map((module) => (
        <Accordion
          key={module.id}
          expanded={expanded === module.id}
          onChange={() => setExpanded(expanded === module.id ? false : module.id)}
          sx={{
            border: 1,
            borderColor: 'grey.200',
            borderRadius: '8px !important',
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: 'none',
          }}
        >
          <AccordionSummary expandIcon={<ExpandIcon />} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>{module.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {module.lessonCount} lectures • {module.duration}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', p: 0 }}>
            {module.lessons.map((lesson) => {
              const colors = lessonColors[lesson.type];
              return (
                <Box
                  key={lesson.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    px: 3,
                    borderBottom: 1,
                    borderColor: 'grey.100',
                    cursor: lesson.isPreview ? 'pointer' : 'default',
                    '&:last-child': { borderBottom: 0 },
                    '&:hover': lesson.isPreview ? { bgcolor: 'grey.50' } : {},
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: colors.bg,
                      color: colors.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {lessonIcons[lesson.type]}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {lesson.title}
                      {lesson.isPreview && (
                        <Chip
                          label="Preview"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            bgcolor: '#dbeafe',
                            color: '#3b82f6',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {lesson.duration}
                  </Typography>
                  {!lesson.isPreview && <LockIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
                </Box>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CurriculumTab;
export type { Module, Lesson };
