'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/cn';

const controlStyles =
  'w-full rounded-lg border border-rule bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint/70 transition-colors duration-150 hover:border-rule-strong focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20';

export interface FieldProps {
  label: string;
  hint?: string;
  /** Hides the label visually while keeping it for assistive technology. */
  srOnlyLabel?: boolean;
  className?: string;
  children: (props: { id: string; describedBy: string | undefined }) => React.ReactNode;
}

export function Field({ label, hint, srOnlyLabel, className, children }: FieldProps) {
  const id = React.useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint',
          srOnlyLabel && 'sr-only',
        )}
      >
        {label}
      </label>
      {children({ id, describedBy: hintId })}
      {hint ? (
        <p id={hintId} className="text-[11px] leading-relaxed text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  srOnlyLabel?: boolean;
  wrapperClassName?: string;
}

export function TextInput({
  label,
  hint,
  srOnlyLabel,
  wrapperClassName,
  className,
  ...props
}: TextInputProps) {
  return (
    <Field label={label} hint={hint} srOnlyLabel={srOnlyLabel} className={wrapperClassName}>
      {({ id, describedBy }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          className={cn(controlStyles, className)}
          {...props}
        />
      )}
    </Field>
  );
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextArea({
  label,
  hint,
  wrapperClassName,
  className,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <Field label={label} hint={hint} className={wrapperClassName}>
      {({ id, describedBy }) => (
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          className={cn(controlStyles, 'resize-y leading-relaxed', className)}
          {...props}
        />
      )}
    </Field>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  wrapperClassName?: string;
}

export function Select({
  label,
  hint,
  wrapperClassName,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <Field label={label} hint={hint} className={wrapperClassName}>
      {({ id, describedBy }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          className={cn(controlStyles, 'pr-8', className)}
          {...props}
        >
          {children}
        </select>
      )}
    </Field>
  );
}

export interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ label, description, checked, onCheckedChange }: SwitchProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-rule-strong transition-colors peer-checked:bg-clay peer-focus-visible:ring-2 peer-focus-visible:ring-clay/30 peer-focus-visible:ring-offset-2" />
        <span className="pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-ink">{label}</span>
        {description ? <span className="text-[11px] text-ink-faint">{description}</span> : null}
      </span>
    </label>
  );
}
