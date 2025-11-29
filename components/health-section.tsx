"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Edit2, Save } from "lucide-react"
import { saveHealthRecords, loadHealthRecords } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import { getTranslation } from "@/lib/i18n"
import type { HealthRecord, Language } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

interface HealthSectionProps {
  onBack: () => void
  language: Language
}

export function HealthSection({ onBack, language }: HealthSectionProps) {
  const { user } = useAuth()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    value: "",
    memo: "",
  })

  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const data = await loadHealthRecords(user.id)
      setRecords(data)
    } catch (err) {
      console.error("[v0] Error loading health records:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다")
      return
    }

    try {
      const record: HealthRecord = {
        id: editingRecord?.id || crypto.randomUUID(),
        date: formData.date,
        type: formData.type,
        value: formData.value,
        memo: formData.memo,
        user_id: user.id,
      }

      const updated = editingRecord
        ? records.map((r) => (r.id === editingRecord.id ? record : r))
        : [record, ...records]

      setRecords(updated)
      await saveHealthRecords(updated, user.id)

      setFormData({ date: new Date().toISOString().split("T")[0], type: "", value: "", memo: "" })
      setIsAdding(false)
      setEditingRecord(null)
      alert("저장되었습니다")
    } catch (err) {
      console.error("[v0] Error saving health record:", err)
      alert("저장 실패")
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const updated = records.filter((r) => r.id !== id)
      setRecords(updated)
      await saveHealthRecords(updated, user.id)
      alert("삭제되었습니다")
    } catch (err) {
      console.error("[v0] Error deleting health record:", err)
      alert("삭제 실패")
    }
  }

  const handleEdit = (record: HealthRecord) => {
    setEditingRecord(record)
    setFormData({
      date: record.date,
      type: record.type,
      value: record.value,
      memo: record.memo || "",
    })
    setIsAdding(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (isAdding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setIsAdding(false)
            setEditingRecord(null)
            setFormData({ date: new Date().toISOString().split("T")[0], type: "", value: "", memo: "" })
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("health")}
        </Button>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t("date")}</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("type")}</label>
            <Input
              placeholder={t("type")}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("value")}</label>
            <Input
              placeholder={t("value")}
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("memo")}</label>
            <Input
              placeholder={t("memo")}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700" size="lg">
            <Save className="mr-2 h-4 w-4" />
            {editingRecord ? t("edit") : t("save")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("health")}
        </Button>
        <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> {t("add")}
        </Button>
      </div>

      <div className="grid gap-4">
        {records.map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold">
                  {record.date} - {record.type}
                </p>
                <p className="text-sm text-muted-foreground">{record.value}</p>
                {record.memo && <p className="text-xs text-muted-foreground mt-1">{record.memo}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {records.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t("no_health_records")}</div>
        )}
      </div>
    </div>
  )
}
