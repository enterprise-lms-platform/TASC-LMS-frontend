import React from 'react';
import { Box, Typography, Grid, Paper, Stack, Rating } from '@mui/material';

const courses = [
  {
    title: "Node.js API Development with Express & MongoDB",
    instructor: "Peter Ochieng",
    rating: 4.7,
    reviews: 489,
    price: "$99.99",
    image: "https://images.pexels.com/photos/8464440/pexels-photo-8464440.jpeg"
  },
  {
    title: "Deep Learning with TensorFlow & PyTorch",
    instructor: "Sarah Kim",
    rating: 4.8,
    reviews: 978,
    price: "$179.99",
    image: "https://images.pexels.com/photos/6966593/pexels-photo-6966593.jpeg"
  },
  {
    title: "Full Stack Web Development Bootcamp",
    instructor: "Michael Rodriguez",
    rating: 4.9,
    reviews: 2156,
    price: "$149.99",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1031&auto=format&fit=crop"
  }
];

const RelatedCourses: React.FC = () => {
  return (
    <Box id="related" className="course-section" sx={{ mb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#18181b' }}>Students Also Bought</Typography>
      <Grid container spacing={4}>
        {courses.map((course, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Paper 
              elevation={0}
              sx={{ 
                border: '1px solid #e4e4e7', 
                borderRadius: 3, 
                overflow: 'hidden', 
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              <Box component="img" src={course.image} alt={course.title} sx={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <Box p={3}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem', lineHeight: 1.4, height: 44, overflow: 'hidden' }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{course.instructor}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating value={course.rating} readOnly precision={0.1} size="small" sx={{ color: '#f59e0b', fontSize: '1rem' }} />
                    <Typography variant="body2" fontWeight={600} color="#f59e0b">{course.rating}</Typography>
                    <Typography variant="caption" color="text.secondary">({course.reviews})</Typography>
                  </Stack>
                  <Typography fontWeight={700} color="#18181b">{course.price}</Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedCourses;
