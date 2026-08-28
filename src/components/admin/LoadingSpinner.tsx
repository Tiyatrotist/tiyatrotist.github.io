/**
 * TIYATROTIST — Admin Loading Spinner
 *
 * Minimal loading indicator for async operations.
 */

'use client';

interface LoadingSpinnerProps {
  /** Optional text to display next to the spinner */
  text?: string;
  /** Use larger variant */
  large?: boolean;
  /** Center in container */
  center?: boolean;
}

export default function LoadingSpinner({ text, large = false, center = true }: LoadingSpinnerProps) {
  if (center) {
    return (
      <div className="admin-loading-center" role="status" aria-live="polite">
        <div className={`admin-spinner ${large ? 'admin-spinner-lg' : ''}`} />
        {text && <span>{text}</span>}
      </div>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} role="status" aria-live="polite">
      <span className={`admin-spinner ${large ? 'admin-spinner-lg' : ''}`} />
      {text && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{text}</span>}
    </span>
  );
}
