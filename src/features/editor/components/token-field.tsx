'use client';

import { useEffect, useState } from 'react';
import { TextInput } from '@/shared/ui/field';
import { arrayToTokens, tokensToArray } from '../hooks';

export interface TokenFieldProps {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

/**
 * Comma-separated list input.
 *
 * The raw text is held locally so partially-typed entries ("React, Nex") and
 * trailing separators survive, while the store only ever receives clean tokens.
 */
export function TokenField({ label, hint, value, onChange, placeholder }: TokenFieldProps) {
  const [text, setText] = useState(() => arrayToTokens(value));

  // Re-sync when the document changes underneath us (undo, import, template swap).
  useEffect(() => {
    const canonical = arrayToTokens(value);
    setText((current) =>
      arrayToTokens(tokensToArray(current)) === canonical ? current : canonical,
    );
  }, [value]);

  return (
    <TextInput
      label={label}
      hint={hint}
      placeholder={placeholder}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        onChange(tokensToArray(event.target.value));
      }}
    />
  );
}
