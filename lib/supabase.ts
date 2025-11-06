import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials not configured')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// For backwards compatibility
export const supabase = {
  get from() {
    return getSupabase().from
  },
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
