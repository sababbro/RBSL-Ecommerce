# RBSL × Meximco E-Commerce Platform

## Overview
**Royal Bengal Shrooms Limited (RBSL)** is a premier biotechnology and clinical extraction firm based in Bangladesh. This repository contains the sovereign infrastructure powering the **Institutional Procurement Pipeline** and the **Meximco Product Division**. 

The platform is designed to handle both high-volume B2B clinical mushroom extract procurement and B2C retail for standardized consumer products.

## System Architecture
This project is structured as a **Monorepo** to ensure tight integration between the sovereign commerce logic and the institutional storefront.

- **`/backend`**: Powered by **Medusa v2**, handling complex B2B workflows, quote management, and global capital settlement.
- **`/frontend`**: A high-fidelity **Next.js 15** application serving as the primary portal for both B2B partners and B2C consumers.

### Tech Stack
| Component | Technology |
| :--- | :--- |
| **Core Framework** | Medusa v2 (Backend), Next.js 15 (Frontend) |
| **Database** | PostgreSQL |
| **Storage** | Supabase Storage |
| **Search Engine** | Meilisearch |
| **Email Service** | Resend |
| **Styling** | Tailwind CSS & Radix UI |
| **Payments** | Stripe (Global) & bKash/Nagad (Localized Logic) |

## Key Features
- **Sovereign Extraction Logic**: Backend modules tailored for clinical-grade mushroom extract cataloging.
- **Institutional B2B Pipeline**: Specialized onboarding flow for medical institutions and distributors.
- **Dynamic Wholesale Matrix**: Real-time pricing adjustments based on procurement volume.
- **Global Export Support**: Integrated logistics for international distribution from the Dhaka Unit.
- **Turbo-Optimized Storefront**: Next.js 15 with TurboPack for lightning-fast commerce interactions.

## Getting Started

### Prerequisites
- **Node.js**: >= 20.x
- **PostgreSQL**: Running instance for Medusa core data.
- **Redis**: For background jobs and caching.

### Installation & Setup

1. **Clone the Infrastructure**:
   ```bash
   git clone https://github.com/sababbro/RBSL-Ecommerce.git
   cd RBSL-Ecommerce
   ```

2. **Initialize Backend**:
   ```bash
   cd backend
   npm install
   cp .env.template .env
   # Configure your database and provider keys in .env
   npx medusa migrations run
   npm run dev
   ```

3. **Initialize Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.template .env.local
   # Point MEDUSA_BACKEND_URL to your running backend
   npm run dev
   ```

## Environment Configuration
Refer to the following template files for required environment variables:
- Backend: [`backend/.env.template`](file:///backend/.env.template)
- Frontend: [`frontend/.env.template`](file:///frontend/.env.template)

## Deployment Optimization
For production environments, particularly shared hosting or VPS, use the included optimization script:
```bash
bash optimize-deployment.sh
```
This script streamlines the build process and strips development overhead for maximum stability.

---
© 2026 **Royal Bengal Shrooms Limited**. Strategic Extraction Division.
*Empowering clinical innovation through biological sovereignty.*
