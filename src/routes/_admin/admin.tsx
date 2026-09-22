import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

import { AuthHeader } from '@/components/AuthHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getSession } from '@/lib/auth.server';
import { sessionIsAdmin } from '@/lib/admin.server';
import { getReportData, participantsToCsv } from '@/lib/report.server';

const loadReport = createServerFn({ method: 'GET' }).handler(async () => {
  // Re-checked here as well: the layout guard protects navigation, this
  // protects the data itself.
  const session = await getSession(getRequest());
  if (!sessionIsAdmin(session)) throw new Error('Forbidden');
  return getReportData();
});

const downloadCsv = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession(getRequest());
  if (!sessionIsAdmin(session)) throw new Error('Forbidden');
  const { participants } = await getReportData();
  return participantsToCsv(participants);
});

export const Route = createFileRoute('/_admin/admin')({
  loader: () => loadReport(),
  component: AdminPage,
});

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-whd-pink-bright text-3xl font-black md:text-4xl">{value}</div>
        <div className="text-whd-text-muted mt-1 text-sm">{label}</div>
      </CardContent>
    </Card>
  );
}

function AdminPage() {
  const { t } = useTranslation();
  const { participants, teams, stats } = Route.useLoaderData();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'participants' | 'teams'>('participants');

  const needle = query.trim().toLowerCase();
  const filteredParticipants = useMemo(
    () =>
      !needle
        ? participants
        : participants.filter((p) =>
            [p.fullName, p.email, p.phone, p.city, p.placeOfStudy, p.teamName ?? '']
              .join(' ')
              .toLowerCase()
              .includes(needle),
          ),
    [participants, needle],
  );
  const filteredTeams = useMemo(
    () =>
      !needle
        ? teams
        : teams.filter((t) =>
            [t.name, t.captainName, ...t.members].join(' ').toLowerCase().includes(needle),
          ),
    [teams, needle],
  );

  const exportCsv = async () => {
    const csv = await downloadCsv();
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `whd-participants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-whd-dark flex min-h-screen flex-col">
      <AuthHeader showSignOut />

      <main className="mx-auto w-full max-w-[100rem] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{t('admin.title')}</h1>
          <div className="flex gap-3">
            <Link
              to="/checkin"
              className="text-whd-pink-soft hover:text-whd-pink-bright text-sm transition-colors"
            >
              {t('admin.checkin')}
            </Link>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              {t('admin.exportCsv')}
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label={t('admin.statParticipants')} value={stats.participants} />
          <StatCard label={t('admin.statTeams')} value={stats.teams} />
          <StatCard label={t('admin.statEligibleTeams')} value={stats.eligibleTeams} />
          <StatCard label={t('admin.statTeamless')} value={stats.teamless} />
          <StatCard label={t('admin.statAttended')} value={stats.attended} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {(['participants', 'teams'] as const).map((key) => (
              <Button
                key={key}
                size="sm"
                variant={tab === key ? 'primary' : 'ghost'}
                onClick={() => setTab(key)}
              >
                {t(`admin.tab_${key}`)}
              </Button>
            ))}
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('admin.searchPlaceholder')}
            className="max-w-xs"
          />
        </div>

        <div className="border-whd-border overflow-x-auto rounded-2xl border">
          {tab === 'participants' ? (
            <table className="w-full min-w-[60rem] text-left text-sm">
              <thead className="bg-whd-surface text-whd-text-muted">
                <tr>
                  {[
                    'name',
                    'email',
                    'phone',
                    'education',
                    'placeOfStudy',
                    'city',
                    'team',
                    'attended',
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                      {t(`admin.col_${h}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="border-whd-border border-t text-white/90">
                    <td className="px-4 py-3 whitespace-nowrap">{p.fullName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{p.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{p.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {t(`education.${p.educationLevel}`)}
                    </td>
                    <td className="px-4 py-3">{p.placeOfStudy}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{p.city}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.teamName ?? <span className="text-whd-text-dim">—</span>}
                    </td>
                    <td className="px-4 py-3">{p.attended ? '✓' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[50rem] text-left text-sm">
              <thead className="bg-whd-surface text-whd-text-muted">
                <tr>
                  {['team', 'captain', 'size', 'eligible', 'members'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                      {t(`admin.col_${h}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.inviteSlug} className="border-whd-border border-t text-white/90">
                    <td className="px-4 py-3 whitespace-nowrap">{team.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{team.captainName}</td>
                    <td className="px-4 py-3">{team.memberCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={team.eligible ? 'text-whd-pink-bright' : 'text-whd-text-dim'}
                      >
                        {team.eligible ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{team.members.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {(tab === 'participants' ? filteredParticipants : filteredTeams).length === 0 && (
          <p className="text-whd-text-muted py-10 text-center">{t('admin.empty')}</p>
        )}
      </main>
    </div>
  );
}
