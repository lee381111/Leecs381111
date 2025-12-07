"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: () => void
  type: "terms" | "privacy"
  language: "ko" | "en" | "zh" | "ja"
}

export function TermsModal({ open, onOpenChange, onAgree, type, language }: TermsModalProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const bottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10
    setScrolledToBottom(bottom)
  }

  const content = {
    terms: {
      ko: {
        title: "이용약관",
        description: "약관을 끝까지 읽어주세요",
        agree: "동의합니다",
        scroll: "약관을 끝까지 읽어주세요",
      },
      en: {
        title: "Terms of Service",
        description: "Please read to the end",
        agree: "I Agree",
        scroll: "Please scroll to the bottom",
      },
      zh: {
        title: "服务条款",
        description: "请阅读至结尾",
        agree: "我同意",
        scroll: "请滚动到底部",
      },
      ja: {
        title: "利用規約",
        description: "最後まで読んでください",
        agree: "同意します",
        scroll: "最後までスクロールしてください",
      },
    },
    privacy: {
      ko: {
        title: "개인정보처리방침",
        description: "개인정보 처리 방침을 끝까지 읽어주세요",
        agree: "동의합니다",
        scroll: "약관을 끝까지 읽어주세요",
      },
      en: {
        title: "Privacy Policy",
        description: "Please read our privacy policy to the end",
        agree: "I Agree",
        scroll: "Please scroll to the bottom",
      },
      zh: {
        title: "隐私政策",
        description: "请阅读我们的隐私政策至结尾",
        agree: "我同意",
        scroll: "请滚动到底部",
      },
      ja: {
        title: "プライバシーポリシー",
        description: "プライバシーポリシーを最後まで読んでください",
        agree: "同意します",
        scroll: "最後までスクロールしてください",
      },
    },
  }

  const t = content[type][language]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4" onScrollCapture={handleScroll}>
          <div className="space-y-4 text-sm">
            {type === "terms" ? (
              <div className="space-y-4">
                <p className="font-semibold">제1조 (목적)</p>
                <p>
                  본 약관은 이 앱의 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로
                  합니다.
                </p>
                <p className="font-semibold">제2조 (서비스의 제공)</p>
                <p>
                  회사는 개인 생활 관리를 위한 다음의 서비스를 제공합니다: 노트, 일기, 일정, 할일, 건강 기록, 예산 관리,
                  여행 기록, 차량 관리, 명함 관리, 날씨 정보.
                </p>
                <p>기본 기능은 무료로 제공되며, 향후 프리미엄 기능이 추가될 수 있습니다.</p>
                <p className="font-semibold">제3조 (회원가입)</p>
                <p>누구나 이메일 주소로 회원가입이 가능합니다.</p>
                <p>회원가입 시 본 약관과 개인정보처리방침에 동의해야 합니다.</p>
                {/* More content... */}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-semibold">1. 수집하는 개인정보</p>
                <p>회원가입 시: 이메일, 비밀번호, 이름</p>
                <p>서비스 이용 시: 노트, 일기, 일정, 건강 기록, 예산 정보 등</p>
                <p className="font-semibold">2. 개인정보의 보관</p>
                <p>사용자의 개인정보는 Supabase 데이터베이스에 안전하게 보관됩니다.</p>
                <p>Row Level Security (RLS)를 통해 타인의 접근을 차단합니다.</p>
                {/* More content... */}
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-2">
          {!scrolledToBottom && <p className="text-sm text-muted-foreground text-center">{t.scroll}</p>}
          <Button
            onClick={() => {
              onAgree()
              onOpenChange(false)
            }}
            disabled={!scrolledToBottom}
            className="w-full"
          >
            {t.agree}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
