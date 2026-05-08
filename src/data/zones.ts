/**
 * Single source of truth for the descent.
 *
 * Each `Zone` is a depth band of the practice (relational data, storage
 * engines, replication, consensus, derived data). Within a zone, each
 * `Chapter` frames a single design *problem* and tells the story of how it
 * is approached at the architectural level — HLD/LLD concepts, trade-offs,
 * and the discipline that keeps the answer honest.
 *
 * The narrative deliberately avoids naming specific tools. Tools live in
 * the chapter's `tags` array and are rendered as link pills under the
 * narrative; the prose above stays at the level of ideas. This keeps the
 * descent readable as a story instead of a tech inventory.
 */

export interface Chapter {
  /** Two-digit zero-padded chapter number, used as a timeline badge. */
  number: string;
  /**
   * The conceptual problem this chapter frames. One sentence, no
   * specific tools — that is what the tag pills are for.
   */
  problem: string;
  /**
   * The narrative answer — 2 to 5 sentences explaining how the problem is
   * approached at the system-design level. Prefer concept names
   * (replication, partitioning, MVCC, consensus, sagas) over product
   * names (Postgres, Kafka, etcd) so the prose generalises.
   */
  narrative: string;
  /**
   * Tools and concepts referenced under the chapter. Each becomes a pill
   * in the deep-dive view; entries that match `techLinks` get an
   * external-link arrow and link out to the project homepage.
   */
  tags: readonly string[];
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
  chapters: Chapter[];
}

