# grpc-prisma-metrics

Fast default metrics for grpc

example:

```ts
const metrics = new AppMetrics();
...
// Im using seprate class for writing metrics to prometheus
export default class MetricsWriter {
  constructor(Args) {}

  dbErrorCheck(err: unknown) {
    if (
      // ...your db error codes here
    ) {
      return true;
    }

    return false;
  }

  writeErrorMetrics(typedError: {
    message: string,
    status: Status,
    code?: string,
    stack: string,
  }, rpcName: string) {
    if (this.dbErrorCheck(typedError)) {
      this.app.metrics.databaseClientErrors.inc();
    }

    this.app.metrics.grpcErrors.inc({
      rpc_name: rpcName,
      error_type: typedError.code || String(typedError.status),
    });
  }

  async withMetrics(rpcName: string, fn: () => Promise<any>) {
    const startTime = performance.now();
    try {
      this.app.metrics.grpcIncoming.inc({ rpc_name: rpcName });

      return await fn();
    } finally {
      this.app.metrics.grpcOutgoing.inc({ rpc_name: rpcName });
      this.app.metrics.grpcDuration.labels(rpcName).observe(performance.now() - startTime);
    }
  }
}

// Router class example
class GrpcRouter {
  constructor() {
    this.metricsWriter = new MetricsWriter();
  }

  errorHandler(args) {
    // error handling here
    this.metricsWriter.writeErrorMetrics(typedError, rpcName);
  }

  async getNotificationsHandler(request: MethodRequestType): Promise<MethodResponseType> {
    const method = async () => {
      try {
        // logic here
      } catch (error: unknown) {
        this.errorHandler(yourArgs)

        return MethodResponseType
      }
    };

    return this.metricsWriter.withMetrics('GetNotifications', method);
  }
}
```
