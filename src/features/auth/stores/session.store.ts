import { create } from 'zustand';
import type { SessionData, SessionStatus, BranchContext } from '../types';

export interface SessionState {
  data: SessionData | null;
  status: SessionStatus;
  branchContext: BranchContext | null;
  isOnline: boolean;
}

export interface SessionActions {
  setSession: (data: SessionData | null) => void;
  setStatus: (status: SessionStatus) => void;
  setBranchContext: (context: BranchContext | null) => void;
  setOnline: (online: boolean) => void;
  reset: () => void;
}

export type SessionStore = SessionState & SessionActions;

export const initialSessionState: SessionState = {
  data: null,
  status: 'expired',
  branchContext: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialSessionState,

  setSession: (data) => {
    set({ data, status: data !== null ? 'active' : 'expired' });
  },

  setStatus: (status) => { set({ status }); },

  setBranchContext: (branchContext) => { set({ branchContext }); },

  setOnline: (isOnline) => { set({ isOnline }); },

  reset: () => { set(initialSessionState); },
}));

export function selectSession(state: SessionStore): SessionData | null {
  return state.data;
}

export function selectSessionStatus(state: SessionStore): SessionStatus {
  return state.status;
}

export function selectBranchContext(state: SessionStore): BranchContext | null {
  return state.branchContext;
}

export function selectIsSessionActive(state: SessionStore): boolean {
  return state.status === 'active';
}

export function selectIsOnline(state: SessionStore): boolean {
  return state.isOnline;
}
