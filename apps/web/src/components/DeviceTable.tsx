import { DeviceRecord } from "../api/client";

interface Props {
  devices: DeviceRecord[];
}

export function DeviceTable({ devices }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Device ID</th>
          <th>State</th>
          <th>Last Seen</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((device) => (
          <tr key={device.id}>
            <td>{device.id}</td>
            <td>{device.connectionState}</td>
            <td>{new Date(device.lastSeenAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
