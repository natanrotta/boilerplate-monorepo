import "reflect-metadata";
import "@core/container";
import { errorReporter, initErrorReporter } from "@core/service/error-reporter";

initErrorReporter();

import http from "node:http";
import { app } from "@core/http";
import { logger } from "@core/http/logger";
import { env } from "@core/config";
import { container } from "@core/container";
import {
  buildShutdownPlan,
  installGracefulShutdown,
} from "@core/service/lifecycle";

const server = http.createServer(app);

// Installed BEFORE listen so a crash during startup still tears down cleanly.
// Everything about signals, fatal errors and exit codes lives in
// `core/service/lifecycle` — main.ts only bootstraps.
installGracefulShutdown({
  logger,
  timeoutMs: env.SHUTDOWN_TIMEOUT_MS,
  report: (error) => errorReporter.notify(error),
  plan: buildShutdownPlan({ container, server }),
});

server.listen(env.API_PORT, () => {
  logger.info(
    { port: env.API_PORT, environment: env.NODE_ENV },
    "Server started",
  );
});

export { server };
