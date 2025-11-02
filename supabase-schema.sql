-- Smart Email Reply Assistant Database Schema
-- Run this in your Supabase SQL Editor

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_email TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('reply', 'summarize')),
  tone TEXT CHECK (tone IN ('friendly', 'professional', 'concise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own replies" ON replies;
DROP POLICY IF EXISTS "Users can insert own replies" ON replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON replies;

-- Create policy: Users can only see their own replies
CREATE POLICY "Users can view own replies"
  ON replies FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own replies
CREATE POLICY "Users can insert own replies"
  ON replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own replies
CREATE POLICY "Users can delete own replies"
  ON replies FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_replies_user_id ON replies(user_id);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON replies(created_at DESC);

-- Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'replies'
ORDER BY ordinal_position;
