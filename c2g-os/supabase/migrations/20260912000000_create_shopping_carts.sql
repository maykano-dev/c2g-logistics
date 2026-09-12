CREATE TABLE IF NOT EXISTS shopping_carts (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    cart_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own carts
CREATE POLICY "Users can view their own cart"
ON shopping_carts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart"
ON shopping_carts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
ON shopping_carts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart"
ON shopping_carts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
