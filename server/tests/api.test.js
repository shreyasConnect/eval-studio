/**
 * Integration Tests for EvalStudio REST API (using Node.js native test runner)
 */

const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const http = require('http');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /health returns 200 and status ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.status, 'ok');
});

test('GET /api/tasks returns catalog of tasks', async () => {
  const res = await fetch(`${baseUrl}/api/tasks`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(body.count >= 4);
  assert.ok(body.data.some(t => t.id === 'TASK-01'));
});

test('GET /api/tasks/:id returns specific task', async () => {
  const res = await fetch(`${baseUrl}/api/tasks/TASK-01`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.data.id, 'TASK-01');
  assert.ok(body.data.skeletonCode);
  assert.ok(body.data.goldenCode);
});

test('POST /api/runs verifies golden code passes', async () => {
  // First fetch golden code for TASK-02
  const taskRes = await fetch(`${baseUrl}/api/tasks/TASK-02`);
  const taskBody = await taskRes.json();

  const runRes = await fetch(`${baseUrl}/api/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId: 'TASK-02',
      code: taskBody.data.goldenCode
    })
  });

  const runBody = await runRes.json();
  assert.strictEqual(runRes.status, 200);
  assert.strictEqual(runBody.success, true);
  assert.strictEqual(runBody.data.passed, true);
  assert.strictEqual(runBody.data.score, 1.0);
});

test('POST /api/runs verifies broken code fails gracefully', async () => {
  const runRes = await fetch(`${baseUrl}/api/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId: 'TASK-02',
      code: 'class SlidingWindowLimiter { allow() { return false; } }'
    })
  });

  const runBody = await runRes.json();
  assert.strictEqual(runRes.status, 200);
  assert.strictEqual(runBody.success, true);
  assert.strictEqual(runBody.data.passed, false);
});

test('GET /api/stats returns updated platform metrics', async () => {
  const res = await fetch(`${baseUrl}/api/stats`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(body.data.totalRuns >= 2);
});
