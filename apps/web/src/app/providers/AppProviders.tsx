import { Suspense, type PropsWithChildren } from "react";
import { MotionConfig } from "motion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/modules/auth/presentation/context/AuthContext";
import { queryClient } from "@/core/query/queryClient";
import { COLOR_MODE_STORAGE_KEY } from "@/app/theme";
import { Provider as ChakraUIProvider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { lazyWithRetry } from "@/app/router/lazyWithRetry";

// `lazyWithRetry` (not raw `lazy`): this renders above the router, so a stale
// devtools chunk would otherwise crash straight to GlobalErrorBoundary.
const ReactQueryDevtools = import.meta.env.DEV
  ? lazyWithRetry(() =>
      import("@tanstack/react-query-devtools").then((m) => ({ default: m.ReactQueryDevtools }))
    )
  : () => null;

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ChakraUIProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={COLOR_MODE_STORAGE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
          {/* Sliding indicators and page transitions stand still for users
              who asked their system for less motion. */}
          <MotionConfig reducedMotion="user">
            <AuthProvider>{children}</AuthProvider>
          </MotionConfig>
        </GoogleOAuthProvider>
        <Toaster />
        <Suspense>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </Suspense>
      </QueryClientProvider>
    </ChakraUIProvider>
  );
}
