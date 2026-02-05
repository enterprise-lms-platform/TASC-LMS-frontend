import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Grid } from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Star as PointsIcon,
  AttachFile as FileIcon,
  AccountTree as TypeIcon,
} from '@mui/icons-material';

// Layout
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// Assignment components
import AssignmentTopBar from '../components/instructor/assignment/AssignmentTopBar';
import AssignmentFooter from '../components/instructor/assignment/AssignmentFooter';
import BasicInfoSection from '../components/instructor/assignment/BasicInfoSection';
import type { AssignmentType } from '../components/instructor/assignment/BasicInfoSection';
import InstructionsSection from '../components/instructor/assignment/InstructionsSection';
import type { Attachment } from '../components/instructor/assignment/InstructionsSection';
import DueDateSection from '../components/instructor/assignment/DueDateSection';
import SubmissionRequirementsSection from '../components/instructor/assignment/SubmissionRequirementsSection';
import type { FileType } from '../components/instructor/assignment/SubmissionRequirementsSection';
import RubricBuilderSection from '../components/instructor/assignment/RubricBuilderSection';
import type { RubricTemplate } from '../components/instructor/assignment/RubricBuilderSection';
import type { RubricCriterionData } from '../components/instructor/assignment/RubricCriterion';
import AssignmentSummaryCard from '../components/instructor/assignment/AssignmentSummaryCard';
import SettingsPanel from '../components/instructor/assignment/SettingsPanel';
import type { SettingOption } from '../components/instructor/assignment/SettingsPanel';
import AssignmentPreviewCard from '../components/instructor/assignment/AssignmentPreviewCard';
import ChecklistWidget from '../components/instructor/assignment/ChecklistWidget';
import type { ChecklistItem } from '../components/instructor/assignment/ChecklistWidget';

// Default data
const defaultInstructions = `
<h3>Assignment Overview</h3>
<p>In this assignment, you will build a library of reusable custom React hooks.</p>
<h3>Requirements</h3>
<ol>
  <li><strong>Create at least 5 custom hooks</strong> that solve common problems</li>
  <li><strong>Write comprehensive documentation</strong> for each hook</li>
  <li><strong>Include TypeScript type definitions</strong></li>
  <li><strong>Write unit tests</strong> with at least 80% coverage</li>
</ol>
`;

const defaultAttachments: Attachment[] = [
  { id: '1', name: 'React_Hooks_Reference.pdf', size: '2.4 MB', type: 'pdf' },
  { id: '2', name: 'starter_template.zip', size: '156 KB', type: 'zip' },
];

