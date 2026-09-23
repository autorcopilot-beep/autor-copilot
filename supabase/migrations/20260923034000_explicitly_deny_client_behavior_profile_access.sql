create policy "Behavior profiles are never client readable"
on public.user_behavior_profiles
for select
to authenticated
using (false);

comment on policy "Behavior profiles are never client readable" on public.user_behavior_profiles
is 'Explicit deny: only trusted service-role jobs and audited admin services may inspect aggregate behavior metadata.';
