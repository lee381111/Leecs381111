"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Eraser, Pen, Undo, Trash2, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

type HandwritingCanvasProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (imageBlob: Blob) => void
}

export function HandwritingCanvas({ isOpen, onClose, onSave }: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(3)
  const [isEraser, setIsEraser] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        saveToHistory()
      }
    }
  }, [isOpen])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory([...history, imageData])
    }
  }

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    return { x, y }
  }

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const coords = getCoordinates(e)
    if (!coords) return

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
    ctx.strokeStyle = isEraser ? "#ffffff" : color
    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const coords = getCoordinates(e)
    if (!coords) return

    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (ctx && canvas) {
        ctx.putImageData(newHistory[newHistory.length - 1], 0, 0)
      }
    }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      setHistory([])
      saveToHistory()
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob)
        onClose()
      }
    }, "image/png")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("handwritingInput")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <Button variant={!isEraser ? "default" : "outline"} size="sm" onClick={() => setIsEraser(false)}>
                <Pen className="h-4 w-4" />
              </Button>
              <Button variant={isEraser ? "default" : "outline"} size="sm" onClick={() => setIsEraser(true)}>
                <Eraser className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label>{t("color")}</Label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-16 cursor-pointer rounded border"
              />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Label>{t("thickness")}</Label>
              <Slider
                value={[lineWidth]}
                onValueChange={(value) => setLineWidth(value[0])}
                min={1}
                max={20}
                step={1}
                className="w-32"
              />
              <span className="text-sm">{lineWidth}px</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={history.length <= 1}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={700}
            height={400}
            className="w-full cursor-crosshair rounded-lg border-2 border-border bg-white"
            style={{ touchAction: "none" }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
