import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Avatar,
  Skeleton, Tooltip, Stack,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon, Cancel as RejectIcon,
  Star as StarIcon, StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import {
  useSuperadminReviews, useApproveReview, useRejectReview, useFeatureReview,
} from '../../hooks/useSuperadmin';
import type { ReviewStatus } from '../../services/superadmin.services';

const TABS: { label: string; status: ReviewStatus }[] = [
  { label: 'Pending', status: 'pending' },
  { label: 'Approved', status: 'approved' },
  { label: 'Rejected', status: 'rejected' },
];

const thSx = { fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#71717a', py: 1.5 };

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <Stack direction="row" spacing={0.25}>
    {[1, 2, 3, 4, 5].map((n) => (
      <StarIcon key={n} sx={{ fontSize: 14, color: n <= rating ? '#f59e0b' : '#e4e4e7' }} />
    ))}
  </Stack>
);

const SuperadminReviewsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const status = TABS[tab].status;

  const { data, isLoading } = useSuperadminReviews({ status, page_size: 50 });
  const reviews = data?.results ?? [];

  const approveMutation = useApproveReview();
  const rejectMutation  = useRejectReview();
  const featureMutation = useFeatureReview();

  return (
    <SuperadminLayout title="Review Moderation" subtitle="Approve, reject and feature learner course reviews">
      <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {TABS.map((t) => <Tab key={t.status} label={t.label} sx={{ textTransform: 'none', fontWeight: 600 }} />)}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} height={52} sx={{ borderRadius: 1 }} />)}
            </Box>
          ) : reviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
              <StarIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
              <Typography variant="body2">No {status} reviews</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={thSx}>Reviewer</TableCell>
                    <TableCell sx={thSx}>Course</TableCell>
                    <TableCell sx={{ ...thSx, display: { xs: 'none', md: 'table-cell' } }}>Review</TableCell>
                    <TableCell sx={thSx}>Rating</TableCell>
                    <TableCell sx={{ ...thSx, display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                    <TableCell sx={thSx}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: '#ffa424' }}>
                            {review.user_name?.slice(0, 2).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{review.user_name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {review.course_title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {review.content || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell><StarRating rating={review.rating} /></TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          {status === 'pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton size="small" color="success" onClick={() => approveMutation.mutate(review.id)}>
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton size="small" color="error" onClick={() => rejectMutation.mutate(review.id)}>
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {status === 'approved' && (
                            <>
                              <Tooltip title={review.is_featured ? 'Unfeature' : 'Feature as Testimonial'}>
                                <IconButton
                                  size="small"
                                  sx={{ color: review.is_featured ? '#f59e0b' : 'grey.400' }}
                                  onClick={() => featureMutation.mutate({ id: review.id, is_featured: !review.is_featured })}
                                >
                                  {review.is_featured ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton size="small" color="error" onClick={() => rejectMutation.mutate(review.id)}>
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {status === 'rejected' && (
                            <Tooltip title="Re-approve">
                              <IconButton size="small" color="success" onClick={() => approveMutation.mutate(review.id)}>
                                <ApproveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {review.is_featured && status !== 'approved' && (
                            <Chip label="Featured" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#fff3e0', color: '#f59e0b' }} />
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default SuperadminReviewsPage;
