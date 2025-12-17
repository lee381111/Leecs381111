"use client"

import type React from "react"

import { useEffect } from "react"

interface AdsenseAdProps {
  slot: string
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  style?: React.CSSProperties
}

export function AdsenseAd({ slot, format = "auto", responsive = true, style = {} }: AdsenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("[v0] AdSense error:", err)
    }
  }, [])

  // AdSense가 설정되지 않은 경우 렌더링하지 않음
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null
  }

  return (
    <div className="my-4 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

export default AdsenseAd
