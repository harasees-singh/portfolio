import './index.css';
import { useMemo } from 'react';
import { BackgroundStack } from './components/BackgroundStack';
import { TopNav } from './components/TopNav';
import { DepthRail } from './components/DepthRail';
import { Hero, SurfaceEntry } from './components/Hero';
import { ZoneTeaser } from './components/ZoneTeaser';
import { ZoneDeepDive } from './components/ZoneDeepDive';
import { Bento, Card, Zone } from './components/Zone';
import { SiteFooter } from './components/SiteFooter';
import { useHashRoute } from './useHashRoute';
import { zones, zonesBySlug } from './data/zones';

export default function App() {
  const [route, navigate] = useHashRoute();

  // Sunlit lives inline on the landing page (it owns the H1), so the deeper
  // zones below it are rendered as minimal teasers that link to deep-dive
  // routes for the dense info.
  const teaserZones = useMemo(() => zones.filter((z) => z.slug !== 'sunlit'), []);

  // Deep-dive route — render only the focused zone, no descent surrounding it.
  const deepZone = route ? zonesBySlug[route] : undefined;
  if (deepZone) {
    return (
      <div className="app app--deep">
        <BackgroundStack staticBackground />
        <TopNav />
        <ZoneDeepDive zone={deepZone} onBack={() => navigate('')} />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="app">
      <BackgroundStack />
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
    </div>
  );
}
