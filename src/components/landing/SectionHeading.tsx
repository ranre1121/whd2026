import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import DecryptedText from '@/components/landing/DecryptedText';

type SectionHeadingProps = {
  /** Small uppercase eyebrow above the title. */
  kicker: string;
  title: string;
  className?: string;
};

/**
 * The heading every section shares: a pink kicker over a large centred title.
 * The title decrypts itself as it scrolls into view.
 */
export default function SectionHeading({ kicker, title, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={cn('flex flex-col items-center text-center', className)}
    >
      <p className="section-kicker mb-4">{kicker}</p>
      <h2 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
        <DecryptedText
          text={title}
          animateOn="view"
          sequential
          encryptedClassName="text-whd-pink/50"
        />
      </h2>
    </motion.div>
  );
}
