import React from 'react';
import { Box, Paper, Typography, Button, LinearProgress } from '@mui/material';
import {
  Code as ReactIcon,
  Folder as FolderIcon,
  Description as FileIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  BarChart as ChartIcon,
} from '@mui/icons-material';

interface CourseHeaderData {
  title: string;
  thumbnail?: string;
  modules: number;
  lessons: number;
  duration: string;
  enrolled: number;
  progress: number;
  progressText: string;
}

interface CourseHeaderCardProps {
  course: CourseHeaderData;
  onEditInfo?: () => void;
  onViewAnalytics?: () => void;
}

const CourseHeaderCard: React.FC<CourseHeaderCardProps> = ({ course, onEditInfo, onViewAnalytics }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.200',
        display: 'flex',
        gap: 3,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: { xs: '100%', md: 200 },
          height: { xs: 160, md: 112 },
          borderRadius: 1,
          background: 'linear-gradient(135deg, #ffb74d, #f97316)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 40,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {course.thumbnail ? (
          <Box component="img" src={course.thumbnail} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <ReactIcon sx={{ fontSize: 48 }} />
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          {course.title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FolderIcon sx={{ fontSize: 16, color: 'primary.main' }} /> {course.modules} Modules
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FileIcon sx={{ fontSize: 16, color: 'primary.main' }} /> {course.lessons} Lessons
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 16, color: 'primary.main' }} /> {course.duration}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 16, color: 'primary.main' }} /> {course.enrolled} Enrolled
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={course.progress}
          sx={{ height: 8, borderRadius: 4, mb: 1, bgcolor: 'grey.200' }}
        />
        <Typography variant="body2" color="text.secondary">
          {course.progressText}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1, flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={onEditInfo}
          sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
        >
          Edit Info
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ChartIcon />}
          onClick={onViewAnalytics}
          sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
        >
          Analytics
        </Button>
      </Box>
    </Paper>
  );
};

export default CourseHeaderCard;
export type { CourseHeaderData };
