import { cn } from '@/lib/utils';

/** Centred card used by the login and onboarding screens. */
export function AuthCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
      {/* Soft pink halo, echoing the landing page */}
      <div className="bg-whd-pink/15 pointer-events-none absolute top-1/2 left-1/2 h-96 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl" />

      <div className={cn('relative w-full max-w-md', className)}>
        <div className="border-whd-border bg-whd-surface/80 rounded-2xl border p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="text-whd-text-muted mt-2 text-sm leading-relaxed">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
