import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Forest Note - 기록의 숲 | AI 노트, 일정, 할일 관리 앱",
  description:
    "노트, 일정, 할일, 일기, 예산, 여행, 차량, 건강 관리를 한 곳에서. AI 비서가 도와주는 스마트한 생활 관리 플랫폼. 클라우드 동기화, 다국어 지원(한국어, 영어, 중국어, 일본어). 완전 무료.",
  keywords: [
    "노트앱",
    "일정관리",
    "할일관리",
    "다이어리",
    "예산관리",
    "여행계획",
    "차량관리",
    "건강관리",
    "AI비서",
    "생활관리",
    "클라우드동기화",
    "다국어",
    "무료앱",
    "note app",
    "schedule management",
    "todo list",
    "diary",
    "budget tracker",
    "travel planner",
    "vehicle management",
    "health tracker",
    "AI assistant",
    "life organizer",
    "cloud sync",
    "笔记应用",
    "日程管理",
    "待办事项",
    "日记",
    "预算管理",
    "旅行规划",
    "车辆管理",
    "健康管理",
    "ノートアプリ",
    "スケジュール管理",
    "タスク管理",
    "日記",
    "予算管理",
    "旅行計画",
    "車両管理",
    "健康管理",
  ],
  authors: [{ name: "Forest Note Team" }],
  generator: "v0.app",
  manifest: "/manifest.json",
  category: "productivity",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US", "zh_CN", "ja_JP"],
    title: "Forest Note - 기록의 숲",
    description: "AI가 돕는 스마트한 생활 관리 플랫폼. 노트, 일정, 할일, 건강까지 한 곳에서.",
    siteName: "Forest Note",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Forest Note",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Forest Note" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Forest Note",
              applicationCategory: "ProductivityApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              description:
                "노트, 일정, 할일, 일기, 예산, 여행, 차량, 건강 관리를 한 곳에서 관리하는 AI 지원 생활 관리 플랫폼",
              operatingSystem: "Web Browser",
              inLanguage: ["ko", "en", "zh", "ja"],
              featureList: [
                "AI 비서 지원",
                "노트 및 메모 작성",
                "일정 및 캘린더 관리",
                "할일 목록 관리",
                "일기 작성",
                "예산 및 지출 추적",
                "여행 계획",
                "차량 정비 기록",
                "건강 기록 관리",
                "클라우드 동기화",
                "다국어 지원",
              ],
            }),
          }}
        />
        <script src="https://sdk.minepi.com/pi-sdk.js" async />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message === 'ResizeObserver loop completed with undelivered notifications.' || 
                    e.message === 'ResizeObserver loop limit exceeded') {
                  e.stopImmediatePropagation();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`font-sans antialiased`}
        style={{ background: "linear-gradient(135deg, rgb(220, 252, 231) 0%, rgb(220, 252, 231) 100%)" }}
      >
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
