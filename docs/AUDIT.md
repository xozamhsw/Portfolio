# Portfolio Audit & Refactor

## What was audited

- Navigation and information architecture
- Responsive behavior
- Visual consistency and color system
- Component duplication and data hard-coding
- Contact form flow
- Firebase usage
- Dead / broken backend code
- Metadata and accessibility basics

## Main findings

### 1. Visual system
The previous UI repeated large `gray-800` cards, purple/blue gradients and heavy shadows across almost every section. This made the interface feel flat despite the gradients.

**Refactor:** a dark editorial system using near-black surfaces plus violet, cyan and lime accents. Color is now used as hierarchy instead of painting every card.

### 2. Navigation
The old header only provided a flat list of links and had a `Home` action pointing to an element that did not exist (`#home`), while the hero used `#hero`.

**Refactor:** fixed glass navigation, consistent section IDs, desktop mega dropdown, mobile navigation, CTA and accessible labels.

### 3. Project data
Projects and skills were embedded inside UI components and included placeholder entries such as "Cowok Keren" and "Cowok Misterius".

**Refactor:** portfolio content is centralized in `lib/portfolio.ts`. UI components now render data instead of owning the content.

### 4. Fake loading
Projects used `setTimeout` to simulate a network request even though the data was local.

**Refactor:** removed fake loading and replaced it with immediate rendering.

### 5. Contact flow
The old contact form wrote directly to Firestore from the browser. The repository already had a Next.js API route, but the form was not using it.

**Refactor:** the public form now posts to `/api/contact`, with server-side input validation and one consistent document shape.

> Production recommendation: use Firebase Admin SDK (or another trusted server-side database client) for privileged writes, add rate limiting / bot protection, and lock Firestore rules so clients cannot freely create arbitrary documents.

### 6. Go backend
The repository contained an incomplete Go backend:
- `go.mod` declared `portfolio-backend`
- `handlers/contact.go` imported `portfolio-website/go/models`
- the referenced `models` package did not exist
- the Go API duplicated the Next.js contact endpoint

**Refactor:** removed the unused/broken Go backend from this portfolio build. Keeping two backends for one simple contact form added complexity without providing value.

### 7. Responsive design
The previous pages were mostly responsive through Tailwind breakpoints, but many elements were desktop-first and repeated fixed card patterns.

**Refactor:** layouts now use fluid spacing, responsive grids, horizontal mobile filters, responsive typography and touch-friendly controls.

### 8. Accessibility / semantics
The refactor adds:
- descriptive navigation labels
- `aria-expanded` on menu controls
- `aria-label` on social icons
- semantic `section`, `article`, `nav`, `form` structure
- visible focus-friendly form borders
- text labels for form controls

## New structure

```text
app/
  api/contact/route.ts
  page.tsx
  globals.css
components/
  navigations/
    Header.tsx
    Footer.tsx
  ui/
    SectionHeading.tsx
  view/
    HeroFormView.tsx
    AboutFormView.tsx
    SkillsFormView.tsx
    ProjectsFormView.tsx
    ContactFormView.tsx
lib/
  firebase.ts
  portfolio.ts
docs/
  AUDIT.md
```

## Recommended next audit before production

1. Add authentication to `/admin/monitoring`.
2. Lock Firestore rules and separate public contact creation from admin read/update/delete.
3. Add rate limiting / CAPTCHA to `/api/contact`.
4. Add a real project CMS only if the number of projects grows enough to justify it.
5. Add Open Graph metadata and a social preview image.
6. Run Lighthouse on mobile and desktop.
7. Add a custom `not-found.tsx` and `error.tsx`.
8. Verify all external links and project screenshots before publishing.
