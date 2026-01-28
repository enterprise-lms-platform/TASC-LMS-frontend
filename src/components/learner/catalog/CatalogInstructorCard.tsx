import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, Stack } from '@mui/material';

export interface Instructor {
  id: string;
  name: string;
  title: string;
  initials: string;
  avatar?: string;
  courseCount: number;
  rating: number;
  studentCount: string;
}

interface CatalogInstructorCardProps {
  instructor: Instructor;
  onViewProfile?: (instructor: Instructor) => void;
}

// Sample instructors for export
export const sampleInstructors: Instructor[] = [
  {
    id: '1',
    name: 'Michael Rodriguez',
    title: 'Senior Web Developer',
    initials: 'MR',
    avatar: '/avatars/male face (2).jpg',
    courseCount: 8,
    rating: 4.8,
    studentCount: '5K',
  },
  {
    id: '2',
    name: 'Emma Chen',
    title: 'Data Scientist',
    initials: 'EC',
    avatar: '/avatars/female face (1).jpg',
    courseCount: 6,
    rating: 4.9,
    studentCount: '3.8K',
  },
  {
    id: '3',
    name: 'David Wilson',
    title: 'Security Expert',
    initials: 'DW',
    avatar: '/avatars/male face (7).jpg',
    courseCount: 5,
    rating: 4.7,
    studentCount: '2.5K',
  },
];

const CatalogInstructorCard: React.FC<CatalogInstructorCardProps> = ({
  instructor,
  onViewProfile,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid #e4e4e7',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        {/* Avatar */}
        <Avatar
          src={instructor.avatar}
          sx={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontSize: '1.5rem',
            fontWeight: 700,
            mx: 'auto',
            mb: 2,
          }}
        >
          {instructor.initials}
        </Avatar>

        {/* Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#27272a',
            mb: 0.5,
          }}
        >
          {instructor.name}
        </Typography>

        {/* Title */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: '#ffa424',
            mb: 2,
            fontWeight: 500,
          }}
        >
          {instructor.title}
        </Typography>

        {/* Stats */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={3}
          sx={{ mb: 2 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" fontWeight={700} color="text.primary">
              {instructor.courseCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Courses
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" fontWeight={700} color="text.primary">
              {instructor.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rating
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" fontWeight={700} color="text.primary">
              {instructor.studentCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Students
            </Typography>
          </Box>
        </Stack>

        {/* Button */}
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.(instructor);
          }}
          sx={{
            bgcolor: '#ffa424',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            mt: 2,
            '&:hover': {
              bgcolor: '#e59420',
            },
          }}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default CatalogInstructorCard;
