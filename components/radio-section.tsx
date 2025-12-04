"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Play, Pause, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import type { RadioStation } from "./personal-organizer-app"
import { useLanguage } from "@/lib/language-context"

type RadioSectionProps = {
  radioStations: RadioStation[]
  setRadioStations: (stations: RadioStation[]) => void
  userId?: string // Added userId prop for authentication
}

export function RadioSection({ radioStations, setRadioStations, userId }: RadioSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newStation, setNewStation] = useState({
    name: "",
    url: "",
    region: "",
  })
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  const handleAddStation = async () => {
    if (newStation.name && newStation.url) {
      const station: RadioStation = {
        id: Date.now().toString(),
        name: newStation.name,
        url: newStation.url,
        region: newStation.region || "기타",
        user_id: userId || null,
      }
      setRadioStations([...radioStations, station])
      setNewStation({ name: "", url: "", region: "" })
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setRadioStations(radioStations.filter((s) => s.id !== id))
    if (currentStation?.id === id) {
      handleStop()
    }
  }

  const handlePlay = (station: RadioStation) => {
    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      if (audioRef.current) {
        audioRef.current.src = station.url
        audioRef.current.load()
        audioRef.current.play().catch((error) => {
          console.error("[v0] Audio play error:", error)
          const messages = {
            ko: "라디오 재생에 실패했습니다. 스트리밍 URL이 유효하지 않거나 CORS 정책으로 인해 차단되었을 수 있습니다. 다른 URL을 시도해보세요.",
            en: "Failed to play radio. The streaming URL may be invalid or blocked by CORS policy. Please try a different URL.",
            zh: "无法播放广播。流媒体URL可能无效或被CORS策略阻止。请尝试其他URL。",
            ja: "ラジオの再生に失敗しました。ストリーミングURLが無効であるか、CORSポリシーによってブロックされている可能性があります。別のURLを試してください。",
          }
          alert(messages[language])
          setIsPlaying(false)
          setCurrentStation(null)
        })
      }
      setCurrentStation(station)
      setIsPlaying(true)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
    setIsPlaying(false)
    setCurrentStation(null)
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("radioTitle")}</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("addStation")}
        </Button>
      </div>

      {isAdding && (
        <div className="mb-6 space-y-4 rounded-lg border bg-muted/50 p-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-sm">
            <p className="font-medium mb-2">
              {language === "ko"
                ? "작동하는 스트리밍 URL 예시:"
                : language === "en"
                  ? "Working streaming URL examples:"
                  : language === "zh"
                    ? "可用的流媒体URL示例："
                    : "動作するストリーミングURLの例："}
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• SomaFM: https://ice1.somafm.com/groovesalad-128-mp3</li>
              <li>• Radio Paradise: https://stream.radioparadise.com/aac-320</li>
              <li>• KEXP: https://kexp-mp3-128.streamguys1.com/kexp128.mp3</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              {language === "ko"
                ? "⚠️ 일부 스트리밍 URL은 CORS 정책으로 인해 작동하지 않을 수 있습니다."
                : language === "en"
                  ? "⚠️ Some streaming URLs may not work due to CORS policy."
                  : language === "zh"
                    ? "⚠️ 由于CORS策略，某些流媒体URL可能无法使用。"
                    : "⚠️ CORS ポリシーにより、一部のストリーミング URL が機能しない場合があります。"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="station-name">{t("stationName")}</Label>
            <Input
              id="station-name"
              value={newStation.name}
              onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
              placeholder={t("stationName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="station-url">{t("streamUrl")}</Label>
            <Input
              id="station-url"
              value={newStation.url}
              onChange={(e) => setNewStation({ ...newStation, url: e.target.value })}
              placeholder="https://example.com/stream.mp3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="station-region">{t("region")}</Label>
            <Input
              id="station-region"
              value={newStation.region}
              onChange={(e) => setNewStation({ ...newStation, region: e.target.value })}
              placeholder={t("region")}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddStation}>{t("save")}</Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      {currentStation && (
        <div className="mb-6 rounded-lg border bg-primary/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{currentStation.name}</h3>
              <p className="text-sm text-muted-foreground">{currentStation.region}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handlePlay(currentStation)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4" />
            <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
            <span className="text-sm">{volume[0]}%</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-medium">
          {language === "ko"
            ? "방송국 목록"
            : language === "en"
              ? "Station List"
              : language === "zh"
                ? "电台列表"
                : "放送局一覧"}
        </h3>
        {radioStations.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {language === "ko"
              ? "등록된 방송국이 없습니다"
              : language === "en"
                ? "No radio stations"
                : language === "zh"
                  ? "没有电台"
                  : "放送局がありません"}
          </p>
        ) : (
          radioStations.map((station) => (
            <div
              key={station.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-4 ${
                currentStation?.id === station.id && isPlaying ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-medium">{station.name}</h4>
                <p className="text-sm text-muted-foreground">{station.region}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{station.url}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePlay(station)}>
                  {currentStation?.id === station.id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(station.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <audio ref={audioRef} crossOrigin="anonymous" />
    </div>
  )
}
