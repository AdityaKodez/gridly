# Changelog

## 2026-03-08

### Added

- Added dashboard onboarding backed by Prisma with per-user completion and dismissed state.
- Added config-driven onboarding controls in `config.ts` under `dashboardConfig.onboarding`.
- Added configurable onboarding copy and step definitions so starter users can edit the section without touching feature logic.

### Changed

- Limited onboarding UI to the dashboard only; removed heavier route-level onboarding cards from AI and Settings.
- Compact dashboard onboarding card now shows active steps first and collapses completed steps into a smaller summary.
- Onboarding auto-complete is event-driven: dashboard visit completes the layout step, and AI/Settings use lightweight route-mount actions to keep the dashboard checklist in sync.
- Dashboard onboarding snapshot path was reduced to avoid a write-then-read sequence on the same request.

### Notes

- To disable onboarding entirely, set `dashboardConfig.onboarding.enabled` to `false` in `config.ts`.
