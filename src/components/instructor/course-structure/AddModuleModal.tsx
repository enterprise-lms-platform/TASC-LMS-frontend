import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AddModuleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ModuleFormData) => void;
}

interface ModuleFormData {
  title: string;
  description: string;
  status: 'draft' | 'published' | 'hidden';
  icon: string;
  requireSequential: boolean;
  allowPreview: boolean;
}

const iconOptions = [
  { value: 'play-circle', label: 'Play Circle' },
  { value: 'layer-group', label: 'Layers' },
  { value: 'puzzle-piece', label: 'Puzzle' },
  { value: 'share-alt', label: 'Share' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'book', label: 'Book' },
  { value: 'code', label: 'Code' },
];

const AddModuleModal: React.FC<AddModuleModalProps> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    status: 'draft',
    icon: 'play-circle',
    requireSequential: false,
    allowPreview: true,
  });

  const handleChange = (field: keyof ModuleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave(formData);
      setFormData({
        title: '',
        description: '',
        status: 'draft',
        icon: 'play-circle',
        requireSequential: false,
        allowPreview: true,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Add New Module
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'grey.100' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Module Title"
            required
            fullWidth
            placeholder="e.g., Introduction to React Hooks"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            helperText="A clear title that describes the module content"
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            placeholder="Brief description of what learners will learn in this module..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="hidden">Hidden</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Icon</InputLabel>
              <Select
                value={formData.icon}
                label="Icon"
                onChange={(e) => handleChange('icon', e.target.value)}
              >
                {iconOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Settings
            </Typography>
            <Box sx={{ borderTop: 1, borderColor: 'grey.100' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'grey.100' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Require sequential completion
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Learners must complete lessons in order
                  </Typography>
                </Box>
                <Switch
                  checked={formData.requireSequential}
                  onChange={(e) => handleChange('requireSequential', e.target.checked)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Allow preview
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Non-enrolled users can preview first lesson
                  </Typography>
                </Box>
                <Switch
                  checked={formData.allowPreview}
                  onChange={(e) => handleChange('allowPreview', e.target.checked)}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderColor: 'grey.300', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!formData.title.trim()}>
          Add Module
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModuleModal;
export type { ModuleFormData };
