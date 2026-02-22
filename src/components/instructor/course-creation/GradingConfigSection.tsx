import React from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as LetterIcon,
  Percent as PercentIcon,
  CheckCircle as PassFailIcon,
  BarChart as WeightedIcon,
  Functions as EqualIcon,
} from '@mui/icons-material';
import type { GradingConfig, GradingScale, GradeCategory } from '../../../utils/gradingUtils';

interface GradingConfigSectionProps {
  data: GradingConfig;
  onChange: (data: GradingConfig) => void;
}

const scaleOptions: { value: GradingScale; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'letter', label: 'Letter Grades', icon: <LetterIcon />, description: 'A, B, C, D, F' },
  { value: 'percentage', label: 'Percentage', icon: <PercentIcon />, description: '0–100%' },
  { value: 'pass_fail', label: 'Pass / Fail', icon: <PassFailIcon />, description: 'Binary outcome' },
];

const categoryColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const GradingConfigSection: React.FC<GradingConfigSectionProps> = ({ data, onChange }) => {
  const handleChange = <K extends keyof GradingConfig>(field: K, value: GradingConfig[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleThresholdChange = (grade: 'A' | 'B' | 'C' | 'D', value: number) => {
    onChange({
      ...data,
      letterGradeThresholds: { ...data.letterGradeThresholds, [grade]: value },
    });
  };

  const handleCategoryChange = (id: string, field: keyof GradeCategory, value: string | number) => {
    handleChange(
      'categories',
      data.categories.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const handleAddCategory = () => {
    const newCat: GradeCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      weight: 0,
      color: categoryColors[data.categories.length % categoryColors.length],
    };
    handleChange('categories', [...data.categories, newCat]);
  };

  const handleDeleteCategory = (id: string) => {
    handleChange(
      'categories',
      data.categories.filter((c) => c.id !== id),
    );
  };

  const totalWeight = data.categories.reduce((s, c) => s + c.weight, 0);
  const weightValid = totalWeight === 100;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          Grading Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set up how grades are calculated and displayed for this course
        </Typography>
      </Box>

      {/* Grading Scale Selector */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Grading Scale
      </Typography>
      <ToggleButtonGroup
        value={data.gradingScale}
        exclusive
        onChange={(_, val) => val && handleChange('gradingScale', val)}
        sx={{ mb: 3, display: 'flex', gap: 1.5 }}
      >
        {scaleOptions.map((opt) => (
          <ToggleButton
            key={opt.value}
            value={opt.value}
            sx={{
              flex: 1,
              flexDirection: 'column',
              gap: 0.5,
              py: 2,
              border: '2px solid',
              borderColor: data.gradingScale === opt.value ? 'primary.main' : 'grey.200',
              borderRadius: '12px !important',
              bgcolor: data.gradingScale === opt.value ? 'rgba(255, 164, 36, 0.08)' : 'transparent',
              '&:hover': { borderColor: 'primary.light' },
              '&.Mui-selected': { bgcolor: 'rgba(255, 164, 36, 0.08)', color: 'primary.main' },
            }}
          >
            <Box sx={{ color: data.gradingScale === opt.value ? 'primary.main' : 'grey.500' }}>
              {opt.icon}
            </Box>
            <Typography variant="body2" fontWeight={600}>{opt.label}</Typography>
            <Typography variant="caption" color="text.secondary">{opt.description}</Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Conditional: Letter grade thresholds */}
      {data.gradingScale === 'letter' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Letter Grade Thresholds (minimum %)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {(['A', 'B', 'C', 'D'] as const).map((grade) => (
              <TextField
                key={grade}
                label={`Grade ${grade}`}
                type="number"
                size="small"
                value={data.letterGradeThresholds[grade]}
                onChange={(e) => handleThresholdChange(grade, Number(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Below {data.letterGradeThresholds.D}% = F
          </Typography>
        </Box>
      )}

      {/* Conditional: Pass/Fail threshold */}
      {data.gradingScale === 'pass_fail' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Passing Threshold
          </Typography>
          <TextField
            label="Minimum passing %"
            type="number"
            size="small"
            value={data.passingThreshold}
            onChange={(e) => handleChange('passingThreshold', Number(e.target.value))}
            inputProps={{ min: 0, max: 100 }}
            sx={{ width: 200 }}
          />
        </Box>
      )}

      {/* Weighting Mode */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Grade Calculation Method
      </Typography>
      <ToggleButtonGroup
        value={data.weightingMode}
        exclusive
        onChange={(_, val) => val && handleChange('weightingMode', val)}
        sx={{ mb: 3, display: 'flex', gap: 1.5 }}
      >
        <ToggleButton
          value="weighted"
          sx={{
            flex: 1,
            py: 2,
            border: '2px solid',
            borderColor: data.weightingMode === 'weighted' ? 'primary.main' : 'grey.200',
            borderRadius: '12px !important',
            bgcolor: data.weightingMode === 'weighted' ? 'rgba(255, 164, 36, 0.08)' : 'transparent',
            '&.Mui-selected': { bgcolor: 'rgba(255, 164, 36, 0.08)', color: 'primary.main' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WeightedIcon sx={{ color: data.weightingMode === 'weighted' ? 'primary.main' : 'grey.500' }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600}>Weighted Categories</Typography>
              <Typography variant="caption" color="text.secondary">e.g., Assignments 40%, Quizzes 30%</Typography>
            </Box>
          </Box>
        </ToggleButton>
        <ToggleButton
          value="equal_points"
          sx={{
            flex: 1,
            py: 2,
            border: '2px solid',
            borderColor: data.weightingMode === 'equal_points' ? 'primary.main' : 'grey.200',
            borderRadius: '12px !important',
            bgcolor: data.weightingMode === 'equal_points' ? 'rgba(255, 164, 36, 0.08)' : 'transparent',
            '&.Mui-selected': { bgcolor: 'rgba(255, 164, 36, 0.08)', color: 'primary.main' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EqualIcon sx={{ color: data.weightingMode === 'equal_points' ? 'primary.main' : 'grey.500' }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600}>Total Points</Typography>
              <Typography variant="caption" color="text.secondary">All items weighted by max points</Typography>
            </Box>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Category Weight Editor (only for weighted mode) */}
      {data.weightingMode === 'weighted' && (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Category Weights
          </Typography>

          {/* Weight distribution bar */}
          <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden', display: 'flex', height: 8 }}>
            {data.categories.map((cat) => (
              <Box
                key={cat.id}
                sx={{
                  width: `${cat.weight}%`,
                  bgcolor: cat.color,
                  transition: 'width 0.3s',
                  minWidth: cat.weight > 0 ? 4 : 0,
                }}
              />
            ))}
            {totalWeight < 100 && (
              <Box sx={{ flex: 1, bgcolor: 'grey.200' }} />
            )}
          </Box>

          {/* Category rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            {data.categories.map((cat) => (
              <Box
                key={cat.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color, flexShrink: 0 }} />
                <TextField
                  size="small"
                  value={cat.name}
                  onChange={(e) => handleCategoryChange(cat.id, 'name', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  type="number"
                  value={cat.weight}
                  onChange={(e) => handleCategoryChange(cat.id, 'weight', Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 80 }}
                  slotProps={{ input: { endAdornment: <Typography variant="caption" color="text.secondary">%</Typography> } }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteCategory(cat.id)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Add + validation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddCategory}>
              Add Category
            </Button>
            <Typography
              variant="body2"
              fontWeight={600}
              color={weightValid ? 'success.main' : 'error.main'}
            >
              Total: {totalWeight}%{!weightValid && ' (must equal 100%)'}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default GradingConfigSection;
export type { GradingConfigSectionProps };
