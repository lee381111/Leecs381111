"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Mic, Video, ImageIcon, Trash2, Save, PenTool, X, MessageSquare, FileImage } from "lucide-react"
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
  onTextFromSpeech?: (text: string) => void
}

export function MediaTools({
  attachments = [],
  onAttachmentsChange,
  onSave,
  saving,
  onTextFromSpeech,
}: MediaToolsProps) {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)
  const recognitionRef = useRef<any>(null)
  const ocrVideoRef = useRef<HTMLVideoElement | null>(null)
  const [isOCRCameraOpen, setIsOCRCameraOpen] = useState(false)

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
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
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
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecordingAudio(true)
    } catch (error) {
      alert("오디오 녹음 권한이 필요합니다")
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecordingAudio(false)
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

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome, Edge, Safari를 사용해주세요.")
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = "ko-KR"
      recognition.continuous = false
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("[v0] Speech recognition started")
        setIsRecognizing(true)
        setRecognizedText("")
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " "
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          const currentText = recognizedText + finalTranscript
          setRecognizedText(currentText)
          console.log("[v0] Final transcript:", finalTranscript)
        } else if (interimTranscript) {
          setRecognizedText(recognizedText + interimTranscript)
          console.log("[v0] Interim transcript:", interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)
        if (event.error === "no-speech") {
          console.log("[v0] No speech detected, restarting...")
          if (isRecognizing) {
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.start()
              }
            }, 100)
          }
        } else if (event.error === "not-allowed") {
          alert("마이크 권한이 필요합니다.")
          setIsRecognizing(false)
        } else if (event.error === "aborted") {
          console.log("[v0] Recognition aborted")
        } else {
          setIsRecognizing(false)
        }
      }

      recognition.onend = () => {
        console.log("[v0] Speech recognition ended")
        if (isRecognizing && recognitionRef.current) {
          console.log("[v0] Auto-restarting recognition...")
          setTimeout(() => {
            if (recognitionRef.current && isRecognizing) {
              recognitionRef.current.start()
            }
          }, 100)
        }
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch (error) {
      console.error("[v0] Speech recognition error:", error)
      alert("음성 인식을 시작할 수 없습니다: " + (error as Error).message)
      setIsRecognizing(false)
    }
  }

  const stopSpeechRecognition = () => {
    setIsRecognizing(false)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    if (recognizedText.trim() && onTextFromSpeech) {
      console.log("[v0] Applying recognized text:", recognizedText)
      onTextFromSpeech(recognizedText.trim())
    }

    setRecognizedText("")
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

    // Stop camera
    const stream = video.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsOCRCameraOpen(false)

    // Process OCR
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

      // Dynamic import of Tesseract.js
      const Tesseract = await import("tesseract.js")

      setOcrProgress(30)
      console.log("[v0] Tesseract loaded")

      // Create worker with Korean and English language support
      const worker = await Tesseract.createWorker("kor+eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            const progress = Math.floor(30 + m.progress * 60)
            setOcrProgress(progress)
          }
        },
      })

      console.log("[v0] Worker created, processing image...")

      // Recognize text from image
      const {
        data: { text },
      } = await worker.recognize(imageData)

      console.log("[v0] OCR completed, text length:", text.length)

      await worker.terminate()

      setOcrProgress(100)

      if (text.trim()) {
        if (onTextFromSpeech) {
          onTextFromSpeech(text.trim())
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

      {isRecognizing && (
        <div className="space-y-2 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-2 border-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">🎤 음성 인식 중...</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={stopSpeechRecognition}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              인식 중지 및 적용
            </Button>
          </div>
          {recognizedText && (
            <div className="bg-white dark:bg-slate-800 p-3 rounded border">
              <p className="text-sm text-foreground">{recognizedText}</p>
            </div>
          )}
          <p className="text-xs text-blue-600 dark:text-blue-400">말씀하시면 자동으로 텍스트로 변환됩니다</p>
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

      {!isRecordingVideo && !isRecognizing && !isOCRCameraOpen && !isProcessingOCR && (
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
          {onTextFromSpeech && (
            <Button variant="outline" size="sm" onClick={startSpeechRecognition}>
              <MessageSquare className="h-4 w-4 mr-2" />
              음성→텍스트
            </Button>
          )}
          {isRecordingAudio ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopAudioRecording}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Mic className="h-4 w-4 mr-2" />
              녹음 중지
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startAudioRecording}>
              <Mic className="h-4 w-4 mr-2" />
              오디오 녹음
            </Button>
          )}
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
