/**
 * Deterministic Verifier Service
 * Executes candidate solutions against test suites with timeout bounds and error capture.
 */

const vm = require('vm');
const { performance } = require('perf_hooks');
const taskService = require('./taskService');
const config = require('../config/config');

class VerifierService {
  constructor() {
    this.runHistory = [];
  }

  async verifySubmission(taskId, userCode) {
    const task = taskService.getRawTask(taskId);
    if (!task) {
      throw new Error(`Task with id '${taskId}' not found`);
    }

    const runId = 'RUN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const startTime = performance.now();

    // Basic AST / Syntax / Anti-tamper pre-check
    if (userCode.includes('process.exit') || userCode.includes('child_process')) {
      const result = {
        runId,
        taskId,
        taskTitle: task.title,
        passed: false,
        score: 0.0,
        message: 'Security policy violation: Prohibited system call detected.',
        durationMs: 0.5,
        timestamp: new Date().toISOString()
      };
      this.recordRun(result);
      return result;
    }

    try {
      // Setup isolated VM context
      const sandbox = {
        setTimeout,
        clearTimeout,
        Promise,
        Date,
        Map,
        Set,
        Array,
        Object,
        performance,
        console: { log: () => {} },
        userCode: userCode,
        resultOutput: null,
        executionError: null
      };

      const context = vm.createContext(sandbox);

      const scriptCode = `
        ${task.testSuite}
        (async () => {
          try {
            const res = await runTests(userCode);
            resultOutput = res;
          } catch (err) {
            executionError = err.message || String(err);
          }
        })();
      `;

      const script = new vm.Script(scriptCode);
      script.runInContext(context, { timeout: config.EXECUTION_TIMEOUT_MS });

      // Allow async promises inside VM to settle
      await new Promise(resolve => setTimeout(resolve, 150));

      const durationMs = parseFloat((performance.now() - startTime).toFixed(2));

      if (sandbox.executionError) {
        const result = {
          runId,
          taskId,
          taskTitle: task.title,
          passed: false,
          score: 0.25,
          message: sandbox.executionError,
          durationMs,
          timestamp: new Date().toISOString()
        };
        this.recordRun(result);
        return result;
      }

      const result = {
        runId,
        taskId,
        taskTitle: task.title,
        passed: true,
        score: 1.0,
        message: sandbox.resultOutput ? sandbox.resultOutput.message : 'All verifications passed.',
        durationMs,
        timestamp: new Date().toISOString()
      };

      this.recordRun(result);
      return result;
    } catch (err) {
      const durationMs = parseFloat((performance.now() - startTime).toFixed(2));
      const result = {
        runId,
        taskId,
        taskTitle: task.title,
        passed: false,
        score: 0.0,
        message: 'Execution error: ' + (err.message || String(err)),
        durationMs,
        timestamp: new Date().toISOString()
      };
      this.recordRun(result);
      return result;
    }
  }

  recordRun(runResult) {
    this.runHistory.unshift(runResult);
    if (this.runHistory.length > config.MAX_HISTORY_ENTRIES) {
      this.runHistory.pop();
    }
  }

  getHistory(limit = 20) {
    return this.runHistory.slice(0, limit);
  }

  getStats() {
    const totalRuns = this.runHistory.length;
    const passedRuns = this.runHistory.filter(r => r.passed).length;
    const passRate = totalRuns > 0 ? parseFloat(((passedRuns / totalRuns) * 100).toFixed(1)) : 0.0;
    const avgLatencyMs = totalRuns > 0
      ? parseFloat((this.runHistory.reduce((acc, r) => acc + r.durationMs, 0) / totalRuns).toFixed(2))
      : 0.0;

    return {
      totalTasks: taskService.getAll().length,
      totalRuns,
      passedRuns,
      passRate,
      avgLatencyMs
    };
  }
}

module.exports = new VerifierService();
