"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Wallet, Trash2, Edit2, PieChart, Lock, Unlock } from "lucide-react"
import type { Language, BudgetTransaction } from "@/lib/types"
import { saveBudgetTransactions, loadBudgetTransactions } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"

interface BudgetSectionProps {
  onBack: () => void
  language: Language
}

const incomeCategories = ["급여", "부업", "투자", "상여금", "기타수입"]
const expenseCategories = [
  "식비",
  "교통비",
  "주거비",
  "의료비",
  "통신비",
  "쇼핑",
  "여가",
  "교육",
  "보험",
  "대출이자",
  "차량유지비",
  "여행",
  "기타지출",
]

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function BudgetSection({ onBack, language }: BudgetSectionProps) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([])
  const [view, setView] = useState<"list" | "add" | "edit" | "stats" | "setPassword" | "main">("main")
  const [editingTransaction, setEditingTransaction] = useState<BudgetTransaction | null>(null)
  const [statsView, setStatsView] = useState<"current" | "comparison">("current")

  const [isLocked, setIsLocked] = useState(true)
  const [password, setPassword] = useState("")
  const [passwordSet, setPasswordSet] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  })

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const savedPasswordSkipped = localStorage.getItem("budget_password_skipped")
    if (savedPasswordSkipped === "true") {
      setPasswordSet(true)
      setIsLocked(false)
    } else {
      setView("main")
    }
  }, [])

  useEffect(() => {
    if (user && passwordSet && !isLocked) {
      loadTransactions()
    }
  }, [user, passwordSet, isLocked])

  const loadTransactions = async () => {
    if (!user) return
    try {
      setLoading(true)
      const loaded = await loadBudgetTransactions(user.id)
      setTransactions(loaded)
    } catch (error) {
      console.error("[v0] Failed to load transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async () => {
    if (!password || password.length < 4) {
      alert(getText("password_too_short") || "비밀번호는 최소 4자 이상이어야 합니다")
      return
    }
    if (password !== confirmPassword) {
      alert(getText("password_mismatch") || "비밀번호가 일치하지 않습니다")
      return
    }

    const hash = await hashPassword(password)
    localStorage.setItem("budget_password_hash", hash)
    setPasswordSet(true)
    setIsLocked(false)
    setPassword("")
    setConfirmPassword("")
    alert(getText("password_set") || "가계부 비밀번호가 설정되었습니다")
  }

  const handleUnlock = async () => {
    if (!password) {
      alert(getText("enter_password") || "비밀번호를 입력하세요")
      return
    }

    const savedHash = localStorage.getItem("budget_password_hash")
    const inputHash = await hashPassword(password)

    if (inputHash === savedHash) {
      setIsLocked(false)
      setPassword("")
      alert(getText("unlocked") || "잠금이 해제되었습니다")
    } else {
      alert(getText("wrong_password") || "비밀번호가 틀렸습니다")
      setPassword("")
    }
  }

  const handleSave = async () => {
    if (!user || !formData.category || !formData.amount) return

    const newTransaction: BudgetTransaction = {
      id: editingTransaction?.id || crypto.randomUUID(),
      type: formData.type,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      description: formData.description || "",
      createdAt: editingTransaction?.createdAt || new Date().toISOString(),
      user_id: user.id,
    }

    const updated = editingTransaction
      ? transactions.map((t) => (t.id === editingTransaction.id ? newTransaction : t))
      : [...transactions, newTransaction]

    try {
      await saveBudgetTransactions(updated, user.id)
      setTransactions(updated)
      setView("list")
      resetForm()
    } catch (error) {
      console.error("[v0] Failed to save transaction:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    const updated = transactions.filter((t) => t.id !== id)
    try {
      await saveBudgetTransactions(updated, user.id)
      setTransactions(updated)
    } catch (error) {
      console.error("[v0] Failed to delete transaction:", error)
    }
  }

  const handleEdit = (transaction: BudgetTransaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description || "",
    })
    setView("edit")
  }

  const resetForm = () => {
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    })
    setEditingTransaction(null)
  }

  const getText = (key: string) => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      budget: { ko: "가계부", en: "Budget", zh: "家庭账本", ja: "家計簿" },
      back: { ko: "뒤로", en: "Back", zh: "返回", ja: "戻る" },
      add: { ko: "추가", en: "Add", zh: "添加", ja: "追加" },
      edit: { ko: "수정", en: "Edit", zh: "编辑", ja: "編集" },
      stats: { ko: "통계", en: "Statistics", zh: "统计", ja: "統計" },
      income: { ko: "수입", en: "Income", zh: "收入", ja: "収入" },
      expense: { ko: "지출", en: "Expense", zh: "支出", ja: "支出" },
      category: { ko: "카테고리", en: "Category", zh: "类别", ja: "カテゴリ" },
      amount: { ko: "금액", en: "Amount", zh: "金额", ja: "金額" },
      date: { ko: "날짜", en: "Date", zh: "日期", ja: "日付" },
      description: { ko: "설명", en: "Description", zh: "说明", ja: "説明" },
      save: { ko: "저장", en: "Save", zh: "保存", ja: "保存" },
      cancel: { ko: "취소", en: "Cancel", zh: "取消", ja: "キャンセル" },
      monthlyTotal: { ko: "이번 달 합계", en: "This Month", zh: "本月合计", ja: "今月の合計" },
      balance: { ko: "잔액", en: "Balance", zh: "余额", ja: "残高" },
      noTransactions: { ko: "거래 내역이 없습니다", en: "No transactions", zh: "无交易记录", ja: "取引履歴なし" },
      급여: { ko: "급여", en: "Salary", zh: "工资", ja: "給与" },
      부업: { ko: "부업", en: "Side Job", zh: "副业", ja: "副業" },
      투자: { ko: "투자", en: "Investment", zh: "投资", ja: "投資" },
      상여금: { ko: "상여금", en: "Bonus", zh: "奖金", ja: "ボーナス" },
      기타수입: { ko: "기타수입", en: "Other Income", zh: "其他收入", ja: "その他収入" },
      식비: { ko: "식비", en: "Food", zh: "餐饮费", ja: "食費" },
      교통비: { ko: "교통비", en: "Transport", zh: "交通费", ja: "交通費" },
      주거비: { ko: "주거비", en: "Housing", zh: "住房费", ja: "住居費" },
      의료비: { ko: "의료비", en: "Medical", zh: "医疗费", ja: "医療費" },
      통신비: { ko: "통신비", en: "Telecom", zh: "通讯费", ja: "通信費" },
      쇼핑: { ko: "쇼핑", en: "Shopping", zh: "购物", ja: "買い物" },
      여가: { ko: "여가", en: "Leisure", zh: "休闲", ja: "レジャー" },
      교육: { ko: "교육", en: "Education", zh: "教育", ja: "教育" },
      보험: { ko: "보험", en: "Insurance", zh: "保险", ja: "保険" },
      대출이자: { ko: "대출이자", en: "Loan Interest", zh: "贷款利息", ja: "ローン利息" },
      차량유지비: { ko: "차량유지비", en: "Vehicle Maintenance", zh: "车辆维护", ja: "車両維持費" },
      여행: { ko: "여행", en: "Travel", zh: "旅行", ja: "旅行" },
      기타지출: { ko: "기타지출", en: "Other Expense", zh: "其他支出", ja: "その他支出" },
      currentMonth: { ko: "이번 달", en: "Current Month", zh: "本月", ja: "今月" },
      monthlyComparison: { ko: "월별 비교", en: "Monthly Comparison", zh: "月度对比", ja: "月別比較" },
      monthlyTrend: { ko: "월별 추이", en: "Monthly Trend", zh: "月度趋势", ja: "月別推移" },
      month: { ko: "월", en: "", zh: "月", ja: "月" },
      sixMonthSummary: { ko: "12개월 요약", en: "12-Month Summary", zh: "12个月总结", ja: "12ヶ月集計" },
      totalIncome: { ko: "총 수입", en: "Total Income", zh: "总收入", ja: "総収入" },
      totalExpense: { ko: "총 지출", en: "Total Expense", zh: "总支出", ja: "総支出" },
      password_too_short: {
        ko: "비밀번호는 최소 4자 이상이어야 합니다",
        en: "Password must be at least 4 characters",
        zh: "密码至少4个字符",
        ja: "パスワードは4文字以上必要です",
      },
      password_mismatch: {
        ko: "비밀번호가 일치하지 않습니다",
        en: "Passwords do not match",
        zh: "密码不匹配",
        ja: "パスワードが一致しません",
      },
      password_set: {
        ko: "가계부 비밀번호가 설정되었습니다",
        en: "Budget password set",
        zh: "家庭账本密码已设置",
        ja: "家計簿パスワードが設定されました",
      },
      enter_password: {
        ko: "비밀번호를 입력하세요",
        en: "Enter password",
        zh: "请输入密码",
        ja: "パスワードを入力してください",
      },
      unlocked: { ko: "잠금이 해제되었습니다", en: "Unlocked", zh: "已解锁", ja: "ロック解除されました" },
      wrong_password: {
        ko: "비밀번호가 틀렸습니다",
        en: "Wrong password",
        zh: "密码错误",
        ja: "パスワードが間違っています",
      },
      set_budget_password: {
        ko: "가계부 비밀번호 설정",
        en: "Set Budget Password",
        zh: "设置家庭账本密码",
        ja: "家計簿パスワード設定",
      },
      password_description: {
        ko: "가계부를 보호하기 위한 비밀번호를 설정하세요",
        en: "Set a password to protect your budget",
        zh: "设置密码以保护您的家庭账本",
        ja: "家計簿を保護するためのパスワードを設定してください",
      },
      new_password: { ko: "비밀번호", en: "Password", zh: "密码", ja: "パスワード" },
      confirm_password: { ko: "비밀번호 확인", en: "Confirm Password", zh: "确认密码", ja: "パスワード確認" },
      password_placeholder: { ko: "최소 4자 이상", en: "Min 4 characters", zh: "至少4个字符", ja: "最低4文字" },
      confirm_password_placeholder: {
        ko: "비밀번호 재입력",
        en: "Re-enter password",
        zh: "重新输入密码",
        ja: "パスワード再入力",
      },
      set_password: { ko: "비밀번호 설정", en: "Set Password", zh: "设置密码", ja: "パスワード設定" },
      password_optional: { ko: "(선택사항)", en: "(Optional)", zh: "(可选)", ja: "(オプション)" },
      skip: { ko: "건너뛰기", en: "Skip", zh: "跳过", ja: "スキップ" },
      locked_budget: { ko: "잠긴 가계부", en: "Locked Budget", zh: "锁定的家庭账本", ja: "ロックされた家計簿" },
      enter_password_to_unlock: {
        ko: "비밀번호를 입력하여 가계부를 확인하세요",
        en: "Enter password to unlock budget",
        zh: "输入密码以解锁家庭账本",
        ja: "パスワードを入力して家計簿を表示",
      },
      password: { ko: "비밀번호", en: "Password", zh: "密码", ja: "パスワード" },
      unlock: { ko: "잠금 해제", en: "Unlock", zh: "解锁", ja: "ロック解除" },
      lock_budget: { ko: "가계부 잠그기", en: "Lock Budget", zh: "锁定家庭账本", ja: "家計簿をロック" },
      select_category: {
        ko: "선택하세요",
        en: "Select category",
        zh: "请选择",
        ja: "選択してください",
      },
      memo_optional: {
        ko: "메모 (선택사항)",
        en: "Memo (optional)",
        zh: "备注（可选）",
        ja: "メモ（オプション）",
      },
      krw_unit: { ko: "원", en: "$", zh: "元", ja: "円" },
      krw: { ko: "원", en: "$", zh: "元", ja: "円" },
      year: { ko: "년", en: "", zh: "年", ja: "年" },
    }
    return translations[key]?.[language] || key
  }

  const saveData = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString())
  }

  if (!passwordSet && view === "main") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="p-6 border-2 border-yellow-500 dark:border-yellow-400">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              {getText("set_password")} {getText("password_optional")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {language === "ko" && "가계부 보호를 위해 비밀번호를 설정하시겠습니까?"}
              {language === "en" && "Would you like to set a password to protect your budget?"}
              {language === "zh" && "您想设置密码来保护家庭账本吗？"}
              {language === "ja" && "家計簿を保護するためにパスワードを設定しますか？"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  setPasswordSet(true)
                  saveData("budget_password_skipped", true)
                }}
                variant="outline"
              >
                {getText("skip")}
              </Button>
              <Button onClick={() => setView("setPassword")}>{getText("set_password")}</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (view === "setPassword") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="h-12 w-12 mx-auto text-emerald-600" />
            <h2 className="text-2xl font-bold">{getText("set_budget_password")}</h2>
            <p className="text-sm text-muted-foreground">{getText("password_description")}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{getText("new_password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={getText("password_placeholder")}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{getText("confirm_password")}</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={getText("confirm_password_placeholder")}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSetPassword} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                {getText("set_password")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPasswordSet(true)
                  saveData("budget_password_skipped", true)
                  onBack()
                }}
                className="flex-1"
              >
                {getText("skip")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="h-12 w-12 mx-auto text-emerald-600" />
            <h2 className="text-2xl font-bold">{getText("locked_budget")}</h2>
            <p className="text-sm text-muted-foreground">{getText("enter_password_to_unlock")}</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={getText("password")}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleUnlock()
              }}
            />
            <div className="flex gap-2">
              <Button onClick={handleUnlock} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Unlock className="mr-2 h-4 w-4" /> {getText("unlock")}
              </Button>
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                {getText("cancel")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth))
  const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpense = monthlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const monthlyBalance = monthlyIncome - monthlyExpense

  const getMonthlyData = () => {
    const months = []

    for (let month = 0; month < 12; month++) {
      const monthStr = `${selectedYear}-${String(month + 1).padStart(2, "0")}`

      const monthTransactions = transactions.filter((t) => {
        // Extract YYYY-MM from transaction date regardless of format
        const txDate = t.date.substring(0, 7)
        return txDate === monthStr
      })

      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const expense = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      months.push({
        month: monthStr,
        displayMonth: `${month + 1}${getText("month")}`,
        income,
        expense,
        balance: income - expense,
      })
    }
    return months
  }

  const monthlyData = getMonthlyData()
  const maxAmount = Math.max(...monthlyData.flatMap((m) => [m.income, m.expense]))

  if (view === "add" || view === "edit") {
    const categories = formData.type === "income" ? incomeCategories : expenseCategories

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => {
                setView("list")
                resetForm()
              }}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
              {view === "edit" ? getText("edit") : getText("add")}
            </h2>
          </div>

          <Card className="p-6 space-y-4 dark:bg-card">
            <div>
              <label className="block text-sm font-medium mb-2">
                {getText("income")}/{getText("expense")}
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                  variant={formData.type === "income" ? "default" : "outline"}
                  className={formData.type === "income" ? "bg-emerald-600" : ""}
                >
                  {getText("income")}
                </Button>
                <Button
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                  variant={formData.type === "expense" ? "default" : "outline"}
                  className={formData.type === "expense" ? "bg-rose-600" : ""}
                >
                  {getText("expense")}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{getText("category")}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">{getText("select_category")}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getText(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{getText("amount")}</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{getText("date")}</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{getText("description")}</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={getText("memo_optional")}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                {getText("save")}
              </Button>
              <Button
                onClick={() => {
                  setView("list")
                  resetForm()
                }}
                variant="outline"
                className="flex-1"
              >
                {getText("cancel")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (view === "stats") {
    const categoryExpenses = expenseCategories
      .map((cat) => ({
        category: cat,
        amount: monthlyTransactions
          .filter((t) => t.type === "expense" && t.category === cat)
          .reduce((sum, t) => sum + t.amount, 0),
      }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => setView("list")} variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{getText("stats")}</h2>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setStatsView("current")}
              variant={statsView === "current" ? "default" : "outline"}
              className={statsView === "current" ? "bg-emerald-600" : ""}
            >
              {getText("currentMonth")}
            </Button>
            <Button
              onClick={() => setStatsView("comparison")}
              variant={statsView === "comparison" ? "default" : "outline"}
              className={statsView === "comparison" ? "bg-emerald-600" : ""}
            >
              {getText("monthlyComparison")}
            </Button>
          </div>

          <div className="space-y-4">
            {statsView === "current" ? (
              <>
                <Card className="p-4 dark:bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{getText("income")}</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <span>+{monthlyIncome.toLocaleString()}</span>
                        <span>{getText("krw_unit")}</span>
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{getText("expense")}</span>
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-300">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <span>-{monthlyExpense.toLocaleString()}</span>
                        <span>{getText("krw_unit")}</span>
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                    <span className="text-sm font-medium">{getText("balance")}</span>
                    <span
                      className={`text-xl font-bold ${monthlyBalance >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
                    >
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <span>{monthlyBalance.toLocaleString()}</span>
                        <span>{getText("krw_unit")}</span>
                      </span>
                    </span>
                  </div>
                </Card>

                <Card className="p-4 dark:bg-card">
                  <h3 className="font-semibold mb-4">{getText("category")}</h3>
                  {categoryExpenses.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">{getText("noTransactions")}</p>
                  ) : (
                    <div className="space-y-3">
                      {categoryExpenses.map(({ category, amount }) => {
                        const percentage = monthlyExpense > 0 ? (amount / monthlyExpense) * 100 : 0
                        return (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{getText(category)}</span>
                              <span className="text-sm font-medium">
                                {amount.toLocaleString()} {getText("krw_unit")} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-rose-500 dark:bg-rose-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <>
                <Card className="p-4 dark:bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{getText("monthlyTrend")}</h3>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
                      className="px-3 py-1 border rounded text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>
                          {year} {getText("year")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    {monthlyData.map(({ month, displayMonth, income, expense, balance }) => (
                      <div key={month} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{displayMonth}</span>
                          <span
                            className={`text-sm font-bold ${balance >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
                          >
                            {balance.toLocaleString()} {getText("krw_unit")}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-12">{getText("income")}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-500 dark:bg-emerald-600 h-2 rounded-full transition-all"
                                style={{ width: maxAmount > 0 ? `${(income / maxAmount) * 100}%` : "0%" }}
                              />
                            </div>
                            <span className="text-xs text-emerald-600 dark:text-emerald-300 w-20 text-right">
                              {income.toLocaleString()} {getText("krw_unit")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-12">{getText("expense")}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-rose-500 dark:bg-rose-600 h-2 rounded-full transition-all"
                                style={{ width: maxAmount > 0 ? `${(expense / maxAmount) * 100}%` : "0%" }}
                              />
                            </div>
                            <span className="text-xs text-rose-600 dark:text-rose-300 w-20 text-right">
                              {expense.toLocaleString()} {getText("krw_unit")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 dark:bg-card">
                  <h3 className="font-semibold mb-4">{getText("sixMonthSummary")}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{getText("totalIncome")}</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
                        +{monthlyData.reduce((sum, m) => sum + m.income, 0).toLocaleString()} {getText("krw_unit")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{getText("totalExpense")}</span>
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-300">
                        -{monthlyData.reduce((sum, m) => sum + m.expense, 0).toLocaleString()} {getText("krw_unit")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                      <span className="text-sm font-medium">{getText("balance")}</span>
                      <span
                        className={`text-xl font-bold ${
                          monthlyData.reduce((sum, m) => sum + m.balance, 0) >= 0
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-rose-600 dark:text-rose-300"
                        }`}
                      >
                        {monthlyData.reduce((sum, m) => sum + m.balance, 0).toLocaleString()} {getText("krw_unit")}
                      </span>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{getText("budget")}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsLocked(true)} title={getText("lock_budget")}>
              <Lock className="h-4 w-4" />
            </Button>
            <Button onClick={() => setView("stats")} variant="outline" size="sm">
              <PieChart className="h-4 w-4" />
            </Button>
            <Button onClick={() => setView("add")} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" /> {getText("add")}
            </Button>
          </div>
        </div>

        <Card className="p-4 mb-4 dark:bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{getText("monthlyTotal")}</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{getText("income")}</span>
              </div>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span>+{monthlyIncome.toLocaleString()}</span>
                  <span>{getText("krw_unit")}</span>
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{getText("expense")}</span>
              </div>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-300">
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span>-{monthlyExpense.toLocaleString()}</span>
                  <span>{getText("krw_unit")}</span>
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{getText("balance")}</span>
              </div>
              <p
                className={`text-lg font-bold ${monthlyBalance >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
              >
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span>{monthlyBalance.toLocaleString()}</span>
                  <span>{getText("krw_unit")}</span>
                </span>
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          {monthlyTransactions.length === 0 ? (
            <Card className="p-8 text-center dark:bg-card">
              <p className="text-muted-foreground dark:text-gray-400">{getText("noTransactions")}</p>
            </Card>
          ) : (
            monthlyTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <Card key={transaction.id} className="p-4 dark:bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{getText(transaction.category)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-lg font-bold flex items-baseline gap-1 ${
                          transaction.type === "income"
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-rose-600 dark:text-rose-300"
                        }`}
                      >
                        <span className="whitespace-nowrap">
                          {transaction.type === "income" ? "+" : "-"}
                          {transaction.amount.toLocaleString()}
                        </span>
                        <span className="whitespace-nowrap">{getText("krw_unit")}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEdit(transaction)} variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(transaction.id)} variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
