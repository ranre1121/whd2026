import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { LinkButton } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DecryptedText from '@/components/landing/DecryptedText';
import { VENUE_MAP_URL } from '@/lib/event';

/**
 * The "When / Where / How" band: three oversized question-and-answer rows
 * that give the essentials before anyone scrolls further.
 */
export default function InfoCards() {
  const { t } = useTranslation();

  const rows = [
    {
      label: t('infoCards.when'),
      answer: t('infoCards.whenAnswer'),
      detail: t('infoCards.whenDetail'),
    },
    {
      label: t('infoCards.where'),
      answer: t('infoCards.whereAnswer'),
      detail: t('infoCards.whereDetail'),
      action: { text: t('infoCards.whereAction'), href: VENUE_MAP_URL },
    },
    {
      label: t('infoCards.how'),
      answer: t('infoCards.howAnswer'),
      detail: t('infoCards.howDetail'),
    },
  ];

  return (
    <section id="info" className="border-whd-border bg-whd-dark relative border-t">
      {/* Soft halo bleeding up into the hero */}
      <div className="bg-whd-pink/20 pointer-events-none absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-[50%] blur-3xl" />

      {rows.map((row, index) => (
        <div key={row.label} className="relative">
          {index > 0 && <Separator />}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="px-6 py-12 sm:px-8 md:py-20 lg:px-12"
          >
            <div className="mx-auto flex max-w-[100rem] flex-col gap-4 md:flex-row md:items-baseline md:gap-16">
              <div className="md:w-1/4">
                <span className="section-kicker">{row.label}</span>
              </div>

              <div className="md:w-3/4">
                <h3 className="text-3xl leading-tight font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  <DecryptedText
                    text={row.answer}
                    animateOn="view"
                    sequential
                    encryptedClassName="text-whd-pink/50"
                  />
                </h3>
                <p className="text-whd-text-muted mt-3 text-sm md:text-base">{row.detail}</p>
                {row.action && (
                  <LinkButton
                    href={row.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="link"
                    size="none"
                    className="group/action mt-4 gap-1.5 text-sm font-semibold tracking-wider uppercase"
                  >
                    {row.action.text}
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover/action:translate-x-1"
                    >
                      <path
                        d="M1 5h11M8.5 1.5 12 5l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </LinkButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ))}

      <Separator />
    </section>
  );
}
