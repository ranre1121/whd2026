import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import SectionHeading from '@/components/landing/SectionHeading';

const ITEMS = [
  { image: '/timeline/registration.jpg', dateKey: 'registration', labelKey: 'registrationLabel' },
  { image: '/timeline/confirmation.jpg', dateKey: 'confirmation', labelKey: 'confirmationLabel' },
  { image: '/timeline/event.jpg', dateKey: 'event', labelKey: 'eventLabel' },
] as const;

export default function Timeline() {
  const { t } = useTranslation();

  return (
    <section id="timeline" className="bg-whd-dark w-full overflow-x-hidden py-20 md:py-28">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-8 lg:px-12">
        <SectionHeading
          kicker={t('timeline.kicker')}
          title={t('timeline.title')}
          className="mb-14 md:mb-20"
        />

        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 md:flex-row md:items-start md:justify-center md:gap-12 lg:gap-20">
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.dateKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex w-full max-w-[400px] flex-col items-center md:flex-1"
            >
              <img
                src={item.image}
                alt={t(`timeline.items.${item.labelKey}`)}
                width={400}
                height={400}
                loading="lazy"
                className="whd-glow mb-6 h-auto w-full rounded-lg"
              />
              <p className="text-whd-pink-bright mb-3 text-center text-2xl leading-tight font-normal sm:text-3xl md:text-4xl">
                {t(`timeline.items.${item.dateKey}`)}
              </p>
              <p className="text-center text-2xl leading-tight font-normal text-white sm:text-3xl md:text-4xl">
                {t(`timeline.items.${item.labelKey}`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
