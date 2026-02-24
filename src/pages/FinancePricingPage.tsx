import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Grid, Button, Divider, Tabs, Tab,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Sell as PricingIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

/* ──────────────── Individual plan ──────────────── */
const individualPlan = {
  name: 'All-Access Pass',
  subtitle: 'Biannual Plan',
  price: '$99',
  period: '/ 6 months',
  perMonth: '$16.50/month',
  description: 'One plan, unlimited access for individual learners.',
  subscribers: 648,
  revenue: '$64,152',
  features: [
    'Unlimited access to all courses',
    'Earn professional certificates',
    'Join live interactive sessions',
    'Download resources for offline learning',
    'Priority email support',
    'Access to community forums',
  ],
  color: '#ffa424',
};

/* ──────────────── Organisation plans ──────────────── */
interface OrgPlan {
  name: string;
  description: string;
  price: string;
  perUser: string;
  seats: string;
  subscribers: number;
  revenue: string;
  features: { text: string; included: boolean }[];
  popular?: boolean;
  color: string;
}

const orgPlans: OrgPlan[] = [
  {
    name: 'Team',
    description: 'For small teams getting started',
    price: '$15',
    perUser: '/user/month',
    seats: '5-25 users · Billed annually',
    subscribers: 82,
    revenue: '$14,760',
    features: [
      { text: 'Access to 500+ courses', included: true },
      { text: 'Basic team management', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Certificates of completion', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom learning paths', included: false },
      { text: 'SSO integration', included: false },
      { text: 'Custom content upload', included: false },
    ],
    color: '#71717a',
  },
  {
    name: 'Business',
    description: 'For growing organizations',
    price: '$20',
    perUser: '/user/month',
    seats: '25-200 users · Billed annually',
    subscribers: 124,
    revenue: '$29,760',
    popular: true,
    features: [
      { text: 'Access to all 1000+ courses', included: true },
      { text: 'Advanced team management', included: true },
      { text: 'Custom learning paths', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'SSO integration', included: true },
      { text: 'Upload custom content', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated CSM', included: false },
    ],
    color: '#ffa424',
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: '$25',
    perUser: '/user/month',
    seats: '200+ users · Custom billing',
    subscribers: 68,
    revenue: '$20,400',
    features: [
      { text: 'Everything in Business', included: true },
      { text: 'Unlimited custom content', included: true },
      { text: 'SCIM provisioning', included: true },
      { text: 'Advanced security controls', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated CSM', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Quarterly business reviews', included: true },
    ],
    color: '#10b981',
  },
];


const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinancePricingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PricingIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Plans & Pricing</Typography>
                <Typography variant="body2" color="text.secondary">Manage subscription plans and pricing tiers</Typography>
              </Box>
            </Box>
            <Button size="small" variant="contained" startIcon={<EditIcon />}
              sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              Edit Plans
            </Button>
          </Box>

          {/* KPI Stats — overview style */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(() => {
              const kpiCards = [
                { label: 'Total Subscribers', value: '922', icon: <PricingIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
                { label: 'Monthly Recurring', value: '$18,037', icon: <CheckIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
                { label: 'Avg. Revenue / User', value: '$117', icon: <StarIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
                { label: 'Conversion Rate', value: '23.4%', icon: <EditIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
              ];
              return kpiCards.map((s) => (
                <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                  <Paper elevation={0} sx={{
                    bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
                    position: 'relative', minHeight: 160, display: 'flex',
                    flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}>
                    <Box sx={{
                      position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                      borderRadius: '50%', bgcolor: s.iconBg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'white',
                      '& svg': { fontSize: 20 },
                    }}>{s.icon}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: s.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
                    <Typography variant="body2" sx={{ color: s.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>{s.label}</Typography>
                  </Paper>
                </Grid>
              ));
            })()}
          </Grid>

          {/* Tab Switcher */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}
              sx={{
                px: 2, minHeight: 48,
                '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 48 },
                '& .Mui-selected': { color: '#ffa424' },
                '& .MuiTabs-indicator': { bgcolor: '#ffa424' },
              }}>
              <Tab label="Individual Plan" />
              <Tab label="Organisation Plans" />
            </Tabs>
          </Paper>

          {/* ── Individual Plan Tab ── */}
          {tab === 0 && (
            <Grid container spacing={3} justifyContent="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{
                  ...cardSx, position: 'relative', overflow: 'visible',
                  border: `2px solid ${individualPlan.color}`,
                }}>
                  <Chip label="All-Access Pass" size="small" icon={<StarIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #ffa424, #f97316)', color: 'white', fontWeight: 600, fontSize: '0.7rem',
                      '& .MuiChip-icon': { color: 'white' },
                    }} />

                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: individualPlan.color, mb: 0.5 }}>{individualPlan.subtitle}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>{individualPlan.description}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 0.5 }}>
                      <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1 }}>{individualPlan.price}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{individualPlan.period}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem', mb: 2 }}>
                      Just {individualPlan.perMonth}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700}>{individualPlan.subscribers}</Typography>
                        <Typography variant="caption" color="text.secondary">Subscribers</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} color="primary.main">{individualPlan.revenue}</Typography>
                        <Typography variant="caption" color="text.secondary">Revenue</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 3, pt: 2 }}>
                    <Typography variant="caption" fontWeight={600} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
                      Includes
                    </Typography>
                    {individualPlan.features.map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckIcon sx={{ fontSize: 16, color: individualPlan.color }} />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
                    <Button variant="contained" fullWidth
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 12px rgba(255,164,36,0.4)' } }}>
                      Manage Plan
                    </Button>
                  </Box>

                  <Box sx={{ px: 3, pb: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.disabled">30-day money-back guarantee · Cancel anytime</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* ── Organisation Plans Tab ── */}
          {tab === 1 && (
            <Grid container spacing={3}>
              {orgPlans.map((plan) => (
                <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
                  <Paper elevation={0} sx={{
                    ...cardSx, position: 'relative', overflow: 'visible',
                    border: plan.popular ? `2px solid ${plan.color}` : '2px solid transparent',
                  }}>
                    {plan.popular && (
                      <Chip label="Most Popular" size="small" icon={<StarIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                          background: 'linear-gradient(135deg, #ffa424, #f97316)', color: 'white', fontWeight: 600, fontSize: '0.7rem',
                          '& .MuiChip-icon': { color: 'white' },
                        }} />
                    )}

                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: plan.color, mb: 0.5 }}>{plan.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>{plan.description}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 0.5 }}>
                        <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1 }}>{plan.price}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{plan.perUser}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{plan.seats}</Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, mb: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight={700}>{plan.subscribers}</Typography>
                          <Typography variant="caption" color="text.secondary">Orgs</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight={700} color="primary.main">{plan.revenue}</Typography>
                          <Typography variant="caption" color="text.secondary">Revenue</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider />

                    <Box sx={{ p: 3, pt: 2 }}>
                      <Typography variant="caption" fontWeight={600} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
                        Features
                      </Typography>
                      {plan.features.map((f) => (
                        <Box key={f.text} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {f.included
                            ? <CheckIcon sx={{ fontSize: 16, color: plan.color }} />
                            : <CloseIcon sx={{ fontSize: 16, color: '#d4d4d8' }} />}
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: f.included ? 'text.primary' : 'text.disabled' }}>{f.text}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
                      <Button variant={plan.popular ? 'contained' : 'outlined'} fullWidth
                        sx={{
                          textTransform: 'none', fontWeight: 600, borderRadius: 2,
                          ...(plan.popular
                            ? { boxShadow: 'none', '&:hover': { boxShadow: `0 2px 12px ${plan.color}40` } }
                            : { borderColor: plan.color, color: plan.color, '&:hover': { borderColor: plan.color, bgcolor: `${plan.color}08` } }),
                        }}>
                        Manage Plan
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinancePricingPage;
