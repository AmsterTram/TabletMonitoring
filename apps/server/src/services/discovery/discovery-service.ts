import { AdbClient } from "../adb/adb-client.js";
import { DeviceRegistry } from "../devices/device-registry.js";

export class DiscoveryService {
  constructor(
    private readonly adbClient: AdbClient,
    private readonly registry: DeviceRegistry
  ) {}

  async refresh(): Promise<void> {
    const devices = await this.adbClient.listDevices();
    const seenIds = new Set<string>();

    for (const device of devices) {
      seenIds.add(device.serial);
      this.registry.upsert({
        id: device.serial,
        ip: device.serial.includes(":") ? device.serial.split(":")[0] : undefined,
        port: device.serial.includes(":") ? Number(device.serial.split(":")[1]) : undefined,
        connectionState:
          device.state === "device"
            ? "online"
            : device.state === "unauthorized"
              ? "unauthorized"
              : "unknown",
        info: {
          id: device.serial,
          displayName: device.serial
        },
        capabilities: {
          screen: true,
          camera: false,
          audio: false
        }
      });
    }

    for (const existing of this.registry.list()) {
      if (!seenIds.has(existing.id)) {
        this.registry.markOffline(existing.id);
      }
    }
  }
}
