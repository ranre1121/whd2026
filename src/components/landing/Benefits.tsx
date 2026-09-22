import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeading from '@/components/landing/SectionHeading';

const BENEFIT_KEYS = [
  'prizePool',
  'welcomePackage',
  'merchandise',
  'coffeeBreak',
  'certificates',
  'coaching',
] as const;

export default function Benefits() {
  const { t } = useTranslation();

  return (
    <section id="benefits" className="bg-whd-dark w-full py-20 md:py-28">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-8 lg:px-12">
        <SectionHeading
          kicker={t('benefits.kicker')}
          title={t('benefits.title')}
          className="mb-14 md:mb-16"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFIT_KEYS.map((benefitKey, index) => (
            <motion.div
              key={benefitKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="text-whd-pink-bright mt-1 text-sm font-bold tabular-nums"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base leading-relaxed text-white md:text-lg">
                    {t(`benefits.${benefitKey}`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
