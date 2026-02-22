import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline, Paper, Typography, Chip } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PlayCircle as VideoIcon,
  Description as DocIcon,
  ViewInAr as ScormIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';
import UploadTopBar from '../components/instructor/content-upload/UploadTopBar';
import UploadFooter from '../components/instructor/content-upload/UploadFooter';
import UploadZone from '../components/instructor/content-upload/UploadZone';
import type { UploadContentType } from '../components/instructor/content-upload/UploadZone';
import UploadProgress from '../components/instructor/content-upload/UploadProgress';
import type { UploadStatus } from '../components/instructor/content-upload/UploadProgress';
import UploadedFileItem from '../components/instructor/content-upload/UploadedFileItem';
import ContentDetailsForm from '../components/instructor/content-upload/ContentDetailsForm';
import UploadTipsCard from '../components/instructor/content-upload/UploadTipsCard';
import StorageInfoCard from '../components/instructor/content-upload/StorageInfoCard';
import RecentUploadsCard from '../components/instructor/content-upload/RecentUploadsCard';
import type { RecentUploadItem } from '../components/instructor/content-upload/RecentUploadsCard';

interface UploadFileEntry {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const typeLabels: Record<UploadContentType, { label: string; icon: React.ReactNode; color: string }> = {
  video: { label: 'Video', icon: <VideoIcon sx={{ fontSize: 18 }} />, color: '#3b82f6' },
  document: { label: 'Document', icon: <DocIcon sx={{ fontSize: 18 }} />, color: '#10b981' },
  scorm: { label: 'SCORM Package', icon: <ScormIcon sx={{ fontSize: 18 }} />, color: '#8b5cf6' },
};

const sampleRecentUploads: RecentUploadItem[] = [
  { id: '1', name: 'intro-video.mp4', type: 'video', time: '2 hours ago' },
  { id: '2', name: 'lecture-notes.pdf', type: 'document', time: '5 hours ago' },
  { id: '3', name: 'interactive-quiz.zip', type: 'scorm', time: '1 day ago' },
];

const ContentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Content type from URL search params (passed from lesson creation)
  const typeParam = searchParams.get('type') as UploadContentType | null;
  const contentType: UploadContentType = typeParam && ['video', 'document', 'scorm'].includes(typeParam)
    ? typeParam
    : 'video';

  const lessonTitle = searchParams.get('lesson') || '';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [fileEntries, setFileEntries] = useState<UploadFileEntry[]>([]);

  // Content settings (toggles only — title/description already captured in lesson)
  const [requireCompletion, setRequireCompletion] = useState(false);
  const [includeInProgress, setIncludeInProgress] = useState(true);
  const [downloadable, setDownloadable] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleFilesSelected = (files: File[]) => {
    const newEntries: UploadFileEntry[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      progress: 0,
      status: 'uploading' as UploadStatus,
    }));
    setFileEntries((prev) => [...prev, ...newEntries]);

    // Simulate upload progress for each file
    newEntries.forEach((entry) => {
      simulateUpload(entry.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFileEntries((prev) =>
          prev.map((e) => e.id === fileId ? { ...e, progress: 100, status: 'complete' as UploadStatus } : e)
        );
      } else {
        setFileEntries((prev) =>
          prev.map((e) => e.id === fileId ? { ...e, progress: Math.round(progress) } : e)
        );
      }
    }, 500);
  };

  const handleCancelUpload = (fileId: string) => {
    setFileEntries((prev) => prev.filter((e) => e.id !== fileId));
  };

  const handleDeleteFile = (fileId: string) => {
    setFileEntries((prev) => prev.filter((e) => e.id !== fileId));
  };

  const handleCancel = () => {
    setFileEntries([]);
    navigate(-1);
  };

  const handleComplete = () => {
    console.log('Completing upload with:', {
      type: contentType,
      files: fileEntries.map((e) => e.file.name),
      settings: { requireCompletion, includeInProgress, downloadable },
    });
    navigate(-1);
  };

  const uploadingFiles = fileEntries.filter((e) => e.status === 'uploading');
  const completedFiles = fileEntries.filter((e) => e.status === 'complete');
  const typeInfo = typeLabels[contentType];

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
          {/* Context Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              px: 3,
              mb: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Chip
              icon={typeInfo.icon as React.ReactElement}
              label={`Uploading ${typeInfo.label}`}
              sx={{ bgcolor: `${typeInfo.color}15`, color: typeInfo.color, fontWeight: 600 }}
            />
            {lessonTitle && (
              <Typography variant="body2" color="text.secondary">
                for <Typography component="span" fontWeight={600} color="text.primary">{lessonTitle}</Typography>
              </Typography>
            )}
          </Paper>

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
              {/* Upload Zone */}
              <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
                <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                  <Box sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                    Upload {typeInfo.label}
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <UploadZone type={contentType} onFilesSelected={handleFilesSelected} />
                </Box>
              </Paper>

              {/* Upload Progress */}
              {uploadingFiles.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mt: 3 }}>
                  <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                    <Box sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                      Uploading ({uploadingFiles.length} {uploadingFiles.length === 1 ? 'file' : 'files'})
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {uploadingFiles.map((entry) => (
                      <UploadProgress
                        key={entry.id}
                        fileName={entry.file.name}
                        fileSize={formatFileSize(entry.file.size)}
                        fileType={contentType === 'scorm' ? 'scorm' : contentType === 'document' ? 'document' : 'video'}
                        progress={entry.progress}
                        status="uploading"
                        onCancel={() => handleCancelUpload(entry.id)}
                      />
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Uploaded Files */}
              {completedFiles.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mt: 3 }}>
                  <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                    <Box sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                      Uploaded Files ({completedFiles.length})
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {completedFiles.map((entry) => (
                      <UploadedFileItem
                        key={entry.id}
                        id={entry.id}
                        name={entry.file.name}
                        type={contentType === 'scorm' ? 'scorm' : contentType === 'document' ? 'document' : 'video'}
                        size={formatFileSize(entry.file.size)}
                        status="ready"
                        onDelete={() => handleDeleteFile(entry.id)}
                      />
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Content Settings */}
              <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mt: 3 }}>
                <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                  <Box sx={{ fontWeight: 700, fontSize: '1.125rem' }}>Content Settings</Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <ContentDetailsForm
                    requireCompletion={requireCompletion}
                    includeInProgress={includeInProgress}
                    downloadable={downloadable}
                    onRequireCompletionChange={setRequireCompletion}
                    onIncludeInProgressChange={setIncludeInProgress}
                    onDownloadableChange={setDownloadable}
                  />
                </Box>
              </Paper>
            </Box>

            {/* Right: Sidebar Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <UploadTipsCard />
              <StorageInfoCard used={3.2} total={10} />
              <RecentUploadsCard uploads={sampleRecentUploads} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <UploadFooter
        uploadCount={fileEntries.length}
        onCancel={handleCancel}
        onAddMore={() => {}}
        onComplete={handleComplete}
      />
    </Box>
  );
};

export default ContentUploadPage;
