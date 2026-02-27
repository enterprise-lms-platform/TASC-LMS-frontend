import React, { useState, useMemo } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Button, IconButton, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Snackbar, Alert, CircularProgress, Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Layers as CategoriesIcon,
  FilterList as FilterIcon,
  FolderOpen as EmptyIcon,
} from '@mui/icons-material';

import Sidebar, { DRAWER_WIDTH } from '../components/manager/Sidebar';
import TopBar from '../components/manager/TopBar';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useCatalogue';
import { getErrorMessage } from '../utils/config';
import type { Category, CategoryCreateRequest } from '../types/types';

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 2,
};

// ─── Initial Form State ────────────────────────────────────

const emptyForm: CategoryCreateRequest = {
  name: '',
  description: '',
  parent: null,
  is_active: true,
};

// ─── Component ─────────────────────────────────────────────

const ManagerCategoriesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryCreateRequest>(emptyForm);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  // API hooks
  const { data: categories, isLoading, isError } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Filtered categories
  const filtered = useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        (cat.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && cat.is_active) ||
        (statusFilter === 'inactive' && !cat.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // Get category name by id (for parent display)
  const getCategoryName = (id: number | null | undefined) => {
    if (!id || !categories) return '—';
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : '—';
  };

  // ─── Dialog Handlers ──────────────────────────────────────

  const openCreateDialog = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      parent: cat.parent ?? null,
      is_active: cat.is_active,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: 'Category name is required.', severity: 'error' });
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data: form });
        setSnackbar({ open: true, message: 'Category updated successfully.', severity: 'success' });
      } else {
        await createCategory.mutateAsync(form);
        setSnackbar({ open: true, message: 'Category created successfully.', severity: 'success' });
      }
      closeDialog();
    } catch (error) {
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory.mutateAsync(deleteTarget.id);
      setSnackbar({ open: true, message: 'Category deleted successfully.', severity: 'success' });
      setDeleteTarget(null);
    } catch (error) {
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
      setDeleteTarget(null);
    }
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  // ─── Render ────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* TopBar */}
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowX: 'hidden' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <CategoriesIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Categories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage course categories and subcategories
                </Typography>
              </Box>
            </Box>

            <Button
              id="btn-create-category"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{
                borderRadius: '10px',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  boxShadow: '0 6px 16px rgba(255,164,36,0.4)',
                },
              }}
            >
              Create Category
            </Button>
          </Box>

          {/* Filters / Search */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  id="search-categories"
                  placeholder="Search categories..."
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ minWidth: 240, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>
                    <FilterIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    Status
                  </InputLabel>
                  <Select
                    id="filter-status"
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {filtered.length} {filtered.length === 1 ? 'category' : 'categories'}
              </Typography>
            </Box>

            {/* Table */}
            {isLoading ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress size={36} sx={{ color: '#ffa424' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Loading categories...
                </Typography>
              </Box>
            ) : isError ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography color="error.main" fontWeight={600}>
                  Failed to load categories. Please try again.
                </Typography>
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <EmptyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1" color="text.secondary" fontWeight={600}>
                  {search || statusFilter !== 'all' ? 'No categories match your filters' : 'No categories yet'}
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                  {!search && statusFilter === 'all' && 'Create your first category to get started.'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parent</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((cat) => (
                      <TableRow
                        key={cat.id}
                        sx={{
                          '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' },
                          transition: 'background 0.15s',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36, height: 36, borderRadius: '10px',
                                bgcolor: 'rgba(255,164,36,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >
                              <CategoriesIcon sx={{ fontSize: 18, color: '#ffa424' }} />
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{cat.name}</Typography>
                              <Typography variant="caption" color="text.disabled">{cat.slug}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cat.description || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {getCategoryName(cat.parent)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={cat.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              borderRadius: '6px',
                              bgcolor: cat.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                              color: cat.is_active ? '#059669' : '#dc2626',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(cat.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              id={`btn-edit-${cat.id}`}
                              size="small"
                              onClick={() => openEditDialog(cat)}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              id={`btn-delete-${cat.id}`}
                              size="small"
                              onClick={() => setDeleteTarget(cat)}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#dc2626', bgcolor: 'rgba(239,68,68,0.08)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>

      {/* ─── Create / Edit Dialog ──────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingCategory ? 'Edit Category' : 'Create Category'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <TextField
            id="input-category-name"
            label="Name"
            required
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <TextField
            id="input-category-description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <FormControl fullWidth>
            <InputLabel>Parent Category</InputLabel>
            <Select
              id="select-parent-category"
              value={form.parent != null ? String(form.parent) : ''}
              label="Parent Category"
              onChange={(e) => setForm({ ...form, parent: e.target.value === '' ? null : Number(e.target.value) })}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="">None (Root Category)</MenuItem>
              {(categories || [])
                .filter((c) => c.id !== editingCategory?.id)
                .map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                id="switch-category-active"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#ffa424' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#ffa424' },
                }}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            id="btn-save-category"
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #ffa424, #f97316)',
              '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
            }}
          >
            {isSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : editingCategory ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            id="btn-confirm-delete"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
          >
            {deleteCategory.isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Snackbar ──────────────────────────────────────────── */}
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

export default ManagerCategoriesPage;
