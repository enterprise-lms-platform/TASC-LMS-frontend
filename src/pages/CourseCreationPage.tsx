import React, { useState, useCallback } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Layout components
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// Course creation components
import CourseTopBar from '../components/instructor/course-creation/CourseTopBar';
import type { SaveStatus } from '../components/instructor/course-creation/CourseTopBar';
import ProgressStepper from '../components/instructor/course-creation/ProgressStepper';
import BasicInfoSection from '../components/instructor/course-creation/BasicInfoSection';
import type { BasicInfoData } from '../components/instructor/course-creation/BasicInfoSection';
import MediaSection from '../components/instructor/course-creation/MediaSection';
import type { MediaData } from '../components/instructor/course-creation/MediaSection';
import DetailsSection from '../components/instructor/course-creation/DetailsSection';
import type { DetailsData } from '../components/instructor/course-creation/DetailsSection';
import PricingSection from '../components/instructor/course-creation/PricingSection';
import type { PricingData } from '../components/instructor/course-creation/PricingSection';
import SettingsSection from '../components/instructor/course-creation/SettingsSection';
import type { SettingsData } from '../components/instructor/course-creation/SettingsSection';
import CoursePreview from '../components/instructor/course-creation/CoursePreview';
import CompletionStatus from '../components/instructor/course-creation/CompletionStatus';
import type { StatusItem } from '../components/instructor/course-creation/CompletionStatus';
import QuickActionsCard from '../components/instructor/course-creation/QuickActionsCard';
import FormActions from '../components/instructor/course-creation/FormActions';

// Initial form data
const initialBasicInfo: BasicInfoData = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  subcategory: '',
  tags: ['React', 'JavaScript', 'Web Development'],
};

const initialMedia: MediaData = {
  thumbnail: null,
  thumbnailFile: null,
  banner: null,
  bannerFile: null,
  promoVideoUrl: '',
};

const initialDetails: DetailsData = {
  objectives: [
    'Build production-ready React applications using advanced patterns',
    'Implement render props and higher-order components',
    'Create custom hooks for reusable logic',
    'Optimize React applications for performance',
  ],
  difficulty: 'intermediate',
  durationHours: 24,
  durationMinutes: 30,
  requirements:
    '• Basic understanding of JavaScript ES6+ features\n• Familiarity with React fundamentals (components, props, state)\n• Node.js and npm installed on your computer\n• A code editor (VS Code recommended)',
  targetAudience:
    'This course is designed for React developers who want to level up their skills and learn professional-grade patterns used in production applications.',
};

const initialPricing: PricingData = {
  pricingType: 'paid',
  price: 129.99,
  originalPrice: 199.99,
  currency: 'USD',
};

const initialSettings: SettingsData = {
  isPublic: true,
  selfEnrollment: true,
  certificate: true,
  discussions: true,
  sequential: false,
  enrollmentLimit: null,
  accessDuration: 'lifetime',
  startDate: '',
  endDate: '',
};

const CourseCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Form data state
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(initialBasicInfo);
  const [media, setMedia] = useState<MediaData>(initialMedia);
  const [details, setDetails] = useState<DetailsData>(initialDetails);
  const [pricing, setPricing] = useState<PricingData>(initialPricing);
  const [settings, setSettings] = useState<SettingsData>(initialSettings);

  // Autosave effect
  const triggerAutosave = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  }, []);

  // Handle form changes with autosave
  const handleBasicInfoChange = (data: BasicInfoData) => {
    setBasicInfo(data);
    triggerAutosave();
  };

  const handleMediaChange = (data: MediaData) => {
    setMedia(data);
    triggerAutosave();
  };

  const handleDetailsChange = (data: DetailsData) => {
    setDetails(data);
    triggerAutosave();
  };

  const handlePricingChange = (data: PricingData) => {
    setPricing(data);
    triggerAutosave();
  };

  const handleSettingsChange = (data: SettingsData) => {
    setSettings(data);
    triggerAutosave();
  };

  // Navigation
  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep < 5) {
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      navigate('/instructor');
    }
  };

  const handleSaveDraft = () => {
    alert('Course saved as draft!');
  };

  const handleDiscard = () => {
    if (
      confirm('Are you sure you want to discard all changes? This action cannot be undone.')
    ) {
      window.location.reload();
    }
  };

  const handlePreview = () => {
    alert('Opening course preview in new tab...');
  };

  const handlePublish = () => {
    // Direct navigation for smoother flow
    // In production, you would validate and save first
    console.log('Publishing course and redirecting...');
    navigate('/instructor/course/1/preview');
  };

  // Completion status items. to be replaced
  const statusItems: StatusItem[] = [
    { id: 'basic', label: 'Basic information', status: basicInfo.title ? 'complete' : 'incomplete' },
    { id: 'thumbnail', label: 'Course thumbnail', status: media.thumbnail ? 'complete' : 'warning' },
    {
      id: 'objectives',
      label: `Learning objectives (${details.objectives.filter((o) => o).length}/4)`,
      status: details.objectives.filter((o) => o).length >= 4 ? 'complete' : 'warning',
    },
    { id: 'curriculum', label: 'Course curriculum', status: 'warning' },
    { id: 'lesson', label: 'At least 1 lesson', status: 'incomplete' },
    { id: 'pricing', label: 'Pricing configured', status: pricing.pricingType ? 'complete' : 'incomplete' },
  ];

  // Render current section
  const renderSection = () => {
    switch (activeStep) {
      case 1:
        return (
          <>
            <BasicInfoSection data={basicInfo} onChange={handleBasicInfoChange} />
            <Box sx={{ mt: 3 }}>
              <MediaSection data={media} onChange={handleMediaChange} />
            </Box>
          </>
        );
      case 2:
        return <DetailsSection data={details} onChange={handleDetailsChange} />;
      case 3:
        return (
          <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
            Curriculum builder will be implemented here
          </Box>
        );
      case 4:
        return <PricingSection data={pricing} onChange={handlePricingChange} />;
      case 5:
        return <SettingsSection data={settings} onChange={handleSettingsChange} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* TopBar */}
      <CourseTopBar
        saveStatus={saveStatus}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
        onBack={handleBack}
        onPreview={handlePreview}
        onPublish={handlePublish}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} /> {/* Spacer for fixed AppBar */}

        {/* Content Area */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowX: 'hidden' }}>
          {/* Progress Stepper */}
          <ProgressStepper
            activeStep={activeStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />

          {/* Main Layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 350px' },
              gap: 3,
            }}
          >
            {/* Left Column - Form Sections */}
            <Box>{renderSection()}</Box>

            {/* Right Column - Preview & Status */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                position: { lg: 'sticky' },
                top: { lg: 100 },
                alignSelf: 'flex-start',
              }}
            >
              <CoursePreview
                title={basicInfo.title}
                description={basicInfo.shortDescription}
                thumbnail={media.thumbnail}
                difficulty={details.difficulty}
                duration={{ hours: details.durationHours, minutes: details.durationMinutes }}
                price={pricing.price}
                pricingType={pricing.pricingType}
                currency={pricing.currency}
              />

              <CompletionStatus status="draft" items={statusItems} />

              <QuickActionsCard
                onAddModule={() => alert('Opening Add Module dialog...')}
                onAddLesson={() => alert('Opening Add Lesson dialog...')}
                onAddQuiz={() => alert('Opening Quiz Builder...')}
                onAddAssignment={() => alert('Opening Assignment Creator...')}
                onUploadVideo={() => alert('Opening Video Upload dialog...')}
                onImportScorm={() => alert('Opening SCORM Import dialog...')}
              />
            </Box>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <FormActions
          currentStep={activeStep}
          totalSteps={5}
          onSaveDraft={handleSaveDraft}
          onDiscard={handleDiscard}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPublish={handlePublish}
        />
      </Box>
    </Box>
  );
};

export default CourseCreationPage;
