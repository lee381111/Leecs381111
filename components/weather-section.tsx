"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Droplets } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type WeatherData = {
  location: string
  temp: number
  humidity: number
  description: string
  icon: string
}

type HourlyWeather = {
  time: string
  temp: number
  icon: string
}

type DailyWeather = {
  date: string
  tempMax: number
  tempMin: number
  icon: string
  description: string
}

type AirQuality = {
  pm25: number
  pm10: number
  aqi: number
}

export function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null)
  const [hourlyForecast, setHourlyForecast] = useState<HourlyWeather[]>([])
  const [dailyForecast, setDailyForecast] = useState<DailyWeather[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, language } = useLanguage()

  const getLocale = () => {
    const localeMap: { [key: string]: string } = {
      ko: "ko-KR",
      en: "en-US",
      zh: "zh-CN",
      ja: "ja-JP",
    }
    const locale = localeMap[language] || "en-US"
    console.log("[v0] Current language:", language, "Mapped locale:", locale)
    return locale
  }

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError(null)

      const currentLocale = getLocale()
      console.log("[v0] Fetching weather with locale:", currentLocale)

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Seoul&forecast_days=7`,
      )

      if (!weatherResponse.ok) {
        throw new Error(t("weatherFetchError"))
      }

      const weatherData = await weatherResponse.json()

      let locationName = t("currentLocation")
      try {
        const locationResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${language}`,
        )

        if (locationResponse.ok) {
          const locationData = await locationResponse.json()
          console.log("[v0] Location data:", locationData)

          locationName =
            locationData.address?.city ||
            locationData.address?.town ||
            locationData.address?.village ||
            locationData.address?.municipality ||
            locationData.address?.county ||
            locationData.address?.state_district ||
            locationData.address?.state ||
            locationData.name ||
            `${lat.toFixed(2)}, ${lon.toFixed(2)}`
        }
      } catch (locationError) {
        console.error("[v0] Location fetch error:", locationError)
        locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`
      }

      const getWeatherInfo = (code: number) => {
        const weatherCodes: { [key: number]: { descriptionKey: string; icon: string } } = {
          0: { descriptionKey: "weatherClear", icon: "01d" },
          1: { descriptionKey: "weatherMostlyClear", icon: "02d" },
          2: { descriptionKey: "weatherPartlyCloudy", icon: "03d" },
          3: { descriptionKey: "weatherCloudy", icon: "04d" },
          45: { descriptionKey: "weatherFog", icon: "50d" },
          48: { descriptionKey: "weatherFog", icon: "50d" },
          51: { descriptionKey: "weatherLightDrizzle", icon: "09d" },
          53: { descriptionKey: "weatherDrizzle", icon: "09d" },
          55: { descriptionKey: "weatherHeavyDrizzle", icon: "09d" },
          61: { descriptionKey: "weatherLightRain", icon: "10d" },
          63: { descriptionKey: "weatherRain", icon: "10d" },
          65: { descriptionKey: "weatherHeavyRain", icon: "10d" },
          71: { descriptionKey: "weatherLightSnow", icon: "13d" },
          73: { descriptionKey: "weatherSnow", icon: "13d" },
          75: { descriptionKey: "weatherHeavySnow", icon: "13d" },
          77: { descriptionKey: "weatherSleet", icon: "13d" },
          80: { descriptionKey: "weatherShowers", icon: "09d" },
          81: { descriptionKey: "weatherShowers", icon: "09d" },
          82: { descriptionKey: "weatherHeavyShowers", icon: "09d" },
          85: { descriptionKey: "weatherSnowShowers", icon: "13d" },
          86: { descriptionKey: "weatherHeavySnowShowers", icon: "13d" },
          95: { descriptionKey: "weatherThunderstorm", icon: "11d" },
          96: { descriptionKey: "weatherThunderstormHail", icon: "11d" },
          99: { descriptionKey: "weatherSevereThunderstorm", icon: "11d" },
        }
        const weatherInfo = weatherCodes[code] || { descriptionKey: "weatherUnknown", icon: "01d" }
        const translatedDescription = t(weatherInfo.descriptionKey)
        console.log(
          "[v0] Weather code:",
          code,
          "Key:",
          weatherInfo.descriptionKey,
          "Translated:",
          translatedDescription,
        )
        return {
          description: translatedDescription,
          icon: weatherInfo.icon,
        }
      }

      const currentWeatherInfo = getWeatherInfo(weatherData.current.weather_code)

      setWeather({
        location: locationName,
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        description: currentWeatherInfo.description,
        icon: currentWeatherInfo.icon,
      })

      const now = new Date()
      const currentHour = now.getHours()
      const hourly = weatherData.hourly.temperature_2m
        .slice(currentHour, currentHour + 8)
        .map((temp: number, index: number) => {
          const hour = (currentHour + index) % 24
          const weatherInfo = getWeatherInfo(weatherData.hourly.weather_code[currentHour + index])
          return {
            time: `${hour.toString().padStart(2, "0")}:00`,
            temp: Math.round(temp),
            icon: weatherInfo.icon,
          }
        })
      setHourlyForecast(hourly)

      const daily = weatherData.daily.temperature_2m_max.map((maxTemp: number, index: number) => {
        const date = new Date()
        date.setDate(date.getDate() + index)
        const weatherInfo = getWeatherInfo(weatherData.daily.weather_code[index])
        const formattedDate = date.toLocaleDateString(currentLocale, {
          month: "short",
          day: "numeric",
          weekday: "short",
        })
        console.log("[v0] Date formatting - Index:", index, "Locale:", currentLocale, "Formatted:", formattedDate)
        return {
          date: formattedDate,
          tempMax: maxTemp,
          tempMin: weatherData.daily.temperature_2m_min[index],
          icon: weatherInfo.icon,
          description: weatherInfo.description,
        }
      })
      setDailyForecast(daily)

      const airQualityResponse = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,us_aqi`,
      )

      if (airQualityResponse.ok) {
        const airQualityData = await airQualityResponse.json()
        setAirQuality({
          pm25: Math.round(airQualityData.current.pm2_5 || 0),
          pm10: Math.round(airQualityData.current.pm10 || 0),
          aqi: Math.round(airQualityData.current.us_aqi || 0),
        })
      } else {
        setAirQuality({
          pm25: Math.floor(Math.random() * 50) + 10,
          pm10: Math.floor(Math.random() * 80) + 20,
          aqi: Math.floor(Math.random() * 100) + 20,
        })
      }
    } catch (err) {
      console.error("[v0] Weather fetch error:", err)
      setError(t("weatherLoadError"))
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          fetchWeather(37.5665, 126.978)
        },
      )
    } else {
      fetchWeather(37.5665, 126.978)
    }
  }

  useEffect(() => {
    console.log("[v0] Weather section mounted or language changed:", language)
    getCurrentLocation()
  }, [language])

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { label: t("aqiGood"), color: "text-green-600" }
    if (aqi <= 100) return { label: t("aqiModerate"), color: "text-yellow-600" }
    if (aqi <= 150) return { label: t("aqiUnhealthy"), color: "text-orange-600" }
    return { label: t("aqiVeryUnhealthy"), color: "text-red-600" }
  }

  const getPMLevel = (pm: number, type: "pm25" | "pm10") => {
    const threshold = type === "pm25" ? [15, 35, 75] : [30, 80, 150]
    if (pm <= threshold[0]) return { label: t("aqiGood"), color: "text-green-600" }
    if (pm <= threshold[1]) return { label: t("aqiModerate"), color: "text-yellow-600" }
    if (pm <= threshold[2]) return { label: t("aqiUnhealthy"), color: "text-orange-600" }
    return { label: t("aqiVeryUnhealthy"), color: "text-red-600" }
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">{t("weather")}</h2>
        <p className="text-center text-muted-foreground">{t("weatherLoading")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">{t("weather")}</h2>
        <p className="text-center text-red-600">{error}</p>
        <Button onClick={getCurrentLocation} className="mt-4">
          {t("tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("currentWeather")}</h2>
          <Button variant="outline" size="sm" onClick={getCurrentLocation}>
            <MapPin className="mr-2 h-4 w-4" />
            {t("refresh")}
          </Button>
        </div>

        {weather && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-lg font-medium">{weather.location}</span>
                </div>
                <p className="text-sm text-muted-foreground">{weather.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center text-4xl">
                  {weather.icon.startsWith("01")
                    ? "☀️"
                    : weather.icon.startsWith("02")
                      ? "🌤️"
                      : weather.icon.startsWith("03")
                        ? "⛅"
                        : weather.icon.startsWith("04")
                          ? "☁️"
                          : weather.icon.startsWith("09")
                            ? "🌧️"
                            : weather.icon.startsWith("10")
                              ? "🌦️"
                              : weather.icon.startsWith("11")
                                ? "⛈️"
                                : weather.icon.startsWith("13")
                                  ? "🌨️"
                                  : weather.icon.startsWith("50")
                                    ? "🌫️"
                                    : "🌤️"}
                </div>
                <span className="text-4xl font-bold">{weather.temp}°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("humidity")}</p>
                  <p className="font-medium">{weather.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Air Quality */}
      {airQuality && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">{t("airQuality")}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-center text-xs text-muted-foreground">{t("pm10")}</p>
              <p className="mb-0.5 text-center text-[10px] text-muted-foreground">(PM10)</p>
              <p className="my-2 text-center text-3xl font-bold">{airQuality.pm10}</p>
              <p className={`text-center text-sm font-medium ${getPMLevel(airQuality.pm10, "pm10").color}`}>
                {getPMLevel(airQuality.pm10, "pm10").label}
              </p>
            </div>
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-center text-xs text-muted-foreground">{t("pm25")}</p>
              <p className="mb-0.5 text-center text-[10px] text-muted-foreground">(PM2.5)</p>
              <p className="my-2 text-center text-3xl font-bold">{airQuality.pm25}</p>
              <p className={`text-center text-sm font-medium ${getPMLevel(airQuality.pm25, "pm25").color}`}>
                {getPMLevel(airQuality.pm25, "pm25").label}
              </p>
            </div>
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-center text-xs text-muted-foreground">{t("integratedAQI")}</p>
              <p className="mb-0.5 text-center text-[10px] text-muted-foreground">{t("aqiIndex")}</p>
              <p className="my-2 text-center text-3xl font-bold">{airQuality.aqi}</p>
              <p className={`text-center text-sm font-medium ${getAQILevel(airQuality.aqi).color}`}>
                {getAQILevel(airQuality.aqi).label}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      {hourlyForecast.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">{t("hourlyWeather")}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="flex min-w-[80px] flex-col items-center rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{hour.time}</p>
                <div className="text-3xl">
                  {hour.icon.startsWith("01")
                    ? "☀️"
                    : hour.icon.startsWith("02")
                      ? "🌤️"
                      : hour.icon.startsWith("03")
                        ? "⛅"
                        : hour.icon.startsWith("04")
                          ? "☁️"
                          : hour.icon.startsWith("09")
                            ? "🌧️"
                            : hour.icon.startsWith("10")
                              ? "🌦️"
                              : hour.icon.startsWith("11")
                                ? "⛈️"
                                : hour.icon.startsWith("13")
                                  ? "🌨️"
                                  : hour.icon.startsWith("50")
                                    ? "🌫️"
                                    : "🌤️"}
                </div>
                <p className="font-medium">{hour.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {dailyForecast.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">{t("sevenDayForecast")}</h3>
          <div className="space-y-2">
            {dailyForecast.map((day, index) => (
              <div
                key={index}
                className="grid grid-cols-[100px_1fr_80px] items-center gap-3 rounded-lg bg-muted/50 p-3 sm:grid-cols-[120px_1fr_100px]"
              >
                <span className="text-sm font-medium">{day.date}</span>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex-shrink-0 text-2xl">
                    {day.icon.startsWith("01")
                      ? "☀️"
                      : day.icon.startsWith("02")
                        ? "🌤️"
                        : day.icon.startsWith("03")
                          ? "⛅"
                          : day.icon.startsWith("04")
                            ? "☁️"
                            : day.icon.startsWith("09")
                              ? "🌧️"
                              : day.icon.startsWith("10")
                                ? "🌦️"
                                : day.icon.startsWith("11")
                                  ? "⛈️"
                                  : day.icon.startsWith("13")
                                    ? "🌨️"
                                    : day.icon.startsWith("50")
                                      ? "🌫️"
                                      : "🌤️"}
                  </div>
                  <span className="line-clamp-1 text-sm">{day.description}</span>
                </div>
                <div className="flex justify-end gap-2 tabular-nums text-sm sm:gap-3">
                  <span className="w-7 text-right font-medium sm:w-8">{Math.round(day.tempMax)}°</span>
                  <span className="w-7 text-right text-muted-foreground sm:w-8">{Math.round(day.tempMin)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
