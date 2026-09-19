'use client';

import { emptyProject } from '@/entities/resume';
import { TextArea, TextInput } from '@/shared/ui/field';
import { useListSection, useResume } from '../hooks';
import { FieldRow, FieldStack, SectionShell } from './section-shell';
import { SortableList } from './sortable-list';
import { TokenField } from './token-field';

export function ProjectsForm() {
  const { projects } = useResume();
  const list = useListSection('projects');

  return (
    <SectionShell
      title="Projects"
      description="Side work, open source, or things you shipped that deserve their own line."
      onAdd={() => list.add(emptyProject)}
      addLabel="Add project"
    >
      <SortableList
        items={projects}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove project"
        emptyMessage="No projects yet."
        renderSummary={(item) => ({
          title: item.name || 'Untitled project',
          subtitle: [item.role, item.endDate].filter(Boolean).join(' · '),
        })}
        renderFields={(item) => (
          <FieldStack>
            <FieldRow>
              <TextInput
                label="Name"
                placeholder="Ledgerline"
                value={item.name}
                onChange={(event) =>
                  list.patch(item.id, { name: event.target.value }, `proj.${item.id}.name`)
                }
              />
              <TextInput
                label="Your role"
                placeholder="Creator"
                value={item.role}
                onChange={(event) =>
                  list.patch(item.id, { role: event.target.value }, `proj.${item.id}.role`)
                }
              />
            </FieldRow>

            <FieldRow>
              <TextInput
                label="Link"
                placeholder="github.com/you/project"
                value={item.url}
                onChange={(event) =>
                  list.patch(item.id, { url: event.target.value }, `proj.${item.id}.url`)
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Start"
                  placeholder="2023"
                  value={item.startDate}
                  onChange={(event) =>
                    list.patch(item.id, { startDate: event.target.value }, `proj.${item.id}.start`)
                  }
                />
                <TextInput
                  label="End"
                  placeholder="2024"
                  value={item.endDate}
                  onChange={(event) =>
                    list.patch(item.id, { endDate: event.target.value }, `proj.${item.id}.end`)
                  }
                />
              </div>
            </FieldRow>

            <TextArea
              label="Description"
              rows={3}
              placeholder="Open-source double-entry accounting engine with a typed query layer."
              value={item.description}
              onChange={(event) =>
                list.patch(
                  item.id,
                  { description: event.target.value },
                  `proj.${item.id}.description`,
                )
              }
            />

            <TokenField
              label="Technologies"
              hint="Separate with commas."
              placeholder="TypeScript, PostgreSQL, Prisma"
              value={item.technologies}
              onChange={(technologies) => list.patch(item.id, { technologies })}
            />
          </FieldStack>
        )}
      />
    </SectionShell>
  );
}
