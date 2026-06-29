import React, { useState, useEffect } from 'react';

export default function CodeSubmissionForm({ task, onSubmit, isSubmitting, lastResult }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (task) {
      setCode(task.skeletonCode || '');
    }
  }, [task]);

  if (!task) {
    return (
      <div className="editor-panel">
        <h3 className="panel-title">Task Verification Workspace</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>
          Select a benchmark problem on the left to inspect requirements and test solutions.
        </p>
      </div>
    );
  }

  const handleResetToSkeleton = () => {
    setCode(task.skeletonCode || '');
  };

  const handleLoadGolden = () => {
    if (task.goldenCode) {
      setCode(task.goldenCode);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task.id, code);
  };

  return (
    <div className="editor-panel">
      <div className="panel-header">
        <div>
          <span className="task-id">{task.id}</span>
          <h2 className="panel-title">{task.title}</h2>
        </div>
        <div className="panel-actions">
          <button type="button" className="btn-secondary" onClick={handleResetToSkeleton}>
            Reset Skeleton
          </button>
          <button type="button" className="btn-secondary" onClick={handleLoadGolden}>
            Load Golden Solution
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Evaluating...' : 'Run Verifier'}
          </button>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px', lineHeight: '1.5' }}>
        {task.description}
      </p>

      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />

      {lastResult && (
        <div className={`result-box ${lastResult.passed ? 'result-pass' : 'result-fail'}`}>
          <div className="result-title">
            <span>{lastResult.passed ? '✓ VERIFICATION PASSED' : '✗ VERIFICATION FAILED'}</span>
            <span>{lastResult.durationMs} ms (Score: {lastResult.score})</span>
          </div>
          <div className="result-message">{lastResult.message}</div>
        </div>
      )}
    </div>
  );
}
