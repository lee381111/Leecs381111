"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { isMasterPasswordSet } from "@/lib/auth/master-password"

export default function MasterPasswordSetupPage() {
  const router = useRouter()

  useEffect(() => {
    // If master password is already set, redirect to master password entry
    if (isMasterPasswordSet()) {
      router.push("/auth/master-password")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">리다이렉트 중...</h1>
            <p className="text-gray-600 dark:text-gray-400">마스터 비밀번호 입력 페이지로 이동합니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}
