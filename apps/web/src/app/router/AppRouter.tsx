import { Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { lazyWithRetry } from "@/app/router/lazyWithRetry";
import { ProtectedRoute } from "@/app/router/guards/ProtectedRoute";
import { PublicOnlyRoute } from "@/app/router/guards/PublicOnlyRoute";
import { NotFoundPage } from "@/app/router/NotFoundPage";
import { RouteErrorBoundary } from "@/shared/components/ui/RouteErrorBoundary";
import { PageTransition } from "@/shared/components/animations/PageTransition";
import { AppShell } from "@/shared/components/layout/AppShell";
import { RouteContentSkeleton } from "@/shared/components/skeletons/RouteContentSkeleton";

// Lazy-loaded pages — each becomes a separate chunk. A page that belongs to a
// module is imported through that module's barrel (its public API).
const RegisterPage = lazyWithRetry(() =>
  import("@/modules/auth/presentation/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);
const SignInPage = lazyWithRetry(() =>
  import("@/modules/auth/presentation/pages/SignInPage").then((m) => ({ default: m.SignInPage }))
);
const EmailVerificationPage = lazyWithRetry(() =>
  import("@/modules/auth/presentation/pages/EmailVerificationPage").then((m) => ({
    default: m.EmailVerificationPage,
  }))
);
const ForgotPasswordPage = lazyWithRetry(() =>
  import("@/modules/auth/presentation/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const ResetPasswordPage = lazyWithRetry(() =>
  import("@/modules/auth/presentation/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  }))
);
const DashboardPage = lazyWithRetry(() =>
  import("@/modules/dashboard").then((m) => ({ default: m.DashboardPage }))
);
const SettingsPage = lazyWithRetry(() =>
  import("@/modules/settings").then((m) => ({ default: m.SettingsPage }))
);

// Dev-only styleguide: excluded from production builds, so the chunk never
// ships and the route never mounts outside local development (and e2e, which
// runs against the Vite dev server). `vite.config.ts` fails the build if any
// `modules/development` code still lands in a chunk.
const StyleguidePage = import.meta.env.DEV
  ? lazyWithRetry(() =>
      import("@/modules/development").then((m) => ({ default: m.StyleguidePage }))
    )
  : null;

// Layout route for the public (auth) screens. They render outside the shell,
// so without this boundary a render error there would take down the whole app
// through GlobalErrorBoundary.
function PublicLayout() {
  const location = useLocation();
  return (
    <RouteErrorBoundary locationKey={location.key}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </RouteErrorBoundary>
  );
}

// Single layout route for all protected pages. AppShell + sidebar stay mounted
// across navigations — only the content inside PageTransition swaps, with a
// cross-fade (old exits → new enters) via AnimatePresence.
function ProtectedLayout() {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <AppShell>
        <RouteErrorBoundary locationKey={location.key}>
          {/* Only while the lazy chunk downloads: each page owns its loading
              state once it mounts. The skeleton reveals itself after a short
              delay, so fast chunk loads never flash it. */}
          <Suspense fallback={<RouteContentSkeleton />}>
            <PageTransition />
          </Suspense>
        </RouteErrorBoundary>
      </AppShell>
    </ProtectedRoute>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path={ROUTE_PATHS.signIn}
          element={
            <PublicOnlyRoute>
              <SignInPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.register}
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        {/* E-mail confirmation step (between sign-up and the app). Standalone:
            the user holds a scoped verify-email token, not a full session, so
            neither PublicOnlyRoute nor ProtectedRoute applies. */}
        <Route path={ROUTE_PATHS.verifyEmail} element={<EmailVerificationPage />} />
        <Route
          path={ROUTE_PATHS.forgotPassword}
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route path={ROUTE_PATHS.resetPassword} element={<ResetPasswordPage />} />
      </Route>

      {/* Protected routes share a single AppShell via the layout route below.
          This avoids remounting the shell / sidebar on every navigation. */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to={ROUTE_PATHS.dashboard} replace />} />

        <Route path={ROUTE_PATHS.dashboard} element={<DashboardPage />} />

        <Route path={ROUTE_PATHS.settings} element={<SettingsPage />} />
        {/* `/profile` is an alias of Settings — kept for deep links. */}
        <Route
          path={ROUTE_PATHS.profile}
          element={<Navigate to={ROUTE_PATHS.settings} replace />}
        />

        {StyleguidePage ? (
          <Route path={ROUTE_PATHS.styleguide} element={<StyleguidePage />} />
        ) : null}

        <Route path={ROUTE_PATHS.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
