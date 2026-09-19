'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Languages,
  LayoutTemplate,
  ListOrdered,
  Palette,
  Plus,
  ScrollText,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { ResumePreview } from '@/features/export/resume-preview';
import { usePrint, usePrintPageSize } from '@/features/export/use-print';
import { toFileStem } from '@/shared/lib/format';
import { useResumeStore } from '../store';
import { useResume } from '../hooks';
import { Toolbar } from './toolbar';
import { ProfileForm } from './profile-form';
import { ExperienceForm } from './experience-form';
import { EducationForm } from './education-form';
import { ProjectsForm } from './projects-form';
import { SkillsForm } from './skills-form';
import { AwardsForm, CertificationsForm, LanguagesForm } from './extras-form';
import { CustomSectionsForm } from './custom-sections-form';
import { DesignPanel } from './design-panel';
import { ArrangePanel } from './arrange-panel';
import { TemplatePanel } from './template-panel';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  group: 'content' | 'layout';
  render: () => React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'profile', label: 'Details', icon: User, group: 'content', render: () => <ProfileForm /> },
  {
    id: 'experience',
    label: 'Experience',
    icon: Briefcase,
    group: 'content',
    render: () => <ExperienceForm />,
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    group: 'content',
    render: () => <EducationForm />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderGit2,
    group: 'content',
    render: () => <ProjectsForm />,
  },
  { id: 'skills', label: 'Skills', icon: Wrench, group: 'content', render: () => <SkillsForm /> },
  {
    id: 'certifications',
    label: 'Certificates',
    icon: ScrollText,
    group: 'content',
    render: () => <CertificationsForm />,
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: Languages,
    group: 'content',
    render: () => <LanguagesForm />,
  },
  { id: 'awards', label: 'Awards', icon: Award, group: 'content', render: () => <AwardsForm /> },
  {
    id: 'custom',
    label: 'Custom',
    icon: Plus,
    group: 'content',
    render: () => <CustomSectionsForm />,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: LayoutTemplate,
    group: 'layout',
    render: () => <TemplatePanel />,
  },
  { id: 'design', label: 'Design', icon: Palette, group: 'layout', render: () => <DesignPanel /> },
  {
    id: 'arrange',
    label: 'Arrange',
    icon: ListOrdered,
    group: 'layout',
    render: () => <ArrangePanel />,
  },
];

const ZOOM_STEPS = [0.8, 1, 1.25] as const;

