import { useSyncExternalStore } from 'react';

function getMatch(): MediaQueryList {
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

function subscribe(callback: () => void): () => void {
  const mql = getMatch();
  mql.addEventListener('change', callback);
  return () => { mql.removeEventListener('change', callback); };
}

function getSnapshot(): boolean {
  return getMatch().matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
