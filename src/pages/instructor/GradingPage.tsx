import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Snackbar, Alert } from '@mui/material';

// Layout
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';

// Grading components
import GradingTopBar from '../../components/instructor/grading/GradingTopBar';
import SubmissionsSidebar from '../../components/instructor/grading/SubmissionsSidebar';
import type { SubmissionData } from '../../components/instructor/grading/SubmissionItem';
import GradingHeader from '../../components/instructor/grading/GradingHeader';
import SubmissionTabs from '../../components/instructor/grading/SubmissionTabs';
import type { TabValue } from '../../components/instructor/grading/SubmissionTabs';
import SubmissionCard from '../../components/instructor/grading/SubmissionCard';
import FileAttachment from '../../components/instructor/grading/FileAttachment';
import AnnotationToolbar from '../../components/instructor/grading/AnnotationToolbar';
import type { AnnotationTool, HighlightColor } from '../../components/instructor/grading/AnnotationToolbar';
import RubricPanel from '../../components/instructor/grading/RubricPanel';
import type { GradingCriterion } from '../../components/instructor/grading/RubricCriterionGrading';
import FeedbackSection from '../../components/instructor/grading/FeedbackSection';
import GradingFooter from '../../components/instructor/grading/GradingFooter';

// API services
import { submissionApi } from '../../services/learning.services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Mapper to convert API Submission to internal SubmissionData format
 */
