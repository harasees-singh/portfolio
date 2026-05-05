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

        {/* TWILIGHT — Mesopelagic Zone — Storage, Retrieval & Encoding (200m) */}
        <Zone
          id="twilight"
          eyebrow="Twilight Zone"
          title="Storage, retrieval and the wire formats between them"
          depth="200m"
          temp="8°C"
        >
          <p
            className="hero__subtitle"
            style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}
          >
            Light dims, focus shifts. The question stops being &ldquo;which
            engine?&rdquo; and becomes &ldquo;how does it actually store the bytes,
            find them again, and ship them across the wire?&rdquo;. Storage engines,
            access patterns and encodings &mdash; the choices that decide what an
            application is fast and slow at long before the first feature ships.
          </p>
          <div className="hero__atlas">
            <DistrictCard
              districtNumber="05"
              district="Land of the B-Trees"
              heading="PostgreSQL · MySQL · SQL Server · Oracle"
              body="The Republic of Transaction Processing. Mature OLTP engines built
                    on B-tree indexes, MVCC and write-ahead logs &mdash; the bedrock
                    under most production traffic I work with."
              tags={['B-Trees', 'MVCC', 'WAL', 'Secondary Indexes']}
            />
            <DistrictCard
              districtNumber="06"
              district="Log-Structured Storage"
              heading="Cassandra · HBase · RocksDB · LevelDB · Lucene"
              body="The Way of the Log. LSM-tree engines that turn random writes into
                    sequential ones &mdash; BigTable Tablelands, the Highlands of
                    Search and the Bay of Embedded Storage Engines."
              tags={['LSM Trees', 'SSTables', 'Compaction', 'Bloom Filters']}
            />
            <DistrictCard
              districtNumber="07"
              district="Forest of Secondary Indexes"
              heading="HyperDex · Document & term-partitioned indexes · Multi-column"
              body="The other half of every query plan. Composite, covering and
                    partial indexes; full-text indexes; and the cost model that
                    decides whether the planner reaches for them at all.."
              tags={['Composite', 'Covering', 'Partial', 'Full-text']}
            />
            <DistrictCard
              districtNumber="08"
              district="Valley of In-Memory Storage"
              heading="Redis · Memcached · Materialised Views"
              body="Where everything fits in RAM and latency stops being negotiable.
                    Caches, in-memory grids and the precomputed views that let the
                    serving tier answer in microseconds.."
              tags={['In-memory', 'Caches', 'Hot keys', 'Materialised Views']}
            />
            <DistrictCard
              districtNumber="09"
              district="Kingdom of Analytics"
              heading="Vertica · ParAccel/Redshift · Parquet · Star Schemas"
              body="The Realm of Data Warehouses &mdash; columnar storage, the
                    Mountains of Column Storage and the Star Schema Monument that
                    anchors every BI dashboard worth trusting.."
              tags={['Columnar', 'Vertica', 'Redshift', 'Parquet', 'Star Schema']}
            />
            <DistrictCard
              districtNumber="10"
              district="Bulk Storage Tundra"
              heading="CSV · Parquet · Avro · SQL dumps · Log files"
              body="The flat-file frontier. The formats data lives in when it&apos;s
                    sitting between systems &mdash; cheap to write, cheap to scan,
                    schema-on-read when you finally need it.."
              tags={['CSV', 'Parquet', 'Avro', 'SQL dumps']}
            />
            <DistrictCard
              districtNumber="11"
              district="Coast of Textual Encodings"
              heading="JSON · XML · YAML · CSV"
              body="Human-readable wire formats. JSON for almost everything that
                    crosses a service boundary, XML where legacy contracts demand it,
                    YAML for the configuration that humans actually read.."
              tags={['JSON', 'XML', 'YAML', 'Schema-on-read']}
            />
            <DistrictCard
              districtNumber="12"
              district="Gulf of Binary Encodings"
              heading="Protocol Buffers · Thrift · Avro · MessagePack"
              body="Compact, schema-driven formats for high-throughput RPC and event
                    pipelines. Forward- and backward-compatible field changes that
                    don&apos;t break the consumer fleet on deploy day.."
              tags={['Protobuf', 'Thrift', 'Avro', 'Schema evolution']}
            />
            <DistrictCard
              districtNumber="13"
              district="Bay of REST"
              heading="REST · JSON over HTTP · Swagger / OpenAPI"
              body="The default trade route. Resource-oriented HTTP APIs with
                    machine-readable contracts, paged collections, idempotent verbs
                    and the cache-control headers that let CDNs do their job.."
              tags={['REST', 'OpenAPI', 'HATEOAS', 'Cacheable']}
            />
            <DistrictCard
              districtNumber="14"
              district="People’s Republic of RPC"
              heading="gRPC · Thrift · Protobuf · WSDL/SOAP"
              body="When services need stricter contracts than HTTP can carry on its
                    own. Strongly-typed stubs, streaming bidirectional channels and a
                    careful eye on the &ldquo;illusion of transparent RPC&rdquo;.."
              tags={['gRPC', 'Thrift', 'SOAP', 'Streaming']}
            />
            <DistrictCard
              districtNumber="15"
              district="Mountains of Message Passing"
              heading="Akka · Erlang/OTP · Actors · Mailboxes"
              body="Asynchronous, location-transparent message passing for systems
                    that have to keep working through partial failure. Actors as the
                    unit of state and concurrency.."
              tags={['Actors', 'Akka', 'Erlang/OTP', 'Mailboxes']}
            />
            <DistrictCard
              districtNumber="16"
              district="Schema Evolution & Compatibility"
              heading="Schema-on-write vs read · Backward / forward compat"
              body="Schemas as a contract that survives deploys. Adding optional
                    fields, never reusing tags, and keeping old consumers working
                    while the rest of the fleet moves on.."
              tags={['Backward compat', 'Forward compat', 'Schema registry']}
            />
          </div>
        </Zone>

        {/* MIDNIGHT — Bathypelagic Zone — Replication & Partitioning (1,500m) */}
        <Zone
          id="midnight"
          eyebrow="Midnight Zone"
          title="Replication and partitioning: how the system stays one system"
          depth="1,500m"
          temp="4°C"
        >
          <p
            className="hero__subtitle"
            style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}
          >
            No sunlight reaches here. The dataset is too large to fit on one machine
            and too important to live on just one. Two interlocking strategies keep
            it coherent — replicate the data so any node can fail, partition it so
            no node has to hold all of it.
          </p>
          <div className="hero__atlas">
            <DistrictCard
              districtNumber="17"
              district="Single-Leader Replication"
              heading="PostgreSQL · MySQL · SQL Server · Oracle · MongoDB"
              body="The Logical and Physical Coasts. One node owns the writes, followers
                    catch up — simple to reason about until the Pit of Failover opens
                    and you have to decide what ‘caught up’ really means."
              tags={['Primary/Replica', 'Sync vs async', 'Failover', 'Replication lag']}
            />
            <DistrictCard
              districtNumber="18"
              district="Multi-Leader Replication"
              heading="CouchDB · Etherpad · Google Docs · Calendar Sync"
              body="The Replication-Lag Highway and the Pinnacles of Conflict
                    Resolution. Several nodes accept writes; reconciling them is half
                    engineering and half product policy."
              tags={['Multi-master', 'Conflict resolution', 'Last-write-wins', 'Custom merge']}
            />
            <DistrictCard
              districtNumber="19"
              district="Leaderless Replication"
              heading="Cassandra · Riak · Voldemort"
              body="Quorum Harbor on the Eventual Consistency Boulevard. Reads and
                    writes hit any replica; quorums and read-repair stitch the system
                    back together when nodes diverge."
              tags={['Quorums (R/W/N)', 'Read repair', 'Hinted handoff', 'Anti-entropy']}
            />
            <DistrictCard
              districtNumber="20"
              district="Hash Partitioning"
              heading="Cassandra · Voldemort · MongoDB · RethinkDB"
              body="A consistent hash spreads keys evenly across nodes — even load out
                    of the box, but range scans become a long swim across every shard."
              tags={['Consistent hashing', 'Even load', 'No range scans']}
            />
            <DistrictCard
              districtNumber="21"
              district="Key-Range Partitioning"
              heading="HBase · Bigtable · MongoDB (sharded)"
              body="Keys carved into ordered ranges. Range scans are cheap, but hot
                    keys can capsize a single shard if the access pattern isn’t shaped
                    around the partition key."
              tags={['Ordered keys', 'Range scans', 'Hot-spot risk']}
            />
            <DistrictCard
              districtNumber="22"
              district="Secondary Indexes"
              heading="Document-partitioned (local) · Term-partitioned (global) · Elasticsearch · Solr"
              body="The hardest part of partitioned storage. Local indexes are cheap
                    to write, expensive to query; global indexes flip the trade-off and
                    bring their own consistency questions."
              tags={['Local indexes', 'Global indexes', 'Elasticsearch', 'Solr']}
            />
            <DistrictCard
              districtNumber="23"
              district="Rebalancing"
              heading="Virtual nodes · Dynamic partitioning · Hand-off"
              body="When a node leaves or joins, partitions migrate. Vnodes, pre-split
                    tablets, and hinted hand-off make the move invisible to clients
                    who don’t get to know the topology."
              tags={['Vnodes', 'Tablet split', 'Hinted hand-off']}
            />
            <DistrictCard
              districtNumber="24"
              district="Request Routing"
              heading="ZooKeeper · etcd · Smart clients · Coordinator nodes"
              body="Something has to know which partition lives where. Membership
                    services, gossip, and routing tiers turn the cluster from a pile
                    of nodes into a queryable system."
              tags={['ZooKeeper', 'etcd', 'Gossip', 'Smart routing']}
            />
          </div>
        </Zone>

        {/* EXPLORATION — Abyssal Zone — Consistency, Consensus & Distributed Transactions (2,250m) */}
        <Zone
          id="exploration"
          eyebrow="Abyssal Zone"
          title="Consistency, consensus and the cost of agreement"
          depth="2,250m"
          temp="3°C"
        >
          <p
            className="hero__subtitle"
            style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}
          >
            Below the warehouses the terrain folds inward. Replicas have to agree,
            transactions have to span machines, and the system needs a single
            answer about ‘what really happened, and in what order’. Mount Consensus
            rises out of this trench — every uniqueness constraint and leader
            election in the layers above eventually ends up here.
          </p>
          <div className="hero__atlas">
            <DistrictCard
              districtNumber="25"
              district="Forest of Consistency Models"
              heading="Linearizable · Sequential · Causal · Eventual"
              body="The dense interior. Choosing the weakest model the product can
                    tolerate, then defending that choice when someone asks why the UI
                    ‘showed the old number for a second’."
              tags={['Linearizability', 'Sequential', 'Causal', 'Eventual']}
            />
            <DistrictCard
              districtNumber="26"
              district="Bay of Causality"
              heading="Vector clocks · Lamport timestamps · Happens-before"
              body="Tracking what could have caused what across nodes. Where ‘before’
                    and ‘after’ stop being properties of the wall clock and start
                    being properties of the system."
              tags={['Vector clocks', 'Lamport', 'Causal order', 'HLC']}
            />
            <DistrictCard
              districtNumber="27"
              district="Pinnacles of Conflict Resolution"
              heading="CRDTs · Operational Transform · Application merges"
              body="The high country where concurrent writes finally have to agree.
                    Convergent data types for collaborative editing, presence,
                    counters, and live cursors that survive partitions."
              tags={['CRDTs', 'OT', 'G-Counters', 'OR-Sets']}
            />
            <DistrictCard
              districtNumber="28"
              district="Mount Consensus"
              heading="Paxos · Raft · Zab · Total Order Broadcast"
              body="The peak. Every membership change, every uniqueness constraint,
                    every leader election eventually reduces to consensus — even when
                    the system pretends otherwise."
              tags={['Paxos', 'Raft', 'Zab', 'Total order broadcast']}
            />
            <DistrictCard
              districtNumber="29"
              district="Membership & Coordination"
              heading="ZooKeeper · etcd · Failure Detectors"
              body="Service registries, distributed locks, leader election, config
                    propagation — the small but unavoidable pieces that need a strong
                    consistency model underneath them."
              tags={['ZooKeeper', 'etcd', 'Locks', 'Leader election']}
            />
            <DistrictCard
              districtNumber="30"
              district="Distributed Transactions"
              heading="Two-phase commit · Sagas · XA"
              body="When one write must touch many partitions or services. 2PC for
                    short, blocking transactions; sagas with compensations for the
                    long-running ones that can’t hold a lock."
              tags={['2PC', 'Sagas', 'Compensations', 'XA']}
            />
            <DistrictCard
              districtNumber="31"
              district="Linearizability & Global Constraints"
              heading="Compare-and-set · Increment-and-get · Uniqueness"
              body="The strict consistency island. Read-write registers that behave
                    as if there were one, atomic operations across replicas, and the
                    uniqueness guarantees the product layer always assumes."
              tags={['Linearizability', 'CAS', 'Uniqueness', 'Strong consistency']}
            />
          </div>
        </Zone>

        {/* LOGS — Hadal Zone — Batch + Stream Processing & Derived Data (6,800m) */}
        <Zone
          id="logs"
          eyebrow="Hadal Zone"
          title="Batch, streams and the great event log"
          depth="6,800m"
          temp="2°C"
        >
          <p
            className="hero__subtitle"
            style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}
          >
            The deepest pressure. Most production data isn’t the source of truth —
            it’s a derivative. Search indexes, recommendation models, materialised
            views, training datasets. The Hadal trench is where raw events feed the
            Forest of Logs and the Great Event Stream, then get reshaped into the
            answers the surface actually queries.
          </p>
          <div className="hero__atlas">
            <DistrictCard
              districtNumber="32"
              district="Distributed Filesystems"
              heading="HDFS · S3 · GCS · Object stores"
              body="The bedrock under every batch pipeline. Cheap, durable storage
                    that scales horizontally and lets compute be brought to the data
                    rather than the other way around."
              tags={['HDFS', 'S3', 'Object storage']}
            />
            <DistrictCard
              districtNumber="33"
              district="Batch Processing"
              heading="MapReduce · Spark · Hive · Tez · Pig"
              body="Where MapReduce workflows still live and Spark replaces them.
                    Batch jobs that turn raw event lakes into the tables analysts and
                    downstream services depend on."
              tags={['MapReduce', 'Spark', 'Hive', 'Tez']}
            />
            <DistrictCard
              districtNumber="34"
              district="MPP Databases & SQL on Anything"
              heading="Impala · Presto · Drill · BigQuery"
              body="Massively parallel query engines that scan terabytes without
                    flinching — the workhorse for ad-hoc analytics that doesn’t fit a
                    pre-aggregated cube."
              tags={['Impala', 'Presto', 'Drill', 'BigQuery']}
            />
            <DistrictCard
              districtNumber="35"
              district="Search Indexes"
              heading="Elasticsearch · Solr · Lucene"
              body="Inverted indexes built from batch jobs and live updates. The
                    Forest of Search Indexes — ranking, faceting, autocomplete and
                    type-ahead, all derived data shaped for read latency."
              tags={['Elasticsearch', 'Solr', 'Inverted index']}
            />
            <DistrictCard
              districtNumber="36"
              district="Iterative & Graph Processing"
              heading="GraphX · Giraph · GraphChi · Pregel"
              body="Vertex-centric computation for PageRank, community detection,
                    shortest paths and the kind of recursive analysis that breaks a
                    naive SQL plan."
              tags={['GraphX', 'Giraph', 'GraphChi', 'BSP']}
            />
            <DistrictCard
              districtNumber="37"
              district="Recommendations & ML Pipelines"
              heading="Mahout · Spark MLlib · Voldemort · Terrapin"
              body="The Delta of Machine Learning — batch-trained models served from
                    immutable read-only stores so production never has to wait on a
                    long-running training job."
              tags={['Mahout', 'MLlib', 'Voldemort', 'Read-only stores']}
            />
            <DistrictCard
              districtNumber="38"
              district="Forest of Logs"
              heading="Kafka · Kinesis · Samza · AMQP · JMS"
              body="The Great Event Stream. An append-only log as the spine of the
                    system — every change captured exactly once, replayable, fan-out
                    by partition."
              tags={['Kafka', 'Kinesis', 'Samza', 'AMQP / JMS']}
            />
            <DistrictCard
              districtNumber="39"
              district="Mountains of State"
              heading="Event Sourcing · Change Data Capture"
              body="Treating state as the projection of an event log. CDC turns a
                    database into a stream; event sourcing turns user actions into the
                    durable record everything else is derived from."
              tags={['Event sourcing', 'CDC', 'Outbox', 'Replayable state']}
            />
            <DistrictCard
              districtNumber="40"
              district="Stream Processing"
              heading="Flink · Spark Streaming · Storm · Kafka Streams"
              body="Continuous queries over the event stream. Stateful operators,
                    exactly-once delivery, and the joins that turn raw events into
                    real-time facts."
              tags={['Flink', 'Spark Streaming', 'Storm', 'Kafka Streams']}
            />
            <DistrictCard
              districtNumber="41"
              district="Sands of Time"
              heading="Windows · CEP · Watermarks · Esper · Dataflow"
              body="The Old Clock Tower. Tumbling, sliding and session windows;
                    complex event processing; watermarks that decide when a window is
                    really closed in a world without ordered time."
              tags={['Windows', 'CEP', 'Watermarks', 'Esper']}
            />
            <DistrictCard
              districtNumber="42"
              district="Materialised View Maintenance"
              heading="Stream-driven views · Incremental updates"
              body="Caches and read models updated as events arrive instead of being
                    rebuilt nightly — the stream-processing payoff that makes
                    ‘real-time dashboard’ a sustainable feature, not a heroic effort."
              tags={['Materialised views', 'Incremental', 'Read models']}
            />
            <DistrictCard
              districtNumber="43"
              district="ETL & Data Integration"
              heading="Airflow · dbt · Spark jobs · Unix tools"
              body="ETL Harbor. Pipelines that ferry data between systems, applying
                    schema evolution and quality checks — sometimes a Unix one-liner
                    is still the right answer."
              tags={['Airflow', 'dbt', 'Schema evolution', 'Unix tools']}
            />
          </div>
        </Zone>

        {/* old Hadal placeholder removed — zone now lives above with full content */}

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

