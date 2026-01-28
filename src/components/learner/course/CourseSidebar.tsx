import React from 'react';
import { Box, Typography, Stack, LinearProgress, Grid } from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Code as CodeIcon,
  Download as DownloadIcon,
  EmojiEvents as CertificateIcon,
} from '@mui/icons-material';

interface CourseSidebarProps {
  progress?: number;
  completedLessons?: number;
  totalLessons: number;
  completedHours?: number;
  totalHours: number;
  projects: number;
  completionRate?: number;
  features?: string[];
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  progress = 0,
  completedLessons = 0,
  totalLessons,
  completedHours = 0,
  totalHours,
  projects,
  completionRate = 89,
  features = [
    '12 hours on-demand video',
    '7 practical projects',
    'Downloadable resources',
    'Certificate of completion',
  ],
}) => {
  const featureIcons = [VideoIcon, CodeIcon, DownloadIcon, CertificateIcon];

  return (
    <Stack spacing={3}>
      {/* Progress Card */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e4e4e7',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography fontWeight={600} color="text.primary">
            Your Progress
          </Typography>
          <Typography sx={{ color: '#ffa424', fontWeight: 700 }}>
            {progress}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#e4e4e7',
            mb: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #ffb74d, #ffa424)',
              borderRadius: 4,
            },
          }}
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {completedLessons}/{totalLessons} lessons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completedHours}/{totalHours} hours
          </Typography>
        </Stack>
      </Box>

      {/* Stats Card */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e4e4e7',
        }}
      >
        <Typography fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
          Course Stats
        </Typography>
        <Grid container spacing={2}>
          {[
            { value: totalLessons, label: 'Lessons' },
            { value: `${totalHours}h`, label: 'Video' },
            { value: projects, label: 'Projects' },
            { value: `${completionRate}%`, label: 'Completion' },
          ].map((stat) => (
            <Grid key={stat.label} size={{ xs: 6 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1.5,
                  bgcolor: '#fafafa',
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight={700} color="text.primary">
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Card */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e4e4e7',
        }}
      >
        <Typography fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
          This Course Includes
        </Typography>
        <Stack spacing={1.5}>
          {features.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <Stack
                key={feature}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  p: 1.5,
                  bgcolor: '#fafafa',
                  borderRadius: 2,
                }}
              >
                <Icon sx={{ fontSize: 20, color: '#ffa424' }} />
                <Typography variant="body2" color="text.primary">
                  {feature}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>

      {/* Similar Courses */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e4e4e7',
        }}
      >
        <Typography fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
          Similar Courses
        </Typography>
        <Stack spacing={1.5}>
          {[
            { title: 'React Performance Masterclass', price: '$99.99' },
            { title: 'Next.js for Production', price: '$149.99' },
            { title: 'TypeScript Deep Dive', price: '$89.99' },
          ].map((course) => (
            <Stack
              key={course.title}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#fafafa' },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 40,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.primary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {course.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffa424', fontWeight: 600 }}>
                  {course.price}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default CourseSidebar;
