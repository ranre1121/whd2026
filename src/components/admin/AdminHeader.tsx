import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { ConfirmButton } from '@/components/ui/confirm-button';
import type { AdminHeaderControls } from '@/lib/admin-header-context';

const navLinkClass =
  'rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white';

/** Header shared by /admin and /checkin: navigation, refresh, sign out. */
export function AdminHeader({
  onSignOut,
  onRefresh,
  isRefreshing,
  refreshCooldownSeconds = 0,
}: AdminHeaderControls & { onSignOut: () => void }) {
  const { t } = useTranslation();

  return (
    <header className="bg-whd-pink/95 sticky top-0 z-50 w-full shadow-lg backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-3 px-6 sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Women’s Hack Day">
            <img src="/WHDlogo.svg" alt="" aria-hidden="true" className="h-10 w-10" />
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            <Link to="/dashboard" className={navLinkClass}>
              {t('navbar.dashboard')}
            </Link>
            <Link
              to="/admin"
              className={navLinkClass}
              activeProps={{ className: 'bg-white/15 text-white' }}
            >
              {t('admin.navReport')}
            </Link>
            <Link
              to="/checkin"
              className={navLinkClass}
              activeProps={{ className: 'bg-white/15 text-white' }}
            >
              {t('admin.checkin')}
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing || refreshCooldownSeconds > 0}
            >
              {isRefreshing
                ? t('admin.refreshing')
                : refreshCooldownSeconds > 0
                  ? t('admin.refreshIn', { seconds: refreshCooldownSeconds })
                  : t('admin.refresh')}
            </Button>
          )}
          <LanguageSwitcher />
          <ConfirmButton
            variant="ghost"
            label={t('common.signOut')}
            confirmLabel={t('common.confirm')}
            onConfirm={onSignOut}
            armedClassName="bg-white text-whd-pink hover:bg-white/90 hover:text-whd-pink"
          />
        </div>
      </div>
    </header>
  );
}
