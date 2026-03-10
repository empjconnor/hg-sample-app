const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../index');

let server;
let baseUrl;

before(async () => {
  server = http.createServer(app);
  await new Promise(resolve => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = { method, hostname: url.hostname, port: url.port, path: url.pathname };
    const headers = {};
    let bodyStr;
    if (body) {
      bodyStr = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }
    options.headers = headers;
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

describe('PUT /api/customers/:id', () => {
  it('should update customer info', async () => {
    const res = await request('PUT', '/api/customers/cust_001', {
      name: 'Acme Corp Updated',
      industry: 'Technology',
      region: 'EMEA',
      contactEmail: 'new@acme.example.com'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.name, 'Acme Corp Updated');
    assert.strictEqual(res.body.industry, 'Technology');
    assert.strictEqual(res.body.region, 'EMEA');
    assert.strictEqual(res.body.contactEmail, 'new@acme.example.com');
    assert.strictEqual(res.body.id, 'cust_001');
  });

  it('should return 404 for unknown customer', async () => {
    const res = await request('PUT', '/api/customers/nonexistent', {
      name: 'Test'
    });
    assert.strictEqual(res.status, 404);
  });

  it('should return 400 when name is missing', async () => {
    const res = await request('PUT', '/api/customers/cust_001', {
      industry: 'Tech'
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error.includes('name'));
  });
});

describe('PATCH /api/customers/:id/onboarding/steps/:stepId', () => {
  it('should update step status to completed', async () => {
    const res = await request('PATCH', '/api/customers/cust_001/onboarding/steps/step_1', {
      status: 'completed'
    });
    assert.strictEqual(res.status, 200);
    const step = res.body.steps.find(s => s.id === 'step_1');
    assert.strictEqual(step.status, 'completed');
    assert.strictEqual(res.body.progressPercent, 25);
  });

  it('should return 400 for invalid status', async () => {
    const res = await request('PATCH', '/api/customers/cust_001/onboarding/steps/step_1', {
      status: 'invalid'
    });
    assert.strictEqual(res.status, 400);
  });

  it('should return 404 for unknown customer', async () => {
    const res = await request('PATCH', '/api/customers/nonexistent/onboarding/steps/step_1', {
      status: 'completed'
    });
    assert.strictEqual(res.status, 404);
  });

  it('should return 404 for unknown step', async () => {
    const res = await request('PATCH', '/api/customers/cust_001/onboarding/steps/step_99', {
      status: 'completed'
    });
    assert.strictEqual(res.status, 404);
  });
});
