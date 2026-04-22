const BASE = process.env.REACT_APP_API_URL || '';

export async function identifyUser(email) {
  const r = await fetch(`${BASE}/api/auth/identify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!r.ok) throw new Error('Failed to identify user');
  return r.json();
}

export async function fetchNiches() {
  const r = await fetch(`${BASE}/api/niches`);
  if (!r.ok) throw new Error('Failed to load niches');
  return r.json();
}

export async function startBuild({ email, niche, storeName, marginPct, productCount }) {
  const r = await fetch(`${BASE}/api/stores/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, niche, storeName, marginPct, productCount }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Failed to start build');
  return data; // { jobId }
}

export function subscribeToJob(jobId, onMessage) {
  const BASE_URL = process.env.REACT_APP_API_URL || '';
  const es = new EventSource(`${BASE_URL}/api/stores/${jobId}/status`);
  es.onmessage = e => {
    try { onMessage(JSON.parse(e.data)); } catch (_) {}
  };
  es.onerror = () => es.close();
  return () => es.close();
}

export function getDownloadUrl(jobId) {
  const BASE_URL = process.env.REACT_APP_API_URL || '';
  return `${BASE_URL}/api/stores/${jobId}/download`;
}
