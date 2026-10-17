-- One master CV per user. Later stories add the other fields (see handoff spec §7).
create table public.master_cv (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text,
  updated_at timestamptz not null default now()
);

-- Row-level security: without a matching policy, nobody can read or change rows.
alter table public.master_cv enable row level security;

create policy "Users can view their own master CV"
  on public.master_cv for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own master CV"
  on public.master_cv for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own master CV"
  on public.master_cv for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own master CV"
  on public.master_cv for delete
  to authenticated
  using ((select auth.uid()) = user_id);