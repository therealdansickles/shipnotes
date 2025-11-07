-- Admin Dashboard Schema Updates for ShipNotes
-- Run these migrations in your Supabase SQL editor

-- 1. Add role column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Create manual_subscriptions table for gifted/managed subscriptions
CREATE TABLE IF NOT EXISTS manual_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  granted_by UUID REFERENCES users(id) NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro')),
  expires_at TIMESTAMP WITH TIME ZONE,  -- NULL = lifetime
  reason TEXT NOT NULL,  -- 'gift', 'support', 'promotion', etc.
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_manual_subs_user_id ON manual_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_subs_granted_by ON manual_subscriptions(granted_by);
CREATE INDEX IF NOT EXISTS idx_manual_subs_active ON manual_subscriptions(is_active);

-- 3. Create admin_activity_log table for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) NOT NULL,
  action TEXT NOT NULL,  -- 'grant_subscription', 'revoke_subscription', 'update_role', etc.
  target_user_id UUID REFERENCES users(id),
  details JSONB,  -- Flexible field for action-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_target ON admin_activity_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_created ON admin_activity_log(created_at DESC);

-- 4. Row Level Security (RLS) Policies

-- Enable RLS on new tables
ALTER TABLE manual_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Manual subscriptions: Only admins can read/write
CREATE POLICY "Admins can view all manual subscriptions"
  ON manual_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert manual subscriptions"
  ON manual_subscriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update manual subscriptions"
  ON manual_subscriptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Admin activity log: Only admins can read
CREATE POLICY "Admins can view activity log"
  ON admin_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert activity log"
  ON admin_activity_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 5. Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to manual_subscriptions
CREATE TRIGGER update_manual_subscriptions_updated_at
  BEFORE UPDATE ON manual_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Helper function to check if user has active manual subscription
CREATE OR REPLACE FUNCTION has_active_manual_subscription(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM manual_subscriptions
    WHERE user_id = user_id_param
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- 7. Update subscription status function to account for manual subscriptions
CREATE OR REPLACE FUNCTION get_effective_subscription_status(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  manual_sub_plan TEXT;
  stripe_status TEXT;
BEGIN
  -- First check for active manual subscription
  SELECT plan INTO manual_sub_plan
  FROM manual_subscriptions
  WHERE user_id = user_id_param
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY created_at DESC
  LIMIT 1;

  IF manual_sub_plan IS NOT NULL THEN
    RETURN manual_sub_plan;
  END IF;

  -- Fall back to regular subscription_status from users table
  SELECT subscription_status INTO stripe_status
  FROM users
  WHERE id = user_id_param;

  RETURN stripe_status;
END;
$$ LANGUAGE plpgsql;

-- 8. Create view for admin dashboard stats
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE subscription_status = 'pro') as pro_users,
  (SELECT COUNT(*) FROM users WHERE subscription_status = 'trial') as trial_users,
  (SELECT COUNT(*) FROM manual_subscriptions WHERE is_active = true) as manual_subscriptions,
  (SELECT COUNT(*) FROM changelogs) as total_changelogs,
  (SELECT COUNT(*) FROM changelogs WHERE created_at > NOW() - INTERVAL '30 days') as changelogs_last_30_days,
  (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_last_7_days;

-- Grant permissions for service role
GRANT SELECT ON admin_stats TO service_role;

-- Done! Run this script in your Supabase SQL editor
