"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MapPin, RefreshCw, Wind, Droplet } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"

export function WeatherSection({ onBack, language }: { onBack: () => void; language: Language }) {
  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState<any>(null)
  const [airQuality, setAirQuality] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setLoading(true)
    console.log("[v0] Weather: Requesting current location")

    if (!navigator.geolocation) {
      console.log("[v0] Weather: Geolocation not supported, using default Seoul")
      setLocation({ lat: 37.5665, lon: 126.978 })
      fetchAllWeatherData(37.5665, 126.978)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log("[v0] Weather: Got location:", latitude, longitude)
        setLocation({ lat: latitude, lon: longitude })
        fetchAllWeatherData(latitude, longitude)
      },
      (error) => {
        console.log("[v0] Weather: Geolocation error:", error.code, error.message)
        if (error.code === 1) {
          console.log("[v0] Weather: User denied location permission")
        } else if (error.code === 2) {
          console.log("[v0] Weather: Position unavailable")
        } else if (error.code === 3) {
          console.log("[v0] Weather: Timeout - using default Seoul")
        }
        setLocation({ lat: 37.5665, lon: 126.978 })
        fetchAllWeatherData(37.5665, 126.978)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const fetchAllWeatherData = async (lat: number, lon: number) => {
    await Promise.all([fetchWeather(lat, lon), fetchAirQuality(lat, lon), fetchForecast(lat, lon)])
  }

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = "895284fb2d2c50a520ea537456963d9c"
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`,
      )

      if (!response.ok) {
        throw new Error("날씨 정보를 가져올 수 없습니다")
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setWeather({
        name: "Seoul",
        weather: [{ description: "No data", icon: "01d" }],
        main: { temp: 0, feels_like: 0, humidity: 0, temp_max: 0, temp_min: 0 },
        wind: { speed: 0 },
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAirQuality = async (lat: number, lon: number) => {
    try {
      const apiKey = "895284fb2d2c50a520ea537456963d9c"
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      )

      if (!response.ok) {
        throw new Error("대기질 정보를 가져올 수 없습니다")
      }

      const data = await response.json()
      setAirQuality(data.list[0])
    } catch (err) {
      console.error("대기질 정보 오류:", err)
      setAirQuality(null)
    }
  }

  const fetchForecast = async (lat: number, lon: number) => {
    try {
      const apiKey = "895284fb2d2c50a520ea537456963d9c"
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`,
      )

      if (!response.ok) {
        throw new Error("날씨 예보를 가져올 수 없습니다")
      }

      const data = await response.json()

      const weekdayNames: { [key: string]: string[] } = {
        ko: ["일", "월", "화", "수", "목", "금", "토"],
        en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        zh: ["日", "一", "二", "三", "四", "五", "六"],
        ja: ["日", "月", "火", "水", "木", "金", "土"],
      }
      const currentLangWeekdays = weekdayNames[language] || weekdayNames.ko

      const dailyData: { [key: string]: any[] } = {}

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000)
        const dateString = date.toISOString().split("T")[0]

        if (!dailyData[dateString]) {
          dailyData[dateString] = []
        }
        dailyData[dateString].push(item)
      })

      const dailyForecasts: Array<{
        date: string
        dayName: string
        dt: number
        main: { temp_max: number; temp_min: number; humidity: number }
        weather: Array<{ description: string; icon: string }>
      }> = []

      Object.keys(dailyData)
        .slice(0, 7)
        .forEach((dateString) => {
          const dayItems = dailyData[dateString]
          const date = new Date(dateString)

          const temps = dayItems.map((item) => item.main.temp)
          const temp_max = Math.max(...temps)
          const temp_min = Math.min(...temps)

          const noonItem =
            dayItems.find((item) => {
              const hour = new Date(item.dt * 1000).getHours()
              return hour >= 12 && hour <= 15
            }) || dayItems[0]

          dailyForecasts.push({
            dt: noonItem.dt,
            date: date.toLocaleDateString("ko-KR"),
            dayName: currentLangWeekdays[date.getDay()],
            main: {
              temp_max,
              temp_min,
              humidity: noonItem.main.humidity,
            },
            weather: noonItem.weather,
          })
        })

      setForecast(dailyForecasts)
    } catch (err) {
      console.error("날씨 예보 오류:", err)
      setForecast([])
    }
  }

  const getAirQualityLevel = (pm25: number, pm10: number) => {
    const lang = language as Language
    let level = getTranslation(lang, "air_good")
    let color = "text-green-600"

    if (pm25 > 75 || pm10 > 150) {
      level = getTranslation(lang, "air_very_bad")
      color = "text-red-600"
    } else if (pm25 > 35 || pm10 > 80) {
      level = getTranslation(lang, "air_bad")
      color = "text-orange-600"
    } else if (pm25 > 15 || pm10 > 30) {
      level = getTranslation(lang, "air_moderate")
      color = "text-yellow-600"
    }

    return { level, color }
  }

  const getWeatherEmoji = (icon: string) => {
    if (icon.includes("01")) return "☀️"
    if (icon.includes("02")) return "⛅"
    if (icon.includes("03") || icon.includes("04")) return "☁️"
    if (icon.includes("09") || icon.includes("10")) return "🌧️"
    if (icon.includes("11")) return "⛈️"
    if (icon.includes("13")) return "❄️"
    if (icon.includes("50")) return "🌫️"
    return "🌤️"
  }

  const translateWeatherCondition = (description: string): string => {
    const weatherTranslations: { [key: string]: { [key: string]: string } } = {
      ko: {
        "clear sky": "맑음",
        "few clouds": "구름 조금",
        "scattered clouds": "구름 많음",
        "broken clouds": "흐림",
        "overcast clouds": "매우 흐림",
        "shower rain": "소나기",
        rain: "비",
        "light rain": "약한 비",
        "moderate rain": "보통 비",
        "heavy intensity rain": "강한 비",
        "very heavy rain": "매우 강한 비",
        "extreme rain": "극심한 비",
        "freezing rain": "우빙",
        "light intensity shower rain": "약한 소나기",
        "heavy intensity shower rain": "강한 소나기",
        "ragged shower rain": "불규칙한 소나기",
        thunderstorm: "천둥번개",
        "thunderstorm with light rain": "약한 비를 동반한 천둥번개",
        "thunderstorm with rain": "비를 동반한 천둥번개",
        "thunderstorm with heavy rain": "강한 비를 동반한 천둥번개",
        "light thunderstorm": "약한 천둥번개",
        "heavy thunderstorm": "강한 천둥번개",
        "ragged thunderstorm": "불규칙한 천둥번개",
        snow: "눈",
        "light snow": "약한 눈",
        "heavy snow": "강한 눈",
        sleet: "진눈깨비",
        "light shower sleet": "약한 진눈깨비",
        "shower sleet": "진눈깨비",
        "light rain and snow": "약한 비와 눈",
        "rain and snow": "비와 눈",
        "light shower snow": "약한 눈보라",
        "shower snow": "눈보라",
        "heavy shower snow": "강한 눈보라",
        mist: "박무",
        fog: "안개",
        haze: "실안개",
        smoke: "연기",
        sand: "모래",
        dust: "먼지",
        "volcanic ash": "화산재",
        squalls: "돌풍",
        tornado: "토네이도",
      },
      en: {
        "clear sky": "Clear",
        "few clouds": "Partly Cloudy",
        "scattered clouds": "Cloudy",
        "broken clouds": "Overcast",
        "overcast clouds": "Very Cloudy",
        "shower rain": "Showers",
        rain: "Rain",
        "light rain": "Light Rain",
        "moderate rain": "Rain",
        "heavy intensity rain": "Heavy Rain",
        "very heavy rain": "Very Heavy Rain",
        "extreme rain": "Extreme Rain",
        "freezing rain": "Freezing Rain",
        "light intensity shower rain": "Light Showers",
        "heavy intensity shower rain": "Heavy Showers",
        "ragged shower rain": "Ragged Showers",
        thunderstorm: "Thunderstorm",
        "thunderstorm with light rain": "Thunderstorm with Light Rain",
        "thunderstorm with rain": "Thunderstorm with Rain",
        "thunderstorm with heavy rain": "Thunderstorm with Heavy Rain",
        "light thunderstorm": "Light Thunderstorm",
        "heavy thunderstorm": "Heavy Thunderstorm",
        "ragged thunderstorm": "Ragged Thunderstorm",
        snow: "Snow",
        "light snow": "Light Snow",
        "heavy snow": "Heavy Snow",
        sleet: "Sleet",
        "light shower sleet": "Light Sleet",
        "shower sleet": "Sleet Showers",
        "light rain and snow": "Light Rain and Snow",
        "rain and snow": "Rain and Snow",
        "light shower snow": "Light Snow Showers",
        "shower snow": "Snow Showers",
        "heavy shower snow": "Heavy Snow Showers",
        mist: "Mist",
        fog: "Fog",
        haze: "Haze",
        smoke: "Smoke",
        sand: "Sand",
        dust: "Dust",
        "volcanic ash": "Volcanic Ash",
        squalls: "Squalls",
        tornado: "Tornado",
      },
      zh: {
        "clear sky": "晴朗",
        "few clouds": "少云",
        "scattered clouds": "多云",
        "broken clouds": "阴天",
        "overcast clouds": "密云",
        "shower rain": "阵雨",
        rain: "雨",
        "light rain": "小雨",
        "moderate rain": "中雨",
        "heavy intensity rain": "大雨",
        "very heavy rain": "暴雨",
        "extreme rain": "特大暴雨",
        "freezing rain": "冻雨",
        "light intensity shower rain": "小阵雨",
        "heavy intensity shower rain": "大阵雨",
        "ragged shower rain": "不规则阵雨",
        thunderstorm: "雷暴",
        "thunderstorm with light rain": "雷阵雨",
        "thunderstorm with rain": "雷雨",
        "thunderstorm with heavy rain": "强雷雨",
        "light thunderstorm": "弱雷暴",
        "heavy thunderstorm": "强雷暴",
        "ragged thunderstorm": "不规则雷暴",
        snow: "雪",
        "light snow": "小雪",
        "heavy snow": "大雪",
        sleet: "雨夹雪",
        "light shower sleet": "小雨夹雪",
        "shower sleet": "阵雨夹雪",
        "light rain and snow": "小雨雪",
        "rain and snow": "雨雪",
        "light shower snow": "小阵雪",
        "shower snow": "阵雪",
        "heavy shower snow": "大阵雪",
        mist: "薄雾",
        fog: "雾",
        haze: "霾",
        smoke: "烟",
        sand: "沙",
        dust: "尘",
        "volcanic ash": "火山灰",
        squalls: "飑",
        tornado: "龙卷风",
      },
      ja: {
        "clear sky": "晴れ",
        "few clouds": "晴れ時々曇り",
        "scattered clouds": "曇り",
        "broken clouds": "曇り",
        "overcast clouds": "曇り",
        "shower rain": "にわか雨",
        rain: "雨",
        "light rain": "小雨",
        "moderate rain": "雨",
        "heavy intensity rain": "大雨",
        "very heavy rain": "豪雨",
        "extreme rain": "極端な雨",
        "freezing rain": "凍る雨",
        "light intensity shower rain": "弱いにわか雨",
        "heavy intensity shower rain": "強いにわか雨",
        "ragged shower rain": "不規則なにわか雨",
        thunderstorm: "雷雨",
        "thunderstorm with light rain": "弱い雨を伴う雷雨",
        "thunderstorm with rain": "雨を伴う雷雨",
        "thunderstorm with heavy rain": "強い雨を伴う雷雨",
        "light thunderstorm": "弱い雷雨",
        "heavy thunderstorm": "強い雷雨",
        "ragged thunderstorm": "不規則な雷雨",
        snow: "雪",
        "light snow": "小雪",
        "heavy snow": "大雪",
        sleet: "みぞれ",
        "light shower sleet": "小みぞれ",
        "shower sleet": "にわかみぞれ",
        "light rain and snow": "小雨雪",
        "rain and snow": "雨雪",
        "light shower snow": "小雪の阵",
        "shower snow": "雪の阵",
        "heavy shower snow": "強い雪の阵",
        mist: "霧",
        fog: "霧",
        haze: "もや",
        smoke: "煙",
        sand: "砂",
        dust: "塵",
        "volcanic ash": "火山灰",
        squalls: "スコール",
        tornado: "竜巻",
      },
    }

    const translations = weatherTranslations[language] || weatherTranslations.ko
    const lowerDesc = description.toLowerCase()
    return translations[lowerDesc] || description
  }

  const translateCityName = (cityName: string): string => {
    const cleanName = cityName.replace(/\s*$$[^)]*$$/, "").trim()

    const nameWithoutSuffix = cleanName
      .replace(/-si$/i, "")
      .replace(/-gun$/i, "")
      .replace(/-gu$/i, "")
      .replace(/\sCounty$/i, "")
      .replace(/\sCity$/i, "")
      .trim()

    const cityTranslations: { [key: string]: { [key: string]: string } } = {
      ko: {
        Seoul: "서울",
        Busan: "부산",
        Incheon: "인천",
        Daegu: "대구",
        Daejeon: "대전",
        Gwangju: "광주",
        Ulsan: "울산",
        Suwon: "수원",
        Changwon: "창원",
        Goyang: "고양",
        Seongnam: "성남",
        Yongin: "용인",
        Bucheon: "부천",
        Ansan: "안산",
        Cheongju: "청주",
        Jeonju: "전주",
        Anyang: "안양",
        Pohang: "포항",
        Gimpo: "김포",
        Gimhae: "김해",
        Jeju: "제주",
        Pyeongtaek: "평택",
        Siheung: "시흥",
        Paju: "파주",
        Uijeongbu: "의정부",
        Hwaseong: "화성",
      },
      zh: {
        Seoul: "首尔",
        Busan: "釜山",
        Incheon: "仁川",
        Daegu: "大邱",
        Daejeon: "大田",
        Gwangju: "光州",
        Ulsan: "蔚山",
        Gimpo: "金浦",
        Jeju: "济州",
      },
      ja: {
        Seoul: "ソウル",
        Busan: "釜山",
        Incheon: "仁川",
        Daegu: "大邱",
        Daejeon: "大田",
        Gwangju: "光州",
        Ulsan: "蔚山",
        Gimpo: "金浦",
        Jeju: "済州",
      },
    }

    const translations = cityTranslations[language]
    return translations?.[nameWithoutSuffix] || cleanName
  }

  const t = (key: string) => getTranslation(language as Language, key)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back_to_forest")}
        </Button>
        <Button
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
          size="sm"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t("refresh")}
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <Spinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading_weather")}</p>
        </Card>
      ) : weather ? (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">{translateCityName(weather.name)}</h2>
              </div>
              <span className="text-5xl">{getWeatherEmoji(weather.weather[0].icon)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">{Math.round(weather.main.temp)}°C</div>
                <div className="text-sm text-muted-foreground">{t("current_temp")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold">
                  {translateWeatherCondition(weather.weather[0].description)}
                </div>
                <div className="text-sm text-muted-foreground">{t("weather_status")}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">{t("feels_like")}</div>
                <div className="text-lg font-semibold">{Math.round(weather.main.feels_like)}°C</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">{t("humidity")}</div>
                <div className="text-lg font-semibold">{weather.main.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">{t("wind_speed")}</div>
                <div className="text-lg font-semibold">{weather.wind.speed} m/s</div>
              </div>
            </div>
          </Card>

          {airQuality && (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wind className="h-5 w-5 text-emerald-600" />
                {t("air_quality")}
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">{t("pm25")}</div>
                  <div className="text-2xl font-bold text-purple-600">{airQuality.components.pm2_5.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">PM2.5 μg/m³</div>
                  <div
                    className={`text-sm font-semibold mt-1 ${getAirQualityLevel(airQuality.components.pm2_5, airQuality.components.pm10).color}`}
                  >
                    {getAirQualityLevel(airQuality.components.pm2_5, airQuality.components.pm10).level}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">{t("pm10")}</div>
                  <div className="text-2xl font-bold text-orange-600">{airQuality.components.pm10.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">PM10 μg/m³</div>
                  <div
                    className={`text-sm font-semibold mt-1 ${getAirQualityLevel(airQuality.components.pm2_5, airQuality.components.pm10).color}`}
                  >
                    {getAirQualityLevel(airQuality.components.pm2_5, airQuality.components.pm10).level}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">{t("yellow_dust")}</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {(airQuality.components.pm10 - airQuality.components.pm2_5).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("large_particles")} μg/m³</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {airQuality.components.pm10 - airQuality.components.pm2_5 > 50
                      ? t("air_high")
                      : airQuality.components.pm10 - airQuality.components.pm2_5 > 20
                        ? t("air_moderate")
                        : t("air_low")}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {forecast.length > 0 && (
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Droplet className="h-5 w-5 text-indigo-600" />
                {t("weekly_forecast")}
              </h3>

              <div className="space-y-3">
                {forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-sm font-semibold w-12">{day.dayName}</div>
                      <span className="text-2xl">{getWeatherEmoji(day.weather[0].icon)}</span>
                      <div className="text-sm text-muted-foreground">
                        {translateWeatherCondition(day.weather[0].description)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t("max_temp")}</div>
                        <div className="text-lg font-bold text-red-600">{Math.round(day.main.temp_max)}°</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t("min_temp")}</div>
                        <div className="text-lg font-bold text-blue-600">{Math.round(day.main.temp_min)}°</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t("humidity")}</div>
                        <div className="text-sm font-semibold">{day.main.humidity}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {location && (
            <Card className="p-4 bg-gray-50">
              <p className="text-sm text-muted-foreground text-center">
                📍 {t("latitude")}: {location.lat.toFixed(4)}, {t("longitude")}: {location.lon.toFixed(4)}
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  )
}
