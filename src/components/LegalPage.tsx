import { Link } from '@tanstack/react-router';
import { AuthHeader } from '@/components/AuthHeader';

/** Shared layout for /terms and /privacy. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-whd-dark flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:px-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        <p className="text-whd-text-muted mt-2 mb-10 text-sm">Last updated: {updated}</p>
        <div className="text-whd-text-muted space-y-8 text-base leading-relaxed">{children}</div>
        <Link
          to="/"
          className="text-whd-pink-soft hover:text-whd-pink-bright mt-12 inline-block text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

export function ContactLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="text-whd-pink-soft hover:text-whd-pink-bright underline">
      {email}
    </a>
  );
}
