import React, { useState, useRef } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  Tabs, Tab, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from '@mui/material';
import {
  Assignment as AssignIcon, CheckCircle as DoneIcon,
  AccessTime as TimeIcon, TrendingUp as ScoreIcon,
  Upload as UploadIcon, Visibility as ViewIcon,
  Schedule as PendingIcon, Lock as LockIcon,
  Description as FileIcon, CloudUpload as CloudIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { submissionApi } from '../../services/learning.services';
import { uploadApi } from '../../services/upload.services';
import { useCreateSubmission } from '../../hooks/useSubmissions';
import type { Submission } from '../../types/types';

/* ── Status mapping ── */

type AssignStatus = 'graded' | 'submitted' | 'pending' | 'overdue' | 'locked';
const statusStyles: Record<AssignStatus, { bg: string; color: string; label: string }> = {
  graded:    { bg: 'rgba(16,185,129,0.08)', color: '#10b981', label: 'Graded' },
  submitted: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6', label: 'Submitted' },
  pending:   { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', label: 'Pending' },
  overdue:   { bg: 'rgba(239,68,68,0.08)', color: '#ef4444', label: 'Overdue' },
  locked:    { bg: 'rgba(156,163,175,0.08)', color: '#9ca3af', label: 'Locked' },
};

function mapSubmissionStatus(s: Submission): AssignStatus {
  if (s.grade != null) return 'graded';
  if (s.status === 'submitted' || s.status === 'pending_review') return 'submitted';
  if (s.status === 'rejected') return 'overdue';
  return 'pending';
}

function gradeLabel(grade: number | null | undefined): string | undefined {
  if (grade == null) return undefined;
  if (grade >= 90) return 'A';
  if (grade >= 85) return 'A-';
  if (grade >= 80) return 'B+';
  if (grade >= 75) return 'B';
  if (grade >= 70) return 'B-';
  if (grade >= 65) return 'C+';
  if (grade >= 60) return 'C';
  return 'F';
}

/* ── KPI config ── */

const kpiConfig = [
  {
    label: 'Total Assignments',
    icon: <AssignIcon />,
    bgcolor: '#dbeafe', iconBg: '#93c5fd', color: '#1e3a8a', subColor: '#1e40af',
  },
  {
    label: 'Submitted',
    icon: <DoneIcon />,
    bgcolor: '#dcfce7', iconBg: '#86efac', color: '#14532d', subColor: '#166534',
  },
  {
    label: 'Avg. Grade',
    icon: <ScoreIcon />,
    bgcolor: '#ffedd5', iconBg: '#fdba74', color: '#7c2d12', subColor: '#9a3412',
  },
  {
    label: 'Pending',
    icon: <PendingIcon />,
    bgcolor: '#f3e8ff', iconBg: '#d8b4fe', color: '#581c87', subColor: '#6b21a8',
  },
];

/* ── Component ── */

const LearnerAssignmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Submit modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitTarget, setSubmitTarget] = useState<{ enrollmentId: number; assignmentId: number; title: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createSubmission = useCreateSubmission();

  const handleOpenSubmitModal = (enrollmentId: number, assignmentId: number, title: string) => {
    setSubmitTarget({ enrollmentId, assignmentId, title });
    setSelectedFile(null);
    setSubmitModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setToast({ open: true, message: 'File must be under 50MB', severity: 'error' });
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmitAssignment = async () => {
    if (!submitTarget || !selectedFile) return;
    try {
      setUploading(true);
      const publicUrl = await uploadApi.uploadToSpaces(selectedFile, 'session-assets');
      await createSubmission.mutateAsync({
        enrollment: submitTarget.enrollmentId,
        assignment: submitTarget.assignmentId,
        submitted_file_url: publicUrl,
        submitted_file_name: selectedFile.name,
      });
      setToast({ open: true, message: 'Assignment submitted successfully!', severity: 'success' });
      setSubmitModalOpen(false);
    } catch (err: any) {
      console.error(err);
      const backendError = err?.response?.data;
      let errorMsg = 'Failed to submit assignment. Please try again.';
      
      if (backendError) {
        if (backendError.non_field_errors?.length) {
          errorMsg = backendError.non_field_errors[0];
        } else if (backendError.submitted_file_name?.length) {
          errorMsg = backendError.submitted_file_name[0];
        } else if (backendError.detail) {
          errorMsg = backendError.detail;
        }
      }
      
      setToast({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const { data: submissionsRaw, isLoading } = useQuery({
    queryKey: ['learner-submissions'],
    queryFn: () => submissionApi.getAll().then((r) => r.data),
  });

  const submissions: Submission[] = Array.isArray(submissionsRaw)
    ? submissionsRaw
    : (submissionsRaw as any)?.results ?? [];

  // Derive assignment rows from submissions
  const assignments = submissions.map((s) => {
    const status = mapSubmissionStatus(s);
    const grade = gradeLabel(s.grade);
    return {
      id: String(s.id),
      enrollmentId: s.enrollment,
      assignmentId: s.assignment,
      title: s.assignment_title || s.session_title || `Assignment #${s.assignment}`,
      course: `Enrollment #${s.enrollment}`,
      type: 'Assignment',
      dueDate: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      submittedDate: s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
      grade,
      score: s.grade ?? undefined,
      maxScore: 100,
      feedback: s.feedback ?? undefined,
      status,
      hasFile: !!s.submitted_file_url,
    };
  });

  // KPI values
  const totalCount = assignments.length;
  const submittedCount = assignments.filter((a) => a.status === 'graded' || a.status === 'submitted').length;
  const gradedAssignments = assignments.filter((a) => a.score != null);
  const avgGrade = gradedAssignments.length > 0
    ? gradeLabel(Math.round(gradedAssignments.reduce((sum, a) => sum + (a.score ?? 0), 0) / gradedAssignments.length)) ?? '—'
    : '—';
  const pendingCount = assignments.filter((a) => a.status === 'pending' || a.status === 'overdue').length;

  const kpis = kpiConfig.map((k, i) => ({
    ...k,
    value: i === 0 ? String(totalCount) : i === 1 ? String(submittedCount) : i === 2 ? avgGrade : String(pendingCount),
  }));

  const tabLabels = ['All', 'Graded', 'Submitted', 'Pending', 'Overdue', 'Locked'];
  const tabFilter: Record<number, AssignStatus | null> = { 0: null, 1: 'graded', 2: 'submitted', 3: 'pending', 4: 'overdue', 5: 'locked' };

  const filtered = assignments.filter((a) => {
    const f = tabFilter[activeTab];
    return f ? a.status === f : true;
  });

  const gradeColor = (grade?: string) => {
    if (!grade) return 'text.primary';
    if (grade.startsWith('A')) return '#10b981';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, overflowX: 'hidden', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>Assignments</Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>Manage your assignments, track grades, and submit work</Typography>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, i) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${i}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: { xs: 110, md: 160 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: k.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {k.icon}
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: k.color,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {isLoading ? '...' : k.value}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: k.subColor,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    opacity: 0.8,
                  }}
                >
                  {k.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Assignments List */}
        <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 1.5 }, '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 } }}>
              {tabLabels.map((l) => <Tab key={l} label={l} />)}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {isLoading ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <AssignIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No assignments found</Typography>
              </Box>
            ) : (
              filtered.map((a) => {
                const st = statusStyles[a.status];
                return (
                  <Box key={a.id} sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: 2, mb: 1, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: a.status !== 'locked' ? 'pointer' : 'default', opacity: a.status === 'locked' ? 0.6 : 1, '&:hover': a.status !== 'locked' ? { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } : {} }}>
                    {/* Icon */}
                    <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: st.bg, color: st.color, '& svg': { fontSize: 22 } }}>
                      {a.status === 'graded' ? <DoneIcon /> : a.status === 'submitted' ? <FileIcon /> : a.status === 'locked' ? <LockIcon /> : a.status === 'overdue' ? <TimeIcon /> : <AssignIcon />}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.title}</Typography>
                        <Chip label={a.type} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.04)' }} />
                        <Chip label={st.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: st.bg, color: st.color }} />
                      </Box>
                      <Typography color="text.disabled" sx={{ fontSize: '0.78rem', mb: 0.5 }}>{a.course}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.disabled', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                        <span>Due: {a.dueDate}</span>
                        {a.submittedDate && <span>Submitted: {a.submittedDate}</span>}
                        {a.hasFile && <span>File attached</span>}
                        <span>Max: {a.maxScore} pts</span>
                      </Box>
                      {a.feedback && (
                        <Typography sx={{ mt: 0.75, fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.02)', p: 1, borderRadius: '8px' }}>
                          "{a.feedback}"
                        </Typography>
                      )}
                    </Box>

                    {/* Grade + Action */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      {a.grade && (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: gradeColor(a.grade) }}>{a.grade}</Typography>
                          <Typography color="text.disabled" sx={{ fontSize: '0.65rem' }}>{a.score}/{a.maxScore}</Typography>
                        </Box>
                      )}
                      {a.status === 'graded' && (
                        <Button size="small" variant="outlined" startIcon={<ViewIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', borderRadius: '50px', borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary' }}>View</Button>
                      )}
                      {a.status === 'pending' && (
                        <Button size="small" variant="contained" startIcon={<UploadIcon />} onClick={() => handleOpenSubmitModal(a.enrollmentId, a.assignmentId, a.title)} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', borderRadius: '50px', boxShadow: 'none', px: 2, color: 'white', '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' } }}>Submit</Button>
                      )}
                      {a.status === 'overdue' && (
                        <Button size="small" variant="contained" color="error" startIcon={<UploadIcon />} onClick={() => handleOpenSubmitModal(a.enrollmentId, a.assignmentId, a.title)} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', borderRadius: '50px', boxShadow: 'none', px: 2 }}>Late Submit</Button>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Grade Summary */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['A', 'B', 'C'].map((g) => {
                const count = assignments.filter((a) => a.grade?.startsWith(g)).length;
                return (
                  <Box key={g} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: gradeColor(g) }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>{g}: {count}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography color="text.disabled" sx={{ fontSize: '0.78rem' }}>
              {assignments.filter((a) => a.status === 'graded').length} graded · {assignments.filter((a) => a.status === 'pending').length} pending
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Submit Assignment Modal */}
      <Dialog open={submitModalOpen} onClose={() => !uploading && setSubmitModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Submit Assignment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {submitTarget?.title}
          </Typography>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '2px dashed',
              borderColor: selectedFile ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: selectedFile ? 'rgba(25,118,210,0.04)' : 'grey.50',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(25,118,210,0.04)' },
            }}
          >
            <CloudIcon sx={{ fontSize: 40, color: selectedFile ? 'primary.main' : 'grey.400', mb: 1 }} />
            {selectedFile ? (
              <>
                <Typography variant="body2" fontWeight={600}>{selectedFile.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB — Click to change
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" fontWeight={500}>Click to select a file</Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF, ZIP, DOC, images — up to 50MB
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSubmitModalOpen(false)} disabled={uploading} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitAssignment}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LearnerAssignmentsPage;
