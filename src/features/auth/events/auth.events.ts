import type { AuthEventType, AuthEvent } from '../types';

type EventCallback = (event: AuthEvent) => void;

class AuthEventBus {
  private listeners: Map<AuthEventType, Set<EventCallback>> = new Map();
  private static instance: AuthEventBus | undefined;

  static getInstance(): AuthEventBus {
    if (AuthEventBus.instance === undefined) {
      AuthEventBus.instance = new AuthEventBus();
    }
    return AuthEventBus.instance;
  }

  emit(type: AuthEventType, event: Omit<AuthEvent, 'type'>): void {
    const fullEvent: AuthEvent = { ...event, type };
    this.listeners.get(type)?.forEach((callback) => {
      try {
        callback(fullEvent);
      } catch {
        // Silently handle listener errors
      }
    });
  }

  on(type: AuthEventType, callback: EventCallback): () => void {
    let listeners = this.listeners.get(type);
    if (listeners === undefined) {
      listeners = new Set();
      this.listeners.set(type, listeners);
    }
    listeners.add(callback);
    return () => { listeners?.delete(callback); };
  }

  removeAll(): void {
    this.listeners.clear();
  }
}

export const authEventBus = AuthEventBus.getInstance();
