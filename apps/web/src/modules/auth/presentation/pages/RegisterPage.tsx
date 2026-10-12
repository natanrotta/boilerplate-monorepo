import { Box, Button, Input, chakra } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
import { useNotify } from "@/shared/hooks/useNotify";
import { PasswordField } from "@/shared/components/forms/PasswordField";
import { PasswordStrengthIndicator } from "@/shared/components/forms/PasswordStrengthIndicator";
import { GoogleSignInButton } from "@/modules/auth/presentation/components/GoogleSignInButton";
import {
  buildRegisterSchema,
  type RegisterFormValues,
} from "@/modules/auth/domain/schemas";

export function RegisterPage() {
  const { t, i18n } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const { showError } = useNotify();

  const { signUp, signInWithGoogle, isSubmitting } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(buildRegisterSchema()),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  });

  const password = watch("password");

  const handleGoogleSuccess = async (credential: string) => {
    try {
      // Pass the current UI locale so the backend persists it on user.language
      // for new accounts (no-op on existing accounts — they keep their saved
      // preference).
      const session = await signInWithGoogle({
        credential,
        language: i18n.language,
      });
      navigate(getPostAuthDestination(session.user), { replace: true });
    } catch {
      showError(undefined, t("register.googleError"));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
        // The chosen locale reaches the backend with the very first request so
        // user.language is persisted from the start.
        language: i18n.language,
      });
      // Account created unverified — confirm the e-mail PIN. The email is
      // carried in route state for the copy.
      navigate(ROUTE_PATHS.verifyEmail, {
        replace: true,
        state: { email: result.email },
      });
    } catch (error) {
      showError(error, t("register.createError"));
    }
  });

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
            eyebrow={tc("platform.tagline")}
            title={t("register.title")}
            subtitle={t("register.subtitle")}
          />
        }
        footer={
          <>
            {t("register.hasAccount")}{" "}
            <AuthLink to={ROUTE_PATHS.signIn}>{t("register.signIn")}</AuthLink>
          </>
        }
      >
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={() => showError(undefined, t("register.googleError"))}
        />

        <AuthDivider label={t("register.or")} />

        <chakra.form
          data-cy="register-form"
          onSubmit={onSubmit}
          noValidate
          display="flex"
          flexDirection="column"
          gap={3.5}
        >
          <Field
            invalid={Boolean(errors.name)}
            label={t("register.nameLabel")}
            errorText={errors.name?.message}
          >
            {/* F-H6 exception: RHF register() needs a ref-spread input; FormField is controlled-only. */}
            <Input
              placeholder={t("register.namePlaceholder")}
              autoComplete="name"
              {...register("name")}
            />
          </Field>

          <Field
            invalid={Boolean(errors.email)}
            label={t("register.emailLabel")}
            errorText={errors.email?.message}
          >
            {/* F-H6 exception: RHF register() needs a ref-spread input; FormField is controlled-only. */}
            <Input
              type="email"
              placeholder={t("register.emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
            />
          </Field>

          <Box>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <PasswordField
                  label={t("register.passwordLabel")}
                  value={field.value}
                  error={errors.password?.message}
                  onChange={field.onChange}
                  placeholder={t("register.passwordPlaceholder")}
                  autoComplete="new-password"
                />
              )}
            />
            <PasswordStrengthIndicator password={password ?? ""} />
          </Box>

          <Button
            type="submit"
            mt={1}
            loading={isSubmitting}
            loadingText={t("register.loading")}
          >
            {t("register.button")}
          </Button>
        </chakra.form>
      </AuthScreen>
    </AuthShell>
  );
}
