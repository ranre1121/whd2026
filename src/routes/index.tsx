import { Suspense, lazy, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

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
import { getSession } from '@/lib/auth.server';

// WebGL-backed and decorative — split out so it never blocks first paint,
// and never runs during SSR.
const PixelTrail = lazy(() => import('@/components/landing/PixelTrail'));

const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  return getSession(getRequest());
});

export const Route = createFileRoute('/')({
  loader: () => getSessionFn(),
  component: LandingPage,
});

function LandingPage() {
  const session = Route.useLoaderData();
  const containerRef = useRef<HTMLDivElement>(null);

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

      <Navbar session={session} />
      <Hero session={session} />
      <InfoCards />
      <About />
      <Timeline />
      <Schedule />
      <Benefits />
      <FAQ />
      <Partners />
      <Footer session={session} />
    </div>
  );
}
