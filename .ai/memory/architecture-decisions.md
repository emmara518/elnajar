# Architecture Decisions

## Active ADRs

| ID | Title | Date | Status |
|----|-------|------|--------|
| ADR-001 | Feature-First Architecture | 2026-07-18 | Accepted |
| ADR-002 | Feature Template Structure | 2026-07-18 | Accepted |
| ADR-003 | AI Engineering Platform | 2026-07-18 | Accepted |

## ADR-001: Feature-First Architecture

**Status:** Accepted

**Decision:** All features live in `src/features/<name>/` following the `_example` template. No feature may deviate from this structure.

**Rationale:** Ensures consistency, scalability, and AI-agent predictability. Every feature is independently testable, maintainable, and discoverable.

## ADR-002: Feature Template Structure

**Status:** Accepted

**Decision:** Every feature must contain: api, components, hooks, pages, routes, services, stores, types, schemas, constants, utils.

**Rationale:** Standardization enables AI agents to navigate any feature without prior knowledge. The template is the contract.

## ADR-003: AI Engineering Platform

**Status:** Accepted

**Decision:** The `.ai/` directory is the AI Operating System for this project. Every AI agent must read `.ai/` before starting work.

**Rationale:** Centralized execution standards prevent AI agents from making inconsistent decisions. The platform ensures quality, security, and architecture compliance without human intervention.
