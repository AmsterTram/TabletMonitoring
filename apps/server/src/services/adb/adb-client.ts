import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface AdbDeviceLine {
  serial: string;
  state: string;
  details: string;
}

export class AdbClient {
  constructor(private readonly adbPath: string) {}

  async listDevices(): Promise<AdbDeviceLine[]> {
    const { stdout } = await execFileAsync(this.adbPath, ["devices", "-l"]);
    const lines = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("List of devices"));

    return lines.map((line) => {
      const [serial = "", state = "unknown", ...rest] = line.split(/\s+/);
      return { serial, state, details: rest.join(" ") };
    });
  }

  async connect(ip: string, port: number): Promise<string> {
    const { stdout, stderr } = await execFileAsync(this.adbPath, ["connect", `${ip}:${port}`]);
    return `${stdout}${stderr}`.trim();
  }

  async disconnect(serial: string): Promise<string> {
    const { stdout, stderr } = await execFileAsync(this.adbPath, ["disconnect", serial]);
    return `${stdout}${stderr}`.trim();
  }
}
