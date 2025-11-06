-- ShipNotes Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id TEXT UNIQUE NOT NULL,
  github_username TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'pro', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create changelogs table
CREATE TABLE IF NOT EXISTS public.changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  repo_owner TEXT NOT NULL,
  commit_count INTEGER NOT NULL,
  technical_output TEXT NOT NULL,
  user_output TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage table
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('generate', 'copy', 'export')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_github_id ON public.users(github_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_changelogs_user_id ON public.changelogs(user_id);
CREATE INDEX IF NOT EXISTS idx_changelogs_created_at ON public.changelogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON public.usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_action ON public.usage(action);

-- Enable Row Level Security (RLS)
-- NOTE: Since this app uses cookie-based auth (not Supabase Auth), we enable RLS
-- but configure it to deny all direct access. The backend uses a service role key
-- to bypass RLS and enforces authorization at the application layer.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can read their own changelogs" ON public.changelogs;
DROP POLICY IF EXISTS "Users can insert their own changelogs" ON public.changelogs;
DROP POLICY IF EXISTS "Users can read their own usage" ON public.usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.usage;

-- Create restrictive policies (deny all direct access)
-- All database access should go through the API using the service role key
-- which bypasses RLS and implements proper authorization checks

-- Users table: No direct access allowed
CREATE POLICY "Deny all direct access to users" ON public.users
  FOR ALL USING (false);

-- Changelogs table: No direct access allowed
CREATE POLICY "Deny all direct access to changelogs" ON public.changelogs
  FOR ALL USING (false);

-- Usage table: No direct access allowed
CREATE POLICY "Deny all direct access to usage" ON public.usage
  FOR ALL USING (false);
