"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { setupStorageBucket } from "@/app/actions/setup-storage"
import { useLanguage } from "@/lib/language-context"

type StorageSetupModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function StorageSetupModal({ isOpen, onClose, onSuccess }: StorageSetupModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [setupStatus, setSetupStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { language } = useLanguage()

  const handleSetup = async () => {
    setIsLoading(true)
    setSetupStatus("idle")
    setErrorMessage("")

    try {
      const result = await setupStorageBucket()

      if (result.success) {
        setSetupStatus("success")
        setTimeout(() => {
          onSuccess()
          onClose()
          setSetupStatus("idle")
        }, 1500)
      } else {
        setSetupStatus("error")
        setErrorMessage(result.error || "Unknown error")
      }
    } catch (error) {
      setSetupStatus("error")
      setErrorMessage(String(error))
    } finally {
      setIsLoading(false)
    }
  }

  const messages = {
    ko: {
      title: "Storage 설정 필요",
      description:
        "오디오/비디오 파일을 업로드하려면 Supabase Storage를 설정해야 합니다. 아래 버튼을 클릭하면 자동으로 설정됩니다.",
      setupButton: "자동 설정하기",
      settingUp: "설정 중...",
      success: "설정 완료! 이제 파일을 업로드할 수 있습니다.",
      error: "설정 실패",
      close: "닫기",
      tryAgain: "다시 시도",
    },
    en: {
      title: "Storage Setup Required",
      description:
        "To upload audio/video files, you need to set up Supabase Storage. Click the button below to set it up automatically.",
      setupButton: "Auto Setup",
      settingUp: "Setting up...",
      success: "Setup complete! You can now upload files.",
      error: "Setup Failed",
      close: "Close",
      tryAgain: "Try Again",
    },
    zh: {
      title: "需要设置存储",
      description: "要上传音频/视频文件，您需要设置Supabase存储。点击下面的按钮自动设置。",
      setupButton: "自动设置",
      settingUp: "设置中...",
      success: "设置完成！现在可以上传文件了。",
      error: "设置失败",
      close: "关闭",
      tryAgain: "重试",
    },
    ja: {
      title: "ストレージ設定が必要",
      description:
        "音声/動画ファイルをアップロードするには、Supabaseストレージを設定する必要があります。下のボタンをクリックすると自動的に設定されます。",
      setupButton: "自動設定",
      settingUp: "設定中...",
      success: "設定完了！ファイルをアップロードできるようになりました。",
      error: "設定失敗",
      close: "閉じる",
      tryAgain: "再試行",
    },
  }

  const t = messages[language]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        {setupStatus === "success" && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 dark:text-green-200">{t.success}</p>
          </div>
        )}

        {setupStatus === "error" && (
          <div className="space-y-2 rounded-lg bg-red-50 dark:bg-red-950 p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">{t.error}</p>
            </div>
            {errorMessage && <p className="text-xs text-red-700 dark:text-red-300">{errorMessage}</p>}
          </div>
        )}

        <DialogFooter>
          {setupStatus === "idle" && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                {t.close}
              </Button>
              <Button onClick={handleSetup} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.settingUp}
                  </>
                ) : (
                  t.setupButton
                )}
              </Button>
            </>
          )}
          {setupStatus === "error" && (
            <>
              <Button variant="outline" onClick={onClose}>
                {t.close}
              </Button>
              <Button onClick={handleSetup}>{t.tryAgain}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
