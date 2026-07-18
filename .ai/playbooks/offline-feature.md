# Offline Feature Playbook

## Best Practices
- Detect network status with `navigator.onLine` and online/offline events
- Queue write operations when offline (Zustand persist + IndexedDB)
- Show offline indicator banner when disconnected
- Read from local cache when offline
- Sync queued operations when connection returns (ordered by timestamp)
- Handle sync conflicts with "last write wins" or manual resolution
- Cache read data with timestamps for staleness checks
- Never cache sensitive data (tokens, passwords, payment info)
- Show pending operations count in UI
- Allow users to cancel pending operations

## Anti-Patterns
- Blocking UI when offline
- Losing user data on connection loss
- Syncing without conflict resolution strategy
- Caching sensitive data offline
- Infinite retry loops
