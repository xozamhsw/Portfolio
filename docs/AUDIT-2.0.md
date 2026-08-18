# Portfolio 2.0 Audit & Refactor

## Main changes
- Mega Dropdown now routes to dedicated pages: `/about`, `/skills`, `/projects`, `/contact`.
- Homepage remains a concise landing page with previews and deep-link CTAs.
- Skills no longer use fake percentage/progress bars.
- Added dedicated project case-study routes: `/projects/[slug]`.
- Added per-page metadata.
- Reworked mobile navigation and active route states.
- Added click-outside and Escape handling for the mega dropdown.
- Centralized portfolio/project/skill data in `lib/portfolio.ts`.
- Replaced legacy `/users/*` redirects with real application routes.

## Suggested next improvements
- Add a real project repository URL per project instead of the profile GitHub URL.
- Add screenshots/gallery images for each project case study.
- Add Firestore security/rate limiting or CAPTCHA for the public contact endpoint.
- Add Open Graph image and favicon/brand assets.
- Consider analytics only if useful for the portfolio's goals.
