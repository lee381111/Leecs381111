"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, Play, Pause, Music, VideoIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type MediaViewerProps = {
  isOpen: boolean
  onClose: () => void
  mediaUrl: string
  mediaType: "image" | "video" | "audio"
  fileName: string
}

export function MediaViewer({ isOpen, onClose, mediaUrl, mediaType, fileName }: MediaViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    try {
      const link = document.createElement("a")
      link.href = mediaUrl
      link.download = fileName
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "다운로드 시작",
        description: `${fileName} 다운로드를 시작합니다.`,
      })
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "다운로드 실패",
        description: "파일 다운로드에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <h3 className="font-medium truncate flex-1 mr-4">{fileName}</h3>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center p-4 bg-black/5 overflow-auto">
            {mediaType === "image" && (
              <img
                src={mediaUrl || "/placeholder.svg"}
                alt={fileName}
                loading="lazy"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}

            {mediaType === "video" && (
              <div className="w-full max-w-4xl">
                <div className="flex items-center justify-center mb-4">
                  <VideoIcon className="h-8 w-8 text-primary mr-2" />
                  <p className="text-sm text-muted-foreground">비디오 재생</p>
                </div>
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  className="w-full rounded-lg shadow-lg"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <track kind="captions" />
                </video>
              </div>
            )}

            {mediaType === "audio" && (
              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-center p-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg shadow-lg">
                  <div className="text-center">
                    {isPlaying ? (
                      <Pause className="h-20 w-20 mx-auto mb-4 text-primary animate-pulse" />
                    ) : (
                      <Play className="h-20 w-20 mx-auto mb-4 text-primary" />
                    )}
                    <Music className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                    <p className="text-sm font-medium text-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground mt-1">오디오 파일</p>
                  </div>
                </div>
                <audio
                  src={mediaUrl}
                  controls
                  autoPlay
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <track kind="captions" />
                </audio>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
