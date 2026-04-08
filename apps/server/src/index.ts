import Fastify from "fastify";
import { loadConfig } from "./config/env.js";
import { registerRoutes } from "./api/routes.js";
import { AdbClient } from "./services/adb/adb-client.js";
import { DeviceRegistry } from "./services/devices/device-registry.js";
import { DiscoveryService } from "./services/discovery/discovery-service.js";
import { SessionRegistry } from "./services/sessions/session-registry.js";

const config = loadConfig();
const app = Fastify({ logger: true });

const adbClient = new AdbClient(config.adbPath);
const devices = new DeviceRegistry();
const sessions = new SessionRegistry();
const discovery = new DiscoveryService(adbClient, devices);

registerRoutes(app, { adbClient, devices, sessions });

const timer = setInterval(async () => {
  try {
    await discovery.refresh();
  } catch (error) {
    app.log.error({ error }, "Discovery refresh failed");
  }
}, config.overviewIntervalSec * 1000);

await app.listen({ host: config.host, port: config.port });
app.log.info(`Server listening on http://${config.host}:${config.port}`);

process.on("SIGINT", async () => {
  clearInterval(timer);
  await app.close();
  process.exit(0);
});
