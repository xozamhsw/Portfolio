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

Update profile information, social links, skills and projects there instead of editing presentation components.

## Contact security

The contact form uses `/api/contact` and performs server-side shape validation. Before production, add rate limiting / bot protection and secure Firestore rules. See `docs/AUDIT.md` for the full audit notes.
