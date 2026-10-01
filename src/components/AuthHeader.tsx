import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ConfirmButton } from '@/components/ui/confirm-button';
import { authClient } from '@/lib/auth-client';

/** Slim header for the signed-in pages: logo, language, who is signed in, sign out. */
export function AuthHeader({
  showSignOut = false,
  email,
}: {
  showSignOut?: boolean;
  email?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: '/', reloadDocument: true });
  };

  return (
    <header className="bg-whd-pink/95 sticky top-0 z-50 w-full shadow-lg backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[95rem] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center" aria-label="Women’s Hack Day">
          <img src="/WHDlogo.svg" alt="" aria-hidden="true" className="h-10 w-10" />
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {email && <span className="hidden text-sm text-white/80 sm:inline">{email}</span>}
          {showSignOut && (
            <ConfirmButton
              variant="ghost"
              label={t('common.signOut')}
              confirmLabel={t('common.confirm')}
              onConfirm={handleSignOut}
              armedClassName="bg-white text-whd-pink hover:bg-white/90 hover:text-whd-pink"
            />
          )}
        </div>
      </div>
    </header>
  );
}
