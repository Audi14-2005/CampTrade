-- Create the items table for storing products
CREATE TABLE IF NOT EXISTS public.items (
  id bigserial PRIMARY KEY,
  item_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  price float4 NOT NULL,
  quantity integer DEFAULT 1,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  discount float4,
  discount_end_date date,
  status text DEFAULT 'published',
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view all published items
CREATE POLICY "Anyone can view published items" ON public.items
  FOR SELECT USING (status = 'published');

-- Policy for authenticated users to insert their own items
CREATE POLICY "Users can insert their own items" ON public.items
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Policy for users to update their own items
CREATE POLICY "Users can update their own items" ON public.items
  FOR UPDATE USING (auth.uid() = seller_id);

-- Policy for users to delete their own items
CREATE POLICY "Users can delete their own items" ON public.items
  FOR DELETE USING (auth.uid() = seller_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON items;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_seller_id ON public.items(seller_id);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at);
