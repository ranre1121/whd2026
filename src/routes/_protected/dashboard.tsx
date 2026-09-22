import { useTranslation } from 'react-i18next';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';

import { AuthHeader } from '@/components/AuthHeader';
import { Card, CardContent } from '@/components/ui/card';
import { TeamCard } from '@/components/dashboard/TeamCard';
import { NoTeamCard } from '@/components/dashboard/NoTeamCard';
import { ensureSession } from '@/lib/auth.server';
import { getParticipant } from '@/lib/onboarding.server';
import {
  createTeam,
  dissolveTeam,
  getTeamByParticipant,
  joinTeamBySlug,
  kickMember,
  leaveTeam,
} from '@/lib/team.server';
import { isRegistrationOpen, REGISTRATION_CLOSED_I18N_KEY } from '@/lib/registration.server';
import { createTeamSchema, inviteSlugSchema } from '@/lib/validation';

/** Every team mutation is blocked once the deadline passes. */
function assertRegistrationOpen() {
  if (!isRegistrationOpen()) throw new Error(REGISTRATION_CLOSED_I18N_KEY);
}

const loadDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await ensureSession(getRequest());
  const [profile, team] = await Promise.all([
    getParticipant(session.user.id),
    getTeamByParticipant(session.user.id),
  ]);
  return {
    userId: session.user.id,
    email: session.user.email,
    fullName: profile?.fullName ?? session.user.email,
    team,
    registrationOpen: isRegistrationOpen(),
  };
});

const createTeamFn = createServerFn({ method: 'POST' })
  .inputValidator(createTeamSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession(getRequest());
    assertRegistrationOpen();
    return createTeam(session.user.id, data.name);
  });

const joinTeamFn = createServerFn({ method: 'POST' })
  .inputValidator(inviteSlugSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession(getRequest());
    assertRegistrationOpen();
    return joinTeamBySlug(session.user.id, data.slug);
  });

const kickMemberFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const session = await ensureSession(getRequest());
    assertRegistrationOpen();
    await kickMember(session.user.id, data.userId);
  });

const leaveTeamFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await ensureSession(getRequest());
  assertRegistrationOpen();
  await leaveTeam(session.user.id);
});

const dissolveTeamFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await ensureSession(getRequest());
  assertRegistrationOpen();
  await dissolveTeam(session.user.id);
});

export const Route = createFileRoute('/_protected/dashboard')({
  loader: () => loadDashboard(),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userId, fullName, team, registrationOpen } = Route.useLoaderData();

  // Re-run the loader so the UI reflects the new server state.
  const refresh = () => router.invalidate();

  return (
    <div className="bg-whd-dark flex min-h-screen flex-col">
      <AuthHeader showSignOut />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-8 md:py-16">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {t('dashboard.greeting', { name: fullName })}
          </h1>
          <Link
            to="/onboarding"
            className="text-whd-pink-soft hover:text-whd-pink-bright text-sm transition-colors"
          >
            {t('dashboard.editProfile')}
          </Link>
        </div>

        {!registrationOpen && (
          <Card className="border-whd-pink/40 mb-6">
            <CardContent className="py-4">
              <p className="text-whd-pink-soft text-sm">
                {t('onboarding.registrationClosedError')}
              </p>
            </CardContent>
          </Card>
        )}

        {team ? (
          <TeamCard
            team={team}
            currentUserId={userId}
            onKick={async (id) => {
              await kickMemberFn({ data: { userId: id } });
              await refresh();
            }}
            onLeave={async () => {
              await leaveTeamFn();
              await refresh();
            }}
            onDissolve={async () => {
              await dissolveTeamFn();
              await refresh();
            }}
          />
        ) : (
          <NoTeamCard
            onCreate={async (name) => {
              await createTeamFn({ data: { name } });
              await refresh();
            }}
            onJoin={async (slug) => {
              await joinTeamFn({ data: { slug } });
              await refresh();
            }}
          />
        )}
      </main>
    </div>
  );
}
