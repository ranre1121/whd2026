import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import SectionHeading from '@/components/landing/SectionHeading';

const INFO_PARTNERS = [
  '/partners/info-1.svg',
  '/partners/info-2.png',
  '/partners/info-3.jpg',
  '/partners/info-4.png',
] as const;

export default function Partners() {
  const { t } = useTranslation();

  return (
    <section
      id="partners"
      className="border-whd-border bg-whd-dark w-full overflow-x-hidden border-t py-20 md:py-28"
    >
      <div className="mx-auto max-w-[100rem] px-6 sm:px-8 lg:px-12">
        <SectionHeading
          kicker={t('partners.kicker')}
          title={t('partners.title')}
          className="mb-14 md:mb-20"
        />

        {/* General sponsor */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center text-2xl font-semibold text-white md:mb-10 md:text-3xl"
        >
          {t('partners.generalSponsor')}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex items-center justify-center md:mb-24"
        >
          <div className="flex w-full max-w-2xl items-center justify-center rounded-2xl bg-white/5 p-8 transition-all duration-300 hover:bg-white/10 md:p-12">
            <img
              src="/partners/broker.svg"
              alt={t('partners.generalSponsorAlt')}
              width={1181}
              height={469}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </motion.div>

        {/* Info partners */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center text-2xl font-semibold text-white md:mb-10 md:text-3xl"
        >
          {t('partners.infoPartners')}
        </motion.h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 lg:gap-10">
          {INFO_PARTNERS.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="hover:shadow-whd-pink/20 flex aspect-square items-center justify-center rounded-2xl bg-white p-4 transition-all duration-300 hover:shadow-lg md:p-6 lg:p-8"
            >
              <img
                src={src}
                alt={t('partners.infoPartnerAlt', { index: index + 1 })}
                width={300}
                height={150}
                loading="lazy"
                className="h-auto w-full object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