export function EditorShell() {
  const resume = useResume();
  const hydrated = useResumeStore((state) => state.hydrated);
  const undo = useResumeStore((state) => state.undo);
  const redo = useResumeStore((state) => state.redo);

  const [activeTab, setActiveTab] = useState('profile');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [zoom, setZoom] = useState(1);

  usePrintPageSize(resume.theme.pageFormat);
  const print = usePrint(toFileStem(resume.title || resume.profile.fullName));

  // Editor-wide shortcuts. Print is intercepted so the filename is set first.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === 'p') {
        event.preventDefault();
        print();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo, print]);

  const current = useMemo(() => TABS.find((tab) => tab.id === activeTab) ?? TABS[0]!, [activeTab]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="flex items-center gap-2 text-sm text-ink-faint">
          <Sparkles size={16} aria-hidden className="animate-pulse" />
          Loading your resume…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Toolbar onPrint={print} />

      {/* Mobile view switch */}
      <div
        data-print="hide"
        className="flex gap-1 border-b border-rule bg-paper px-4 py-2 lg:hidden"
      >
        {(['edit', 'preview'] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setMobileView(view)}
            aria-pressed={mobileView === view}
            className={cn(
              'flex-1 rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition-colors',
              mobileView === view ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-clay-soft/50',
            )}
          >
            {view}
          </button>
        ))}
      </div>

      {mobileView === 'edit' ? (
        <nav
          data-print="hide"
          aria-label="Resume sections"
          className="scroll-slim flex gap-1.5 overflow-x-auto border-b border-rule bg-paper-raised/60 px-4 py-2 lg:hidden"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors',
                  active
                    ? 'border-clay bg-clay-soft text-clay-deep'
                    : 'border-rule bg-paper-raised text-ink-muted hover:text-ink',
                )}
              >
                <Icon size={14} aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </nav>
      ) : null}

      <div data-print="surface" className="flex flex-1 overflow-hidden">
        {/*
          Section navigation. A vertical rail where there is room — icon-only at
          `lg`, labelled at `xl` — and a horizontal scroller on phones, where a
          fixed rail would either truncate its labels or eat the screen.
        */}
        <nav
          data-print="hide"
          aria-label="Resume sections"
          className={cn(
            'scroll-slim hidden shrink-0 overflow-y-auto border-r border-rule bg-paper-raised/60 py-3 lg:block lg:w-[68px] xl:w-[158px]',
          )}
        >
          {(['content', 'layout'] as const).map((group) => (
            <div key={group} className="mb-3 px-2">
              <p className="mb-1.5 hidden px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint xl:block">
                {group}
              </p>
              <ul className="flex flex-col gap-0.5">
                {TABS.filter((tab) => tab.group === group).map((tab) => {
                  const Icon = tab.icon;
                  const active = tab.id === activeTab;
                  return (
                    <li key={tab.id}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        aria-current={active ? 'page' : undefined}
                        title={tab.label}
                        className={cn(
                          'flex w-full items-center justify-center gap-2.5 rounded-lg px-2 py-2.5 text-[13px] font-medium transition-colors xl:justify-start',
                          active
                            ? 'bg-clay-soft text-clay-deep'
                            : 'text-ink-muted hover:bg-clay-soft/50 hover:text-ink',
                        )}
                      >
                        <Icon size={17} aria-hidden className="shrink-0" />
                        <span className="hidden truncate xl:inline">{tab.label}</span>
                        <span className="sr-only xl:hidden">{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Form pane — editor chrome, never part of the printed document. */}
        <div
          data-print="hide"
          className={cn(
            'scroll-slim flex-1 overflow-y-auto px-4 py-6 sm:px-7 lg:max-w-[560px] xl:max-w-[620px]',
            mobileView === 'preview' && 'hidden lg:block',
          )}
        >
          <div key={current.id}>{current.render()}</div>
        </div>

        {/* Preview pane — the only branch of the tree that reaches the printer. */}
        <div
          data-print="pane"
          className={cn(
            'scroll-slim paper-grain flex-1 overflow-y-auto border-l border-rule bg-paper px-4 py-6 sm:px-8',
            mobileView === 'edit' && 'hidden lg:block',
          )}
        >
          <div
            data-print="hide"
            className="mx-auto mb-4 flex max-w-[800px] items-center justify-between gap-3"
          >
            <p className="text-[12px] text-ink-faint">{resume.theme.pageFormat} · live preview</p>
            <div className="flex items-center gap-1 rounded-lg border border-rule bg-paper-raised p-0.5">
              {ZOOM_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setZoom(step)}
                  aria-pressed={zoom === step}
                  className={cn(
                    'rounded-[6px] px-2 py-1 text-[11px] font-medium tabular-nums transition-colors',
                    zoom === step ? 'bg-ink text-paper' : 'text-ink-faint hover:text-ink-muted',
                  )}
                >
                  {Math.round(step * 100)}%
                </button>
              ))}
            </div>
          </div>

          <div data-print="passthrough" className="mx-auto max-w-[800px]">
            <ResumePreview resume={resume} zoom={zoom} />
          </div>

          <div data-print="hide" className="mx-auto mt-5 max-w-[800px] text-center">
            <Button variant="primary" size="lg" onClick={print} className="w-full sm:w-auto">
              Download PDF
            </Button>
            <p className="mt-2 text-[11px] text-ink-faint">
              Choose “Save as PDF” in the print dialog. Margins are already set — leave them at
              default.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
