import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { languageNames, supportedLngs } from '@/i18n';

type LanguageSwitcherProps = {
  /** Called after the language changes (e.g. to close the mobile menu). */
  onLanguageChange?: () => void;
  size?: 'sm' | 'md';
  className?: string;
};

export function LanguageSwitcher({
  onLanguageChange,
  size = 'sm',
  className,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onLanguageChange?.();
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="group"
      aria-label={t('common.switchLanguage')}
    >
      {supportedLngs.map((lng) => {
        const isActive = current === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => changeLanguage(lng)}
            aria-pressed={isActive}
            aria-label={`${t('common.switchLanguage')} — ${languageNames[lng]}`}
            className={cn(
              'cursor-pointer rounded-lg font-medium transition-all duration-200',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'flex-1 px-3 py-1.5 text-sm',
              isActive ? 'text-whd-pink bg-white' : 'bg-white/10 text-white hover:bg-white/25',
            )}
          >
            {languageNames[lng]}
          </button>
        );
      })}
    </div>
  );
}
