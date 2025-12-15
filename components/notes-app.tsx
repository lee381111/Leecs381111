"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "환영합니다",
      content: "메모 앱에 오신 것을 환영합니다. 새로운 메모를 추가하려면 아래 버튼을 클릭하세요.",
      createdAt: new Date(),
    },
  ])
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "새 메모",
      content: "",
      createdAt: new Date(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setIsEditing(true)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    if (selectedNote?.id === id) {
      setSelectedNote(updatedNotes[0] || null)
      setIsEditing(false)
    }
  }

  const startEditing = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title)
      setEditContent(selectedNote.content)
      setIsEditing(true)
    }
  }

  const saveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? { ...note, title: editTitle, content: editContent } : note,
      )
      setNotes(updatedNotes)
      setSelectedNote({ ...selectedNote, title: editTitle, content: editContent })
      setIsEditing(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-semibold text-foreground mb-4">메모</h1>
          <Button onClick={createNewNote} className="w-full" size="lg">
            <PlusIcon className="mr-2 h-5 w-5" />새 메모
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`p-4 mb-2 cursor-pointer transition-colors hover:bg-accent ${
                selectedNote?.id === note.id ? "bg-accent" : ""
              }`}
              onClick={() => {
                setSelectedNote(note)
                setIsEditing(false)
              }}
            >
              <h3 className="font-medium text-foreground mb-1 truncate">{note.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{note.content || "내용 없음"}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatDate(note.createdAt)}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-6 border-b border-border flex items-center justify-between">
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-semibold border-none p-0 h-auto focus-visible:ring-0"
                  placeholder="메모 제목"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-foreground">{selectedNote.title}</h2>
              )}
              <div className="flex gap-2">
                {isEditing ? (
                  <Button onClick={saveNote} size="icon" variant="default">
                    <CheckIcon className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button onClick={startEditing} size="icon" variant="outline">
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                )}
                <Button onClick={() => deleteNote(selectedNote.id)} size="icon" variant="outline">
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-full resize-none border-none p-0 text-base leading-relaxed focus-visible:ring-0"
                  placeholder="메모 내용을 입력하세요..."
                />
              ) : (
                <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedNote.content || "내용이 없습니다."}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">메모를 선택하세요</h2>
              <p className="text-muted-foreground">왼쪽에서 메모를 선택하거나 새로 만드세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
