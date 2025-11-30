"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ScheduleEvent } from "@/lib/types"

interface CalendarWidgetProps {
  events: ScheduleEvent[]
  onDateClick?: (date: Date) => void
  language: string
}

export function CalendarWidget({ events, onDateClick, language }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [selectedDateEvents, setSelectedDateEvents] = useState<ScheduleEvent[]>([])
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const monthNames = {
    ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    zh: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  }
  
  const dayNames = {
    ko: ["일", "월", "화", "수", "목", "금", "토"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    zh: ["日", "一", "二", "三", "四", "五", "六"],
    ja: ["日", "月", "火", "水", "木", "金", "土"],
  }
  
  const lang = (language || "ko") as keyof typeof monthNames
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const hasEvent = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.some((event) => event.date === dateStr)
  }
  
  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const filtered = events.filter((event) => event.date === dateStr)
    return filtered
  }
  
  const today = new Date()
  const isToday = (day: number) => {
    if (selectedDate && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
      return false
    }
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }
  
  const calendarDays = []
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isNextMonth: false,
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      isNextMonth: false,
    })
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isNextMonth: true,
    })
  }
  
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    setSelectedDate(clickedDate)
    
    const dateEvents = getEventsForDate(day)
    if (dateEvents.length > 0) {
      setSelectedDateEvents(dateEvents)
      setShowEventsModal(true)
    }
  }
  
  return (
    <>
      <Card className="p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4 dark:text-slate-200" />
          </Button>
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">
            {year}년 {monthNames[lang][month]}
          </h3>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4 dark:text-slate-200" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {dayNames[lang].map((day, idx) => (
            <div key={idx} className={`font-medium ${idx === 0 ? "text-red-500 dark:text-red-400" : idx === 6 ? "text-blue-500 dark:text-blue-400" : "text-gray-700 dark:text-slate-300"}`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, idx) => {
            const dayHasEvent = item.isCurrentMonth && hasEvent(item.day)
            const dayIsToday = item.isCurrentMonth && isToday(item.day)
            const isSelected = selectedDate && item.isCurrentMonth && 
              selectedDate.getDate() === item.day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year
            
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.isCurrentMonth) {
                    handleDateClick(item.day)
                  }
                }}
                disabled={!item.isCurrentMonth}
                className={`
                  relative aspect-square text-xs rounded-lg transition-all
                  ${item.isCurrentMonth ? "hover:bg-emerald-100 dark:hover:bg-emerald-900/30 cursor-pointer text-gray-900 dark:text-slate-100" : "text-gray-300 dark:text-slate-600 cursor-not-allowed"}
                  ${isSelected ? "bg-emerald-500 text-white font-bold" : ""}
                  ${dayIsToday && !isSelected ? "bg-emerald-200 dark:bg-emerald-600 font-semibold text-gray-900 dark:text-white" : ""}
                  ${dayHasEvent && !dayIsToday && !isSelected ? "font-semibold" : ""}
                `}
              >
                {item.day}
                {dayHasEvent && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </Card>
      
      {showEventsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {selectedDate?.toLocaleDateString(language === "ko" ? "ko-KR" : language === "en" ? "en-US" : language === "zh" ? "zh-CN" : "ja-JP")}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEventsModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 border rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      {event.time && (
                        <p className="text-sm text-gray-600 mt-1">
                          🕐 {event.time}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                      )}
                      {event.category && (
                        <span className="inline-block mt-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded">
                          {event.category}
                        </span>
                      )}
                      {event.isSpecialEvent && (
                        <span className="inline-block mt-2 ml-2 px-2 py-1 bg-rose-200 text-rose-800 text-xs rounded">
                          ⭐ {language === "ko" ? "특별한 날" : language === "en" ? "Special" : language === "zh" ? "特别" : "特別"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
