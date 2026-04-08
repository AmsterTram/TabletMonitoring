import { FastifyInstance } from "fastify";
import { AdbClient } from "../services/adb/adb-client.js";
import { DeviceRegistry } from "../services/devices/device-registry.js";
import { SessionRegistry } from "../services/sessions/session-registry.js";

interface ConnectBody {
  ip: string;
  port?: number;
}

interface SessionBody {
  deviceId: string;
  mode: "overview" | "active";
  streamType: "screen" | "camera" | "audio";
}

export function registerRoutes(
  app: FastifyInstance,
  deps: { adbClient: AdbClient; devices: DeviceRegistry; sessions: SessionRegistry }
): void {
  app.get("/api/health", async () => ({ ok: true }));

  app.get("/api/devices", async () => ({ devices: deps.devices.list() }));

  app.get("/api/sessions", async () => ({ sessions: deps.sessions.list() }));

  app.post<{ Body: ConnectBody }>("/api/devices/connect", async (request, reply) => {
    const port = request.body.port ?? 5555;
    const message = await deps.adbClient.connect(request.body.ip, port);
    return reply.send({ ok: true, message });
  });

  app.post<{ Params: { id: string } }>("/api/devices/:id/disconnect", async (request, reply) => {
    const message = await deps.adbClient.disconnect(request.params.id);
    return reply.send({ ok: true, message });
  });

  app.post<{ Params: { id: string } }>("/api/devices/:id/reconnect", async (request, reply) => {
    await deps.adbClient.disconnect(request.params.id);
    const [ip, port] = request.params.id.split(":");
    const message = await deps.adbClient.connect(ip, Number(port ?? 5555));
    return reply.send({ ok: true, message });
  });

  app.post<{ Body: SessionBody }>("/api/sessions/start", async (request, reply) => {
    const session = deps.sessions.start(request.body.deviceId, request.body.mode, request.body.streamType);
    return reply.send({ ok: true, session });
  });

  app.post<{ Params: { id: string } }>("/api/sessions/:id/stop", async (request, reply) => {
    const session = deps.sessions.stop(request.params.id);
    if (!session) {
      return reply.code(404).send({ ok: false, error: "Session not found" });
    }
    return reply.send({ ok: true, session });
  });
}
