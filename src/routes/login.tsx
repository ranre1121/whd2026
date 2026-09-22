import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

import { AuthHeader } from '@/components/AuthHeader';
import { AuthCard } from '@/components/ui/auth-card';
import { EmailForm } from '@/components/login/EmailForm';
import { OtpForm } from '@/components/login/OtpForm';
import { getSession } from '@/lib/auth.server';
import { getParticipant } from '@/lib/onboarding.server';

/**
 * Where a signed-in visitor belongs: onboarding until they have a profile,
 * the dashboard afterwards. Used both to bounce people away from /login and
 * to route them after a successful verification.
 */
const getPostLoginDestination = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession(getRequest());
  if (!session?.user) return null;
  const profile = await getParticipant(session.user.id);
  return profile ? '/dashboard' : '/onboarding';
});

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const destination = await getPostLoginDestination();
    if (destination) throw redirect({ to: destination });
  },
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  const handleVerified = async () => {
    const destination = await getPostLoginDestination();
    navigate({ to: destination ?? '/onboarding' });
  };

  return (
    <div className="bg-whd-dark flex min-h-screen flex-col">
      <AuthHeader />
      {email === null ? (
        <AuthCard title={t('login.title')} subtitle={t('login.subtitle')}>
          <EmailForm onSent={setEmail} />
        </AuthCard>
      ) : (
        <AuthCard title={t('login.otpTitle')} subtitle={t('login.otpSubtitle', { email })}>
          <OtpForm email={email} onVerified={handleVerified} onChangeEmail={() => setEmail(null)} />
        </AuthCard>
      )}
    </div>
  );
}
