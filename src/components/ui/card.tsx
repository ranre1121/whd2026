import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'group/card border-whd-border bg-whd-surface/60 hover:border-whd-pink/50 hover:bg-whd-surface rounded-2xl border transition-all duration-500',
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('p-6 md:p-8', className)} {...props} />;
}
