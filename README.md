# Volunteer Platform

A complete web application for connecting volunteers with local organizations. Built with Next.js, PostgreSQL, Prisma, and NextAuth.

## Features

### 🔐 Three User Roles
- **Super Admin**: Creates and approves organizations
- **Organization Admin**: Creates and manages volunteer opportunities
- **Volunteer**: Browses and signs up for opportunities

### ✨ Key Functionality
- ✅ Email verification for volunteers (one-time)
- ✅ Automatic slot management and opportunity status updates
- ✅ Email notifications for sign-ups
- ✅ Role-based dashboards with appropriate access control
- ✅ Public opportunity browsing and filtering
- ✅ Mobile-friendly, simple UX for all users
- ✅ Secure: org admins can only see their own data
- ✅ Prevents duplicate sign-ups and overbooking

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta)
- **Email**: Resend
- **Hosting**: Vercel

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Resend API key (for emails)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd volunteer-platform
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database - Get from Vercel Postgres, Supabase, or local PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/volunteer_platform"

# NextAuth - Generate a random secret
NEXTAUTH_SECRET="your-secret-key-here"  # Run: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Resend - Get from https://resend.com/api-keys
RESEND_API_KEY="re_xxxxx"
```

### 3. Initialize Database

```bash
# Push schema to database
npm run db:push

# Seed super admin account
npm run db:seed
```

**Super Admin Credentials** (created by seed):
- Email: `admin@volunteerplatform.com`
- Password: `admin123`
- ⚠️ **IMPORTANT**: Change this password after first login!

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Set Up Database

Option A: **Vercel Postgres** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Link project and create Postgres database
vercel link
vercel postgres create
```

Option B: **External PostgreSQL**
- Use Supabase, Railway, Neon, or any PostgreSQL provider
- Copy the connection string

### 2. Deploy

```bash
# Deploy to Vercel
vercel

# Or push to GitHub and connect via Vercel dashboard
```

### 3. Set Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

```
DATABASE_URL=<your-postgres-connection-string>
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=<your-vercel-deployment-url>
RESEND_API_KEY=<your-resend-api-key>
```

### 4. Push Database Schema

```bash
# After deploying, push schema to production DB
npx prisma db push --skip-generate

# Seed super admin
npx tsx prisma/seed.ts
```

Or use Vercel CLI:
```bash
vercel env pull .env.local
npm run db:push
npm run db:seed
```

## Usage Guide

### Super Admin Workflow

1. Sign in with super admin credentials
2. **Create Organization**:
   - Name, description, contact info
   - Create organization admin account
   - Organization starts as "Pending"
3. **Approve/Reject Organizations**:
   - Review pending organizations
   - Click "Approve" or "Reject"
   - Only approved orgs can create opportunities

### Organization Admin Workflow

1. Sign in with org admin credentials
2. Wait for super admin approval (status shows on dashboard)
3. Once approved, **Create Opportunities**:
   - Title, description, location
   - Start/end date and time
   - Number of volunteer slots
   - Requirements (optional)
4. **Manage Sign-ups**:
   - View all volunteers signed up
   - Track filled vs. available slots
   - Opportunities auto-mark as "FULL" when all slots filled

### Volunteer Workflow

1. **Browse Public Site** (no login required)
   - View all open opportunities
   - Filter by date, location, organization
2. **Register Account**:
   - Provide name, email, password
   - Verify email via link sent to inbox
   - Cannot sign in until email verified
3. **Sign In and Sign Up**:
   - Browse opportunities
   - Click "Sign Up for This Opportunity"
   - Receive confirmation email
   - View "My Volunteer Dashboard" with upcoming commitments
4. **Day of Event**:
   - Check dashboard for details
   - Location, time, organization contact

## Email Configuration

### Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Verify your domain (or use sandbox for testing)
3. Get API key from dashboard
4. Add to `.env`:
   ```
   RESEND_API_KEY="re_xxxxx"
   ```

**Email Templates** (configured in `lib/email.ts`):
- Volunteer email verification
- Sign-up confirmation (to volunteer)
- Sign-up notification (to organization)

### Customizing Email Sender

Edit `lib/email.ts` and change:
```typescript
from: 'Volunteer Platform <noreply@yourdomain.com>'
```

## Database Schema

### Models

- **User**: All users (Super Admin, Org Admin, Volunteer)
- **Organization**: Organizations managed by admins
- **Opportunity**: Volunteer opportunities
- **SignUp**: Volunteer sign-ups for opportunities
- **VerificationToken**: Email verification tokens

### Key Relationships

- Organization → User (admin, 1:1)
- Organization → Opportunities (1:many)
- Opportunity → SignUps (1:many)
- User (Volunteer) → SignUps (1:many)

### Database Management

```bash
# View/edit data in browser
npm run db:studio

# Create migration (after schema changes)
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT session tokens
- ✅ Role-based access control
- ✅ Email verification for volunteers
- ✅ Organization approval workflow
- ✅ Protected API routes
- ✅ Middleware for dashboard protection
- ✅ Data isolation (org admins can't see other orgs)
- ✅ Duplicate sign-up prevention
- ✅ Automatic slot management

## Project Structure

```
volunteer-platform/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── organizations/     # Organization CRUD
│   │   ├── opportunities/     # Opportunity CRUD
│   │   └── signups/           # Sign-up management
│   ├── auth/                  # Auth pages (signin, register)
│   ├── dashboard/             # Role-specific dashboards
│   │   ├── super-admin/
│   │   ├── org-admin/
│   │   └── volunteer/
│   ├── opportunities/         # Public opportunity pages
│   └── page.tsx               # Homepage
├── components/                # Reusable React components
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── email.ts              # Email utilities
│   └── prisma.ts             # Prisma client
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
└── types/                    # TypeScript definitions
```

## Common Issues & Solutions

### Email Verification Not Working

- Check `RESEND_API_KEY` is set correctly
- Verify domain in Resend dashboard
- Check spam folder
- For testing, use Resend sandbox mode

### Database Connection Errors

- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
- Ensure database exists and is accessible
- For Vercel Postgres, use connection string from dashboard

### Super Admin Can't Sign In

- Run seed script: `npm run db:seed`
- Check password is exactly `admin123`
- Verify user exists: `npm run db:studio` → User table

### Organization Admin Can't Create Opportunities

- Ensure organization status is "APPROVED"
- Super admin must approve organization first
- Check dashboard for status

### Volunteer Can't Sign In After Registration

- Email must be verified first
- Check inbox for verification link
- Link expires in 24 hours
- Re-register if expired

## Production Checklist

Before going live:

- [ ] Change super admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use production database (not local)
- [ ] Verify Resend domain
- [ ] Test email delivery
- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Test all user flows
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up database backups
- [ ] Configure monitoring/logging

## Support & Contributing

For issues or questions, please open an issue in the repository.

## License

MIT

---

**Built with ❤️ for making volunteering accessible to everyone**
