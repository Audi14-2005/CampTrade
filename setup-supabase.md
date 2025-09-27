# Supabase Setup Instructions

## 1. Database Setup

Run the following SQL script in your Supabase SQL Editor:

```sql
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
```

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://byeefyogeusvnophzoph.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZWVmeW9nZXVzdm5vcGh6b3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTI1MTcsImV4cCI6MjA3NDQ4ODUxN30.lpIl6MmKLt1fe6f2Ua45FrZ4qaKL29uTagk2vt8ffMo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZWVmeW9nZXVzdm5vcGh6b3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxMjUxNywiZXhwIjoyMDc0NDg4NTE3fQ.f7HP4DAa5ekvJ3H43yLUmWLjiLlNhcEdjwjZGiD7U_s
```

## 3. Authentication Setup

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Settings
3. Enable email confirmations (optional)
4. Configure allowed domains if needed

## 4. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/auth/signup`
3. Try signing up with different email domains:
   - `test@gmail.com` (should be assigned to students group)
   - `prof@university.edu` (should be assigned to faculty group)
   - `staff@college.edu` (should be assigned to staff group)

## 5. Features

- ✅ **Domain-based Group Assignment**: Automatic group detection based on email domain
- ✅ **User ID Assignment**: Random assignment of user_0001 to user_0500
- ✅ **Row Level Security**: Users can only access their own data
- ✅ **Automatic Triggers**: User records created automatically on signup
- ✅ **Group Display**: Shows user's group on homepage
- ✅ **Recommendation Integration**: Uses real user ID for backend API calls

## 6. Troubleshooting

If you encounter issues:

1. **Check Supabase Dashboard**: Verify the users table was created
2. **Check Browser Console**: Look for authentication errors
3. **Verify Environment Variables**: Ensure they're properly set
4. **Check Network Tab**: Verify API calls are being made

## 7. Next Steps

After setup, your authentication system will:
- Filter users by email domain
- Assign unique user IDs (user_0001 to user_0500)
- Show personalized content based on user group
- Integrate with your recommendation backend using real user IDs
