import { useMutation, useQuery } from "@tanstack/react-query";
import { AppError } from "@/core/errors/AppError";
import { STALE_TIMES } from "@/core/query/staleTimes";
import type { DevUserListItem } from "@/modules/auth/domain/entities/DevUser";
// Dev-only quick login: this repository has no domain port / DI registration on
// purpose (its /dev/* routes only exist on a local machine), so the hook
// instantiates the infrastructure adapter directly. This is the one sanctioned
// exception to the presentation → infrastructure boundary — see
// `.claude/patterns/frontend.md` § Dev quick login.
// eslint-disable-next-line no-restricted-imports
import { HttpDevAuthRepository } from "@/modules/auth/infrastructure/repositories/HttpDevAuthRepository";

const repo = new HttpDevAuthRepository();

// Dev-only: deliberately outside the `queryKeys` factory, so the registry is
// not polluted with an API that does not exist in production.
const DEV_USERS_QUERY_KEY = ["dev", "users"] as const;

/**
 * State of the dev-only quick-login panel: the users of the local database and
 * an `impersonate` mutation. Callers MUST gate usage by `import.meta.env.DEV`
 * — the hook does not check.
 */
export function useDevQuickLogin() {
  const usersQuery = useQuery<DevUserListItem[]>({
    queryKey: DEV_USERS_QUERY_KEY,
    queryFn: ({ signal }) => repo.listUsers(signal),
    staleTime: STALE_TIMES.default,
    retry: false,
  });

  const impersonate = useMutation({
    mutationFn: (userId: string) => repo.impersonate(userId),
  });

  const { error } = usersQuery;

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    /** The API answered 404: the routes are not mounted (flag off). */
    isDisabled: error instanceof AppError && error.statusCode === 404,
    refetch: usersQuery.refetch,
    impersonate: impersonate.mutateAsync,
    impersonatingId: impersonate.isPending
      ? (impersonate.variables ?? null)
      : null,
  };
}
