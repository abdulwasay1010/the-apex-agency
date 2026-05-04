-- Add category and image_url to projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS view_url text;

CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- Public storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for project images
DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Admins manage project images
DROP POLICY IF EXISTS "Admins upload project images" ON storage.objects;
CREATE POLICY "Admins upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update project images" ON storage.objects;
CREATE POLICY "Admins update project images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins delete project images" ON storage.objects;
CREATE POLICY "Admins delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));
