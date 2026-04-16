import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { subscriptionApi, type SubscriptionPlan, type SubscriptionPlanCreate } from '../../services/payments.services';

const PricingSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

  const [formData, setFormData] = useState<SubscriptionPlanCreate>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billing_cycle: 'monthly',
    features: [],
    max_courses: null,
    max_users: null,
    trial_days: 0,
    status: 'active',
  });

  const [featuresText, setFeaturesText] = useState('');

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionApi.getAll().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: SubscriptionPlanCreate) => subscriptionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SubscriptionPlanCreate> }) =>
      subscriptionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => subscriptionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    },
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
        trial_days: plan.trial_days,
        status: plan.status,
      });
      setFeaturesText((plan.features || []).join('\n'));
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        billing_cycle: 'monthly',
        features: [],
        max_courses: null,
        max_users: null,
        trial_days: 0,
        status: 'active',
      });
      setFeaturesText('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      billing_cycle: 'monthly',
      features: [],
      max_courses: null,
      max_users: null,
      trial_days: 0,
      status: 'active',
    });
    setFeaturesText('');
  };

  const handleSave = () => {
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f);

    const data: SubscriptionPlanCreate = {
      ...formData,
      features,
    };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.id);
    }
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
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
                  <TableCell sx={{ fontWeight: 600 }}>Max Users</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans?.map((plan) => (
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
                    <TableCell>{plan.max_users || 'Unlimited'}</TableCell>
                    <TableCell>
                      <Chip
                        label={plan.status}
                        color={getStatusColor(plan.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(plan as any)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setPlanToDelete(plan as any);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
          </DialogTitle>
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
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Billing Cycle</InputLabel>
                  <Select
                    value={formData.billing_cycle}
                    label="Billing Cycle"
                    onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as any })}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
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
              disabled={!formData.name || formData.price <= 0}
            >
              {editingPlan ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Subscription Plan</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{planToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </SuperadminLayout>
  );
};

export default PricingSettingsPage;