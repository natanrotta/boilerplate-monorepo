import { Button, Link, Stack, Text } from "@chakra-ui/react";
import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { AuthShell } from "@/shared/components/layout/AuthShell";
import {
  AuthIntro,
  AuthScreen,
} from "@/modules/auth/presentation/components/AuthCard";
import { useAuth } from "@/modules/auth/presentation/context/useAuth";
import { useNotify } from "@/shared/hooks/useNotify";
import { PasswordField } from "@/shared/components/forms/PasswordField";
import { PasswordStrengthIndicator } from "@/shared/components/forms/PasswordStrengthIndicator";
import { isPasswordStrong } from "@/shared/utils/passwordValidation";

interface ResetFormErrors {
  password?: string;
  confirm?: string;
}

export function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const { showError, showSuccess } = useNotify();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<ResetFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const next: ResetFormErrors = {};
    if (!password) {
      next.password = t("resetPassword.passwordRequired");
    } else if (!isPasswordStrong(password)) {
      next.password = t("resetPassword.passwordWeak");
    }
    if (password !== confirm) {
      next.confirm = t("resetPassword.confirmMismatch");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await resetPassword({ token, password });
      showSuccess(t("resetPassword.success"));
      navigate(ROUTE_PATHS.signIn, { replace: true });
    } catch (error) {
      showError(error, t("resetPassword.failure"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const invalidToken = !token;

  const card = (
    <>
      {invalidToken ? (
        <Stack gap={4}>
          <Text color="text.secondary" fontSize="sm">
            {t("resetPassword.missingToken")}
          </Text>
          <Button asChild size="lg">
            <RouterLink to={ROUTE_PATHS.forgotPassword}>
              {t("resetPassword.requestNew")}
            </RouterLink>
          </Button>
        </Stack>
      ) : (
        <Stack as="form" gap={4} onSubmit={handleSubmit}>
          <PasswordField
            label={t("resetPassword.passwordLabel")}
            value={password}
            error={errors.password}
            onChange={setPassword}
            placeholder={t("resetPassword.passwordPlaceholder")}
          />
          <PasswordStrengthIndicator password={password} />
          <PasswordField
            label={t("resetPassword.confirmLabel")}
            value={confirm}
            error={errors.confirm}
            onChange={setConfirm}
            placeholder={t("resetPassword.confirmPlaceholder")}
          />
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            loadingText={t("resetPassword.submitting")}
            mt={2}
          >
            {t("resetPassword.submit")}
          </Button>
          <Text color="text.secondary" fontSize="sm" textAlign="center">
            <Link asChild color="text.link" fontWeight="600">
              <RouterLink to={ROUTE_PATHS.signIn}>
                {t("resetPassword.backToSignIn")}
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
            title={t("resetPassword.title")}
            subtitle={t("resetPassword.subtitle")}
          />
        }
      >
        {card}
      </AuthScreen>
    </AuthShell>
  );
}
