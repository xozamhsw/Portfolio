# Zagar Portfolio

A modern, responsive portfolio built with Next.js, TypeScript, Tailwind CSS and Framer Motion.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Firebase / Firestore for contact submissions

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Create `.env.local` with the Firebase values already expected by `lib/firebase.ts`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Content

Most portfolio content is centralized in:

```text
lib/portfolio.ts
```

Update profile information, social links, skills and projects there instead of editing presentation components.

## Contact security

The contact form uses `/api/contact` and performs server-side shape validation. Before production, add rate limiting / bot protection and secure Firestore rules. See `docs/AUDIT.md` for the full audit notes.
