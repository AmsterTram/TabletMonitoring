# Architecture (Phase 1)

- `apps/server`: Fastify API, ADB wrapper, discovery loop, in-memory registries.
- `apps/web`: Minimal React dashboard for known device list.
- `packages/shared`: Reserved for shared DTOs/types across server and web.

Phase 1 focuses on device inventory correctness and session model invariants.
