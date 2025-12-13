"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { loadPiSDK, isPiSDKAvailable, isPiBrowser } from "@/lib/pi-network"

interface PiPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onPaymentSuccess: () => void
}

export function PiPaymentDialog({ open, onOpenChange, userId, onPaymentSuccess }: PiPaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [inPiBrowser, setInPiBrowser] = useState(false)

  useEffect(() => {
    setInPiBrowser(isPiBrowser())

    if (open && !sdkLoaded && !isInitializing) {
      setIsInitializing(true)
      loadPiSDK()
        .then(() => {
          setSdkLoaded(true)
          setIsInitializing(false)
        })
        .catch((err) => {
          console.error("[v0] Failed to load Pi SDK:", err)
          setError("파이 네트워크 SDK를 로드할 수 없습니다.")
          setIsInitializing(false)
        })
    }
  }, [open, sdkLoaded, isInitializing])

  const handlePayment = async () => {
    if (!isPiSDKAvailable()) {
      setError("파이 네트워크 SDK를 사용할 수 없습니다. 파이 브라우저에서 접속해주세요.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const paymentData = {
        amount: 1,
        memo: "Premium Access - 기록의 숲",
        metadata: { userId, feature: "premium_access" },
      }

      const callbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("[v0] Payment ready for approval:", paymentId)
          try {
            const response = await fetch("/api/pi-payment/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, userId }),
            })
            if (!response.ok) throw new Error("Failed to approve payment")
          } catch (err) {
            console.error("[v0] Error approving payment:", err)
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("[v0] Payment ready for completion:", paymentId, txid)
          try {
            const response = await fetch("/api/pi-payment/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid, userId, amount: 1 }),
            })
            if (!response.ok) throw new Error("Failed to complete payment")

            setSuccess(true)
            setIsLoading(false)
            setTimeout(() => {
              onPaymentSuccess()
              onOpenChange(false)
            }, 2000)
          } catch (err) {
            console.error("[v0] Error completing payment:", err)
            setError("결제 완료 중 오류가 발생했습니다.")
            setIsLoading(false)
          }
        },
        onCancel: (paymentId: string) => {
          console.log("[v0] Payment cancelled:", paymentId)
          setError("결제가 취소되었습니다.")
          setIsLoading(false)
        },
        onError: (error: Error) => {
          console.error("[v0] Payment error:", error)
          setError(error.message || "결제 중 오류가 발생했습니다.")
          setIsLoading(false)
        },
      }

      if (window.Pi) {
        window.Pi.createPayment(paymentData, callbacks)
      } else {
        throw new Error("Pi SDK is not available")
      }
    } catch (err) {
      console.error("[v0] Error initiating payment:", err)
      setError(err instanceof Error ? err.message : "결제를 시작할 수 없습니다.")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>프리미엄 업그레이드</DialogTitle>
          <DialogDescription>파이코인으로 프리미엄 기능을 이용하세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!inPiBrowser && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500 bg-amber-500/10 p-3 text-sm text-amber-600">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">파이 브라우저가 필요합니다</p>
                <p className="mt-1 text-xs">
                  Pi Network 결제는 Pi Browser 앱에서만 가능합니다. 스마트폰에 Pi Browser를 설치하고 이 앱에
                  접속해주세요.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-2 font-semibold">프리미엄 혜택</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ 여행 기록 무제한 사용</li>
              <li>✓ 모든 기능 광고 없이 이용</li>
              <li>✓ 1년간 프리미엄 액세스</li>
            </ul>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <span className="font-semibold">가격</span>
            <span className="text-2xl font-bold">1 π</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500 bg-green-500/10 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              결제가 완료되었습니다!
            </div>
          )}

          <Button
            onClick={handlePayment}
            disabled={isLoading || !sdkLoaded || success || isInitializing || !inPiBrowser}
            className="w-full"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                SDK 초기화 중...
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                결제 처리 중...
              </>
            ) : success ? (
              "결제 완료"
            ) : !inPiBrowser ? (
              "Pi Browser에서 이용 가능"
            ) : (
              "파이코인으로 결제하기"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {inPiBrowser
              ? "결제 버튼을 눌러 Pi Network 결제를 진행하세요"
              : "현재 일반 브라우저에서 접속 중입니다. Pi Browser 앱을 사용해주세요."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
