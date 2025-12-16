"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, Trash2, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantSectionProps {
  user: any
  language: string
}

export function AIAssistantSection({ user, language }: AIAssistantSectionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          language,
          userId: user?.id, // Pass user ID to get personalized data
        }),
      })

      if (!response.ok) throw new Error("AI response failed")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] AI chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "ko"
            ? "죄송합니다. 응답 중 오류가 발생했습니다."
            : language === "en"
              ? "Sorry, an error occurred during response."
              : language === "zh"
                ? "抱歉，响应时出错。"
                : "申し訳ございません。応答中にエラーが発生しました。",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    if (
      confirm(
        language === "ko"
          ? "대화 내역을 모두 삭제하시겠습니까?"
          : language === "en"
            ? "Delete all chat history?"
            : language === "zh"
              ? "删除所有聊天记录吗？"
              : "すべてのチャット履歴を削除しますか？",
      )
    ) {
      setMessages([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {language === "ko"
              ? "AI 비서"
              : language === "en"
                ? "AI Assistant"
                : language === "zh"
                  ? "AI 助手"
                  : "AI アシスタント"}
          </h2>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white/80 backdrop-blur">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Bot className="h-16 w-16 text-blue-400" />
              <div className="text-center space-y-2">
                <p className="font-semibold">
                  {language === "ko"
                    ? "안녕하세요! 무엇을 도와드릴까요?"
                    : language === "en"
                      ? "Hello! How can I help you?"
                      : language === "zh"
                        ? "您好！我能帮您什么？"
                        : "こんにちは！何かお手伝いできますか？"}
                </p>
                <p className="text-sm">
                  {language === "ko"
                    ? "예시: 오늘 할 일 정리해줘, 다음 주 일정 알려줘"
                    : language === "en"
                      ? "Example: Organize today's tasks, Tell me next week's schedule"
                      : language === "zh"
                        ? "示例：整理今天的任务，告诉我下周的日程"
                        : "例：今日のタスクをまとめて、来週のスケジュールを教えて"}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString(language === "ko" ? "ko-KR" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === "ko"
                  ? "메시지를 입력하세요..."
                  : language === "en"
                    ? "Type a message..."
                    : language === "zh"
                      ? "输入消息..."
                      : "メッセージを入力..."
              }
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="self-end">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {language === "ko"
              ? "Enter로 전송, Shift+Enter로 줄바꿈"
              : language === "en"
                ? "Press Enter to send, Shift+Enter for new line"
                : language === "zh"
                  ? "按 Enter 发送，Shift+Enter 换行"
                  : "Enterで送信、Shift+Enterで改行"}
          </p>
        </div>
      </Card>
    </div>
  )
}
