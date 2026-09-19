'use client';

import { Plus, Trash2 } from 'lucide-react';
import { createId } from '@/entities/resume';
import { Button, IconButton } from '@/shared/ui/button';
import { TextArea, TextInput } from '@/shared/ui/field';
import { useResume, useUpdateResume } from '../hooks';
import { FieldRow, FieldStack, SectionShell } from './section-shell';

export function ProfileForm() {
  const resume = useResume();
  const update = useUpdateResume();
  const { profile } = resume;

  const setField = (key: keyof typeof profile, value: string) =>
    update(
      (draft) => {
        // Only the string fields are routed through here.
        (draft.profile as unknown as Record<string, string>)[key] = value;
      },
      { coalesceKey: `profile.${String(key)}` },
    );

  return (
    <SectionShell
      title="Personal details"
      description="The header of your resume. Leave anything blank and it simply will not print."
    >
      <FieldStack>
        <FieldRow>
          <TextInput
            label="Full name"
            placeholder="Alex Morgan"
            value={profile.fullName}
            onChange={(event) => setField('fullName', event.target.value)}
          />
          <TextInput
            label="Headline"
            placeholder="Senior Product Engineer"
            value={profile.headline}
            onChange={(event) => setField('headline', event.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={profile.email}
            onChange={(event) => setField('email', event.target.value)}
          />
          <TextInput
            label="Phone"
            placeholder="+1 (415) 555-0148"
            value={profile.phone}
            onChange={(event) => setField('phone', event.target.value)}
          />
        </FieldRow>

        <FieldRow>
          <TextInput
            label="Location"
            placeholder="San Francisco, CA"
            value={profile.location}
            onChange={(event) => setField('location', event.target.value)}
          />
          <TextInput
            label="Website"
            placeholder="alexmorgan.dev"
            value={profile.website}
            onChange={(event) => setField('website', event.target.value)}
          />
        </FieldRow>

        <TextArea
          label="Professional summary"
          hint="Two or three sentences. Lead with what you do, then the evidence."
          rows={5}
          placeholder="Product-minded engineer with eight years building customer-facing web platforms…"
          value={profile.summary}
          onChange={(event) => setField('summary', event.target.value)}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
              Profile links
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                update((draft) => {
                  draft.profile.links.push({ id: createId(), label: '', url: '' });
                })
              }
            >
              <Plus size={14} aria-hidden />
              Add link
            </Button>
          </div>

          {profile.links.length === 0 ? (
            <p className="rounded-xl border border-dashed border-rule-strong px-4 py-5 text-center text-[13px] text-ink-faint">
              Add LinkedIn, GitHub, a portfolio — anything worth a click.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {profile.links.map((link) => (
                <li key={link.id} className="flex items-end gap-2">
                  <TextInput
                    label="Label"
                    placeholder="LinkedIn"
                    wrapperClassName="w-36 shrink-0"
                    value={link.label}
                    onChange={(event) =>
                      update(
                        (draft) => {
                          const target = draft.profile.links.find((item) => item.id === link.id);
                          if (target) target.label = event.target.value;
                        },
                        { coalesceKey: `link.${link.id}.label` },
                      )
                    }
                  />
                  <TextInput
                    label="URL"
                    placeholder="linkedin.com/in/you"
                    wrapperClassName="flex-1"
                    value={link.url}
                    onChange={(event) =>
                      update(
                        (draft) => {
                          const target = draft.profile.links.find((item) => item.id === link.id);
                          if (target) target.url = event.target.value;
                        },
                        { coalesceKey: `link.${link.id}.url` },
                      )
                    }
                  />
                  <IconButton
                    label="Remove link"
                    variant="danger"
                    className="mb-1"
                    onClick={() =>
                      update((draft) => {
                        draft.profile.links = draft.profile.links.filter(
                          (item) => item.id !== link.id,
                        );
                      })
                    }
                  >
                    <Trash2 size={15} aria-hidden />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FieldStack>
    </SectionShell>
  );
}
