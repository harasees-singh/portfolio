import './index.css';
import { BackgroundStack } from './components/BackgroundStack';
import { TopNav } from './components/TopNav';
import { DepthRail } from './components/DepthRail';
import { DistrictCard, Hero, SurfaceEntry } from './components/Hero';
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

        {/* TWILIGHT — Distributed Systems & Storage Architectures (200m) */}
        <Zone
          id="twilight"
          eyebrow="Twilight Zone"
          title="Where storage becomes a topology, not a server"
          depth="200m"
          temp="8°C"
        >
          <p
            className="hero__subtitle"
            style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}
          >
            The light dims and the system gets larger than any one machine.
            Replication, partitioning, log-structured storage, warehousing — the
            terrain where consistency, latency and cost have to be negotiated rather
            than assumed.
          </p>
          <div className="hero__atlas">
            <DistrictCard
              districtNumber="05"
              district="Land of the B-Trees"
              heading="PostgreSQL · MySQL · SQL Server · Oracle"
              body="The Republic of Transaction Processing. Mature OLTP engines built
                    on B-tree indexes, MVCC, and write-ahead logs — the bedrock under
                    most production traffic I work with."
              tags={['B-Trees', 'MVCC', 'WAL', 'Secondary Indexes']}
            />
            <DistrictCard
              districtNumber="06"
              district="Log-Structured Storage"
              heading="Cassandra · HBase · RocksDB · LevelDB"
              body="The Way of the Log. LSM-tree engines that turn random writes into
                    sequential ones — BigTable Tablelands, the Highlands of Search,
                    and the Bay of Embedded Storage Engines."
              tags={['LSM Trees', 'SSTables', 'Compaction', 'Bloom Filters']}
            />
            <DistrictCard
              districtNumber="07"
              district="Valley of In-Memory Storage"
              heading="Redis · Memcached · Spark · Materialised Views"
              body="Where everything fits in RAM and latency stops being negotiable.
                    Caches, in-memory grids, and the Tower of Spark for analytics that
                    need to answer in milliseconds."
              tags={['In-memory', 'Caches', 'Spark', 'Materialised Views']}
            />
            <DistrictCard
              districtNumber="08"
              district="Kingdom of Analytics"
              heading="Vertica · ParAccel/Redshift · Parquet · Star Schemas"
              body="The Realm of Data Warehouses — columnar storage, the Mountains of
                    Column Storage, and the Star Schema Monument that anchors every
                    BI dashboard worth trusting."
              tags={['Vertica', 'Redshift', 'Parquet', 'Star Schema']}
            />
            <DistrictCard
              districtNumber="09"
              district="Hadoop Region"
              heading="HDFS · Hive · Impala · Presto · Drill"
              body="Bulk storage and SQL-on-anything. The Lake of HDFS feeds query
                    engines that scan terabytes without flinching — the workhorse for
                    cold and warm batch workloads."
              tags={['HDFS', 'Hive', 'Impala', 'Presto', 'Drill']}
            />
            <DistrictCard
              districtNumber="10"
              district="Scientific Inquiry Islands"
              heading="Genome · Array Databases · Specialised Stores"
              body="The far archipelago. Domain-specific engines for genomics, sensor
                    arrays and scientific workloads — reminders that not every problem
                    fits a generic relational shape."
              tags={['Array DBs', 'Genome stores', 'Time-series']}
            />
          </div>
        </Zone>

        {/* EXPLORATION — Abyssal Zone — Replication & Consistency (2,250m) */}
        <Zone
          id="exploration"
          eyebrow="Abyssal Zone"
          title="Replication, causality and the cost of agreement."
          depth="2,250m"
          temp="3°C"
        >
          <p
            className="hero__subtitle"
            style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}
          >
            Below the warehouses the terrain folds into replicas. The map stops being
            about where data lives and starts being about who agrees on it — single
            leader, multi-leader, leaderless, and the long swim through the Bay of
            Causality between them.
          </p>
          <div className="hero__atlas">
            <DistrictCard
              districtNumber="11"
              district="Single-Leader Replication"
              heading="PostgreSQL · MySQL · SQL Server · Oracle · MongoDB"
              body="The Logical and Physical Coasts. One node owns the writes, followers
                    catch up — simple to reason about until the Pit of Failover opens
                    and you have to decide what 'caught up' really means."
              tags={['Primary/Replica', 'Sync vs async', 'Failover', 'Replication lag']}
            />
            <DistrictCard
              districtNumber="12"
              district="Multi-Leader Replication"
              heading="CouchDB · Etherpad · Google Docs · Calendar Sync"
              body="The Replication-Lag Highway and the Pinnacles of Conflict
                    Resolution. Several nodes accept writes; reconciling them is half
                    engineering and half product policy."
              tags={['Multi-master', 'Conflict resolution', 'Last-write-wins', 'Custom merge']}
            />
            <DistrictCard
              districtNumber="13"
              district="Leaderless Replication"
              heading="Cassandra · Riak · Voldemort"
              body="Quorum Harbor on the Eventual Consistency Boulevard. Reads and
                    writes hit any replica; quorums and read-repair stitch the system
                    back together when nodes diverge."
              tags={['Quorums (R/W/N)', 'Read repair', 'Hinted handoff', 'Anti-entropy']}
            />
            <DistrictCard
              districtNumber="14"
              district="Bay of Causality"
              heading="Vector clocks · Lamport timestamps · Happens-before"
              body="Tracking what could have caused what across nodes. The terrain
                    where 'before' and 'after' stop being properties of the wall clock
                    and start being properties of the system."
              tags={['Vector clocks', 'Lamport', 'Causal order', 'Hybrid logical clocks']}
            />
            <DistrictCard
              districtNumber="15"
              district="Pinnacles of Conflict Resolution"
              heading="CRDTs · Operational Transform · Application merges"
              body="The high country where concurrent writes finally have to agree.
                    Convergent data types for collaborative editing, presence, counters,
                    and live cursors that survive partitions."
              tags={['CRDTs', 'OT', 'G-Counters', 'OR-Sets']}
            />
            <DistrictCard
              districtNumber="16"
              district="Forest of Consistency Models"
              heading="Linearizable · Sequential · Causal · Eventual"
              body="The dense interior. Choosing the weakest model the product can
                    tolerate, then defending that choice when someone asks why the UI
                    'showed the old number for a second'."
              tags={['Linearizability', 'Sequential', 'Causal', 'Eventual']}
            />
          </div>
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

