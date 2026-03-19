import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Chip,
  ToggleButtonGroup, ToggleButton, TextField, Stack,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  PlayCircle as VideoIcon,
  Description as DocIcon,
  ViewInAr as ScormIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import UploadZone from '../../components/instructor/content-upload/UploadZone';
import type { UploadContentType } from '../../components/instructor/content-upload/UploadZone';
import UploadProgress from '../../components/instructor/content-upload/UploadProgress';
import type { UploadStatus } from '../../components/instructor/content-upload/UploadProgress';
import UploadTipsCard from '../../components/instructor/content-upload/UploadTipsCard';
import StorageInfoCard from '../../components/instructor/content-upload/StorageInfoCard';
import RecentUploadsCard from '../../components/instructor/content-upload/RecentUploadsCard';
import type { RecentUploadItem } from '../../components/instructor/content-upload/RecentUploadsCard';
import UploadFooter from '../../components/instructor/content-upload/UploadFooter';
import { uploadApi, quotaApi } from '../../services/upload.services';
import type { SessionAssetUploadResult } from '../../services/upload.services';
import { usePartialUpdateSession } from '../../hooks/useCatalogue';
import { getErrorMessage } from '../../utils/config';
import FeedbackSnackbar from '../../components/common/FeedbackSnackbar';

interface UploadFileEntry {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  assetResult?: SessionAssetUploadResult;
  errorMessage?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const typeLabels: Record<UploadContentType, { label: string; icon: React.ReactNode; color: string }> = {
  video: { label: 'Video', icon: <VideoIcon />, color: '#3b82f6' },
  document: { label: 'Document', icon: <DocIcon />, color: '#10b981' },
  scorm: { label: 'SCORM', icon: <ScormIcon />, color: '#8b5cf6' },
};

const sampleRecentUploads: RecentUploadItem[] = [
  { id: '1', name: 'intro-video.mp4', type: 'video', time: '2 hours ago' },
  { id: '2', name: 'lecture-notes.pdf', type: 'document', time: '5 hours ago' },
  { id: '3', name: 'interactive-quiz.zip', type: 'scorm', time: '1 day ago' },
];

const ContentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();

  const numericCourseId = courseId ? Number(courseId) : 0;
  const sessionId = searchParams.get('sessionId') ? Number(searchParams.get('sessionId')) : 0;

  const typeParam = searchParams.get('type') as UploadContentType | null;
  const contentType: UploadContentType = typeParam && ['video', 'document', 'scorm'].includes(typeParam)
    ? typeParam
    : 'video';

  const lessonTitle = searchParams.get('lesson') || '';

  const patchSession = usePartialUpdateSession();
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const [mobileOpen, setMobileOpen] = useState(false);
  const [fileEntries, setFileEntries] = useState<UploadFileEntry[]>([]);
  const [completing, setCompleting] = useState(false);
  const [snackError, setSnackError] = useState<string | null>(null);
  const [snackSuccess, setSnackSuccess] = useState<string | null>(null);

  const [contentSource, setContentSource] = useState<'upload' | 'external'>('upload');
  const [externalVideoUrl, setExternalVideoUrl] = useState('');
  const [externalVideoError, setExternalVideoError] = useState('');

  const { data: quotaData } = useQuery({
    queryKey: ['storageQuota'],
    queryFn: () => quotaApi.getQuota(),
  });

  const bytesToGb = (bytes: number) => bytes / (1024 * 1024 * 1024);
  const storageUsedGb = quotaData?.data ? bytesToGb(quotaData.data.used_bytes) : 0;
  const storageTotalGb = quotaData?.data ? bytesToGb(quotaData.data.total_bytes) : 10;

  const hasSession = !!(numericCourseId && sessionId);
  const fileType: 'video' | 'document' | 'scorm' = contentType;

  // Abort pending uploads on unmount
  useEffect(() => {
    const controllers = abortControllers.current;
    return () => { controllers.forEach((c) => c.abort()); };
  }, []);

