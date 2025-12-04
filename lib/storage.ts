import { createClient } from "@/lib/supabase/client"
import { uploadFileToStorageAction } from "@/app/actions/upload-file"

export type StorageFile = {
  name: string
  url: string
  type: string
  path: string
}

export async function uploadFileToStorage(file: File, userId: string): Promise<StorageFile | null> {
  try {
    console.log("[v0] Converting file to base64 for server upload:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })

    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Upload via Server Action
    const result = await uploadFileToStorageAction(base64Data, file.name, file.type, userId)

    if (!result.success || !result.file) {
      console.error("[v0] Server upload failed:", result.error)
      return null
    }

    console.log("[v0] File uploaded successfully via server:", result.file)

    return result.file
  } catch (error) {
    console.error("[v0] Upload exception:", error)
    return null
  }
}

export async function deleteFileFromStorage(filePath: string): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage.from("note-attachments").remove([filePath])

    if (error) {
      console.error("Storage delete error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Delete error:", error)
    return false
  }
}

export async function uploadMultipleFiles(
  files: File[],
  userId: string,
  onProgress?: (current: number, total: number) => void,
): Promise<StorageFile[]> {
  const uploadedFiles: StorageFile[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const result = await uploadFileToStorage(file, userId)

    if (result) {
      uploadedFiles.push(result)
    }

    if (onProgress) {
      onProgress(i + 1, files.length)
    }
  }

  return uploadedFiles
}
