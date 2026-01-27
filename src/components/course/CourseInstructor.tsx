import React from 'react';
import { Box, Typography, Avatar, Stack, IconButton, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';

const CourseInstructor: React.FC = () => {
  return (
    <Box id="instructor" className="course-section" sx={{ mb: 8, scrollMarginTop: '140px' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#18181b' }}>Meet Your Instructor</Typography>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          <Avatar sx={{ width: 120, height: 120, fontSize: '2.5rem', background: 'linear-gradient(135deg, #ffb74d, #fb923c)', fontWeight: 700 }}>MR</Avatar>
          <Box flex={1}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#ffa424', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Michael Rodriguez</Typography>
            <Typography sx={{ color: '#52525b', mb: 2 }}>Senior Software Engineer • React Specialist</Typography>
            
            <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
              <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                <StarIcon fontSize="small" sx={{ color: '#71717a' }} />
                <Typography>4.8 Rating</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                <CommentIcon fontSize="small" sx={{ color: '#71717a' }} />
                <Typography>2,847 Reviews</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                <PeopleIcon fontSize="small" sx={{ color: '#71717a' }} />
                <Typography>28,542 Students</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                <PlayCircleOutlineIcon fontSize="small" sx={{ color: '#71717a' }} />
                <Typography>5 Courses</Typography>
              </Stack>
            </Stack>

            <Typography paragraph sx={{ color: '#3f3f46', lineHeight: 1.8 }}>
              Michael is a Senior Software Engineer with over 10 years of experience building web applications at scale. He has worked at Google and Meta, where he contributed to React-based products used by millions of users daily.
            </Typography>
            <Typography paragraph sx={{ color: '#3f3f46', lineHeight: 1.8 }}>
              He's passionate about teaching and has helped over 28,000 students improve their React skills. His teaching style focuses on practical, real-world applications rather than abstract theory.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {[<LinkedInIcon />, <TwitterIcon />, <GitHubIcon />, <LanguageIcon />].map((icon, i) => (
                <IconButton key={i} sx={{ bgcolor: '#f4f4f5', color: '#52525b', '&:hover': { bgcolor: '#ffa424', color: 'white' } }}>
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CourseInstructor;
