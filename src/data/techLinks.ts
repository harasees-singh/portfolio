/**
 * Master registry of every technology mentioned anywhere in the descent.
 * Each entry maps the display name (used in tag pills + headings) to the
 * canonical homepage so deep-dive pages can link out cleanly.
 *
 * Anything not listed here renders as plain text in the deep-dive view.
 */
export const techLinks: Record<string, string> = {
  // 01 Relational Empire
  PostgreSQL: 'https://www.postgresql.org/',
  MySQL: 'https://www.mysql.com/',
  'SQL Server': 'https://www.microsoft.com/sql-server',
  Oracle: 'https://www.oracle.com/database/',
  DB2: 'https://www.ibm.com/db2',

  // 02 Document Data District
  MongoDB: 'https://www.mongodb.com/',
  CouchDB: 'https://couchdb.apache.org/',
  RethinkDB: 'https://rethinkdb.com/',
  HyperDex: 'http://hyperdex.org/',

  // 03 Column-Family District
  HBase: 'https://hbase.apache.org/',
  Cassandra: 'https://cassandra.apache.org/',

  // 04 Key-Value District
  Redis: 'https://redis.io/',
  Aerospike: 'https://aerospike.com/',
  Riak: 'https://riak.com/',
  Voldemort: 'https://www.project-voldemort.com/voldemort/',
  'Berkeley DB': 'https://www.oracle.com/database/technologies/related/berkeleydb.html',
  Memcached: 'https://memcached.org/',

  // Storage engines
  RocksDB: 'https://rocksdb.org/',
  LevelDB: 'https://github.com/google/leveldb',
  Lucene: 'https://lucene.apache.org/',

  // Encoding formats
  JSON: 'https://www.json.org/',
  XML: 'https://www.w3.org/XML/',
  YAML: 'https://yaml.org/',
  CSV: 'https://datatracker.ietf.org/doc/html/rfc4180',
  Protobuf: 'https://protobuf.dev/',
  'Protocol Buffers': 'https://protobuf.dev/',
  Thrift: 'https://thrift.apache.org/',
  Avro: 'https://avro.apache.org/',
  MessagePack: 'https://msgpack.org/',
  Parquet: 'https://parquet.apache.org/',

  // APIs / RPC
  REST: 'https://en.wikipedia.org/wiki/REST',
  OpenAPI: 'https://www.openapis.org/',
  Swagger: 'https://swagger.io/',
  gRPC: 'https://grpc.io/',
  SOAP: 'https://www.w3.org/TR/soap/',
  WSDL: 'https://www.w3.org/TR/wsdl/',

  // Message passing
  Akka: 'https://akka.io/',
  'Erlang/OTP': 'https://www.erlang.org/',

  // Analytics / warehouses
  Vertica: 'https://www.vertica.com/',
  Redshift: 'https://aws.amazon.com/redshift/',
  ParAccel: 'https://en.wikipedia.org/wiki/ParAccel',

  // Hadoop ecosystem
  HDFS: 'https://hadoop.apache.org/',
  S3: 'https://aws.amazon.com/s3/',
  GCS: 'https://cloud.google.com/storage',
  Hive: 'https://hive.apache.org/',
  Tez: 'https://tez.apache.org/',
  Pig: 'https://pig.apache.org/',
  MapReduce: 'https://en.wikipedia.org/wiki/MapReduce',
  Spark: 'https://spark.apache.org/',
  'Spark MLlib': 'https://spark.apache.org/mllib/',
  'Spark Streaming': 'https://spark.apache.org/streaming/',

  // MPP
  Impala: 'https://impala.apache.org/',
  Presto: 'https://prestodb.io/',
  Drill: 'https://drill.apache.org/',
  BigQuery: 'https://cloud.google.com/bigquery',

  // Search
  Elasticsearch: 'https://www.elastic.co/elasticsearch',
  Solr: 'https://solr.apache.org/',

  // Graph processing
  GraphX: 'https://spark.apache.org/graphx/',
  Giraph: 'https://giraph.apache.org/',
  GraphChi: 'https://github.com/GraphChi/graphchi-cpp',

  // ML
  Mahout: 'https://mahout.apache.org/',
  MLlib: 'https://spark.apache.org/mllib/',
  Terrapin: 'https://github.com/pinterest/terrapin',

  // ETL
  Airflow: 'https://airflow.apache.org/',
  dbt: 'https://www.getdbt.com/',

  // Coordination / consensus
  ZooKeeper: 'https://zookeeper.apache.org/',
  etcd: 'https://etcd.io/',
  Paxos: 'https://en.wikipedia.org/wiki/Paxos_(computer_science)',
  Raft: 'https://raft.github.io/',
  Zab: 'https://zookeeper.apache.org/doc/r3.4.13/zookeeperInternals.html',

  // Streaming / events
  Kafka: 'https://kafka.apache.org/',
  Kinesis: 'https://aws.amazon.com/kinesis/',
  Samza: 'https://samza.apache.org/',
  AMQP: 'https://www.amqp.org/',
  JMS: 'https://www.oracle.com/java/technologies/java-message-service.html',
  'Kafka Streams': 'https://kafka.apache.org/documentation/streams/',

  Flink: 'https://flink.apache.org/',
  Storm: 'https://storm.apache.org/',
  Esper: 'https://www.espertech.com/',
};
