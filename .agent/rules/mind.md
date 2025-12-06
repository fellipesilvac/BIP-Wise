---
trigger: glob
---

# Project Context: BIP-Wise

> **For AI Agents:** Read this file to understand the project architecture, status, and constraints.

## 1. Project Overview
**Name**: BIP-Wise (Build in Public)
**Type**: Network Marketing (MLM) Management Platform.
**Core Stack**: 
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS (Custom Dark Theme)
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)

## 2. Design System
- **Theme**: Dark Mode only.
- **Key Colors**:
  - Primary Accent: `#9fe870` (Bright Green)
  - Background: `#0a0a0a` (Main), `#171916` (Cards/Sections)
  - Text: `#e8ebe6` (Primary), `#a8aaac` (Secondary)
  - Borders: `#ffffff08` (Subtle)
- **Icons**: `lucide-react`
- **Feedback**: `sonner` (Toasts)

## 3. Database Schema (Key Tables)
*See `schema_v2_detailed.sql` for full definition.*

- **`profiles`** (`id` references `auth.users`)
  - Stores public info: `username`, `full_name`, `avatar_url`.
  - **Hierarchy**: `parent_id` links to upline. `direct_referrals_count` and `total_network_size` are auto-calculated triggers.
  - **RLS**: Public read (for network visibility), User update own.

- **`private_details`**
  - Stores PII: `email`, `whatsapp`, `address_*`, `otp_enabled`.
  - **RLS**: Strict. Users can ONLY view/edit their own row.
  - **Notes**: `otp_enabled` controls the 2FA login flow.

- **`invoices`**
  - Payment history.
  - Linked to `subscriptions`.
  - Columns: `amount`, `status` ('paid', 'pending', ...), `description`, `receipt_url`.

- **`system_config`**
  - Global settings like `visibility_depth` (how many levels down a user can see).

## 4. Key Features & Workflows

### Authentication
- **Multi-method**: Supports Password and OTP (Email Code).
- **Smart Login**: `/login` checks `check_user_otp_status` RPC to decide if password or OTP input is shown.
- **Security Pages**:
  - `/settings/password`: Change password (requires current password verification).
  - `/settings/email`: Change email (requires current password, sends confirmation to old+new).
  - `/settings/methods`: Toggle OTP login.

### Network Hierarchy
- **Recursive Logic**: `get_accessible_profiles` RPC function handles tree traversal.
- **Visibility**: Limited by `system_config.visibility_depth`.

### Settings Pages
- Modular structure in `app/(dashboard)/settings/`.
- **Profile**: Updates `profiles` table.
- **Payment History**: Fetches `invoices` with infinite scroll and filters.

## 5. Current Implementation Status (Pending Tasks)
- [x] Login/Signup Refactor (OTP support)
- [x] Settings: Profile
- [x] Settings: Security (Password, Email, MFA)
- [x] Settings: Payment History
- [ ] **Settings: Address** (`/settings/address`) - *Next Up*
- [ ] **Settings: My Plan** (`/settings/plan`) - *Next Up*
- [ ] **Dashboard Home**: Widgets for Quick Stats.

## 6. Development Conventions
- **Client Components**: Use `'use client'` at the top.
- **Supabase Client**: `import { createClient } from '@/utils/supabase/client'`.
- **Validation**: Manual verification logic (e.g., checking password strength, confirming current password before changes).
