# Usage Notes

## Quick Start Guide

### For Super Administrators

**Initial Login:**
- URL: Your deployment URL
- Email: `admin@volunteerplatform.com`
- Password: `admin123`
- ⚠️ **CHANGE THIS PASSWORD IMMEDIATELY**

**Creating Organizations:**

1. Go to Super Admin Dashboard
2. Click "Create Organization"
3. Fill in:
   - Organization details (name, email, phone, etc.)
   - Admin account details (name, email, password)
4. Click "Create Organization & Admin"
5. Organization will be created with "PENDING" status

**Approving Organizations:**

1. Pending organizations appear at top of dashboard
2. Review organization details
3. Click "✓ Approve" or "✗ Reject"
4. Only approved organizations can create opportunities

**Dashboard Features:**
- View total counts: Organizations, Volunteers, Opportunities, Sign-ups
- Manage all organizations (pending, approved, rejected)
- Monitor platform activity

---

### For Organization Administrators

**Initial Login:**
- Email and password provided by Super Admin
- Login at: `/auth/signin`

**Before Approval:**
- Dashboard shows "PENDING" status
- Cannot create opportunities yet
- Contact Super Admin if approval takes too long

**After Approval:**
- Status changes to "APPROVED"
- "Create New Opportunity" button appears

**Creating Opportunities:**

1. Click "Create New Opportunity"
2. Fill in required fields:
   - **Title**: Short, descriptive name
   - **Description**: Detailed information about the work
   - **Location**: Full address or clear location
   - **Start/End Date & Time**: When volunteers should arrive/leave
   - **Total Slots**: Number of volunteers needed
   - **Requirements** (optional): Age limits, skills, physical requirements
3. Click "Create Opportunity"

**Managing Sign-ups:**
- View all volunteers signed up for each opportunity
- See volunteer names and emails
- Track filled vs. available slots
- Opportunities automatically marked "FULL" when all slots filled

**Dashboard Sections:**
- **Organization Information**: Your org details
- **Create New Opportunity**: Add opportunities
- **Upcoming Opportunities**: Active sign-ups, volunteer lists
- **Past Opportunities**: Completed events

---

### For Volunteers

**Registration:**

1. Visit homepage and click "Register as Volunteer"
2. Fill in:
   - Full name
   - Email address (must be valid)
   - Password (minimum 8 characters)
   - Confirm password
3. Click "Register"
4. **Check your email** for verification link
5. Click verification link (expires in 24 hours)
6. You can now sign in

**Browsing Opportunities (No Login Required):**
- Visit homepage or `/opportunities`
- See all open opportunities from approved organizations
- View details: title, organization, location, date, available slots
- Click "View & Sign Up" for details

**Signing Up for Opportunities:**

1. Sign in to your account
2. Browse opportunities
3. Click on opportunity for full details
4. Click "Sign Up for This Opportunity"
5. Receive confirmation email immediately
6. Event appears in your dashboard

**My Dashboard:**
- **Upcoming Opportunities**: Your confirmed sign-ups
  - Location, date, time
  - Organization contact info
  - Any notes or requirements
- **Past Opportunities**: Events you've completed

**Rules & Restrictions:**
- ✓ Can sign up for multiple opportunities
- ✗ Cannot sign up for the same opportunity twice
- ✗ Cannot sign up if opportunity is full
- Email verification required (one-time only)

---

## Email Notifications

**Volunteers Receive:**
1. **Verification Email**: After registration (must click link)
2. **Sign-up Confirmation**: After each opportunity sign-up
   - Opportunity details
   - Organization name
   - Date, time, location

**Organizations Receive:**
- **New Volunteer Notification**: When someone signs up
  - Volunteer name
  - Opportunity title
  - Link to dashboard

**Email Timing:**
- Sent immediately after actions
- Check spam folder if not received
- Contact admin if persistent issues

---

## Common Workflows

### Adding a New Organization

**Super Admin:**
1. Create organization + admin account
2. Provide admin credentials to organization
3. Wait for organization to request approval (or approve immediately)
4. Approve organization

**Org Admin:**
1. Login with provided credentials
2. Verify organization information
3. Wait for approval
4. Once approved, create first opportunity

### Running a Volunteer Event

**Before Event:**
1. Org Admin creates opportunity (2-4 weeks in advance)
2. Volunteers browse and sign up
3. Both parties receive confirmation emails
4. Org Admin monitors sign-ups in dashboard

**Week Before:**
5. Org Admin reviews volunteer list
6. Org Admin can contact volunteers if needed (emails shown in dashboard)

