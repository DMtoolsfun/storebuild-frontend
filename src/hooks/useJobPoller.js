import { useState, useEffect, useRef } from 'react';
import { subscribeToJob } from '../utils/api';

export function useJobPoller(jobId) {
  const [state, setState] = useState({ status: 'idle', progress: 0, step: '', downloadUrl: null, error: null });
  const unsub = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    setState({ status: 'running', progress: 0, step: 'Starting...', downloadUrl: null, error: null });

    unsub.current = subscribeToJob(jobId, (msg) => {
      if (msg.type === 'progress') {
        setState(s => ({ ...s, status: 'running', progress: msg.progress, step: msg.step }));
      } else if (msg.type === 'complete') {
        setState({ status: 'complete', progress: 100, step: 'Complete', downloadUrl: msg.downloadUrl, error: null, stats: msg.stats });
        if (unsub.current) unsub.current();
      } else if (msg.type === 'error') {
        setState(s => ({ ...s, status: 'error', error: msg.message }));
        if (unsub.current) unsub.current();
      }
    });

    return () => { if (unsub.current) unsub.current(); };
  }, [jobId]);

  return state;
}
