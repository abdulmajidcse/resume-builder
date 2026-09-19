'use client';

import * as React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/button';

export interface SortableItem {
  id: string;
}

interface RowProps {
  id: string;
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  onRemove: () => void;
  removeLabel: string;
  children: React.ReactNode;
}

function Row({ id, title, subtitle, open, onToggle, onRemove, removeLabel, children }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const panelId = `${id}-panel`;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'overflow-hidden rounded-xl border border-rule bg-paper-raised transition-shadow',
        isDragging ? 'z-10 shadow-float' : 'shadow-sm',
      )}
    >
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          aria-label="Reorder"
          className="cursor-grab touch-none rounded-md p-1.5 text-ink-faint transition-colors hover:bg-clay-soft/60 hover:text-clay-deep active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={15} aria-hidden />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left transition-colors hover:bg-clay-soft/40"
        >
          <ChevronDown
            size={15}
            aria-hidden
            className={cn('shrink-0 text-ink-faint transition-transform', !open && '-rotate-90')}
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">{title}</span>
            {subtitle ? (
              <span className="block truncate text-xs text-ink-faint">{subtitle}</span>
            ) : null}
          </span>
        </button>

        <IconButton label={removeLabel} variant="danger" onClick={onRemove}>
          <Trash2 size={15} aria-hidden />
        </IconButton>
      </div>

      {open ? (
        <div id={panelId} className="border-t border-rule bg-paper/40 px-3.5 py-4">
          {children}
        </div>
      ) : null}
    </li>
  );
}

export interface SortableListProps<T extends SortableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  onRemove: (id: string) => void;
  /** Collapsed-row summary for an entry. */
  renderSummary: (item: T, index: number) => { title: string; subtitle?: string };
  renderFields: (item: T, index: number) => React.ReactNode;
  removeLabel: string;
  emptyMessage: string;
}

/**
 * Reorderable, collapsible entry list.
 *
 * Every repeating section in the editor is this component with different
 * fields, which is why experience, education, projects and the rest behave
 * identically without sharing accidental coupling.
 */
export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  onRemove,
  renderSummary,
  renderFields,
  removeLabel,
  emptyMessage,
}: SortableListProps<T>) {
  const [openId, setOpenId] = React.useState<string | null>(items[0]?.id ?? null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(to, 0, moved);
    onReorder(next);
  };

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-rule-strong px-4 py-8 text-center text-sm text-ink-faint">
        {emptyMessage}
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2.5">
          {items.map((item, index) => {
            const summary = renderSummary(item, index);
            return (
              <Row
                key={item.id}
                id={item.id}
                title={summary.title}
                subtitle={summary.subtitle}
                open={openId === item.id}
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
                onRemove={() => onRemove(item.id)}
                removeLabel={removeLabel}
              >
                {renderFields(item, index)}
              </Row>
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
