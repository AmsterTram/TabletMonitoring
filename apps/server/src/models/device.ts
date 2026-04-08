export type ConnectionState = "online" | "offline" | "unauthorized" | "unknown";

export interface DeviceCapabilities {
  screen: boolean;
  camera: boolean;
  audio: boolean;
}

export interface DeviceInfo {
  id: string;
  displayName: string;
  model?: string;
  manufacturer?: string;
  androidVersion?: string;
}

export interface DeviceRecord {
  id: string;
  ip?: string;
  port?: number;
  connectionState: ConnectionState;
  info: DeviceInfo;
  capabilities: DeviceCapabilities;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}
