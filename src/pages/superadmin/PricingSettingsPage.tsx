import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { subscriptionApi, type SubscriptionPlan, type SubscriptionPlanCreate } from '../../services/payments.services';
import type { PaginatedResponse } from '../../types/types';

const DEFAULT_FORM_DATA: SubscriptionPlanCreate = {
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  billing_cycle: 'monthly',
  features: [],
  max_courses: null,
  max_users: null,
  duration_days: 180,
  trial_days: 0,
  status: 'active',
};

const PricingSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [planToArchive, setPlanToArchive] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<SubscriptionPlanCreate>(DEFAULT_FORM_DATA);
  const [featuresText, setFeaturesText] = useState('');
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionApi.getAll().then((r) => {
      const data = r.data as unknown as SubscriptionPlan[] | PaginatedResponse<SubscriptionPlan>;
      return Array.isArray(data) ? data : data.results ?? [];
    }),
  });

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const extractErrorMessage = (error: any, fallback: string) => {
    const data = error?.response?.data;
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) return data.non_field_errors[0];
    return fallback;
  };

  const createMutation = useMutation({
    mutationFn: (data: SubscriptionPlanCreate) => subscriptionApi.create(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      handleCloseDialog();
      showToast('Subscription plan created.', 'success');
    },
    onError: (error) => showToast(extractErrorMessage(error, 'Failed to create subscription plan.'), 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SubscriptionPlanCreate> }) =>
      subscriptionApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      handleCloseDialog();
      showToast('Subscription plan updated.', 'success');
    },
    onError: (error) => showToast(extractErrorMessage(error, 'Failed to update subscription plan.'), 'error'),
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'inactive' | 'archived' }) =>
      subscriptionApi.partialUpdate(id, { status }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      setArchiveDialogOpen(false);
      setPlanToArchive(null);
      showToast('Subscription plan archived.', 'success');
    },
    onError: (error) => showToast(extractErrorMessage(error, 'Failed to update plan status.'), 'error'),
  });

  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description || '',
        price: Number(plan.price),
        currency: plan.currency,
        billing_cycle: plan.billing_cycle,
        features: plan.features || [],
        max_courses: plan.max_courses,
        max_users: plan.max_users,
        duration_days: plan.duration_days,
        trial_days: plan.trial_days,
        status: plan.status,
      });
      setFeaturesText((plan.features || []).join('\n'));
    } else {
      setEditingPlan(null);
      setFormData(DEFAULT_FORM_DATA);
      setFeaturesText('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
    setFormData(DEFAULT_FORM_DATA);
    setFeaturesText('');
  };

  const handleSave = () => {
    const data: SubscriptionPlanCreate = {
      ...formData,
      features: featuresText
        .split('\n')
        .map((feature) => feature.trim())
        .filter(Boolean),
    };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data });
      return;
    }
    createMutation.mutate(data);
  };

  const handleArchive = () => {
    if (!planToArchive) return;
    archiveMutation.mutate({ id: planToArchive.id, status: 'archived' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getBillingCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      default:
        return cycle;
    }
  };

  return (
    <SuperadminLayout title="Pricing Settings" subtitle="Manage subscription plans and pricing">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Subscription Plans
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Plan
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Billing Cycle</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Max Users</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{plan.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description?.slice(0, 50)}
                        {plan.description && plan.description.length > 50 ? '...' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {plan.currency} {Number(plan.price).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{getBillingCycleLabel(plan.billing_cycle)}</TableCell>
                    <TableCell>{plan.duration_days} days</TableCell>
                    <TableCell>{plan.max_users || 'Unlimited'}</TableCell>
                    <TableCell>
                      <Chip label={plan.status} color={getStatusColor(plan.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(plan)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="warning"
                        disabled={plan.status === 'archived'}
                        onClick={() => {
                          setPlanToArchive(plan);
                          setArchiveDialogOpen(true);
                        }}
                      >
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Plan Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  fullWidth
                  required
                />
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={formData.currency}
                    label="Currency"
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="UGX">UGX</MenuItem>
                    <MenuItem value="KES">KES</MenuItem>
                    <MenuItem value="TZS">TZS</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Billing Cycle</InputLabel>
                  <Select
                    value={formData.billing_cycle}
                    label="Billing Cycle"
                    onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as SubscriptionPlanCreate['billing_cycle'] })}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SubscriptionPlanCreate['status'] })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Duration Days"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                  fullWidth
                  required
                />
                <TextField
                  label="Max Users (leave empty for unlimited)"
                  type="number"
                  value={formData.max_users || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_users: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  fullWidth
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Max Courses (leave empty for unlimited)"
                  type="number"
                  value={formData.max_courses || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_courses: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Trial Days"
                  type="number"
                  value={formData.trial_days}
                  onChange={(e) => setFormData({ ...formData, trial_days: Number(e.target.value) })}
                  fullWidth
                />
              </Box>

              <TextField
                label="Features (one per line)"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                fullWidth
                multiline
                rows={4}
                helperText="Enter each feature on a new line"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formData.name || formData.price < 0 || formData.duration_days <= 0}
            >
              {editingPlan ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
          <DialogTitle>Archive Subscription Plan</DialogTitle>
          <DialogContent>
            <Typography>
              Archive "{planToArchive?.name}" to retire it from learner and public plan lists.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
            >
              Archive
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast((current) => ({ ...current, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setToast((current) => ({ ...current, open: false }))}
            severity={toast.severity}
            variant="filled"
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </SuperadminLayout>
  );
};

export default PricingSettingsPage;