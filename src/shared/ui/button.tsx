import * as React from 'react';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-lg transition-[background-color,color,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px';

const variants: Record<Variant, string> = {
  primary: 'bg-clay text-white shadow-raised hover:bg-clay-deep',
  secondary:
    'bg-paper-raised text-ink border border-rule-strong hover:border-ink-faint hover:bg-white',
  ghost: 'text-ink-muted hover:bg-clay-soft/60 hover:text-clay-deep',
  danger: 'text-clay-deep border border-transparent hover:border-clay/40 hover:bg-clay-soft/70',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'secondary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

export interface IconButtonProps extends ButtonProps {
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, label, variant = 'ghost', ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      title={label}
      variant={variant}
      className={cn('h-8 w-8 shrink-0 p-0', className)}
      {...props}
    />
  );
});
