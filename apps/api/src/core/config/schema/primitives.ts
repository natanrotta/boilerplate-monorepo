import { z } from "zod";

/**
 * A `true`/`false` env flag. Env vars are strings — the transform is what
 * turns `FEATURE_X=true` into a boolean so call sites never compare against
 * the string. Use it for every boolean toggle added to a concern schema.
 */
export const envFlag = () =>
  z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true");
