"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { TravelRecord, Language } from "@/lib/types"
import { getTranslation } from "@/lib/i18n"

interface TravelMapProps {
  travels: TravelRecord[]
  onMarkerClick?: (travel: TravelRecord) => void
  clickMode?: boolean
  onMapClick?: (lat: number, lon: number) => void
  language?: Language
}

export function TravelMap({ travels, onMarkerClick, clickMode = false, onMapClick, language = "ko" }: TravelMapProps) {
  const t = (key: string) => getTranslation(language, key)

  const [center, setCenter] = useState({ lat: 37.5665, lon: 126.978 })
  const [zoom, setZoom] = useState(7)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, centerLat: 0, centerLon: 0 })
  const hasDragged = useRef(false)
  const [tempMarker, setTempMarker] = useState<{ lat: number; lon: number } | null>(null)

  const latLonToPixel = (lat: number, lon: number, mapZoom: number, mapCenter: { lat: number; lon: number }) => {
    const scale = 256 * Math.pow(2, mapZoom)

    const centerX = ((mapCenter.lon + 180) / 360) * scale
    const centerLatRad = (mapCenter.lat * Math.PI) / 180
    const centerY = ((1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2) * scale

    const x = ((lon + 180) / 360) * scale
    const latRad = (lat * Math.PI) / 180
    const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale

    return {
      x: x - centerX,
      y: y - centerY,
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    isDragging.current = true
    hasDragged.current = false
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLon: center.lon,
    }
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing"
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return
    e.preventDefault()

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDragged.current = true
    }

    const scale = 256 * Math.pow(2, zoom)
    const dlat = (dy / scale) * 360
    const dlon = (-dx / scale) * 360

    setCenter({
      lat: dragStart.current.centerLat + dlat,
      lon: dragStart.current.centerLon + dlon,
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragging = hasDragged.current
    isDragging.current = false
    hasDragged.current = false

    if (containerRef.current) {
      containerRef.current.style.cursor = clickMode ? "crosshair" : "grab"
    }

    if (clickMode && !wasDragging && onMapClick && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      const scale = 256 * Math.pow(2, zoom)

      const offsetX = clickX - containerWidth / 2
      const offsetY = clickY - containerHeight / 2

      const dlon = (offsetX / scale) * 360
      const dlat = (-offsetY / scale) * 360

      const clickLon = center.lon + dlon
      const clickLat = center.lat + dlat

      console.log("[v0] 🔵 Setting blue temp marker at:", clickLat, clickLon)
      setTempMarker({ lat: clickLat, lon: clickLon })
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -1 : 1
    setZoom((prev) => Math.max(2, Math.min(18, prev + delta)))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      isDragging.current = true
      hasDragged.current = false
      dragStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        centerLat: center.lat,
        centerLon: center.lon,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.touches.length === 1 && isDragging.current) {
      const touch = e.touches[0]
      const dx = touch.clientX - dragStart.current.x
      const dy = touch.clientY - dragStart.current.y

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged.current = true
      }

      const scale = 256 * Math.pow(2, zoom)
      const dlat = (dy / scale) * 360
      const dlon = (-dx / scale) * 360

      setCenter({
        lat: dragStart.current.centerLat + dlat,
        lon: dragStart.current.centerLon + dlon,
      })
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    isDragging.current = false
  }

  const handleConfirmLocation = () => {
    if (tempMarker && onMapClick) {
      console.log("[v0] ✅ Location confirmed:", tempMarker.lat, tempMarker.lon)
      onMapClick(tempMarker.lat, tempMarker.lon)
      setTempMarker(null)
    }
  }

  const handleCancelLocation = () => {
    console.log("[v0] ❌ Location selection cancelled")
    setTempMarker(null)
  }

  const renderTiles = () => {
    if (!containerRef.current) return null

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight
    const tileSize = 256
    const numTiles = Math.pow(2, zoom)

    const scale = numTiles
    const centerTileX = ((center.lon + 180) / 360) * scale
    const centerLatRad = (center.lat * Math.PI) / 180
    const centerTileY = ((1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2) * scale

    const tilesX = Math.ceil(containerWidth / tileSize) + 2
    const tilesY = Math.ceil(containerHeight / tileSize) + 2

    const startX = Math.floor(centerTileX - tilesX / 2)
    const startY = Math.floor(centerTileY - tilesY / 2)

    const tiles = []
    for (let x = startX; x < startX + tilesX; x++) {
      for (let y = startY; y < startY + tilesY; y++) {
        const tileX = ((x % numTiles) + numTiles) % numTiles
        const tileY = Math.max(0, Math.min(numTiles - 1, y))

        const offsetX = (x - centerTileX) * tileSize + containerWidth / 2
        const offsetY = (y - centerTileY) * tileSize + containerHeight / 2

        const tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`

        tiles.push(
          <div
            key={`${x}-${y}`}
            className="absolute bg-gray-200"
            style={{
              left: `${offsetX}px`,
              top: `${offsetY}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
          >
            <img
              src={tileUrl || "/placeholder.svg"}
              alt=""
              className="w-full h-full"
              style={{ pointerEvents: "none" }}
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>,
        )
      }
    }
    return tiles
  }

  const renderMarkers = () => {
    if (!containerRef.current) return null

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    return travels.map((travel, idx) => {
      if (!travel.latitude || !travel.longitude) return null

      const lat = Number(travel.latitude)
      const lon = Number(travel.longitude)
      const { x, y } = latLonToPixel(lat, lon, zoom, center)

      const markerX = containerWidth / 2 + x
      const markerY = containerHeight / 2 + y

      return (
        <div
          key={travel.id || idx}
          className="absolute cursor-pointer z-10 pointer-events-auto"
          style={{
            left: `${markerX}px`,
            top: `${markerY}px`,
            transform: "translate(-50%, -100%)",
          }}
          onClick={(e) => {
            e.stopPropagation()
            onMarkerClick?.(travel)
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-xl animate-pulse" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-transparent border-t-red-500" />
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs font-medium rounded whitespace-nowrap pointer-events-none shadow-lg">
            📍 {travel.destination}
          </div>
        </div>
      )
    })
  }

  const renderTempMarker = () => {
    if (!tempMarker || !containerRef.current) return null

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    const { x, y } = latLonToPixel(tempMarker.lat, tempMarker.lon, zoom, center)
    const markerX = containerWidth / 2 + x
    const markerY = containerHeight / 2 + y

    return (
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${markerX}px`,
          top: `${markerY}px`,
          transform: "translate(-50%, -100%)",
        }}
      >
        <div className="relative">
          {/* Blue pulsing marker */}
          <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-2xl animate-ping absolute top-0 left-0" />
          <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-2xl relative" />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[18px] border-transparent border-t-blue-500" />

          {/* Label */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded whitespace-nowrap shadow-xl">
            🎯 선택 위치
          </div>
        </div>
      </div>
    )
  }

  const handleZoomIn = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setZoom((prev) => Math.min(18, prev + 1))
  }

  const handleZoomOut = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setZoom((prev) => Math.max(2, prev - 1))
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[600px] md:h-[600px] overflow-hidden rounded-lg border-4 ${clickMode ? "border-yellow-400" : "border-gray-300"} bg-gray-100 select-none`}
      style={{
        touchAction: "none",
        cursor: clickMode ? "crosshair" : "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={mapRef} className="absolute inset-0 bg-blue-50" style={{ pointerEvents: "none" }}>
        {renderTiles()}
      </div>

      {renderMarkers()}
      {renderTempMarker()}

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
        <Button
          onTouchEnd={handleZoomIn}
          onClick={handleZoomIn}
          size="sm"
          className="bg-white text-black hover:bg-gray-100 shadow-2xl font-bold text-2xl w-12 h-12 pointer-events-auto border-2 border-gray-400"
        >
          +
        </Button>
        <Button
          onTouchEnd={handleZoomOut}
          onClick={handleZoomOut}
          size="sm"
          className="bg-white text-black hover:bg-gray-100 shadow-2xl font-bold text-2xl w-12 h-12 pointer-events-auto border-2 border-gray-400"
        >
          −
        </Button>
      </div>

      <div
        className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded shadow-lg text-xs font-medium z-20 border border-gray-300"
        style={{ pointerEvents: "none" }}
      >
        🗺️ {t("map_zoom_label")}: {zoom} | 🖱️ {t("map_drag_instruction")} | ➕➖ {t("map_zoom_buttons_instruction")}
      </div>

      {clickMode && !tempMarker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-full shadow-lg font-semibold text-sm z-30 animate-bounce pointer-events-none">
          🎯 {t("map_click_to_select")}
        </div>
      )}

      {tempMarker && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <div className="bg-white rounded-lg shadow-2xl p-4 border-4 border-blue-500 w-80">
            <div className="text-center mb-3">
              <div className="text-3xl mb-2">📍</div>
              <div className="font-semibold text-base mb-2">{t("map_confirm_location")}</div>
              <div className="text-xs text-gray-600 space-y-0.5">
                <div>
                  {t("latitude")}: {tempMarker.lat.toFixed(6)}
                </div>
                <div>
                  {t("longitude")}: {tempMarker.lon.toFixed(6)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onPointerUp={(e) => {
                  e.stopPropagation()
                  handleCancelLocation()
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleCancelLocation()
                }}
                variant="outline"
                className="flex-1 text-sm py-5"
              >
                {t("cancel")}
              </Button>
              <Button
                onPointerUp={(e) => {
                  e.stopPropagation()
                  handleConfirmLocation()
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleConfirmLocation()
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-sm py-5"
              >
                ✅ {t("map_select")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
