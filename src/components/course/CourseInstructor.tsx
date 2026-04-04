import React from 'react';
import { Box, Typography, Avatar, Stack, IconButton, Paper, Skeleton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import { usePublicInstructor } from '../../hooks/usePublic';

interface CourseInstructorProps {
  instructorId?: number;
  name?: string;
}

const CourseInstructor: React.FC<CourseInstructorProps> = ({ instructorId, name = 'Instructor' }) => {
  const { data: profile, isLoading } = usePublicInstructor(instructorId);

  const displayName = profile?.name ?? name;
  const getInitials = (n: string) => n.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  const socialLinks = profile?.social_links ?? {};

  return (
    <Box id="instructor" className="course-section" sx={{ mb: 8, scrollMarginTop: '140px' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#18181b' }}>Meet Your Instructor</Typography>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3 }}>
        {isLoading ? (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
            <Skeleton variant="circular" width={120} height={120} />
            <Box flex={1}>
              <Skeleton width="40%" height={32} sx={{ mb: 1 }} />
              <Skeleton width="25%" height={22} sx={{ mb: 2 }} />
              <Skeleton width="100%" height={80} />
            </Box>
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
            <Avatar
              src={profile?.avatar_url ?? undefined}
              sx={{ width: 120, height: 120, fontSize: '2.5rem', background: 'linear-gradient(135deg, #ffb74d, #fb923c)', fontWeight: 700 }}
            >
              {getInitials(displayName)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#ffa424' }}>{displayName}</Typography>
              <Typography sx={{ color: '#52525b', mb: 2 }}>Instructor</Typography>

              <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                  <StarIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                  <Typography>{profile?.rating != null ? profile.rating.toFixed(1) : '—'} Rating</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                  <CommentIcon fontSize="small" sx={{ color: '#71717a' }} />
                  <Typography>{profile?.total_reviews != null ? profile.total_reviews.toLocaleString() : '—'} Reviews</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                  <PeopleIcon fontSize="small" sx={{ color: '#71717a' }} />
                  <Typography>{profile?.total_students != null ? profile.total_students.toLocaleString() : '—'} Students</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '0.875rem', color: '#52525b' }}>
                  <PlayCircleOutlineIcon fontSize="small" sx={{ color: '#71717a' }} />
                  <Typography>{profile?.total_courses != null ? profile.total_courses : '—'} Courses</Typography>
                </Stack>
              </Stack>

              <Typography paragraph sx={{ color: '#3f3f46', lineHeight: 1.8 }}>
                {profile?.bio || 'Bio not available.'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                {socialLinks.linkedin && (
                  <IconButton component="a" href={socialLinks.linkedin} target="_blank" rel="noopener" sx={{ bgcolor: '#f4f4f5', color: '#52525b', '&:hover': { bgcolor: '#ffa424', color: 'white' } }}>
                    <LinkedInIcon />
                  </IconButton>
                )}
                {socialLinks.twitter && (
                  <IconButton component="a" href={socialLinks.twitter} target="_blank" rel="noopener" sx={{ bgcolor: '#f4f4f5', color: '#52525b', '&:hover': { bgcolor: '#ffa424', color: 'white' } }}>
                    <TwitterIcon />
                  </IconButton>
                )}
                {socialLinks.github && (
                  <IconButton component="a" href={socialLinks.github} target="_blank" rel="noopener" sx={{ bgcolor: '#f4f4f5', color: '#52525b', '&:hover': { bgcolor: '#ffa424', color: 'white' } }}>
                    <GitHubIcon />
                  </IconButton>
                )}
                {socialLinks.website && (
                  <IconButton component="a" href={socialLinks.website} target="_blank" rel="noopener" sx={{ bgcolor: '#f4f4f5', color: '#52525b', '&:hover': { bgcolor: '#ffa424', color: 'white' } }}>
                    <LanguageIcon />
                  </IconButton>
                )}
                {!socialLinks.linkedin && !socialLinks.twitter && !socialLinks.github && !socialLinks.website && (
                  [<LinkedInIcon />, <TwitterIcon />, <GitHubIcon />, <LanguageIcon />].map((icon, i) => (
                    <IconButton key={i} sx={{ bgcolor: '#f4f4f5', color: '#d4d4d8' }}>
                      {icon}
                    </IconButton>
                  ))
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default CourseInstructor;
