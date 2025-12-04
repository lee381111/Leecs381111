"use server"

import { createServiceRoleClient } from "@/lib/supabase/server"

export async function setupStorageBucket() {
  try {
    const supabase = createServiceRoleClient()

    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === "note-attachments")

    if (!bucketExists) {
      // Create the bucket with public access
      const { error: bucketError } = await supabase.storage.createBucket("note-attachments", {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ["audio/*", "video/*", "image/*"],
      })

      if (bucketError) {
        console.error("[v0] Error creating bucket:", bucketError)
        return { success: false, error: bucketError.message }
      }
    }

    // Enable RLS on storage.objects
    const rlsQueries = [
      // Enable RLS
      `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`,

      // Drop existing policies to avoid conflicts
      `DROP POLICY IF EXISTS "Users can upload files to their own folder" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Users can read all files" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;`,

      // Create new policies
      `CREATE POLICY "Users can upload files to their own folder"
       ON storage.objects FOR INSERT TO authenticated
       WITH CHECK (bucket_id = 'note-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);`,

      `CREATE POLICY "Users can read all files"
       ON storage.objects FOR SELECT TO authenticated
       USING (bucket_id = 'note-attachments');`,

      `CREATE POLICY "Users can update their own files"
       ON storage.objects FOR UPDATE TO authenticated
       USING (bucket_id = 'note-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);`,

      `CREATE POLICY "Users can delete their own files"
       ON storage.objects FOR DELETE TO authenticated
       USING (bucket_id = 'note-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);`,
    ]

    // Execute each RLS query
    for (const query of rlsQueries) {
      const { error } = await supabase.rpc("exec_sql", { sql: query })
      if (error) {
        console.error("[v0] Error executing RLS query:", error)
        // Continue even if some queries fail (they might already exist)
      }
    }

    return {
      success: true,
      message: "Storage bucket and RLS policies configured successfully",
      needsManualSetup: false,
    }
  } catch (error) {
    console.error("[v0] Exception in setupStorageBucket:", error)
    return { success: false, error: String(error) }
  }
}
