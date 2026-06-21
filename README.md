# Teen Wealth Tracker 🚀

A modern, production-grade personal finance platform built for teenagers and young adults (aged 13–21) to cultivate healthy financial habits, track non-salary income streams, manage youth-centric expenditures, and dynamically forecast milestones.

---

## 📌 Project Overview
Most contemporary budgeting ecosystems cater directly to established adults managing salaried compensation models, corporate investments, and fixed liabilities like mortgages. **Teen Wealth Tracker** fills an underserved gap by tailoring its user experiences around:

- **Income Streams:** Pocket money, casual part-time roles, gigs, and ceremonial/holiday gifts.
- **Milestones:** Budgeting systematically for first vehicles, driving instructional sets, higher-education relocation allowances, degree apprenticeships setups, and high-ticket consumer technology assets.
- **Mental Framework Tools:** Embedding a visual sandboxed decision matrix tool named *"Can I Afford It?"* to discourage impulse acquisitions.

This software architecture has been formatted defensively following clean engineering specifications, designed intentionally to withstand technical scrutinies during interviews for **highly competitive finance and technology degree apprenticeships in London**.

---

## 🛠 Tech Stack Core Strategy

| Technology | Purpose | Strategic Architectural Advantage |
| :--- | :--- | :--- |
| **Next.js 14+ (App Router)** | Core Framework | Hybrid Server/Client Components optimized for secure performance and fast server-rendered data loading. |
| **TypeScript** | Type Safety | Strictly eliminates compile-time logic flaws across financial operations and entity structures. |
| **Tailwind CSS** | Design System | High-velocity style structures with unified tokens matching design guidelines. |
| **Supabase** | Backend-as-a-Service | Provides managed user auth and instant securely managed web access to PostgreSQL databases. |
| **PostgreSQL** | Relational Ledger | Guarantees atomic transaction compliance (ACID) for financial ledgers using strict relational schemas. |
| **Recharts** | Data Visualization | Client-side reactive graphics engine showcasing trends and categorical asset distributions. |

---

## 📂 System Folder Directory Structure

The repository executes a modular **feature-driven architecture** inside the Next.js `src` configuration matrix to enforce decoupled business components:

```text
src/
├── app/                      # Application Layer (Routing, Layouts, Middleware)
│   ├── (auth)/               # Auth Logical Route Sub-Group (Login, Signup, Recovery)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/          # Authenticated App Route Sub-Group (Layout Shared)
│   │   ├── dashboard/        # Central Dashboard View Matrix
│   │   ├── transactions/     # Ledger Transaction Matrix (CRUD)
│   │   ├── goals/            # Savings Goal Portfolio Tracking
│   │   └── afford-it/        # Sandbox Decision Optimization Tool
│   ├── layout.tsx            # Context Providers Wrapper Baseline
│   └── page.tsx              # Conversion Landing Page 
├── components/               # Presentation Layer Component Subsystem
│   ├── ui/                   # Reusable Primitive Elements (Buttons, Inputs, Modals)
│   ├── dashboard/            # Dashboard Analytics Domain Components
│   └── layout/               # Application Chromes (Unified Navigation Elements)
├── lib/                      # Core Shared Infrastructural Utilities
│   ├── supabase/             # Dual Server-Client Execution SDK Initializers
│   │   ├── client.ts         # Client Side Execution Wrapper
│   │   └── server.ts         # Server Side Actions/Route Handler Secure Hook
│   └── utils.ts              # Mathematical, Currency, and Tailwind Formatting Tools
└── types/                    # System Domain Definition Maps
    └── database.ts           # Automatically Synchronized Schema Typings Matrix
```

---

## 🛡️ Foundational Security Matrix

1. **Row Level Security (RLS):** Enabled globally by default across every data asset layer. The PostgreSQL backend acts as the authoritative truth gate—crosschecking user session identities directly via `auth.uid() = user_id` before processing query returns or mutations.
2. **Defensive Financial Integrity:** The ledger utilizes a explicit numerical format constraint `numeric(10, 2)` instead of standard double-precision or floating-point abstractions. This proactively ensures absolute mathematical safety from inherent IEEE-754 binary arithmetic tracking discrepancies.
3. **Automated Provisioning Mechanics:** Direct exposure to structural authentication identities is prevented. User database creations are safely caught via a serverless execution trigger (`on_auth_user_created`), mirroring records out asynchronously into public user parameters automatically.

---

## 🚀 Step-by-Step System Setup Guide

### Step 1: Initialize Database Infrastructure
1. Spin up a new PostgreSQL database infrastructure workspace inside your **Supabase Dashboard**.
2. Navigate directly to the **SQL Editor** console panel from the left sidebar navigation matrix.
3. Open a **New Query** project file, copy the comprehensive contents found within your local `schema.sql` file, and execute the run operation.

### Step 2: Set Up Local Workspace Environment
Ensure your terminal environment has Node.js context boundaries installed correctly, and initialize your project:
```bash
# Clone or create your workspace directory structure
cd teen-wealth-tracker

# Install standard dependency sets
npm install
```

### Step 3: Map System Environment Matrix Variables
Create a local tracking environment configuration mapping file named `.env.local` inside the root root directory block, and fill it with your unique project keys matching the target dashboard parameters:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anonymous-api-token-key
```

### Step 4: Execute Development Workspace Server
Run the local dev compiler instance:
```bash
npm run dev
```
Open up your browser to `http://localhost:3000` to verify structural execution hooks operate as intended.

---

## 📈 Git & Documentation Standards

Always map engineering commits explicitly tracking specialized semantic milestones to build a high-caliber professional tracking narrative for degree apprenticeship reviewers:

- **Database Initializations:** `feat: initialize supabase database schema with tables, RLS policies, and new-user trigger`
- **Component Structuring:** `feat: scaffold structural folder architecture and design framework routing matrices`
- **Logic Integration Tasks:** `fix: resolve floating-point precision logic paths by shifting system type definitions to numeric validation layers`