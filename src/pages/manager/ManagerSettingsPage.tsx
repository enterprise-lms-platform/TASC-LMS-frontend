import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Palette as PaletteIcon,
  School as LearningIcon,
  Security as PrivacyIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Download as ExportIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

// ── Shared styles ──
const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};
const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

const industryOptions = [
  'Technology',
  'Education',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Government',
  'Non-Profit',
  'Other',
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'sw', label: 'Swahili' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese (Mandarin)' },
  { value: 'pt', label: 'Portuguese' },
];

const retentionOptions = [
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
  { value: '3years', label: '3 Years' },
  { value: '5years', label: '5 Years' },
  { value: 'indefinite', label: 'Indefinite' },
];

const ManagerSettingsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Organization Info state ──
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [orgDescription, setOrgDescription] = useState(
    'A leading technology company focused on innovation and digital transformation through continuous learning.'
  );
  const [industry, setIndustry] = useState('Technology');
  const [websiteUrl, setWebsiteUrl] = useState('https://www.acmecorp.com');

  // ── Branding state ──
  const [primaryColor, setPrimaryColor] = useState('#ffa424');
  const [themeMode, setThemeMode] = useState<string>('light');

  // ── Learning Preferences state ──
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [certificateAutoIssue, setCertificateAutoIssue] = useState(true);
  const [courseApprovalRequired, setCourseApprovalRequired] = useState(false);
  const [selfEnrollmentAllowed, setSelfEnrollmentAllowed] = useState(true);

  // ── Data & Privacy state ──
  const [dataRetention, setDataRetention] = useState('3years');
  const [gdprCompliance, setGdprCompliance] = useState(true);

  const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newTheme: string | null) => {
    if (newTheme !== null) {
      setThemeMode(newTheme);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <SettingsIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Organization Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your organization
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                borderRadius: '10px',
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 6px 16px rgba(255,164,36,0.4)',
                },
              }}
            >
              Save Changes
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Card 1: Organization Info */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: 20, color: '#ffa424' }} />
                    <Typography fontWeight={700}>Organization Info</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Organization Name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Industry</InputLabel>
                        <Select value={industry} onChange={(e) => setIndustry(e.target.value)} label="Industry">
                          {industryOptions.map((ind) => (
                            <MenuItem key={ind} value={ind}>
                              {ind}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={orgDescription}
                        onChange={(e) => setOrgDescription(e.target.value)}
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Website URL"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://www.example.com"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                        Organization Logo
                      </Typography>
                      <Box
                        sx={{
                          border: '2px dashed',
                          borderColor: 'divider',
                          borderRadius: '12px',
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#ffa424',
                            bgcolor: 'rgba(255,164,36,0.02)',
                          },
                        }}
                      >
                        <UploadIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Click to upload logo
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          PNG, JPG up to 2MB
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Card 2: Branding */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon sx={{ fontSize: 20, color: '#ffa424' }} />
                    <Typography fontWeight={700}>Branding</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Primary Color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#ffa424"
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '6px',
                                bgcolor: primaryColor,
                                mr: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                flexShrink: 0,
                              }}
                            />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                        Theme
                      </Typography>
                      <ToggleButtonGroup
                        value={themeMode}
                        exclusive
                        onChange={handleThemeChange}
                        sx={{
                          gap: 1,
                          '& .MuiToggleButton-root': {
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '12px !important',
                            px: 3,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            gap: 1,
                            '&.Mui-selected': {
                              bgcolor: 'rgba(255,164,36,0.08)',
                              borderColor: '#ffa424',
                              color: '#f97316',
                              '&:hover': {
                                bgcolor: 'rgba(255,164,36,0.12)',
                              },
                            },
                          },
                        }}
                      >
                        <ToggleButton value="light">
                          <LightModeIcon sx={{ fontSize: 20 }} />
                          Light
                        </ToggleButton>
                        <ToggleButton value="dark">
                          <DarkModeIcon sx={{ fontSize: 20 }} />
                          Dark
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Card 3: Learning Preferences */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LearningIcon sx={{ fontSize: 20, color: '#ffa424' }} />
                    <Typography fontWeight={700}>Learning Preferences</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <InputLabel>Default Language</InputLabel>
                        <Select value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)} label="Default Language">
                          {languageOptions.map((lang) => (
                            <MenuItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={certificateAutoIssue}
                            onChange={(e) => setCertificateAutoIssue(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffa424',
                                '&:hover': { backgroundColor: 'rgba(255,164,36,0.08)' },
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#ffa424',
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Certificate Auto-issue
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Automatically issue certificates upon course completion
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={courseApprovalRequired}
                            onChange={(e) => setCourseApprovalRequired(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffa424',
                                '&:hover': { backgroundColor: 'rgba(255,164,36,0.08)' },
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#ffa424',
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Course Approval Required
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Courses need manager approval before publishing
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selfEnrollmentAllowed}
                            onChange={(e) => setSelfEnrollmentAllowed(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffa424',
                                '&:hover': { backgroundColor: 'rgba(255,164,36,0.08)' },
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#ffa424',
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Self-enrollment Allowed
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Users can enroll themselves in available courses
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Card 4: Data & Privacy */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PrivacyIcon sx={{ fontSize: 20, color: '#ffa424' }} />
                    <Typography fontWeight={700}>Data & Privacy</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Data Retention Period</InputLabel>
                        <Select
                          value={dataRetention}
                          onChange={(e) => setDataRetention(e.target.value)}
                          label="Data Retention Period"
                        >
                          {retentionOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={gdprCompliance}
                              onChange={(e) => setGdprCompliance(e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#ffa424',
                                  '&:hover': { backgroundColor: 'rgba(255,164,36,0.08)' },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#ffa424',
                                },
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                GDPR Compliance
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Enable GDPR-compliant data handling
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        variant="outlined"
                        startIcon={<ExportIcon />}
                        sx={{
                          borderColor: '#ffa424',
                          color: '#ffa424',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#f97316',
                            bgcolor: 'rgba(255,164,36,0.04)',
                          },
                        }}
                      >
                        Export All Data
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerSettingsPage;
