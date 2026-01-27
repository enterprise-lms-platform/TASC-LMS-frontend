import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

const BusinessCtaSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    teamSize: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <Box id="demo" className="cta-section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Text Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', lg: 'left' } }}>
              <Typography sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
                Ready to Transform Your Team's Learning?
              </Typography>
              <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#d4d4d8', lineHeight: 1.8, mb: 4 }}>
                Join 500+ organizations that trust TASC LMS for their workforce development. Schedule a personalized demo to see how we can help your team succeed.
              </Typography>
              <Button
                component={Link}
                to="tel:+1234567890"
                variant="outlined"
                size="large"
                startIcon={<PhoneIcon />}
                sx={{ color: 'white', borderColor: 'white', borderWidth: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: 'white', color: '#ffa424' } }}
              >
                Call Us: +1 (234) 567-890
              </Button>
            </Box>
          </Grid>

          {/* Form */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{ width: 80, height: 80, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#18181b', mb: 1 }}>Thank you!</Typography>
                  <Typography sx={{ color: '#52525b' }}>We'll be in touch within 24 hours.</Typography>
                </Box>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 700, color: '#27272a', mb: 0.5 }}>Request a Demo</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mb: 3 }}>
                    Fill out the form and we'll be in touch within 24 hours.
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="First Name"
                          required
                          fullWidth
                          size="small"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Last Name"
                          required
                          fullWidth
                          size="small"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          label="Work Email"
                          type="email"
                          required
                          fullWidth
                          size="small"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          label="Company Name"
                          required
                          fullWidth
                          size="small"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          select
                          label="Team Size"
                          required
                          fullWidth
                          size="small"
                          value={formData.teamSize}
                          onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                          SelectProps={{ MenuProps: { disableScrollLock: true } }}
                        >
                          <MenuItem value="">Select size</MenuItem>
                          <MenuItem value="5-25">5-25 employees</MenuItem>
                          <MenuItem value="26-100">26-100 employees</MenuItem>
                          <MenuItem value="101-500">101-500 employees</MenuItem>
                          <MenuItem value="501-1000">501-1000 employees</MenuItem>
                          <MenuItem value="1000+">1000+ employees</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Phone Number"
                          fullWidth
                          size="small"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalendarMonthIcon />}
                          sx={{ bgcolor: '#ffa424', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}
                        >
                          {loading ? 'Submitting...' : 'Schedule Demo'}
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography sx={{ fontSize: '0.75rem', color: '#71717a', textAlign: 'center', mt: 2 }}>
                      By submitting, you agree to our{' '}
                      <Box component={Link} to="/privacy" sx={{ color: '#ffa424' }}>
                        Privacy Policy
                      </Box>
                      .
                    </Typography>
                  </form>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessCtaSection;
