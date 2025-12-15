"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { generateDataDeletionReport } from "@/lib/storage"
import { loadAllConsentsWithEmails } from "./actions"

interface ConsentLog {
  id: string
  user_id: string
  terms_version: string
  privacy_version: string
  agreed_at: string
  user_agent: string | null
  email?: string
}

interface UserStorage {
  user_id: string
  email: string
  storage_used: number
  storage_quota: number
  display_name?: string
}

export default function AdminConsentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [consents, setConsents] = useState<ConsentLog[]>([])
  const [generating, setGenerating] = useState(false)
  const [storageData, setStorageData] = useState<UserStorage[]>([])
  const [loadingStorage, setLoadingStorage] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/sign-in")
      return
    }

    if (user.email !== "lee381111@gmail.com") {
      router.push("/")
      return
    }

    setIsAdmin(true)
    await loadConsents()
    setLoading(false)
  }

  async function loadConsents() {
    console.log("[v0] Loading all user consents with emails...")

    try {
      const consentsWithEmails = await loadAllConsentsWithEmails()

      console.log("[v0] Found consent records:", consentsWithEmails.length)
      setConsents(consentsWithEmails)
    } catch (error) {
      console.error("[v0] Error loading consents:", error)
    }
  }

  async function loadStorageUsage() {
    setLoadingStorage(true)
    try {
      const supabase = createClient()

      // Get all profiles with storage information
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("user_id, email, display_name, storage_used, storage_quota")
        .order("storage_used", { ascending: false })

      if (error) throw error

      const storageList: UserStorage[] =
        profiles?.map((profile) => ({
          user_id: profile.user_id,
          email: profile.email || "Unknown",
          display_name: profile.display_name,
          storage_used: profile.storage_used || 0,
          storage_quota: profile.storage_quota || 1073741824, // Default 1GB
        })) || []

      setStorageData(storageList)
      console.log("[v0] Loaded storage data for", storageList.length, "users")
    } catch (error) {
      console.error("[v0] Error loading storage usage:", error)
    } finally {
      setLoadingStorage(false)
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  function getUsagePercentage(used: number, quota: number): number {
    return Math.round((used / quota) * 100)
  }

  async function handleGenerateReport() {
    setGenerating(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const report = await generateDataDeletionReport(user.id)

      const blob = new Blob([report], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `개인정보_파기_대장_${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert("파기 대장이 다운로드되었습니다.")
    } catch (error) {
      console.error("Error generating report:", error)
      alert("파기 대장 생성에 실패했습니다.")
    } finally {
      setGenerating(false)
    }
  }

  async function handleDownloadCSV() {
    const headers = ["ID", "사용자 ID", "이메일", "약관 버전", "개인정보 버전", "동의 일시", "User Agent"]
    const rows = consents.map((c) => [
      c.id,
      c.user_id,
      c.email || "",
      c.terms_version,
      c.privacy_version,
      new Date(c.agreed_at).toLocaleString("ko-KR"),
      c.user_agent || "",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `동의_로그_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리자 페이지</h1>
          <p className="text-muted-foreground">약관 동의 로그 및 파기 대장 관리</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          홈으로
        </Button>
      </div>

      {/* Data Deletion Report Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>개인정보 파기 대장</CardTitle>
          <CardDescription>
            서비스 종료 시 법적 증명을 위한 파기 대장을 생성합니다. Supabase 프로젝트 삭제 전에 반드시 다운로드하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateReport} disabled={generating}>
            {generating ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {generating ? "생성 중..." : "파기 대장 생성"}
          </Button>
        </CardContent>
      </Card>

      {/* Consent Logs Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>약관 동의 로그</CardTitle>
              <CardDescription>
                사용자들의 약관 동의 이력을 확인할 수 있습니다. (총 {consents.length}건)
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleDownloadCSV} disabled={consents.length === 0}>
              CSV 다운로드
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {consents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">동의 로그가 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-2">사용자</th>
                    <th className="p-2">약관 버전</th>
                    <th className="p-2">개인정보 버전</th>
                    <th className="p-2">동의 일시</th>
                  </tr>
                </thead>
                <tbody>
                  {consents.map((consent) => (
                    <tr key={consent.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          {consent.email ? (
                            <>
                              <span className="font-medium">{consent.email}</span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {consent.user_id.substring(0, 8)}...
                              </span>
                            </>
                          ) : (
                            <span className="font-mono text-xs text-muted-foreground">
                              user {consent.user_id.substring(0, 8)}...
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2">{consent.terms_version}</td>
                      <td className="p-2">{consent.privacy_version}</td>
                      <td className="p-2">
                        {new Date(consent.agreed_at).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>사용자별 저장소 사용량</CardTitle>
              <CardDescription>각 사용자의 데이터베이스 및 저장소 사용량을 확인할 수 있습니다.</CardDescription>
            </div>
            <Button variant="outline" onClick={loadStorageUsage} disabled={loadingStorage}>
              {loadingStorage ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {loadingStorage ? "로딩 중..." : "새로고침"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {storageData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                저장소 사용량 데이터를 불러오려면 새로고침 버튼을 클릭하세요.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-2">사용자</th>
                    <th className="p-2">사용량</th>
                    <th className="p-2">할당량</th>
                    <th className="p-2">사용률</th>
                    <th className="p-2">진행률</th>
                  </tr>
                </thead>
                <tbody>
                  {storageData.map((user) => {
                    const percentage = getUsagePercentage(user.storage_used, user.storage_quota)
                    const isHigh = percentage > 80

                    return (
                      <tr key={user.user_id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{user.email}</span>
                            {user.display_name && (
                              <span className="text-xs text-muted-foreground">{user.display_name}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-2 font-mono">{formatBytes(user.storage_used)}</td>
                        <td className="p-2 font-mono">{formatBytes(user.storage_quota)}</td>
                        <td className={`p-2 font-semibold ${isHigh ? "text-red-600" : "text-green-600"}`}>
                          {percentage}%
                        </td>
                        <td className="p-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div
                              className={`h-2 rounded-full transition-all ${isHigh ? "bg-red-600" : "bg-green-600"}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>총 {storageData.length}명의 사용자</p>
                <p>전체 사용량: {formatBytes(storageData.reduce((sum, user) => sum + user.storage_used, 0))}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