const defaultCriteria: RubricCriterionData[] = [
  {
    id: '1',
    name: 'Code Quality',
    description: 'Clean, readable, and well-organized code',
    points: 30,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
  {
    id: '2',
    name: 'Functionality',
    description: 'All features work as specified',
    points: 40,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
  {
    id: '3',
    name: 'Documentation',
    description: 'Clear README and inline comments',
    points: 20,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
  {
    id: '4',
    name: 'Testing',
    description: 'Comprehensive unit tests',
    points: 10,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
];

const defaultSettings: SettingOption[] = [
  { id: 'group', label: 'Group Assignment', description: 'Allow team submissions', enabled: false },
  { id: 'peer', label: 'Peer Review', description: 'Students review each other', enabled: true },
  { id: 'tutorial', label: 'Require Tutorial', description: 'Must complete tutorial first', enabled: false },
  { id: 'ai', label: 'Enable AI Assistance', description: 'Allow AI tools for help', enabled: true },
];

const AssignmentCreationPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(new Date());

  // Basic Info
  const [title, setTitle] = useState('Build a Custom React Hook Library');
  const [module, setModule] = useState('m4');
  const [lesson, setLesson] = useState('l2');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('project');

  // Instructions
  const [instructions, setInstructions] = useState(defaultInstructions);
  const [attachments, setAttachments] = useState<Attachment[]>(defaultAttachments);

  // Due Date
  const [dueDate, setDueDate] = useState('2026-02-20');
  const [dueTime, setDueTime] = useState('23:59');
  const [availableFrom, setAvailableFrom] = useState('2026-02-04');
  const [availableFromTime, setAvailableFromTime] = useState('00:00');
  const [allowLate, setAllowLate] = useState(true);
  const [lateCutoffDate, setLateCutoffDate] = useState('2026-02-27');
  const [penaltyType, setPenaltyType] = useState('percentage');
  const [penaltyPercent, setPenaltyPercent] = useState(10);

  // Submission Requirements
  const [maxPoints, setMaxPoints] = useState(100);
  const [maxAttempts, setMaxAttempts] = useState('unlimited');
  const [allowedFileTypes, setAllowedFileTypes] = useState<FileType[]>(['pdf', 'zip', 'code']);
  const [maxFileSize, setMaxFileSize] = useState(50);

  // Rubric
  const [rubricTemplate, setRubricTemplate] = useState<RubricTemplate>('project');
  const [criteria, setCriteria] = useState<RubricCriterionData[]>(defaultCriteria);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>('1');

  // Settings
  const [settings, setSettings] = useState<SettingOption[]>(defaultSettings);

  // Handlers
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleFileTypeToggle = (type: FileType) => {
    setAllowedFileTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleUpdateCriterion = (id: string, data: Partial<RubricCriterionData>) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCriterion = () => {
    const newId = String(Date.now());
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: 'New Criterion',
        description: '',
        points: 10,
        levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
      },
    ]);
    setExpandedCriterion(newId);
  };

  const handleSettingToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = () => {
    setLastSaved(new Date());
    console.log('Assignment saved');
  };

  // Computed values
  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);
  const checklistItems: ChecklistItem[] = [
    { id: '1', label: 'Add assignment title', complete: !!title },
    { id: '2', label: 'Write instructions', complete: instructions.length > 50 },
    { id: '3', label: 'Set due date', complete: !!dueDate },
    { id: '4', label: 'Configure points', complete: maxPoints > 0 },
    { id: '5', label: 'Add grading rubric', complete: criteria.length > 0 },
  ];

  const previewItems = [
    { icon: <CalendarIcon />, iconBg: '#dbeafe', iconColor: '#3b82f6', label: 'Due Date', value: dueDate },
    { icon: <PointsIcon />, iconBg: '#fef3c7', iconColor: '#f59e0b', label: 'Points', value: `${totalPoints} points` },
    { icon: <FileIcon />, iconBg: '#d1fae5', iconColor: '#10b981', label: 'Submissions', value: allowedFileTypes.join(', ').toUpperCase() },
    { icon: <TypeIcon />, iconBg: '#ede9fe', iconColor: '#8b5cf6', label: 'Type', value: assignmentType.charAt(0).toUpperCase() + assignmentType.slice(1) },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AssignmentTopBar
        courseName="Advanced React Patterns"
        onPreview={() => console.log('Preview')}
        onSave={handleSave}
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

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Main Form */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <BasicInfoSection
                title={title}
                onTitleChange={setTitle}
                module={module}
                onModuleChange={setModule}
                lesson={lesson}
                onLessonChange={setLesson}
                assignmentType={assignmentType}
                onTypeChange={setAssignmentType}
              />

              <InstructionsSection
                instructions={instructions}
                onInstructionsChange={setInstructions}
                attachments={attachments}
                onRemoveAttachment={handleRemoveAttachment}
                onUpload={() => console.log('Upload')}
              />

              <DueDateSection
                dueDate={dueDate}
                onDueDateChange={setDueDate}
                dueTime={dueTime}
                onDueTimeChange={setDueTime}
                availableFrom={availableFrom}
                onAvailableFromChange={setAvailableFrom}
                availableFromTime={availableFromTime}
                onAvailableFromTimeChange={setAvailableFromTime}
                allowLate={allowLate}
                onAllowLateChange={setAllowLate}
                lateCutoffDate={lateCutoffDate}
                onLateCutoffDateChange={setLateCutoffDate}
                penaltyType={penaltyType}
                onPenaltyTypeChange={setPenaltyType}
                penaltyPercent={penaltyPercent}
                onPenaltyPercentChange={setPenaltyPercent}
              />

              <SubmissionRequirementsSection
                maxPoints={maxPoints}
                onMaxPointsChange={setMaxPoints}
                maxAttempts={maxAttempts}
                onMaxAttemptsChange={setMaxAttempts}
                allowedFileTypes={allowedFileTypes}
                onFileTypeToggle={handleFileTypeToggle}
                maxFileSize={maxFileSize}
                onMaxFileSizeChange={setMaxFileSize}
              />

              <RubricBuilderSection
                selectedTemplate={rubricTemplate}
                onTemplateSelect={setRubricTemplate}
                criteria={criteria}
                expandedCriterion={expandedCriterion}
                onToggleCriterion={(id) => setExpandedCriterion(expandedCriterion === id ? null : id)}
                onUpdateCriterion={handleUpdateCriterion}
                onDeleteCriterion={handleDeleteCriterion}
                onAddCriterion={handleAddCriterion}
              />
            </Grid>

            {/* Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Box sx={{ mb: 2 }}>
                  <AssignmentSummaryCard
                    totalPoints={totalPoints}
                    criteriaCount={criteria.length}
                    estimatedTime="2-3 hrs"
                    allowedAttempts={maxAttempts === 'unlimited' ? '∞' : maxAttempts}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <SettingsPanel settings={settings} onToggle={handleSettingToggle} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <AssignmentPreviewCard items={previewItems} onPreview={() => console.log('Preview')} />
                </Box>
                <ChecklistWidget items={checklistItems} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <AssignmentFooter
          lastSaved={lastSaved}
          onSaveDraft={handleSave}
          onPublish={() => console.log('Publish')}
        />
      </Box>
    </Box>
  );
};

export default AssignmentCreationPage;
