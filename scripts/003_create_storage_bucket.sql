-- Create a storage bucket for note attachments
insert into storage.buckets (id, name, public)
values ('note-attachments', 'note-attachments', true)
on conflict (id) do nothing;

-- Enable RLS for the bucket
create policy "Allow authenticated users to upload their own files"
on storage.objects for insert
with check (
  bucket_id = 'note-attachments' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Allow users to view their own files"
on storage.objects for select
using (
  bucket_id = 'note-attachments'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Allow users to update their own files"
on storage.objects for update
using (
  bucket_id = 'note-attachments'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Allow users to delete their own files"
on storage.objects for delete
using (
  bucket_id = 'note-attachments'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to files (since bucket is public)
create policy "Allow public to view files"
on storage.objects for select
using (bucket_id = 'note-attachments');
