/**
 * TIYATROTIST — Admin FormField
 *
 * Reusable form field with label, input/textarea/select, and error message.
 */

'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  /** Field label */
  label: string;
  /** Input name / id */
  name: string;
  /** Input type: text, textarea, select, color, date, number */
  type?: 'text' | 'textarea' | 'select' | 'color' | 'date' | 'number' | 'url' | 'email' | 'password';
  /** Current value */
  value: string | number;
  /** Change handler */
  onChange: (value: string) => void;
  /** Error message */
  error?: string;
  /** Placeholder */
  placeholder?: string;
  /** Select options */
  options?: { value: string; label: string }[];
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Children for custom content */
  children?: ReactNode;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  options,
  required = false,
  disabled = false,
}: FormFieldProps) {
  const inputId = `admin-field-${name}`;

  return (
    <div className="admin-field">
      <label htmlFor={inputId}>
        {label}
        {required && <span style={{ color: '#e74c3c', marginLeft: '0.25rem' }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      )}

      {error && (
        <span id={`${inputId}-error`} className="admin-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
