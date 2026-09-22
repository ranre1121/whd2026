import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Separator } from '@/components/ui/separator';
import SectionHeading from '@/components/landing/SectionHeading';
import { parseTextWithLinks } from '@/lib/text';

/**
 * WHD's ten questions, grouped the way HackNU groups its FAQ — readers scan
 * the category they care about instead of the whole list.
 */
const CATEGORIES = [
  { key: 'general', questions: ['whatIs', 'organizers', 'otherEvents'] },
  {
    key: 'participation',
    questions: ['whoCanParticipate', 'professional', 'noTeam', 'howToParticipate'],
  },
  { key: 'formatPrizes', questions: ['online', 'certificates'] },
  { key: 'contact', questions: ['noAnswer'] },
] as const;

function FAQItem({ questionKey }: { questionKey: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="space-y-2">
      <div className="bg-whd-surface-raised hover:bg-whd-surface-raised/80 rounded-2xl shadow-md transition-colors duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 pl-6 text-left text-base font-light text-white md:text-xl"
        >
          <span>{t(`faq.questions.${questionKey}.q`)}</span>
          <svg
            width="18"
            height="10"
            viewBox="0 0 18 10"
            fill="none"
            aria-hidden="true"
            className={`text-whd-pink-bright shrink-0 transition-transform duration-300 ${
              isOpen ? '' : 'rotate-180'
            }`}
          >
            <path
              d="M1 9L9 1L17 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div id={panelId} className="bg-whd-surface rounded-2xl p-4 pl-6 shadow-md">
          <div className="text-whd-text-muted text-base leading-relaxed font-light md:text-lg">
            {parseTextWithLinks(t(`faq.questions.${questionKey}.a`))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="bg-whd-dark w-full py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          kicker={t('faq.kicker')}
          title={t('faq.title')}
          className="mb-14 md:mb-16"
        />

        <div className="space-y-10">
          {CATEGORIES.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.08 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="section-kicker">{t(`faq.categories.${category.key}`)}</span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-3">
                {category.questions.map((questionKey) => (
                  <FAQItem key={questionKey} questionKey={questionKey} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
