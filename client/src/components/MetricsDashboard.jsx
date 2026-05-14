import React from 'react';

export default function MetricsDashboard({ stats }) {
  if (!stats) return null;

  return (
    <section className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Benchmark Tasks</span>
        <span className="metric-value">{stats.totalTasks}</span>
        <span className="metric-trend">Curated verification problems</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Total Evaluated Runs</span>
        <span className="metric-value">{stats.totalRuns}</span>
        <span className="metric-trend">Automated VM test executions</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Overall Pass Rate</span>
        <span className="metric-value">{stats.passRate}%</span>
        <span className="metric-trend trend-good">{stats.passedRuns} passed successfully</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Avg Verification Latency</span>
        <span className="metric-value">{stats.avgLatencyMs} ms</span>
        <span className="metric-trend">High-throughput execution</span>
      </div>
    </section>
  );
}
