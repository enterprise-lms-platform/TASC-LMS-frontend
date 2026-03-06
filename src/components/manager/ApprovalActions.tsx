import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { useApproveCourse, useRejectCourse } from '../../hooks/useCatalogue';

interface ApprovalActionsProps {
  requestId: number;
  onSuccess?: () => void;
}

const ApprovalActions: React.FC<ApprovalActionsProps> = ({ requestId, onSuccess }) => {
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [rejectError, setRejectError] = useState('');

  const approveMutation = useApproveCourse();
  const rejectMutation = useRejectCourse();

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        id: requestId,
        data: approveComment ? { reviewer_comments: approveComment } : undefined,
      });
      setApproveDialog(false);
      setApproveComment('');
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      setRejectError('A reason for rejection is required');
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        id: requestId,
        data: { reviewer_comments: rejectComment },
      });
      setRejectDialog(false);
      setRejectComment('');
      setRejectError('');
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<ApproveIcon />}
          onClick={() => setApproveDialog(true)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#059669',
            '&:hover': { bgcolor: '#047857' },
          }}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          startIcon={<RejectIcon />}
          onClick={() => setRejectDialog(true)}
          color="error"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Reject
        </Button>
      </Box>

      {/* Approve Dialog */}
      <Dialog open={approveDialog} onClose={() => setApproveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Course</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This course will be published and made available to learners. You can optionally add a comment.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comment (optional)"
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
            placeholder="Any notes for the instructor..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            disabled={approveMutation.isPending}
            sx={{ textTransform: 'none', bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}
          >
            {approveMutation.isPending ? <CircularProgress size={20} /> : 'Confirm Approval'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Course</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            The instructor will be notified with your reason so they can revise and resubmit.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for rejection"
            value={rejectComment}
            onChange={(e) => { setRejectComment(e.target.value); setRejectError(''); }}
            error={!!rejectError}
            helperText={rejectError}
            placeholder="Explain what needs to be changed..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={rejectMutation.isPending}
            sx={{ textTransform: 'none' }}
          >
            {rejectMutation.isPending ? <CircularProgress size={20} /> : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApprovalActions;
