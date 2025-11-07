# Admin Dashboard Setup Guide

## 🚀 Quick Start

The admin dashboard allows you to:
- View platform statistics
- Manage all users
- Grant/revoke subscriptions
- Change user roles (make other admins)
- Track all admin activities

## 📋 Prerequisites

You need to run the database migrations first.

## 🗄️ Database Setup

### 1. Run SQL Migrations

Go to your Supabase project → SQL Editor and run this file:
```
database/admin-schema.sql
```

This will:
- Add `role` column to users table
- Create `manual_subscriptions` table
- Create `admin_activity_log` table
- Set up Row Level Security (RLS)
- Create helper functions and views

### 2. Make Yourself an Admin

After running migrations, make yourself an admin by running this in Supabase SQL Editor:

```sql
UPDATE users
SET role = 'super_admin'
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your actual email.

## 🔐 Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Payment Links
NEXT_PUBLIC_STRIPE_STARTER_PAYMENT_LINK=your_starter_link
NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK=https://buy.stripe.com/5kQ5kC6dp9FK0ap3cc
```

**Note:** You'll need to create a Stripe payment link for the Starter plan ($29/month).

## 🎯 Accessing the Dashboard

### As an Admin:
1. Log in to ShipNotes normally
2. Navigate to `/admin` directly or click Admin link if you add it to navigation
3. You'll see the dashboard with stats

### Access Control:
- Only users with `role = 'admin'` or `role = 'super_admin'` can access
- Regular users get "Access Denied"
- API routes are protected with the same logic

## 📊 Dashboard Features

### Main Dashboard (`/admin`)
Shows key metrics:
- Total users
- Pro subscribers (Stripe)
- Trial users
- Manual subscriptions (admin-granted)
- Changelog generation stats
- New user signups

### User Management (`/admin/users`)
Manage all users with:
- **Search**: Find users by username or email
- **View All Users**: See subscription status, role, join date
- **Grant Subscription**: Gift Starter or Pro access
  - Set expiration date or make it lifetime
  - Add reason and notes
- **Change Roles**: Make users admin or super admin
- **Activity Log**: All actions are logged automatically

## 🎁 Gifting Subscriptions

### How to Gift a Subscription:

1. Go to `/admin/users`
2. Find the user in the table
3. Click "Gift Sub" button
4. Fill in the form:
   - **Plan**: Starter or Pro
   - **Reason**: Required (e.g., "gift", "support", "promotion")
   - **Expires At**: Optional (leave empty for lifetime)
   - **Notes**: Optional additional context
5. Click "Grant Access"

### What Happens:
- User immediately gets access to the selected plan
- New record created in `manual_subscriptions` table
- Admin action logged in `admin_activity_log`
- User can use all features of their granted plan

## 👥 Making Another Admin

### Option 1: Via Dashboard
1. Go to `/admin/users`
2. Find the user
3. Change their role dropdown from "User" to "Admin" or "Super Admin"
4. Confirm the change

### Option 2: Via SQL
```sql
UPDATE users
SET role = 'admin'
WHERE email = 'new-admin@example.com';
```

### Role Differences:
- **user**: Regular user (default)
- **admin**: Can access admin dashboard, manage users, grant subscriptions
- **super_admin**: Same as admin (prepared for future permissions)

## 🔍 Activity Logging

All admin actions are automatically logged:
- Grant subscription
- Revoke subscription
- Update user role

Each log entry includes:
- Admin who performed the action
- Target user
- Action type
- Detailed information (plan, reason, etc.)
- Timestamp

## 🚨 Security Notes

### Important:
- Never share your Supabase service role key
- Use Row Level Security (RLS) policies (already set up)
- Admin routes check authentication server-side
- All mutations log the admin who performed them

### RLS Policies Implemented:
- Only admins can read/write manual subscriptions
- Only admins can read activity logs
- Regular users cannot see or modify admin data

## 📝 API Endpoints

Available admin endpoints:

```
GET  /api/admin/stats              - Platform statistics
GET  /api/admin/users              - List all users
POST /api/admin/users/[id]/role    - Update user role
POST /api/admin/subscriptions/grant - Grant subscription
POST /api/admin/subscriptions/revoke - Revoke subscription
GET  /api/admin/activity-log       - View admin actions
```

All endpoints require admin authentication.

## 🛠️ Troubleshooting

### "Access Denied" Error
- Make sure you set your role to 'admin' or 'super_admin' in the database
- Clear cookies and log in again
- Check that migrations ran successfully

### Stats Not Loading
- Verify `admin_stats` view exists in Supabase
- Check service role key is set correctly
- Look for errors in browser console

### Can't Grant Subscription
- Ensure manual_subscriptions table exists
- Verify RLS policies are enabled
- Check target user exists

## 🎨 Customization

### Adding Navigation Link
Add to your main navigation (e.g., in header):

```tsx
{user?.role === 'admin' || user?.role === 'super_admin' ? (
  <Link href="/admin">
    <Button variant="ghost">Admin</Button>
  </Link>
) : null}
```

### Styling
The dashboard uses your existing theme and component library:
- Dark mode compatible
- Responsive design
- Tailwind CSS classes

## 📞 Support

If you need help:
1. Check Supabase logs for errors
2. Verify all migrations ran
3. Ensure environment variables are set
4. Check browser console for client errors

---

**Built for ShipNotes** - Team Translation Layer for Git Commits
