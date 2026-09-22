import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MAX_TEAM_SIZE, MIN_TEAM_SIZE } from '@/db/schema';
import type { TeamData } from '@/lib/team.server';

export function TeamCard({
  team,
  currentUserId,
  onKick,
  onLeave,
  onDissolve,
}: {
  team: TeamData;
  currentUserId: string;
  onKick: (userId: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onDissolve: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);

  const isCaptain = team.captainId === currentUserId;
  const isComplete = team.members.length >= MIN_TEAM_SIZE;
  const inviteUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/invite/${team.inviteSlug}` : '';

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the input is selectable as a fallback.
    }
  };

  const run = async (action: () => Promise<void>, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    setPending(true);
    try {
      await action();
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{team.name}</h2>
          <span className="text-whd-text-muted text-sm">
            {t('dashboard.membersCount', { count: team.members.length, max: MAX_TEAM_SIZE })}
          </span>
        </div>

        <p className={isComplete ? 'text-whd-pink-soft text-sm' : 'text-whd-text-muted text-sm'}>
          {isComplete
            ? t('dashboard.teamReady')
            : t('dashboard.teamIncomplete', { min: MIN_TEAM_SIZE })}
        </p>

        {/* Members */}
        <ul className="flex flex-col gap-2">
          {team.members.map((member) => (
            <li
              key={member.id}
              className="border-whd-border bg-whd-dark/50 flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
            >
              <span className="min-w-0 flex-1 truncate text-white">
                {member.fullName}
                <span className="text-whd-pink-soft ml-2 text-xs">
                  {member.isCaptain ? t('dashboard.captain') : t('dashboard.member')}
                </span>
              </span>
              {isCaptain && !member.isCaptain && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    run(
                      () => onKick(member.id),
                      t('dashboard.confirmKick', { name: member.fullName }),
                    )
                  }
                >
                  {t('dashboard.kick')}
                </Button>
              )}
            </li>
          ))}
        </ul>

        {/* Invite link */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">{t('dashboard.inviteLink')}</span>
          <div className="flex gap-2">
            <Input readOnly value={inviteUrl} onFocus={(e) => e.currentTarget.select()} />
            <Button variant="outline" onClick={copyInvite} className="shrink-0">
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
          <p className="text-whd-text-dim text-sm">{t('dashboard.inviteHint')}</p>
        </div>

        <div>
          {isCaptain ? (
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => run(onDissolve, t('dashboard.confirmDissolve'))}
            >
              {t('dashboard.dissolve')}
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => run(onLeave, t('dashboard.confirmLeave'))}
            >
              {t('dashboard.leave')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
