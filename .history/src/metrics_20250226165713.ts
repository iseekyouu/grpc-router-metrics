import type { Counter, Histogram } from 'prom-client';
import Prometheus from './prometheus';

class AppMetrics {
  prometheus: Prometheus;

  grpcIncoming: Counter;

  grpcOutgoing: Counter;

  grpcErrors: Counter;

  grpcDuration: Histogram;

  prismaClientErrors: Counter;

  constructor() {
    this.prometheus = new Prometheus();
    this.grpcIncoming = this.prometheus.counterFactory(
      'grpc_incoming_requests',
      'count of incoming requests',
      ['rpc_name'],
    );

    this.grpcOutgoing = this.prometheus.counterFactory(
      'grpc_outgoing_requests',
      'count of success responses',
      ['rpc_name'],
    );

    this.grpcErrors = this.prometheus.counterFactory(
      'grpc_errors',
      'count of errors',
      ['rpc_name', 'error_type'],
    );

    this.grpcDuration = this.prometheus.histogramFactory(
      'grpc_query_duration_in_ms',
      'execution time in ms',
      ['rpc_name'],
    );

    this.prismaClientErrors = this.prometheus.counterFactory(
      'database_errors',
      'number of database errors',
    );
  }

  async writeMetrics() {
    return this.prometheus.registerMetrics();
  }

  getPrometheus() {
    return this.prometheus;
  }
}



export default AppMetrics;
