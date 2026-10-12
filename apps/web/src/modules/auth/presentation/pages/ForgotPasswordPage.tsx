import { Button, Flex, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { FiCheckCircle } from "@/shared/components/icons";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { AuthShell } from "@/shared/components/layout/AuthShell";
import {
  AuthIntro,
  AuthScreen,
} from "@/modules/auth/presentation/components/AuthCard";
import { useAuth } from "@/modules/auth/presentation/context/useAuth";
import { useNotify } from "@/shared/hooks/useNotify";
import { FormField } from "@/shared/components/forms/FormField";

export function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const { requestPasswordReset } = useAuth();
  const { showError } = useNotify();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError(t("forgotPassword.emailRequired"));
      return;
    }
    setEmailError(undefined);

    setIsSubmitting(true);
    try {
      await requestPasswordReset({ email });
      setSent(true);
    } catch {
      showError(undefined, t("forgotPassword.requestError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const card = (
    <>
      {sent ? (
        <Stack gap={5} align="stretch">
          <Flex
            align="center"
            gap={3}
            p={4}
            bg="status.info.bg"
            color="status.info.fg"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="status.info.border"
          >
            <Icon as={FiCheckCircle} boxSize={5} flexShrink={0} />
            <Text fontSize="sm" fontWeight="500">
              {t("forgotPassword.sentMessage", { email })}
            </Text>
          </Flex>
          <Text fontSize="sm" color="text.secondary">
            {t("forgotPassword.sentHint")}
          </Text>
          <Button asChild variant="outline" size="lg">
            <RouterLink to={ROUTE_PATHS.signIn}>
              {t("forgotPassword.backToSignIn")}
            </RouterLink>
          </Button>
        </Stack>
      ) : (
        <Stack as="form" gap={4} onSubmit={handleSubmit}>
          <FormField
            label={t("forgotPassword.emailLabel")}
            type="email"
            value={email}
            error={emailError}
            onChange={setEmail}
            placeholder={t("forgotPassword.emailPlaceholder")}
          />
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            loadingText={t("forgotPassword.submitting")}
            mt={2}
          >
            {t("forgotPassword.submit")}
          </Button>
          <Text color="text.secondary" fontSize="sm" textAlign="center">
            <Link asChild color="text.link" fontWeight="600">
              <RouterLink to={ROUTE_PATHS.signIn}>
                {t("forgotPassword.backToSignIn")}
              </RouterLink>
            </Link>
          </Text>
        </Stack>
      )}
    </>
  );

  return (
    <AuthShell
      crossLinkPrompt={t("register.hasAccount")}
      crossLinkLabel={t("register.signIn")}
      crossLinkTo={ROUTE_PATHS.signIn}
    >
      <AuthScreen
        maxW="400px"
        intro={
          <AuthIntro
            eyebrow={tc("platform.name")}
            title={t("forgotPassword.title")}
            subtitle={t("forgotPassword.subtitle")}
          />
        }
      >
        {card}
      </AuthScreen>
    </AuthShell>
  );
}
