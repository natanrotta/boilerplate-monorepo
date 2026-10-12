import { Button, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { PinInput } from "@/components/ui/pin-input";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { AuthShell } from "@/shared/components/layout/AuthShell";
import {
  AuthIntro,
  AuthScreen,
} from "@/modules/auth/presentation/components/AuthCard";
import { useAuth } from "@/modules/auth/presentation/context/useAuth";
import { getPostAuthDestination } from "@/modules/auth/presentation/utils/postAuthDestination";
import { useNotify } from "@/shared/hooks/useNotify";

const PIN_LENGTH = 6;
/** Mirrors the backend resend cooldown (EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS). */
const RESEND_COOLDOWN_SECONDS = 60;

export function EmailVerificationPage() {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sendVerificationPin,
    verifyEmailPin,
    discardEmailVerification,
    isSubmitting,
  } = useAuth();
  const { showError, showSuccess } = useNotify();

  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [pin, setPin] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  // StrictMode runs effects twice in dev — guard the initial auto-send so we
  // don't trip the server-side cooldown on first paint.
  const hasSentRef = useRef(false);
  // PinInput's onComplete and the submit button can both fire handleVerify;
  // guard against a double submit while a verify is in flight.
  const isVerifyingRef = useRef(false);

  // Dispatch the first PIN once on mount.
  useEffect(() => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;
    void sendVerificationPin().catch((error: unknown) => {
      // On a page refresh the auto-send may hit the server-side cooldown — a
      // code is already in the inbox, so swallow that specific error instead
      // of showing a misleading "couldn't send" toast.
      const code = (error as { code?: string } | null)?.code;
      if (code === "AUTH_EMAIL_VERIFICATION_RATE_LIMITED") return;
      showError(error, t("verifyEmail.sendError"));
    });
  }, [sendVerificationPin, showError, t]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(
      () => setCooldown((s) => (s <= 1 ? 0 : s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (isVerifyingRef.current) return;
      isVerifyingRef.current = true;
      try {
        const session = await verifyEmailPin(code);
        navigate(getPostAuthDestination(session.user), { replace: true });
      } catch (error) {
        setPin("");
        showError(error, t("verifyEmail.verifyError"));
      } finally {
        isVerifyingRef.current = false;
      }
    },
    [verifyEmailPin, navigate, showError, t],
  );

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await sendVerificationPin();
      setCooldown(RESEND_COOLDOWN_SECONDS);
      showSuccess(t("verifyEmail.resendSuccess"));
    } catch (error) {
      showError(error, t("verifyEmail.sendError"));
    } finally {
      setIsResending(false);
    }
  }, [cooldown, isResending, sendVerificationPin, showSuccess, showError, t]);

  const card = (
    <>
      <Stack gap={6}>
        <HStack justify="center" gap={{ base: 2, md: 3 }}>
          <PinInput
            otp
            type="numeric"
            count={PIN_LENGTH}
            value={pin.split("")}
            onValueChange={(e) => setPin(e.value.join(""))}
            onValueComplete={(e) => handleVerify(e.value.join(""))}
            disabled={isSubmitting}
            size="lg"
            autoFocus
          />
        </HStack>

        <Button
          size="lg"
          onClick={() => handleVerify(pin)}
          loading={isSubmitting}
          loadingText={t("verifyEmail.verifying")}
          disabled={pin.length !== PIN_LENGTH}
        >
          {t("verifyEmail.submit")}
        </Button>

        <Flex justify="center" align="center" gap={1.5}>
          <Text fontSize="sm" color="text.secondary">
            {t("verifyEmail.noCode")}
          </Text>
          <Button
            variant="plain"
            size="sm"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            loading={isResending}
            color="text.brand"
            fontWeight="600"
            textDecoration="underline"
            h="auto"
            p={0}
          >
            {cooldown > 0
              ? t("verifyEmail.resendIn", { seconds: cooldown })
              : t("verifyEmail.resend")}
          </Button>
        </Flex>

        <Text color="text.secondary" fontSize="sm" textAlign="center">
          <Link
            asChild
            onClick={discardEmailVerification}
            color="text.brand"
            fontWeight="600"
          >
            <RouterLink to={ROUTE_PATHS.register}>
              {t("verifyEmail.backToRegister")}
            </RouterLink>
          </Link>
        </Text>
      </Stack>
    </>
  );

  return (
    <AuthShell>
      <AuthScreen
        maxW="400px"
        intro={
          <AuthIntro
            eyebrow={tc("platform.name")}
            title={t("verifyEmail.title")}
            subtitle={
              email
                ? t("verifyEmail.subtitleWithEmail", { email })
                : t("verifyEmail.subtitle")
            }
          />
        }
      >
        {card}
      </AuthScreen>
    </AuthShell>
  );
}
