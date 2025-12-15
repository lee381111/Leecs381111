"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Trash2,
  Paperclip,
  Mic,
  Lock,
  Unlock,
  X,
  ImageIcon,
  Pencil,
  Search,
  PenTool,
  ArrowUpDown,
  Upload,
  Download,
  ScanLine,
  Star,
  FileDown,
  Sparkles,
  Loader2,
} from "lucide-react"
import type { Note } from "./personal-organizer-app"
import { useLanguage } from "@/lib/language-context"
import { AttachmentList } from "./attachment-list"
import { FormattingToolbar } from "./formatting-toolbar"
import { MarkdownRenderer } from "./markdown-renderer"
import { HandwritingCanvas } from "./handwriting-canvas"
import { createClient } from "@/lib/supabase/client"
import { extractTextFromImage, getOCRLanguage } from "@/lib/ocr"
import { uploadFileToStorage } from "@/lib/storage"
import { StorageSetupModal } from "./storage-setup-modal"

type LocalFile = {
  name: string
  url: string
  type: string
}

type NotesSectionProps = {
  notes: Note[]
  setNotes: (notes: Note[]) => void
  userId?: string
}

const TAG_COLORS: Record<string, string> = {
  "전체 태그": "bg-gray-500 hover:bg-gray-600",
  개인: "bg-red-500 hover:bg-red-600",
  개인업무: "bg-orange-500 hover:bg-orange-600",
  업무: "bg-purple-500 hover:bg-purple-600",
}

const getTagColor = (tag: string): string => {
  return TAG_COLORS[tag] || "bg-blue-500 hover:bg-blue-600"
}

