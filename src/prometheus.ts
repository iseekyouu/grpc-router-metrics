import promClient, { Counter, Histogram, register } from 'prom-client';

type CounterType = Counter<string>;

export type { CounterType };

export default class Prometheus {
  promClient: typeof promClient;

  counters: Map<string, CounterType>;

  histograms: Map<string, Histogram>;

  constructor(client: typeof promClient = promClient) {
    this.promClient = client;
    this.counters = new Map();
    this.histograms = new Map();
  }

  registerMetrics() {
    return register.metrics();
  }

  counterFactory(name: string, help: string, labelNames: string[] = []) {
    this.counters.set(name, new promClient.Counter({
      name,
      help,
      registers: [promClient.register],
      labelNames,
    }));

    return this.counters.get(name) as Counter;
  }

  histogramFactory(name: string, help: string, labelNames: string[] = []) {
    this.histograms.set(name, new promClient.Histogram({
      name,
      help,
      labelNames,
      registers: [promClient.register],
      // in ms
      buckets: [
        1,
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100,
      ],
    }));

    return this.histograms.get(name) as Histogram;
  }
}
