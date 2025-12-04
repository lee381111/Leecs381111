"use server"

import { createServerClient } from "@/lib/supabase/server"

export type UploadResult = {
  success: boolean
  file?: {
    name: string
    url: string
    type: string
    path: string
  }
  error?: string
}

export async function uploadFileToStorageAction(
  fileData: string, // base64 encoded file data
  fileName: string,
  fileType: string,
  userId: string,
): Promise<UploadResult> {
  try {
    const supabase = await createServerClient()

    const base64Data = fileData.split(",")[1]
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Create a unique file path: userId/timestamp-filename
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filePath = `${userId}/${timestamp}-${sanitizedFileName}`

    console.log("[v0] Server: Uploading file to Storage:", {
      fileName,
      filePath,
      fileSize: bytes.length,
      fileType,
    })

    const { data, error } = await supabase.storage.from("note-attachments").upload(filePath, bytes, {
      contentType: fileType,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("[v0] Server: Storage upload error:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("note-attachments").getPublicUrl(data.path)

    console.log("[v0] Server: File uploaded successfully:", {
      path: data.path,
      publicUrl: urlData.publicUrl,
    })

    return {
      success: true,
      file: {
        name: fileName,
        url: urlData.publicUrl,
        type: fileType,
        path: data.path,
      },
    }
  } catch (error) {
    console.error("[v0] Server: Upload exception:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