  const updateFileEntry = useCallback(
    (entryId: string, patch: Partial<UploadFileEntry>) =>
      setFileEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, ...patch } : e))),
    [],
  );

  const realUpload = useCallback(async (file: File, entryId: string) => {
    if (!hasSession) {
      updateFileEntry(entryId, { status: 'error' as UploadStatus, progress: 0 });
      setSnackError('Missing session information. Please create the lesson from the course structure page.');
      return;
    }

    try {
      updateFileEntry(entryId, { progress: 10 });

      const controller = new AbortController();
      abortControllers.current.set(entryId, controller);

      const assetResult = await uploadApi.uploadSessionAsset(
        file,
        numericCourseId,
        sessionId,
        (percent) => updateFileEntry(entryId, { progress: Math.min(percent, 99) }),
      );

      abortControllers.current.delete(entryId);
      updateFileEntry(entryId, { progress: 100, status: 'complete' as UploadStatus, assetResult });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      abortControllers.current.delete(entryId);
      const msg = getErrorMessage(err, 'Upload failed');
      updateFileEntry(entryId, { status: 'error' as UploadStatus, progress: 0, errorMessage: msg });
      setSnackError(msg);
    }
  }, [hasSession, numericCourseId, sessionId, updateFileEntry]);

  const handleFilesSelected = (files: File[]) => {
    const newEntries: UploadFileEntry[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      progress: 0,
      status: 'uploading' as UploadStatus,
    }));
    setFileEntries((prev) => [...prev, ...newEntries]);

    newEntries.forEach((entry) => {
      realUpload(entry.file, entry.id);
    });
  };

  const handleCancelUpload = (fileId: string) => {
    const controller = abortControllers.current.get(fileId);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(fileId);
    }
    setFileEntries((prev) => prev.filter((e) => e.id !== fileId));
  };

  const handleRetryUpload = (fileId: string) => {
    const entry = fileEntries.find((e) => e.id === fileId);
    if (!entry) return;
    updateFileEntry(fileId, { status: 'uploading' as UploadStatus, progress: 0, errorMessage: undefined });
    realUpload(entry.file, entry.id);
  };

  const handleDeleteFile = (fileId: string) => {
    setFileEntries((prev) => prev.filter((e) => e.id !== fileId));
  };

  const handleCancel = () => {
    abortControllers.current.forEach((c) => c.abort());
    abortControllers.current.clear();
    setFileEntries([]);
    navigate(-1);
  };

  const validateExternalUrl = (url: string): boolean => {
    setExternalVideoError('');

    if (!url.trim()) {
      setExternalVideoError('Please enter a video URL');
      return false;
    }

    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setExternalVideoError('URL must start with http:// or https://');
        return false;
      }
    } catch {
      setExternalVideoError('Please enter a valid URL');
      return false;
    }

    const supportedDomains = ['youtube.com', 'vimeo.com', 'dailymotion.com', 'wistia.com'];
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      if (!supportedDomains.some((d) => hostname.includes(d))) {
        setExternalVideoError('');
      }
    } catch {
      // ignore
    }

    return true;
  };

  const handleComplete = async () => {
    if (contentType === 'video' && contentSource === 'external') {
      if (!validateExternalUrl(externalVideoUrl)) return;
      if (!sessionId) {
        setSnackError('Missing session information.');
        return;
      }
      try {
        setCompleting(true);
        await patchSession.mutateAsync({
          id: sessionId,
          data: {
            content_source: 'external',
            external_video_url: externalVideoUrl,
          },
        });
        setSnackSuccess('External video saved successfully.');
        setTimeout(() => navigate(`/instructor/course/${courseId}/structure`), 800);
      } catch (err) {
        setSnackError(getErrorMessage(err, 'Failed to save external video.'));
      } finally {
        setCompleting(false);
      }
      return;
    }

    const completedEntry = fileEntries.find((e) => e.status === 'complete' && e.assetResult);
    if (!completedEntry?.assetResult) {
      setSnackError('No file has been uploaded yet.');
      return;
    }
    if (!sessionId) {
      setSnackError('Missing session information.');
      return;
    }

    try {
      setCompleting(true);
      const { object_key, bucket, mime_type, size_bytes, original_filename } = completedEntry.assetResult;
      await patchSession.mutateAsync({
        id: sessionId,
        data: {
          content_source: 'upload',
          asset_object_key: object_key,
          asset_bucket: bucket,
          asset_mime_type: mime_type,
          asset_size_bytes: size_bytes,
          asset_original_filename: original_filename,
        },
      });
      setSnackSuccess('Upload saved successfully.');
      setTimeout(() => navigate(`/instructor/course/${courseId}/structure`), 800);
    } catch (err) {
      setSnackError(getErrorMessage(err, 'Failed to save upload metadata.'));
    } finally {
      setCompleting(false);
    }
  };

  const uploadingFiles = fileEntries.filter((e) => e.status === 'uploading');
  const completedFiles = fileEntries.filter((e) => e.status === 'complete');
  const errorFiles = fileEntries.filter((e) => e.status === 'error');
  const hasAnyComplete = completedFiles.length > 0;
  const isStillUploading = uploadingFiles.length > 0;
  const typeInfo = typeLabels[contentType];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Top Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: { xs: 0, md: DRAWER_WIDTH },
          right: 0,
          zIndex: 1100,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <UploadIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Upload Content
              </Typography>
              {lessonTitle && (
                <Typography variant="caption" color="text.secondary">
                  {lessonTitle}
                </Typography>
              )}
            </Box>
          </Box>
          <Chip
            icon={typeInfo.icon as React.ReactElement}
            label={typeInfo.label}
            sx={{
              bgcolor: `${typeInfo.color}15`,
              color: typeInfo.color,
              fontWeight: 600,
              '& .MuiChip-icon': { color: typeInfo.color },
            }}
          />
        </Toolbar>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pb: 10,
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' },
              gap: 3,
            }}
          >
            {/* Left Column */}
            <Box>
              {/* Video Source Toggle */}
              {contentType === 'video' && (
                <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mb: 3 }}>
                  <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                    <Typography fontWeight={700}>Content Source</Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <ToggleButtonGroup
                      value={contentSource}
                      exclusive
                      onChange={(_e, val) => val && setContentSource(val)}
                      fullWidth
                      sx={{
                        '& .MuiToggleButton-root': {
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="upload">
                        <UploadIcon sx={{ mr: 1, fontSize: 20 }} />
                        Upload File
                      </ToggleButton>
                      <ToggleButton value="external">
                        <LinkIcon sx={{ mr: 1, fontSize: 20 }} />
                        External URL
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Paper>
              )}

              {/* Upload Zone or External URL */}
              {contentType === 'video' && contentSource === 'external' ? (
                <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden', mb: 3 }}>
                  <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                    <Typography fontWeight={700}>External Video URL</Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <TextField
                      fullWidth
                      label="Video URL"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={externalVideoUrl}
                      onChange={(e) => {
                        setExternalVideoUrl(e.target.value);
                        setExternalVideoError('');
                      }}
                      error={!!externalVideoError}
                      helperText={externalVideoError || 'Supports YouTube, Vimeo, Dailymotion, and Wistia URLs'}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                      {['YouTube', 'Vimeo', 'Dailymotion', 'Wistia'].map((p) => (
                        <Chip key={p} label={p} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              ) : (
                <UploadZone type={contentType} onFilesSelected={handleFilesSelected} />
              )}

              {/* Uploading Files */}
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
                        fileType={fileType}
                        progress={entry.progress}
                        status={entry.status}
                        onCancel={() => handleCancelUpload(entry.id)}
                      />
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Failed Uploads */}
              {errorFiles.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'error.light', overflow: 'hidden', mt: 3 }}>
                  <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'error.light', bgcolor: '#fef2f2' }}>
                    <Box sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'error.main' }}>
                      Failed ({errorFiles.length} {errorFiles.length === 1 ? 'file' : 'files'})
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {errorFiles.map((entry) => (
                      <UploadProgress
                        key={entry.id}
                        fileName={entry.file.name}
                        fileSize={formatFileSize(entry.file.size)}
                        fileType={fileType}
                        progress={0}
                        status="error"
                        onRetry={() => handleRetryUpload(entry.id)}
                        onCancel={() => handleDeleteFile(entry.id)}
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
                      Uploaded ({completedFiles.length} {completedFiles.length === 1 ? 'file' : 'files'})
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {completedFiles.map((entry) => (
                      <UploadProgress
                        key={entry.id}
                        fileName={entry.file.name}
                        fileSize={formatFileSize(entry.file.size)}
                        fileType={fileType}
                        progress={100}
                        status="complete"
                        onCancel={() => handleDeleteFile(entry.id)}
                      />
                    ))}
                  </Box>
                </Paper>
              )}

            </Box>

            {/* Right Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <UploadTipsCard contentType={contentType} />
              <StorageInfoCard used={storageUsedGb} total={storageTotalGb} />
              <RecentUploadsCard uploads={sampleRecentUploads} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <UploadFooter
        uploadCount={completedFiles.length}
        onCancel={handleCancel}
        onAddMore={() => { }}
        onComplete={handleComplete}
        disabled={completing || isStillUploading || !hasAnyComplete}
        savingLabel={completing ? 'Saving\u2026' : isStillUploading ? 'Uploading\u2026' : undefined}
      />

      <FeedbackSnackbar message={snackError} onClose={() => setSnackError(null)} />
      <FeedbackSnackbar message={snackSuccess} onClose={() => setSnackSuccess(null)} severity="success" autoHideDuration={3000} />
    </Box>
  );
};

export default ContentUploadPage;
