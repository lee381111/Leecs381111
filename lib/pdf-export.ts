import { jsPDF } from "jspdf"
import type { Note } from "@/components/personal-organizer-app"

export function exportNoteToPDF(note: Note) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text(note.title, 20, 20)

  // Date
  doc.setFontSize(10)
  doc.text(`Created: ${note.createdAt.toLocaleString()}`, 20, 30)

  // Content
  doc.setFontSize(12)
  const splitContent = doc.splitTextToSize(note.content, 170)
  doc.text(splitContent, 20, 40)

  // Save
  const fileName = `${note.title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.pdf`
  doc.save(fileName)
}
