"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, BookOpen, Calendar, Plane, Car, Heart, TrendingUp, Wallet, Activity } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  loadNotes,
  loadDiaries,
  loadSchedules,
  loadTravelRecords,
  loadVehicleRecords,
  loadHealthRecords,
  loadBudgetTransactions,
  loadMedications,
} from "@/lib/storage"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function StatisticsSection({ onBack, language }: { onBack: () => void; language: string }) {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    notes: 0,
    diaries: 0,
    schedules: 0,
    travels: 0,
    vehicles: 0,
    health: 0,
    total: 0,
  })
  const [monthlyActivity, setMonthlyActivity] = useState<any[]>([])
  const [budgetSummary, setBudgetSummary] = useState({ income: 0, expense: 0, balance: 0 })
  const [healthTrends, setHealthTrends] = useState<any[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllStats()
  }, [user])

  const loadAllStats = async () => {
    setLoading(true)
    try {
      if (!user?.id) {
        return
      }

      const [notes, diaries, schedules, travels, vehicles, health, budgetTransactions, medications] = await Promise.all(
        [
          loadNotes(user.id),
          loadDiaries(user.id),
          loadSchedules(user.id),
          loadTravelRecords(user.id),
          loadVehicleRecords(user.id),
          loadHealthRecords(user.id),
          loadBudgetTransactions(user.id),
          loadMedications(user.id),
        ],
      )

      const total = notes.length + diaries.length + schedules.length + travels.length + vehicles.length + health.length

      setStats({
        notes: notes.length,
        diaries: diaries.length,
        schedules: schedules.length,
        travels: travels.length,
        vehicles: vehicles.length,
        health: health.length,
        total,
      })

      const monthlyData = calculateMonthlyActivity(notes, diaries, schedules)
      setMonthlyActivity(monthlyData)

      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      const currentMonthTransactions = budgetTransactions.filter((t: any) => t.date.startsWith(currentMonth))

      const income = currentMonthTransactions
        .filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + t.amount, 0)

      const expense = currentMonthTransactions
        .filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + t.amount, 0)

      setBudgetSummary({ income, expense, balance: income - expense })

      const healthData = calculateHealthTrends(health)
      setHealthTrends(healthData)

      const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"]

      const distribution = [
        { name: getText("notes"), value: notes.length, fill: CHART_COLORS[0] },
        { name: getText("diary"), value: diaries.length, fill: CHART_COLORS[1] },
        { name: getText("schedule"), value: schedules.length, fill: CHART_COLORS[2] },
        { name: getText("travel"), value: travels.length, fill: CHART_COLORS[3] },
        { name: getText("vehicle"), value: vehicles.length, fill: CHART_COLORS[4] },
        { name: getText("health"), value: health.length, fill: CHART_COLORS[5] },
      ].filter((item) => item.value > 0)

      setCategoryDistribution(distribution)
    } catch (err) {
      console.error("[v0] Error loading statistics:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyActivity = (notes: any[], diaries: any[], schedules: any[]) => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", { month: "short" })

      const notesCount = notes.filter((n: any) => n.createdAt?.startsWith(monthKey)).length
      const diariesCount = diaries.filter((d: any) => d.createdAt?.startsWith(monthKey)).length
      const schedulesCount = schedules.filter((s: any) => s.date?.startsWith(monthKey)).length

      months.push({
        month: monthName,
        notes: notesCount,
        diaries: diariesCount,
        schedules: schedulesCount,
        total: notesCount + diariesCount + schedulesCount,
      })
    }

    return months
  }

  const calculateHealthTrends = (health: any[]) => {
    const trends: { [key: string]: { weight?: number; steps?: number; date: string } } = {}

    health.forEach((record: any) => {
      const date = record.date
      if (!trends[date]) {
        trends[date] = { date }
      }
      if (record.weight) trends[date].weight = record.weight
      if (record.steps) trends[date].steps = record.steps
    })

    return Object.values(trends)
      .slice(-30)
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const lang = language as Language

  const getText = (key: string) => {
    const translations: { [key: string]: { [lang in Language]: string } } = {
      notes: { ko: "노트", en: "Notes", zh: "笔记", ja: "ノート" },
      diary: { ko: "일기", en: "Diary", zh: "日记", ja: "日記" },
      schedule: { ko: "일정", en: "Schedule", zh: "日程", ja: "スケジュール" },
      travel: { ko: "여행", en: "Travel", zh: "旅行", ja: "旅行" },
      vehicle: { ko: "차량", en: "Vehicle", zh: "车辆", ja: "車両" },
      health: { ko: "건강", en: "Health", zh: "健康", ja: "健康" },
      monthlyActivity: { ko: "월별 활동", en: "Monthly Activity", zh: "月度活动", ja: "月別活動" },
      budgetThisMonth: { ko: "이번 달 가계부", en: "This Month's Budget", zh: "本月预算", ja: "今月の予算" },
      income: { ko: "수입", en: "Income", zh: "收入", ja: "収入" },
      expense: { ko: "지출", en: "Expense", zh: "支出", ja: "支出" },
      balance: { ko: "잔액", en: "Balance", zh: "余额", ja: "残高" },
      healthTrends: { ko: "건강 추이", en: "Health Trends", zh: "健康趋势", ja: "健康トレンド" },
      categoryDistribution: { ko: "카테고리 분포", en: "Category Distribution", zh: "类别分布", ja: "カテゴリー分布" },
      weight: { ko: "체중", en: "Weight", zh: "体重", ja: "体重" },
      steps: { ko: "걸음수", en: "Steps", zh: "步数", ja: "歩数" },
      total_records: { ko: "전체 기록", en: "Total Records", zh: "总记录", ja: "総記録" },
      precious_memories: { ko: "귀중한 추억", en: "Precious Memories", zh: "珍贵的回忆", ja: "貴重な思い出" },
      loading_stats: {
        ko: "통계 로딩 중...",
        en: "Loading Statistics...",
        zh: "加载统计中...",
        ja: "統計を読み込んでいます...",
      },
    }
    return translations[key]?.[lang] || getTranslation(lang, key)
  }

  const statCards = [
    { icon: FileText, label: getText("notes"), count: stats.notes, color: "bg-emerald-500" },
    { icon: BookOpen, label: getText("diary"), count: stats.diaries, color: "bg-green-500" },
    { icon: Calendar, label: getText("schedule"), count: stats.schedules, color: "bg-teal-500" },
    { icon: Plane, label: getText("travel"), count: stats.travels, color: "bg-cyan-500" },
    { icon: Car, label: getText("vehicle"), count: stats.vehicles, color: "bg-blue-500" },
    { icon: Heart, label: getText("health"), count: stats.health, color: "bg-rose-500" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "ko" ? "ko-KR" : "en-US", {
      style: "currency",
      currency: language === "ko" ? "KRW" : "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> {getTranslation(lang, "back_to_forest")}
      </Button>

      <Card className="p-6 bg-card">
        <h2 className="text-2xl font-bold mb-6">{getTranslation(lang, "statistics")}</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4 text-muted-foreground">{getTranslation(lang, "loading_stats")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total */}
            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">{getTranslation(lang, "total_records")}</p>
                <p className="text-5xl font-bold mt-2">{stats.total}</p>
                <p className="text-sm mt-2 opacity-75">{getTranslation(lang, "precious_memories")}</p>
              </div>
            </Card>

            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statCards.map((stat) => (
                <Card key={stat.label} className="p-4 bg-card">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} p-3 rounded-lg text-white`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.count}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Monthly Activity Chart */}
            {monthlyActivity.length > 0 && (
              <Card className="p-6 bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold">{getText("monthlyActivity")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="notes" fill="#10b981" name={getText("notes")} />
                    <Bar dataKey="diaries" fill="#22c55e" name={getText("diary")} />
                    <Bar dataKey="schedules" fill="#14b8a6" name={getText("schedule")} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Budget Summary */}
            <Card className="p-6 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{getText("budgetThisMonth")}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{getText("income")}</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600 break-words">
                    {formatCurrency(budgetSummary.income)}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{getText("expense")}</p>
                  <p className="text-xl md:text-2xl font-bold text-red-600 break-words">
                    {formatCurrency(budgetSummary.expense)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{getText("balance")}</p>
                  <p
                    className={`text-xl md:text-2xl font-bold break-words ${budgetSummary.balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {formatCurrency(budgetSummary.balance)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Health Trends */}
            {healthTrends.length > 0 && (healthTrends.some((d) => d.weight) || healthTrends.some((d) => d.steps)) && (
              <Card className="p-6 bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-rose-600" />
                  <h3 className="text-lg font-semibold">{getText("healthTrends")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => date.split("-")[2]} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    {healthTrends.some((d) => d.weight) && (
                      <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#f43f5e" name={getText("weight")} />
                    )}
                    {healthTrends.some((d) => d.steps) && (
                      <Line yAxisId="right" type="monotone" dataKey="steps" stroke="#3b82f6" name={getText("steps")} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Category Distribution */}
            {categoryDistribution.length > 0 && (
              <Card className="p-6 bg-card">
                <h3 className="text-lg font-semibold mb-4">{getText("categoryDistribution")}</h3>
                <ResponsiveContainer width="100%" height={450}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      innerRadius={0}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                  {categoryDistribution.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border-2"
                      style={{ borderColor: entry.fill, backgroundColor: `${entry.fill}15` }}
                    >
                      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.fill }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold block truncate">{entry.name}</span>
                        <span className="text-xs text-muted-foreground">{entry.value}개</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
