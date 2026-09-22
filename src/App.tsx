import { Suspense, lazy, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import InfoCards from '@/components/landing/InfoCards';
import About from '@/components/landing/About';
import Timeline from '@/components/landing/Timeline';
import Schedule from '@/components/landing/Schedule';
import Benefits from '@/components/landing/Benefits';
import FAQ from '@/components/landing/FAQ';
import Partners from '@/components/landing/Partners';
import Footer from '@/components/landing/Footer';

// WebGL-backed and decorative — split out so it never blocks first paint.
const PixelTrail = lazy(() => import('@/components/landing/PixelTrail'));

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  // Keep <html lang> in step with the active language for screen readers and SEO.
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language;
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <div ref={containerRef} className="bg-whd-dark relative min-h-screen">
      {/* Cursor trail — pointer-driven, so desktop only */}
      <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
        <Suspense fallback={null}>
          <PixelTrail
            gridSize={60}
            trailSize={0.03}
            maxAge={120}
            interpolate={1}
            color="#FF9DD5"
            gooeyEnabled={false}
            eventSource={containerRef}
            eventPrefix="client"
          />
        </Suspense>
      </div>

      <Navbar />
      <Hero />
      <InfoCards />
      <About />
      <Timeline />
      <Schedule />
      <Benefits />
      <FAQ />
      <Partners />
      <Footer />
    </div>
  );
}
