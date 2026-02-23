import React, { useState, useCallback, useRef } from 'react';
import { Box, Toolbar, CssBaseline, Snackbar, Alert } from '@mui/material';
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
import GradingConfigSection from '../components/instructor/course-creation/GradingConfigSection';
import { createDefaultGradingConfig } from '../utils/gradingUtils';
import type { GradingConfig } from '../utils/gradingUtils';
import CoursePreview from '../components/instructor/course-creation/CoursePreview';
import CompletionStatus from '../components/instructor/course-creation/CompletionStatus';
import type { StatusItem } from '../components/instructor/course-creation/CompletionStatus';
import FormActions from '../components/instructor/course-creation/FormActions';

// API hooks
import { useCreateCourse, usePartialUpdateCourse } from '../hooks/useCatalogue';
import { uploadThumbnail, uploadBanner } from '../services/upload.services';
import { getErrorMessage } from '../utils/config';
import type { CourseCreateRequest } from '../types/types';

// Initial form data
const initialBasicInfo: BasicInfoData = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  subcategory: '',
  tags: [],
};

const initialMedia: MediaData = {
  thumbnail: null,
  thumbnailFile: null,
  banner: null,
  bannerFile: null,
  promoVideoUrl: '',
};

const initialDetails: DetailsData = {
  objectives: ['', '', '', ''],
  difficulty: 'intermediate',
  durationHours: 0,
  durationMinutes: 0,
  requirements: '',
  targetAudience: '',
};

const initialPricing: PricingData = {
  pricingType: 'free',
  price: 0,
  originalPrice: 0,
  currency: 'USD',
};

const initialSettings: SettingsData = {
  isPublic: false,
  selfEnrollment: true,
  certificate: false,
  discussions: false,
  sequential: false,
  enrollmentLimit: null,
  accessDuration: 'lifetime',
  startDate: '',
  endDate: '',
};

const TOTAL_STEPS = 4;

const CourseCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Course ID — null until first save (POST), then stores returned ID for subsequent PATCHes
  const [courseId, setCourseId] = useState<number | null>(null);

  // Snackbar for feedback
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Form data state
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(initialBasicInfo);
  const [media, setMedia] = useState<MediaData>(initialMedia);
  const [details, setDetails] = useState<DetailsData>(initialDetails);
  const [pricing, setPricing] = useState<PricingData>(initialPricing);
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [gradingConfig, setGradingConfig] = useState<GradingConfig>(createDefaultGradingConfig());

  // API mutations
  const createCourse = useCreateCourse();
  const updateCourse = usePartialUpdateCourse();

  // Autosave timer ref
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Build the API payload from form state.
   * Maps frontend field names → backend field names.
   */
  const buildPayload = (statusOverride?: string): Partial<CourseCreateRequest> => {
    const payload: Partial<CourseCreateRequest> = {
      // Basic info
      title: basicInfo.title,
      description: basicInfo.fullDescription,
      short_description: basicInfo.shortDescription,
      subcategory: basicInfo.subcategory,
      ...(basicInfo.category !== '' && { category: basicInfo.category }),
      tags: basicInfo.tags,

      // Media — URLs only (files are uploaded separately)
      trailer_video_url: media.promoVideoUrl || null,

      // Details
      learning_objectives_list: details.objectives.filter((o) => o.trim()),
      level: details.difficulty as CourseCreateRequest['level'],
      duration_hours: details.durationHours,
      duration_minutes: details.durationMinutes,
      prerequisites: details.requirements,
      target_audience: details.targetAudience,

      // Pricing
      price: pricing.pricingType === 'free' ? '0.00' : String(pricing.price),
      currency: pricing.currency,
      discount_percentage:
        pricing.originalPrice > pricing.price && pricing.originalPrice > 0
          ? Math.round(((pricing.originalPrice - pricing.price) / pricing.originalPrice) * 100)
          : 0,

      // Settings
      is_public: settings.isPublic,
      allow_self_enrollment: settings.selfEnrollment,
      certificate_on_completion: settings.certificate,
      enable_discussions: settings.discussions,
      sequential_learning: settings.sequential,
      enrollment_limit: settings.enrollmentLimit,
      access_duration: settings.accessDuration,
      start_date: settings.startDate || null,
      end_date: settings.endDate || null,

      // Grading
      grading_config: gradingConfig as unknown as Record<string, unknown>,
    };

    if (statusOverride) {
      payload.status = statusOverride as CourseCreateRequest['status'];
    }

    return payload;
  };

  /**
   * Upload media files to DO Spaces and return their CDN URLs.
   */
  const uploadMediaFiles = async (): Promise<{ thumbnail?: string; banner?: string }> => {
    const urls: { thumbnail?: string; banner?: string } = {};

    if (media.thumbnailFile) {
      urls.thumbnail = await uploadThumbnail(media.thumbnailFile);
    }
    if (media.bannerFile) {
      urls.banner = await uploadBanner(media.bannerFile);
    }

    return urls;
  };

  /**
   * Save course to API. Creates draft on first call, patches on subsequent calls.
   */
  const saveCourse = async (statusOverride?: string) => {
    if (!basicInfo.title.trim()) {
      setSnackbar({ open: true, message: 'Course title is required to save.', severity: 'error' });
      return null;
    }

    setSaveStatus('saving');

    try {
      const payload = buildPayload(statusOverride);

      // Try uploading media files to DO Spaces (skip gracefully if not configured)
      try {
        const mediaUrls = await uploadMediaFiles();
        if (mediaUrls.thumbnail) {
          payload.thumbnail = mediaUrls.thumbnail;
          setMedia((prev) => ({ ...prev, thumbnailFile: null, thumbnail: mediaUrls.thumbnail! }));
        }
        if (mediaUrls.banner) {
          payload.banner = mediaUrls.banner;
          setMedia((prev) => ({ ...prev, bannerFile: null, banner: mediaUrls.banner! }));
        }
      } catch (uploadErr) {
        // DO Spaces upload not configured yet — skip media upload, save course without it
        console.warn('Media upload skipped (DO Spaces not configured):', uploadErr);
      }

      // Keep existing media URLs if no new upload
      if (!payload.thumbnail && media.thumbnail && !media.thumbnailFile) {
        payload.thumbnail = media.thumbnail;
      }
      if (!payload.banner && media.banner && !media.bannerFile) {
        payload.banner = media.banner;
      }

      let result;
      if (courseId === null) {
        // First save — POST to create draft
        result = await createCourse.mutateAsync(payload as CourseCreateRequest);
        setCourseId(result.id);
      } else {
        // Subsequent saves — PATCH to update
        result = await updateCourse.mutateAsync({ id: courseId, data: payload });
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return result;
    } catch (error: any) {
      console.error('Course save failed:', error?.response?.data || error);
      setSaveStatus('idle');
      const message = getErrorMessage(error);
      setSnackbar({ open: true, message, severity: 'error' });
      return null;
    }
  };

  // Autosave with debounce (3s after last change)
  const triggerAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      // Only autosave if we have a title (minimum for draft)
      if (basicInfo.title.trim()) {
        saveCourse();
      }
    }, 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfo.title, courseId]);

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

  const handleGradingConfigChange = (data: GradingConfig) => {
    setGradingConfig(data);
    triggerAutosave();
  };

  // Navigation
  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep < TOTAL_STEPS) {
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

  const handleSaveDraft = async () => {
    const result = await saveCourse('draft');
    if (result) {
      setSnackbar({ open: true, message: 'Course saved as draft!', severity: 'success' });
    }
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

  const handlePublish = async () => {
    // Save course metadata and navigate to curriculum builder
    const result = await saveCourse('draft');
    if (result) {
      setSnackbar({ open: true, message: 'Course saved! Redirecting to curriculum builder...', severity: 'success' });
      navigate(`/instructor/course/${result.id}/structure`);
    }
  };

  // Completion status items
  const statusItems: StatusItem[] = [
    { id: 'basic', label: 'Basic information', status: basicInfo.title ? 'complete' : 'incomplete' },
    { id: 'thumbnail', label: 'Course thumbnail', status: media.thumbnail ? 'complete' : 'warning' },
    {
      id: 'objectives',
      label: `Learning objectives (${details.objectives.filter((o) => o.trim()).length}/4)`,
      status: details.objectives.filter((o) => o.trim()).length >= 4 ? 'complete' : 'warning',
    },
    { id: 'pricing', label: 'Pricing configured', status: pricing.pricingType ? 'complete' : 'incomplete' },
    { id: 'settings', label: 'Settings reviewed', status: completedSteps.includes(4) ? 'complete' : 'incomplete' },
    { id: 'grading', label: 'Grading configured', status: gradingConfig.gradingScale ? 'complete' : 'incomplete' },
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
        return <PricingSection data={pricing} onChange={handlePricingChange} />;
      case 4:
        return (
          <>
            <SettingsSection data={settings} onChange={handleSettingsChange} />
            <Box sx={{ mt: 3 }}>
              <GradingConfigSection data={gradingConfig} onChange={handleGradingConfigChange} />
            </Box>
          </>
        );
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
            </Box>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <FormActions
          currentStep={activeStep}
          totalSteps={TOTAL_STEPS}
          onSaveDraft={handleSaveDraft}
          onDiscard={handleDiscard}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPublish={handlePublish}
        />
      </Box>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseCreationPage;
