import type { Language } from "./types"

type TranslationKey = string

const translations: Record<Language, Record<TranslationKey, string>> = {
  ko: {
    // Common
    title: "기록의 숲",
    loading: "로딩 중...",
    saving: "저장 중...",
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "수정",
    add: "추가",
    search: "검색",
    all: "전체",
    date: "날짜",

    // Sections
    notes: "노트",
    diary: "일기",
    schedule: "일정",
    health: "건강",
    travel: "여행",
    vehicle: "차량",
    budget: "가계부",
    business_card: "명함",
    radio: "라디오",
    weather: "날씨",
    statistics: "통계",
    settings: "설정",

    // Notes
    title_required: "제목을 입력해주세요",
    content: "내용",
    tags_placeholder: "태그 (쉼표로 구분)",
    attached_files: "첨부파일",
    filter_by_tag: "태그로 필터",

    // Common actions
    back: "뒤로가기",
  },
  en: {
    // Common
    title: "Forest of Records",
    loading: "Loading...",
    saving: "Saving...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    all: "All",
    date: "Date",

    // Sections
    notes: "Notes",
    diary: "Diary",
    schedule: "Schedule",
    health: "Health",
    travel: "Travel",
    vehicle: "Vehicle",
    budget: "Budget",
    business_card: "Business Card",
    radio: "Radio",
    weather: "Weather",
    statistics: "Statistics",
    settings: "Settings",

    // Notes
    title_required: "Please enter a title",
    content: "Content",
    tags_placeholder: "Tags (comma separated)",
    attached_files: "Attached Files",
    filter_by_tag: "Filter by tag",

    // Common actions
    back: "Back",
  },
  zh: {
    // Common
    title: "记录之森",
    loading: "加载中...",
    saving: "保存中...",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    search: "搜索",
    all: "全部",
    date: "日期",

    // Sections
    notes: "笔记",
    diary: "日记",
    schedule: "日程",
    health: "健康",
    travel: "旅行",
    vehicle: "车辆",
    budget: "账本",
    business_card: "名片",
    radio: "广播",
    weather: "天气",
    statistics: "统计",
    settings: "设置",

    // Notes
    title_required: "请输入标题",
    content: "内容",
    tags_placeholder: "标签（逗号分隔）",
    attached_files: "附件",
    filter_by_tag: "按标签筛选",

    // Common actions
    back: "返回",
  },
  ja: {
    // Common
    title: "記録の森",
    loading: "読み込み中...",
    saving: "保存中...",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    add: "追加",
    search: "検索",
    all: "すべて",
    date: "日付",

    // Sections
    notes: "ノート",
    diary: "日記",
    schedule: "スケジュール",
    health: "健康",
    travel: "旅行",
    vehicle: "車両",
    budget: "家計簿",
    business_card: "名刺",
    radio: "ラジオ",
    weather: "天気",
    statistics: "統計",
    settings: "設定",

    // Notes
    title_required: "タイトルを入力してください",
    content: "内容",
    tags_placeholder: "タグ（カンマ区切り）",
    attached_files: "添付ファイル",
    filter_by_tag: "タグでフィルター",

    // Common actions
    back: "戻る",
  },
}

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language]?.[key] || translations.ko[key] || key
}
