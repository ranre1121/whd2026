import { useId } from 'react';
import { cn } from '@/lib/utils';

type FieldProps = {
  label: string;
  hint?: string;
  /** Already translated; rendered below the control and wired up via aria. */
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  }) => React.ReactNode;
};

/** Label + control + hint/error, with the aria wiring done once. */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
        {required && <span className="text-whd-pink-bright ml-1">*</span>}
      </label>

      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-whd-text-dim text-sm">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