const mapApiSubmissionToSubmissionData = (s: any): SubmissionData => ({
  id: String(s.id),
  studentName: s.user_name || 'Unknown Student',
  studentInitials: (s.user_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
  submittedAt: s.submitted_at ? new Date(s.submitted_at).toLocaleString() : 'N/A',
  status: s.status === 'submitted' ? 'pending' : (s.status === 'graded' ? 'graded' : 'pending'),
  score: s.grade,
  maxScore: 100,
  previewText: s.submitted_text || 'No text content provided.',
});

const createDefaultCriteria = (): GradingCriterion[] => [
  {
    id: '1',
    name: 'Content Quality',
    maxPoints: 40,
    selectedLevel: null,
    score: 0,
    levels: [
      { key: 'excellent', name: 'Excellent', points: 40, color: '#10b981' },
      { key: 'good', name: 'Good', points: 30, color: '#3b82f6' },
      { key: 'satisfactory', name: 'Satisfactory', points: 20, color: '#f59e0b' },
      { key: 'needsWork', name: 'Needs Work', points: 10, color: '#ef4444' },
    ],
  },
  {
    id: '2',
    name: 'Critical Analysis',
    maxPoints: 40,
    selectedLevel: null,
    score: 0,
    levels: [
      { key: 'excellent', name: 'Excellent', points: 40, color: '#10b981' },
      { key: 'good', name: 'Good', points: 30, color: '#3b82f6' },
      { key: 'satisfactory', name: 'Satisfactory', points: 20, color: '#f59e0b' },
      { key: 'needsWork', name: 'Needs Work', points: 10, color: '#ef4444' },
    ],
  },
  {
    id: '3',
    name: 'Presentation',
    maxPoints: 20,
    selectedLevel: null,
    score: 0,
    levels: [
      { key: 'excellent', name: 'Excellent', points: 20, color: '#10b981' },
      { key: 'good', name: 'Good', points: 15, color: '#3b82f6' },
      { key: 'satisfactory', name: 'Satisfactory', points: 10, color: '#f59e0b' },
      { key: 'needsWork', name: 'Needs Work', points: 5, color: '#ef4444' },
    ],
  },
];

const GradingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('submission');
  const [annotationTool, setAnnotationTool] = useState<AnnotationTool>(null);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>('yellow');
  const [criteria, setCriteria] = useState<GradingCriterion[]>(createDefaultCriteria());
  const [feedback, setFeedback] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [toastMsg, setToastMsg] = useState('');

  // Fetch submissions from API (backend scopes to current user's courses for instructors)
  const { data: apiSubmissions, isLoading } = useQuery({
    queryKey: ['instructor-submissions'],
    queryFn: () => submissionApi.getAll().then(res => res.data),
  });

  const rawSubmissions = apiSubmissions?.results ?? [];
  const submissions = rawSubmissions.map(mapApiSubmissionToSubmissionData);

  // Automatically select first submission if none selected
  useEffect(() => {
    if (!selectedId && submissions.length > 0) {
      setSelectedId(submissions[0].id);
    }
  }, [submissions, selectedId]);

  const selectedSubmission = submissions.find((s) => s.id === selectedId);
  const originalSubmission = rawSubmissions.find(s => String(s.id) === selectedId);
  const currentIndex = submissions.findIndex((s) => s.id === selectedId);

  // Grade mutation
  const gradeMutation = useMutation({
    mutationFn: ({ id, grade, feedback }: { id: number; grade: number; feedback: string }) => 
      submissionApi.grade(id, { grade, feedback }),
    onSuccess: () => {
      setToastMsg('Submission graded successfully');
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ['instructor-submissions'] });
      
      // Move to next pending if available
      const nextPending = submissions.find(
        (s, i) => i > currentIndex && s.status === 'pending'
      );
      if (nextPending) {
        setSelectedId(nextPending.id);
        setCriteria(createDefaultCriteria());
        setFeedback('');
      }
    },
    onError: (error: any) => {
      setToastMsg(error.response?.data?.detail || 'Failed to submit grade');
    }
  });

  const handleSelectLevel = (criterionId: string, levelKey: string) => {
    setCriteria((prev) =>
      prev.map((c) => {
        if (c.id !== criterionId) return c;
        const level = c.levels.find((l) => l.key === levelKey);
        return {
          ...c,
          selectedLevel: levelKey,
          score: level?.points ?? c.score,
        };
      })
    );
  };

  const handleScoreChange = (criterionId: string, score: number) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === criterionId
          ? { ...c, score: Math.min(score, c.maxPoints), selectedLevel: null }
          : c
      )
    );
  };

  const handleTemplateClick = (template: string) => {
    setFeedback((prev) => (prev ? `${prev}\n${template}` : template));
  };

  const handleSaveDraft = () => {
    setLastSaved(new Date());
    setToastMsg('Draft saved locally');
  };

  const handleSubmitScore = () => {
    if (!selectedId || !selectedSubmission) return;
    const totalScore = criteria.reduce((acc, c) => acc + c.score, 0);
    gradeMutation.mutate({
      id: Number(selectedId),
      grade: totalScore,
      feedback: feedback,
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedId(submissions[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      setSelectedId(submissions[currentIndex + 1].id);
    }
  };

  if (isLoading && submissions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading submissions...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <GradingTopBar
        assignmentName={originalSubmission?.assignment_title || "Viewing Submission"}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        {/* Grading Content */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Submissions Sidebar */}
          <SubmissionsSidebar
            submissions={submissions}
            selectedId={selectedId}
            onSelectSubmission={setSelectedId}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />

          {/* Main Grading Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedSubmission ? (
              <>
                <GradingHeader
                  studentName={selectedSubmission.studentName}
                  studentInitials={selectedSubmission.studentInitials}
                  email={originalSubmission?.user_email || "student@tasc.edu"}
                  submittedAt={selectedSubmission.submittedAt}
                  fileCount={originalSubmission?.submitted_file_url ? 1 : 0}
                  attemptNumber={1}
                  currentIndex={currentIndex}
                  totalCount={submissions.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />

                <SubmissionTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Grading Body */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
                    overflow: 'hidden',
                  }}
                >
                  {/* Submission View */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <AnnotationToolbar
                      activeTool={annotationTool}
                      activeColor={highlightColor}
                      onToolChange={setAnnotationTool}
                      onColorChange={setHighlightColor}
                    />

                    <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                      {activeTab === 'submission' && (
                        <SubmissionCard title="Text Submission">
                          <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-wrap' }}
                          >
                            {selectedSubmission.previewText}
                          </Typography>
                        </SubmissionCard>
                      )}

                      {activeTab === 'files' && (
                        <SubmissionCard title="Submitted Files">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {originalSubmission?.submitted_file_url ? (
                              <FileAttachment
                                file={{
                                  id: '1',
                                  name: originalSubmission.submitted_file_name || 'attachment',
                                  size: 'N/A',
                                  type: originalSubmission.submitted_file_name?.split('.').pop() || 'file'
                                }}
                                onView={() => window.open(originalSubmission.submitted_file_url, '_blank')}
                                onDownload={() => {
                                  const link = document.createElement('a');
                                  link.href = originalSubmission.submitted_file_url;
                                  link.download = originalSubmission.submitted_file_name || 'attachment';
                                  link.rel = 'noopener noreferrer';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.disabled">No files attached.</Typography>
                            )}
                          </Box>
                        </SubmissionCard>
                      )}

                      {activeTab === 'history' && (
                        <SubmissionCard title="Submission History">
                          <Typography variant="body2" color="text.secondary">
                            Submission ID: {selectedSubmission.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Time: {selectedSubmission.submittedAt}
                          </Typography>
                        </SubmissionCard>
                      )}
                    </Box>
                  </Box>

                  {/* Rubric Panel - Only on large screens */}
                  <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column' }}>
                    <RubricPanel
                      criteria={criteria}
                      onSelectLevel={handleSelectLevel}
                      onScoreChange={handleScoreChange}
                    />
                    <FeedbackSection
                      feedback={feedback}
                      onFeedbackChange={setFeedback}
                      onTemplateClick={handleTemplateClick}
                    />
                  </Box>
                </Box>

                <GradingFooter
                  lastSaved={lastSaved}
                  onSaveDraft={handleSaveDraft}
                  onSubmitNext={handleSubmitScore}
                  isSubmitting={gradeMutation.isPending}
                />
              </>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 6 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Select a submission</Typography>
                <Typography variant="body2" color="text.disabled">Choose a submission from the list to start grading</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar open={!!toastMsg} autoHideDuration={3000} onClose={() => setToastMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toastMsg.includes('Failed') ? 'error' : 'success'} onClose={() => setToastMsg('')} variant="filled">{toastMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default GradingPage;
