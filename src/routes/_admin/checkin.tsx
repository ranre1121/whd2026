import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';

import { AuthHeader } from '@/components/AuthHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getSession } from '@/lib/auth.server';
import { sessionIsAdmin } from '@/lib/admin.server';
import { getReportData, setAttendance } from '@/lib/report.server';

async function assertAdmin() {
  const session = await getSession(getRequest());
  if (!sessionIsAdmin(session)) throw new Error('Forbidden');
}

const loadCheckin = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin();
  const { participants, stats } = await getReportData();
  return { participants, stats };
});

const setAttendanceFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string().min(1), attended: z.boolean() }))
  .handler(async ({ data }) => {
    await assertAdmin();
    await setAttendance(data.userId, data.attended);
  });

export const Route = createFileRoute('/_admin/checkin')({
  loader: () => loadCheckin(),
  component: CheckinPage,
});

function CheckinPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { participants, stats } = Route.useLoaderData();
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const needle = query.trim().toLowerCase();
  const rows = useMemo(
    () =>
      !needle
        ? participants
        : participants.filter((p) =>
            [p.fullName, p.iin, p.phone, p.teamName ?? ''].join(' ').toLowerCase().includes(needle),
          ),
    [participants, needle],
  );

  const toggle = async (userId: string, attended: boolean) => {
    setBusyId(userId);
    try {
      await setAttendanceFn({ data: { userId, attended } });
      await router.invalidate();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-whd-dark flex min-h-screen flex-col">
      <AuthHeader showSignOut />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{t('admin.checkinTitle')}</h1>
          <Link
            to="/admin"
            className="text-whd-pink-soft hover:text-whd-pink-bright text-sm transition-colors"
          >
            {t('admin.title')}
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="flex items-baseline gap-3 p-5">
            <span className="text-whd-pink-bright text-4xl font-black">{stats.attended}</span>
            <span className="text-whd-text-muted">
              {t('admin.attendedOf', { total: stats.participants })}
            </span>
          </CardContent>
        </Card>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.checkinSearchPlaceholder')}
          className="mb-4"
          autoFocus
        />

        <ul className="flex flex-col gap-2">
          {rows.map((p) => (
            <li
              key={p.id}
              className="border-whd-border bg-whd-surface/60 flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-white">{p.fullName}</p>
                <p className="text-whd-text-muted truncate text-sm">
                  {p.teamName ?? t('admin.noTeam')} · {p.phone}
                </p>
              </div>
              <Button
                size="sm"
                variant={p.attended ? 'primary' : 'outline'}
                disabled={busyId === p.id}
                onClick={() => toggle(p.id, !p.attended)}
                className="shrink-0"
              >
                {p.attended ? t('admin.present') : t('admin.markPresent')}
              </Button>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <p className="text-whd-text-muted py-10 text-center">{t('admin.empty')}</p>
        )}
      </main>
    </div>
  );
}
