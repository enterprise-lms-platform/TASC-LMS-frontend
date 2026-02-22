import React from 'react';
import { Box, Typography, Paper, Button, LinearProgress } from '@mui/material';
import { Code as CodeIcon, Edit as EditIcon, BarChart as AnalyticsIcon } from '@mui/icons-material';

interface CourseCardProps {
  title: string;
  category: string;
  learners: number;
  rating: number;
  progress: number;
  image?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  category,
  learners,
  rating,
  progress,
  image,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Course image */}
      {image && (
        <Box sx={{ height: 120, overflow: 'hidden', bgcolor: 'grey.200' }}>
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      )}
      {/* Course Header */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
          <CodeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">{category}</Typography>
        </Box>
      </Box>

      {/* Course Body */}
      <Box sx={{ p: 2 }}>
        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {learners}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Learners
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rating
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {progress}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: 2,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #ffb74d, #ffa424)',
            },
          }}
        />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              borderRadius: '50px',
              borderColor: 'grey.300',
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,164,36,0.04)' },
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AnalyticsIcon />}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              borderRadius: '50px',
              bgcolor: 'primary.dark',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'primary.main', boxShadow: 'none' },
            }}
          >
            Analytics
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CourseCard;
