import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import type { Session } from '@/lib/types';

const NAV_LINKS = [
  { href: '#about', labelKey: 'navbar.about' },
  { href: '#schedule', labelKey: 'navbar.schedule' },
  { href: '#partners', labelKey: 'navbar.partners' },
  { href: '#faq', labelKey: 'navbar.faq' },
] as const;

export default function Navbar({ session }: { session: Session }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!session?.user;
  const ctaTo = isLoggedIn ? '/dashboard' : '/login';
  const ctaLabel = isLoggedIn ? t('navbar.dashboard') : t('navbar.register');

  return (
    <header className="bg-whd-pink/95 fixed inset-x-0 top-0 z-50 w-full shadow-lg backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[95rem] items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <a href="#top" className="flex items-center" aria-label="Women’s Hack Day">
          <img src="/WHDlogo.svg" alt="" aria-hidden="true" className="h-10 w-10" />
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-x-6 text-base text-white uppercase md:flex lg:gap-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="no-underline transition-all duration-200 hover:underline hover:decoration-1 hover:underline-offset-4"
            >
              {t(link.labelKey)}
            </a>
          ))}

          <Link to={ctaTo} className={cn(buttonVariants({ variant: 'solid', size: 'sm' }))}>
            {ctaLabel}
          </Link>

          <LanguageSwitcher />
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={t('navbar.toggleMenu')}
          className="hover:bg-whd-pink-deep flex flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </Button>
      </div>

      {/* Mobile dropdown */}
      <div className="absolute inset-x-0 top-full md:hidden">
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-whd-pink-deep bg-whd-pink space-y-1 border-t px-4 py-3 shadow-lg">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-whd-pink-deep block rounded-lg px-3 py-2 text-base font-medium text-white no-underline transition-all duration-200 hover:translate-x-1"
                >
                  {t(link.labelKey)}
                </a>
              ))}

              <div className="px-3 py-2">
                <LanguageSwitcher size="md" onLanguageChange={() => setIsOpen(false)} />
              </div>

              <Link
                to={ctaTo}
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: 'solid' }), 'w-full')}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
