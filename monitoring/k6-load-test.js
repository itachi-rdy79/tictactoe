import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Load Test Configuration:
// Ramps up to 50 concurrent virtual users, sustains, and ramps down
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up to 20 users
    { duration: '1m', target: 50 },   // Stress test at 50 users
    { duration: '20s', target: 0 },   // Graceful ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8080';

export default function () {
  // Test loading primary index page
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes GAP Arcade': (r) => r.body.includes('GAP'),
  });

  // Test healthcheck endpoint
  const healthRes = http.get(`${BASE_URL}/healthz`);
  check(healthRes, {
    'healthz status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
