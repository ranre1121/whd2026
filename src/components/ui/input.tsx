import { cn } from '@/lib/utils';

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'border-whd-border bg-whd-surface placeholder:text-whd-text-dim w-full rounded-lg border px-4 py-2.5 text-base text-white',
        'transition-colors duration-200 outline-none',
        'focus:border-whd-pink focus:ring-whd-pink/30 focus:ring-2',
        'aria-[invalid=true]:border-red-500/70 aria-[invalid=true]:focus:ring-red-500/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'border-whd-border bg-whd-surface w-full cursor-pointer rounded-lg border px-4 py-2.5 text-base text-white',
        'transition-colors duration-200 outline-none',
        'focus:border-whd-pink focus:ring-whd-pink/30 focus:ring-2',
        'aria-[invalid=true]:border-red-500/70',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
