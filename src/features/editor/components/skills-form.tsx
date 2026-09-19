'use client';

import { emptySkillGroup } from '@/entities/resume';
import { TextInput } from '@/shared/ui/field';
import { useListSection, useResume } from '../hooks';
import { FieldStack, SectionShell } from './section-shell';
import { SortableList } from './sortable-list';
import { TokenField } from './token-field';

export function SkillsForm() {
  const { skills } = useResume();
  const list = useListSection('skills');

  return (
    <SectionShell
      title="Skills"
      description="Group related skills so a reader can scan by category rather than by keyword."
      onAdd={() => list.add(emptySkillGroup)}
      addLabel="Add group"
    >
      <SortableList
        items={skills}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove group"
        emptyMessage="No skill groups yet."
        renderSummary={(item) => ({
          title: item.category || 'Untitled group',
          subtitle: item.items.slice(0, 4).join(', '),
        })}
        renderFields={(item) => (
          <FieldStack>
            <TextInput
              label="Category"
              placeholder="Languages"
              value={item.category}
              onChange={(event) =>
                list.patch(item.id, { category: event.target.value }, `skill.${item.id}.category`)
              }
            />
            <TokenField
              label="Skills"
              hint="Separate with commas."
              placeholder="TypeScript, Python, Go, SQL"
              value={item.items}
              onChange={(items) => list.patch(item.id, { items })}
            />
          </FieldStack>
        )}
      />
    </SectionShell>
  );
}
