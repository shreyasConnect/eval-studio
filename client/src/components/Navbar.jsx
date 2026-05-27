import React from 'react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-icon">⚡</span>
        <div>
          <h1 className="brand-title">EvalStudio</h1>
          <p className="brand-subtitle">Interactive Benchmark & Code Verifier Environment</p>
        </div>
      </div>
      <div className="nav-links">
        <span className="nav-badge">Node.js + React</span>
        <span className="nav-badge">v1.0.0</span>
      </div>
    </header>
  );
}
