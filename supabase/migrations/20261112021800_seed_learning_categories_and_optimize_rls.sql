-- Default AMM Learning categories and RLS policy performance optimization.
-- Applied to Supabase project yvfumgrywsqhsvjfnmzu on 2026-11-12.

drop policy if exists "learning categories public read" on public.learning_categories;
create policy "learning categories public read"
on public.learning_categories for select to anon, authenticated
using (is_active = true or lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning categories admin insert" on public.learning_categories;
create policy "learning categories admin insert"
on public.learning_categories for insert to authenticated
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning categories admin update" on public.learning_categories;
create policy "learning categories admin update"
on public.learning_categories for update to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com')
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning categories admin delete" on public.learning_categories;
create policy "learning categories admin delete"
on public.learning_categories for delete to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning resources public read" on public.learning_resources;
create policy "learning resources public read"
on public.learning_resources for select to anon, authenticated
using (
  (status = 'published' and exists (
    select 1 from public.learning_categories c
    where c.id = learning_resources.category_id and c.is_active = true
  ))
  or lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com'
);

drop policy if exists "learning resources admin insert" on public.learning_resources;
create policy "learning resources admin insert"
on public.learning_resources for insert to authenticated
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning resources admin update" on public.learning_resources;
create policy "learning resources admin update"
on public.learning_resources for update to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com')
with check (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "learning resources admin delete" on public.learning_resources;
create policy "learning resources admin delete"
on public.learning_resources for delete to authenticated
using (lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "AMM learning admin file upload" on storage.objects;
create policy "AMM learning admin file upload" on storage.objects for insert to authenticated
with check (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "AMM learning admin file update" on storage.objects;
create policy "AMM learning admin file update" on storage.objects for update to authenticated
using (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com')
with check (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

drop policy if exists "AMM learning admin file delete" on storage.objects;
create policy "AMM learning admin file delete" on storage.objects for delete to authenticated
using (bucket_id = 'amm-learning' and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'ammdatasolutions229@gmail.com');

insert into public.learning_categories (name,slug,description,icon,sort_order) values
('AI & Artificial Intelligence','ai','AI concepts, models, agents and practical applications.','brain-circuit',1),
('Automation & Workflows','automation','Practical automation for business and everyday work.','workflow',2),
('GitHub & Development','github-development','Useful repositories, GitHub skills, code and developer resources.','github',3),
('Prompts & Templates','prompts','Reusable prompts, templates and structured instructions.','message-square-text',4),
('Learning Roadmaps','roadmaps','Step-by-step learning paths, roadmaps and downloadable guides.','map',5),
('AI Tools & Software','ai-tools','Research-led guides to useful AI tools, software and websites.','app-window',6),
('Web & Digital Technology','web-technology','Website development, digital platforms and practical technology.','code',7),
('Data & Productivity','data-productivity','Data skills, analytics, organisation and productivity methods.','chart-no-axes-combined',8),
('Technology News & Trends','technology-trends','Explainers on technology updates, changes and emerging trends.','newspaper',9)
on conflict (slug) do nothing;
