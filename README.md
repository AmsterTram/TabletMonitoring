# Tablet Monitoring

Phase 1 scaffold for a LAN-only Android tablet control center.

## Quick start

1. Copy `.env.example` to `.env` and adjust `ADB_PATH` / `SCRCPY_PATH`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run server:
   ```bash
   npm run dev:server
   ```
4. Run web UI (in another terminal):
   ```bash
   npm run dev:web
   ```

## Current Phase 1 capabilities

- Poll ADB devices on a configurable interval (default 10s)
- List known devices via REST API and web table
- Connect/disconnect/reconnect device over ADB TCP/IP
- Session registry with overview/active conflict prevention (in-memory)

## Notes

- scrcpy process launch is intentionally deferred to next implementation step.
- This project is LAN-only and not internet-facing.
