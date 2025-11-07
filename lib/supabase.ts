import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Use service role key for backend operations (bypasses RLS)
    // This is safe because this function is only called server-side
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseInstance
}

// For backwards compatibility
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  get auth() {
    return getSupabase().auth
  }
} as any

// Database types
export type User = {
  id: string
  github_id: string
  github_username: string
  email: string
  avatar_url?: string
  created_at: string
  subscription_status: 'trial' | 'pro' | 'expired'
  role?: 'user' | 'admin' | 'super_admin'
}

export type ManualSubscription = {
  id: string
  user_id: string
  granted_by: string
  plan: 'starter' | 'pro'
  expires_at: string | null
  reason: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AdminActivityLog = {
  id: string
  admin_id: string
  action: string
  target_user_id?: string
  details?: Record<string, any>
  created_at: string
}

export type AdminStats = {
  total_users: number
  pro_users: number
  trial_users: number
  manual_subscriptions: number
  total_changelogs: number
  changelogs_last_30_days: number
  new_users_last_7_days: number
}

export type Changelog = {
  id: string
  user_id: string
  repo_name: string
  repo_owner: string
  commit_count: number
  technical_output: string
  user_output: string
  created_at: string
}

export type Usage = {
  id: string
  user_id: string
  action: 'generate' | 'copy' | 'export'
  created_at: string
}

// Helper functions
export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as User
}

export async function getUserByGithubId(githubId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('github_id', githubId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as User | null
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as User | null
}

export async function createUser(userData: Omit<User, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function createChangelog(changelogData: Omit<Changelog, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('changelogs')
    .insert([changelogData])
    .select()
    .single()

  if (error) throw error
  return data as Changelog
}

export async function trackUsage(userId: string, action: Usage['action']) {
  const { error } = await supabase
    .from('usage')
    .insert([{ user_id: userId, action }])

  if (error) throw error
}

export async function getUserChangelogs(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('changelogs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Changelog[]
}

export async function getUserUsageCount(userId: string, action: Usage['action']) {
  const { count, error } = await supabase
    .from('usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)

  if (error) throw error
  return count || 0
}

export async function updateUserSubscriptionStatus(
  email: string,
  subscriptionStatus: User['subscription_status']
) {
  const { data, error } = await supabase
    .from('users')
    .update({ subscription_status: subscriptionStatus })
    .eq('email', email)
    .select()
    .single()

  if (error) throw error
  return data as User
}

// Admin-specific functions
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await getUser(userId)
    return user.role === 'admin' || user.role === 'super_admin'
  } catch {
    return false
  }
}

export async function getAllUsers(limit = 100, offset = 0) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as User[]
}

export async function updateUserRole(userId: string, role: User['role']) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function grantManualSubscription(
  userId: string,
  grantedBy: string,
  plan: ManualSubscription['plan'],
  reason: string,
  expiresAt: string | null = null,
  notes?: string
) {
  const { data, error } = await supabase
    .from('manual_subscriptions')
    .insert([{
      user_id: userId,
      granted_by: grantedBy,
      plan,
      reason,
      expires_at: expiresAt,
      notes,
      is_active: true
    }])
    .select()
    .single()

  if (error) throw error

  // Log the action
  await logAdminActivity(grantedBy, 'grant_subscription', userId, {
    plan,
    reason,
    expires_at: expiresAt
  })

  return data as ManualSubscription
}

export async function revokeManualSubscription(subscriptionId: string, adminId: string) {
  const { data, error } = await supabase
    .from('manual_subscriptions')
    .update({ is_active: false })
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) throw error

  // Log the action
  await logAdminActivity(adminId, 'revoke_subscription', data.user_id, {
    subscription_id: subscriptionId
  })

  return data as ManualSubscription
}

export async function getUserManualSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from('manual_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ManualSubscription[]
}

export async function getAdminStats() {
  const { data, error } = await supabase
    .from('admin_stats')
    .select('*')
    .single()

  if (error) throw error
  return data as AdminStats
}

export async function logAdminActivity(
  adminId: string,
  action: string,
  targetUserId?: string,
  details?: Record<string, any>
) {
  const { error } = await supabase
    .from('admin_activity_log')
    .insert([{
      admin_id: adminId,
      action,
      target_user_id: targetUserId,
      details
    }])

  if (error) throw error
}

export async function getAdminActivityLog(limit = 50) {
  const { data, error } = await supabase
    .from('admin_activity_log')
    .select(`
      *,
      admin:admin_id (github_username, email),
      target_user:target_user_id (github_username, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as any[]
}
