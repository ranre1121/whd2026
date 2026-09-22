import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import SectionHeading from '@/components/landing/SectionHeading';

type ScheduleEvent = {
  time: string;
  id: string;
  side: 'left' | 'right';
};

const EVENTS: ScheduleEvent[] = [
  { time: '9:00-10:00', id: 'registration', side: 'left' },
  { time: '10:00-11:00', id: 'opening', side: 'right' },
  { time: '11:00-12:00', id: 'mathematics', side: 'left' },
  { time: '12:00-13:00', id: 'programming', side: 'right' },
  { time: '13:00-14:00', id: 'coffeeBreak', side: 'left' },
  { time: '14:00-16:00', id: 'productDesign', side: 'right' },
  { time: '16:00-17:00', id: 'pitching', side: 'left' },
  { time: '17:30-18:30', id: 'closing', side: 'right' },
];

type EventItemProps = Omit<ScheduleEvent, 'id'> & { index: number; title: string };

function EventItem({ time, side, index, title }: EventItemProps) {
  const content = (
    <div className="leading-tight text-white transition-transform duration-200 group-hover:scale-[1.02]">
      <p className="text-whd-text-muted mb-1 text-sm sm:text-base">{time}</p>
      <p className="text-lg font-semibold sm:text-xl md:text-2xl">{title}</p>
    </div>
  );

  return (
    <motion.div
      className="group relative mb-10 flex items-center md:mb-14"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <span className="bg-whd-pink shadow-whd-pink/40 absolute left-[1.48rem] z-20 h-4 w-4 -translate-x-1/2 rounded-full shadow-lg md:left-1/2 md:h-5 md:w-5" />

      <div className="w-full pl-12 md:hidden">{content}</div>

      <div className="hidden w-full items-center md:flex">
        {side === 'left' ? (
          <>
            <div className="w-1/2 pr-12 text-right lg:pr-20">{content}</div>
            <div className="w-1/2" />
          </>
        ) : (
          <>
            <div className="w-1/2" />
            <div className="w-1/2 pl-12 lg:pl-20">{content}</div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Schedule() {
  const { t } = useTranslation();

  return (
    <section id="schedule" className="bg-whd-dark w-full overflow-x-hidden py-20 md:py-28">
      <div className="mx-auto flex max-w-[100rem] flex-col items-center px-6 sm:px-8 lg:px-12">
        <SectionHeading
          kicker={t('schedule.kicker')}
          title={t('schedule.title')}
          className="mb-14 md:mb-20"
        />

        <div className="relative w-full max-w-5xl">
          {/* Spine — stops short of the last dot so it doesn't dangle */}
          <div
            className="absolute top-0 left-[1.48rem] w-[2px] -translate-x-1/2 bg-white/80 md:left-1/2"
            style={{ height: 'calc(100% - 2rem)' }}
          />
          {EVENTS.map((event, index) => (
            <EventItem
              key={event.id}
              time={event.time}
              side={event.side}
              index={index}
              title={t(`schedule.events.${event.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
