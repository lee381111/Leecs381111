"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Play, Pause, Volume2, Plus, Trash2 } from "lucide-react"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import { loadRadioStations, saveRadioStations } from "@/lib/storage"

const defaultRadioStations = [
  { name: "NPR News", url: "https://npr-ice.streamguys1.com/live.mp3" },
  { name: "KCRW (Santa Monica)", url: "https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air" },
  { name: "WNYC (New York)", url: "https://fm939.wnyc.org/wnycfm" },
  { name: "Classical KING FM", url: "https://classicalking.streamguys1.com/king-aac-64k" },
  { name: "Jazz24", url: "https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1" },
  { name: "KEXP (Seattle)", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3" },
  { name: "WBGO Jazz (Newark)", url: "https://wbgo.streamguys1.com/wbgo128" },
  { name: "KPCC (Los Angeles)", url: "https://streaming.kpcc.org/kpcc-2" },
  { name: "WXPN (Philadelphia)", url: "https://wxpn.xpn.org/xpnhi" },
  { name: "KUTX (Austin)", url: "https://kut.streamguys1.com/kutx-hd1" },
  { name: "The Current (Minneapolis)", url: "https://current.stream.publicradio.org/current.mp3" },
  { name: "KCMP Radio K", url: "https://radiok.stream.publicradio.org/radiok.mp3" },
  { name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-128-mp3" },
  { name: "SomaFM Drone Zone", url: "https://ice1.somafm.com/dronezone-128-mp3" },
  { name: "Radio Paradise", url: "https://stream.radioparadise.com/aac-320" },
]

export function RadioSection({ onBack, language, user }: { onBack: () => void; language: string; user: any }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [radioStations, setRadioStations] = useState<{ name: string; url: string }[]>([])
  const [currentStation, setCurrentStation] = useState<{ name: string; url: string } | null>(null)
  const [volume, setVolume] = useState(70)
  const [isAdding, setIsAdding] = useState(false)
  const [newStationName, setNewStationName] = useState("")
  const [newStationUrl, setNewStationUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (user?.id) {
      console.log("[v0] Loading radio stations for user:", user.id)
      setIsLoading(true)
      loadRadioStations(user.id)
        .then((stations) => {
          console.log("[v0] Loaded radio stations from DB:", stations)
          if (stations && stations.length > 0) {
            console.log("[v0] Setting loaded stations:", stations.length)
            setRadioStations(stations)
            setCurrentStation(stations[0])
          } else {
            console.log("[v0] No saved stations, using defaults")
            setRadioStations(defaultRadioStations)
            setCurrentStation(defaultRadioStations[0])
            saveRadioStations(user.id, defaultRadioStations).catch(console.error)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("[v0] Error loading radio stations:", error)
          setRadioStations(defaultRadioStations)
          setCurrentStation(defaultRadioStations[0])
          setIsLoading(false)
        })
    }
  }, [user?.id])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume / 100
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current || !currentStation) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.src = currentStation.url
      audioRef.current.play().catch((error) => {
        console.error("[v0] Radio play error:", error)
        const lang = language as Language
        const errorMsg =
          lang === "ko"
            ? "라디오 재생에 실패했습니다. 다른 방송국을 선택해주세요."
            : lang === "en"
              ? "Radio playback failed. Please select another station."
              : lang === "zh"
                ? "电台播放失败。请选择其他电台。"
                : "ラジオ再生に失敗しました。他の放送局を選択してください。"
        alert(errorMsg)
      })
      setIsPlaying(true)
    }
  }

  const selectStation = (station: (typeof radioStations)[0]) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setCurrentStation(station)
    setIsPlaying(false)
  }

  const addStation = async () => {
    if (!newStationName.trim() || !newStationUrl.trim()) {
      const lang = language as Language
      const msg =
        lang === "ko"
          ? "방송국 이름과 URL을 모두 입력해주세요."
          : lang === "en"
            ? "Please enter both station name and URL."
            : lang === "zh"
              ? "请输入电台名称和URL。"
              : "放送局名とURLを入力してください。"
      alert(msg)
      return
    }

    const newStation = { name: newStationName.trim(), url: newStationUrl.trim() }
    const updatedStations = [...radioStations, newStation]
    setRadioStations(updatedStations)

    if (user?.id) {
      try {
        await saveRadioStations(user.id, updatedStations)
        console.log("[v0] Radio station added and saved:", newStation.name)
      } catch (error) {
        console.error("[v0] Failed to save radio station:", error)
        setRadioStations(radioStations)
        alert("Failed to save station. Please try again.")
        return
      }
    }

    setNewStationName("")
    setNewStationUrl("")
    setIsAdding(false)
    const lang = language as Language
    const msg =
      lang === "ko"
        ? `"${newStation.name}" 방송국이 추가되었습니다.`
        : lang === "en"
          ? `"${newStation.name}" station has been added.`
          : lang === "zh"
            ? `"${newStation.name}" 电台已添加。`
            : `"${newStation.name}" 放送局が追加されました。`
    alert(msg)
  }

  const deleteStation = async (url: string) => {
    if (radioStations.length <= 1) {
      const lang = language as Language
      const msg =
        lang === "ko"
          ? "마지막 방송국은 삭제할 수 없습니다."
          : lang === "en"
            ? "Cannot delete the last station."
            : lang === "zh"
              ? "无法删除最后一个电台。"
              : "最後の放送局は削除できません。"
      alert(msg)
      return
    }

    if (currentStation?.url === url) {
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }

    const updatedStations = radioStations.filter((station) => station.url !== url)
    if (currentStation?.url === url) {
      setCurrentStation(updatedStations[0])
    }
    setRadioStations(updatedStations)

    if (user?.id) {
      try {
        await saveRadioStations(user.id, updatedStations)
        console.log("[v0] Radio station deleted from database, remaining:", updatedStations.length)
      } catch (error) {
        console.error("[v0] Failed to delete radio station:", error)
        setRadioStations(radioStations)
        if (currentStation?.url === url) {
          setCurrentStation(currentStation)
        }
        alert("Failed to delete station. Please try again.")
      }
    }
  }

  const lang = language as Language
  const playingText =
    lang === "ko" ? "🔴 방송 중" : lang === "en" ? "🔴 On Air" : lang === "zh" ? "🔴 播放中" : "🔴 放送中"
  const pausedText = lang === "ko" ? "⏸️ 일시정지" : lang === "en" ? "⏸️ Paused" : lang === "zh" ? "⏸️ 暂停" : "⏸️ 一時停止"
  const stationSelectText =
    lang === "ko" ? "방송국 선택" : lang === "en" ? "Select Station" : lang === "zh" ? "选择电台" : "放送局選択"
  const addText = lang === "ko" ? "추가" : lang === "en" ? "Add" : lang === "zh" ? "添加" : "追加"
  const stationNamePlaceholder =
    lang === "ko"
      ? "방송국 이름 (예: Jazz FM)"
      : lang === "en"
        ? "Station name (e.g. Jazz FM)"
        : lang === "zh"
          ? "电台名称 (例: Jazz FM)"
          : "放送局名 (例: Jazz FM)"
  const urlPlaceholder =
    lang === "ko"
      ? "스트리밍 URL (예: https://...)"
      : lang === "en"
        ? "Streaming URL (e.g. https://...)"
        : lang === "zh"
          ? "流媒体URL (例: https://...)"
          : "ストリーミングURL (例: https://...)"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {getTranslation(lang, "back_to_forest")}
        </Button>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading radio stations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 space-y-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> {getTranslation(lang, "back_to_forest")}
      </Button>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 className="text-2xl font-bold mb-6 text-center">📻 {getTranslation(lang, "radio")}</h2>

        {currentStation && (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <div className="text-xl font-semibold text-purple-700 mb-2">{currentStation.name}</div>
              <div className="text-sm text-muted-foreground">{isPlaying ? playingText : pausedText}</div>
            </div>

            <Button
              onClick={togglePlay}
              size="lg"
              className={`w-24 h-24 rounded-full text-white ${
                isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12 ml-1" />}
            </Button>

            <div className="w-full space-y-2">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-purple-600" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-12 text-center">{volume}%</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{stationSelectText}</h3>
          <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="h-4 w-4 mr-1" />
            {addText}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-4 space-y-3 border-purple-200">
            <Input
              placeholder={stationNamePlaceholder}
              value={newStationName}
              onChange={(e) => setNewStationName(e.target.value)}
            />
            <Input
              placeholder={urlPlaceholder}
              value={newStationUrl}
              onChange={(e) => setNewStationUrl(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={addStation} className="flex-1">
                {getTranslation(lang, "save")}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                {getTranslation(lang, "cancel")}
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-2">
          {radioStations.map((station) => (
            <div key={station.url} className="flex items-center gap-2">
              <Button
                variant={currentStation?.url === station.url ? "default" : "outline"}
                onClick={() => selectStation(station)}
                className="justify-start flex-1"
              >
                <span className="mr-2">{currentStation?.url === station.url && isPlaying ? "🔴" : "📻"}</span>
                {station.name}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteStation(station.url)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
