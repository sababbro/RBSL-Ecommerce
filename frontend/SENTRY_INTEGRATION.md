# RBSL × Meximco E-Commerce - Sentry Integration Guide (Next.js 15)

To implement production-grade error tracking for the RBSL frontend, follow these steps to integrate Sentry.

## 1. Installation
Install the required Sentry SDK for Next.js:
```bash
npm install @sentry/nextjs
```

## 2. Configuration Wizard
Run the interactive setup wizard to automatically configure your project:
```bash
npx sentry-wizard@latest -i nextjs
```
*Selection Guide:*
- Choose **Sentry SaaS** or your self-hosted instance.
- Select the **RBSL Project**.
- Allow the wizard to create `sentry.client.config.js`, `sentry.server.config.js`, and `sentry.edge.config.js`.

## 3. Recommended Client-Side Configuration (`sentry.client.config.js`)
Ensure hydration errors and client-side crashes are captured:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

## 4. Recommended Server-Side Configuration (`sentry.server.config.js`)
Capture API failures and server-side rendering errors:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  // Ensure we capture environment info
  environment: process.env.NODE_ENV,
});
```

## 5. Monitoring Hydration Errors (Next.js 15 / React 19)
Next.js 15 automatically handles many hydration errors, but you can explicitly catch them in a root Error Boundary or layout:
```tsx
// src/app/layout.tsx
import * as Sentry from "@sentry/nextjs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## 6. Verification
Trigger a test error in a development component:
```javascript
<button onClick={() => { throw new Error("RBSL Sentry Test Error"); }}>
  Test Sentry
</button>
```
Check the Sentry dashboard for the event.
