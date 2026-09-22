import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { Card, CardContent } from '@/components/ui/card';
import { createTeamSchema, inviteSlugSchema } from '@/lib/validation';

/** Shown when a participant has no team: create one, or join with a code. */
export function NoTeamCard({
  onCreate,
  onJoin,
}: {
  onCreate: (name: string) => Promise<void>;
  onJoin: (slug: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    const parsed = createTeamSchema.safeParse({ name });
    if (!parsed.success) {
      setNameError(t(parsed.error.issues[0].message));
      return;
    }
    setPending(true);
    try {
      await onCreate(parsed.data.name);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : t('dashboard.actionFailed'));
    } finally {
      setPending(false);
    }
  };

  const submitJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlugError(null);
    // Accept a full invite URL as well as a bare code.
    const cleaned = slug.trim().replace(/^.*\/invite\//, '');
    const parsed = inviteSlugSchema.safeParse({ slug: cleaned });
    if (!parsed.success) {
      setSlugError(t(parsed.error.issues[0].message));
      return;
    }
    setPending(true);
    try {
      await onJoin(parsed.data.slug);
    } catch (err) {
      setSlugError(err instanceof Error ? err.message : t('dashboard.actionFailed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-bold text-white md:text-2xl">{t('dashboard.noTeam')}</h2>
          <p className="text-whd-text-muted mt-2 text-sm leading-relaxed">
            {t('dashboard.noTeamHint')}
          </p>
        </div>

        <form onSubmit={submitCreate} className="flex flex-col gap-3" noValidate>
          <Field label={t('dashboard.teamNameLabel')} error={nameError ?? undefined}>
            {(p) => (
              <Input
                {...p}
                value={name}
                placeholder={t('dashboard.teamNamePlaceholder')}
                onChange={(e) => setName(e.target.value)}
                disabled={pending}
              />
            )}
          </Field>
          <Button type="submit" disabled={pending}>
            {t('dashboard.createTeam')}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <span className="bg-whd-border h-px flex-1" />
          <span className="text-whd-text-dim text-xs tracking-widest uppercase">
            {t('login.or')}
          </span>
          <span className="bg-whd-border h-px flex-1" />
        </div>

        <form onSubmit={submitJoin} className="flex flex-col gap-3" noValidate>
          <Field label={t('dashboard.inviteCodeLabel')} error={slugError ?? undefined}>
            {(p) => (
              <Input
                {...p}
                value={slug}
                placeholder="binary-blossoms"
                onChange={(e) => setSlug(e.target.value)}
                disabled={pending}
              />
            )}
          </Field>
          <Button type="submit" variant="outline" disabled={pending}>
            {t('dashboard.joinTeam')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
