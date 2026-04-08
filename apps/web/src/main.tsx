import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { DeviceTable } from "./components/DeviceTable";
import { DeviceRecord, fetchDevices } from "./api/client";

function App() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetchDevices();
        if (!cancelled) {
          setDevices(response.devices);
          setError(null);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Unknown error");
        }
      }
    }

    load();
    const interval = setInterval(load, 10_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", margin: "1rem" }}>
      <h1>Tablet Monitoring Control Center (Phase 1)</h1>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      <DeviceTable devices={devices} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
