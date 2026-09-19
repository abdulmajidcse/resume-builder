'use client';

import { emptyExperience } from '@/entities/resume';
import { Switch, TextArea, TextInput } from '@/shared/ui/field';
import { arrayToLines, linesToArray, useListSection, useResume } from '../hooks';
import { FieldRow, FieldStack, SectionShell } from './section-shell';
import { SortableList } from './sortable-list';

export function ExperienceForm() {
  const { experience } = useResume();
  const list = useListSection('experience');

  return (
    <SectionShell
      title="Experience"
      description="Most recent first. Drag the handle to reorder; write achievements, not duties."
      onAdd={() => list.add(emptyExperience)}
      addLabel="Add role"
    >
      <SortableList
        items={experience}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove role"
        emptyMessage="No roles yet. Add your first one to get started."
        renderSummary={(item) => ({
          title: item.role || 'Untitled role',
          subtitle: [item.company, item.current ? 'Present' : item.endDate]
            .filter(Boolean)
            .join(' · '),
        })}
        renderFields={(item) => (
          <FieldStack>
            <FieldRow>
              <TextInput
                label="Role"
                placeholder="Senior Product Engineer"
                value={item.role}
                onChange={(event) =>
                  list.patch(item.id, { role: event.target.value }, `exp.${item.id}.role`)
                }
              />
              <TextInput
                label="Company"
                placeholder="Northwind Labs"
                value={item.company}
                onChange={(event) =>
                  list.patch(item.id, { company: event.target.value }, `exp.${item.id}.company`)
                }
              />
            </FieldRow>

            <FieldRow>
              <TextInput
                label="Location"
                placeholder="San Francisco, CA"
                value={item.location}
                onChange={(event) =>
                  list.patch(item.id, { location: event.target.value }, `exp.${item.id}.location`)
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Start"
                  placeholder="Mar 2021"
                  value={item.startDate}
                  onChange={(event) =>
                    list.patch(item.id, { startDate: event.target.value }, `exp.${item.id}.start`)
                  }
                />
                <TextInput
                  label="End"
                  placeholder="Feb 2024"
                  disabled={item.current}
                  value={item.current ? '' : item.endDate}
                  onChange={(event) =>
                    list.patch(item.id, { endDate: event.target.value }, `exp.${item.id}.end`)
                  }
                />
              </div>
            </FieldRow>

            <Switch
              label="I currently work here"
              description="Prints “Present” in place of an end date."
              checked={item.current}
              onCheckedChange={(checked) => list.patch(item.id, { current: checked })}
            />

            <TextArea
              label="Achievements"
              hint="One per line. Start with the outcome, then how you got there."
              rows={5}
              placeholder={
                'Cut median dashboard load time from 4.1s to 0.9s\nMentored five engineers; three were promoted'
              }
              value={arrayToLines(item.highlights)}
              onChange={(event) =>
                list.patch(
                  item.id,
                  { highlights: linesToArray(event.target.value) },
                  `exp.${item.id}.highlights`,
                )
              }
            />
          </FieldStack>
        )}
      />
    </SectionShell>
  );
}
