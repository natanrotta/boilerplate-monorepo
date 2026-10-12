import { z } from "zod";

/** `POST /dev/impersonate` body — the user to sign in as. */
export const DevImpersonateDTOSchema = z.object({
  userId: z.string().uuid(),
});

export type DevImpersonateDTO = z.infer<typeof DevImpersonateDTOSchema>;

export type { DevUserListItemDTO } from "@boilerplate/shared-types";
