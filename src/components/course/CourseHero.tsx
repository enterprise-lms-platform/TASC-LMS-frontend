import { Box, Container, Typography, Stack, Chip, Rating, Grid, Avatar } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import UpdateIcon from '@mui/icons-material/Update';
import PeopleIcon from '@mui/icons-material/People';

const CourseHero: React.FC = () => {
  return (
    <Box className="course-hero-bg" sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Badges */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
              <Chip
                label="Bestseller"
                size="small"
                sx={{ bgcolor: '#ffa424', color: 'white', fontWeight: 700, borderRadius: 1 }}
              />
              <Chip
                icon={<UpdateIcon sx={{ color: 'white !important', fontSize: 16 }} />}
                label="Updated Jan 2026"
                size="small"
                sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 600, borderRadius: 1 }}
              />
              <Chip
                label="Web Development"
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, borderRadius: 1 }}
              />
            </Stack>

            {/* Title */}
            <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              Advanced React Patterns & Best Practices
            </Typography>

            {/* Subtitle */}
            <Typography sx={{ fontSize: '1.125rem', color: '#d4d4d8', mb: 3, maxWidth: 700, lineHeight: 1.6 }}>
              Master advanced React patterns including hooks, context, render props, HOCs, and performance optimization techniques used by senior developers at top tech companies.
            </Typography>

            {/* Ratings & Stats */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} sx={{ mb: 3 }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 700, color: '#f59e0b', fontSize: '1.125rem' }}>4.8</Typography>
                <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: '#f59e0b' }} />
                <Typography component="a" href="#reviews" sx={{ color: '#a1a1aa', textDecoration: 'underline', fontSize: '0.875rem', cursor: 'pointer' }}>
                  (1,247 ratings)
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#d4d4d8', fontSize: '0.875rem' }}>
                <PeopleIcon sx={{ fontSize: 18 }} />
                <Typography>8,542 students</Typography>
              </Stack>
            </Stack>

            {/* Instructor Brief */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Avatar sx={{ width: 48, height: 48, background: 'linear-gradient(135deg, #ffb74d, #fb923c)', fontWeight: 700 }}>MR</Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#d4d4d8' }}>Created by</Typography>
                <Typography component="a" href="#instructor" sx={{ color: 'white', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: '#ffa424' } }}>
                  Michael Rodriguez
                </Typography>
              </Box>
            </Stack>

            {/* Meta Info */}
            <Stack direction="row" flexWrap="wrap" spacing={3} sx={{ color: 'white', fontSize: '0.875rem', gap: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <UpdateIcon sx={{ fontSize: 18, color: '#a1a1aa' }} />
                <Typography>Last updated 1/2026</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LanguageIcon sx={{ fontSize: 18, color: '#a1a1aa' }} />
                <Typography>English</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ClosedCaptionIcon sx={{ fontSize: 18, color: '#a1a1aa' }} />
                <Typography>English [Auto]</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseHero;
