'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Download, FileJson, Redo2, RotateCcw, Undo2, Upload } from 'lucide-react';
import { Button, IconButton } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { downloadResumeJson, importResumeJson } from '@/features/export/json';
import { toFileStem } from '@/shared/lib/format';
import { useResumeStore } from '../store';
import { useResume } from '../hooks';

export interface ToolbarProps {
  onPrint: () => void;
}

export function Toolbar({ onPrint }: ToolbarProps) {
  const resume = useResume();
  const update = useResumeStore((state) => state.update);
  const replace = useResumeStore((state) => state.replace);
  const reset = useResumeStore((state) => state.reset);
  const undo = useResumeStore((state) => state.undo);
  const redo = useResumeStore((state) => state.redo);
  const canUndo = useResumeStore((state) => state.past.length > 0);
  const canRedo = useResumeStore((state) => state.future.length > 0);

  const fileInput = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const result = await importResumeJson(file);
    if (result.ok) {
      replace(result.resume);
      setNotice('Resume imported.');
    } else {
      setNotice(result.error);
    }
    window.setTimeout(() => setNotice(null), 4000);
  };

  return (
    <header
      data-print="hide"
      className="sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur-md"
    >
      {/*
        Below `sm` this wraps into two rows — identity and tools, then name and
        the primary action — so nothing truncates on a narrow phone.
      */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:flex-nowrap sm:px-6">
        <Link href="/" className="shrink-0 rounded-lg" aria-label="Inkwell home">
          <Logo wordmarkClassName="hidden sm:inline" />
        </Link>

        <input
          aria-label="Resume name"
          value={resume.title}
          onChange={(event) =>
            update((draft) => void (draft.title = event.target.value), {
              coalesceKey: 'document.title',
            })
          }
          className="order-3 min-w-0 flex-1 basis-[55%] rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-[15px] font-medium text-ink transition-colors hover:border-rule focus:border-clay focus:bg-paper-raised focus:outline-none sm:order-none sm:basis-auto"
          placeholder="Untitled resume"
        />

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <IconButton label="Undo" disabled={!canUndo} onClick={undo}>
            <Undo2 size={16} aria-hidden />
          </IconButton>
          <IconButton label="Redo" disabled={!canRedo} onClick={redo}>
            <Redo2 size={16} aria-hidden />
          </IconButton>

          <div className="mx-1 h-6 w-px bg-rule" />

          <IconButton label="Import JSON" onClick={() => fileInput.current?.click()}>
            <Upload size={16} aria-hidden />
          </IconButton>
          <IconButton label="Export JSON" onClick={() => downloadResumeJson(resume)}>
            <FileJson size={16} aria-hidden />
          </IconButton>
          <IconButton
            label="Clear this resume"
            onClick={() => {
              if (window.confirm('Clear every field and start over? This cannot be undone.'))
                reset();
            }}
          >
            <RotateCcw size={16} aria-hidden />
          </IconButton>
        </div>

        <Button variant="primary" onClick={onPrint} className="order-4 shrink-0 sm:order-none">
          <Download size={16} aria-hidden />
          Download PDF
        </Button>

        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(event) => {
            void handleImport(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>

      {notice ? (
        <p
          role="status"
          className="border-t border-rule bg-clay-soft/70 px-4 py-1.5 text-[13px] text-clay-deep sm:px-6"
        >
          {notice}
        </p>
      ) : null}

      <span className="sr-only">Saving as {toFileStem(resume.title)}.pdf</span>
    </header>
  );
}
