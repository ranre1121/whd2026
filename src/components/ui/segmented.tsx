import { cn } from '@/lib/utils';

type SegmentedProps<T extends string> = {
  /** Accessible name for the group, e.g. "Filter by eligibility". */
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** A row of mutually exclusive toggle buttons — used for table filters. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('border-whd-border inline-flex shrink-0 rounded-lg border p-0.5', className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1 text-sm whitespace-nowrap transition-colors',
            value === option.value
              ? 'bg-whd-pink/20 text-whd-pink-bright'
              : 'text-whd-text-muted hover:text-white',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
