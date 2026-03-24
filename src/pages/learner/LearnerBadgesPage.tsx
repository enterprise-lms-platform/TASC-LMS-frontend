import React, { useState } from 'react';
import { Box, Typography, Grid, Tab, Tabs, CircularProgress, CssBaseline, Toolbar } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { useBadges } from '../../hooks/useBadges';
import { BADGE_CATEGORIES } from '../../config/badgeDefinitions';
import BadgeCard from '../../components/learner/BadgeCard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BadgeEarnedModal from '../../components/learner/BadgeEarnedModal';

const LearnerBadgesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { allBadges, earnedBadges, isLoading } = useBadges();
  const [currentTab, setCurrentTab] = React.useState('all');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const getFilteredBadges = (categoryId: string) => {
    return allBadges.filter(b => b.category_id === categoryId);
  };

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ bgcolor: '#fff7ed', borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmojiEventsIcon sx={{ color: '#ffa424', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                  My Badges
                </Typography>
                <Typography variant="body2" sx={{ color: '#71717a' }}>
                  You have earned {earnedBadges.length} out of {allBadges.length} available badges
                </Typography>
              </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, mt: 2 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minWidth: 'auto', px: 3 } }}
              >
                <Tab label="All Categories" value="all" />
                {BADGE_CATEGORIES.map(cat => (
                  <Tab key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Tabs>
            </Box>

            {currentTab === 'all' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {BADGE_CATEGORIES.map(category => {
                  const categoryBadges = getFilteredBadges(category.id);
                  if (categoryBadges.length === 0) return null;
                  return (
                    <Box key={category.id}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#18181b', mb: 2 }}>
                        {category.name}
                      </Typography>
                      <Grid container spacing={3}>
                        {categoryBadges.map(badge => {
                          const earnedRecord = earnedBadges.find(eb => eb.id === badge.id);
                          return (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={badge.id}>
                              <BadgeCard
                                badge={badge}
                                isEarned={!!earnedRecord}
                                earnedAt={earnedRecord?.earned_at}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {getFilteredBadges(currentTab).map(badge => {
                  const earnedRecord = earnedBadges.find(eb => eb.id === badge.id);
                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={badge.id}>
                      <BadgeCard
                        badge={badge}
                        isEarned={!!earnedRecord}
                        earnedAt={earnedRecord?.earned_at}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </Box>

      <BadgeEarnedModal />
    </Box>
  );
};

export default LearnerBadgesPage;
