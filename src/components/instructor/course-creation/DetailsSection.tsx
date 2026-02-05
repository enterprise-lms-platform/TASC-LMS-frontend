import {
  Box,
  Paper,
  Typography,
  TextField,
  FormHelperText,
} from '@mui/material';
import ObjectivesList from './ObjectivesList';
import DifficultySelector from './DifficultySelector';
import type { DifficultyLevel } from './DifficultySelector';

interface DetailsData {
  objectives: string[];
  difficulty: DifficultyLevel;
  durationHours: number;
  durationMinutes: number;
  requirements: string;
  targetAudience: string;
}

interface DetailsSectionProps {
  data: DetailsData;
  onChange: (data: DetailsData) => void;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof DetailsData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Section Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          Course Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define what learners will achieve and who this course is for
        </Typography>
      </Box>

      {/* Learning Objectives */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Learning Objectives <Typography component="span" color="error.main">*</Typography>
        </Typography>
        <ObjectivesList
          objectives={data.objectives}
          onChange={(objectives) => handleChange('objectives', objectives)}
          minItems={4}
          maxItems={10}
        />
      </Box>

      {/* Difficulty Level */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Difficulty Level <Typography component="span" color="error.main">*</Typography>
        </Typography>
        <DifficultySelector
          value={data.difficulty}
          onChange={(level) => handleChange('difficulty', level)}
        />
      </Box>

      {/* Estimated Duration */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Estimated Duration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Hours
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="0"
              value={data.durationHours || ''}
              onChange={(e) => handleChange('durationHours', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 999 }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Minutes
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="0"
              value={data.durationMinutes || ''}
              onChange={(e) => handleChange('durationMinutes', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 59 }}
            />
          </Box>
        </Box>
        <FormHelperText>Total time learners will spend on this course</FormHelperText>
      </Box>

      {/* Requirements */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Requirements"
          placeholder="List any technical requirements, software, or prior knowledge needed..."
          value={data.requirements}
          onChange={(e) => handleChange('requirements', e.target.value)}
          helperText="What learners need before starting this course"
        />
      </Box>

      {/* Target Audience */}
      <Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Target Audience"
          placeholder="Describe who this course is for..."
          value={data.targetAudience}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
          helperText="Help learners understand if this course is right for them"
        />
      </Box>
    </Paper>
  );
};

export default DetailsSection;
export type { DetailsData };
