import { DeviceRecord } from "../../models/device.js";
import { nowIso } from "../../utils/time.js";

export class DeviceRegistry {
  private readonly devices = new Map<string, DeviceRecord>();

  upsert(next: Omit<DeviceRecord, "createdAt" | "updatedAt" | "lastSeenAt">): DeviceRecord {
    const timestamp = nowIso();
    const existing = this.devices.get(next.id);
    const record: DeviceRecord = {
      ...next,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
      lastSeenAt: timestamp
    };
    this.devices.set(record.id, record);
    return record;
  }

  markOffline(id: string): void {
    const existing = this.devices.get(id);
    if (!existing) return;
    this.devices.set(id, {
      ...existing,
      connectionState: "offline",
      updatedAt: nowIso()
    });
  }

  get(id: string): DeviceRecord | undefined {
    return this.devices.get(id);
  }

  list(): DeviceRecord[] {
    return [...this.devices.values()].sort((a, b) => a.id.localeCompare(b.id));
  }
}