**Day Of:**
7. Volunteers check dashboard for final details
8. Org Admin has volunteer list ready
9. Event happens!

**After:**
10. Opportunity automatically moves to "Past" section
11. Stats remain visible for reporting

### Managing Full Opportunities

**What Happens:**
- When last slot is filled, status changes to "FULL"
- No longer appears in public browsing (depending on filter)
- Volunteers see "This opportunity is currently full"

**To Reopen:**
- Org Admin can manually increase slots (future feature)
- Or create a new, similar opportunity

---

## Best Practices

### For Organizations

**Creating Opportunities:**
- Be specific in descriptions
- Include parking/transportation info
- Mention what volunteers should bring
- Set realistic time estimates
- Add requirements (if any) clearly

**Managing Volunteers:**
- Check sign-ups regularly
- Contact volunteers if details change
- Thank volunteers after event
- Build relationships for repeat volunteers

### For Volunteers

**Signing Up:**
- Only sign up if you can commit
- Read full description and requirements
- Note start AND end time
- Add event to your personal calendar
- Contact organization if you need to cancel

**Before Event:**
- Review dashboard 1 day before
- Verify location and time
- Prepare anything required
- Arrive on time

---

## Mobile Usage

**The platform is mobile-friendly!**

**On Phone/Tablet:**
- All features work on mobile
- Large tap targets for older users
- Simple, clear navigation
- Easy-to-read text

**Recommended for Volunteers:**
- Browse on phone
- Sign up on phone
- Check dashboard morning of event

---

## Accessibility Features

**Simple UX for Low-Tech Users:**
- Large buttons and text
- Clear instructions
- Minimal steps
- No complex forms
- Email verification is one-time only

**For Older Volunteers:**
- High contrast
- Readable fonts
- No confusing navigation
- Help text on forms

---

## Troubleshooting

### "I didn't receive verification email"

1. Check spam/junk folder
2. Wait 5 minutes (may be delayed)
3. Check you typed email correctly
4. Try registering again (if >24 hours passed)

### "I can't sign in"

**For Volunteers:**
- Did you verify your email? (Check inbox)
- Is password correct? (case-sensitive)
- Are you using the right email address?

**For Org Admins:**
- Contact Super Admin for password reset
- Verify email address with Super Admin

### "I can't create opportunities"

- Is your organization "APPROVED"?
- Check status in dashboard
- Contact Super Admin if stuck in "PENDING"

### "Sign up button not working"

- Are you signed in?
- Is the opportunity already full?
- Have you already signed up for this opportunity?
- Try refreshing the page

### "I need to cancel my sign-up"

Currently manual:
- Contact the organization directly (email shown on opportunity page)
- They can note your cancellation
- Future: Self-service cancellation feature

---

## Support

**For Technical Issues:**
- Check this guide first
- Contact platform administrator
- Report bugs via GitHub issues

**For Organization Approval:**
- Contact Super Admin directly
- Include organization name and admin email

**For Event-Specific Questions:**
- Contact the organization directly
- Email shown on opportunity detail page

---

## Privacy & Security

**Your Data is Protected:**
- Passwords are encrypted
- Org admins can only see their own data
- Volunteers only see public opportunities + their own sign-ups
- Email addresses only shared with relevant parties

**What Organizations See:**
- Volunteer name and email (only for their opportunities)
- Sign-up date and status

**What Volunteers See:**
- Public opportunity information
- Organization contact email
- Their own sign-up history

**What Super Admins See:**
- All platform data (for management purposes)
- Used only for platform administration

---

## Tips for Success

### Organizations

1. **Post opportunities early** - Volunteers need time to plan
2. **Be responsive** - Reply to volunteer inquiries quickly
3. **Update if changed** - Contact volunteers ASAP if details change
4. **Say thank you** - Appreciation goes a long way
5. **Be consistent** - Regular opportunities build volunteer base

### Volunteers

1. **Verify email immediately** - So you can sign up when ready
2. **Read full descriptions** - Avoid surprises
3. **Only commit if sure** - Organizations count on you
4. **Bookmark dashboard** - Easy access day-of-event
5. **Give feedback** - Help organizations improve

### Super Admins

1. **Review orgs quickly** - Don't leave them waiting
2. **Verify legitimacy** - Check website, phone number
3. **Monitor activity** - Watch for spam or abuse
4. **Communicate clearly** - If rejecting, explain why
5. **Regular backups** - Protect the data

---

**Happy Volunteering! 🤝**
