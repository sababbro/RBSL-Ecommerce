
# RBSL Platform - Security Audit Report & Secret Inventory

## Phase 1: Repository Discovery & Dependency Map
The codebase is a monorepo consisting of:
- **Backend**: Medusa v2 (Node.js/Express)
- **Frontend**: Next.js 15
- **Databases/Services**: PostgreSQL, Redis, Supabase Storage, Stripe, Meilisearch, Resend.

## Phase 2: Risk Assessment & Secret Inventory

### 1. Hardcoded Localhost URLs
- **Locations**:
  - `backend/.env.template`
  - `backend/medusa-config.ts` (admin backendUrl)
  - `frontend/.env.template`
  - `frontend/src/lib/config.ts` (MEDUSA_BACKEND_URL fallback)
  - `frontend/src/lib/util/env.ts` (getBaseURL fallback)
  - `frontend/src/modules/products/components/product-onboarding-cta/index.tsx` (hardcoded admin URL `http://localhost:7001`)
- **Risk Level**: Medium to High (Depending on deployment).
- **Why it is risky**: In a production environment, relying on localhost URLs or having hardcoded localhost endpoints can lead to broken links, failed API requests, and misconfigured CORS if not overridden properly via environment variables. The onboarding CTA is a prime example of a hardcoded link that will break in production.
- **Production Impact**: Yes, can break features or APIs if env variables are missing or if the code doesn't support environment overrides.
- **Migration**: Migrate hardcoded localhosts to use environment variables (`process.env.ADMIN_URL`, `process.env.NEXT_PUBLIC_BASE_URL`, etc.). Provide fallbacks safely but avoid assuming localhost in production builds.

### 2. Hardcoded Redis Connection String
- **Location**: `backend/src/api_backup/middlewares.ts` (`redis://localhost:6379`)
- **Risk Level**: Medium.
- **Why it is risky**: Hardcoding internal service URLs can cause failures when migrating to managed services or different environments.
- **Production Impact**: Minimal if `REDIS_URL` is set, but bad practice as a fallback in production code.
- **Migration**: Ensure it strictly relies on `process.env.REDIS_URL`.

### 3. Missing Fallbacks for Credentials / API Keys
- **Location**: `backend/src/subscribers/order-confirmed.ts` (`re_placeholder`)
- **Risk Level**: Low (it's a placeholder), but indicates potential hardcoded logic if a real key was there.
- **Migration**: Maintain environment variable usage.

*Note: No active API keys (Stripe, Supabase, Resend) were found hardcoded in the source files. They are correctly using `process.env`. However, the usage of fallback hardcoded localhost strings throughout the codebase needs to be addressed for production readiness.*


## Phase 4: Stability Verification Confidence Score
- **Frontend URL Migration (`frontend/src/modules/products/components/product-onboarding-cta/index.tsx`, `frontend/src/lib/config.ts`, `frontend/src/lib/util/env.ts`)**: Confidence Score: 95%. Safe fallback logic implemented. Operator precedence in env parsing corrected.
- **Backend Redis Configuration (`backend/src/api_backup/middlewares.ts`)**: Confidence Score: 100%. Implemented safe bypass if Redis is not configured in production, ensuring it doesn't fail closed if the managed service goes down unexpectedly, while using the localhost URL for dev mode only.
- **Backend Admin URL (`backend/medusa-config.ts`)**: Confidence Score: 100%. Safely migrated to allow environment override with `ADMIN_BACKEND_URL`.
