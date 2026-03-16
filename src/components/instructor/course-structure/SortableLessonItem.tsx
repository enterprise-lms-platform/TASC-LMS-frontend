import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LessonItem from './LessonItem';
import type { LessonData } from './LessonItem';

interface SortableLessonItemProps {
  lesson: LessonData;
  onEdit?: () => void;
  onPreview?: () => void;
  onMore?: () => void;
  onToggleComplete?: () => void;
}

const SortableLessonItem: React.FC<SortableLessonItemProps> = ({
  lesson,
  onEdit,
  onPreview,
  onMore,
  onToggleComplete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `lesson-${lesson.id}`,
    data: { type: 'lesson', lesson },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LessonItem
        lesson={lesson}
        onEdit={onEdit}
        onPreview={onPreview}
        onMore={onMore}
        onToggleComplete={onToggleComplete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

export default SortableLessonItem;
