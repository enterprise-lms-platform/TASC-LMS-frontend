import React, { useState } from 'react';
import { Box, Typography, Stack, Chip, Collapse, IconButton } from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  PlayCircle as PlayIcon,
  Description as FileIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  isPreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  totalDuration: string;
}

interface CourseCurriculumProps {
  modules: Module[];
  completedLessons?: string[];
  progress?: number;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  modules,
  completedLessons = [],
  progress,
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <PlayIcon sx={{ fontSize: 16 }} />;
      case 'article':
        return <FileIcon sx={{ fontSize: 16 }} />;
      case 'quiz':
        return <QuizIcon sx={{ fontSize: 16 }} />;
      default:
        return <PlayIcon sx={{ fontSize: 16 }} />;
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = modules.reduce((sum, m) => {
    const hours = parseInt(m.totalDuration) || 0;
    return sum + hours;
  }, 0);

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e4e4e7',
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
            Course Curriculum
          </Typography>
          <Typography color="text.secondary">
            {totalLessons} lessons • {totalDuration} hours of video content
          </Typography>
        </Box>
        {progress !== undefined && (
          <Typography sx={{ color: '#ffa424', fontWeight: 600 }}>
            {progress}% Complete
          </Typography>
        )}
      </Stack>

      {/* Modules */}
      <Stack spacing={1}>
        {modules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);

          return (
            <Box
              key={module.id}
              sx={{
                border: '1px solid #e4e4e7',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* Module Header */}
              <Box
                onClick={() => toggleModule(module.id)}
                sx={{
                  p: 2,
                  bgcolor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#f4f4f5' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton size="small" sx={{ p: 0 }}>
                    {isExpanded ? (
                      <ExpandMoreIcon sx={{ color: '#ffa424' }} />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                  <Typography fontWeight={600} color="text.primary">
                    {module.title}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {module.lessons.length} lessons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.totalDuration}
                  </Typography>
                </Stack>
              </Box>

              {/* Module Content */}
              <Collapse in={isExpanded}>
                <Box sx={{ p: 2 }}>
                  {module.lessons.map((lesson) => (
                    <Box
                      key={lesson.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderBottom: '1px solid #e4e4e7',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: '#fafafa' },
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: completedLessons.includes(lesson.id) ? '#10b981' : '#e4e4e7',
                            color: completedLessons.includes(lesson.id) ? 'white' : '#71717a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getLessonIcon(lesson.type)}
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          {lesson.title}
                        </Typography>
                        {lesson.isPreview && (
                          <Chip
                            label="Preview"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.75rem',
                              bgcolor: '#ffa424',
                              color: 'white',
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {lesson.duration}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

// Sample data export
export const sampleModules: Module[] = [
  {
    id: '1',
    title: 'Module 1: React Fundamentals Review',
    totalDuration: '2 hours',
    lessons: [
      { id: '1-1', title: 'Introduction to Advanced React Patterns', duration: '45 min', type: 'video' },
      { id: '1-2', title: 'React Hooks Deep Dive', duration: '30 min', type: 'video' },
      { id: '1-3', title: 'Project Setup and Configuration', duration: '20 min', type: 'article', isPreview: true },
      { id: '1-4', title: 'Quiz: React Fundamentals', duration: '25 min', type: 'quiz' },
    ],
  },
  {
    id: '2',
    title: 'Module 2: Advanced Component Patterns',
    totalDuration: '3 hours',
    lessons: [
      { id: '2-1', title: 'Higher-Order Components (HOCs)', duration: '35 min', type: 'video' },
      { id: '2-2', title: 'Render Props Pattern', duration: '40 min', type: 'video' },
      { id: '2-3', title: 'Compound Components', duration: '30 min', type: 'video' },
      { id: '2-4', title: 'Building a Modal with Compound Pattern', duration: '45 min', type: 'video' },
      { id: '2-5', title: 'Module 2 Quiz', duration: '20 min', type: 'quiz' },
    ],
  },
  {
    id: '3',
    title: 'Module 3: Custom Hooks Mastery',
    totalDuration: '2.5 hours',
    lessons: [
      { id: '3-1', title: 'Creating Custom Hooks', duration: '35 min', type: 'video' },
      { id: '3-2', title: 'useLocalStorage Hook', duration: '25 min', type: 'video' },
      { id: '3-3', title: 'useFetch Hook', duration: '30 min', type: 'video' },
      { id: '3-4', title: 'useDebounce and useThrottle', duration: '25 min', type: 'video' },
    ],
  },
];

export default CourseCurriculum;