export function NotesSection({ notes, setNotes, userId }: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [unlockedNotes, setUnlockedNotes] = useState<Set<string>>(new Set())
  const [passwordInput, setPasswordInput] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isLocked: false,
    password: "",
    tags: [] as string[],
    starred: false,
  })
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<LocalFile[]>([])
  const [uploadedAttachments, setUploadedAttachments] = useState<LocalFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonImportRef = useRef<HTMLInputElement>(null)
  const scanInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [newTag, setNewTag] = useState("")
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const { t, language } = useLanguage()

  const [summarizingNoteId, setSummarizingNoteId] = useState<string | null>(null)
  const [noteSummaries, setNoteSummaries] = useState<Record<string, string>>({})
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [pendingSaveOperation, setPendingSaveOperation] = useState<"add" | "update" | null>(null)
  const [showStorageSetupModal, setShowStorageSetupModal] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [storageSetupComplete, setStorageSetupComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB in bytes

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE)
      if (oversizedFiles.length > 0) {
        const messages = {
          ko: `파일 크기는 50MB를 초과할 수 없습니다. 다음 파일이 너무 큽니다:\n${oversizedFiles.map((f) => f.name).join("\n")}`,
          en: `File size cannot exceed 50MB. The following files are too large:\n${oversizedFiles.map((f) => f.name).join("\n")}`,
          zh: `文件大小不能超过50MB。以下文件太大：\n${oversizedFiles.map((f) => f.name).join("\n")}`,
          ja: `ファイルサイズは50MBを超えることはできません。次のファイルが大きすぎます：\n${oversizedFiles.map((f) => f.name).join("\n")}`,
        }
        alert(messages[language])
        return
      }

      setAttachedFiles([...attachedFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      const messages = {
        ko: "음성 인식이 지원되지 않는 브라우저입니다.",
        en: "Speech recognition is not supported in this browser.",
        zh: "此浏览器不支持语音识别。",
        ja: "このブラウザは音声認識をサポートしていません。",
      }
      alert(messages[language])
      return
    }

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    const langCodes = { ko: "ko-KR", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
    recognition.lang = langCodes[language]

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setNewNote({ ...newNote, content: newNote.content + " " + transcript })
    }

    recognition.onerror = (event: any) => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleExportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `notes-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedNotes = JSON.parse(event.target?.result as string)
        const notesWithDates = importedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }))
        setNotes([...notes, ...notesWithDates])
        alert(t("importSuccess") || "노트를 성공적으로 가져왔습니다")
      } catch (error) {
        alert(t("importError") || "노트 가져오기에 실패했습니다")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleToggleStar = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    const newStarredStatus = !note.starred

    const supabase = createClient()
    const { error } = await supabase.from("notes").update({ starred: newStarredStatus }).eq("id", noteId)

    if (error) {
      console.error("[v0] Error updating star status in Supabase:", error)
      return
    }

    setNotes(notes.map((n) => (n.id === noteId ? { ...n, starred: newStarredStatus } : n)))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
      setNewNote({ ...newNote, tags: [...newNote.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewNote({ ...newNote, tags: newNote.tags.filter((t) => t !== tag) })
  }

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])))

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.content || !userId) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const videoAudioFiles = attachedFiles.filter((f) => f.type.startsWith("audio/") || f.type.startsWith("video/"))
      const otherFiles = attachedFiles.filter((f) => !f.type.startsWith("audio/") && !f.type.startsWith("video/"))

      let uploadedFiles: LocalFile[] = [...uploadedAttachments]

      if (otherFiles.length > 0) {
        const dataUrlFiles = await Promise.all(
          otherFiles.map(
            (file) =>
              new Promise<LocalFile>((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  resolve({
                    name: file.name,
                    url: e.target?.result as string,
                    type: file.type,
                  })
                }
                reader.readAsDataURL(file)
              }),
          ),
        )
        uploadedFiles = [...uploadedFiles, ...dataUrlFiles]
      }

      if (videoAudioFiles.length > 0) {
        toast({
          title: "파일 업로드 중",
          description: `${videoAudioFiles.length}개의 파일을 업로드하고 있습니다...`,
        })

        const storageFiles = await convertFilesToDataUrls(videoAudioFiles, userId)
        uploadedFiles = [...uploadedFiles, ...storageFiles]

        if (storageFiles.length < videoAudioFiles.length) {
          toast({
            title: "일부 파일 업로드 실패",
            description: "일부 동영상/오디오 파일 업로드에 실패했습니다. 다른 내용은 저장됩니다.",
            variant: "destructive",
          })
        }
      }

      console.log("[v0] Saving note with attachments:", uploadedFiles)

      const noteData = {
        user_id: userId,
        title: newNote.title,
        content: newNote.content,
        is_locked: newNote.isLocked,
        password: newNote.isLocked ? newNote.password : null,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : null,
        tags: newNote.tags.length > 0 ? newNote.tags : null,
        starred: newNote.starred,
      }

      console.log("[v0] Note data being saved:", noteData)

      const supabase = createClient()
      const { data, error } = await supabase.from("notes").insert([noteData]).select().single()

      if (error) {
        console.error("[v0] Error saving note to Supabase:", error)
        toast({
          title: "저장 실패",
          description: `노트 저장에 실패했습니다: ${error.message}`,
          variant: "destructive",
        })
        return
      }

      if (data) {
        console.log("[v0] Note saved, data returned from DB:", data)

        const note: Note = {
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: new Date(data.created_at),
          isLocked: data.is_locked || false,
          password: data.password || undefined,
          attachments: data.attachments || undefined,
          tags: data.tags || undefined,
          starred: data.starred || false,
          user_id: data.user_id,
        }

        console.log("[v0] Note object being added to state:", note)

        setNotes([note, ...notes])
        setNewNote({ title: "", content: "", isLocked: false, password: "", tags: [], starred: false })
        setAttachedFiles([])
        setUploadedAttachments([])
        setIsAdding(false)

        toast({
          title: "저장 완료",
          description: "노트가 성공적으로 저장되었습니다.",
        })
      }
    } catch (error) {
      console.error("[v0] Exception in handleAddNote:", error)
      toast({
        title: "오류 발생",
        description: "노트 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("notes").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting note from Supabase:", error)
      alert("노트 삭제에 실패했습니다.")
      return
    }

    setNotes(notes.filter((n) => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  const handleEdit = (note: Note) => {
    console.log("[v0] Editing note:", note)
    console.log("[v0] Note attachments:", note.attachments)

    setEditingId(note.id)
    setNewNote({
      title: note.title,
      content: note.content,
      isLocked: note.isLocked,
      password: note.password || "",
      tags: note.tags || [],
      starred: note.starred || false,
    })
    setExistingAttachments((note.attachments as LocalFile[]) || [])
    setAttachedFiles([])
    setIsAdding(true)
    setSelectedNote(null)
  }

  const handleUpdate = async () => {
    if (!editingId || !newNote.title || !newNote.content || !userId) return

    setIsSaving(true)

    try {
      const videoAudioFiles = attachedFiles.filter((f) => f.type.startsWith("audio/") || f.type.startsWith("video/"))
      const otherFiles = attachedFiles.filter((f) => !f.type.startsWith("audio/") && !f.type.startsWith("video/"))

      let uploadedFiles: LocalFile[] = [...uploadedAttachments]

      if (otherFiles.length > 0) {
        const dataUrlFiles = await Promise.all(
          otherFiles.map(
            (file) =>
              new Promise<LocalFile>((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  resolve({
                    name: file.name,
                    url: e.target?.result as string,
                    type: file.type,
                  })
                }
                reader.readAsDataURL(file)
              }),
          ),
        )
        uploadedFiles = [...uploadedFiles, ...dataUrlFiles]
      }

      if (videoAudioFiles.length > 0) {
        toast({
          title: "파일 업로드 중",
          description: `${videoAudioFiles.length}개의 파일을 업로드하고 있습니다...`,
        })

        const storageFiles = await convertFilesToDataUrls(videoAudioFiles, userId)
        uploadedFiles = [...uploadedFiles, ...storageFiles]

        if (storageFiles.length < videoAudioFiles.length) {
          toast({
            title: "일부 파일 업로드 실패",
            description: "일부 동영상/오디오 파일 업로드에 실패했습니다. 다른 내용은 저장됩니다.",
            variant: "destructive",
          })
        }
      }

      const allAttachments = [...existingAttachments, ...uploadedFiles]

      const noteData = {
        title: newNote.title,
        content: newNote.content,
        is_locked: newNote.isLocked,
        password: newNote.isLocked ? newNote.password : null,
        attachments: allAttachments.length > 0 ? allAttachments : null,
        tags: newNote.tags.length > 0 ? newNote.tags : null,
        starred: newNote.starred,
      }

      const supabase = createClient()
      const { data, error } = await supabase.from("notes").update(noteData).eq("id", editingId).select().single()

      if (error) {
        console.error("[v0] Error updating note in Supabase:", error)
        toast({
          title: "업데이트 실패",
          description: `노트 업데이트에 실패했습니다: ${error.message}`,
          variant: "destructive",
        })
        return
      }

      if (data) {
        const updatedNote: Note = {
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: new Date(data.created_at),
          isLocked: data.is_locked || false,
          password: data.password || undefined,
          attachments: data.attachments || undefined,
          tags: data.tags || undefined,
          starred: data.starred || false,
          user_id: data.user_id,
        }

        setNotes(notes.map((n) => (n.id === editingId ? updatedNote : n)))
        setNewNote({ title: "", content: "", isLocked: false, password: "", tags: [], starred: false })
        setAttachedFiles([])
        setExistingAttachments([])
        setUploadedAttachments([])
        setEditingId(null)
        setIsAdding(false)

        toast({
          title: "업데이트 완료",
          description: "노트가 성공적으로 업데이트되었습니다.",
        })
      }
    } catch (error) {
      console.error("[v0] Exception in handleUpdate:", error)
      toast({
        title: "오류 발생",
        description: "노트 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewNote({ title: "", content: "", isLocked: false, password: "", tags: [], starred: false })
    setAttachedFiles([])
    setExistingAttachments([])
    setUploadedAttachments([])
  }

  const handleHandwritingSave = async (imageBlob: Blob) => {
    const file = new File([imageBlob], `handwriting-${Date.now()}.png`, { type: "image/png" })
    setAttachedFiles([...attachedFiles, file])
  }

  const handleUnlock = (note: Note) => {
    if (passwordInput === note.password) {
      setUnlockedNotes(new Set([...unlockedNotes, note.id]))
      setSelectedNote(note)
      setPasswordInput("")
    } else {
      const messages = {
        ko: "비밀번호가 틀렸습니다",
        en: "Incorrect password",
        zh: "密码错误",
        ja: "パスワードが間違っています",
      }
      alert(messages[language])
    }
  }

  const handleLock = (note: Note) => {
    const newUnlockedNotes = new Set(unlockedNotes)
    newUnlockedNotes.delete(note.id)
    setUnlockedNotes(newUnlockedNotes)
    if (selectedNote?.id === note.id) {
      setSelectedNote(null)
    }
  }

  const isNoteUnlocked = (note: Note) => {
    return !note.isLocked || unlockedNotes.has(note.id)
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag === "all" || note.tags?.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.createdAt.getTime() - a.createdAt.getTime()
    } else {
      return a.createdAt.getTime() - b.createdAt.getTime()
    }
  })

  const handleScanImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_IMAGE_SIZE) {
        const errorMessages = {
          ko: "이미지 파일 크기는 10MB를 초과할 수 없습니다. 더 작은 이미지를 선택해주세요.",
          en: "Image file size cannot exceed 10MB. Please select a smaller image.",
          zh: "图片文件大小不能超过10MB。请选择较小的图片。",
          ja: "画像ファイルのサイズは10MBを超えることはできません。より小さい画像を選択してください。",
        }
        toast({
          title: "파일 크기 초과",
          description: errorMessages[language],
          variant: "destructive",
        })
        e.target.value = ""
        return
      }

      try {
        const compressedFile = await compressImage(file)
        setAttachedFiles([...attachedFiles, compressedFile])
      } catch (error) {
        console.error("[v0] Image compression error:", error)
        // If compression fails, use original file
        setAttachedFiles([...attachedFiles, file])
      }

      // Open the note editor if not already open
      if (!isAdding) {
        setIsAdding(true)
      }

      // Perform OCR
      setIsProcessingOCR(true)
      try {
        const ocrLanguage = getOCRLanguage(language)
        const extractedText = await extractTextFromImage(file, ocrLanguage)

        if (extractedText.trim()) {
          // Add extracted text to note content
          const separator = newNote.content ? "\n\n" : ""
          setNewNote({
            ...newNote,
            content: newNote.content + separator + `[스캔된 텍스트]\n${extractedText.trim()}`,
          })

          toast({
            title: "텍스트 추출 완료",
            description: "이미지에서 텍스트를 추출했습니다!",
          })
        } else {
          toast({
            title: "텍스트 없음",
            description: "이미지에서 텍스트를 찾을 수 없습니다. 이미지가 첨부되었습니다.",
          })
        }
      } catch (error) {
        console.error("[v0] OCR Error:", error)
        toast({
          title: "텍스트 추출 실패",
          description: "텍스트 추출에 실패했습니다. 이미지는 첨부되었습니다.",
          variant: "destructive",
        })
      } finally {
        setIsProcessingOCR(false)
      }
    }
    e.target.value = ""
  }

  const handleDownloadPDF = (note: Note) => {
    const content = `
${note.title}
${"=".repeat(note.title.length)}

작성일: ${note.createdAt.toLocaleDateString()}
${note.tags && note.tags.length > 0 ? `태그: ${note.tags.join(", ")}` : ""}

${note.content}

${note.attachments && note.attachments.length > 0 ? `\n첨부파일: ${note.attachments.length}개` : ""}
    `.trim()

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${note.title.replace(/[^a-zA-Z0-9가-힣]/g, "_")}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const translateTag = (tag: string): string => {
    const tagTranslations: Record<string, string> = {
      개인: t("personal"),
      업무: t("work"),
      중요: t("important"),
      개인업무: t("personalWork"),
    }
    return tagTranslations[tag] || tag
  }

  const handleFormat = (format: string) => {
    const textarea = contentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = newNote.content.substring(start, end)
    const beforeText = newNote.content.substring(0, start)
    const afterText = newNote.content.substring(end)

    let newText = ""
    let cursorOffset = 0

    switch (format) {
      case "bold":
        newText = `${beforeText}**${selectedText || "텍스트"}**${afterText}`
        cursorOffset = selectedText ? selectedText.length + 4 : 2
        break
      case "italic":
        newText = `${beforeText}*${selectedText || "텍스트"}*${afterText}`
        cursorOffset = selectedText ? selectedText.length + 2 : 1
        break
      case "strikethrough":
        newText = `${beforeText}~~${selectedText || "텍스트"}~~${afterText}`
        cursorOffset = selectedText ? selectedText.length + 4 : 2
        break
      case "h1":
        newText = `${beforeText}# ${selectedText || "제목 1"}${afterText}`
        cursorOffset = selectedText ? selectedText.length + 2 : 2
        break
      case "h2":
        newText = `${beforeText}## ${selectedText || "제목 2"}${afterText}`
        cursorOffset = selectedText ? selectedText.length + 3 : 3
        break
      case "h3":
        newText = `${beforeText}### ${selectedText || "제목 3"}${afterText}`
        cursorOffset = selectedText ? selectedText.length + 4 : 4
        break
      case "bulletList":
        newText = `${beforeText}- ${selectedText || "항목"}${afterText}`
        cursorOffset = selectedText ? selectedText.length + 2 : 2
        break
      case "numberedList":
        newText = `${beforeText}1. ${selectedText || "항목"}${afterText}`
        cursorOffset = selectedText ? selectedText.length + 3 : 3
        break
      case "checklist":
        newText = `${beforeText}- [ ] ${selectedText || "할 일"}${afterText}`
        cursorOffset = selectedText ? selectedText.length + 6 : 6
        break
      case "code":
        newText = `${beforeText}\`${selectedText || "코드"}\`${afterText}`
        cursorOffset = selectedText ? selectedText.length + 2 : 1
        break
      default:
        return
    }

    setNewNote({ ...newNote, content: newText })

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + cursorOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleChecklistChange = async (noteId: string, newContent: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("notes").update({ content: newContent }).eq("id", noteId)

    if (error) {
      console.error("[v0] Error updating checklist in Supabase:", error)
      return
    }

    setNotes(notes.map((note) => (note.id === noteId ? { ...note, content: newContent } : note)))
  }

  const handleSummarizeNote = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    setSelectedNote(note)

    setSummarizingNoteId(noteId)

    try {
      const summary = extractiveSummary(note.content, note.title)
      setNoteSummaries({ ...noteSummaries, [noteId]: summary })
    } catch (error) {
      console.error("[v0] Error summarizing note:", error)
      alert("요약 생성에 실패했습니다.")
    } finally {
      setSummarizingNoteId(null)
    }
  }

  const extractiveSummary = (content: string, title: string): string => {
    const sentences = content
      .split(/[.!?。！？]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10)

    if (sentences.length === 0) {
      return "요약할 내용이 없습니다."
    }

    if (sentences.length <= 3) {
      return sentences.join(". ") + "."
    }

    const words = content
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)

    const wordFreq: Record<string, number> = {}
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })

    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "was",
      "are",
      "were",
      "been",
      "be",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "may",
      "might",
      "can",
      "것",
      "수",
      "등",
      "및",
      "이",
      "그",
      "저",
      "것이",
      "있다",
      "없다",
      "하다",
      "되다",
      "이다",
      "아니다",
      "때문",
      "통해",
      "대한",
      "위해",
      "따라",
      "관련",
    ])

    Object.keys(wordFreq).forEach((word) => {
      if (stopWords.has(word)) {
        delete wordFreq[word]
      }
    })

    const sentenceScores = sentences.map((sentence) => {
      const sentenceWords = sentence
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, "")
        .split(/\s+/)
      let score = 0
      sentenceWords.forEach((word) => {
        if (wordFreq[word]) {
          score += wordFreq[word]
        }
      })
      const titleWords = title.toLowerCase().split(/\s+/)
      titleWords.forEach((titleWord) => {
        if (sentence.toLowerCase().includes(titleWord)) {
          score += 5
        }
      })
      return { sentence, score }
    })

    const topSentences = sentenceScores.sort((a, b) => b.score - a.score).slice(0, 3)

    const orderedSentences = topSentences
      .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
      .map((s) => s.sentence)

    return orderedSentences.join(". ") + "."
  }

  const convertFilesToDataUrls = async (files: File[], userId: string): Promise<LocalFile[]> => {
    const results: LocalFile[] = []

    for (const file of files) {
      const isAudioOrVideo = file.type.startsWith("audio/") || file.type.startsWith("video/")

      if (isAudioOrVideo) {
        try {
          console.log("[v0] Uploading video/audio file:", file.name, file.size, "bytes")

          const storageFile = await uploadFileToStorage(file, userId)

          if (storageFile) {
            console.log("[v0] File uploaded successfully:", storageFile)
            results.push({
              name: storageFile.name,
              url: storageFile.url,
              type: storageFile.type,
            })
          } else {
            console.error("[v0] Failed to upload file to Storage:", file.name)
            toast({
              title: "파일 업로드 실패",
              description: `${file.name} 업로드에 실패했습니다.`,
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("[v0] Exception during file upload:", error)
          toast({
            title: "파일 업로드 오류",
            description: `${file.name} 업로드 중 오류가 발생했습니다.`,
            variant: "destructive",
          })
        }
      } else {
        // Use Data URLs for images
        const dataUrl = await new Promise<LocalFile>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              name: file.name,
              url: e.target?.result as string,
              type: file.type,
            })
          }
          reader.readAsDataURL(file)
        })
        results.push(dataUrl)
      }
    }

    return results
  }

  const handleStorageSetupSuccess = async () => {
    setStorageSetupComplete(true)

    if (pendingFiles.length > 0 && userId) {
      const uploadedFiles = await convertFilesToDataUrls(pendingFiles, userId)

      if (uploadedFiles.length > 0) {
        setUploadedAttachments(uploadedFiles)
        setPendingFiles([])
        setAttachedFiles([])

        const successMessages = {
          ko: "Storage 설정이 완료되었습니다! 파일을 업로드하고 노트를 저장합니다...",
          en: "Storage setup complete! Uploading files and saving note...",
          zh: "存储设置完成！正在上传文件并保存笔记...",
          ja: "ストレージ設定が完了しました！ファイルをアップロードしてノートを保存しています...",
        }

        if (pendingSaveOperation === "add") {
          setPendingSaveOperation(null)
          await handleAddNote()
        } else if (pendingSaveOperation === "update") {
          setPendingSaveOperation(null)
          await handleUpdate()
        }
      } else {
        console.error("[v0] Failed to upload pending files after Storage setup")
        const errorMessages = {
          ko: "파일 업로드에 실패했습니다. 파일 크기나 네트워크 연결을 확인해주세요.",
          en: "Failed to upload files. Please check file size or network connection.",
          zh: "文件上传失败。请检查文件大小或网络连接。",
          ja: "ファイルのアップロードに失敗しました。ファイルサイズまたはネットワーク接続を確認してください。",
        }
        alert(errorMessages[language])
      }
    }
  }

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          // Resize if image is too large
          const MAX_WIDTH = 1920
          const MAX_HEIGHT = 1920

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Failed to get canvas context"))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"))
                return
              }

              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })

              console.log(
                `[v0] Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
              )

              resolve(compressedFile)
            },
            "image/jpeg",
            0.8, // Quality: 0.8 = 80%
          )
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("notesTitle")}</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("addNote")}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input ref={jsonImportRef} type="file" accept=".json" className="hidden" onChange={handleImportNotes} />
        <input ref={scanInputRef} type="file" accept="image/*" className="hidden" onChange={handleScanImage} />

        <Button variant="outline" size="sm" onClick={() => jsonImportRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          {t("import")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportNotes}>
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => scanInputRef.current?.click()} disabled={isProcessingOCR}>
          <ScanLine className={`mr-2 h-4 w-4 ${isProcessingOCR ? "animate-spin" : ""}`} />
          {isProcessingOCR ? (language === "ko" ? "처리 중..." : "Processing...") : t("scan")}
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchNotesPlaceholder")}
            className="pl-9"
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-4">
          <Label className="mb-2 block text-sm font-medium">{t("filterByTag")}</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === "all" ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 ${selectedTag === "all" ? getTagColor("전체 태그") : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
              onClick={() => setSelectedTag("all")}
            >
              {t("allTags")}
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className={`cursor-pointer px-3 py-1 text-white ${getTagColor(tag)} ${selectedTag === tag ? "ring-2 ring-offset-2 ring-primary" : "opacity-80 hover:opacity-100"}`}
                onClick={() => setSelectedTag(tag)}
              >
                {translateTag(tag)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isAdding && (
        <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
          <h3 className="font-medium">{editingId ? t("editNote") : t("addNote")}</h3>
          <div className="flex items-center gap-2">
            <Switch
              id="star-note"
              checked={newNote.starred}
              onCheckedChange={(checked) => setNewNote({ ...newNote, starred: checked })}
            />
            <Label htmlFor="star-note" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {t("favorite")}
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-title">{t("noteTitle")}</Label>
            <Input
              id="note-title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder={t("noteTitle")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">{t("noteContent")}</Label>
            <FormattingToolbar onFormat={handleFormat} />
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={!showPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                {t("edit")}
              </Button>
              <Button
                type="button"
                variant={showPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                {t("preview")}
              </Button>
            </div>
            {!showPreview ? (
              <Textarea
                ref={contentTextareaRef}
                id="note-content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder={t("noteContent")}
                rows={6}
              />
            ) : (
              <div className="min-h-[150px] rounded-md border bg-background p-4">
                {newNote.content ? (
                  <MarkdownRenderer content={newNote.content} onChecklistChange={() => {}} editable={false} />
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noContentPreview")}</p>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("tags")}</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder={t("enterTag")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                {t("addTag")}
              </Button>
            </div>
            {newNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newNote.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {translateTag(tag)}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="lock-note"
              checked={newNote.isLocked}
              onCheckedChange={(checked) => setNewNote({ ...newNote, isLocked: checked })}
            />
            <Label htmlFor="lock-note">{t("passwordLock")}</Label>
          </div>
          {newNote.isLocked && (
            <div className="space-y-2">
              <Label htmlFor="note-password">{t("password")}</Label>
              <Input
                id="note-password"
                type="password"
                value={newNote.password}
                onChange={(e) => setNewNote({ ...newNote, password: e.target.value })}
                placeholder={t("password")}
              />
            </div>
          )}
          {existingAttachments.length > 0 && (
            <div className="space-y-2">
              <Label>{t("existingFiles")}</Label>
              <div className="flex flex-wrap gap-2">
                {existingAttachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => handleRemoveExistingAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>{t("attachedFiles")}</Label>
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleRemoveFile(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {uploadedAttachments.length > 0 && (
            <div className="space-y-2">
              <Label>{t("uploadedFiles")}</Label>
              <div className="flex flex-wrap gap-2">
                {uploadedAttachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    {/* No remove button here as these are already uploaded */}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={handleFileAttach}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="mr-2 h-4 w-4" />
              {t("attachFile")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsHandwritingOpen(true)}>
              <PenTool className="mr-2 h-4 w-4" />
              {t("handwriting")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
            >
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? t("recording") : t("voiceInput")}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={editingId ? handleUpdate : handleAddNote} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? t("update") : t("save")}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t("noteList")}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-xs">{sortOrder === "newest" ? t("sortNewest") : t("sortOldest")}</span>
          </Button>
        </div>

        {sortedNotes.length === 0 ? (
          <p className="text-center text-muted-foreground">{searchQuery ? t("noSearchResults") : t("noNotes")}</p>
        ) : (
          sortedNotes.map((note) => (
            <div key={note.id}>
              <div
                className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  selectedNote?.id === note.id ? "border-primary bg-muted/50" : ""
                }`}
                onClick={() => {
                  setSelectedNote(selectedNote?.id === note.id ? null : note)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {note.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      <h4 className="text-lg font-semibold">{note.title}</h4>
                      {note.isLocked && !unlockedNotes.has(note.id) && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      {note.isLocked && unlockedNotes.has(note.id) && <Unlock className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{note.createdAt.toLocaleDateString()}</p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className={`text-xs ${getTagColor(tag)} text-white`}>
                            {translateTag(tag)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleStar(note.id)
                      }}
                      title={note.starred ? "즐겨찾기 해제" : "즐겨찾기"}
                    >
                      <Star className={`h-4 w-4 ${note.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSummarizeNote(note.id)
                      }}
                      disabled={summarizingNoteId === note.id}
                      title="AI 요약"
                    >
                      <Sparkles
                        className={`h-4 w-4 ${summarizingNoteId === note.id ? "animate-pulse" : ""} ${noteSummaries[note.id] ? "text-green-600 fill-green-600" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadPDF(note)
                      }}
                      title={t("downloadPDF")}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(note)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(note.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedNote?.id === note.id && (
                  <div className="mt-2 rounded-lg border bg-muted/30 p-4">
                    {isNoteUnlocked(note) ? (
                      <div className="space-y-4">
                        {note.isLocked && (
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleLock(note)}>
                              <Lock className="mr-2 h-4 w-4" />
                              {t("lock")}
                            </Button>
                          </div>
                        )}
                        {noteSummaries[note.id] && (
                          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI 요약</h4>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{noteSummaries[note.id]}</p>
                          </div>
                        )}
                        <MarkdownRenderer
                          content={note.content}
                          onChecklistChange={(newContent) => handleChecklistChange(note.id, newContent)}
                          editable={true}
                        />
                        {note.attachments && note.attachments.length > 0 && (
                          <div className="space-y-2">
                            <Label>{t("attachedFiles")}</Label>
                            <AttachmentList attachments={note.attachments as LocalFile[]} />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {t("created")}: {note.createdAt.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          <h3 className="font-semibold">{t("locked")}</h3>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`unlock-password-${note.id}`}>{t("password")}</Label>
                          <Input
                            id={`unlock-password-${note.id}`}
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder={t("password")}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnlock(note)
                          }}
                        >
                          {t("unlock")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <StorageSetupModal
        isOpen={showStorageSetupModal}
        onClose={() => {
          setShowStorageSetupModal(false)
          setPendingFiles([])
        }}
        onSuccess={handleStorageSetupSuccess}
      />
      <HandwritingCanvas
        isOpen={isHandwritingOpen}
        onClose={() => setIsHandwritingOpen(false)}
        onSave={handleHandwritingSave}
      />
    </div>
  )
}
