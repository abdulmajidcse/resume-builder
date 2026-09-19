'use client';

import { emptyAward, emptyCertification, emptyLanguage } from '@/entities/resume';
import { TextArea, TextInput } from '@/shared/ui/field';
import { useListSection, useResume } from '../hooks';
import { FieldRow, FieldStack, SectionShell } from './section-shell';
import { SortableList } from './sortable-list';

export function CertificationsForm() {
  const { certifications } = useResume();
  const list = useListSection('certifications');

  return (
    <SectionShell
      title="Certifications"
      description="Credentials with an issuing body and a date."
      onAdd={() => list.add(emptyCertification)}
      addLabel="Add certification"
    >
      <SortableList
        items={certifications}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove certification"
        emptyMessage="No certifications yet."
        renderSummary={(item) => ({
          title: item.name || 'Untitled certification',
          subtitle: [item.issuer, item.date].filter(Boolean).join(' · '),
        })}
        renderFields={(item) => (
          <FieldStack>
            <TextInput
              label="Name"
              placeholder="AWS Certified Solutions Architect"
              value={item.name}
              onChange={(event) =>
                list.patch(item.id, { name: event.target.value }, `cert.${item.id}.name`)
              }
            />
            <FieldRow>
              <TextInput
                label="Issuer"
                placeholder="Amazon Web Services"
                value={item.issuer}
                onChange={(event) =>
                  list.patch(item.id, { issuer: event.target.value }, `cert.${item.id}.issuer`)
                }
              />
              <TextInput
                label="Date"
                placeholder="2023"
                value={item.date}
                onChange={(event) =>
                  list.patch(item.id, { date: event.target.value }, `cert.${item.id}.date`)
                }
              />
            </FieldRow>
            <TextInput
              label="Credential link"
              placeholder="credly.com/badges/…"
              value={item.credentialUrl}
              onChange={(event) =>
                list.patch(item.id, { credentialUrl: event.target.value }, `cert.${item.id}.url`)
              }
            />
          </FieldStack>
        )}
      />
    </SectionShell>
  );
}

export function LanguagesForm() {
  const { languages } = useResume();
  const list = useListSection('languages');

  return (
    <SectionShell
      title="Languages"
      description="Spoken languages and how fluently."
      onAdd={() => list.add(emptyLanguage)}
      addLabel="Add language"
    >
      <SortableList
        items={languages}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove language"
        emptyMessage="No languages yet."
        renderSummary={(item) => ({
          title: item.name || 'Untitled language',
          subtitle: item.proficiency,
        })}
        renderFields={(item) => (
          <FieldRow>
            <TextInput
              label="Language"
              placeholder="Spanish"
              value={item.name}
              onChange={(event) =>
                list.patch(item.id, { name: event.target.value }, `lang.${item.id}.name`)
              }
            />
            <TextInput
              label="Proficiency"
              placeholder="Professional working"
              value={item.proficiency}
              onChange={(event) =>
                list.patch(
                  item.id,
                  { proficiency: event.target.value },
                  `lang.${item.id}.proficiency`,
                )
              }
            />
          </FieldRow>
        )}
      />
    </SectionShell>
  );
}

export function AwardsForm() {
  const { awards } = useResume();
  const list = useListSection('awards');

  return (
    <SectionShell
      title="Awards"
      description="Recognition worth a line of its own."
      onAdd={() => list.add(emptyAward)}
      addLabel="Add award"
    >
      <SortableList
        items={awards}
        onReorder={list.reorder}
        onRemove={list.remove}
        removeLabel="Remove award"
        emptyMessage="No awards yet."
        renderSummary={(item) => ({
          title: item.title || 'Untitled award',
          subtitle: [item.issuer, item.date].filter(Boolean).join(' · '),
        })}
        renderFields={(item) => (
          <FieldStack>
            <FieldRow>
              <TextInput
                label="Title"
                placeholder="Engineering Excellence Award"
                value={item.title}
                onChange={(event) =>
                  list.patch(item.id, { title: event.target.value }, `award.${item.id}.title`)
                }
              />
              <TextInput
                label="Issuer"
                placeholder="Northwind Labs"
                value={item.issuer}
                onChange={(event) =>
                  list.patch(item.id, { issuer: event.target.value }, `award.${item.id}.issuer`)
                }
              />
            </FieldRow>
            <TextInput
              label="Date"
              placeholder="2023"
              value={item.date}
              onChange={(event) =>
                list.patch(item.id, { date: event.target.value }, `award.${item.id}.date`)
              }
            />
            <TextArea
              label="Description"
              rows={2}
              value={item.description}
              onChange={(event) =>
                list.patch(
                  item.id,
                  { description: event.target.value },
                  `award.${item.id}.description`,
                )
              }
            />
          </FieldStack>
        )}
      />
    </SectionShell>
  );
}
