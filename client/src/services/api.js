/**
 * Client API Client
 */

const API_BASE = '/api';

export async function fetchTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/tasks${query ? '?' + query : ''}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function fetchTaskById(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
}

export async function submitCodeRun(taskId, code) {
  const res = await fetch(`${API_BASE}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, code })
  });
  if (!res.ok) throw new Error('Run submission failed');
  return res.json();
}

export async function fetchRunHistory(limit = 10) {
  const res = await fetch(`${API_BASE}/runs?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch run history');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch platform stats');
  return res.json();
}
