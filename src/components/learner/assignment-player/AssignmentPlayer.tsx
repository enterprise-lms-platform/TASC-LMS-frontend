import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Divider,
  Paper, Alert, CircularProgress,
  Card, CardContent
} from '@mui/material';
import {
  Description as AssignmentIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAssignmentConfig } from '../../../hooks/useCatalogue';
import { sessionApi } from '../../../services/catalogue.services';

interface AssignmentPlayerProps {
  sessionId: number;
  onComplete?: (score: number | null, passed: boolean | null) => void;
}

const AssignmentPlayer: React.FC<AssignmentPlayerProps> = ({ sessionId, onComplete }) => {
  const { data: config, isLoading, isError } = useAssignmentConfig(sessionId);
  const [submittedText, setSubmittedText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!submittedText.trim() && !fileUrl.trim()) {
      setSubmitError('Please provide a response or a file link.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sessionApi.submit(sessionId, {
        submitted_text: submittedText,
        submitted_file_url: fileUrl,
        status: 'submitted'
      });
      setSubmitSuccess(true);
      onComplete?.(null, false); // Not graded yet
    } catch (err: any) {
      setSubmitError(err.response?.data?.detail || 'Failed to submit assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !config) return <Alert severity="error" sx={{ m: 2 }}>Failed to load assignment instructions.</Alert>;

  if (submitSuccess) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', bgcolor: 'rgba(16,185,129,0.05)', border: '1px solid #10b981', m: 2 }}>
        <SuccessIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Assignment Submitted!</Typography>
        <Typography color="text.secondary">Your work has been sent to the instructor for grading. You will be notified once it is reviewed.</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 2, px: 2 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: '20px', border: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: '12px' }}>
            <AssignmentIcon sx={{ color: '#3b82f6' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>Assignment Instructions</Typography>
            <Typography variant="caption" color="text.secondary">Points: {config.max_points} · Type: {config.assignment_type}</Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 4, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {config.instructions || 'No detailed instructions provided.'}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Your Submission</Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder="Type your response here..."
          value={submittedText}
          onChange={(e) => setSubmittedText(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />

        <Typography variant="subtitle2" fontWeight={700} gutterBottom>File Attachment (Optional)</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Paste a link to your file (Google Drive, Dropbox, etc.)"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />

        {submitError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{submitError}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px', px: 4, py: 1.2,
              textTransform: 'none', fontWeight: 700,
              bgcolor: '#ffa424', color: '#fff',
              '&:hover': { bgcolor: '#e6931f' },
              '&.Mui-disabled': { bgcolor: '#f0f0f0' }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </Box>
      </Paper>

      <Card sx={{ mt: 3, borderRadius: '20px', bgcolor: '#fef3c7', border: '1px solid #fcd34d', boxShadow: 'none' }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <InfoIcon sx={{ color: '#d97706', mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="#92400e">Important Note</Typography>
            <Typography variant="caption" color="#b45309">
              Ensure your submission is complete before clicking submit. You may only be able to submit once depending on the course settings.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssignmentPlayer;
