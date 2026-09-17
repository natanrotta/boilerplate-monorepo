import type { ILoggerProvider } from "@shared/provider/logger-provider.interface";

export interface ShutdownStep {
  readonly name: string;
  readonly run: () => Promise<void>;
}

/** Stages run in order; the steps inside one stage run concurrently. */
export type ShutdownPlan = ReadonlyArray<ReadonlyArray<ShutdownStep>>;

export interface GracefulShutdownOptions {
  readonly logger: ILoggerProvider;
  readonly plan: ShutdownPlan;
  /**
   * Hard ceiling for the whole teardown. Must stay under the orchestrator's
   * kill grace (`stop_grace_period` in the deploy compose) so a hung step
   * still ends in our own exit code instead of a SIGKILL. The app passes
   * `SHUTDOWN_TIMEOUT_MS`.
   */
  readonly timeoutMs?: number;
  /**
   * Delivers a fatal error (uncaught exception / unhandled rejection) to the
   * error reporter. Awaited alongside the plan and bounded by `timeoutMs`, so
   * the report leaves the process before it exits — the app owns the exit,
   * the SDK's own process-level listeners stay off. Must never reject.
   */
  readonly report?: (error: Error) => Promise<void>;
  /** Injected for tests; `process.exit` in production. */
  readonly exit?: (code: number) => void;
  /** Where the signals come from; `process` in production. */
  readonly source?: NodeJS.EventEmitter;
}

export interface GracefulShutdown {
  /** Runs the plan once; a second call while it runs returns the same promise. */
  shutdown(reason: string, exitCode?: number): Promise<void>;
}

const DEFAULT_TIMEOUT_MS = 30_000;

const describeError = (error: unknown): Record<string, unknown> =>
  error instanceof Error
    ? { message: error.message, stack: error.stack }
    : { message: String(error) };

const toError = (reason: unknown): Error =>
  reason instanceof Error ? reason : new Error(String(reason));

/**
 * Process lifecycle in one place: SIGTERM/SIGINT → orderly teardown → exit 0;
 * an uncaught exception or unhandled rejection → the same teardown → exit 1.
 *
 * Every step is awaited with `allSettled`, so one failing teardown (Redis
 * already gone, say) is logged and never blocks the steps after it — the
 * later stages still run. A step that hangs is bounded by `timeoutMs`.
 */
export function installGracefulShutdown(
  options: GracefulShutdownOptions,
): GracefulShutdown {
  const {
    logger,
    plan,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    report,
    exit = (code) => process.exit(code),
    source = process,
  } = options;

  let inFlight: Promise<void> | null = null;
  let exited = false;
  /**
   * The code the process will exit with. A fatal only ever ESCALATES it: a
   * crash that lands while a plain SIGTERM teardown is already running must
   * still end in a non-zero exit, never be downgraded to the signal's 0.
   */
  let exitCode = 0;
  /**
   * Everything the process must await before exiting: the teardown plan plus
   * one entry per fatal report. It can GROW after the teardown starts (a crash
   * during a plain shutdown), which is why `drain()` re-checks instead of
   * awaiting a fixed list.
   */
  const work: Promise<unknown>[] = [];

  // The timeout and the plan can both reach the exit; only the first counts.
  const finish = (code: number): void => {
    if (exited) return;
    exited = true;
    exit(code);
  };

  /**
   * Awaits `work` until it stops growing, so a report queued while the teardown
   * is already in flight still leaves the process before it exits.
   */
  const drain = async (): Promise<void> => {
    let awaited = 0;
    while (work.length > awaited) {
      awaited = work.length;
      await Promise.all(work);
    }
  };

  const runPlan = async (reason: string): Promise<void> => {
    for (const stage of plan) {
      // `Promise.resolve().then(...)` turns a step that throws synchronously
      // into a rejection, so it is isolated like any other failed step.
      const results = await Promise.allSettled(
        stage.map((step) => Promise.resolve().then(() => step.run())),
      );
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          logger.error(
            {
              reason,
              step: stage[index]!.name,
              ...describeError(result.reason),
            },
            "Shutdown step failed",
          );
        }
      });
    }
  };

  const run = (
    reason: string,
    requestedExitCode: number,
    fatal?: Error,
  ): Promise<void> => {
    // Escalate, never downgrade: a fatal arriving during a plain shutdown owns
    // the exit code.
    if (requestedExitCode > exitCode) exitCode = requestedExitCode;

    // Queued BEFORE the re-entrancy guard on purpose. A crash that lands while
    // SIGTERM's teardown is already running must still be reported — returning
    // the in-flight promise here would have silently dropped it.
    if (fatal && report) {
      work.push(
        report(fatal).catch((error: unknown) =>
          logger.warn(
            { reason, ...describeError(error) },
            "Fatal error report failed",
          ),
        ),
      );
    }

    if (inFlight) {
      logger.warn({ reason, exitCode }, "Shutdown already in progress");
      return inFlight;
    }
    logger.info({ reason, exitCode }, "Shutting down gracefully");

    const timer = setTimeout(() => {
      logger.error({ reason, timeoutMs }, "Shutdown timed out — exiting");
      finish(1);
    }, timeoutMs);

    work.push(runPlan(reason));

    inFlight = drain().then(() => {
      clearTimeout(timer);
      logger.info({ reason, exitCode }, "Shutdown complete");
      finish(exitCode);
    });
    return inFlight;
  };

  const shutdown = (reason: string, exitCode = 0): Promise<void> =>
    run(reason, exitCode);

  source.on("SIGTERM", () => void shutdown("SIGTERM"));
  source.on("SIGINT", () => void shutdown("SIGINT"));
  source.on("uncaughtException", (error: Error) => {
    logger.error(describeError(error), "Uncaught exception");
    void run("uncaughtException", 1, toError(error));
  });
  source.on("unhandledRejection", (reason: unknown) => {
    logger.error(describeError(reason), "Unhandled promise rejection");
    void run("unhandledRejection", 1, toError(reason));
  });

  return { shutdown };
}
