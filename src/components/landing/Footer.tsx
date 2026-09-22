import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import type { Session } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import DecryptedText from '@/components/landing/DecryptedText';
import { SOCIAL_LINKS } from '@/lib/event';

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, labelKey: 'footer.instagram' },
  { href: SOCIAL_LINKS.telegram, labelKey: 'footer.telegram' },
  { href: SOCIAL_LINKS.tiktok, labelKey: 'footer.tiktok' },
  { href: SOCIAL_LINKS.email, labelKey: 'footer.email' },
] as const;

export default function Footer({ session }: { session: Session }) {
  const { t } = useTranslation();
  const isLoggedIn = !!session?.user;

  return (
    <footer id="registration" className="border-whd-border bg-whd-dark border-t">
      {/* Closing call to action */}
      <div className="relative mx-auto max-w-[100rem] overflow-hidden px-6 py-16 text-center sm:px-8 md:py-24 lg:px-12">
        <div className="bg-whd-pink/20 pointer-events-none absolute top-1/2 left-1/2 h-64 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl" />

        <div className="relative">
          <p className="mb-6 text-2xl font-bold text-white md:text-4xl">
            <DecryptedText
              text={t('footer.readyToJoin')}
              animateOn="view"
              sequential
              encryptedClassName="text-whd-pink/50"
            />
          </p>
          <Link
            to={isLoggedIn ? '/dashboard' : '/login'}
            className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}
          >
            {isLoggedIn ? t('footer.dashboard') : t('footer.register')}
          </Link>
        </div>
      </div>

      <Separator />

      {/* Social links */}
      <div className="mx-auto max-w-[100rem] px-6 py-10 text-center sm:px-8 lg:px-12">
        <div className="text-whd-pink-soft mb-8 flex flex-wrap justify-center gap-6 text-lg sm:gap-12 md:gap-20 lg:gap-32">
          {SOCIALS.map((social) => (
            <a
              key={social.labelKey}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-whd-pink-bright transition-colors duration-200 hover:underline"
            >
              {t(social.labelKey)}
            </a>
          ))}
        </div>

        <p className="text-whd-text-dim text-base italic sm:text-lg md:text-xl">
          {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
