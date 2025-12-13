"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

interface CustomCalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  eventDates?: Date[]
  className?: string
}

export function CustomCalendar({ selected, onSelect, eventDates = [], className }: CustomCalendarProps) {
  const { t, language } = useLanguage()
  const [currentDate, setCurrentDate] = React.useState(selected || new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Create array of dates to display
  const dates: (Date | null)[] = []

  // Previous month's trailing dates
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push(new Date(year, month - 1, daysInPrevMonth - i))
  }

  // Current month's dates
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i))
  }

  // Next month's leading dates to fill the grid
  const remainingCells = 42 - dates.length // 6 rows x 7 days
  for (let i = 1; i <= remainingCells; i++) {
    dates.push(new Date(year, month + 1, i))
  }

  const dayNames = [t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")]

  const hasEvent = (date: Date) => {
    return eventDates.some(
      (eventDate) =>
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear(),
    )
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getMonthName = () => {
    const monthNamesKo = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    const monthNamesEn = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const monthNamesZh = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    const monthNamesJa = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

    const monthNames = {
      ko: monthNamesKo,
      en: monthNamesEn,
      zh: monthNamesZh,
      ja: monthNamesJa,
    }

    return monthNames[language][month]
  }

  return (
    <div className={className}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-lg font-semibold">
          {language === "en"
            ? `${getMonthName()} ${year}`
            : `${year}${language === "ko" ? "년" : "年"} ${getMonthName()}`}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-foreground"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          if (!date) return <div key={index} />

          return (
            <button
              key={index}
              onClick={() => onSelect?.(date)}
              className={`
                relative h-12 text-sm rounded-md transition-colors
                ${!isCurrentMonth(date) ? "text-muted-foreground/40" : ""}
                ${isToday(date) ? "bg-emerald-100 font-bold" : ""}
                ${isSelected(date) ? "bg-emerald-600 text-white font-bold" : "hover:bg-emerald-50"}
                ${index % 7 === 0 && isCurrentMonth(date) ? "text-red-600" : ""}
                ${index % 7 === 6 && isCurrentMonth(date) ? "text-blue-600" : ""}
              `}
            >
              {date.getDate()}
              {hasEvent(date) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
