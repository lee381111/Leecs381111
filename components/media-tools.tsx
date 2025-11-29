"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Mic, Video, ImageIcon, Trash2, Save, PenTool, X, FileImage, FileAudio } from "lucide-react"
import type { Attachment } from "@/lib/types"

// Using browser-based OCR with Tesseract.js workaround
declare global {
  interface Window {
    Tesseract: any
  }
}

interface MediaToolsProps {
  attachments: Attachment[]
  onAttachmentsChange: (attachments: Attachment[]) => void
  onSave?: (attachments: Attachment[]) => void
  saving?: boolean
  onAddContent?: (text: string) => void
}

export function MediaTools({ attachments = [], onAttachmentsChange, onSave, saving, onAddContent }: MediaToolsProps) {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [isVoiceRecognizing, setIsVoiceRecognizing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)
  const ocrVideoRef = useRef<HTMLVideoElement | null>(null)
  const [isOCRCameraOpen, setIsOCRCameraOpen] = useState(false)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newAttachment: Attachment = {
          type: file.type,
          name: file.name,
          data: reader.result as string,
          url: reader.result as string,
        }
        onAttachmentsChange([...attachments, newAttachment])
      }
      reader.readAsDataURL(file)
    })
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const reader = new FileReader()
        reader.onload = () => {
          onAttachmentsChange([
            ...attachments,
            {
              type: "audio",
              name: `audio_${Date.now()}.webm`,
              data: reader.result as string,
              url: reader.result as string,
            },
          ])
          setIsRecordingAudio(false)
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecordingAudio(true)
    } catch (error) {
      console.error("Audio recording error:", error)
      setIsRecordingAudio(false)
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop()
    }
  }

  const startVideoRecording = async () => {
    try {
      console.log("[v0] Starting video recording...")
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true })
      console.log(
        "[v0] Got media stream:",
        stream.getTracks().map((t) => t.kind),
      )
      streamRef.current = stream

      setIsRecordingVideo(true)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log("[v0] Set video srcObject")
        await videoRef.current.play()
        console.log("[v0] Video playing")
      } else {
        console.error("[v0] Video ref is null")
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      })
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        console.log("[v0] Data available, size:", e.data.size)
        chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        console.log("[v0] Recording stopped, chunks:", chunks.length)
        const blob = new Blob(chunks, { type: "video/webm" })
        console.log("[v0] Blob created, size:", blob.size)
        const reader = new FileReader()
        reader.onload = () => {
          console.log("[v0] Video saved to attachments")
          onAttachmentsChange([
            ...attachments,
            {
              type: "video/webm",
              name: `video_${Date.now()}.webm`,
              data: reader.result as string,
              url: reader.result as string,
            },
          ])
        }
        reader.readAsDataURL(blob)

        stream.getTracks().forEach((track) => {
          console.log("[v0] Stopping track:", track.kind)
          track.stop()
        })
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      }

      mediaRecorder.start()
      console.log("[v0] MediaRecorder started")
      mediaRecorderRef.current = mediaRecorder
    } catch (error) {
      console.error("[v0] Video recording error:", error)
      alert("비디오 녹화 권한이 필요합니다: " + (error as Error).message)
      setIsRecordingVideo(false)
    }
  }

  const stopVideoRecording = () => {
    console.log("[v0] Stopping video recording...")
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      setIsRecordingVideo(false)
    }
  }

  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      const video = document.createElement("video")
      video.setAttribute("playsinline", "true")
      video.srcObject = stream

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play()
          setTimeout(() => resolve(), 500)
        }
      })

      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      stream.getTracks().forEach((track) => track.stop())

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      onAttachmentsChange([
        ...attachments,
        {
          type: "image",
          name: `photo_${Date.now()}.jpg`,
          data: dataUrl,
          url: dataUrl,
        },
      ])
    } catch (error) {
      console.error("[v0] Camera error:", error)
      alert("카메라 권한이 필요합니다: " + (error as Error).message)
    }
  }

  const removeAttachment = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index))
  }

  const startDrawing = () => {
    setIsDrawing(true)
  }

  const closeDrawing = () => {
    setIsDrawing(false)
    setLastPos(null)
  }

  const saveDrawing = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png")
      onAttachmentsChange([
        ...attachments,
        {
          type: "drawing",
          name: `drawing_${Date.now()}.png`,
          data: dataUrl,
          url: dataUrl,
        },
      ])
      setIsDrawing(false)
      setLastPos(null)
    }
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  useEffect(() => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current
      const container = canvas.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        canvas.width = Math.min(rect.width - 32, 800)
        canvas.height = Math.min(window.innerHeight - 300, 600)
      }
    }
  }, [isDrawing])

  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return null
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true)
    const coords = getCanvasCoords(e.clientX, e.clientY)
    if (coords) setLastPos(coords)
  }

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setDrawing(true)
    if (e.touches[0]) {
      const coords = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY)
      if (coords) setLastPos(coords)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current || !lastPos) return

    const coords = getCanvasCoords(e.clientX, e.clientY)
    if (!coords) return

    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    }

    setLastPos(coords)
  }

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!drawing || !canvasRef.current || !lastPos || !e.touches[0]) return

    const coords = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY)
    if (!coords) return

    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    }

    setLastPos(coords)
  }

  const handleCanvasEnd = () => {
    setDrawing(false)
    setLastPos(null)
  }

  const openOCRCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setIsOCRCameraOpen(true)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (ocrVideoRef.current) {
        ocrVideoRef.current.srcObject = stream
        await ocrVideoRef.current.play()
      }
    } catch (error) {
      console.error("[v0] OCR camera error:", error)
      alert("카메라 권한이 필요합니다")
    }
  }

  const captureAndProcessOCR = async () => {
    if (!ocrVideoRef.current) return

    const video = ocrVideoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(video, 0, 0)
    }

    const stream = video.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsOCRCameraOpen(false)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    await performSimpleOCR(dataUrl)
  }

  const closeOCRCamera = () => {
    if (ocrVideoRef.current) {
      const stream = ocrVideoRef.current.srcObject as MediaStream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
    setIsOCRCameraOpen(false)
  }

  const performSimpleOCR = async (imageData: string) => {
    setIsProcessingOCR(true)
    setOcrProgress(10)

    try {
      console.log("[v0] OCR processing started")
      setOcrProgress(20)

      const Tesseract = await import("tesseract.js")

      setOcrProgress(30)
      console.log("[v0] Tesseract loaded")

      const worker = await Tesseract.createWorker("kor+eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            const progress = Math.floor(30 + m.progress * 60)
            setOcrProgress(progress)
          }
        },
      })

      console.log("[v0] Worker created, processing image...")

      const {
        data: { text },
      } = await worker.recognize(imageData)

      console.log("[v0] OCR completed, text length:", text.length)

      await worker.terminate()

      setOcrProgress(100)

      if (text.trim()) {
        if (onAddContent) {
          onAddContent(text.trim())
        }
        alert("이미지에서 텍스트 추출 완료:\n" + text.substring(0, 200) + (text.length > 200 ? "..." : ""))
      } else {
        alert("이미지에서 텍스트를 찾을 수 없습니다. 더 선명한 이미지를 사용해주세요.")
      }
    } catch (error) {
      console.error("[v0] OCR error:", error)
      alert("텍스트 추출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsProcessingOCR(false)
      setOcrProgress(0)
    }
  }

  const handleOCRFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      await performSimpleOCR(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const startVoiceRecognition = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        alert("음성 인식이 지원되지 않는 브라우저입니다.")
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = "ko-KR"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        console.log("[v0] Voice recognition started")
        setIsVoiceRecognizing(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log("[v0] Voice recognition result:", transcript)
        if (transcript && onAddContent) {
          onAddContent(transcript)
          console.log("[v0] Text added from voice recognition")
        }
      }

      recognition.onerror = (event: any) => {
        console.error("[v0] Voice recognition error:", event.error)
        alert(`음성 인식 오류: ${event.error}`)
        setIsVoiceRecognizing(false)
      }

      recognition.onend = () => {
        console.log("[v0] Voice recognition ended")
        setIsVoiceRecognizing(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (error) {
      console.error("[v0] Voice recognition error:", error)
      alert("음성 인식 시작 실패")
      setIsVoiceRecognizing(false)
    }
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsVoiceRecognizing(false)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      {isProcessingOCR && (
        <div className="space-y-2 bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border-2 border-purple-500">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
            🔍 텍스트 추출 중... {ocrProgress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-purple-600 transition-all" style={{ width: `${ocrProgress}%` }} />
          </div>
        </div>
      )}

      {isOCRCameraOpen && (
        <div className="space-y-2 bg-purple-50 p-4 rounded-lg border-2 border-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-600">📸 텍스트 촬영</p>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={captureAndProcessOCR}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                촬영 및 추출
              </Button>
              <Button variant="outline" size="sm" onClick={closeOCRCamera}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <video ref={ocrVideoRef} className="w-full h-64 bg-black rounded" playsInline autoPlay />
          <p className="text-xs text-purple-600">텍스트가 포함된 문서나 이미지를 촬영하세요</p>
        </div>
      )}

      {isRecordingVideo && (
        <div className="space-y-2 bg-red-50 p-4 rounded-lg border-2 border-red-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-red-600">🔴 동영상 녹화 중...</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={stopVideoRecording}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              녹화 중지 및 저장
            </Button>
          </div>
          <video ref={videoRef} className="w-full h-64 bg-black rounded" playsInline autoPlay muted />
        </div>
      )}

      {!isRecordingVideo && !isOCRCameraOpen && !isProcessingOCR && (
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,video/*,audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <input type="file" id="ocr-file-upload" accept="image/*" className="hidden" onChange={handleOCRFileUpload} />
          <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
            <ImageIcon className="h-4 w-4 mr-2" />
            파일 업로드
          </Button>
          <Button variant="outline" size="sm" onClick={takePhoto}>
            <Camera className="h-4 w-4 mr-2" />
            사진 촬영
          </Button>
          <Button variant="outline" size="sm" onClick={openOCRCamera}>
            <FileImage className="h-4 w-4 mr-2" />
            촬영→텍스트
          </Button>
          <Button variant="outline" size="sm" onClick={() => document.getElementById("ocr-file-upload")?.click()}>
            <FileImage className="h-4 w-4 mr-2" />
            이미지→텍스트
          </Button>
          <Button variant="outline" size="sm" onClick={startDrawing}>
            <PenTool className="h-4 w-4 mr-2" />
            손글씨
          </Button>
          <Button
            onClick={isVoiceRecognizing ? stopVoiceRecognition : startVoiceRecognition}
            variant="outline"
            size="sm"
          >
            {isVoiceRecognizing ? (
              <>
                <Mic className="mr-2 h-4 w-4 animate-pulse text-red-500" />
                인식중
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                음성→텍스트
              </>
            )}
          </Button>
          <Button onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording} variant="outline" size="sm">
            {isRecordingAudio ? (
              <>
                <Mic className="mr-2 h-4 w-4 animate-pulse text-red-500" />
                녹음중
              </>
            ) : (
              <>
                <FileAudio className="mr-2 h-4 w-4" />
                오디오 녹음
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={startVideoRecording}>
            <Video className="h-4 w-4 mr-2" />
            동영상 녹화
          </Button>
        </div>
      )}

      {isDrawing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">손글씨 작성</h3>
              <Button variant="ghost" size="icon" onClick={closeDrawing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <canvas
              ref={canvasRef}
              className="w-full border rounded bg-white cursor-crosshair touch-none"
              style={{ height: "60vh", maxHeight: "600px" }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasEnd}
              onMouseLeave={handleCanvasEnd}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasEnd}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearCanvas} className="flex-1 bg-transparent">
                지우기
              </Button>
              <Button onClick={saveDrawing} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </Card>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">첨부파일 ({attachments.length}개)</p>
          <div className="grid grid-cols-2 gap-2">
            {attachments.map((file, idx) => (
              <div key={idx} className="relative group border rounded overflow-hidden">
                {(file.type?.startsWith("image/") || file.type === "image" || file.type === "drawing") && (
                  <img
                    src={file.url || file.data}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      console.error("[v0] Failed to load image:", file.name)
                      e.currentTarget.src = "/image-error.png"
                    }}
                  />
                )}
                {(file.type?.startsWith("video/") || file.type === "video") && (
                  <video
                    src={file.url || file.data}
                    controls
                    className="w-full h-32 bg-black"
                    onError={(e) => {
                      console.error("[v0] Failed to load video:", file.name)
                    }}
                  >
                    <source src={file.url || file.data} type={file.type || "video/webm"} />
                    비디오를 재생할 수 없습니다
                  </video>
                )}
                {(file.type?.startsWith("audio/") || file.type === "audio") && (
                  <div className="flex items-center justify-center h-20 bg-gray-100">
                    <audio
                      src={file.url || file.data}
                      controls
                      className="w-full px-2"
                      onError={(e) => {
                        console.error("[v0] Failed to load audio:", file.name)
                      }}
                    >
                      <source src={file.url || file.data} type={file.type || "audio/webm"} />
                      오디오를 재생할 수 없습니다
                    </audio>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {onSave && (
        <Button
          onClick={() => onSave(attachments)}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "저장 중..." : "저장"}
        </Button>
      )}
    </Card>
  )
}
