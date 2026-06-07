# Files That Must Remain Private
- Any file matching `.env*` (except `.env.example` or `.env.template`).
- Any internal business logic related to the pricing matrix or sovereign extraction methodology not explicitly audited for exposure.
- Proprietary or production datasets, database dumps, or real service account keys.
- Real AWS/Supabase/Stripe/Resend credentials in configuration or build environments.
