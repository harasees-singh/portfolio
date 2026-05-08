import './index.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BackgroundStack } from './components/BackgroundStack';
import { TopNav } from './components/TopNav';
import { DepthRail } from './components/DepthRail';
import { Hero, SurfaceEntry } from './components/Hero';
import { LoadingScreen } from './components/LoadingScreen';
import { ZoneTeaser } from './components/ZoneTeaser';
import { ZoneDeepDive } from './components/ZoneDeepDive';
import { Bento, Card, Zone } from './components/Zone';
import { SiteFooter } from './components/SiteFooter';
import { MobileTabBar } from './components/MobileTabBar';
import { useHashRoute } from './useHashRoute';
import { zones, zonesBySlug } from './data/zones';

/** Minimum time the loader stays on screen so it never flashes mid-animation. */
const LOADER_MIN_MS = 900;

export default function App() {
  const [route, navigate] = useHashRoute();
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const mountedAt = useRef<number>(typeof performance !== 'undefined' ? performance.now() : Date.now());

  // Hide the loader once the background scene is ready, but never sooner
  // than LOADER_MIN_MS so the entrance animation always has a moment to read.
  useEffect(() => {
    if (!sceneReady) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const remaining = Math.max(0, LOADER_MIN_MS - (now - mountedAt.current));
    const id = window.setTimeout(() => setLoaderVisible(false), remaining);
    return () => window.clearTimeout(id);
  }, [sceneReady]);

  // Lock body scroll while the loader covers the viewport so the user
  // doesn’t accidentally scroll the descent before it can begin.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = loaderVisible ? 'hidden' : prev || '';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loaderVisible]);

  // Sunlit lives inline on the landing page (it owns the H1), so the deeper
  // zones below it are rendered as minimal teasers that link to deep-dive
  // routes for the dense info.
  const teaserZones = useMemo(() => zones.filter((z) => z.slug !== 'sunlit'), []);

  // Deep-dive route — render only the focused zone, no descent surrounding it.
  // Deep-dive route — render only the focused zone, no descent surrounding it.
  const deepZone = route ? zonesBySlug[route] : undefined;
  if (deepZone) {
    // The deep-dive page has none of the landing zone anchors in the DOM, so
    // the topnav telemetry would otherwise read 0. Pass the active zone's
    // depth directly so the readout stays meaningful.
    const deepDepth = parseDepthMetres(deepZone.depth);
    return (
      <div className={`app app--deep app--zone-${deepZone.slug}`}>
        <BackgroundStack staticBackground zoneSlug={deepZone.slug} onReady={() => setSceneReady(true)} />
        <TopNav currentDepth={deepDepth} />
        <ZoneDeepDive zone={deepZone} onBack={() => navigate('')} />
        <SiteFooter />
        <MobileTabBar />
        <LoadingScreen visible={loaderVisible} />
      </div>
    );
  }

  return (
    <div className="app">
      <BackgroundStack onReady={() => setSceneReady(true)} />
      <TopNav />
      <DepthRail />

      <main>
        <SurfaceEntry />
        <Hero onExplore={navigate} />

        {teaserZones.map((zone) => (
          <ZoneTeaser key={zone.slug} zone={zone} onExplore={navigate} />
        ))}

        {/* TERMINAL — Contact */}
        <Zone
          id="contact"
          eyebrow="Surface Channel"
          title="Open a signal"
          depth="∞"
          temp="—"
        >
          <Bento>
            <Card variant="full">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                }}
              >
                <span className="code-tag">Contact_The_Terminal</span>
                <h3 className="card__title" style={{ marginBottom: 0 }}>
                  Send a transmission topside.
                </h3>
                <p className="card__body">
                  I&apos;m always interested in resilient systems, dark-mode interfaces,
                  and problems that look impossible from the surface. Drop a line and
                  I&apos;ll reply from somewhere very deep.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a className="action" href="mailto:harasees1202@gmail.com">
                    <span className="icon icon--fill">send</span>
                    Initiate Transmission
                  </a>
                  <a className="action action--ghost" href="#surface">
                    <span className="icon">arrow_upward</span>
                    Return to Surface
                  </a>
                </div>
              </div>
            </Card>
          </Bento>
        </Zone>
      </main>

      <SiteFooter />
      <MobileTabBar />
      <LoadingScreen visible={loaderVisible} />
    </div>
  );
}

/** Parses zone depth strings like "2,250m" into a plain integer (metres). */
function parseDepthMetres(depth: string): number {
  const digits = depth.replace(/[^0-9]/g, '');
  return digits.length ? parseInt(digits, 10) : 0;
}
