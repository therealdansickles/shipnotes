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
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (true);

-- Create policies for changelogs table
CREATE POLICY "Users can read their own changelogs" ON public.changelogs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own changelogs" ON public.changelogs
  FOR INSERT WITH CHECK (true);

-- Create policies for usage table
CREATE POLICY "Users can read their own usage" ON public.usage
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own usage" ON public.usage
  FOR INSERT WITH CHECK (true);
