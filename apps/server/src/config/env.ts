import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  host: string;
  port: number;
  adbPath: string;
  scrcpyPath: string;
  overviewIntervalSec: number;
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return {
    host: process.env.HOST ?? "127.0.0.1",
    port: Number(process.env.PORT ?? 8787),
    adbPath: required("ADB_PATH", "adb"),
    scrcpyPath: required("SCRCPY_PATH", "scrcpy"),
    overviewIntervalSec: Number(process.env.OVERVIEW_INTERVAL_SEC ?? 10)
  };
}
