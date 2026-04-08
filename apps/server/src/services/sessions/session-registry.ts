import { randomUUID } from "node:crypto";
import { SessionMode, SessionRecord, SessionStreamType } from "../../models/session.js";
import { nowIso } from "../../utils/time.js";

export class SessionRegistry {
  private readonly sessions = new Map<string, SessionRecord>();

  start(deviceId: string, mode: SessionMode, streamType: SessionStreamType): SessionRecord {
    const duplicate = this.findRunningByDeviceAndStream(deviceId, streamType);
    if (duplicate) {
      if (duplicate.mode === "active" || mode === "overview") {
        return duplicate;
      }
      this.stop(duplicate.id);
    }

    const session: SessionRecord = {
      id: randomUUID(),
      deviceId,
      mode,
      streamType,
      status: "running",
      startedAt: nowIso()
    };
    this.sessions.set(session.id, session);
    return session;
  }

  stop(sessionId: string): SessionRecord | undefined {
    const existing = this.sessions.get(sessionId);
    if (!existing) return undefined;
    const updated: SessionRecord = {
      ...existing,
      status: "stopped",
      endedAt: nowIso()
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  list(): SessionRecord[] {
    return [...this.sessions.values()].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  }

  hasActiveSession(deviceId: string): boolean {
    return this.list().some((session) =>
      session.deviceId === deviceId && session.mode === "active" && session.status === "running"
    );
  }

  private findRunningByDeviceAndStream(deviceId: string, streamType: SessionStreamType): SessionRecord | undefined {
    return this.list().find((session) =>
      session.deviceId === deviceId && session.streamType === streamType && session.status === "running"
    );
  }
}
