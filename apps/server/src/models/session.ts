export type SessionMode = "overview" | "active";
export type SessionStreamType = "screen" | "camera" | "audio";
export type SessionStatus = "starting" | "running" | "stopped" | "error";

export interface SessionRecord {
  id: string;
  deviceId: string;
  mode: SessionMode;
  streamType: SessionStreamType;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  errorMessage?: string;
}
