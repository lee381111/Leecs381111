"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { generateDataDeletionReport } from "@/lib/storage"

interface ConsentLog {
  id: string
  user_id: string
  terms_version: string
  privacy_version: string
  agreed_at: string
  user_agent: string | null
  email?: string
}

export default function AdminConsentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [consents, setConsents] = useState<ConsentLog[]>([])
  const [generating, setGenerating] = useState(false)

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
    const supabase = createClient()

    console.log("[v0] Loading all user consents...")

    const { data: consentsData, error: consentsError } = await supabase
      .from("user_consents")
      .select("*")
      .order("agreed_at", { ascending: false })

    if (consentsError) {
      console.error("[v0] Error loading consents:", consentsError)
      return
    }

    console.log("[v0] Found consent records:", consentsData?.length)

    if (consentsData && consentsData.length > 0) {
      const consentsWithEmails = consentsData.map((c: ConsentLog) => ({
        ...c,
        email: c.user_id.slice(0, 13) + "...", // Show first 13 chars of user_id
      }))

      console.log("[v0] Displaying all consent records:", consentsWithEmails.length)
      setConsents(consentsWithEmails)
    }
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
                      <td className="p-2 font-mono text-xs">{consent.email}</td>
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
    </div>
  )
}
