import {
  Box,
  Button,
  Flex,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/avatar";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { useDevQuickLogin } from "@/modules/auth/presentation/hooks/useDevQuickLogin";
import { useNotify } from "@/shared/hooks/useNotify";

/**
 * The body of the dev quick login (shown inside
 * `DevQuickLoginDrawer`): lists the active users of the local database and
 * signs in as one with a click.
 *
 * IMPORTANT: mount it ONLY under `import.meta.env.DEV`. The endpoints it calls
 * (`/dev/users`, `/dev/impersonate`) exist only when the API runs with
 * NODE_ENV=local and DEV_QUICK_LOGIN_ENABLED=true — when they do not, the
 * panel renders nothing.
 */
export function DevQuickLoginPanel() {
  const { t } = useTranslation("auth");
  const { showError } = useNotify();
  const {
    users,
    isLoading,
    isError,
    isDisabled,
    refetch,
    impersonate,
    impersonatingId,
  } = useDevQuickLogin();

  if (isDisabled) return null;

  const handleImpersonate = async (userId: string) => {
    try {
      await impersonate(userId);
      // Full reload so AuthContext re-bootstraps from the fresh httpOnly
      // session cookie. Dev-only code path.
      window.location.assign(ROUTE_PATHS.dashboard);
    } catch {
      showError(undefined, t("signIn.devLogin.impersonateError"));
    }
  };

  return (
    <Box data-cy="dev-quick-login">
      <Text fontSize="xs" color="text.secondary" mb={4}>
        {t("signIn.devLogin.hint")}
      </Text>

      {isLoading && (
        <Stack gap={2}>
          <Skeleton height="56px" borderRadius="lg" />
          <Skeleton height="56px" borderRadius="lg" />
        </Stack>
      )}

      {isError && (
        <Stack gap={3} align="flex-start">
          <Text fontSize="sm" color="text.secondary">
            {t("signIn.devLogin.error")}
          </Text>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            {t("signIn.devLogin.retry")}
          </Button>
        </Stack>
      )}

      {!isLoading && !isError && users.length === 0 && (
        <Text fontSize="sm" color="text.secondary">
          {t("signIn.devLogin.empty")}
        </Text>
      )}

      {!isLoading && !isError && users.length > 0 && (
        <Stack gap={2} maxH="320px" overflowY="auto" pr={1}>
          {users.map((user) => (
            <Button
              key={user.id}
              data-cy="dev-quick-login-user"
              onClick={() => handleImpersonate(user.id)}
              disabled={Boolean(impersonatingId)}
              variant="outline"
              // Deliberate exception (dev-only): a tall multi-line list row
              // (avatar + name + email), so it grows past the recipe height.
              h="auto"
              py={3}
              px={3}
              justifyContent="flex-start"
              textAlign="left"
              w="full"
            >
              <Flex align="center" gap={3} w="full" minW={0}>
                <Avatar size="sm" name={user.name} src={user.avatarUrl ?? undefined} />
                <Box flex="1" minW={0}>
                  <Text fontWeight="600" fontSize="sm" color="text.primary" lineClamp={1}>
                    {user.name}
                  </Text>
                  <Text fontSize="xs" color="text.secondary" lineClamp={1}>
                    {user.email}
                  </Text>
                </Box>
                {impersonatingId === user.id && <Spinner size="sm" color="text.brand" />}
              </Flex>
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
}
