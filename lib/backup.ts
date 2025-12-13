import type { Note } from "@/components/personal-organizer-app"

export function backupNotesToJSON(notes: Note[]) {
  const backup = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    notes: notes.map((note) => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
  }

  const dataStr = JSON.stringify(backup, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement("a")
  link.href = url
  link.download = `notes_backup_${new Date().toISOString().split("T")[0]}.json`
  link.click()

  URL.revokeObjectURL(url)
}

export async function restoreNotesFromJSON(file: File): Promise<Note[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string)
        const notes: Note[] = backup.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }))
        resolve(notes)
      } catch (error) {
        reject(new Error("Invalid backup file"))
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}
