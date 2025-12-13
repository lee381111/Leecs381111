"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "ko" | "en" | "zh" | "ja"

type TranslationKey = string

type Translations = {
  [key in TranslationKey]: {
    ko: string
    en: string
    zh: string
    ja: string
  }
}

const translations: Translations = {
  appTitle: {
    ko: "개인 정리 앱",
    en: "Personal Organizer",
    zh: "个人管理应用",
    ja: "個人管理アプリ",
  },
  appDescription: {
    ko: "일정, 약물, 일기, 목표, 연락처를 관리하세요",
    en: "Manage your schedule, medication, journal, goals, and contacts",
    zh: "管理您的日程、药物、日记、目标和联系人",
    ja: "スケジュール、薬、日記、目標、連絡先を管理",
  },
  enterMasterPassword: {
    ko: "앱 잠금 해제",
    en: "Unlock App",
    zh: "解锁应用",
    ja: "アプリのロック解除",
  },
  enterMasterPasswordDesc: {
    ko: "마스터 비밀번호를 입력하세요",
    en: "Please enter master password",
    zh: "请输入主密码",
    ja: "マスターパスワードを入力してください",
  },
  setMasterPassword: {
    ko: "마스터 비밀번호 설정",
    en: "Set Master Password",
    zh: "设置主密码",
    ja: "マスターパスワード設定",
  },
  setMasterPasswordDesc: {
    ko: "앱을 보호할 마스터 비밀번호를 설정하세요",
    en: "Set a master password to protect your app",
    zh: "设置主密码以保护您的应用",
    ja: "アプリを保護するマスターパスワードを設定",
  },
  masterPassword: {
    ko: "마스터 비밀번호",
    en: "Master Password",
    zh: "主密码",
    ja: "マスターパスワード",
  },
  confirmPassword: {
    ko: "비밀번호 확인",
    en: "Confirm Password",
    zh: "确认密码",
    ja: "パスワード確認",
  },
  unlock: {
    ko: "잠금 해제",
    en: "Unlock",
    zh: "解锁",
    ja: "ロック解除",
  },
  setPassword: {
    ko: "비밀번호 설정",
    en: "Set Password",
    zh: "设置密码",
    ja: "パスワード設定",
  },
  pleaseEnterPassword: {
    ko: "비밀번호를 입력하세요",
    en: "Please enter password",
    zh: "请输入密码",
    ja: "パスワードを入力してください",
  },
  incorrectPassword: {
    ko: "비밀번호가 올바르지 않습니다",
    en: "Incorrect password",
    zh: "密码不正确",
    ja: "パスワードが正しくありません",
  },
  passwordTooShort: {
    ko: "비밀번호는 최소 4자 이상이어야 합니다",
    en: "Password must be at least 4 characters",
    zh: "密码至少需要4个字符",
    ja: "パスワードは4文字以上である必要があります",
  },
  passwordsDoNotMatch: {
    ko: "비밀번호가 일치하지 않습니다",
    en: "Passwords do not match",
    zh: "密码不匹配",
    ja: "パスワードが一致しません",
  },
  login: {
    ko: "로그인",
    en: "Login",
    zh: "登录",
    ja: "ログイン",
  },
  signup: {
    ko: "회원가입",
    en: "Sign Up",
    zh: "注册",
    ja: "サインアップ",
  },
  email: {
    ko: "이메일",
    en: "Email",
    zh: "电子邮件",
    ja: "メール",
  },
  password: {
    ko: "비밀번호",
    en: "Password",
    zh: "密码",
    ja: "パスワード",
  },
  loginFailed: {
    ko: "로그인에 실패했습니다",
    en: "Login failed",
    zh: "登录失败",
    ja: "ログインに失敗しました",
  },
  signupFailed: {
    ko: "회원가입에 실패했습니다",
    en: "Sign up failed",
    zh: "注册失败",
    ja: "サインアップに失敗しました",
  },
  logout: {
    ko: "로그아웃",
    en: "Logout",
    zh: "登出",
    ja: "ログアウト",
  },
  medication: {
    ko: "약물",
    en: "Medication",
    zh: "药物",
    ja: "薬",
  },
  journal: {
    ko: "일기",
    en: "Journal",
    zh: "日记",
    ja: "日記",
  },
  goals: {
    ko: "목표",
    en: "Goals",
    zh: "目标",
    ja: "目標",
  },
  contacts: {
    ko: "연락처",
    en: "Contacts",
    zh: "联系人",
    ja: "連絡先",
  },
  settings: {
    ko: "설정",
    en: "Settings",
    zh: "设置",
    ja: "設定",
  },
  language: {
    ko: "언어",
    en: "Language",
    zh: "语言",
    ja: "言語",
  },
  scheduleEmpty: {
    ko: "일정이 없습니다",
    en: "No schedules",
    zh: "没有日程",
    ja: "スケジュールがありません",
  },
  medicationEmpty: {
    ko: "약물 정보가 없습니다",
    en: "No medications",
    zh: "没有药物信息",
    ja: "薬の情報がありません",
  },
  journalEmpty: {
    ko: "일기가 없습니다",
    en: "No journal entries",
    zh: "没有日记",
    ja: "日記がありません",
  },
  goalsEmpty: {
    ko: "목표가 없습니다",
    en: "No goals",
    zh: "没有目标",
    ja: "目標がありません",
  },
  contactsEmpty: {
    ko: "연락처가 없습니다",
    en: "No contacts",
    zh: "没有联系人",
    ja: "連絡先がありません",
  },
  userGuideTitle: {
    ko: "사용 가이드",
    en: "User Guide",
    zh: "使用指南",
    ja: "使用ガイド",
  },
  userGuideDescription: {
    ko: "앱의 각 기능에 대한 자세한 사용 방법을 확인하세요",
    en: "Learn how to use each feature of the app",
    zh: "了解如何使用应用的各项功能",
    ja: "アプリの各機能の使い方を確認してください",
  },

  dataRestoreTitle: {
    ko: "데이터 복원",
    en: "Data Restore",
    zh: "数据恢复",
    ja: "データ復元",
  },
  dataRestoreDescription: {
    ko: "백업 파일에서 데이터를 복원합니다",
    en: "Restore data from backup file",
    zh: "从备份文件恢复数据",
    ja: "バックアップファイルからデータを復元",
  },
  selectBackupFile: {
    ko: "백업 파일 선택",
    en: "Select Backup File",
    zh: "选择备份文件",
    ja: "バックアップファイルを選択",
  },
  restoreSuccessTitle: {
    ko: "복원 완료",
    en: "Restore Complete",
    zh: "恢复完成",
    ja: "復元完了",
  },
  restoreSuccessDescription: {
    ko: "데이터가 성공적으로 복원되었습니다",
    en: "Data has been successfully restored",
    zh: "数据已成功恢复",
    ja: "データが正常に復元されました",
  },
  restoreError: {
    ko: "복원 실패",
    en: "Restore Failed",
    zh: "恢复失败",
    ja: "復元失敗",
  },
  invalidBackupFile: {
    ko: "유효하지 않은 백업 파일입니다",
    en: "Invalid backup file",
    zh: "无效的备份文件",
    ja: "無効なバックアップファイル",
  },
  restoreInfo: {
    ko: "복원 안내",
    en: "Restore Information",
    zh: "恢复说明",
    ja: "復元情報",
  },
  restoreInfoItem1: {
    ko: "백업 파일은 JSON 형식이어야 합니다",
    en: "Backup file must be in JSON format",
    zh: "备份文件必须为JSON格式",
    ja: "バックアップファイルはJSON形式である必要があります",
  },
  restoreInfoItem2: {
    ko: "복원 시 기존 데이터에 추가됩니다",
    en: "Data will be added to existing records",
    zh: "数据将添加到现有记录中",
    ja: "既存のレコードにデータが追加されます",
  },
  restoreInfoItem3: {
    ko: "복원 전에 현재 데이터를 백업하는 것을 권장합니다",
    en: "We recommend backing up current data before restoring",
    zh: "建议在恢复前备份当前数据",
    ja: "復元前に現在のデータをバックアップすることをお勧めします",
  },

  pwaInstallTitle: {
    ko: "앱 설치하기",
    en: "Install App",
    zh: "安装应用",
    ja: "アプリをインストール",
  },
  pwaInstallDescription: {
    ko: "홈 화면에 앱을 추가하여 더 빠르게 접근하세요",
    en: "Add app to home screen for faster access",
    zh: "将应用添加到主屏幕以便快速访问",
    ja: "ホーム画面にアプリを追加して素早くアクセス",
  },
  androidInstructions: {
    ko: "Android (Chrome)",
    en: "Android (Chrome)",
    zh: "Android (Chrome)",
    ja: "Android (Chrome)",
  },
  androidStep1: {
    ko: "1. Chrome 브라우저에서 이 페이지를 엽니다",
    en: "1. Open this page in Chrome browser",
    zh: "1. 在Chrome浏览器中打开此页面",
    ja: "1. Chromeブラウザでこのページを開きます",
  },
  androidStep2: {
    ko: "2. 오른쪽 상단의 메뉴(⋮)를 탭합니다",
    en: "2. Tap the menu (⋮) in the top right",
    zh: "2. 点击右上角的菜单(⋮)",
    ja: "2. 右上のメニュー(⋮)をタップ",
  },
  androidStep3: {
    ko: "3. '홈 화면에 추가' 또는 '앱 설치'를 선택합니다",
    en: "3. Select 'Add to Home screen' or 'Install app'",
    zh: "3. 选择'添加到主屏幕'或'安装应用'",
    ja: "3. 「ホーム画面に追加」または「アプリをインストール」を選択",
  },
  androidStep4: {
    ko: "4. 확인을 탭하여 설치를 완료합니다",
    en: "4. Tap confirm to complete installation",
    zh: "4. 点击确认完成安装",
    ja: "4. 確認をタップしてインストールを完了",
  },
  iosInstructions: {
    ko: "iOS (Safari)",
    en: "iOS (Safari)",
    zh: "iOS (Safari)",
    ja: "iOS (Safari)",
  },
  iosStep1: {
    ko: "1. Safari 브라우저에서 이 페이지를 엽니다",
    en: "1. Open this page in Safari browser",
    zh: "1. 在Safari浏览器中打开此页面",
    ja: "1. Safariブラウザでこのページを開きます",
  },
  iosStep2: {
    ko: "2. 하단의 공유 버튼(□↑)을 탭합니다",
    en: "2. Tap the share button (□↑) at the bottom",
    zh: "2. 点击底部的分享按钮(□↑)",
    ja: "2. 下部の共有ボタン(□↑)をタップ",
  },
  iosStep3: {
    ko: "3. '홈 화면에 추가'를 선택합니다",
    en: "3. Select 'Add to Home Screen'",
    zh: "3. 选择'添加到主屏幕'",
    ja: "3. 「ホーム画面に追加」を選択",
  },
  iosStep4: {
    ko: "4. 오른쪽 상단의 '추가'를 탭합니다",
    en: "4. Tap 'Add' in the top right",
    zh: "4. 点击右上角的'添加'",
    ja: "4. 右上の「追加」をタップ",
  },
  desktopInstructions: {
    ko: "데스크톱 (Chrome/Edge)",
    en: "Desktop (Chrome/Edge)",
    zh: "桌面 (Chrome/Edge)",
    ja: "デスクトップ (Chrome/Edge)",
  },
  desktopStep1: {
    ko: "1. 주소창 오른쪽의 설치 아이콘(⊕)을 클릭합니다",
    en: "1. Click the install icon (⊕) in the address bar",
    zh: "1. 点击地址栏右侧的安装图标(⊕)",
    ja: "1. アドレスバー右側のインストールアイコン(⊕)をクリック",
  },
  desktopStep2: {
    ko: "2. '설치' 버튼을 클릭합니다",
    en: "2. Click the 'Install' button",
    zh: "2. 点击'安装'按钮",
    ja: "2. 「インストール」ボタンをクリック",
  },
  desktopStep3: {
    ko: "3. 앱이 새 창에서 열립니다",
    en: "3. The app will open in a new window",
    zh: "3. 应用将在新窗口中打开",
    ja: "3. アプリが新しいウィンドウで開きます",
  },

  guideSchedule: {
    ko: "일정 관리",
    en: "Schedule Management",
    zh: "日程管理",
    ja: "スケジュール管理",
  },
  guideScheduleDesc: {
    ko: "일정을 추가하고 관리할 수 있습니다. 제목, 날짜, 시간, 위치, 메모를 입력하고 중요도를 설정할 수 있습니다. 파일 첨부, 손글씨, 음성 입력 기능도 지원합니다.",
    en: "Add and manage schedules. Enter title, date, time, location, notes and set importance. Supports file attachments, handwriting, and voice input.",
    zh: "添加和管理日程。输入标题、日期、时间、地点、备注并设置重要性。支持文件附件、手写和语音输入。",
    ja: "スケジュールを追加・管理できます。タイトル、日付、時間、場所、メモを入力し、重要度を設定できます。ファイル添付、手書き、音声入力にも対応。",
  },
  guideNotes: {
    ko: "노트",
    en: "Notes",
    zh: "笔记",
    ja: "ノート",
  },
  guideNotesDesc: {
    ko: "메모를 작성하고 관리할 수 있습니다. 제목과 내용을 입력하고 카테고리를 지정할 수 있습니다. 파일 첨부, 손글씨, 음성 입력 기능을 사용할 수 있습니다.",
    en: "Create and manage notes. Enter title and content, assign categories. Use file attachments, handwriting, and voice input features.",
    zh: "创建和管理笔记。输入标题和内容，指定类别。可使用文件附件、手写和语音输入功能。",
    ja: "メモを作成・管理できます。タイトルと内容を入力し、カテゴリを指定できます。ファイル添付、手書き、音声入力機能が使えます。",
  },
  guideDiary: {
    ko: "일기",
    en: "Diary",
    zh: "日记",
    ja: "日記",
  },
  guideDiaryDesc: {
    ko: "일기를 작성하고 관리할 수 있습니다. 날짜별로 일기를 작성하고 기분을 선택할 수 있습니다. 사진, 손글씨, 음성 입력을 추가할 수 있습니다.",
    en: "Write and manage diary entries. Create entries by date and select mood. Add photos, handwriting, and voice input.",
    zh: "撰写和管理日记。按日期创建日记并选择心情。可添加照片、手写和语音输入。",
    ja: "日記を書いて管理できます。日付ごとに日記を作成し、気分を選択できます。写真、手書き、音声入力を追加できます。",
  },
  guideTravel: {
    ko: "여행 기록",
    en: "Travel Records",
    zh: "旅行记录",
    ja: "旅行記録",
  },
  guideTravelDesc: {
    ko: "여행 장소와 경험을 기록할 수 있습니다. 장소명, 날짜, 평점, 메모를 입력하고 사진을 첨부할 수 있습니다. 지도에서 위치를 확인할 수 있습니다.",
    en: "Record travel locations and experiences. Enter place name, date, rating, notes and attach photos. View locations on map.",
    zh: "记录旅行地点和体验。输入地点名称、日期、评分、备注并附加照片。可在地图上查看位置。",
    ja: "旅行先と体験を記録できます。場所名、日付、評価、メモを入力し、写真を添付できます。地図で位置を確認できます。",
  },
  guideVehicle: {
    ko: "차량 관리",
    en: "Vehicle Management",
    zh: "车辆管理",
    ja: "車両管理",
  },
  guideVehicleDesc: {
    ko: "차량 정보와 정비 기록을 관리할 수 있습니다. 차량을 등록하고 정비 내역, 비용, 주행거리를 기록할 수 있습니다. 카테고리별로 정비 내역을 분류할 수 있습니다.",
    en: "Manage vehicle information and maintenance records. Register vehicles and record maintenance history, costs, and mileage. Categorize maintenance records.",
    zh: "管理车辆信息和维护记录。注册车辆并记录维护历史、费用和里程。按类别分类维护记录。",
    ja: "車両情報とメンテナンス記録を管理できます。車両を登録し、メンテナンス履歴、費用、走行距離を記録できます。カテゴリ別にメンテナンス履歴を分類できます。",
  },
  guideHealth: {
    ko: "건강 기록",
    en: "Health Records",
    zh: "健康记录",
    ja: "健康記録",
  },
  guideHealthDesc: {
    ko: "건강 데이터를 기록하고 관리할 수 있습니다. 혈압, 혈당, 맥박, 체중, 체온, 걸음수, 거리를 기록하고 그래프로 확인할 수 있습니다. 약 복용 기록과 알람도 설정할 수 있습니다.",
    en: "Record and manage health data. Track blood pressure, blood sugar, pulse, weight, temperature, steps, distance and view graphs. Set medication records and alarms.",
    zh: "记录和管理健康数据。跟踪血压、血糖、脉搏、体重、体温、步数、距离并查看图表。设置药物记录和提醒。",
    ja: "健康データを記録・管理できます。血圧、血糖値、脈拍、体重、体温、歩数、距離を記録しグラフで確認できます。薬の服用記録とアラームも設定できます。",
  },
  guideWeather: {
    ko: "날씨",
    en: "Weather",
    zh: "天气",
    ja: "天気",
  },
  guideWeatherDesc: {
    ko: "현재 위치의 날씨 정보를 확인할 수 있습니다. 온도, 습도, 풍속 등의 정보를 실시간으로 제공합니다.",
    en: "Check weather information for your current location. Provides real-time temperature, humidity, wind speed and more.",
    zh: "查看当前位置的天气信息。实时提供温度、湿度、风速等信息。",
    ja: "現在地の天気情報を確認できます。温度、湿度、風速などの情報をリアルタイムで提供します。",
  },
  guideRadio: {
    ko: "라디오",
    en: "Radio",
    zh: "广播",
    ja: "ラジオ",
  },
  guideRadioDesc: {
    ko: "온라인 라디오 방송을 들을 수 있습니다. 즐겨찾는 방송국을 추가하고 관리할 수 있습니다.",
    en: "Listen to online radio broadcasts. Add and manage favorite stations.",
    zh: "收听在线广播。添加和管理喜爱的电台。",
    ja: "オンラインラジオ放送を聴けます。お気に入りの放送局を追加・管理できます。",
  },
  guideStatistics: {
    ko: "통계",
    en: "Statistics",
    zh: "统计",
    ja: "統計",
  },
  guideStatisticsDesc: {
    ko: "앱 사용 통계를 확인할 수 있습니다. 각 섹션별 데이터 개수와 활동 내역을 그래프로 볼 수 있습니다.",
    en: "View app usage statistics. See data counts and activity history for each section in graphs.",
    zh: "查看应用使用统计。以图表形式查看各部分的数据数量和活动历史。",
    ja: "アプリ使用統計を確認できます。各セクションのデータ数と活動履歴をグラフで見られます。",
  },
  guideSettings: {
    ko: "설정",
    en: "Settings",
    zh: "设置",
    ja: "設定",
  },
  guideSettingsDesc: {
    ko: "앱 설정을 관리할 수 있습니다. 데이터 백업/복원, 언어 설정, 테마 설정 등을 변경할 수 있습니다.",
    en: "Manage app settings. Change data backup/restore, language settings, theme settings and more.",
    zh: "管理应用设置。更改数据备份/恢复、语言设置、主题设置等。",
    ja: "アプリ設定を管理できます。データバックアップ/復元、言語設定、テーマ設定などを変更できます。",
  },
  exportSuccess: {
    ko: "내보내기 성공",
    en: "Export Successful",
    zh: "导出成功",
    ja: "エクスポート成功",
  },
  exportSuccessDescription: {
    ko: "데이터가 성공적으로 내보내졌습니다",
    en: "Data has been exported successfully",
    zh: "数据已成功导出",
    ja: "データが正常にエクスポートされました",
  },
  schedule: {
    ko: "일정",
    en: "Schedule",
    zh: "日程",
    ja: "スケジュール",
  },
  notes: {
    ko: "노트",
    en: "Notes",
    zh: "笔记",
    ja: "ノート",
  },
  diary: {
    ko: "일기",
    en: "Diary",
    zh: "日记",
    ja: "日記",
  },
  travel: {
    ko: "여행기록",
    en: "Travel",
    zh: "旅行记录",
    ja: "旅行記録",
  },
  vehicle: {
    ko: "차량기록",
    en: "Vehicle",
    zh: "车辆记录",
    ja: "車両記録",
  },
  vehicleMaintenance: {
    ko: "차량 정비",
    en: "Vehicle Maintenance",
    zh: "车辆维护",
    ja: "車両メンテナンス",
  },
  healthRecords: {
    ko: "건강 기록",
    en: "Health Records",
    zh: "健康记录",
    ja: "健康記録",
  },
  medications: {
    ko: "복약 관리",
    en: "Medications",
    zh: "药物管理",
    ja: "服薬管理",
  },
  medicationLogs: {
    ko: "복약 기록",
    en: "Medication Logs",
    zh: "服药记录",
    ja: "服薬記録",
  },
  radio: {
    ko: "라디오",
    en: "Radio",
    zh: "广播",
    ja: "ラジオ",
  },
  items: {
    ko: "개",
    en: "items",
    zh: "项",
    ja: "件",
  },
  dataExport: {
    ko: "데이터 내보내기",
    en: "Data Export",
    zh: "数据导出",
    ja: "データエクスポート",
  },
  dataExportDescription: {
    ko: "모든 데이터를 JSON 형식으로 내보내서 백업할 수 있습니다",
    en: "Export all data in JSON format for backup",
    zh: "以JSON格式导出所有数据进行备份",
    ja: "すべてのデータをJSON形式でエクスポートしてバックアップ",
  },
  selectAll: {
    ko: "전체 선택",
    en: "Select All",
    zh: "全选",
    ja: "すべて選択",
  },
  exportData: {
    ko: "데이터 내보내기",
    en: "Export Data",
    zh: "导出数据",
    ja: "データをエクスポート",
  },
  exportInfo: {
    ko: "내보내기 정보:",
    en: "Export Information:",
    zh: "导出信息：",
    ja: "エクスポート情報：",
  },
  exportInfoItem1: {
    ko: "데이터는 JSON 형식으로 저장됩니다",
    en: "Data is saved in JSON format",
    zh: "数据以JSON格式保存",
    ja: "データはJSON形式で保存されます",
  },
  exportInfoItem2: {
    ko: "파일 이름에 날짜가 포함됩니다",
    en: "File name includes the date",
    zh: "文件名包含日期",
    ja: "ファイル名に日付が含まれます",
  },
  exportInfoItem3: {
    ko: "안전한 장소에 백업 파일을 보관하세요",
    en: "Keep backup files in a safe place",
    zh: "请将备份文件保存在安全的地方",
    ja: "バックアップファイルは安全な場所に保管してください",
  },
  loading: {
    ko: "로딩 중...",
    en: "Loading...",
    zh: "加载中...",
    ja: "読み込み中...",
  },
  addSchedule: {
    ko: "일정 추가",
    en: "Add Schedule",
    zh: "添加日程",
    ja: "スケジュール追加",
  },
  title: {
    ko: "제목",
    en: "Title",
    zh: "标题",
    ja: "タイトル",
  },
  date: {
    ko: "날짜",
    en: "Date",
    zh: "日期",
    ja: "日付",
  },
  time: {
    ko: "시간",
    en: "Time",
    zh: "时间",
    ja: "時間",
  },
  description: {
    ko: "설명",
    en: "Description",
    zh: "描述",
    ja: "説明",
  },
  save: {
    ko: "저장",
    en: "Save",
    zh: "保存",
    ja: "保存",
  },
  cancel: {
    ko: "취소",
    en: "Cancel",
    zh: "取消",
    ja: "キャンセル",
  },
}

const LanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ko")

  const t = (key: TranslationKey): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  return context
}
