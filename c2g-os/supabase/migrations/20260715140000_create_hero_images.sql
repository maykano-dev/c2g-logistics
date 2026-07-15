CREATE TABLE IF NOT EXISTS public.hero_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    column_index INTEGER NOT NULL CHECK (column_index IN (1, 2, 3)),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.hero_images
    FOR SELECT USING (true);

CREATE POLICY "Enable update for admins only" ON public.hero_images
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    );

-- Seed defaults
INSERT INTO public.hero_images (image_url, column_index, sort_order) VALUES
('https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?w=400&q=80', 1, 1),
('https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80', 1, 2),
('https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80', 1, 3),
('https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?w=400&q=80', 1, 4),
('https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80', 1, 5),

('https://images.unsplash.com/photo-1491897554428-130a60dd4757?w=400&q=80', 2, 1),
('https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&q=80', 2, 2),
('https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80', 2, 3),
('https://images.unsplash.com/photo-1491897554428-130a60dd4757?w=400&q=80', 2, 4),
('https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&q=80', 2, 5),

('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', 3, 1),
('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80', 3, 2),
('https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&q=80', 3, 3),
('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', 3, 4),
('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80', 3, 5);
