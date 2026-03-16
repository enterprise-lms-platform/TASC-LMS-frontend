import React, { useState, useMemo } from 'react';
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableModuleCard from './SortableModuleCard';
import SortableLessonItem from './SortableLessonItem';
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
  onPreviewLesson?: (lessonId: string) => void;
  onReorderModules?: (activeModuleId: string, overModuleId: string) => void;
  onReorderLessons?: (
    lessonId: string,
    fromModuleId: string,
    toModuleId: string,
    overLessonId: string | null,
  ) => void;
  // Legacy props (kept for backward compat but unused with dnd-kit)
  onDragStartLesson?: (lessonId: number) => void;
  onDragEndLesson?: () => void;
  onDropModule?: (moduleId: string) => void;
}

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({
  data,
  onAddModule,
  onAddLesson,
  onEditModule,
  onEditLesson,
  onPreviewLesson,
  onReorderModules,
  onReorderLessons,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(data.modules.map((m) => m.id))
  );
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDragItem, setActiveDragItem] = useState<{
    type: 'module' | 'lesson';
    data: ModuleData | LessonData;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const moduleIds = useMemo(
    () => data.modules.map((m) => `module-${m.id}`),
    [data.modules],
  );

  const lessonIdsByModule = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const mod of data.modules) {
      map[mod.id] = mod.lessons.map((l) => `lesson-${l.id}`);
    }
    return map;
  }, [data.modules]);

  const allLessonIds = useMemo(
    () => data.modules.flatMap((m) => m.lessons.map((l) => `lesson-${l.id}`)),
    [data.modules],
  );

  const findModuleForLesson = (lessonDndId: string): string | undefined => {
    for (const mod of data.modules) {
      if (mod.lessons.some((l) => `lesson-${l.id}` === lessonDndId)) {
        return mod.id;
      }
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const itemData = active.data.current;
    if (itemData?.type === 'module') {
      setActiveDragItem({ type: 'module', data: itemData.module });
    } else if (itemData?.type === 'lesson') {
      setActiveDragItem({ type: 'lesson', data: itemData.lesson });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Module reorder: both are modules
    if (activeData?.type === 'module' && overData?.type === 'module') {
      const activeId = (active.id as string).replace('module-', '');
      const overId = (over.id as string).replace('module-', '');
      onReorderModules?.(activeId, overId);
      return;
    }

    // Lesson reorder
    if (activeData?.type === 'lesson') {
      const lessonId = (active.id as string).replace('lesson-', '');
      const fromModuleId = findModuleForLesson(active.id as string);

      let toModuleId: string | undefined;
      let overLessonId: string | null = null;

      if (overData?.type === 'lesson') {
        toModuleId = findModuleForLesson(over.id as string);
        overLessonId = (over.id as string).replace('lesson-', '');
      } else if (overData?.type === 'module') {
        // Dropped on a module header — move to end of that module
        toModuleId = (over.id as string).replace('module-', '');
      }

      if (fromModuleId && toModuleId) {
        onReorderLessons?.(lessonId, fromModuleId, toModuleId, overLessonId);
      }
    }
  };

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
  const totalDuration = '12h 30m';

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

      {/* Modules Container with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ p: 2, minHeight: 400 }}>
          <SortableContext items={[...moduleIds, ...allLessonIds]} strategy={verticalListSortingStrategy}>
            {data.modules.map((module) => (
              <SortableModuleCard
                key={module.id}
                module={module}
                expanded={expandedModules.has(module.id)}
                onToggle={() => toggleModule(module.id)}
                onEdit={() => onEditModule?.(module.id)}
              >
                <SortableContext items={lessonIdsByModule[module.id] ?? []} strategy={verticalListSortingStrategy}>
                  {module.lessons.map((lesson) => (
                    <SortableLessonItem
                      key={lesson.id}
                      lesson={lesson}
                      onEdit={() => onEditLesson?.(lesson.id)}
                      onPreview={() => onPreviewLesson?.(lesson.id)}
                    />
                  ))}
                </SortableContext>
                <AddLessonButton onClick={() => onAddLesson(module.id)} />
              </SortableModuleCard>
            ))}
          </SortableContext>
          <AddModuleCard onClick={onAddModule} />
        </Box>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDragItem?.type === 'lesson' && (
            <Box sx={{ opacity: 0.85, boxShadow: 3, borderRadius: 1 }}>
              <LessonItem lesson={activeDragItem.data as LessonData} />
            </Box>
          )}
          {activeDragItem?.type === 'module' && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'grey.50',
                opacity: 0.85,
              }}
            >
              <Typography fontWeight={600}>
                {(activeDragItem.data as ModuleData).title}
              </Typography>
            </Paper>
          )}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
};

export default CurriculumBuilder;
export type { CurriculumData };
