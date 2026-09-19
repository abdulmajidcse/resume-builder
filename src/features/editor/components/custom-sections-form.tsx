'use client';

import { Plus, Trash2 } from 'lucide-react';
import { emptyCustomEntry, emptyCustomSection } from '@/entities/resume';
import { Button, IconButton } from '@/shared/ui/button';
import { TextArea, TextInput } from '@/shared/ui/field';
import { useResume, useUpdateResume } from '../hooks';
import { FieldRow, FieldStack, SectionShell } from './section-shell';

/**
 * Free-form sections for anything the built-in set does not cover —
 * publications, volunteering, speaking, patents.
 */
export function CustomSectionsForm() {
  const { customSections } = useResume();
  const update = useUpdateResume();

  return (
    <SectionShell
      title="Custom sections"
      description="Anything the standard sections do not cover. These always print last."
      onAdd={() => update((draft) => void draft.customSections.push(emptyCustomSection()))}
      addLabel="Add section"
    >
      {customSections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-rule-strong px-4 py-8 text-center text-sm text-ink-faint">
          No custom sections yet. Add one for publications, volunteering, or speaking.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {customSections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-rule bg-paper-raised p-3.5 shadow-sm"
            >
              <div className="flex items-end gap-2">
                <TextInput
                  label="Section title"
                  placeholder="Publications"
                  wrapperClassName="flex-1"
                  value={section.title}
                  onChange={(event) =>
                    update(
                      (draft) => {
                        const target = draft.customSections.find((item) => item.id === section.id);
                        if (target) target.title = event.target.value;
                      },
                      { coalesceKey: `custom.${section.id}.title` },
                    )
                  }
                />
                <IconButton
                  label="Remove section"
                  variant="danger"
                  className="mb-1"
                  onClick={() =>
                    update((draft) => {
                      draft.customSections = draft.customSections.filter(
                        (item) => item.id !== section.id,
                      );
                    })
                  }
                >
                  <Trash2 size={15} aria-hidden />
                </IconButton>
              </div>

              <ul className="mt-3 flex flex-col gap-3">
                {section.entries.map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-rule bg-paper/50 p-3">
                    <FieldStack>
                      <FieldRow>
                        <TextInput
                          label="Title"
                          value={entry.title}
                          onChange={(event) =>
                            update(
                              (draft) => {
                                const target = draft.customSections
                                  .find((item) => item.id === section.id)
                                  ?.entries.find((item) => item.id === entry.id);
                                if (target) target.title = event.target.value;
                              },
                              { coalesceKey: `custom.${entry.id}.title` },
                            )
                          }
                        />
                        <TextInput
                          label="Subtitle"
                          value={entry.subtitle}
                          onChange={(event) =>
                            update(
                              (draft) => {
                                const target = draft.customSections
                                  .find((item) => item.id === section.id)
                                  ?.entries.find((item) => item.id === entry.id);
                                if (target) target.subtitle = event.target.value;
                              },
                              { coalesceKey: `custom.${entry.id}.subtitle` },
                            )
                          }
                        />
                      </FieldRow>
                      <TextInput
                        label="Date"
                        value={entry.date}
                        onChange={(event) =>
                          update(
                            (draft) => {
                              const target = draft.customSections
                                .find((item) => item.id === section.id)
                                ?.entries.find((item) => item.id === entry.id);
                              if (target) target.date = event.target.value;
                            },
                            { coalesceKey: `custom.${entry.id}.date` },
                          )
                        }
                      />
                      <TextArea
                        label="Description"
                        rows={2}
                        value={entry.description}
                        onChange={(event) =>
                          update(
                            (draft) => {
                              const target = draft.customSections
                                .find((item) => item.id === section.id)
                                ?.entries.find((item) => item.id === entry.id);
                              if (target) target.description = event.target.value;
                            },
                            { coalesceKey: `custom.${entry.id}.description` },
                          )
                        }
                      />
                    </FieldStack>

                    <div className="mt-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          update((draft) => {
                            const target = draft.customSections.find(
                              (item) => item.id === section.id,
                            );
                            if (target)
                              target.entries = target.entries.filter(
                                (item) => item.id !== entry.id,
                              );
                          })
                        }
                      >
                        <Trash2 size={14} aria-hidden />
                        Remove entry
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              <Button
                size="sm"
                variant="ghost"
                className="mt-3"
                onClick={() =>
                  update((draft) => {
                    const target = draft.customSections.find((item) => item.id === section.id);
                    if (target) target.entries.push(emptyCustomEntry());
                  })
                }
              >
                <Plus size={14} aria-hidden />
                Add entry
              </Button>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
