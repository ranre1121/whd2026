import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import DecryptedText from '@/components/landing/DecryptedText';
import { parseTextWithLinks } from '@/lib/text';

export default function About() {
  const { t } = useTranslation();

  const highlights = [
    { number: t('about.editionOrdinal'), unit: '', text: t('about.annualEdition') },
    { number: t('about.roundsCount'), unit: '', text: t('about.rounds') },
    { number: t('about.prizeAmount'), unit: t('about.prizeUnit'), text: t('about.prizePool') },
  ];

  return (
    <section id="about" className="bg-whd-dark py-20 md:py-28">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-8 lg:px-12">
        {/* Highlights */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:mb-24 md:grid-cols-3 md:gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent>
                  <div className="text-whd-pink-bright mb-2 flex flex-wrap items-baseline gap-x-2 text-4xl leading-none font-black md:text-6xl">
                    <DecryptedText
                      text={item.number}
                      animateOn="view"
                      sequential
                      encryptedClassName="text-whd-pink/50"
                    />
                    {item.unit && (
                      <span className="text-2xl font-bold md:text-3xl">{item.unit}</span>
                    )}
                  </div>
                  <div className="group-hover/card:text-whd-pink-soft mt-2 text-lg font-light text-white transition-colors md:text-xl">
                    {item.text}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Description + illustration */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="section-kicker">{t('about.kicker')}</p>

            <h2 className="text-3xl leading-tight font-bold text-white md:text-5xl">
              {t('about.title')}
              <br />
              <span className="text-whd-pink-soft">{t('about.titleHighlight')}</span>
            </h2>

            <p className="text-lg leading-relaxed text-white sm:text-xl md:text-2xl">
              {parseTextWithLinks(t('about.description'))}
            </p>

            <p className="text-whd-text-muted leading-relaxed">{t('about.organizers')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative hidden justify-center lg:flex"
          >
            <img
              src="/images/about.svg"
              alt={t('about.imageAlt')}
              width={800}
              height={800}
              loading="lazy"
              className="z-10 w-full max-w-xl"
            />
            <div className="bg-whd-pink/30 absolute top-1/2 left-[60%] z-0 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
