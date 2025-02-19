import { Histogram, Counter } from 'prom-client';

// Initialize request duration histogram
export const requestDurationHistogram = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

// Initialize visitor counters
export const totalVisitsCounter = new Counter({
  name: 'website_visits_total',
  help: 'Total number of website visits',
});

export const pageVisitsCounter = new Counter({
  name: 'page_visits_total',
  help: 'Number of visits per page',
  labelNames: ['page'],
});