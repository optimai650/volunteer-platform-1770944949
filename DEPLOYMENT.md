# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via GitHub (Easiest)

1. **Push to GitHub** (already done):
   - Repository: https://github.com/optimai650/volunteer-platform-1770944949

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from Git: Select the GitHub repository
   - Framework: Next.js (auto-detected)
   - Click "Deploy"

3. **Set Environment Variables** in Vercel Dashboard:
   
   Go to: Project Settings → Environment Variables
   
   Add these variables:
   ```
   DATABASE_URL=<your-postgres-url>
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=<your-vercel-deployment-url>
   RESEND_API_KEY=<your-resend-api-key>
   ```

4. **Set Up Database**:

   **Option A: Vercel Postgres (Easiest)**
   - In Vercel Dashboard → Storage → Create Database
   - Select Postgres
   - It will automatically add `DATABASE_URL` to your env vars
   
   **Option B: Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings → Database
   - Add to Vercel env vars as `DATABASE_URL`

5. **Initialize Database**:
   
   After deployment, run these commands locally:
   ```bash
   # Pull production env vars
   vercel env pull .env.production
   
   # Use the production DATABASE_URL
   export $(cat .env.production | grep DATABASE_URL)
   
   # Push schema
   npx prisma db push
   
   # Seed super admin
   npx tsx prisma/seed.ts
   ```

6. **Access Your App**:
   - Production URL: Shown in Vercel dashboard
   - Super Admin: `admin@volunteerplatform.com` / `admin123`
   - **Change password immediately!**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set as production deployment

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add RESEND_API_KEY

# Deploy with env vars
vercel --prod
```

## Environment Variables Setup

### 1. DATABASE_URL

**Vercel Postgres:**
```bash
# Automatically added when you create Vercel Postgres
postgres://user:pass@host:port/dbname
```

**Supabase:**
```
postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

**Other providers:** Railway, Neon, PlanetScale (compatibility mode required)

### 2. NEXTAUTH_SECRET

Generate a secure random string:
```bash
openssl rand -base64 32
```

### 3. NEXTAUTH_URL

Your deployment URL, e.g.:
```
https://volunteer-platform-abc123.vercel.app
```

### 4. RESEND_API_KEY

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use sandbox for testing)
3. Create API key in dashboard
4. Format: `re_xxxxxxxxxxxxx`

## Post-Deployment Checklist

After deploying:

- [ ] Database schema pushed (`prisma db push`)
- [ ] Super admin seeded (`npm run db:seed`)
- [ ] All environment variables set
- [ ] Test super admin login
- [ ] Create a test organization
- [ ] Approve test organization
- [ ] Create test opportunity
- [ ] Register test volunteer
- [ ] Verify email works
- [ ] Test volunteer sign-up flow
- [ ] Change super admin password

## Database Schema Migration

If you modify the schema:

```bash
# Development
npx prisma migrate dev --name your_migration_name

# Production (after deployment)
npx prisma db push
```

## Troubleshooting

### Build Fails

**Error: Cannot find module '@prisma/client'**
```bash
# Ensure postinstall script runs
npm install
npx prisma generate
```

**Error: Database connection failed**
- Check `DATABASE_URL` format
- Ensure database exists and is accessible
- For Vercel, check Storage tab connection string

### Email Not Sending

- Verify `RESEND_API_KEY` is correct
- Check domain is verified in Resend dashboard
- Test with sandbox mode first
- Check spam folder

### Super Admin Can't Login

```bash
# Re-run seed script
npx tsx prisma/seed.ts

# Or manually create in Prisma Studio
npx prisma studio
```

### Volunteers Can't Sign Up

- Check email verification link works
- Verify `NEXTAUTH_URL` matches deployment URL
- Ensure organization is "APPROVED" status

## Monitoring & Maintenance

### View Database

```bash
npx prisma studio
```

### Check Logs

Vercel Dashboard → Your Project → Logs

### Database Backups

**Vercel Postgres:**
- Automatic backups included
- Download from Storage tab

**Supabase:**
- Automatic daily backups
- Manual backup via pg_dump

## Scaling Considerations

This architecture supports:
- **Thousands of organizations**
- **Tens of thousands of volunteers**
- **Hundreds of thousands of sign-ups**

For larger scale:
- Upgrade database plan (connection pooling)
- Enable Vercel Edge caching
- Add Redis for session storage
- Implement rate limiting

## Security Hardening

For production:

1. **Change default credentials immediately**
2. **Enable 2FA for Vercel account**
3. **Use strong database passwords**
4. **Regularly update dependencies**
5. **Monitor for suspicious activity**
6. **Set up alerts for errors**

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org

---

**Deployment Repository:**
https://github.com/optimai650/volunteer-platform-1770944949

**Ready to deploy in under 10 minutes!** 🚀
