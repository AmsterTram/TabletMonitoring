export interface DeviceRecord {
  id: string;
  connectionState: string;
  lastSeenAt: string;
}

export async function fetchDevices(baseUrl = "http://127.0.0.1:8787") {
  const response = await fetch(`${baseUrl}/api/devices`);
  if (!response.ok) {
    throw new Error(`Failed to fetch devices: ${response.status}`);
  }
  return (await response.json()) as { devices: DeviceRecord[] };
}
