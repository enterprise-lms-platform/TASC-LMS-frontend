import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ModuleCard from './ModuleCard';
import type { ModuleData } from './ModuleCard';

interface SortableModuleCardProps {
  module: ModuleData;
  expanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  children?: React.ReactNode;
}

const SortableModuleCard: React.FC<SortableModuleCardProps> = ({
  module,
  expanded,
  onToggle,
  onEdit,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `module-${module.id}`,
    data: { type: 'module', module },
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
      <ModuleCard
        module={module}
        expanded={expanded}
        onToggle={onToggle}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {children}
      </ModuleCard>
    </div>
  );
};

export default SortableModuleCard;
