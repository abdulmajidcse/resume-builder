'use client';

import { emptyEducation } from '@/entities/resume';
import { TextArea, TextInput } from '@/shared/ui/field';
import { useListSection, useResume } from '../hooks';
import { FieldRow, FieldStack, SectionShell } from './section-shell';
import { SortableList } from './sortable-list';

export function EducationForm() {
  const { education } = useResume();
  const list = useListSection('education');

  return (
    <SectionShell
      title="Education"
      description="Degrees, diplomas and formal programmes."
      onAdd={() => list.add(emptyEducation)}
      addLabel="Add education"
    >
      <SortableList
        items={education}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove education"
        emptyMessage="No education entries yet."
        renderSummary={(item) => ({
          title: item.degree || 'Untitled qualification',
          subtitle: [item.institution, item.endDate].filter(Boolean).join(' · '),
        })}
        renderFields={(item) => (
          <FieldStack>
            <FieldRow>
              <TextInput
                label="Degree"
                placeholder="B.S. Computer Science"
                value={item.degree}
                onChange={(event) =>
                  list.patch(item.id, { degree: event.target.value }, `edu.${item.id}.degree`)
                }
              />
              <TextInput
                label="Institution"
                placeholder="University of Texas at Austin"
                value={item.institution}
                onChange={(event) =>
                  list.patch(
                    item.id,
                    { institution: event.target.value },
                    `edu.${item.id}.institution`,
                  )
                }
              />
            </FieldRow>

            <FieldRow>
              <TextInput
                label="Location"
                placeholder="Austin, TX"
                value={item.location}
                onChange={(event) =>
                  list.patch(item.id, { location: event.target.value }, `edu.${item.id}.location`)
                }
              />
              <TextInput
                label="Grade"
                placeholder="3.8 GPA"
                value={item.grade}
                onChange={(event) =>
                  list.patch(item.id, { grade: event.target.value }, `edu.${item.id}.grade`)
                }
              />
            </FieldRow>

            <FieldRow>
              <TextInput
                label="Start"
                placeholder="2012"
                value={item.startDate}
                onChange={(event) =>
                  list.patch(item.id, { startDate: event.target.value }, `edu.${item.id}.start`)
                }
              />
              <TextInput
                label="End"
                placeholder="2016"
                value={item.endDate}
                onChange={(event) =>
                  list.patch(item.id, { endDate: event.target.value }, `edu.${item.id}.end`)
                }
              />
            </FieldRow>

            <TextArea
              label="Details"
              hint="Optional — relevant coursework, thesis, honours."
              rows={3}
              value={item.details}
              onChange={(event) =>
                list.patch(item.id, { details: event.target.value }, `edu.${item.id}.details`)
              }
            />
          </FieldStack>
        )}
      />
    </SectionShell>
  );
}
