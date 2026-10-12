import { Button, Flex, Input, Text, chakra } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { AuthShell } from "@/shared/components/layout/AuthShell";
import {
  AuthDivider,
  AuthIntro,
  AuthScreen,
  AuthLink,
} from "@/modules/auth/presentation/components/AuthCard";
import { useAuth } from "@/modules/auth/presentation/context/useAuth";
import { getPostAuthDestination } from "@/modules/auth/presentation/utils/postAuthDestination";
import type { AuthUser } from "@/modules/auth/domain/entities/AuthUser";

/**
 * Bridges deep-links that bounce through sign-in (any protected route the user
 * opened while signed out) with the standard post-auth destination logic. When the caller set
 * `location.state.from.pathname`, return there so the user lands exactly
 * where they intended; otherwise defer to {@link getPostAuthDestination}.
 */
function resolveSignInRedirect(state: unknown, user: AuthUser | null): string {
  if (state && typeof state === "object" && "from" in state) {
    const from = (state as { from?: { pathname?: string } }).from;
    if (from?.pathname && from.pathname !== ROUTE_PATHS.signIn) {
      return from.pathname;
    }
  }
  return getPostAuthDestination(user);
}
import { useNotify } from "@/shared/hooks/useNotify";
import { PasswordField } from "@/shared/components/forms/PasswordField";
import { GoogleSignInButton } from "@/modules/auth/presentation/components/GoogleSignInButton";
import { DevQuickLoginDrawer } from "@/modules/auth/presentation/components/DevQuickLoginDrawer";
import {
  buildSignInSchema,
  type SignInFormValues,
} from "@/modules/auth/domain/schemas";

export function SignInPage() {
  const { t, i18n } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useNotify();
  const { signIn, signInWithGoogle, isSubmitting } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(buildSignInSchema()),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleGoogleSuccess = async (credential: string) => {
    try {
      // Forward UI locale so brand-new accounts reaching here via Google
      // get user.language seeded correctly. Existing accounts ignore it.
      const session = await signInWithGoogle({
        credential,
        language: i18n.language,
      });
      navigate(resolveSignInRedirect(location.state, session.user), {
        replace: true,
      });
    } catch {
      showError(undefined, t("signIn.googleError"));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await signIn({
        email: values.email,
        password: values.password,
      });
      navigate(resolveSignInRedirect(location.state, session.user), {
        replace: true,
      });
    } catch {
      showError(undefined, t("signIn.authError"));
    }
  });

  return (
    <AuthShell
      crossLinkPrompt={t("signIn.noAccount")}
      crossLinkLabel={t("signIn.createAccount")}
      crossLinkTo={ROUTE_PATHS.register}
    >
      <AuthScreen
        intro={
          <AuthIntro
            eyebrow={tc("platform.tagline")}
            title={t("signIn.title")}
            subtitle={t("signIn.subtitle")}
          />
        }
        footer={
          <>
            {t("signIn.noAccount")}{" "}
            <AuthLink to={ROUTE_PATHS.register}>{t("signIn.createAccount")}</AuthLink>
          </>
        }
      >
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={() => showError(undefined, t("signIn.googleInitError"))}
        />

        <AuthDivider label={t("signIn.or")} />

        <chakra.form
          data-cy="sign-in-form"
          onSubmit={onSubmit}
          noValidate
          display="flex"
          flexDirection="column"
          gap={3.5}
        >
          <Field
            invalid={Boolean(errors.email)}
            label={t("signIn.emailLabel")}
            errorText={errors.email?.message}
          >
            {/* F-H6 exception: RHF register() needs a ref-spread input; FormField is controlled-only. */}
            <Input
              type="email"
              placeholder={t("signIn.emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
            />
          </Field>

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordField
                label={t("signIn.passwordLabel")}
                value={field.value}
                error={errors.password?.message}
                onChange={field.onChange}
                placeholder={t("signIn.passwordPlaceholder")}
                autoComplete="current-password"
              />
            )}
          />

          <Flex justify="flex-end" mt={-1}>
            <Text
              asChild
              fontSize="12.5px"
              color="text.muted"
              _hover={{ color: "text.primary" }}
            >
              <RouterLink
                to={ROUTE_PATHS.forgotPassword}
                data-cy="forgot-password-link"
              >
                {t("signIn.forgotPassword")}
              </RouterLink>
            </Text>
          </Flex>

          <Button
            type="submit"
            mt={1}
            loading={isSubmitting}
            loadingText={t("signIn.loading")}
          >
            {t("signIn.button")}
          </Button>
        </chakra.form>
      </AuthScreen>

      {/* Dev-only: tree-shaken out of every production build. */}
      {import.meta.env.DEV && <DevQuickLoginDrawer />}
    </AuthShell>
  );
}
