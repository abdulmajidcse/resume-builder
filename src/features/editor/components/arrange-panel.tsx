'use client';

import { Eye, EyeOff, GripVertical } from 'lucide-react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SECTION_LABELS } from '@/entities/resume';
import type { SectionMeta } from '@/entities/resume';
import { IconButton } from '@/shared/ui/button';
import { TextInput } from '@/shared/ui/field';
import { cn } from '@/shared/lib/cn';
import { useResumeStore } from '../store';
import { useResume, useUpdateResume } from '../hooks';
import { SectionShell } from './section-shell';

function SectionRow({ section }: { section: SectionMeta }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const toggleSection = useResumeStore((state) => state.toggleSection);
  const update = useUpdateResume();

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 rounded-xl border border-rule bg-paper-raised px-2 py-2 transition-shadow',
        isDragging ? 'z-10 shadow-float' : 'shadow-sm',
        !section.visible && 'opacity-55',
      )}
    >
      <button
        type="button"
        aria-label={`Reorder ${SECTION_LABELS[section.id]}`}
        className="cursor-grab touch-none rounded-md p-1.5 text-ink-faint transition-colors hover:bg-clay-soft/60 hover:text-clay-deep active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} aria-hidden />
      </button>

      <span className="w-32 shrink-0 truncate text-sm font-medium text-ink">
        {SECTION_LABELS[section.id]}
      </span>

      <TextInput
        label={`Heading for ${SECTION_LABELS[section.id]}`}
        srOnlyLabel
        wrapperClassName="flex-1"
        className="h-9 py-1"
        placeholder={SECTION_LABELS[section.id]}
        value={section.title}
        onChange={(event) =>
          update(
            (draft) => {
              const target = draft.sections.find((item) => item.id === section.id);
              if (target) target.title = event.target.value;
            },
            { coalesceKey: `section.${section.id}.title` },
          )
        }
      />

      <IconButton
        label={
          section.visible
            ? `Hide ${SECTION_LABELS[section.id]}`
            : `Show ${SECTION_LABELS[section.id]}`
        }
        onClick={() => toggleSection(section.id)}
      >
        {section.visible ? <Eye size={15} aria-hidden /> : <EyeOff size={15} aria-hidden />}
      </IconButton>
    </li>
  );
}

/** Controls section order, headings and visibility for the whole document. */
export function ArrangePanel() {
  const { sections } = useResume();
  const setSections = useResumeStore((state) => state.setSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((item) => item.id === active.id);
    const to = sections.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;
    const next = [...sections];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(to, 0, moved);
    setSections(next);
  };

  return (
    <SectionShell
      title="Arrange"
      description="Reorder sections, rename their headings, or hide the ones you do not need. Empty sections never print."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {sections.map((section) => (
              <SectionRow key={section.id} section={section} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </SectionShell>
  );
}