export const zones: Zone[] = [
  {
    id: 'sunlit-hero',
    slug: 'sunlit',
    label: 'Sunlit Zone',
    title: 'Charting the depths of databases',
    depth: '30m',
    temp: '22°C',
    teaser:
      'Where the map is bright and the trade routes are well-worn. The data territories I navigate every day before the pressure starts to mount.',
    subtitle:
      'The sunlit waters — where the map is bright and the trade routes are well-worn. These are the data territories I navigate every day, the districts I know by heart before the pressure starts to mount.',
    cta: 'Chart the Sunlit territories',
    orbit: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    chapters: [
      {
        number: '01',
        problem: 'When the data has shape, and the shape matters.',
        narrative:
          'The first question on a serious backend is rarely "what tool?" — it is "what shape?". When the domain has clear entities relating to each other, when correctness across rows matters more than ingestion speed, when stale reads can break invariants, the answer is almost always a row store with declarative queries. The work then becomes the things people forget to brag about: schema design that survives a year of feature requests, indexes chosen against the actual query plan rather than what feels right, and transactions that hold the system\u2019s integrity together when three things are happening at once.',
        tags: ['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'DB2'],
      },
      {
        number: '02',
        problem: 'When the shape is still being negotiated.',
        narrative:
          'Some product surfaces move faster than the schema can keep up with. Fields you will need next month do not exist yet, the document structure varies per record, and the read pattern is "fetch this whole thing by id and render it". The trade-off is familiar: you give up referential integrity at the database layer to get a faster path from idea to ship. The discipline that keeps it from rotting is denormalising on purpose, watching change streams to keep derived state honest, and being clear about which fields really need to be indexed.',
        tags: ['MongoDB', 'CouchDB', 'RethinkDB', 'HyperDex'],
      },
      {
        number: '03',
        problem: 'When the rows outnumber the keys.',
        narrative:
          'Past a certain scale the question shifts from "how do I store this row?" to "how do I keep one shard from holding all of them?". Wide-column stores answer it by making the partition key the unit of physics — every read, write, and replica boundary is decided by it. Choose it well and the system grows linearly; choose it badly and one tablet quietly becomes the bottleneck. Tunable consistency and compaction strategies let you trade tail latency for durability where the product can afford it.',
        tags: ['HBase', 'Cassandra'],
      },
      {
        number: '04',
        problem: 'When the answer needs to be cheap, fast, and forgettable.',
        narrative:
          'Most of the traffic that hits a serious system has no business reaching the database. Rate counters, idempotency keys, distributed locks, hot reads — every one of them is a key looking for a value, and every one is fine being slightly stale. The cache layer is what quietly absorbs an order of magnitude of load before anyone notices. The discipline lives in the things around it: TTLs that match the value\u2019s actual freshness, eviction strategies that do not surprise you, and access patterns like cache-aside or write-through that match how the data is really updated.',
        tags: ['Redis', 'Aerospike', 'Riak', 'Voldemort', 'Berkeley DB', 'Memcached'],
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
      'Light dims, focus shifts. The question stops being "which engine?" and becomes "how does it actually store the bytes, find them again, and ship them across the wire?". Storage engines, access patterns and encodings — the choices that decide what an application is fast and slow at long before the first feature ships.',
    cta: 'Descend into the Twilight',
    orbit: ['Thrift', 'Parquet', 'gRPC'],
    chapters: [
      {
        number: '05',
        problem: 'How a row gets to disk and back, fast.',
        narrative:
          'Beneath every relational database there is a storage engine making one bet: writes will land in random places, but reads can be turned into a tree walk. Balanced trees keep lookups logarithmic; multi-version concurrency control lets readers and writers stop fighting; the write-ahead log makes a crash mid-update survivable. Most production OLTP traffic in the world rides on some variation of this choice.',
        tags: ['B-Trees', 'MVCC', 'WAL', 'Secondary Indexes'],
      },
      {
        number: '06',
        problem: 'When writes outnumber reads, and disk is the bottleneck.',
        narrative:
          'If the workload is write-heavy and the disk is spinning rust or flash with limited endurance, random-write patterns destroy throughput. Log-structured merge trees flip the contract: every write goes to an in-memory buffer first, gets sorted on its way to disk, and is later compacted in the background. Reads pay a small cost — they may consult several files — but bloom filters keep that cost bounded. The shape of the write pattern, not the read pattern, is what makes the engine fast.',
        tags: ['LSM Trees', 'SSTables', 'Compaction', 'Bloom Filters'],
      },
      {
        number: '07',
        problem: 'How the planner decides which index to use, and why it sometimes refuses.',
        narrative:
          'Every query plan is a negotiation: the planner has statistics about the data, hints about the indexes, and a cost model that decides whether scanning the table beats reading the index plus the rows it points at. Composite indexes win when filters arrive together; covering indexes win when the query never needs the row itself; partial indexes shrink the structure to only the slice that is actually queried. The fastest indexes are usually the ones you do not need to reach for.',
        tags: ['Composite', 'Covering', 'Partial', 'Full-text'],
      },
      {
        number: '08',
        problem: 'When latency is sub-millisecond or it does not ship.',
        narrative:
          'Some surfaces — a leaderboard, a session lookup, a feature flag — cannot tolerate a network hop to a database. Keeping the hot working set in RAM and serving from memory turns latency from milliseconds into microseconds, and the trade-off is durability: the cost of recovery has to be paid up front, usually with snapshots and an append-only log. Materialised views push the same idea further: precompute the answer once, serve it many times, accept the staleness window the product can afford.',
        tags: ['In-memory', 'Caches', 'Hot keys', 'Materialised Views'],
      },
      {
        number: '09',
        problem: 'When the question is "sum of these millions of rows", not "fetch this one".',
        narrative:
          'Analytical workloads want the opposite of OLTP: a few columns out of a wide table, scanned across millions of rows, with predicate pushdown doing most of the work. Columnar storage answers that exactly — bytes for the same column live next to each other, compress beautifully because they share a type, and skip whole row groups when the predicate rules them out. A star schema on top of that turns every BI dashboard into joins the optimiser actually understands.',
        tags: ['Columnar', 'Vertica', 'Redshift', 'Parquet', 'Star Schema'],
      },
      {
        number: '10',
        problem: 'When data is sitting between systems, not being queried.',
        narrative:
          'Not every byte has to live in a database. The data passing between batch jobs, into a warehouse, out to a partner, or just being archived needs different properties: cheap to write, cheap to scan in order, schema declared on read instead of write. Flat files in well-known formats are the lingua franca of every pipeline that crosses an organisational boundary.',
        tags: ['CSV', 'Parquet', 'Avro', 'SQL dumps'],
      },
      {
        number: '11',
        problem: 'How services agree on what bytes mean, in human-readable form.',
        narrative:
          'The wire format between two services is also a contract between two teams. Human-readable encodings make that contract auditable — you can paste a payload into a chat thread and someone three offices away will know what it says — at the cost of size and parse speed. JSON wins almost every default; XML survives where regulators or legacy contracts demand it; YAML wins config because humans actually read it.',
        tags: ['JSON', 'XML', 'YAML', 'Schema-on-read'],
      },
      {
        number: '12',
        problem: 'When the wire matters and bytes are billed.',
        narrative:
          'Once the message rate hits a real number, parsing JSON becomes a measurable cost — and so does shipping fields you do not need. Schema-driven binary formats encode just the field tags and values, in a layout the consumer already knows. The hard part is not the encoder; it is keeping forward and backward compatibility honest as fields come and go, so adding an optional field today does not break a consumer that has not redeployed yet.',
        tags: ['Protocol Buffers', 'Thrift', 'Avro', 'Schema evolution'],
      },
      {
        number: '13',
        problem: 'The default trade route between services.',
        narrative:
          'Most service-to-service traffic is fine over plain HTTP if the contract is honest about it. Resource-shaped URLs, idempotent verbs, paged collections, machine-readable schemas, cache-control headers that let intermediaries do their job — none of it is glamorous, all of it adds up to APIs that survive a re-platform without their callers noticing.',
        tags: ['REST', 'OpenAPI', 'HATEOAS', 'Cacheable'],
      },
      {
        number: '14',
        problem: 'When HTTP semantics are not strict enough to ship safely.',
        narrative:
          'Some service boundaries need a stricter contract than HTTP can carry on its own — same-language client stubs, streaming bidirectional channels, deadlines that propagate, retries the framework knows are safe. The trap is what the literature calls the "illusion of transparent RPC": remote calls fail in modes local calls do not, and treating them as the same thing is how systems get brittle.',
        tags: ['gRPC', 'Thrift', 'SOAP', 'Streaming'],
      },
      {
        number: '15',
        problem: 'How a system keeps working through partial failure.',
        narrative:
          'Once the system spans more than one machine, every call is a chance for the other end to be slow, dead, or coming back. Message passing reframes the problem: state lives inside an actor, the only way to mutate it is to send a message, and the mailbox absorbs the difference between "still alive" and "about to be". Concurrency stops being about locks and starts being about how messages arrive.',
        tags: ['Actors', 'Akka', 'Erlang/OTP', 'Mailboxes'],
      },
      {
        number: '16',
        problem: 'Shipping a schema change without breaking the consumer fleet.',
        narrative:
          'A schema is a contract that has to survive deploys staggered across a fleet of services nobody co-ordinates with. The rules are unromantic and absolute: never repurpose a tag, treat new fields as optional, keep the old reader working until every consumer has caught up, and accept that the wire is forever even when your code is not. A registry that can answer "is this schema compatible with that one?" turns this from heroics into hygiene.',
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
    chapters: [
      {
        number: '17',
        problem: 'One node owns the writes. What happens when it does not?',
        narrative:
          'The simplest model: one primary accepts writes, followers stream the change log and apply it. It is easy to reason about until the primary disappears and you have to decide what "caught up" really meant — synchronous replication blocks writes until at least one follower has the change, asynchronous lets them through and accepts the chance that a few will be lost on failover. Either way, the failover itself is the dangerous moment, and most outages happen there, not on the primary.',
        tags: ['Primary/Replica', 'Sync vs async', 'Failover', 'Replication lag'],
      },
      {
        number: '18',
        problem: 'When several nodes need to accept writes at once.',
        narrative:
          'Multiple writers means multiple histories, and multiple histories means concurrent edits to the same value. Reconciling them is half engineering — last-write-wins, vector clocks, application merges — and half product policy: which writer wins the conflict on a shared shopping cart, and what does the user see while you decide? Collaborative editors and offline-first apps live and die by the answer.',
        tags: ['Multi-master', 'Conflict resolution', 'Last-write-wins', 'Custom merge'],
      },
      {
        number: '19',
        problem: 'When no single node should be in charge.',
        narrative:
          'If every replica accepts writes and reads, the system has no single point of failure — but also no single source of truth in the moment a partition heals. Quorums make eventual consistency tunable: pick reads plus writes greater than the replica count and you get read-your-writes; pick lower and you get availability through anything short of a region fire. Read-repair and anti-entropy stitch divergence back together in the background.',
        tags: ['Quorums (R/W/N)', 'Read repair', 'Hinted handoff', 'Anti-entropy'],
      },
      {
        number: '20',
        problem: 'How to spread keys evenly across a cluster you will grow over time.',
        narrative:
          'Hashing the key spreads load uniformly without anyone needing to know what is hot — the price is that range scans now have to fan out across every shard. Consistent hashing makes the rebalance when you add or remove nodes proportional to the change rather than O(n), so a node joining does not break a third of the cluster\u2019s traffic to give it work.',
        tags: ['Consistent hashing', 'Even load', 'No range scans'],
      },
      {
        number: '21',
        problem: 'When the access pattern actually wants neighbouring keys together.',
        narrative:
          'Time-series, alphabetical lookups, anything where the next key is likely to be near the last — those workloads punish hash partitioning and reward range partitioning. Cheap range scans, easy time-bucketing, but a single hot key (the partition for "today") can capsize a shard if the access pattern is not shaped around it. The partition key is now part of the product design, not just the schema.',
        tags: ['Ordered keys', 'Range scans', 'Hot-spot risk'],
      },
      {
        number: '22',
        problem: 'How to find a row when the partition key is not what you are filtering by.',
        narrative:
          'The hardest part of partitioned storage. A document-partitioned (local) index lives next to its data so writes are cheap, but a query across the whole cluster has to ask every shard. A term-partitioned (global) index flips the trade-off: queries are localised but every write has to update an index on a different shard. Picking between them is mostly an honest answer to which the workload does more of.',
        tags: ['Local indexes', 'Global indexes', 'Elasticsearch', 'Solr'],
      },
      {
        number: '23',
        problem: 'Adding and removing nodes without anyone noticing.',
        narrative:
          'Clusters expand and contract — nodes fail, capacity grows, new regions come online. Rebalancing has to move data without making clients aware of which shard they are talking to. Virtual nodes split the unit of movement small enough to amortise; pre-split tablets avoid the expensive "one node owns everything new" phase; hinted hand-off keeps writes flowing while a missing node\u2019s replicas catch up.',
        tags: ['Vnodes', 'Tablet split', 'Hinted hand-off'],
      },
      {
        number: '24',
        problem: 'Something has to know which partition lives where.',
        narrative:
          'A cluster without a routing layer is just a pile of machines that happen to share storage. Membership services track who is alive, gossip propagates topology changes without a central bottleneck, and either a smart client or a thin coordinator turns the abstract "partition for this key" into a concrete "this address right now". The routing layer is also where you discover, painfully, what your tail latency really is.',
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
      'Below the warehouses the terrain folds inward. Replicas have to agree, transactions have to span machines, and the system needs a single answer about "what really happened, and in what order". Mount Consensus rises out of this trench — every uniqueness constraint and leader election in the layers above eventually ends up here.',
    cta: 'Reach Mount Consensus',
    orbit: ['etcd', 'ZooKeeper', 'Kubernetes'],
    chapters: [
      {
        number: '25',
        problem: 'How current is "current"? Pick the weakest model the product can defend.',
        narrative:
          'The strongest consistency model means the system behaves as if there is only one copy of the data — easy to reason about, expensive to deliver. Sequential, causal, and eventual relax the contract in ways the product can sometimes tolerate, and "sometimes" is doing all the work. The job is choosing the weakest model the product layer can live with, then defending the choice when someone asks why the UI "showed the old number for a second".',
        tags: ['Linearizability', 'Sequential', 'Causal', 'Eventual'],
      },
      {
        number: '26',
        problem: 'What "happened before" really means in a distributed system.',
        narrative:
          'The wall clock is a lie across more than one machine. Vector clocks, Lamport timestamps, and the happens-before relation move "before" and "after" from being properties of time to being properties of message exchange — A happened before B if there is a chain of messages connecting them. Once you have causality, you have the foundation for conflict detection, partial ordering, and most of the consistency models above.',
        tags: ['Vector clocks', 'Lamport', 'Causal order', 'HLC'],
      },
      {
        number: '27',
        problem: 'When two writers update the same value at the same time, who wins?',
        narrative:
          'The most defensible answer is: do not make a person decide on the hot path. Convergent and commutative replicated data types are designed so that the merge is associative — apply edits in any order on any replica and the result is the same. Counters that always grow, sets that only add, registers tagged with their writer\u2019s identity. The harder cases — collaborative text, calendar invites — fall back to operational transform or product-specific rules.',
        tags: ['CRDTs', 'OT', 'G-Counters', 'OR-Sets'],
      },
      {
        number: '28',
        problem: 'Getting a fleet of machines to agree on a single value, despite some of them lying or going dark.',
        narrative:
          'Sooner or later every distributed system needs the cluster to agree on one thing — who the leader is, what the next entry in the log is, whether this transaction committed. Consensus protocols solve it in the presence of crashes and network partitions, with majority quorums as the only thing keeping safety honest. Every uniqueness constraint and leader election in the layers above eventually reduces to this, even when the system pretends it does not.',
        tags: ['Paxos', 'Raft', 'Zab', 'Total order broadcast'],
      },
      {
        number: '29',
        problem: 'The small unavoidable pieces every distributed system needs.',
        narrative:
          'Service registries, distributed locks, leader election, configuration propagation — the unglamorous primitives that nobody designs around but everybody assumes. They share a common requirement: a strongly consistent store underneath, because two services believing they are both the leader is the worst kind of bug. A coordinator cluster with a few nodes, run boringly, removes a whole class of problems above it.',
        tags: ['ZooKeeper', 'etcd', 'Locks', 'Leader election'],
      },
      {
        number: '30',
        problem: 'When one logical operation has to touch many machines.',
        narrative:
          'Sometimes a write is not really one write — it is a transfer between two accounts on different shards, an order that updates inventory and dispatches a payment, a sign-up that creates rows in three services. Two-phase commit gets the strong guarantee at the cost of blocking on a coordinator. Sagas trade strong guarantees for liveness: split the work into local transactions, define a compensation for each, and accept that the system passes through inconsistent intermediate states the product is designed to tolerate.',
        tags: ['2PC', 'Sagas', 'Compensations', 'XA'],
      },
      {
        number: '31',
        problem: 'When the product layer assumes there is one copy of the world.',
        narrative:
          'Compare-and-set, increment-and-get, uniqueness constraints — the API surface of every business rule that says "no two users can claim the same handle, ever". These are the points where the system cannot fall back to eventual consistency. They live behind the strongest consistency model the architecture can afford, usually backed by a small consensus cluster, and the cost shows up as latency you trade for correctness.',
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
      'The deepest pressure. Most production data isn\u2019t the source of truth — it\u2019s a derivative. Search indexes, recommendation models, materialised views, training datasets. The Hadal trench is where raw events feed the Forest of Logs and the Great Event Stream, then get reshaped into the answers the surface actually queries.',
    cta: 'Brave the Hadal trench',
    orbit: ['Kafka', 'Spark', 'Flink', 'Airflow'],
    chapters: [
      {
        number: '32',
        problem: 'Storage that scales horizontally and lets compute come to the data.',
        narrative:
          'Once the dataset does not fit on one machine, moving it to wherever you want to run a job becomes the bottleneck. Distributed object stores invert the relationship — the data sits on cheap, replicated storage, and the compute is scheduled to run next to its share of bytes. This is the bedrock under every batch pipeline that scans terabytes without flinching.',
        tags: ['HDFS', 'S3', 'Object storage'],
      },
      {
        number: '33',
        problem: 'Turning a raw event lake into the tables everyone else queries.',
        narrative:
          'Batch jobs are the unglamorous workhorse of every data platform — they run nightly, they take hours, they produce the joined and aggregated tables that analysts and downstream services treat as ground truth. The shift in this layer over the last decade has been from disk-bound map-reduce stages to in-memory DAGs that can hold whole intermediate results, but the discipline is unchanged: idempotent stages, deterministic outputs, and the patience to design for re-runnability from day one.',
        tags: ['MapReduce', 'Spark', 'Hive', 'Tez'],
      },
      {
        number: '34',
        problem: 'Asking ad-hoc questions of terabyte-scale tables without flinching.',
        narrative:
          'Massively parallel query engines fan a SQL plan out across hundreds of workers, scan only the columns the predicate touches, and stitch the result back together. They cost more per query than a pre-aggregated cube but they answer questions you did not think to pre-aggregate for. The trick is the same one that makes columnar storage work upstream: bring the predicate as close to the bytes as possible.',
        tags: ['Impala', 'Presto', 'Drill', 'BigQuery'],
      },
      {
        number: '35',
        problem: 'When the read shape is text, not key.',
        narrative:
          'Search is just another form of derived data — an inverted index built from the same bytes the database holds, shaped for substring matching, ranking, and faceting instead of point lookups. The interesting part is the pipeline that keeps the index in sync: bulk-rebuilt nightly for cold data, incrementally updated from the change log for hot data, and tested with the kind of relevance queries the product actually ships.',
        tags: ['Elasticsearch', 'Solr', 'Inverted index'],
      },
      {
        number: '36',
        problem: 'When the question is recursive and SQL gives up.',
        narrative:
          'PageRank, community detection, shortest-path queries on a social graph — questions that ask about the structure of the graph, not the values on the edges. The naive SQL plan iterates until exhaustion; the right answer is vertex-centric computation that streams messages along edges, supersteps until convergence, and parallelises across the graph instead of across the rows.',
        tags: ['GraphX', 'Giraph', 'GraphChi', 'BSP'],
      },
      {
        number: '37',
        problem: 'Serving a model in production without making production wait for training.',
        narrative:
          'A recommendation model takes hours to train and microseconds to evaluate. The pattern that makes both numbers ship is to keep the two clearly apart: train offline on the warehouse, package the result as an immutable bundle, and serve it from a read-only store the production tier can hit fast. Re-train as often as the metric is worth it; never block a request on a job whose runtime you cannot bound.',
        tags: ['Mahout', 'MLlib', 'Voldemort', 'Read-only stores'],
      },
      {
        number: '38',
        problem: 'An append-only log as the spine of the system.',
        narrative:
          'Every interesting state in a system is the result of an ordered sequence of events. Treating that sequence as the durable record, instead of as a side-effect of the database\u2019s state, gives you replay, fan-out, and a clean separation between what happened and how the read side chooses to present it. Most modern data architectures have a log in the middle, even when they do not admit it.',
        tags: ['Kafka', 'Kinesis', 'Samza', 'AMQP', 'JMS'],
      },
      {
        number: '39',
        problem: 'Treating state as a projection of an event stream, not a primary.',
        narrative:
          'Two ways of getting events into the log: event sourcing puts them there on purpose, modelling each state change as a domain event the application emits; change data capture pulls them out of a database that was not designed for it, by reading its replication log. Either way the downstream is the same — projections, materialised views, search indexes, training datasets, all derived from the same ordered record.',
        tags: ['Event sourcing', 'CDC', 'Outbox', 'Replayable state'],
      },
      {
        number: '40',
        problem: 'Continuous queries over an event stream.',
        narrative:
          'Once the events are in a log, the question becomes "what is the answer right now?". Stream processors run continuous queries with stateful operators, exactly-once delivery semantics, and joins that turn raw events into real-time facts. The hard parts are not the operators — they are handling out-of-order events, defining windows that mean something to the product, and recovering from failure without double-counting.',
        tags: ['Flink', 'Spark Streaming', 'Storm', 'Kafka Streams'],
      },
      {
        number: '41',
        problem: 'Closing a window in a world where events arrive out of order.',
        narrative:
          'Real event streams do not arrive in time order — clocks drift, networks reorder, mobile devices come back online with hours of buffered events. Tumbling, sliding and session windows define what "recent" means; watermarks are the system\u2019s commitment that events older than this point have already been seen. Pick the watermark too eager and you drop late events; too lazy and the dashboard never updates.',
        tags: ['Windows', 'CEP', 'Watermarks', 'Esper'],
      },
      {
        number: '42',
        problem: 'A real-time dashboard that does not cost a fortune.',
        narrative:
          'Recomputing an aggregate from scratch on every query is wasteful when the inputs barely change. Maintaining a materialised view incrementally — updating it as each event arrives, instead of rebuilding it nightly — turns "real-time dashboard" from a heroic effort into a sustainable feature. The trade-off is the same one every cache makes: invalidation discipline, eventually-consistent windows, and a fallback path for when the view is behind.',
        tags: ['Materialised views', 'Incremental', 'Read models'],
      },
      {
        number: '43',
        problem: 'Moving data between systems without losing its meaning.',
        narrative:
          'Most of the work in a data platform is ferrying records between systems while applying schema evolution, type coercion and quality checks along the way. Heavy orchestration platforms shine when the dependency graph is real and the failure modes are interesting; sometimes a Unix one-liner is still the right answer. The discipline is the same either way: idempotent stages, observable runs, and an honest accounting of what "late" and "broken" mean.',
        tags: ['Airflow', 'dbt', 'Schema evolution', 'Unix tools'],
      },
    ],
  },
];

export const zonesBySlug: Record<string, Zone> = Object.fromEntries(
  zones.map((z) => [z.slug, z])
);
