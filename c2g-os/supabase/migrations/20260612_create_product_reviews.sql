-- Product Reviews Table
DROP TABLE IF EXISTS public.product_reviews CASCADE;

CREATE TABLE public.product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent users from reviewing the same product multiple times
    UNIQUE(product_id, user_id)
);

-- RLS Policies
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product reviews"
    ON public.product_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own reviews"
    ON public.product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.product_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.product_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Setup trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON public.product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
