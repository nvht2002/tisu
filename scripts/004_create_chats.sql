-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  system_instruction TEXT,
  temperature REAL DEFAULT 1.0,
  max_tokens INTEGER DEFAULT 8192,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chats_select_own" ON public.chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chats_insert_own" ON public.chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chats_update_own" ON public.chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "chats_delete_own" ON public.chats FOR DELETE USING (auth.uid() = user_id);
