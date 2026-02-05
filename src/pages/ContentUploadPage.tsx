import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';
import UploadTopBar from '../components/instructor/content-upload/UploadTopBar';
import UploadFooter from '../components/instructor/content-upload/UploadFooter';
import UploadTypeSelector from '../components/instructor/content-upload/UploadTypeSelector';
import type { ContentType } from '../components/instructor/content-upload/UploadTypeSelector';
import UploadZone from '../components/instructor/content-upload/UploadZone';
import ExternalLinkForm from '../components/instructor/content-upload/ExternalLinkForm';
import ContentDetailsForm from '../components/instructor/content-upload/ContentDetailsForm';
import DestinationSelector from '../components/instructor/content-upload/DestinationSelector';
import type { Destination } from '../components/instructor/content-upload/DestinationSelector';
import UploadTipsCard from '../components/instructor/content-upload/UploadTipsCard';
import StorageInfoCard from '../components/instructor/content-upload/StorageInfoCard';
import RecentUploadsCard from '../components/instructor/content-upload/RecentUploadsCard';
import type { RecentUploadItem } from '../components/instructor/content-upload/RecentUploadsCard';

const sampleDestinations: Destination[] = [
  { id: '1', type: 'module', name: 'Module 1: Introduction', path: 'Introduction to React Patterns' },
  { id: '2', type: 'lesson', name: 'Lesson 1.1', path: 'Module 1 > Welcome & Overview' },
  { id: '3', type: 'module', name: 'Module 2: HOC', path: 'Higher-Order Components' },
];

const sampleRecentUploads: RecentUploadItem[] = [
  { id: '1', name: 'intro-video.mp4', type: 'video', time: '2 hours ago' },
  { id: '2', name: 'lecture-notes.pdf', type: 'document', time: '5 hours ago' },
  { id: '3', name: 'interactive-quiz.zip', type: 'scorm', time: '1 day ago' },
];

const ContentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType>('video');
  const [selectedDestination, setSelectedDestination] = useState('1');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Content details form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('lesson');
  const [tags, setTags] = useState<string[]>([]);
  const [requireCompletion, setRequireCompletion] = useState(false);
  const [includeInProgress, setIncludeInProgress] = useState(true);
  const [downloadable, setDownloadable] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBack = () => {
    navigate('/instructor');
  };

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    console.log('Files selected:', files);
  };

  const handleAddLink = (url: string) => {
    console.log('Link added:', url);
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    navigate('/instructor');
  };

  const handleAddMore = () => {
    // Reset form but keep existing files
    setTitle('');
    setDescription('');
    setTags([]);
  };

  const handleComplete = () => {
    console.log('Completing upload with:', {
      type: selectedType,
      files: uploadedFiles,
      title,
      description,
      category,
      tags,
      destination: selectedDestination,
    });
    // Would trigger actual upload here
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Top Bar */}
      <UploadTopBar
        onBack={handleBack}
        onMobileMenuToggle={handleMobileMenuToggle}
        onContentLibrary={() => console.log('Content library')}
        onBulkUpload={() => console.log('Bulk upload')}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pb: 12,
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Upload Type Selector */}
          <UploadTypeSelector selectedType={selectedType} onTypeChange={setSelectedType} />

          {/* Two Column Layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
              gap: 3,
            }}
          >
            {/* Left: Upload Area */}
            <Box>
              <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
                <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                  <Box sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                    {selectedType === 'video' && 'Upload Video'}
                    {selectedType === 'document' && 'Upload Documents'}
                    {selectedType === 'scorm' && 'Upload SCORM Package'}
                    {selectedType === 'link' && 'Add External Link'}
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  {selectedType === 'link' ? (
                    <ExternalLinkForm onAdd={handleAddLink} />
                  ) : (
                    <UploadZone type={selectedType} onFilesSelected={handleFilesSelected} />
                  )}
                </Box>
              </Paper>

              {/* Content Details Form */}
              <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mt: 3 }}>
                <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                  <Box sx={{ fontWeight: 700, fontSize: '1.125rem' }}>Content Details</Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <ContentDetailsForm
                    title={title}
                    description={description}
                    category={category}
                    tags={tags}
                    requireCompletion={requireCompletion}
                    includeInProgress={includeInProgress}
                    downloadable={downloadable}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onCategoryChange={setCategory}
                    onTagsChange={setTags}
                    onRequireCompletionChange={setRequireCompletion}
                    onIncludeInProgressChange={setIncludeInProgress}
                    onDownloadableChange={setDownloadable}
                  />
                </Box>
              </Paper>
            </Box>

            {/* Right: Sidebar Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <DestinationSelector
                destinations={sampleDestinations}
                selectedId={selectedDestination}
                onSelect={setSelectedDestination}
              />
              <UploadTipsCard />
              <StorageInfoCard used={3.2} total={10} />
              <RecentUploadsCard uploads={sampleRecentUploads} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <UploadFooter
        uploadCount={uploadedFiles.length}
        onCancel={handleCancel}
        onAddMore={handleAddMore}
        onComplete={handleComplete}
      />
    </Box>
  );
};

export default ContentUploadPage;
