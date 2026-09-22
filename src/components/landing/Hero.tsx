import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { LinkButton } from '@/components/ui/button';
import { HexagonBackground } from '@/components/landing/HexagonBackground';
import Countdown from '@/components/landing/Countdown';
import { REGISTRATION_URL } from '@/lib/event';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20"
    >
      <HexagonBackground className="absolute inset-0" />

      {/* Vignette — keeps the hexagon field from competing with the headline */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.35) 75%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[100rem] flex-col items-center justify-center gap-4 px-6 sm:px-8 md:flex-row md:gap-0 lg:px-12">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative order-1 flex w-full justify-center md:order-none md:w-2/5"
        >
          <img
            src="/images/hero.svg"
            alt={t('hero.imageAlt')}
            width={400}
            height={400}
            className="z-10 w-1/2 max-w-[220px] md:w-full md:max-w-md"
          />
          <div className="bg-whd-pink/50 absolute top-[40%] left-1/2 z-0 h-[80%] w-full -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl" />
        </motion.div>

        {/* Headline, countdown, CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-2 flex w-full flex-col items-center gap-5 text-center md:order-none md:w-3/5 md:gap-8"
        >
          <h1
            className="text-5xl leading-tight font-bold text-white sm:text-6xl md:text-7xl"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.9)' }}
          >
            {t('hero.title')}
          </h1>

          <p
            className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}
          >
            {t('hero.tagline')}
          </p>

          <Countdown />

          <LinkButton
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="mt-2"
          >
            {t('hero.register')}
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
