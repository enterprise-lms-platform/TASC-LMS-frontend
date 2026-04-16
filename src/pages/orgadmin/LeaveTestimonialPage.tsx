import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Rating,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import OrgAdminLayout from '../../components/orgadmin/OrgAdminLayout';
import { testimonialApi, type BusinessTestimonial } from '../../services/organization.services';

const LeaveTestimonialPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number | null>(0);
  const [companyName, setCompanyName] = useState('');
  const [content, setContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['my-testimonials'],
    queryFn: () => testimonialApi.getAll().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: { company_name: string; content: string; rating: number }) =>
      testimonialApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-testimonials'] });
      setSuccessMessage('Thank you! Your testimonial has been submitted and is pending approval.');
      setRating(0);
      setCompanyName('');
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !companyName.trim() || !content.trim()) return;
    createMutation.mutate({ company_name: companyName, content, rating });
  };

  const myTestimonials = testimonials || [];
  const pendingTestimonial = myTestimonials.find((t) => t.status === 'pending');
  const approvedTestimonial = myTestimonials.find((t) => t.status === 'approved');
  const featuredTestimonial = myTestimonials.find((t) => t.status === 'featured');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'featured':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <OrgAdminLayout title="Leave a Testimonial" subtitle="Share your experience with TASC LMS">
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {/* Testimonial Form */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Share Your Experience with TASC LMS
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your testimonial will help other organizations understand the value of TASC LMS.
            It will be displayed on our For-Business page if approved.
          </Typography>

          {pendingTestimonial || approvedTestimonial || featuredTestimonial ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                You have already submitted a testimonial!
              </Typography>
              {featuredTestimonial && (
                <Chip
                  label="Featured on For-Business Page!"
                  color="success"
                  icon={<StarIcon />}
                  sx={{ mb: 2 }}
                />
              )}
              {approvedTestimonial && (
                <Chip
                  label="Approved - Showing on For-Business Page"
                  color="success"
                  sx={{ mb: 2 }}
                />
              )}
              {pendingTestimonial && (
                <Chip
                  label="Pending Approval"
                  color="warning"
                  sx={{ mb: 2 }}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                "{pendingTestimonial?.content || approvedTestimonial?.content || featuredTestimonial?.content}"
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Your Rating *
                </Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  icon={<StarIcon />}
                  emptyIcon={<StarIcon />}
                />
              </Box>

              <TextField
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
                required
                sx={{ mb: 3 }}
                placeholder="Enter your company name"
              />

              <TextField
                label="Your Testimonial"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                required
                multiline
                rows={5}
                sx={{ mb: 3 }}
                placeholder="Share your experience with TASC LMS. How has it helped your organization?"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                disabled={!rating || !companyName.trim() || !content.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
              </Button>
            </form>
          )}
        </Paper>

        {/* Preview Section */}
        <Paper sx={{ p: 4, bgcolor: '#fafafa' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Preview How It Will Appear
          </Typography>
          <Box
            sx={{
              p: 3,
              border: '1px solid #e4e4e7',
              borderRadius: 2,
              bgcolor: 'white',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5, mb: 2, color: '#f59e0b' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} sx={{ fontSize: 18 }} />
              ))}
            </Box>
            <Typography sx={{ color: '#52525b', lineHeight: 1.8, mb: 3 }}>
              "{content || 'Your testimonial will appear here...'}"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#ffa424',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {companyName ? companyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'XX'}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#27272a' }}>
                  {companyName || 'Your Company Name'}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>
                  Org Admin
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </OrgAdminLayout>
  );
};

export default LeaveTestimonialPage;