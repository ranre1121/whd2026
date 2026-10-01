import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { MAX_TEAM_SIZE, MIN_TEAM_SIZE } from '@/db/schema';
import type { TeamData } from '@/lib/team.server';
import { cn } from '@/lib/utils';

function StatTile({
  label,
  value,
  detail,
  valueClassName,
}: {
  label: string;
  value: string;
  detail: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 md:p-6">
        <p className="text-whd-text-muted text-xs tracking-widest uppercase">{label}</p>
        <p className={cn('mt-2 truncate text-2xl font-bold text-white', valueClassName)}>{value}</p>
        <p className="text-whd-text-muted mt-1 text-sm">{detail}</p>
      </CardContent>
    </Card>
  );
}

/** At-a-glance status: is my registration complete, which team, when and where. */
export function DashboardStats({ team }: { team: TeamData | null }) {
  const { t } = useTranslation();
  const ready = !!team && team.members.length >= MIN_TEAM_SIZE;

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatTile
        label={t('dashboard.statusLabel')}
        value={ready ? t('dashboard.statusReady') : t('dashboard.statusWarning')}
        detail={
          !team
            ? t('dashboard.noTeam')
            : ready
              ? t('dashboard.teamReady')
              : t('dashboard.teamIncomplete', { min: MIN_TEAM_SIZE })
        }
        valueClassName={ready ? 'text-whd-pink-bright' : 'text-amber-300'}
      />
      <StatTile
        label={t('dashboard.teamLabel')}
        value={team?.name ?? '—'}
        detail={
          team
            ? t('dashboard.membersCount', { count: team.members.length, max: MAX_TEAM_SIZE })
            : t('dashboard.noTeamShort')
        }
      />
      <StatTile
        label={t('dashboard.eventLabel')}
        value={t('timeline.items.event')}
        detail={t('infoCards.whereAnswer')}
      />
    </div>
  );
}
