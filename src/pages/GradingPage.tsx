import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';

// Layout
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// Grading components
import GradingTopBar from '../components/instructor/grading/GradingTopBar';
import SubmissionsSidebar from '../components/instructor/grading/SubmissionsSidebar';
import type { SubmissionData } from '../components/instructor/grading/SubmissionItem';
import GradingHeader from '../components/instructor/grading/GradingHeader';
import SubmissionTabs from '../components/instructor/grading/SubmissionTabs';
import type { TabValue } from '../components/instructor/grading/SubmissionTabs';
import SubmissionCard from '../components/instructor/grading/SubmissionCard';
import FileAttachment from '../components/instructor/grading/FileAttachment';
import type { FileData } from '../components/instructor/grading/FileAttachment';
import AnnotationToolbar from '../components/instructor/grading/AnnotationToolbar';
import type { AnnotationTool, HighlightColor } from '../components/instructor/grading/AnnotationToolbar';
import RubricPanel from '../components/instructor/grading/RubricPanel';
import type { GradingCriterion } from '../components/instructor/grading/RubricCriterionGrading';
import FeedbackSection from '../components/instructor/grading/FeedbackSection';
import GradingFooter from '../components/instructor/grading/GradingFooter';

// Sample data; replacewith use effect and the api call from main.ts file
const sampleSubmissions: SubmissionData[] = [
  {
    id: '1',
    studentName: 'Jennifer Smith',
    studentInitials: 'JS',
    submittedAt: 'Feb 4, 10:23 AM',
    status: 'pending',
    previewText: 'This essay explores the fundamental differences between useState and useReducer hooks in React, examining when each is most appropriate...',
  },
  {
    id: '2',
    studentName: 'Michael Chen',
    studentInitials: 'MC',
    submittedAt: 'Feb 4, 9:45 AM',
    status: 'pending',
    previewText: 'React hooks have revolutionized how we manage state in functional components. In this analysis...',
  },
  {
    id: '3',
    studentName: 'Emma Wilson',
    studentInitials: 'EW',
    submittedAt: 'Feb 4, 8:12 AM',
    status: 'graded',
    score: 85,
    maxScore: 100,
    previewText: 'The useEffect hook is one of the most powerful features in React. It allows us to perform side effects...',
  },
  {
    id: '4',
    studentName: 'David Johnson',
    studentInitials: 'DJ',
    submittedAt: 'Feb 5, 2:30 AM',
    status: 'pending',
    isLate: true,
    previewText: 'Custom hooks enable us to extract component logic into reusable functions...',
  },
  {
    id: '5',
    studentName: 'Sarah Brown',
    studentInitials: 'SB',
    submittedAt: 'Feb 3, 11:59 PM',
    status: 'graded',
    score: 92,
    maxScore: 100,
    previewText: 'Context API combined with useReducer provides a powerful state management solution...',
  },
];

const sampleFiles: FileData[] = [
  { id: '1', name: 'custom-hooks-library.zip', size: '156 KB', type: 'zip' },
  { id: '2', name: 'documentation.pdf', size: '2.4 MB', type: 'pdf' },
  { id: '3', name: 'useDebounce.ts', size: '4.2 KB', type: 'code' },
];

const createDefaultCriteria = (): GradingCriterion[] => [
  {
    id: '1',
    name: 'Code Quality',
    maxPoints: 30,
    selectedLevel: null,
    score: 0,
    levels: [
      { key: 'excellent', name: 'Excellent', points: 30, color: '#10b981' },
      { key: 'good', name: 'Good', points: 23, color: '#3b82f6' },
      { key: 'satisfactory', name: 'Satisfactory', points: 15, color: '#f59e0b' },
      { key: 'needsWork', name: 'Needs Work', points: 8, color: '#ef4444' },
    ],
  },
  {
    id: '2',
    name: 'Functionality',
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
    name: 'Documentation',
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
  {
    id: '4',
    name: 'Testing',
    maxPoints: 10,
    selectedLevel: null,
    score: 0,
    levels: [
      { key: 'excellent', name: 'Excellent', points: 10, color: '#10b981' },
      { key: 'good', name: 'Good', points: 8, color: '#3b82f6' },
      { key: 'satisfactory', name: 'Satisfactory', points: 5, color: '#f59e0b' },
      { key: 'needsWork', name: 'Needs Work', points: 2, color: '#ef4444' },
    ],
  },
];

const GradingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [activeTab, setActiveTab] = useState<TabValue>('submission');
  const [annotationTool, setAnnotationTool] = useState<AnnotationTool>(null);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>('yellow');
  const [criteria, setCriteria] = useState<GradingCriterion[]>(createDefaultCriteria());
  const [feedback, setFeedback] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();

  const selectedSubmission = sampleSubmissions.find((s) => s.id === selectedId);
  const currentIndex = sampleSubmissions.findIndex((s) => s.id === selectedId);

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
    console.log('Draft saved');
  };

  const handleSubmitNext = () => {
    setLastSaved(new Date());
    // Move to next pending submission
    const nextPending = sampleSubmissions.find(
      (s, i) => i > currentIndex && s.status === 'pending'
    );
    if (nextPending) {
      setSelectedId(nextPending.id);
      setCriteria(createDefaultCriteria());
      setFeedback('');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedId(sampleSubmissions[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < sampleSubmissions.length - 1) {
      setSelectedId(sampleSubmissions[currentIndex + 1].id);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <GradingTopBar
        assignmentName="Build a Custom React Hook Library"
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
            submissions={sampleSubmissions}
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
                  email={`${selectedSubmission.studentName.toLowerCase().replace(' ', '.')}@university.edu`}
                  submittedAt={selectedSubmission.submittedAt}
                  fileCount={sampleFiles.length}
                  attemptNumber={1}
                  currentIndex={currentIndex}
                  totalCount={sampleSubmissions.length}
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
                            sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                          >
                            {selectedSubmission.previewText}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.8, color: 'text.secondary', mt: 2 }}
                          >
                            React hooks represent a fundamental shift in how we think about component
                            logic. Prior to hooks, class components were the only way to manage
                            state and lifecycle methods. With the introduction of hooks in React
                            16.8, functional components gained the ability to be stateful, leading
                            to cleaner, more composable code.
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.8, color: 'text.secondary', mt: 2 }}
                          >
                            The useState hook is the most basic hook, allowing us to add state to
                            functional components. It returns a tuple containing the current state
                            value and a function to update it. This simple pattern forms the
                            foundation for more complex state management patterns.
                          </Typography>
                        </SubmissionCard>
                      )}

                      {activeTab === 'files' && (
                        <SubmissionCard title="Submitted Files">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {sampleFiles.map((file) => (
                              <FileAttachment
                                key={file.id}
                                file={file}
                                onView={() => console.log('View', file.name)}
                                onDownload={() => console.log('Download', file.name)}
                              />
                            ))}
                          </Box>
                        </SubmissionCard>
                      )}

                      {activeTab === 'history' && (
                        <SubmissionCard title="Submission History">
                          <Typography variant="body2" color="text.secondary">
                            Submission received on {selectedSubmission.submittedAt}
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
                  onSubmitNext={handleSubmitNext}
                />
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  p: 6,
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Select a submission
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Choose a submission from the list to start grading
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GradingPage;
