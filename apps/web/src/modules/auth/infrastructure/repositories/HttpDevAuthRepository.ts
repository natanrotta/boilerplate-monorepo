import { httpClient } from "@/core/http/httpClient";
import type { DevUserListItem } from "@/modules/auth/domain/entities/DevUser";

/**
 * Dev-only repository for the quick-login panel on the sign-in page.
 * `impersonate` sets the same httpOnly session cookies as a real
 * sign-in, so the rest of the app (httpClient, AuthContext) cannot tell the
 * difference.
 *
 * Every call fails outside a local machine: the API mounts `/dev/*` only when
 * NODE_ENV === "local" AND DEV_QUICK_LOGIN_ENABLED === true.
 */
export class HttpDevAuthRepository {
  async listUsers(signal?: AbortSignal): Promise<DevUserListItem[]> {
    return httpClient.get<never, DevUserListItem[]>("/dev/users", {
      signal,
      // The sign-in page is unauthenticated by definition.
      skipSessionExpiredRedirect: true,
    });
  }

  async impersonate(userId: string): Promise<void> {
    await httpClient.post("/dev/impersonate", { userId });
  }
}
