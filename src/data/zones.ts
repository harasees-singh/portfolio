/**
 * Single source of truth for the descent.
 *
 * - Each `Zone` carries metadata (id, label, telemetry, depth) plus a short
 *   teaser blurb shown on the landing page and a list of districts shown on
 *   its dedicated deep-dive route.
 * - The landing page renders just the teasers; routes #/sunlit, #/twilight,
 *   #/midnight, #/abyssal and #/hadal render the full atlas for that zone.
 */

export interface District {
  number: string;
  district: string;
  heading: string;
  body: string;
  tags: string[];
}

export interface Zone {
  id: string;
  slug: string;          // hash-route slug e.g. 'sunlit'
  label: string;
  title: string;
  teaser: string;        // one-line landing-page summary
  subtitle: string;      // long-form intro shown on the deep-dive page
  depth: string;
  temp: string;
  cta: string;           // animated link label
  /**
   * Short tech labels for the landing-page orbit animation. Keep these to
   * 4–7 entries and prefer punchy 2–9 character names so the bubbles
   * read at a glance while drifting around the title.
   */
  orbit?: readonly string[];
  districts: District[];
}

export const zones: Zone[] = [
  {
    id: 'sunlit-hero',
    slug: 'sunlit',
    label: 'Sunlit Zone',
    title: 'Charting the depths of backend architecture.',
    depth: '30m',
    temp: '22°C',
    teaser:
      'Where the map is bright and the trade routes are well-worn. The data territories I navigate every day before the pressure starts to mount.',
    subtitle:
      'The sunlit waters — where the map is bright and the trade routes are well-worn. These are the data territories I navigate every day, the districts I know by heart before the pressure starts to mount.',
    cta: 'Chart the Sunlit territories',
    orbit: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    districts: [
      {
        number: '01',
        district: 'The Relational Empire',
        heading: 'PostgreSQL · MySQL · SQL Server · Oracle · DB2',
        body: 'The capital city of every serious backend I ship. Schema design, query planning along the Declarative River, indexing strategy, and transaction semantics for long-lived OLTP workloads.',
        tags: ['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'DB2'],
      },
      {
        number: '02',
        district: 'Document Data District',
        heading: 'MongoDB · CouchDB · RethinkDB · HyperDex',
        body: 'Flexible-schema modelling along Cape JSON — denormalised reads, change streams, and TTL-driven hygiene for product surfaces that move faster than a rigid schema can keep up.',
        tags: ['MongoDB', 'CouchDB', 'RethinkDB', 'HyperDex'],
      },
      {
        number: '03',
        district: 'Column-Family District',
        heading: 'HBase · Cassandra',
        body: 'Wide-row stores for analytics and time-series at scale. Partition keys that survive growth, tunable consistency, and compaction strategies that keep tail latency honest.',
        tags: ['HBase', 'Cassandra'],
      },
      {
        number: '04',
        district: 'Key-Value District',
        heading: 'Redis · Aerospike · Riak · Voldemort · Berkeley DB',
        body: 'Hot paths, rate limiters, distributed locks, idempotency keys, and the cache layer that quietly absorbs an order of magnitude of traffic before anyone notices.',
        tags: ['Redis', 'Aerospike', 'Riak', 'Voldemort', 'Berkeley DB'],
      },
    ],
  },

  {
    id: 'twilight',
    slug: 'twilight',
    label: 'Twilight Zone',
    title: 'Storage, retrieval and the wire formats between them',
    depth: '200m',
    temp: '8°C',
    teaser:
      'How bytes are actually stored, found again, and shipped across the wire. Storage engines, indexes, encodings, RPC.',
    subtitle:
      'Light dims, focus shifts. The question stops being “which engine?” and becomes “how does it actually store the bytes, find them again, and ship them across the wire?”. Storage engines, access patterns and encodings — the choices that decide what an application is fast and slow at long before the first feature ships.',
    cta: 'Descend into the Twilight',
    orbit: ['Thrift', 'Parquet', 'gRPC'],
    districts: [
      {
        number: '05',
        district: 'Land of the B-Trees',
        heading: 'PostgreSQL · MySQL · SQL Server · Oracle',
        body: 'The Republic of Transaction Processing. Mature OLTP engines built on B-tree indexes, MVCC and write-ahead logs — the bedrock under most production traffic I work with.',
        tags: ['B-Trees', 'MVCC', 'WAL', 'Secondary Indexes'],
      },
      {
        number: '06',
        district: 'Log-Structured Storage',
        heading: 'Cassandra · HBase · RocksDB · LevelDB · Lucene',
        body: 'The Way of the Log. LSM-tree engines that turn random writes into sequential ones — BigTable Tablelands, the Highlands of Search and the Bay of Embedded Storage Engines.',
        tags: ['LSM Trees', 'SSTables', 'Compaction', 'Bloom Filters'],
      },
      {
        number: '07',
        district: 'Forest of Secondary Indexes',
        heading: 'HyperDex · Document & term-partitioned indexes · Multi-column',
        body: 'The other half of every query plan. Composite, covering and partial indexes; full-text indexes; and the cost model that decides whether the planner reaches for them at all.',
        tags: ['Composite', 'Covering', 'Partial', 'Full-text'],
      },
      {
        number: '08',
        district: 'Valley of In-Memory Storage',
        heading: 'Redis · Memcached · Materialised Views',
        body: 'Where everything fits in RAM and latency stops being negotiable. Caches, in-memory grids and the precomputed views that let the serving tier answer in microseconds.',
        tags: ['In-memory', 'Caches', 'Hot keys', 'Materialised Views'],
      },
      {
        number: '09',
        district: 'Kingdom of Analytics',
        heading: 'Vertica · ParAccel/Redshift · Parquet · Star Schemas',
        body: 'The Realm of Data Warehouses — columnar storage, the Mountains of Column Storage and the Star Schema Monument that anchors every BI dashboard worth trusting.',
        tags: ['Columnar', 'Vertica', 'Redshift', 'Parquet', 'Star Schema'],
      },
      {
        number: '10',
        district: 'Bulk Storage Tundra',
        heading: 'CSV · Parquet · Avro · SQL dumps · Log files',
        body: 'The flat-file frontier. The formats data lives in when it sits between systems — cheap to write, cheap to scan, schema-on-read when you finally need it.',
        tags: ['CSV', 'Parquet', 'Avro', 'SQL dumps'],
      },
      {
        number: '11',
        district: 'Coast of Textual Encodings',
        heading: 'JSON · XML · YAML · CSV',
        body: 'Human-readable wire formats. JSON for almost everything that crosses a service boundary, XML where legacy contracts demand it, YAML for the configuration that humans actually read.',
        tags: ['JSON', 'XML', 'YAML', 'Schema-on-read'],
      },
      {
        number: '12',
        district: 'Gulf of Binary Encodings',
        heading: 'Protocol Buffers · Thrift · Avro · MessagePack',
        body: 'Compact, schema-driven formats for high-throughput RPC and event pipelines. Forward- and backward-compatible field changes that don\u2019t break the consumer fleet on deploy day.',
        tags: ['Protocol Buffers', 'Thrift', 'Avro', 'Schema evolution'],
      },
      {
        number: '13',
        district: 'Bay of REST',
        heading: 'REST · JSON over HTTP · Swagger / OpenAPI',
        body: 'The default trade route. Resource-oriented HTTP APIs with machine-readable contracts, paged collections, idempotent verbs and the cache-control headers that let CDNs do their job.',
        tags: ['REST', 'OpenAPI', 'HATEOAS', 'Cacheable'],
      },
      {
        number: '14',
        district: 'People’s Republic of RPC',
        heading: 'gRPC · Thrift · Protobuf · WSDL/SOAP',
        body: 'When services need stricter contracts than HTTP can carry on its own. Strongly-typed stubs, streaming bidirectional channels and a careful eye on the “illusion of transparent RPC”.',
        tags: ['gRPC', 'Thrift', 'SOAP', 'Streaming'],
      },
      {
        number: '15',
        district: 'Mountains of Message Passing',
        heading: 'Akka · Erlang/OTP · Actors · Mailboxes',
        body: 'Asynchronous, location-transparent message passing for systems that have to keep working through partial failure. Actors as the unit of state and concurrency.',
        tags: ['Actors', 'Akka', 'Erlang/OTP', 'Mailboxes'],
      },
      {
        number: '16',
        district: 'Schema Evolution & Compatibility',
        heading: 'Schema-on-write vs read · Backward / forward compat',
        body: 'Schemas as a contract that survives deploys. Adding optional fields, never reusing tags, and keeping old consumers working while the rest of the fleet moves on.',
        tags: ['Backward compat', 'Forward compat', 'Schema registry'],
      },
    ],
  },

  {
    id: 'midnight',
    slug: 'midnight',
    label: 'Midnight Zone',
    title: 'Replication and partitioning: how the system stays one system',
    depth: '1,500m',
    temp: '4°C',
    teaser:
      'No sunlight reaches here. The dataset is too large for one machine and too important to live on just one — replicate to survive failure, partition to spread the load.',
    subtitle:
      'No sunlight reaches here. The dataset is too large to fit on one machine and too important to live on just one. Two interlocking strategies keep it coherent — replicate the data so any node can fail, partition it so no node has to hold all of it.',
    cta: 'Map the Midnight currents',
    orbit: ['Cassandra', 'MongoDB', 'Elasticsearch', 'etcd'],
    districts: [
      {
        number: '17',
        district: 'Single-Leader Replication',
        heading: 'PostgreSQL · MySQL · SQL Server · Oracle · MongoDB',
        body: 'The Logical and Physical Coasts. One node owns the writes, followers catch up — simple to reason about until the Pit of Failover opens and you have to decide what \u2018caught up\u2019 really means.',
        tags: ['Primary/Replica', 'Sync vs async', 'Failover', 'Replication lag'],
      },
      {
        number: '18',
        district: 'Multi-Leader Replication',
        heading: 'CouchDB · Etherpad · Google Docs · Calendar Sync',
        body: 'The Replication-Lag Highway and the Pinnacles of Conflict Resolution. Several nodes accept writes; reconciling them is half engineering and half product policy.',
        tags: ['Multi-master', 'Conflict resolution', 'Last-write-wins', 'Custom merge'],
      },
      {
        number: '19',
        district: 'Leaderless Replication',
        heading: 'Cassandra · Riak · Voldemort',
        body: 'Quorum Harbor on the Eventual Consistency Boulevard. Reads and writes hit any replica; quorums and read-repair stitch the system back together when nodes diverge.',
        tags: ['Quorums (R/W/N)', 'Read repair', 'Hinted handoff', 'Anti-entropy'],
      },
      {
        number: '20',
        district: 'Hash Partitioning',
        heading: 'Cassandra · Voldemort · MongoDB · RethinkDB',
        body: 'A consistent hash spreads keys evenly across nodes — even load out of the box, but range scans become a long swim across every shard.',
        tags: ['Consistent hashing', 'Even load', 'No range scans'],
      },
      {
        number: '21',
        district: 'Key-Range Partitioning',
        heading: 'HBase · Bigtable · MongoDB (sharded)',
        body: 'Keys carved into ordered ranges. Range scans are cheap, but hot keys can capsize a single shard if the access pattern isn\u2019t shaped around the partition key.',
        tags: ['Ordered keys', 'Range scans', 'Hot-spot risk'],
      },
      {
        number: '22',
        district: 'Secondary Indexes',
        heading: 'Document-partitioned (local) · Term-partitioned (global) · Elasticsearch · Solr',
        body: 'The hardest part of partitioned storage. Local indexes are cheap to write, expensive to query; global indexes flip the trade-off and bring their own consistency questions.',
        tags: ['Local indexes', 'Global indexes', 'Elasticsearch', 'Solr'],
      },
      {
        number: '23',
        district: 'Rebalancing',
        heading: 'Virtual nodes · Dynamic partitioning · Hand-off',
        body: 'When a node leaves or joins, partitions migrate. Vnodes, pre-split tablets, and hinted hand-off make the move invisible to clients who don\u2019t get to know the topology.',
        tags: ['Vnodes', 'Tablet split', 'Hinted hand-off'],
      },
      {
        number: '24',
        district: 'Request Routing',
        heading: 'ZooKeeper · etcd · Smart clients · Coordinator nodes',
        body: 'Something has to know which partition lives where. Membership services, gossip, and routing tiers turn the cluster from a pile of nodes into a queryable system.',
        tags: ['ZooKeeper', 'etcd', 'Gossip', 'Smart routing'],
      },
    ],
  },

  {
    id: 'exploration',
    slug: 'abyssal',
    label: 'Abyssal Zone',
    title: 'Consistency, consensus and the cost of agreement',
    depth: '2,250m',
    temp: '3°C',
    teaser:
      'Replicas have to agree, transactions have to span machines, and the system needs a single answer about what really happened — and in what order.',
    subtitle:
      'Below the warehouses the terrain folds inward. Replicas have to agree, transactions have to span machines, and the system needs a single answer about “what really happened, and in what order”. Mount Consensus rises out of this trench — every uniqueness constraint and leader election in the layers above eventually ends up here.',
    cta: 'Reach Mount Consensus',
    orbit: ['etcd', 'ZooKeeper', 'Kubernetes'],
    districts: [
      {
        number: '25',
        district: 'Forest of Consistency Models',
        heading: 'Linearizable · Sequential · Causal · Eventual',
        body: 'The dense interior. Choosing the weakest model the product can tolerate, then defending that choice when someone asks why the UI \u2018showed the old number for a second\u2019.',
        tags: ['Linearizability', 'Sequential', 'Causal', 'Eventual'],
      },
      {
        number: '26',
        district: 'Bay of Causality',
        heading: 'Vector clocks · Lamport timestamps · Happens-before',
        body: 'Tracking what could have caused what across nodes. Where \u2018before\u2019 and \u2018after\u2019 stop being properties of the wall clock and start being properties of the system.',
        tags: ['Vector clocks', 'Lamport', 'Causal order', 'HLC'],
      },
      {
        number: '27',
        district: 'Pinnacles of Conflict Resolution',
        heading: 'CRDTs · Operational Transform · Application merges',
        body: 'The high country where concurrent writes finally have to agree. Convergent data types for collaborative editing, presence, counters, and live cursors that survive partitions.',
        tags: ['CRDTs', 'OT', 'G-Counters', 'OR-Sets'],
      },
      {
        number: '28',
        district: 'Mount Consensus',
        heading: 'Paxos · Raft · Zab · Total Order Broadcast',
        body: 'The peak. Every membership change, every uniqueness constraint, every leader election eventually reduces to consensus — even when the system pretends otherwise.',
        tags: ['Paxos', 'Raft', 'Zab', 'Total order broadcast'],
      },
      {
        number: '29',
        district: 'Membership & Coordination',
        heading: 'ZooKeeper · etcd · Failure Detectors',
        body: 'Service registries, distributed locks, leader election, config propagation — the small but unavoidable pieces that need a strong consistency model underneath them.',
        tags: ['ZooKeeper', 'etcd', 'Locks', 'Leader election'],
      },
      {
        number: '30',
        district: 'Distributed Transactions',
        heading: 'Two-phase commit · Sagas · XA',
        body: 'When one write must touch many partitions or services. 2PC for short, blocking transactions; sagas with compensations for the long-running ones that can\u2019t hold a lock.',
        tags: ['2PC', 'Sagas', 'Compensations', 'XA'],
      },
      {
        number: '31',
        district: 'Linearizability & Global Constraints',
        heading: 'Compare-and-set · Increment-and-get · Uniqueness',
        body: 'The strict consistency island. Read-write registers that behave as if there were one, atomic operations across replicas, and the uniqueness guarantees the product layer always assumes.',
        tags: ['Linearizability', 'CAS', 'Uniqueness', 'Strong consistency'],
      },
    ],
  },

  {
    id: 'logs',
    slug: 'hadal',
    label: 'Hadal Zone',
    title: 'Batch, streams and the great event log',
    depth: '6,800m',
    temp: '2°C',
    teaser:
      'The deepest pressure. Most production data isn’t the source of truth — it’s a derivative, reshaped from raw events by batch jobs and stream processors.',
    subtitle:
      'The deepest pressure. Most production data isn’t the source of truth — it’s a derivative. Search indexes, recommendation models, materialised views, training datasets. The Hadal trench is where raw events feed the Forest of Logs and the Great Event Stream, then get reshaped into the answers the surface actually queries.',
    cta: 'Brave the Hadal trench',
    orbit: ['Kafka', 'Spark', 'Flink', 'Airflow'],
    districts: [
      {
        number: '32',
        district: 'Distributed Filesystems',
        heading: 'HDFS · S3 · GCS · Object stores',
        body: 'The bedrock under every batch pipeline. Cheap, durable storage that scales horizontally and lets compute be brought to the data rather than the other way around.',
        tags: ['HDFS', 'S3', 'Object storage'],
      },
      {
        number: '33',
        district: 'Batch Processing',
        heading: 'MapReduce · Spark · Hive · Tez · Pig',
        body: 'Where MapReduce workflows still live and Spark replaces them. Batch jobs that turn raw event lakes into the tables analysts and downstream services depend on.',
        tags: ['MapReduce', 'Spark', 'Hive', 'Tez'],
      },
      {
        number: '34',
        district: 'MPP Databases & SQL on Anything',
        heading: 'Impala · Presto · Drill · BigQuery',
        body: 'Massively parallel query engines that scan terabytes without flinching — the workhorse for ad-hoc analytics that doesn\u2019t fit a pre-aggregated cube.',
        tags: ['Impala', 'Presto', 'Drill', 'BigQuery'],
      },
      {
        number: '35',
        district: 'Search Indexes',
        heading: 'Elasticsearch · Solr · Lucene',
        body: 'Inverted indexes built from batch jobs and live updates. The Forest of Search Indexes — ranking, faceting, autocomplete and type-ahead, all derived data shaped for read latency.',
        tags: ['Elasticsearch', 'Solr', 'Inverted index'],
      },
      {
        number: '36',
        district: 'Iterative & Graph Processing',
        heading: 'GraphX · Giraph · GraphChi · Pregel',
        body: 'Vertex-centric computation for PageRank, community detection, shortest paths and the kind of recursive analysis that breaks a naive SQL plan.',
        tags: ['GraphX', 'Giraph', 'GraphChi', 'BSP'],
      },
      {
        number: '37',
        district: 'Recommendations & ML Pipelines',
        heading: 'Mahout · Spark MLlib · Voldemort · Terrapin',
        body: 'The Delta of Machine Learning — batch-trained models served from immutable read-only stores so production never has to wait on a long-running training job.',
        tags: ['Mahout', 'MLlib', 'Voldemort', 'Read-only stores'],
      },
      {
        number: '38',
        district: 'Forest of Logs',
        heading: 'Kafka · Kinesis · Samza · AMQP · JMS',
        body: 'The Great Event Stream. An append-only log as the spine of the system — every change captured exactly once, replayable, fan-out by partition.',
        tags: ['Kafka', 'Kinesis', 'Samza', 'AMQP', 'JMS'],
      },
      {
        number: '39',
        district: 'Mountains of State',
        heading: 'Event Sourcing · Change Data Capture',
        body: 'Treating state as the projection of an event log. CDC turns a database into a stream; event sourcing turns user actions into the durable record everything else is derived from.',
        tags: ['Event sourcing', 'CDC', 'Outbox', 'Replayable state'],
      },
      {
        number: '40',
        district: 'Stream Processing',
        heading: 'Flink · Spark Streaming · Storm · Kafka Streams',
        body: 'Continuous queries over the event stream. Stateful operators, exactly-once delivery, and the joins that turn raw events into real-time facts.',
        tags: ['Flink', 'Spark Streaming', 'Storm', 'Kafka Streams'],
      },
      {
        number: '41',
        district: 'Sands of Time',
        heading: 'Windows · CEP · Watermarks · Esper · Dataflow',
        body: 'The Old Clock Tower. Tumbling, sliding and session windows; complex event processing; watermarks that decide when a window is really closed in a world without ordered time.',
        tags: ['Windows', 'CEP', 'Watermarks', 'Esper'],
      },
      {
        number: '42',
        district: 'Materialised View Maintenance',
        heading: 'Stream-driven views · Incremental updates',
        body: 'Caches and read models updated as events arrive instead of being rebuilt nightly — the stream-processing payoff that makes \u2018real-time dashboard\u2019 a sustainable feature, not a heroic effort.',
        tags: ['Materialised views', 'Incremental', 'Read models'],
      },
      {
        number: '43',
        district: 'ETL & Data Integration',
        heading: 'Airflow · dbt · Spark jobs · Unix tools',
        body: 'ETL Harbor. Pipelines that ferry data between systems, applying schema evolution and quality checks — sometimes a Unix one-liner is still the right answer.',
        tags: ['Airflow', 'dbt', 'Schema evolution', 'Unix tools'],
      },
    ],
  },
];

export const zonesBySlug: Record<string, Zone> = Object.fromEntries(
  zones.map((z) => [z.slug, z])
);
