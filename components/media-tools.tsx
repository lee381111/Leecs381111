"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Mic, Video, ImageIcon, Trash2, Save, PenTool, X, MessageSquare, FileImage } from "lucide-react"
import type { Attachment } from "@/lib/types"
import { getTranslation } from "@/lib/i18n"

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
  language?: string // Added language prop
}

export function MediaTools({
  attachments = [],
  onAttachmentsChange,
  onSave,
  saving,
  onTextFromSpeech,
  language = "ko", // Default to Korean
}: MediaToolsProps) {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [isCameraPreviewOpen, setIsCameraPreviewOpen] = useState(false)
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)
  const recognitionRef = useRef<any>(null)
  const ocrVideoRef = useRef<HTMLVideoElement | null>(null)
  const [isOCRCameraOpen, setIsOCRCameraOpen] = useState(false)

  const t = (key: string) => getTranslation(language, key)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] ===== FILE UPLOAD EVENT TRIGGERED =====")
    console.log("[v0] Event target:", e.target)
    console.log("[v0] Files object:", e.target.files)

    const files = Array.from(e.target.files || [])
    console.log("[v0] Files array:", files)
    console.log("[v0] Number of files:", files.length)

    if (files.length === 0) {
      console.log("[v0] No files selected")
      alert(language === "ko" ? "파일이 선택되지 않았습니다" : "No files selected")
      return
    }

    console.log("[v0] File upload started:", files.length, "files")
    console.log("[v0] Current attachments:", attachments.length)

    // Show immediate feedback to user
    alert(language === "ko" ? `${files.length}개의 파일을 처리 중입니다...` : `Processing ${files.length} file(s)...`)

    const filePromises = files.map((file) => {
      return new Promise<Attachment>((resolve, reject) => {
        console.log("[v0] Processing file:", file.name, "type:", file.type, "size:", file.size)
        const reader = new FileReader()

        reader.onload = () => {
          const dataUrl = reader.result as string
          console.log("[v0] File loaded:", file.name, "data length:", dataUrl.length)

          const newAttachment: Attachment = {
            type: file.type || "image",
            name: file.name,
            data: dataUrl,
            url: dataUrl,
          }
          resolve(newAttachment)
        }

        reader.onerror = (error) => {
          console.error("[v0] Error reading file:", file.name, error)
          reject(error)
        }

        reader.readAsDataURL(file)
      })
    })

    Promise.all(filePromises)
      .then((newAttachments) => {
        console.log("[v0] All", newAttachments.length, "files processed successfully")
        const updated = [...attachments, ...newAttachments]
        console.log("[v0] Calling onAttachmentsChange with", updated.length, "attachments")
        console.log(
          "[v0] Attachments:",
          updated.map((a) => ({ name: a.name, type: a.type })),
        )
        onAttachmentsChange(updated)

        alert(
          language === "ko"
            ? `✓ ${newAttachments.length}개의 파일이 첨부되었습니다! 총 ${updated.length}개`
            : `✓ ${newAttachments.length} file(s) attached! Total: ${updated.length}`,
        )
      })
      .catch((error) => {
        console.error("[v0] Error loading files:", error)
        alert(language === "ko" ? "⚠ 파일 로드 중 오류 발생" : "⚠ Error loading files")
      })

    // Reset input value to allow selecting the same file again
    e.target.value = ""
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
      alert(t("audio_permission_required"))
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
      alert(t("video_permission_required") + ": " + (error as Error).message)
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

  const openCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16 / 9 },
        },
      })
      cameraStreamRef.current = stream
      setIsCameraPreviewOpen(true)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream
        await cameraVideoRef.current.play()
      }
    } catch (error) {
      console.error("[v0] Camera error:", error)
      alert(t("camera_permission_required") + ": " + (error as Error).message)
    }
  }

  const capturePhotoFromPreview = () => {
    if (!cameraVideoRef.current) return

    const video = cameraVideoRef.current
    const canvas = document.createElement("canvas")

    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    if (videoHeight > videoWidth) {
      canvas.width = videoHeight
      canvas.height = videoWidth
    } else {
      canvas.width = videoWidth
      canvas.height = videoHeight
    }

    const ctx = canvas.getContext("2d")

    if (ctx) {
      if (videoHeight > videoWidth) {
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(Math.PI / 2)
        ctx.drawImage(video, -videoWidth / 2, -videoHeight / 2, videoWidth, videoHeight)
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsCameraPreviewOpen(false)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    onAttachmentsChange([
      ...attachments,
      {
        type: "image",
        name: `photo_${Date.now()}.jpg`,
        data: dataUrl,
      },
    ])
  }

  const closeCameraPreview = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsCameraPreviewOpen(false)
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

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    onAttachmentsChange(newAttachments)
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
      alert(t("speech_recognition_not_supported"))
      return
    }

    try {
      const recognition = new SpeechRecognition()
      const languageMap: Record<string, string> = {
        ko: "ko-KR",
        en: "en-US",
        zh: "zh-CN",
        ja: "ja-JP",
      }
      recognition.lang = languageMap[language] || "en-US"
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
          alert(t("mic_permission_required"))
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
      alert(t("speech_recognition_failed") + ": " + (error as Error).message)
      setIsRecognizing(false)
    }
  }

  const stopSpeechRecognition = () => {
    console.log("[v0] Stopping speech recognition, text length:", recognizedText.length)
    setIsRecognizing(false)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    if (recognizedText.trim() && onTextFromSpeech) {
      const trimmedText = recognizedText.trim()
      console.log("[v0] Sending recognized text to note:", trimmedText.length, "characters")
      onTextFromSpeech(trimmedText)

      alert(
        language === "ko"
          ? `✓ 음성이 노트에 추가되었습니다!\n(${trimmedText.length}자)\n\n아래 "저장" 버튼을 눌러 노트를 저장하세요.`
          : `✓ Voice text added to note!\n(${trimmedText.length} chars)\n\nClick "Save" button below to save the note.`,
      )
    } else if (!recognizedText.trim()) {
      console.log("[v0] No text recognized")
      alert(language === "ko" ? "⚠ 인식된 텍스트가 없습니다" : "⚠ No text recognized")
    }

    setRecognizedText("")
  }

  const openOCRCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
        },
      })
      setIsOCRCameraOpen(true)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (ocrVideoRef.current) {
        ocrVideoRef.current.srcObject = stream
        await ocrVideoRef.current.play()
      }
    } catch (error) {
      console.error("[v0] OCR camera error:", error)
      alert(t("camera_permission_required"))
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

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114

        const contrast = 1.2
        const adjusted = (gray - 128) * contrast + 128

        data[i] = adjusted // red
        data[i + 1] = adjusted // green
        data[i + 2] = adjusted // blue
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const stream = video.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsOCRCameraOpen(false)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.98)
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
      } = await worker.recognize(imageData, {
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      })

      console.log("[v0] OCR completed, text length:", text.length)

      await worker.terminate()

      setOcrProgress(100)

      if (text.trim()) {
        if (onTextFromSpeech) {
          onTextFromSpeech(text.trim())
        }
        alert(t("ocr_completed") + ":\n" + text.substring(0, 200) + (text.length > 200 ? "..." : ""))
      } else {
        alert(t("ocr_no_text_found"))
      }
    } catch (error) {
      console.error("[v0] OCR error:", error)
      alert(t("ocr_error_occurred"))
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
            🔍 {t("ocr_processing")}... {ocrProgress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-purple-600 transition-all" style={{ width: `${ocrProgress}%` }} />
          </div>
        </div>
      )}

      {isCameraPreviewOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <video
            ref={cameraVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-4xl object-cover"
            style={{ aspectRatio: "16/9" }}
          />
          <div className="flex gap-4 mt-6 mb-8">
            <Button
              onClick={capturePhotoFromPreview}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              {t("shoot")}
            </Button>
            <Button
              onClick={closeCameraPreview}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      {isOCRCameraOpen && (
        <div className="space-y-2 bg-purple-50 p-4 rounded-lg border-2 border-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-600">{t("ocr_camera")}</p>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={captureAndProcessOCR}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                {t("ocr_capture_and_process")}
              </Button>
              <Button variant="outline" size="sm" onClick={closeOCRCamera}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <video ref={ocrVideoRef} className="w-full h-64 bg-black rounded" playsInline autoPlay />
          <p className="text-xs text-purple-600">{t("ocr_take_photo")}</p>
        </div>
      )}

      {isRecognizing && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("speech_recognition")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeechRecognition}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-transparent"
            >
              {t("stop_recognition")}
            </Button>
          </div>
          {recognizedText && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{recognizedText}</p>}
        </Card>
      )}

      {isRecordingVideo && (
        <div className="space-y-2 bg-red-50 p-4 rounded-lg border-2 border-red-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-red-600">{t("video_recording")}</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={stopVideoRecording}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              {t("stop_recording")}
            </Button>
          </div>
          <video ref={videoRef} className="w-full h-64 bg-black rounded" playsInline autoPlay muted />
        </div>
      )}

      {!isRecordingVideo && !isRecognizing && !isOCRCameraOpen && !isProcessingOCR && !isCameraPreviewOpen && (
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("[v0] File upload button clicked")
              const input = document.getElementById("file-upload") as HTMLInputElement
              console.log("[v0] Input element:", input)
              if (input) {
                console.log("[v0] Clicking input element")
                input.click()
              } else {
                console.log("[v0] ERROR: Input element not found!")
                alert("ERROR: File input not found")
              }
            }}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {t("file_upload")}
          </Button>
          <Button variant="outline" size="sm" onClick={openCameraPreview}>
            <Camera className="h-4 w-4 mr-2" />
            {t("take_photo")}
          </Button>
          <Button variant="outline" size="sm" onClick={openOCRCamera}>
            <FileImage className="h-4 w-4 mr-2" />
            {t("ocr_camera")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => document.getElementById("ocr-file-upload")?.click()}>
            <FileImage className="h-4 w-4 mr-2" />
            {t("ocr_upload")}
          </Button>
          <Button variant="outline" size="sm" onClick={startDrawing}>
            <PenTool className="h-4 w-4 mr-2" />
            {t("handwriting")}
          </Button>
          {onTextFromSpeech && (
            <Button variant="outline" size="sm" onClick={startSpeechRecognition}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {t("speech_to_text")}
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
              {t("stop_recording")}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startAudioRecording}>
              <Mic className="h-4 w-4 mr-2" />
              {t("audio_recording")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={startVideoRecording}>
            <Video className="h-4 w-4 mr-2" />
            {t("video_recording")}
          </Button>
        </div>
      )}

      {isDrawing && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl p-4 space-y-4 bg-background">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("handwriting")}</h3>
              <Button variant="ghost" size="icon" onClick={closeDrawing} className="bg-white hover:bg-gray-200">
                <X className="h-4 w-4 text-black" />
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
              <Button
                variant="outline"
                onClick={closeDrawing}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600 border-gray-500"
              >
                {t("cancel")}
              </Button>
              <Button
                variant="outline"
                onClick={clearCanvas}
                className="flex-1 bg-white text-black hover:bg-gray-100 border-white"
              >
                {t("clear")}
              </Button>
              <Button onClick={saveDrawing} className="flex-1 bg-blue-500 text-white hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                {t("save")}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t("attachments")} ({attachments.length}개)
          </p>
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
                    {t("video_cannot_play")}
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
                      {t("audio_cannot_play")}
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
          {saving ? t("saving") : t("save")}
        </Button>
      )}
    </Card>
  )
}
