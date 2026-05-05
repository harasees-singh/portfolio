import './index.css';
import { BackgroundStack } from './components/BackgroundStack';
import { TopNav } from './components/TopNav';
import { DepthRail } from './components/DepthRail';
import { Hero, SurfaceEntry } from './components/Hero';
import { Bento, Card, Zone } from './components/Zone';
import { SiteFooter } from './components/SiteFooter';

export default function App() {
  return (
    <div className="app">
      <BackgroundStack />
      <TopNav />
      <DepthRail />

      <main>
        <SurfaceEntry />
        <Hero />

        {/* TWILIGHT — Sunlit & Twilight Zones */}
        <Zone
          id="twilight"
          eyebrow="Submerged Systems"
          title="Resilient platforms for uncharted environments"
          depth="200m"
          temp="8°C"
        >
          <Bento>
            <Card
              variant="feature"
              eyebrow="Submerged Systems"
              title="Scalable architectures for uncharted environments"
              body="Deploying resilient infrastructure requires more than just code. It demands an
                    understanding of the immense pressure and isolation found in the furthest
                    reaches of the data ecosystem."
            />
            <Card variant="side">
              <div className="status-orb">
                <span className="icon icon--fill">dns</span>
              </div>
              <span className="status-label">System Status</span>
              <span className="status-value">STABLE</span>
            </Card>
          </Bento>
        </Zone>

        {/* EXPLORATION — Abyssal Zone */}
        <Zone
          id="exploration"
          eyebrow="Mission Log V2"
          title="Exploration metrics"
          depth="2,250m"
          temp="3°C"
        >
          <Bento>
            <Card variant="third" eyebrow="Throughput">
              <div className="metric">
                <span className="metric__value">128k</span>
                <span className="metric__unit">requests · min</span>
              </div>
              <p className="card__body" style={{ marginTop: '1rem' }}>
                Sustained read throughput across the primary archive cluster, holding at
                cold-storage latencies under 14ms p99.
              </p>
            </Card>
            <Card variant="third" eyebrow="Uptime">
              <div className="metric">
                <span className="metric__value">99.987%</span>
                <span className="metric__unit">trailing 90 days</span>
              </div>
              <p className="card__body" style={{ marginTop: '1rem' }}>
                Self-healing routing layer rebalances live shards as nodes drop without
                impacting the descent.
              </p>
            </Card>
            <Card variant="third" eyebrow="Pressure">
              <div className="metric">
                <span className="metric__value">225 atm</span>
                <span className="metric__unit">deep-fleet load</span>
              </div>
              <p className="card__body" style={{ marginTop: '1rem' }}>
                Backpressure shapes traffic across regions, holding tail latency steady
                under bursty consumer demand.
              </p>
            </Card>
          </Bento>
        </Zone>

        {/* LOGS — Hadal Zone */}
        <Zone
          id="logs"
          eyebrow="Field Notes"
          title="Selected expeditions"
          depth="6,800m"
          temp="2°C"
        >
          <Bento>
            <Card
              variant="half"
              eyebrow="Distributed Storage"
              title="Resilient infrastructure"
              body="Deploying distributed storage systems designed for high availability under
                    extreme load. The network of nodes self-heals, withstands outages, and
                    redirects requests through the silent layers of the platform."
            />
            <Card
              variant="half"
              eyebrow="Edge Telemetry"
              title="Physeter macrocephalus"
              body="Continuous telemetry pipelines moving 2.25 billion events per minute through
                    a low-latency mesh, surfacing only the signal worth your attention at the
                    surface."
            />
            <Card
              variant="half"
              eyebrow="Cold Routing"
              title="The Lantern Protocol"
              body="A bioluminescent routing layer that lights only the path requests take —
                    keeping the rest of the graph dark, cheap, and quiet."
            />
            <Card
              variant="half"
              eyebrow="Pressure Cells"
              title="System Isolation"
              body="Tenants are sealed inside pressure cells: a failure in one zone never
                    reaches the next. The deeper the cell, the harder it is to perturb."
            />
          </Bento>
        </Zone>

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
                  I&apos;m always interested in resilient systems, dark-mode interfaces, and
                  problems that look impossible from the surface. Drop a line and I&apos;ll
                  reply from somewhere very deep.
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

