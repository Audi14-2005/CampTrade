-- Fixed Supabase setup script for CampTrade
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  user_id TEXT UNIQUE NOT NULL,
  group_name TEXT NOT NULL CHECK (group_name IN ('students', 'faculty', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_group_name ON users(group_name);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically create user record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_group TEXT;
  new_user_id TEXT;
BEGIN
  -- Determine group based on email domain
  IF NEW.email LIKE '%@gmail.com' OR NEW.email LIKE '%@outlook.com' OR NEW.email LIKE '%@yahoo.com' THEN
    user_group := 'students';
  ELSIF NEW.email LIKE '%@university.edu' OR NEW.email LIKE '%@college.edu' OR NEW.email LIKE '%@institute.edu' THEN
    user_group := 'faculty';
  ELSE
    user_group := 'students'; -- Default fallback
  END IF;

  -- Generate user_id (user_0001 to user_0500)
  new_user_id := 'user_' || LPAD((FLOOR(RANDOM() * 500) + 1)::TEXT, 4, '0');

  -- Insert into users table
  INSERT INTO public.users (id, email, user_id, group_name)
  VALUES (NEW.id, NEW.email, new_user_id, user_group);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON users;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Success message
SELECT 'Database setup completed successfully! Users will be created automatically when they sign up.' as message;
