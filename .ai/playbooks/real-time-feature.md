# Real-time Feature Playbook

## Best Practices
- Use Supabase Realtime for live data synchronization
- Subscribe to specific channels (avoid broad subscriptions)
- Unsubscribe on component unmount to prevent memory leaks
- Show connection status indicator (connected/disconnected/reconnecting)
- Implement exponential backoff for reconnection
- Merge real-time updates with existing state (don't replace entire list)
- Handle conflicts between local mutations and real-time updates
- Debounce rapid updates to prevent excessive re-renders
- Keep subscription count minimal
- Use optimistic updates with real-time confirmation

## Anti-Patterns
- Subscribing without cleanup
- Replacing entire data on every real-time event
- No reconnection handling
- Subscribing to all changes on a table (use filters)
- Ignoring subscription errors
