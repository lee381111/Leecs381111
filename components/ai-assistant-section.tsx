"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, Trash2, Loader2, ArrowLeft, Mic, MicOff } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantSectionProps {
  user: any
  language: string
  onBack?: () => void
}

export function AIAssistantSection({ user, language, onBack }: AIAssistantSectionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang =
        language === "ko" ? "ko-KR" : language === "zh" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsRecording(false)

        // Auto-send after brief delay
        setTimeout(() => {
          if (transcript.trim()) {
            handleSendVoiceMessage(transcript.trim())
          }
        }, 300)
      }

      recognitionRef.current.onerror = () => {
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [language])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        language === "ko"
          ? "음성 인식이 지원되지 않는 브라우저입니다."
          : language === "en"
            ? "Speech recognition is not supported in this browser."
            : language === "zh"
              ? "此浏览器不支持语音识别。"
              : "このブラウザは音声認識をサポートしていません。",
      )
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

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
          userId: user?.id,
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

  const handleSendVoiceMessage = async (message: string) => {
    if (!message || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
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
          message: message,
          language,
          userId: user?.id,
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

  return (
    <div className="h-full flex flex-col bg-green-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Bot className="h-6 w-6 text-green-600" />
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

      <Card className="flex-1 flex flex-col overflow-hidden bg-green-50 border-none shadow-none">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Bot className="h-16 w-16 text-green-400" />
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
                    ? "예시: 오늘 할 일 정리해줘, 다음 주 일정 알려줘, 차량 정비 내역 보여줘"
                    : language === "en"
                      ? "Example: Organize today's tasks, Tell me next week's schedule, Show vehicle maintenance"
                      : language === "zh"
                        ? "示例：整理今天的任务，告诉我下周的日程，显示车辆维护记录"
                        : "例：今日のタスクをまとめて、来週のスケジュールを教えて、車両メンテナンス記録を表示"}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-green-600 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-green-100" : "text-gray-500"}`}>
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
              <div className="bg-white rounded-lg p-3">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-green-200 p-4 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === "ko"
                  ? "메시지를 입력하거나 음성 버튼을 누르세요..."
                  : language === "en"
                    ? "Type a message or press the mic button..."
                    : language === "zh"
                      ? "输入消息或按麦克风按钮..."
                      : "メッセージを入力するか、マイクボタンを押してください..."
              }
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading || isRecording}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleRecording}
                disabled={isLoading}
                variant={isRecording ? "destructive" : "outline"}
                className="self-end"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="self-end">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {language === "ko"
              ? "Enter로 전송, Shift+Enter로 줄바꿈, 🎤 음성 입력"
              : language === "en"
                ? "Press Enter to send, Shift+Enter for new line, 🎤 Voice input"
                : language === "zh"
                  ? "按 Enter 发送，Shift+Enter 换行，🎤 语音输入"
                  : "Enterで送信、Shift+Enterで改行、🎤 音声入力"}
          </p>
        </div>
      </Card>
    </div>
  )
}
