import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { emailSchema } from '@/lib/validation';

export function EmailForm({ onSent }: { onSent: (email: string) => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      // Zod messages are i18n keys, resolved here.
      setError(t(parsed.error.issues[0].message));
      return;
    }

    setPending(true);
    try {
      const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
        email: parsed.data.email,
        type: 'sign-in',
      });
      if (sendError) {
        setError(t('login.sendFailed'));
        return;
      }
      onSent(parsed.data.email);
    } catch {
      setError(t('login.sendFailed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label={t('login.emailLabel')} error={error ?? undefined} required>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            autoFocus
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
          />
        )}
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t('common.loading') : t('login.sendCode')}
      </Button>
    </form>
  );
}
