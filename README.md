# ⚡ EvalStudio

> **Full-Stack Benchmark Playground & Deterministic Verifier Dashboard for Code Generation & AI Agents**

[![CI](https://github.com/shreyasConnect/eval-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/shreyasConnect/eval-studio/actions)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.21+-lightgrey.svg)](https://expressjs.com/)
[![React 18](https://img.shields.io/badge/react-18.3+-61dafb.svg)](https://react.dev/)

---

## 🎯 Overview

**EvalStudio** is a lightweight, practical full-stack application built with **Node.js**, **Express**, and **React**. It provides an interactive evaluation studio where engineers and AI coding models can discover algorithmic tasks, inspect problem requirements, submit candidate solutions, and execute deterministic test verifications in an isolated JavaScript runtime.

### Key Capabilities
- **Curated Benchmark Catalog**: Real-world tasks spanning **concurrency bug fixes**, **rate limiter features**, **topological sort refactoring**, and **zero-copy streaming performance**.
- **Deterministic In-Process Verifier**: Sandboxed Node.js VM execution with memory bounds, timeouts, and anti-tamper security checks.
- **Real-Time Evaluation Metrics**: Tracks submission outcomes, pass rates, execution latency, and scoring history.
- **Modern Responsive Dashboard**: Interactive React SPA with task filtering, live code editor, golden solution inspection, and instant execution telemetry.
- **RESTful API**: Standardized JSON endpoints for automated agent evaluation loops.

---

## 🏗️ Architecture

```
+-------------------------------------------------------------------------+
|                               EvalStudio                                |
+------------------------------------+------------------------------------+
                                     |
             +-----------------------+-----------------------+
             |                                               |
             v                                               v
+--------------------------+                   +--------------------------+
|      React Frontend      |                   |    Node.js / Express     |
|   (Vite SPA Dashboard)   |  --- HTTP/JSON -> |      REST API Backend    |
+--------------------------+                   +-------------+------------+
| - Metrics Dashboard      |                                 |
| - Task Filter & Catalog  |                                 v
| - Live Code Editor       |                   +--------------------------+
| - Golden Solution Viewer |                   |    Verifier VM Service   |
| - Run History Table      |                   |  - Ephemeral Context     |
+--------------------------+                   |  - Timeout Guard (3000ms)|
                                               |  - Telemetry & Scoring   |
                                               +--------------------------+
```

---

## 📦 Benchmark Tasks Catalog

| Task ID | Title | Category | Difficulty | Focus Area |
|---|---|---|---|---|
| `TASK-01` | **Async Request Debouncer** | Bug Fix | Medium | Promise settling, timer cancellation, race conditions |
| `TASK-02` | **Sliding Window Rate Limiter** | Feature | Medium | Timestamp log tracking, rolling window quota enforcement |
| `TASK-03` | **Topological Module Sorter** | Refactor | Hard | Kahn's algorithm BFS, recursion elimination, cycle detection |
| `TASK-04` | **Streaming Event Log Parser** | Performance | Medium | Memory reuse, zero regex splitting, chunked line processing |

---

## 🚀 Quickstart

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/shreyasConnect/eval-studio.git
cd eval-studio

# Install backend dependencies
npm install

# Install frontend dependencies (optional for local UI development)
cd client && npm install && cd ..
```

### 2. Start the Application

#### Option A: Run the Backend REST API Server
```bash
npm start
# Server starts on http://localhost:5000
```

#### Option B: Run the Full-Stack Environment (React Frontend + Express Backend)
```bash
# In terminal 1 (start Express API):
npm run server

# In terminal 2 (start Vite React UI):
cd client
npm run dev
# Vite UI starts on http://localhost:3000 (proxied to API at port 5000)
```

---

## 🌐 REST API Specification

### `GET /health`
Returns service status and server uptime.

### `GET /api/tasks`
Lists all benchmark tasks. Supports query parameters:
- `?category=bugfix`
- `?difficulty=Medium`
- `?search=debouncer`

### `GET /api/tasks/:id`
Returns detailed task specification including skeleton code and golden reference implementation.

### `POST /api/runs`
Submits code for evaluation.
```json
{
  "taskId": "TASK-02",
  "code": "class SlidingWindowLimiter { ... }"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "runId": "RUN-9X82BA",
    "taskId": "TASK-02",
    "taskTitle": "Sliding Window Rate Limiter",
    "passed": true,
    "score": 1.0,
    "message": "Sliding window rate limiter verified successfully",
    "durationMs": 4.12,
    "timestamp": "2026-06-18T14:20:00.000Z"
  }
}
```

### `GET /api/runs`
Fetches recent submission history and pass/fail telemetry.

### `GET /api/stats`
Returns aggregated analytics (total tasks, total runs, pass rate %, average execution latency).

---

## 🧪 Running Tests

EvalStudio uses the Node.js native test runner (`node --test`) for fast integration testing:

```bash
npm test
```

---

## 📜 License

Distributed under the Apache 2.0 License. See `LICENSE` for details.
