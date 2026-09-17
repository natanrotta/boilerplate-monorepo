// Public API of the `dashboard` module. It is presentation-only: no domain
// entity, no repository, no query key — the page renders from the session the
// `auth` module already owns. A real metric lands here as a `domain/` +
// `infrastructure/` + `presentation/hooks/` trio (see `src/modules/README.md`).
export { DashboardPage } from "./presentation/pages/DashboardPage";
