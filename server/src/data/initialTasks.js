/**
 * Initial Catalog of Coding Benchmark Tasks.
 */

const initialTasks = [
  {
    id: 'TASK-01',
    title: 'Async Request Debouncer',
    category: 'bugfix',
    difficulty: 'Medium',
    description: 'Fix race conditions in an asynchronous debouncer where rapid subsequent invocations resolve stale responses or fail to cancel active timers.',
    targetFunction: 'createDebouncer',
    skeletonCode: `/**
 * Fix the debouncer to properly debounce async function calls
 * and return the latest resolved value.
 */
function createDebouncer(fn, delayMs) {
  let timer = null;
  return function(...args) {
    // BUG: Missing proper Promise return and cancellation
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}`,
    goldenCode: `function createDebouncer(fn, delayMs) {
  let timer = null;
  let currentPromise = null;
  let currentResolve = null;
  let currentReject = null;

  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }

    if (!currentPromise) {
      currentPromise = new Promise((resolve, reject) => {
        currentResolve = resolve;
        currentReject = reject;
      });
    }

    const resolveRef = currentResolve;
    const rejectRef = currentReject;

    timer = setTimeout(async () => {
      currentPromise = null;
      currentResolve = null;
      currentReject = null;
      try {
        const result = await fn(...args);
        resolveRef(result);
      } catch (err) {
        rejectRef(err);
      }
    }, delayMs);

    return currentPromise;
  };
}`,
    testSuite: `
async function runTests(userCode) {
  const scope = {};
  const fnFactory = new Function('scope', userCode + '; scope.createDebouncer = createDebouncer;');
  fnFactory(scope);
  const { createDebouncer } = scope;

  // Test 1: Only the last call in the delay window executes
  let callCount = 0;
  const mockApi = async (val) => { callCount++; return val * 2; };
  const debounced = createDebouncer(mockApi, 50);

  const p1 = debounced(1);
  const p2 = debounced(2);
  const p3 = debounced(3);

  const res = await p3;
  if (res !== 6) throw new Error('Expected debounced result 6, got ' + res);
  if (callCount !== 1) throw new Error('Expected 1 execution, got ' + callCount);

  return { passed: true, message: 'All debouncer tests passed successfully' };
}`
  },
  {
    id: 'TASK-02',
    title: 'Sliding Window Rate Limiter',
    category: 'feature',
    difficulty: 'Medium',
    description: 'Implement a Sliding Window Rate Limiter in Node.js that tracks requests within a rolling time window and rejects requests exceeding the quota.',
    targetFunction: 'SlidingWindowLimiter',
    skeletonCode: `/**
 * Implement SlidingWindowLimiter
 */
class SlidingWindowLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  allow(key) {
    // TODO: Implement sliding window check
    throw new Error('Not implemented');
  }
}`,
    goldenCode: `class SlidingWindowLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.logs = new Map();
  }

  allow(key) {
    const now = Date.now();
    if (!this.logs.has(key)) {
      this.logs.set(key, []);
    }
    const timestamps = this.logs.get(key);
    const windowStart = now - this.windowMs;

    // Evict old timestamps outside rolling window
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }

    if (timestamps.length < this.limit) {
      timestamps.push(now);
      return true;
    }
    return false;
  }
}`,
    testSuite: `
async function runTests(userCode) {
  const scope = {};
  const fnFactory = new Function('scope', userCode + '; scope.SlidingWindowLimiter = SlidingWindowLimiter;');
  fnFactory(scope);
  const { SlidingWindowLimiter } = scope;

  const limiter = new SlidingWindowLimiter(3, 100);
  if (!limiter.allow('user_1')) throw new Error('First request should be allowed');
  if (!limiter.allow('user_1')) throw new Error('Second request should be allowed');
  if (!limiter.allow('user_1')) throw new Error('Third request should be allowed');
  if (limiter.allow('user_1')) throw new Error('Fourth request should be blocked');

  // Different key should have separate bucket
  if (!limiter.allow('user_2')) throw new Error('Separate user key should be allowed');

  return { passed: true, message: 'Sliding window rate limiter verified successfully' };
}`
  },
  {
    id: 'TASK-03',
    title: 'Topological Module Sorter & Cycle Detector',
    category: 'refactor',
    difficulty: 'Hard',
    description: 'Refactor module dependency resolution to iteratively compute execution order using Kahn BFS and detect circular import dependencies.',
    targetFunction: 'resolveModuleOrder',
    skeletonCode: `/**
 * Resolve topological execution order or throw on circular dependency
 */
function resolveModuleOrder(dependencyGraph) {
  // Legacy stub:
  return Object.keys(dependencyGraph);
}`,
    goldenCode: `function resolveModuleOrder(dependencyGraph) {
  const inDegree = {};
  const adj = {};

  for (const node in dependencyGraph) {
    inDegree[node] = 0;
    adj[node] = [];
  }

  for (const parent in dependencyGraph) {
    for (const child of dependencyGraph[parent]) {
      if (!adj[parent]) adj[parent] = [];
      adj[parent].push(child);
      inDegree[child] = (inDegree[child] || 0) + 1;
    }
  }

  const queue = [];
  for (const node in inDegree) {
    if (inDegree[node] === 0) queue.push(node);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of (adj[node] || [])) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (order.length !== Object.keys(inDegree).length) {
    throw new Error('Circular dependency detected in graph');
  }

  return order;
}`,
    testSuite: `
async function runTests(userCode) {
  const scope = {};
  const fnFactory = new Function('scope', userCode + '; scope.resolveModuleOrder = resolveModuleOrder;');
  fnFactory(scope);
  const { resolveModuleOrder } = scope;

  // Test DAG order
  const graph = {
    A: ['B', 'C'],
    B: ['D'],
    C: ['D'],
    D: []
  };
  const order = resolveModuleOrder(graph);
  if (order.indexOf('A') > order.indexOf('B') || order.indexOf('B') > order.indexOf('D')) {
    throw new Error('Invalid topological order: ' + JSON.stringify(order));
  }

  // Test Cycle detection
  const cyclic = {
    X: ['Y'],
    Y: ['Z'],
    Z: ['X']
  };
  let cycleCaught = false;
  try {
    resolveModuleOrder(cyclic);
  } catch (err) {
    cycleCaught = true;
  }
  if (!cycleCaught) throw new Error('Failed to detect circular dependency');

  return { passed: true, message: 'Topological sort and cycle detector verified' };
}`
  },
  {
    id: 'TASK-04',
    title: 'Streaming JSON Event Log Parser',
    category: 'performance',
    difficulty: 'Medium',
    description: 'Optimize high-throughput line-by-line JSON stream parser to process event payloads without memory bloat or regex splitting bottlenecks.',
    targetFunction: 'parseEventStream',
    skeletonCode: `/**
 * Parse newline delimited JSON events
 */
function parseEventStream(streamData) {
  // Inefficient regex splitting:
  const lines = streamData.split(/\\r?\\n/);
  return lines.filter(Boolean).map(l => JSON.parse(l));
}`,
    goldenCode: `function parseEventStream(streamData) {
  const records = [];
  let start = 0;
  const len = streamData.length;

  for (let i = 0; i <= len; i++) {
    if (i === len || streamData[i] === '\\n') {
      const line = streamData.substring(start, i).trim();
      start = i + 1;
      if (line && line.charCodeAt(0) === 123) { // starts with '{'
        try {
          records.push(JSON.parse(line));
        } catch (_) {}
      }
    }
  }
  return records;
}`,
    testSuite: `
async function runTests(userCode) {
  const scope = {};
  const fnFactory = new Function('scope', userCode + '; scope.parseEventStream = parseEventStream;');
  fnFactory(scope);
  const { parseEventStream } = scope;

  const payload = '{"id":1,"type":"CLICK"}\\n\\n{"id":2,"type":"VIEW"}\\ncorrupt_line\\n{"id":3,"type":"SUBMIT"}\\n';
  const t0 = performance.now();
  const parsed = parseEventStream(payload);
  const duration = performance.now() - t0;

  if (parsed.length !== 3) throw new Error('Expected 3 valid parsed records, got ' + parsed.length);
  if (parsed[0].id !== 1 || parsed[2].type !== 'SUBMIT') throw new Error('Record content mismatch');

  return { passed: true, message: 'Event stream parser verified within performance parameters', durationMs: duration };
}`
  }
];

module.exports = initialTasks;
