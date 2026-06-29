import React from 'react';

export default function RunHistoryTable({ history }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="history-section">
      <h3 className="section-title">Recent Benchmark Evaluation Runs</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Run ID</th>
            <th>Task</th>
            <th>Status</th>
            <th>Score</th>
            <th>Latency</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((run) => (
            <tr key={run.runId}>
              <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{run.runId}</td>
              <td style={{ fontWeight: 600 }}>{run.taskTitle}</td>
              <td>
                <span className={run.passed ? 'pill-pass' : 'pill-fail'}>
                  {run.passed ? 'PASS' : 'FAIL'}
                </span>
              </td>
              <td>{run.score.toFixed(2)}</td>
              <td>{run.durationMs} ms</td>
              <td style={{ color: 'var(--text-muted)' }}>{run.message}</td>
              <td style={{ color: 'var(--text-muted)' }}>
                {new Date(run.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
