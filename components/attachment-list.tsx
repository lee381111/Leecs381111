"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, Music, File, Maximize2, AlertCircle, Download } from "lucide-react"
import { MediaViewer } from "./media-viewer"
import { useToast } from "@/hooks/use-toast"

type UploadedFile = {
  name: string
  url: string
  type: string
}

type AttachmentListProps = {
  attachments: UploadedFile[]
  compact?: boolean
}

const getSimpleType = (mimeType: string): "image" | "video" | "audio" | "other" => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  return "other"
}

export function AttachmentList({ attachments, compact = false }: AttachmentListProps) {
  const { toast } = useToast()
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string
    type: "image" | "video" | "audio"
    name: string
  } | null>(null)

  const [attachmentErrors, setAttachmentErrors] = useState<Record<number, string>>({})
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const getIcon = (type: string) => {
    const simpleType = getSimpleType(type)
    switch (simpleType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const handleMediaError = (index: number, attachment: UploadedFile) => {
    const errorMessage = `${attachment.name} 로드 실패`
    setAttachmentErrors((prev) => ({
      ...prev,
      [index]: errorMessage,
    }))
  }

  const handleMediaClick = (attachment: UploadedFile, index: number) => {
    if (attachmentErrors[index]) {
      toast({
        title: "파일을 열 수 없습니다",
        description: attachmentErrors[index],
        variant: "destructive",
      })
      return
    }

    const simpleType = getSimpleType(attachment.type)

    if (simpleType === "image" || simpleType === "video" || simpleType === "audio") {
      setSelectedMedia({
        url: attachment.url,
        type: simpleType,
        name: attachment.name,
      })
    } else if (simpleType === "other") {
      window.open(attachment.url, "_blank")
    }
  }

  const handleDownload = (attachment: UploadedFile, e: React.MouseEvent) => {
    e.stopPropagation()

    const link = document.createElement("a")
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "다운로드 시작",
      description: `${attachment.name} 다운로드를 시작합니다.`,
    })
  }

  if (attachments.length === 0) return null

  if (compact) {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleMediaClick(attachment, index)}
              className="h-auto py-1 px-2"
            >
              {getIcon(attachment.type)}
              <span className="ml-1 text-xs truncate max-w-[100px]">{attachment.name}</span>
            </Button>
          ))}
        </div>
        {selectedMedia && (
          <MediaViewer
            isOpen={true}
            onClose={() => setSelectedMedia(null)}
            mediaUrl={selectedMedia.url}
            mediaType={selectedMedia.type}
            fileName={selectedMedia.name}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {attachments.map((attachment, index) => {
          const simpleType = getSimpleType(attachment.type)
          const hasError = !!attachmentErrors[index]

          return (
            <div key={index} className="flex flex-col gap-2">
              <button
                onClick={() => handleMediaClick(attachment, index)}
                className="relative group rounded-lg overflow-hidden border bg-muted/30 hover:bg-muted/50 transition-colors aspect-square"
              >
                {hasError && (
                  <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center z-10">
                    <div className="text-center p-2">
                      <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-1" />
                      <p className="text-xs text-destructive">로드 실패</p>
                    </div>
                  </div>
                )}

                {simpleType === "image" && (
                  <img
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={() => handleMediaError(index, attachment)}
                  />
                )}
                {simpleType === "video" && (
                  <div className="w-full h-full flex items-center justify-center bg-black/10">
                    <Video className="h-12 w-12 text-muted-foreground" />
                    <button
                      onClick={(e) => handleDownload(attachment, e)}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                      title="다운로드"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMediaClick(attachment, index)
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                      title="전체화면으로 보기"
                    >
                      <Maximize2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
                {simpleType === "audio" && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Music className="h-12 w-12 text-primary" />
                    <button
                      onClick={(e) => handleDownload(attachment, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                      title="다운로드"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
                {simpleType === "other" && (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                  {attachment.name}
                </div>
              </button>

              {simpleType === "audio" && (
                <>
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={attachment.url}
                    controls
                    onPlay={() => {
                      audioRefs.current.forEach((audio, i) => {
                        if (i !== index && audio && !audio.paused) {
                          audio.pause()
                        }
                      })
                    }}
                    onError={() => handleMediaError(index, attachment)}
                    preload="none"
                    className="w-full h-10"
                  />
                  {attachmentErrors[index] && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {attachmentErrors[index]}
                    </p>
                  )}
                </>
              )}

              {simpleType === "video" && (
                <>
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={attachment.url}
                    controls
                    onPlay={() => {
                      videoRefs.current.forEach((video, i) => {
                        if (i !== index && video && !video.paused) {
                          video.pause()
                        }
                      })
                    }}
                    onError={() => handleMediaError(index, attachment)}
                    preload="none"
                    playsInline
                    className="w-full rounded-lg"
                  />
                  {attachmentErrors[index] && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {attachmentErrors[index]}
                    </p>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      {selectedMedia && (
        <MediaViewer
          isOpen={true}
          onClose={() => setSelectedMedia(null)}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          fileName={selectedMedia.name}
        />
      )}
    </>
  )
}
