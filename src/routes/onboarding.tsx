import { useTranslation } from 'react-i18next';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

import { AuthHeader } from '@/components/AuthHeader';
import { AuthCard } from '@/components/ui/auth-card';
import { OnboardingForm, type OnboardingDefaults } from '@/components/onboarding/OnboardingForm';
import { ensureSession, getSession } from '@/lib/auth.server';
import { getParticipant, upsertParticipant } from '@/lib/onboarding.server';
import { isRegistrationOpen, REGISTRATION_CLOSED_I18N_KEY } from '@/lib/registration.server';
import { onboardingSchema } from '@/lib/validation';

/** Existing profile values, so onboarding doubles as "edit my details". */
const loadProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession(getRequest());
  if (!session?.user) return { authed: false as const };

  const p = await getParticipant(session.user.id);
  if (!p) return { authed: true as const, defaults: undefined };

  return {
    authed: true as const,
    defaults: {
      fullName: p.fullName,
      iin: p.iin,
      phone: p.phone,
      city: p.city,
      placeOfStudy: p.placeOfStudy,
      parentPhone: p.parentPhone ?? '',
      educationLevel: p.educationLevel,
      cvUrl: p.cvUrl ?? '',
    } satisfies OnboardingDefaults,
  };
});

const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator(onboardingSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession(getRequest());

    // Re-checked on the server: the client cannot bypass the deadline.
    if (!isRegistrationOpen()) throw new Error(REGISTRATION_CLOSED_I18N_KEY);

    await upsertParticipant({ userId: session.user.id, ...data });
    return { ok: true };
  });

export const Route = createFileRoute('/onboarding')({
  loader: async () => {
    const result = await loadProfile();
    if (!result.authed) throw redirect({ to: '/login' });
    return result;
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { defaults } = Route.useLoaderData();

  return (
    <div className="bg-whd-dark flex min-h-screen flex-col">
      <AuthHeader showSignOut />
      <AuthCard
        title={t('onboarding.title')}
        subtitle={t('onboarding.subtitle')}
        className="max-w-lg"
      >
        <OnboardingForm
          defaults={defaults}
          onSubmit={async (values) => {
            await saveProfile({ data: values });
            navigate({ to: '/dashboard' });
          }}
        />
      </AuthCard>
    </div>
  );
}
