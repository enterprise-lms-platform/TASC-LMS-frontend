import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Add as AddIcon,
  UnfoldMore as ExpandIcon,
  CheckBoxOutlineBlank as SelectIcon,
  SwapVert as ReorderIcon,
  MoreHoriz as BulkIcon,
  ViewList as DetailViewIcon,
  ViewHeadline as CompactViewIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  Description as LessonIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import ModuleCard from './ModuleCard';
import type { ModuleData } from './ModuleCard';
import LessonItem from './LessonItem';
import type { LessonData } from './LessonItem';
import { AddModuleCard, AddLessonButton } from './AddContentCards';

interface CurriculumData {
  modules: (ModuleData & { lessons: LessonData[] })[];
}

interface CurriculumBuilderProps {
  data: CurriculumData;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onEditModule?: (moduleId: string) => void;
  onEditLesson?: (lessonId: string) => void;
}

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({
  data,
  onAddModule,
  onAddLesson,
  onEditModule,
  onEditLesson,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1']));
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedModules(new Set(data.modules.map((m) => m.id)));
  };

  const totalModules = data.modules.length;
  const totalLessons = data.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = '12h 30m'; // Could calculate from modules

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 3,
          borderBottom: 1,
          borderColor: 'grey.200',
          bgcolor: 'grey.50',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Curriculum Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FolderIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              {totalModules} Modules
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LessonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              {totalLessons} Lessons
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              {totalDuration} Total
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ExpandIcon />}
            onClick={expandAll}
            sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
          >
            Expand All
          </Button>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={onAddModule}>
            Add Module
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          p: 1.5,
          px: 3,
          borderBottom: 1,
          borderColor: 'grey.200',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<SelectIcon />} sx={{ color: 'text.secondary' }}>
            Select
          </Button>
          <Button size="small" startIcon={<ReorderIcon />} sx={{ color: 'text.secondary' }}>
            Reorder
          </Button>
          <Button size="small" startIcon={<BulkIcon />} disabled sx={{ color: 'text.secondary' }}>
            Bulk Actions
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
            sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 0.25 }}
          >
            <ToggleButton value="detailed" sx={{ px: 1.5, py: 0.5, border: 0 }}>
              <DetailViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="compact" sx={{ px: 1.5, py: 0.5, border: 0 }}>
              <CompactViewIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <TextField
            size="small"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'grey.400', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
        </Box>
      </Box>

      {/* Modules Container */}
      <Box sx={{ p: 2, minHeight: 400 }}>
        {data.modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            expanded={expandedModules.has(module.id)}
            onToggle={() => toggleModule(module.id)}
            onEdit={() => onEditModule?.(module.id)}
          >
            {module.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                onEdit={() => onEditLesson?.(lesson.id)}
              />
            ))}
            <AddLessonButton onClick={() => onAddLesson(module.id)} />
          </ModuleCard>
        ))}
        <AddModuleCard onClick={onAddModule} />
      </Box>
    </Paper>
  );
};

export default CurriculumBuilder;
export type { CurriculumData };
