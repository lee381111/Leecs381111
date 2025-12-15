"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaTools } from "@/components/media-tools"
import { saveNote, deleteNote, loadNotes, type Note, type Attachment } from "@/lib/storage"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

export function NotesSection() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language as Language)

  const [notes, setNotes] = useState<Note[]>([])
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    attachments: [] as Attachment[],
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (user?.id) {
      loadNotesData()
    }
  }, [user?.id])

  const loadNotesData = async () => {
    if (!user?.id) return
    try {
      const allNotes = await loadNotes(user.id)
      setNotes(allNotes)
    } catch (error) {
      console.error("Failed to load notes:", error)
    }
  }

  const handleSave = async () => {
    if (!user?.id) return
    try {
      await saveNote(formData, editingId, user.id)
      setFormData({ title: "", content: "", tags: [], attachments: [] })
      setEditingId(null)
      await loadNotesData()
    } catch (error) {
      console.error("Failed to save note:", error)
    }
  }

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      attachments: note.attachments || [],
    })
    setEditingId(note.id)
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    if (confirm(t("confirm_delete"))) {
      try {
        await deleteNote(id, user.id)
        await loadNotesData()
      } catch (error) {
        console.error("Failed to delete note:", error)
      }
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setFormData({ ...formData, attachments })
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t("note_title")}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />

          <Textarea
            placeholder={t("note_content")}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="min-h-[200px]"
          />

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("add_tag")}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <MediaTools
            attachments={formData.attachments || []}
            onAttachmentsChange={handleAttachmentsChange}
            onSave={handleSave}
          />

          <Button onClick={handleSave} className="w-full">
            {editingId ? t("update") : t("save")}
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        {notes.map((note) => (
          <Card key={note.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{note.title}</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {note.attachments && note.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.attachments.map((att, idx) => (
                    <div key={idx} className="relative">
                      {att.type.startsWith("image/") ? (
                        <img
                          src={att.url || "/placeholder.svg"}
                          alt={att.name}
                          className="h-20 w-20 object-cover rounded"
                        />
                      ) : (
                        <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded text-xs">
                          {att.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
