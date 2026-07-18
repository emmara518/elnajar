import { useCallback, useEffect } from 'react';
import type { SessionService } from '../services';
import type { SessionData, SessionStatus, BranchContext } from '../types';
import { useSessionStore, selectSession, selectSessionStatus, selectBranchContext, selectIsOnline, selectIsSessionActive } from '../stores';

export interface UseSessionReturn {
  session: SessionData | null;
  sessionStatus: SessionStatus;
  isActive: boolean;
  isOnline: boolean;
  branchContext: BranchContext | null;
  setBranchContext: (context: BranchContext) => void;
  recordActivity: () => void;
}

export function useSession(service?: SessionService): UseSessionReturn {
  const session = useSessionStore(selectSession);
  const sessionStatus = useSessionStore(selectSessionStatus);
  const isActive = useSessionStore(selectIsSessionActive);
  const isOnline = useSessionStore(selectIsOnline);
  const branchContext = useSessionStore(selectBranchContext);

  const setBranchContext = useSessionStore((s) => s.setBranchContext);
  const setOnline = useSessionStore((s) => s.setOnline);

  const recordActivity = useCallback(() => {
    service?.recordActivity();
  }, [service]);

  useEffect(() => {
    const handleOnline = () => { setOnline(true); };
    const handleOffline = () => { setOnline(false); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  useEffect(() => {
    const handleActivity = () => { recordActivity(); };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [recordActivity]);

  return {
    session,
    sessionStatus,
    isActive,
    isOnline,
    branchContext,
    setBranchContext,
    recordActivity,
  };
}
