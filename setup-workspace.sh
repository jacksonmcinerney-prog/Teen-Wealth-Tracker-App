#!/bin/bash
echo "🚀 Setting up Teen Wealth Tracker Workspace..."

# 1. Initialize Next.js project (Run this inside your teen-wealth-tracker folder)
# We use flags to bypass the interactive prompts and match your architectural choices.
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes

# 2. Install essential packages for SaaS, UI, and DB
echo "📦 Installing Supabase, Recharts, and utility libraries..."
npm install @supabase/supabase-js @supabase/ssr recharts lucide-react clsx tailwind-merge date-fns zod @hookform/resolvers react-hook-form

# 3. Scaffold the required folder architecture inside src/
echo "📂 Scaffolding clean architecture folders..."
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/signup
mkdir -p src/app/\(dashboard\)/dashboard
mkdir -p src/app/\(dashboard\)/transactions
mkdir -p src/app/\(dashboard\)/goals
mkdir -p src/app/\(dashboard\)/afford-it
mkdir -p src/components/ui
mkdir -p src/components/dashboard
mkdir -p src/components/layout
mkdir -p src/lib/supabase
mkdir -p src/types

# 4. Create placeholder files so Next.js App Router doesn't throw errors
echo "📄 Creating placeholder files..."
touch src/app/\(auth\)/login/page.tsx
touch src/app/\(auth\)/signup/page.tsx
touch src/app/\(dashboard\)/layout.tsx
touch src/app/\(dashboard\)/dashboard/page.tsx
touch src/app/\(dashboard\)/transactions/page.tsx
touch src/app/\(dashboard\)/goals/page.tsx
touch src/app/\(dashboard\)/afford-it/page.tsx
touch src/lib/supabase/client.ts
touch src/lib/supabase/server.ts
touch src/lib/utils.ts
touch src/types/database.ts

echo "✅ System architecture setup complete!"
echo "Next step: Run 'npm run dev' to start the local server."
