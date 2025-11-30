-- Fix media_urls column type from text[] to jsonb for proper JSON storage
alter table public.notes 
  alter column media_urls type jsonb using media_urls::text::jsonb;

alter table public.diary_entries 
  alter column media_urls type jsonb using media_urls::text::jsonb;

alter table public.travel_records 
  alter column media_urls type jsonb using media_urls::text::jsonb;
