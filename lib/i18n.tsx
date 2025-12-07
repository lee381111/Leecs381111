import type { Language } from "./types"

type TranslationKey =
  | "title"
  | "loading"
  | "saving"
  | "save"
  | "cancel"
  | "delete"
  | "edit"
  | "add"
  | "search"
  | "all"
  | "date"
  | "back"
  | "back_to_forest"
  | "year"
  | "month"
  | "steps_unit"
  | "krw_unit"
  | "file_upload"
  | "take_photo"
  | "ocr_camera"
  | "ocr_upload"
  | "handwriting"
  | "speech_to_text"
  | "speech_recognition"
  | "stop_recognition"
  | "ocr_capture_and_process"
  | "ocr_take_photo"
  | "ocr_processing"
  | "ocr_completed"
  | "ocr_no_text_found"
  | "ocr_error_occurred"
  | "clear"
  | "stop_recording"
  | "audio_recording"
  | "video_recording"
  | "attachments"
  | "video_cannot_play"
  | "audio_cannot_play"
  | "audio_permission_required"
  | "video_permission_required"
  | "camera_permission_required"
  | "speech_recognition_not_supported"
  | "mic_permission_required"
  | "speech_recognition_failed"
  | "notes"
  | "diary"
  | "schedule"
  | "health"
  | "travel"
  | "vehicle"
  | "budget"
  | "business_card"
  | "business_cards"
  | "radio"
  | "weather"
  | "statistics"
  | "settings"
  | "title_label"
  | "title_required"
  | "content"
  | "tags_placeholder"
  | "attached_files"
  | "filter_by_tag"
  | "organize_meeting_minutes"
  | "organizing_meeting"
  | "content_required_for_organize"
  | "confirm_organize_meeting"
  | "meeting_organized_success"
  | "meeting_organize_failed"
  | "summarize_note"
  | "summarizing"
  | "content_required_for_summary"
  | "note_summarized_success"
  | "note_summary_failed"
  | "summary_result"
  | "replace_with_summary"
  | "add_summary_below"
  | "translate_note"
  | "translating"
  | "content_required_for_translation"
  | "translation_result"
  | "replace_with_translation"
  | "add_translation_below"
  | "select_target_language"
  | "translate_to_korean"
  | "translate_to_english"
  | "translate_to_chinese"
  | "translate_to_japanese"
  | "translation_failed"
  | "health_record"
  | "health_record_btn"
  | "add_health_record"
  | "medication_management_title"
  | "medication_management"
  | "medication_management_btn"
  | "health_statistics"
  | "health_graph"
  | "view_graph"
  | "recent_records"
  | "vital_signs"
  | "exercise"
  | "medical_expenses"
  | "record_type"
  | "blood_pressure"
  | "blood_sugar"
  | "temperature"
  | "weight"
  | "steps"
  | "distance"
  | "medical_expense"
  | "medication_expense"
  | "medication_cost"
  | "memo"
  | "medication_name"
  | "dosage"
  | "frequency"
  | "time"
  | "start_date"
  | "end_date"
  | "add_time"
  | "add_medication"
  | "save_medication_schedule"
  | "enable_alarm"
  | "date_label"
  | "systolic_bp"
  | "diastolic_bp"
  | "systolic_placeholder"
  | "diastolic_placeholder"
  | "blood_sugar_placeholder"
  | "temperature_placeholder"
  | "weight_placeholder"
  | "steps_placeholder"
  | "distance_placeholder"
  | "medical_expense_placeholder"
  | "medication_expense_placeholder"
  | "memo_additional"
  | "medicine_name"
  | "medicine_name_placeholder"
  | "dosage_placeholder"
  | "frequency_placeholder"
  | "medication_times"
  | "end_date_optional"
  | "add_medication_schedule"
  | "dosage_label"
  | "frequency_label"
  | "today_medication_times"
  | "systolic"
  | "diastolic"
  | "no_health_records_message"
  | "medical_and_medication_expenses"
  | "total_expense"
  | "medical_contacts"
  | "medical_contacts_btn"
  | "manage_medical_contacts"
  | "add_medical_contact"
  | "contact_type"
  | "hospital"
  | "clinic"
  | "pharmacy"
  | "contact_name"
  | "contact_phone"
  | "contact_address"
  | "contact_notes"
  | "contact_name_placeholder"
  | "contact_phone_placeholder"
  | "contact_address_placeholder"
  | "no_medical_contacts_message"
  | "save_contact"
  | "todo"
  | "todo_list"
  | "add_todo"
  | "todo_title"
  | "todo_title_required"
  | "todo_description"
  | "todo_priority"
  | "priority_low"
  | "priority_medium"
  | "priority_high"
  | "todo_due_date"
  | "todo_repeat"
  | "repeat_none"
  | "repeat_daily"
  | "repeat_weekly"
  | "repeat_monthly"
  | "todo_alarm"
  | "todo_alarm_notification"
  | "invalid_alarm_time"
  | "todo_completed"
  | "todo_incomplete"
  | "mark_as_completed"
  | "mark_as_incomplete"
  | "no_todos_message"
  | "voice_input_todo"
  | "voice_input_active"
  | "total_todos"
  | "completed_todos"
  | "pending_todos"
  | "filter_all"
  | "filter_active"
  | "filter_completed"
  | "confirm_delete"
  | "delete_success"
  | "delete_failed"
  | "special_days"
  | "general_schedule"
  | "special_day_reminder"
  | "event_name"
  | "category"
  | "birthday"
  | "anniversary"
  | "holiday"
  | "vacation"
  | "meeting"
  | "other"
  | "alarm_time"
  | "alarm_settings"
  | "enable_alarm_before_event"
  | "minutes_before"
  | "5_min_before"
  | "10_min_before"
  | "15_min_before"
  | "minutes_before_30"
  | "hours_before_1"
  | "hours_before_3"
  | "day_before_1"
  | "days_before_3"
  | "week_before_1"
  | "special_days_batch_title"
  | "special_days_batch_description"
  | "schedule_number"
  | "save_schedules_count"
  | "special_day_name_placeholder"
  | "alarm"
  | "day_off"
  | "30_min_before"
  | "1_hour_before"
  | "2_hours_before"
  | "12_hours_before"
  | "1_day_before"
  | "2_days_before"
  | "1_week_before"
  | "add_schedule"
  | "download_ics_description"
  | "attachments_label"
  | "travel_map"
  | "map_zoom_instruction"
  | "map_drag_instruction"
  | "map_button_instruction"
  | "destination_label"
  | "destination_placeholder"
  | "latitude_label"
  | "longitude_label"
  | "auto_or_manual_input"
  | "select_location_cancel"
  | "select_location_on_map"
  | "select_location_instruction"
  | "location_selected_message"
  | "start_date_label"
  | "end_date_label"
  | "city_category"
  | "nature_category"
  | "mountain_category"
  | "sea_category"
  | "historic_category"
  | "restaurant_category"
  | "cafe_category"
  | "other_category"
  | "travel_expense_label"
  | "travel_expense_placeholder"
  | "expense_auto_save_notice"
  | "enter_destination"
  | "enter_dates"
  | "travel_saved"
  | "travel_delete_confirm"
  | "no_travel_records"
  | "add_first_travel"
  | "file"
  | "close_image"
  | "close"
  | "new_travel_record"
  | "edit_travel_record"
  | "coordinates_calculated"
  | "attachments_count_label"
  | "travel_expense_with_unit"
  | "ai_travel_optimizer"
  | "ai_travel_optimizer_description"
  | "budget_placeholder"
  | "travel_style_label"
  | "select_style"
  | "sightseeing"
  | "relaxation"
  | "food_tour"
  | "adventure"
  | "cultural"
  | "generate_itinerary"
  | "optimizing"
  | "trip_summary"
  | "day"
  | "recommendations"
  | "recommended_restaurants"
  | "recommended_attractions"
  | "travel_tips"
  | "budget_breakdown"
  | "accommodation"
  | "food"
  | "transportation"
  | "activities"
  | "total"
  | "apply_to_schedule"
  | "regenerate"
  | "itinerary_applied"
  | "optimization_failed"
  | "please_fill_required_fields"
  | "loading_weather"
  | "refresh"
  | "current_temp"
  | "weather_status"
  | "feels_like"
  | "humidity"
  | "wind_speed"
  | "air_quality"
  | "pm25"
  | "pm10"
  | "yellow_dust"
  | "large_particles"
  | "air_good"
  | "air_moderate"
  | "air_bad"
  | "air_very_bad"
  | "air_high"
  | "air_low"
  | "weekly_forecast"
  | "max_temp"
  | "min_temp"
  | "latitude"
  | "longitude"
  | "loading_stats"
  | "total_records"
  | "precious_memories"
  | "backup_restore_title"
  | "backup_description"
  | "export_data"
  | "restore_backup"
  | "restoring"
  | "json_format"
  | "csv_format"
  | "excel_format"
  | "login_required"
  | "csv_downloaded"
  | "csv_export_failed"
  | "excel_downloaded"
  | "excel_export_failed"
  | "backup_downloaded"
  | "backup_error"
  | "restore_success"
  | "restore_error"
  | "not_logged_in"
  | "logged_in"
  | "user_guide_title"
  | "user_guide"
  | "open_guide"
  | "connection_status_title"
  | "connection_label"
  | "app_developer"
  | "developer_info"
  | "app_introduction"
  | "app_introduction_description"
  | "notes_description"
  | "diaries_description"
  | "diaries"
  | "schedules"
  | "schedules_description"
  | "travel_records"
  | "travel_records_description"
  | "vehicle_records"
  | "vehicle_records_description"
  | "health_records"
  | "health_records_description"
  | "budget_description"
  | "business_cards_description"
  | "ai_auto_fill"
  | "extracting_card_info"
  | "card_info_extracted"
  | "card_extraction_failed"
  | "please_add_card_photo_first"
  | "weather_description"
  | "radio_description"
  | "data_backup"
  | "data_backup_description"
  | "set_diary_password"
  | "password_description"
  | "new_password"
  | "password_placeholder"
  | "confirm_password"
  | "confirm_password_placeholder"
  | "set_password"
  | "skip"
  | "locked_diary"
  | "enter_password_to_unlock"
  | "password"
  | "unlock"
  | "password_too_short"
  | "password_mismatch"
  | "password_set"
  | "enter_password"
  | "unlocked"
  | "wrong_password"
  | "password_changed"
  | "confirm_remove_password"
  | "password_removed"
  | "lock_diary"
  | "add_vehicle"
  | "first_vehicle"
  | "vehicle_list"
  | "new_vehicle"
  | "edit_vehicle"
  | "vehicle_name_placeholder"
  | "license_plate_placeholder"
  | "vehicle_type_placeholder"
  | "vehicle_model_placeholder"
  | "purchase_year_placeholder"
  | "insurance_placeholder"
  | "vehicle_type"
  | "vehicle_model"
  | "purchase_year"
  | "insurance"
  | "insurance_fee"
  | "register"
  | "update"
  | "vehicle_name_and_plate_required"
  | "vehicle_saved"
  | "save_error"
  | "delete_vehicle_confirm"
  | "deleted"
  | "delete_error"
  | "no_vehicles"
  | "records_count"
  | "schedules_count"
  | "records_unit"
  | "tap_to_add_maintenance_and_schedule"
  | "add_maintenance"
  | "maintenance_input"
  | "maintenance_category"
  | "maintenance_date"
  | "engine_oil"
  | "tire"
  | "filter"
  | "repair"
  | "parts"
  | "mileage"
  | "km_unit"
  | "mileage_placeholder"
  | "amount"
  | "won_unit"
  | "amount_placeholder"
  | "memo_placeholder"
  | "save_maintenance"
  | "date_required"
  | "maintenance_saved"
  | "delete_maintenance_confirm"
  | "maintenance_history"
  | "attachments_count"
  | "no_records"
  | "preventive_schedule"
  | "preventive_input"
  | "scheduled_date"
  | "estimated_mileage"
  | "estimated_mileage_placeholder"
  | "description"
  | "description_placeholder"
  | "alarm_setting"
  | "alarm_days_before"
  | "days_before_2"
  | "days_before_7"
  | "days_before_14"
  | "days_before_30"
  | "save_schedule"
  | "scheduled_date_required"
  | "schedule_saved"
  | "delete_schedule_confirm"
  | "alarm_notification"
  | "maintenance_alarm_title"
  | "maintenance_alarm_message"
  | "analyze_budget"
  | "analyzing_budget"
  | "budget_analysis_result"
  | "no_transactions_for_analysis"
  | "budget_analysis_failed"
  | "budget_summary"
  | "highest_spending_category"
  | "saving_tips"
  | "monthly_goal"
  | "customer_support"
  | "customer_support_description"
  | "support_email"
  | "legal_information"
  | "privacy_policy"
  | "terms_of_service"
  | "privacy_last_updated"
  | "privacy_section1_title"
  | "privacy_section1_intro"
  | "privacy_purpose1"
  | "privacy_purpose2"
  | "privacy_purpose3"
  | "privacy_section2_title"
  | "privacy_collected1"
  | "privacy_collected2"
  | "privacy_section3_title"
  | "privacy_storage_desc"
  | "privacy_supabase_desc"
  | "privacy_section4_title"
  | "privacy_retention_desc"
  | "privacy_section5_title"
  | "privacy_right1"
  | "privacy_right2"
  | "privacy_right3"
  | "privacy_section6_title"
  | "terms_last_updated"
  | "terms_section1_title"
  | "terms_section1_desc"
  | "terms_section2_title"
  | "terms_section2_desc"
  | "terms_section3_title"
  | "terms_service1"
  | "terms_service2"
  | "terms_service3"
  | "terms_service4"
  | "terms_service5"
  | "terms_section4_title"
  | "terms_obligation1"
  | "terms_obligation2"
  | "terms_obligation3"
  | "terms_section5_title"
  | "terms_section5_desc"
  | "terms_section6_title"
  | "terms_section6_desc"
  | "danger_zone"
  | "delete_account"
  | "delete_account_title"
  | "account_deletion_warning"
  | "delete_account_warning_title"
  | "delete_warning_1"
  | "delete_warning_2"
  | "delete_warning_3"
  | "delete_account_confirm_instruction"
  | "delete_account_confirm_phrase"
  | "delete_account_phrase_mismatch"
  | "account_deleted_success"
  | "account_deletion_failed"
  | "deleting"
  | "delete_permanently"
  | "view_data"
  | "data_export_description"

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
    back: "뒤로",
    back_to_forest: "숲으로 돌아가기",

    year: "년",
    month: "월",

    steps_unit: "보",
    krw_unit: "원",

    file_upload: "파일 업로드",
    take_photo: "사진 촬영",
    ocr_camera: "촬영→텍스트",
    ocr_upload: "이미지→텍스트",
    handwriting: "손글씨",
    speech_to_text: "음성→텍스트",
    speech_recognition: "음성 인식 중",
    stop_recognition: "음성 인식 중지",
    ocr_capture_and_process: "촬영 및 텍스트 추출",
    ocr_take_photo: "촬영하여 텍스트 추출",
    ocr_processing: "처리 중",
    ocr_completed: "인식 완료",
    ocr_no_text_found: "텍스트를 찾을 수 없습니다",
    ocr_error_occurred: "인식 오류 발생",
    clear: "지우기",
    stop_recording: "녹음 중지",
    audio_recording: "오디오 녹음",
    video_recording: "동영상 녹화",
    attachments: "첨부파일",
    video_cannot_play: "동영상을 재생할 수 없습니다",
    audio_cannot_play: "오디오를 재생할 수 없습니다",
    audio_permission_required: "마이크 권한이 필요합니다",
    video_permission_required: "카메라 권한이 필요합니다",
    camera_permission_required: "카메라 권한이 필요합니다",
    speech_recognition_not_supported: "브라우저가 음성 인식을 지원하지 않습니다",
    mic_permission_required: "마이크 권한이 필요합니다",
    speech_recognition_failed: "음성 인식에 실패했습니다",

    // Sections
    notes: "노트",
    diary: "일기",
    schedule: "일정",
    health: "건강",
    travel: "여행",
    vehicle: "차량",
    budget: "가계부",
    business_card: "명함",
    business_cards: "명함",
    radio: "라디오",
    weather: "날씨",
    statistics: "통계",
    settings: "설정",

    // Notes
    title_label: "제목",
    title_required: "제목을 입력해주세요",
    content: "내용",
    tags_placeholder: "태그 (쉼표로 구분)",
    attached_files: "첨부파일",
    filter_by_tag: "태그로 필터",

    organize_meeting_minutes: "AI 회의록 정리",
    organizing_meeting: "정리 중...",
    content_required_for_organize: "회의록 내용을 입력해주세요",
    confirm_organize_meeting: "AI가 회의록을 정리합니다. 계속하시겠습니까?",
    meeting_organized_success: "회의록이 정리되었습니다!",
    meeting_organize_failed: "회의록 정리에 실패했습니다",
    summarize_note: "AI 노트 요약",
    summarizing: "요약 중...",
    content_required_for_summary: "요약할 내용을 입력해주세요",
    note_summarized_success: "노트가 요약되었습니다!",
    note_summary_failed: "노트 요약에 실패했습니다",
    summary_result: "요약 결과",
    replace_with_summary: "요약본으로 교체",
    add_summary_below: "아래에 추가",
    translate_note: "AI 번역",
    translating: "번역 중...",
    content_required_for_translation: "번역할 내용을 입력해주세요",
    translation_result: "번역 결과",
    replace_with_translation: "번역본으로 교체",
    add_translation_below: "아래에 추가",
    select_target_language: "번역할 언어 선택",
    translate_to_korean: "한국어로 번역",
    translate_to_english: "영어로 번역",
    translate_to_chinese: "중국어로 번역",
    translate_to_japanese: "일본어로 번역",
    translation_failed: "번역에 실패했습니다",

    // Health Section
    health_record: "건강 기록",
    health_record_btn: "건강 기록",
    add_health_record: "건강 기록 추가",
    medication_management_title: "복약 관리",
    medication_management: "복약 관리",
    medication_management_btn: "복약 관리",
    health_statistics: "통계",
    health_graph: "그래프",
    view_graph: "그래프 보기",
    recent_records: "최근 기록",
    vital_signs: "생체 징후",
    exercise: "운동",
    medical_expenses: "의료비",
    record_type: "기록 유형",
    blood_pressure: "혈압",
    blood_sugar: "혈당",
    temperature: "체온",
    weight: "몸무게",
    steps: "걸음수",
    distance: "거리",
    medical_expense: "의료비",
    medication_expense: "약값",
    medication_cost: "약값",
    memo: "메모",
    medication_name: "약 이름",
    dosage: "용량",
    frequency: "복용 주기",
    time: "복용 시간",
    start_date: "시작일",
    end_date: "종료일",
    add_time: "시간 추가",
    add_medication: "복약 추가",
    save_medication_schedule: "복약 일정 저장",
    enable_alarm: "알람 켜기",
    date_label: "날짜",
    systolic_bp: "수축기 혈압",
    diastolic_bp: "이완기 혈압",
    systolic_placeholder: "예: 120",
    diastolic_placeholder: "예: 80",
    blood_sugar_placeholder: "예: 100",
    temperature_placeholder: "예: 36.5",
    weight_placeholder: "예: 70.0",
    steps_placeholder: "예: 10000",
    distance_placeholder: "예: 5.0",
    medical_expense_placeholder: "의료비 입력",
    medication_expense_placeholder: "약값 입력",
    memo_additional: "추가 메모",
    medicine_name: "약 이름",
    medicine_name_placeholder: "약 이름을 입력하세요",
    dosage_placeholder: "예: 1정",
    frequency_placeholder: "예: 하루 3회",
    medication_times: "복용 시간",
    end_date_optional: "종료일 (선택사항)",
    add_medication_schedule: "복약 일정 추가",
    dosage_label: "용량:",
    frequency_label: "복용 주기:",
    today_medication_times: "오늘 복용 시간",
    systolic: "수축기",
    diastolic: "이완기",
    no_health_records_message: "건강 기록이 없습니다. 기록을 추가해보세요!",
    medical_and_medication_expenses: "의료비 및 약값",
    total_expense: "총 비용",

    medical_contacts: "의료 연락처",
    medical_contacts_btn: "연락처",
    manage_medical_contacts: "연락처 관리",
    add_medical_contact: "연락처 추가",
    contact_type: "유형",
    hospital: "병원",
    clinic: "의원",
    pharmacy: "약국",
    contact_name: "기관명",
    contact_phone: "전화번호",
    contact_address: "주소",
    contact_notes: "메모",
    contact_name_placeholder: "예: 서울대병원",
    contact_phone_placeholder: "예: 02-1234-5678",
    contact_address_placeholder: "주소를 입력하세요",
    no_medical_contacts_message: "의료 연락처가 없습니다. 연락처를 추가해보세요!",
    save_contact: "연락처 저장",

    // To-Do List translations for Korean
    todo: "할일",
    todo_list: "할일 목록",
    add_todo: "할일 추가",
    todo_title: "할일 제목",
    todo_title_required: "할일 제목을 입력해주세요",
    todo_description: "설명",
    todo_priority: "우선순위",
    priority_low: "낮음",
    priority_medium: "보통",
    priority_high: "높음",
    todo_due_date: "마감일",
    todo_repeat: "반복",
    repeat_none: "반복 없음",
    repeat_daily: "매일",
    repeat_weekly: "매주",
    repeat_monthly: "매월",
    todo_alarm: "알람",
    todo_alarm_notification: "할일 알림",
    invalid_alarm_time: "알람 시간이 올바르지 않습니다",
    todo_completed: "완료됨",
    todo_incomplete: "미완료",
    mark_as_completed: "완료로 표시",
    mark_as_incomplete: "미완료로 표시",
    no_todos_message: "할일이 없습니다. 새로운 할일을 추가해보세요!",
    voice_input_todo: "음성으로 추가",
    voice_input_active: "음성 인식 중...",
    total_todos: "전체 할일",
    completed_todos: "완료된 할일",
    pending_todos: "미완료 할일",
    filter_all: "전체",
    filter_active: "진행중",
    filter_completed: "완료",
    confirm_delete: "정말 삭제하시겠습니까?",
    delete_success: "삭제되었습니다!",
    delete_failed: "삭제 실패",

    // Schedule Section
    special_days: "특별한 날",
    general_schedule: "일반 일정",
    special_day_reminder: "특별한 날이 곧 다가옵니다!",
    event_name: "이름",
    category: "분류",
    birthday: "생일",
    anniversary: "기념일",
    holiday: "공휴일",
    vacation: "휴가",
    meeting: "회의",
    other: "기타",
    alarm_time: "알람 시간",
    alarm_settings: "알람 설정",
    enable_alarm_before_event: "이벤트 전 알람 활성화",
    minutes_before: "분 전",
    "5_min_before": "5분 전",
    "10_min_before": "10분 전",
    "15_min_before": "15분 전",
    minutes_before_30: "30분 전",
    hours_before_1: "1시간 전",
    hours_before_3: "3시간 전",
    day_before_1: "1일 전",
    days_before_3: "3일 전",
    week_before_1: "1주 전",
    special_days_batch_title: "✨ 특별한 날 일괄 등록",
    special_days_batch_description: "가족 생일, 기념일 등을 한 번에 등록하세요",
    schedule_number: "일정",
    save_schedules_count: "일정 저장",
    special_day_name_placeholder: "특별한 날 이름",
    alarm: "알람",
    day_off: "휴무",
    "30_min_before": "30분 전",
    "1_hour_before": "1시간 전",
    "2_hours_before": "2시간 전",
    "12_hours_before": "12시간 전",
    "1_day_before": "1일 전",
    "2_days_before": "2일 전",
    "1_week_before": "1주 전",
    add_schedule: "일정 추가",
    download_ics_description: "ICS 파일로 다운로드하여 휴대폰 캘린더에 추가",
    title_label: "제목",
    category_label: "분류",
    description_label: "설명",
    attachments_label: "첨부파일",

    // Travel Section
    travel_map: "여행 지도",
    map_zoom_instruction: "확대",
    map_drag_instruction: "드래그하여 이동",
    map_button_instruction: "+/- 버튼으로 확대/축소",
    destination_label: "목적지",
    destination_placeholder: "예: 제주 한라산, 서울 남산, 파리, 뉴욕",
    latitude_label: "위도",
    longitude_label: "경도",
    auto_or_manual_input: "자동 계산 또는 수동 입력",
    select_location_cancel: "위치 선택 취소",
    select_location_on_map: "지도에서 위치 직접 선택",
    select_location_instruction: "정확한 위치를 선택하려면 지도를 클릭하세요",
    location_selected_message: "위치가 선택되었습니다!",
    start_date_label: "출발일",
    end_date_label: "종료일",
    category_label: "분류",
    city_category: "도시",
    nature_category: "자연",
    mountain_category: "산",
    sea_category: "바다",
    historic_category: "역사 유적",
    restaurant_category: "맛집",
    cafe_category: "카페",
    other_category: "기타",
    travel_expense_label: "여행 경비 (원)",
    travel_expense_placeholder: "여행 경비를 입력하세요",
    expense_auto_save_notice: "가계부에 자동으로 기록됩니다",
    enter_destination: "목적지를 입력해주세요",
    enter_dates: "출발일과 종료일을 입력해주세요",
    travel_saved: "여행 기록이 저장되었습니다!",
    travel_delete_confirm: "이 여행 기록을 삭제하시겠습니까?",
    no_travel_records: "아직 여행 기록이 없습니다",
    add_first_travel: "첫 여행 기록을 추가하세요!",
    file: "파일",
    close_image: "확대 이미지",
    close: "닫기",
    new_travel_record: "새 여행 기록",
    edit_travel_record: "여행 기록 수정",
    coordinates_calculated: "좌표 계산됨",
    attachments_count_label: "첨부파일",
    travel_expense_with_unit: "여행 경비",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI 여행일정 최적화",
    ai_travel_optimizer_description:
      "AI가 목적지, 여행 기간, 예산을 바탕으로 최적의 여행 일정을 자동으로 생성해드립니다.",
    destination_label: "목적지",
    destination_placeholder: "예: 서울, 제주도, 도쿄",
    start_date_label: "시작 날짜",
    end_date_label: "종료 날짜",
    budget_label: "예산",
    budget_placeholder: "예상 여행 비용 (원)",
    travel_style_label: "여행 스타일",
    select_style: "선택하세요",
    sightseeing: "관광 중심",
    relaxation: "휴양/힐링",
    food_tour: "맛집 투어",
    adventure: "액티비티/모험",
    cultural: "문화/역사 탐방",
    generate_itinerary: "일정 생성하기",
    optimizing: "최적화 중...",
    trip_summary: "여행 요약",
    day: "Day",
    recommendations: "추천",
    recommended_restaurants: "추천 맛집",
    recommended_attractions: "추천 관광지",
    travel_tips: "여행 팁",
    budget_breakdown: "예산 분석",
    accommodation: "숙박",
    food: "식비",
    transportation: "교통",
    activities: "관광/체험",
    total: "합계",
    apply_to_schedule: "일정에 추가",
    regenerate: "다시 생성",
    itinerary_applied: "여행 일정이 추가되었습니다",
    optimization_failed: "최적화에 실패했습니다",
    please_fill_required_fields: "필수 항목을 입력해주세요",

    // Weather Section
    loading_weather: "날씨 데이터를 로딩 중...",
    refresh: "새로고침",
    current_temp: "현재 온도",
    weather_status: "날씨 상태",
    feels_like: "체감 온도",
    humidity: "습도",
    wind_speed: "풍속",
    air_quality: "대기질",
    pm25: "PM2.5",
    pm10: "PM10",
    yellow_dust: "황사",
    large_particles: "대기 입자",
    air_good: "좋음",
    air_moderate: "보통",
    air_bad: "나쁨",
    air_very_bad: "매우 나쁨",
    air_high: "높음",
    air_low: "낮음",
    weekly_forecast: "주간 예보",
    max_temp: "최고",
    min_temp: "최저",
    latitude: "위도",
    longitude: "경도",

    // Statistics Section
    loading_stats: "통계 로딩 중...",
    total_records: "총 기록 수",
    precious_memories: "소중한 추억",

    // Settings Section
    backup_restore_title: "데이터 백업 및 복원",
    backup_description: "JSON, CSV, Excel 형식으로 데이터를 내보낼 수 있습니다. JSON 형식만 복원 가능합니다.",
    export_data: "데이터 내보내기",
    restore_backup: "백업 복원",
    restoring: "복원 중...",
    json_format: "JSON 형식 (복원 가능)",
    csv_format: "CSV 형식 (읽기 전용)",
    excel_format: "Excel 형식 (읽기 전용)",
    login_required: "로그인이 필요합니다",
    csv_downloaded: "CSV 파일이 다운로드되었습니다",
    csv_export_failed: "CSV 내보내기 실패",
    excel_downloaded: "Excel 파일이 다운로드되었습니다",
    excel_export_failed: "Excel 내보내기 실패",
    backup_downloaded: "백업 파일이 다운로드되었습니다",
    backup_error: "백업 실패",
    restore_success: "복원 완료",
    restore_error: "복원 실패",
    not_logged_in: "로그인하지 않음",
    logged_in: "로그인됨",
    user_guide_title: "사용자 가이드",
    user_guide: "사용자 가이드",
    open_guide: "가이드 열기",
    connection_status_title: "연결 상태",
    connection_label: "Supabase 연결",
    app_developer: "앱 개발자",
    developer_info: "경기도 김포시 장기동 이찬세",
    app_introduction: "앱 소개",
    app_introduction_description: "기록의 숲은 모든 일상 기록을 한 곳에서 관리할 수 있는 올인원 기록 관리 앱입니다.",
    notes_description: "텍스트, 사진, 동영상, 음성을 자유롭게 기록하세요. 태그로 분류하여 쉽게 검색할 수 있습니다.",
    diaries_description: "매일의 기분과 날씨를 기록하세요. 캘린더에서 한눈에 볼 수 있습니다.",
    diaries: "일기",
    schedules: "일정",
    schedules_description:
      "일정을 등록하면 메인 화면 캘린더에 자동으로 표시됩니다. 중요한 일정을 놓치지 않도록 알림 기능을 활성화하세요.",
    travel_records: "여행 기록",
    travel_records_description:
      "목적지를 입력하면 지도에 자동으로 빨간 점으로 표시됩니다. 사진, 동영상, 음성 메모를 첨부하여 여행의 추억을 생생하게 보존하세요.",
    vehicle_records: "차량 관리",
    vehicle_records_description:
      "차량 정비 기록 및 예방 정비 일정을 관리하세요. 정비 비용은 자동으로 가계부에 연동됩니다.",
    health_records: "건강 기록",
    health_records_description:
      "혈압, 혈당, 체중, 운동량을 기록하고 그래프로 추세를 확인하세요. 복약 일정 관리도 가능합니다.",
    budget_description:
      "수입과 지출을 기록하고 월별 통계를 확인하세요. 카테고리별로 분석하여 소비 패턴을 파악할 수 있습니다.",
    business_cards_description: "명함 사진을 찍으면 정보가 자동 인식되어 저장됩니다. 연락처를 쉽게 관리할 수 있습니다.",
    ai_auto_fill: "AI 자동 채우기",
    extracting_card_info: "명함 정보 추출 중...",
    card_info_extracted: "명함 정보가 자동으로 채워졌습니다",
    card_extraction_failed: "명함 정보 추출 실패",
    please_add_card_photo_first: "먼저 명함 사진을 추가해주세요",
    weather_description: "현재 위치의 실시간 날씨 및 대기질 정보를 확인하세요.",
    radio_description: "기록을 작성하면서 라디오 방송을 들을 수 있습니다.",
    data_backup: "데이터 백업",
    data_backup_description: "모든 기록을 JSON 파일로 백업하고 복원할 수 있습니다. 정기적인 백업을 권장합니다.",

    // Diary Password
    set_diary_password: "일기 비밀번호 설정",
    password_description: "일기를 보호하기 위한 비밀번호를 설정하세요",
    new_password: "비밀번호",
    password_placeholder: "최소 4자 이상",
    confirm_password: "비밀번호 확인",
    confirm_password_placeholder: "비밀번호를 다시 입력하세요",
    set_password: "설정",
    skip: "건너뛰기",
    locked_diary: "잠긴 일기",
    enter_password_to_unlock: "일기를 잠금 해제하려면 비밀번호를 입력하세요",
    password: "비밀번호",
    unlock: "잠금 해제",
    password_too_short: "비밀번호는 최소 4자 이상이어야 합니다",
    password_mismatch: "비밀번호가 일치하지 않습니다",
    password_set: "일기 비밀번호가 설정되었습니다",
    enter_password: "비밀번호를 입력하세요",
    unlocked: "잠금 해제됨",
    wrong_password: "잘못된 비밀번호",
    password_changed: "비밀번호가 변경되었습니다",
    confirm_remove_password: "정말 비밀번호를 삭제하시겠습니까?",
    password_removed: "비밀번호가 삭제되었습니다",
    lock_diary: "일기 잠금",

    // Vehicle Section
    add_vehicle: "차량 추가",
    first_vehicle: "첫 차량 등록",
    vehicle_list: "차량 목록",
    new_vehicle: "새 차량",
    edit_vehicle: "차량 수정",
    vehicle_name_placeholder: "차량 이름 (예: 나의 차)",
    license_plate_placeholder: "차량 번호 (예: 12가1234)",
    vehicle_type_placeholder: "차종 (예: 세단, SUV)",
    vehicle_model_placeholder: "모델 (예: 2023 쏘나타)",
    purchase_year_placeholder: "구입 연도",
    insurance_placeholder: "보험사",
    vehicle_type: "차종",
    vehicle_model: "모델",
    purchase_year: "구입 연도",
    insurance: "보험",
    insurance_fee: "보험료",
    register: "등록",
    update: "수정",
    vehicle_name_and_plate_required: "차량 이름과 차량 번호를 입력해주세요",
    vehicle_saved: "차량이 저장되었습니다",
    save_error: "저장 실패",
    delete_vehicle_confirm: "이 차량을 삭제하시겠습니까?",
    deleted: "삭제됨",
    delete_error: "삭제 실패",
    no_vehicles: "등록된 차량이 없습니다",
    records_count: "정비 기록",
    schedules_count: "예방 정비",
    records_unit: "건",
    tap_to_add_maintenance_and_schedule: "차량을 탭하여 정비 기록 및 예방 정비 일정을 추가하세요",

    // Maintenance
    add_maintenance: "정비 기록 추가",
    maintenance_input: "정비 기록 입력",
    maintenance_category: "정비 분류",
    maintenance_date: "정비 날짜",
    engine_oil: "엔진 오일",
    tire: "타이어",
    filter: "필터",
    repair: "수리",
    parts: "부품",
    mileage: "주행 거리",
    km_unit: "km",
    mileage_placeholder: "주행 거리 입력",
    amount: "금액",
    won_unit: "원",
    amount_placeholder: "금액 입력",
    memo_placeholder: "메모 입력",
    save_maintenance: "정비 기록 저장",
    date_required: "날짜를 입력해주세요",
    maintenance_saved: "정비 기록이 저장되었습니다",
    delete_maintenance_confirm: "이 정비 기록을 삭제하시겠습니까?",
    maintenance_history: "정비 내역",
    attachments: "첨부파일",
    attachments_count: "개",
    no_records: "기록 없음",

    // Preventive Maintenance Schedule
    preventive_schedule: "예방 정비 일정",
    preventive_input: "예방 정비 입력",
    scheduled_date: "예정 날짜",
    estimated_mileage: "예상 주행 거리",
    estimated_mileage_placeholder: "예상 주행 거리 입력",
    description: "설명",
    description_placeholder: "설명 입력",
    alarm_setting: "알람 설정",
    alarm_days_before: "알람 미리 알림 (일)",
    days_before_2: "2일 전",
    days_before_7: "7일 전",
    days_before_14: "14일 전",
    days_before_30: "30일 전",
    save_schedule: "일정 저장",
    scheduled_date_required: "예정 날짜를 입력해주세요",
    schedule_saved: "일정이 저장되었습니다",
    delete_schedule_confirm: "이 일정을 삭제하시겠습니까?",
    alarm_notification: "알림",
    maintenance_alarm_title: "정비 알림",
    maintenance_alarm_message: "예정된 정비",

    // Budget Section
    analyze_budget: "지출 분석",
    analyzing_budget: "분석 중...",
    budget_analysis_result: "지출 분석 결과",
    no_transactions_for_analysis: "분석할 거래 내역이 없습니다.",
    budget_analysis_failed: "지출 분석에 실패했습니다.",
    budget_summary: "지출 요약",
    highest_spending_category: "가장 많이 지출한 카테고리",
    saving_tips: "절약 팁",
    monthly_goal: "다음 달 목표",

    // Added translations
    customer_support: "고객 지원",
    customer_support_description: "서비스 이용 중 문의사항이나 문제가 발생하면 언제든지 연락해 주세요.",
    support_email: "지원 이메일",
    legal_information: "법적 정보",
    privacy_policy: "개인정보처리방침",
    terms_of_service: "이용약관",

    // Privacy Policy - Korean
    privacy_last_updated: "최종 업데이트: 2025년 1월",
    privacy_section1_title: "1. 개인정보의 수집 및 이용 목적",
    privacy_section1_intro: "기록의 숲은 다음의 목적을 위해 개인정보를 수집하고 이용합니다:",
    privacy_purpose1: "회원 가입 및 인증: 이메일 기반 계정 관리",
    privacy_purpose2: "서비스 제공: 일정, 할일, 메모, 일기, 예산, 여행, 차량, 건강 정보 관리",
    privacy_purpose3: "서비스 개선 및 고객 지원",
    privacy_section2_title: "2. 수집하는 개인정보 항목",
    privacy_collected1: "필수: 이메일 주소, 암호화된 비밀번호",
    privacy_collected2: "자동 수집: 서비스 이용 기록, IP 주소, 쿠키",
    privacy_section3_title: "3. 개인정보 저장 및 관리",
    privacy_storage_desc: "모든 개인정보는 Supabase(미국 기반 클라우드 서비스)에 안전하게 저장됩니다.",
    privacy_supabase_desc:
      "Supabase는 SOC2 Type 2 및 GDPR 인증을 받은 서비스로, 엔터프라이즈급 보안을 제공합니다. 데이터는 암호화되어 저장되며, 접근 권한은 엄격하게 관리됩니다.",
    privacy_section4_title: "4. 개인정보의 보유 기간",
    privacy_retention_desc:
      "회원 탈퇴 시까지 보유하며, 탈퇴 시 즉시 삭제됩니다. 설정 섹션에서 언제든지 계정을 삭제할 수 있습니다.",
    privacy_section5_title: "5. 사용자의 권리",
    privacy_right1: "개인정보 열람 및 수정: 설정 섹션에서 언제든 확인 및 수정 가능",
    privacy_right2: "데이터 내보내기: 설정 섹션에서 모든 데이터를 JSON/CSV 형식으로 다운로드 가능",
    privacy_right3: "계정 삭제: 설정 섹션에서 언제든 계정 및 모든 데이터 삭제 가능",
    privacy_section6_title: "6. 개인정보 보호책임자",

    // Terms of Service - Korean
    terms_last_updated: "최종 업데이트: 2025년 1월",
    terms_section1_title: "1. 서비스 정의",
    terms_section1_desc:
      "기록의 숲(Forest of Records)은 일정, 할일, 메모, 일기, 예산, 여행, 차량, 건강 관리 등의 기능을 제공하는 웹 기반 서비스입니다.",
    terms_section2_title: "2. 회원가입",
    terms_section2_desc: "누구나 이메일 주소만으로 자유롭게 회원가입할 수 있습니다. 연령, 지역, 기타 제약이 없습니다.",
    terms_section3_title: "3. 제공하는 서비스",
    terms_service1: "일정 및 할일 관리",
    terms_service2: "메모 및 일기 작성",
    terms_service3: "예산 및 가계부 관리",
    terms_service4: "여행 기록 및 계획",
    terms_service5: "차량 정비 기록, 건강 정보 추적, 명함 관리 등",
    terms_section4_title: "4. 사용자의 의무",
    terms_obligation1: "타인의 개인정보를 도용하거나 허위 정보를 입력하지 않을 것",
    terms_obligation2: "서비스를 불법적인 목적으로 사용하지 않을 것",
    terms_obligation3: "타인에게 피해를 주거나 서비스 운영을 방해하지 않을 것",
    terms_section5_title: "5. 저작권",
    terms_section5_desc:
      "사용자가 작성한 콘텐츠의 저작권은 사용자에게 있습니다. 서비스는 사용자의 콘텐츠를 서비스 제공 목적으로만 사용하며, 사용자 동의 없이 제3자에게 제공하지 않습니다.",
    terms_section6_title: "6. 서비스 변경 및 중단",
    terms_section6_desc:
      "서비스는 시스템 점검, 업그레이드 등의 이유로 일시적으로 중단될 수 있습니다. 중요한 변경사항은 사전에 공지합니다.",
    back: "뒤로 가기",

    // Personal Information Section
    personal_information: "개인정보 관리",
    account_information: "계정 정보",
    user_id: "사용자 ID",
    account_created: "가입일",
    change_email: "이메일 변경",
    update_email: "이메일 수정",
    new_email: "새 이메일",
    current_password: "현재 비밀번호",
    enter_password: "비밀번호를 입력하세요",
    updating: "업데이트 중...",
    update: "수정",
    email_updated_success: "이메일이 성공적으로 변경되었습니다",
    email_update_error: "이메일 변경 중 오류가 발생했습니다",
    data_management: "데이터 관리",
    data_management_description: "내 데이터를 다운로드하여 백업하거나 다른 서비스로 이동할 수 있습니다",
    download_my_data: "내 데이터 다운로드",
    download_data_confirm: "모든 데이터를 다운로드하시겠습니까?",
    not_available: "정보 없음",
    fill_all_fields: "모든 필드를 입력해주세요",
    view: "보기",
    hide: "숨기기",
    view_data: "데이터 열람",
    data_export_description: "위의 백업/복원 섹션을 사용하여 데이터를 내보낼 수 있습니다",

    danger_zone: "위험 구역",
    delete_account: "계정 삭제",
    delete_account_title: "계정 삭제 확인",
    account_deletion_warning: "경고: 계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.",
    delete_account_warning_title: "⚠️ 다음 사항을 확인하세요:",
    delete_warning_1: "모든 일정, 할일, 메모, 일기、예산 등 모든 데이터가 삭제됩니다",
    delete_warning_2: "삭제된 데이터는 복구할 수 없습니다",
    delete_warning_3: "계정은 즉시 삭제되며 되돌릴 수 없습니다",
    delete_account_confirm_instruction: "계속하려면 다음 문구를 정확히 입력하세요:",
    delete_account_confirm_phrase: "계정을 삭제합니다",
    delete_account_phrase_mismatch: "입력한 문구가 일치하지 않습니다",
    account_deleted_success: "계정이 성공적으로 삭제되었습니다",
    account_deletion_failed: "계정 삭제에 실패했습니다",
    deleting: "삭제 중...",
    delete_permanently: "영구 삭제",
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
    back: "Back",
    back_to_forest: "Back to Forest",

    year: "",
    month: "",

    steps_unit: "steps",
    krw_unit: "$",

    file_upload: "Upload File",
    take_photo: "Take Photo",
    ocr_camera: "Capture→Text",
    ocr_upload: "Image→Text",
    handwriting: "Handwriting",
    speech_to_text: "Speech→Text",
    speech_recognition: "Recognizing Speech",
    stop_recognition: "Stop Recognition",
    ocr_capture_and_process: "Capture & Extract Text",
    ocr_take_photo: "Capture Photo to Extract Text",
    ocr_processing: "Processing",
    ocr_completed: "Recognition Complete",
    ocr_no_text_found: "No text found",
    ocr_error_occurred: "Recognition error occurred",
    clear: "Clear",
    stop_recording: "Stop Recording",
    audio_recording: "Audio Recording",
    video_recording: "Video Recording",
    attachments: "Attachments",
    video_cannot_play: "Cannot play video",
    audio_cannot_play: "Cannot play audio",
    audio_permission_required: "Microphone permission required",
    video_permission_required: "Camera permission required",
    camera_permission_required: "Camera permission required",
    speech_recognition_not_supported: "Browser does not support speech recognition",
    mic_permission_required: "Microphone permission required",
    speech_recognition_failed: "Speech recognition failed",

    // Sections
    notes: "Notes",
    diary: "Diary",
    schedule: "Schedule",
    health: "Health",
    travel: "Travel",
    vehicle: "Vehicle",
    budget: "Budget",
    business_card: "Business Card",
    business_cards: "Business Cards",
    radio: "Radio",
    weather: "Weather",
    statistics: "Statistics",
    settings: "Settings",

    // Notes
    title_label: "Title",
    title_required: "Please enter a title",
    content: "Content",
    tags_placeholder: "Tags (comma separated)",
    attached_files: "Attached Files",
    filter_by_tag: "Filter by tag",

    organize_meeting_minutes: "AI Meeting Minutes Organizer",
    organizing_meeting: "Organizing...",
    content_required_for_organize: "Please enter the meeting minutes content",
    confirm_organize_meeting: "AI will organize the meeting minutes. Continue?",
    meeting_organized_success: "Meeting minutes have been organized!",
    meeting_organize_failed: "Failed to organize meeting minutes",
    summarize_note: "Summarize Note",
    summarizing: "Summarizing...",
    content_required_for_summary: "Please enter content to summarize",
    note_summarized_success: "Note summarized successfully!",
    note_summary_failed: "Failed to summarize note",
    summary_result: "Summary Result",
    replace_with_summary: "Replace with Summary",
    add_summary_below: "Add Below",
    translate_note: "Translate",
    translating: "Translating...",
    content_required_for_translation: "Please enter content to translate",
    translation_result: "Translation Result",
    replace_with_translation: "Replace with Translation",
    add_translation_below: "Add Below",
    select_target_language: "Select Target Language",
    translate_to_korean: "Translate to Korean",
    translate_to_english: "Translate to English",
    translate_to_chinese: "Translate to Chinese",
    translate_to_japanese: "Translate to Japanese",
    translation_failed: "Translation failed",

    // Health Section
    health_record: "Health Record",
    health_record_btn: "Health Record",
    add_health_record: "Add Health Record",
    medication_management_title: "Medication Management",
    medication_management: "Medication Management",
    medication_management_btn: "Medication Management",
    health_statistics: "Statistics",
    health_graph: "Graph",
    view_graph: "View Graph",
    recent_records: "Recent Records",
    vital_signs: "Vital Signs",
    exercise: "Exercise",
    medical_expenses: "Medical Expenses",
    record_type: "Record Type",
    blood_pressure: "Blood Pressure",
    blood_sugar: "Blood Sugar",
    temperature: "Temperature",
    weight: "Weight",
    steps: "Steps",
    distance: "Distance",
    medical_expense: "Medical Expense",
    medication_expense: "Medicine Cost",
    medication_cost: "Medicine Cost",
    memo: "Memo",
    medication_name: "Medicine Name",
    dosage: "Dosage",
    frequency: "Frequency",
    time: "Time",
    start_date: "Start Date",
    end_date: "End Date",
    add_time: "Add Time",
    add_medication: "Add Medication",
    save_medication_schedule: "Save Medication Schedule",
    enable_alarm: "Enable Alarm",
    date_label: "Date",
    systolic_bp: "Systolic BP",
    diastolic_bp: "Diastolic BP",
    systolic_placeholder: "e.g., 120",
    diastolic_placeholder: "e.g., 80",
    blood_sugar_placeholder: "e.g., 100",
    temperature_placeholder: "e.g., 36.5",
    weight_placeholder: "e.g., 70.0",
    steps_placeholder: "e.g., 10000",
    distance_placeholder: "e.g., 5.0",
    medical_expense_placeholder: "Enter medical expense",
    medication_expense_placeholder: "Enter medicine cost",
    memo_additional: "Additional memo",
    medicine_name: "Medicine Name",
    medicine_name_placeholder: "Enter medicine name",
    dosage_placeholder: "e.g., 1 tablet",
    frequency_placeholder: "e.g., 3 times a day",
    medication_times: "Medication Times",
    end_date_optional: "End Date (Optional)",
    add_medication_schedule: "Add Medication Schedule",
    dosage_label: "Dosage:",
    frequency_label: "Frequency:",
    today_medication_times: "Today's Medication Times",
    systolic: "Systolic",
    diastolic: "Diastolic",
    no_health_records_message: "No health records. Add one!",
    medical_and_medication_expenses: "Medical and Medication Expenses",
    total_expense: "Total Expense",

    medical_contacts: "Medical Contacts",
    medical_contacts_btn: "Contacts",
    manage_medical_contacts: "Manage Contacts",
    add_medical_contact: "Add Contact",
    contact_type: "Type",
    hospital: "Hospital",
    clinic: "Clinic",
    pharmacy: "Pharmacy",
    contact_name: "Name",
    contact_phone: "Phone",
    contact_address: "Address",
    contact_notes: "Notes",
    contact_name_placeholder: "e.g., Seoul National University Hospital",
    contact_phone_placeholder: "e.g., 02-1234-5678",
    contact_address_placeholder: "Enter address",
    no_medical_contacts_message: "No medical contacts. Add one to get started!",
    save_contact: "Save Contact",

    // To-Do List translations for English
    todo: "To-Do",
    todo_list: "To-Do List",
    add_todo: "Add To-Do",
    todo_title: "To-Do Item",
    todo_title_required: "Please enter a to-do title",
    todo_description: "Description",
    todo_priority: "Priority",
    priority_low: "Low",
    priority_medium: "Medium",
    priority_high: "High",
    todo_due_date: "Due Date",
    todo_repeat: "Repeat",
    repeat_none: "No Repeat",
    repeat_daily: "Daily",
    repeat_weekly: "Weekly",
    repeat_monthly: "Monthly",
    todo_alarm: "Alarm",
    todo_alarm_notification: "To-Do Reminder",
    invalid_alarm_time: "Invalid alarm time",
    todo_completed: "Completed",
    todo_incomplete: "Incomplete",
    mark_as_completed: "Mark as Completed",
    mark_as_incomplete: "Mark as Incomplete",
    no_todos_message: "No to-dos yet. Add a new one to get started!",
    voice_input_todo: "Add by Voice",
    voice_input_active: "Voice recognition active...",
    total_todos: "Total To-Dos",
    completed_todos: "Completed To-Dos",
    pending_todos: "Pending To-Dos",
    filter_all: "All",
    filter_active: "Active",
    filter_completed: "Completed",
    confirm_delete: "Are you sure you want to delete?",
    delete_success: "Deleted successfully!",
    delete_failed: "Delete failed",

    // Schedule Section
    special_days: "Special Days",
    general_schedule: "General Schedule",
    special_day_reminder: "Special day is coming soon!",
    event_name: "Name",
    category: "Category",
    birthday: "Birthday",
    anniversary: "Anniversary",
    holiday: "Holiday",
    vacation: "Vacation",
    meeting: "Meeting",
    other: "Other",
    alarm_time: "Alarm Time",
    alarm_settings: "Alarm Settings",
    enable_alarm_before_event: "Enable alarm before event",
    minutes_before: " minutes before",
    "5_min_before": "5 minutes before",
    "10_min_before": "10 minutes before",
    "15_min_before": "15 minutes before",
    minutes_before_30: "30 minutes before",
    hours_before_1: "1 hour before",
    hours_before_3: "3 hours before",
    day_before_1: "1 day before",
    days_before_3: "3 days before",
    week_before_1: "1 week before",
    special_days_batch_title: "✨ Batch Register Special Days",
    special_days_batch_description: "Register family birthdays, anniversaries, etc. at once",
    schedule_number: "Schedule",
    save_schedules_count: "Save Schedules",
    special_day_name_placeholder: "Special day name",
    alarm: "Alarm",
    day_off: "Day Off",
    "30_min_before": "30 min before",
    "1_hour_before": "1 hour before",
    "2_hours_before": "2 hours before",
    "12_hours_before": "12 hours before",
    "1_day_before": "1 day before",
    "2_days_before": "2 days before",
    "1_week_before": "1 week before",
    add_schedule: "Add Schedule",
    download_ics_description: "Download as ICS file to add to phone calendar",
    title_label: "Title",
    category_label: "Category",
    description_label: "Description",
    attachments_label: "Attachments",

    // Travel Section
    travel_map: "Travel Map",
    map_zoom_instruction: "Zoom",
    map_drag_instruction: "Drag to move",
    map_button_instruction: "Use +/- buttons to zoom",
    destination_label: "Destination",
    destination_placeholder: "e.g., Jeju Hallasan, Seoul Namsan, Paris, New York",
    latitude_label: "Latitude",
    longitude_label: "Longitude",
    auto_or_manual_input: "Auto-calculated or manual input",
    select_location_cancel: "Cancel Location Selection",
    select_location_on_map: "Select Location on Map",
    select_location_instruction: "Click on the map to select an exact location",
    location_selected_message: "Location selected!",
    start_date_label: "Start Date",
    end_date_label: "End Date",
    category_label: "Category",
    city_category: "City",
    nature_category: "Nature",
    mountain_category: "Mountain",
    sea_category: "Sea",
    historic_category: "Historic Site",
    restaurant_category: "Restaurant",
    cafe_category: "Cafe",
    other_category: "Other",
    travel_expense_label: "Travel Expense (KRW)",
    travel_expense_placeholder: "Enter travel expense",
    expense_auto_save_notice: "Will be automatically recorded in budget",
    enter_destination: "Please enter a destination",
    enter_dates: "Please enter start and end dates",
    travel_saved: "Travel record saved!",
    travel_delete_confirm: "Do you want to delete this travel record?",
    no_travel_records: "No travel records yet",
    add_first_travel: "Add your first travel record!",
    file: "File",
    close_image: "Enlarged Image",
    close: "Close",
    new_travel_record: "New Travel Record",
    edit_travel_record: "Edit Travel Record",
    coordinates_calculated: "Coordinates calculated",
    attachments_count_label: "Attachments",
    travel_expense_with_unit: "Travel Expense",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI Travel Optimizer",
    ai_travel_optimizer_description:
      "AI automatically generates optimal travel itineraries based on destination, travel period, and budget.",
    destination_label: "Destination",
    destination_placeholder: "e.g., Seoul, Jeju, Tokyo",
    start_date_label: "Start Date",
    end_date_label: "End Date",
    budget_label: "Budget",
    budget_placeholder: "Estimated travel cost (KRW)",
    travel_style_label: "Travel Style",
    select_style: "Select",
    sightseeing: "Sightseeing",
    relaxation: "Relaxation",
    food_tour: "Food Tour",
    adventure: "Adventure",
    cultural: "Cultural/Historical",
    generate_itinerary: "Generate Itinerary",
    optimizing: "Optimizing...",
    trip_summary: "Trip Summary",
    day: "Day",
    recommendations: "Recommendations",
    recommended_restaurants: "Recommended Restaurants",
    recommended_attractions: "Recommended Attractions",
    travel_tips: "Travel Tips",
    budget_breakdown: "Budget Breakdown",
    accommodation: "Accommodation",
    food: "Food",
    transportation: "Transportation",
    activities: "Activities",
    total: "Total",
    apply_to_schedule: "Add to Schedule",
    regenerate: "Regenerate",
    itinerary_applied: "Itinerary added to schedule",
    optimization_failed: "Optimization failed",
    please_fill_required_fields: "Please fill in required fields",

    // Weather Section
    loading_weather: "Loading weather data...",
    refresh: "Refresh",
    current_temp: "Current Temperature",
    weather_status: "Weather Status",
    feels_like: "Feels Like",
    humidity: "Humidity",
    wind_speed: "Wind Speed",
    air_quality: "Air Quality",
    pm25: "PM2.5",
    pm10: "PM10",
    yellow_dust: "Yellow Dust",
    large_particles: "Large Particles",
    air_good: "Good",
    air_moderate: "Moderate",
    air_bad: "Bad",
    air_very_bad: "Very Bad",
    air_high: "High",
    air_low: "Low",
    weekly_forecast: "Weekly Forecast",
    max_temp: "Max",
    min_temp: "Min",
    latitude: "Latitude",
    longitude: "Longitude",

    // Statistics Section
    loading_stats: "Loading statistics...",
    total_records: "Total Records",
    precious_memories: "Precious Memories",

    // Settings Section
    backup_restore_title: "Data Backup & Restore",
    backup_description: "Export data in JSON, CSV, or Excel format. Only JSON can be restored.",
    export_data: "Export Data",
    restore_backup: "Restore Backup",
    restoring: "Restoring...",
    json_format: "JSON Format (Restorable)",
    csv_format: "CSV Format (Read Only)",
    excel_format: "Excel Format (Read Only)",
    login_required: "Login required",
    csv_downloaded: "CSV file downloaded",
    csv_export_failed: "CSV export failed",
    excel_downloaded: "Excel file downloaded",
    excel_export_failed: "Excel export failed",
    backup_downloaded: "Backup file downloaded",
    backup_error: "Backup failed",
    restore_success: "Restore completed",
    restore_error: "Restore failed",
    not_logged_in: "Not logged in",
    logged_in: "Logged in",
    user_guide_title: "User Guide",
    user_guide: "User Guide",
    open_guide: "Open Guide",
    connection_status_title: "Connection Status",
    connection_label: "Supabase Connection",
    app_developer: "App Developer",
    developer_info: "Lee Chan-se, Janggi-dong, Gimpo-si, Gyeonggi-do",
    app_introduction: "App Introduction",
    app_introduction_description:
      "Forest Note is an all-in-one record management app where you can manage all your daily records in one place.",
    notes_description: "Record text, photos, videos, and voice freely. Organize with tags for easy search.",
    diaries_description: "Record your daily mood and weather. View at a glance on the calendar.",
    diaries: "Diaries",
    schedules: "Schedules",
    schedules_description:
      "When you register a schedule, it will be automatically displayed on the main screen calendar. Enable notifications so you don't miss important schedules.",
    travel_records: "Travel Records",
    travel_records_description:
      "When you enter a destination, it will be automatically marked with a red dot on the map. Attach photos, videos, and voice memos to preserve your travel memories vividly.",
    vehicle_records: "Vehicle Management",
    vehicle_records_description:
      "Manage vehicle maintenance history and preventive maintenance schedules. Maintenance costs are automatically synchronized to the budget.",
    health_records: "Health Records",
    health_records_description:
      "Record blood pressure, blood sugar, weight, and exercise, and check trends in graphs. You can also manage medication schedules.",
    budget_description:
      "Record income and expenses and check monthly statistics. Analyze by category to understand consumption patterns.",
    business_cards_description:
      "Take a photo of a business card to automatically recognize and save information. You can easily manage contacts.",
    ai_auto_fill: "AI Auto-Fill",
    extracting_card_info: "Extracting card information...",
    card_info_extracted: "Card information has been automatically filled",
    card_extraction_failed: "Failed to extract card information",
    please_add_card_photo_first: "Please add a card photo first",
    weather_description: "Check real-time weather and air quality information for your current location.",
    radio_description: "Listen to radio broadcasts from around the world while writing records.",
    data_backup: "Data Backup",
    data_backup_description: "You can backup and restore all records as JSON files. Regular backups are recommended.",

    // Diary Password
    set_diary_password: "Set Diary Password",
    password_description: "Set a password to protect your diary",
    new_password: "Password",
    password_placeholder: "At least 4 characters",
    confirm_password: "Confirm Password",
    confirm_password_placeholder: "Re-enter password",
    set_password: "Set",
    skip: "Skip",
    locked_diary: "Locked Diary",
    enter_password_to_unlock: "Enter password to unlock your diary",
    password: "Password",
    unlock: "Unlock",
    password_too_short: "Password must be at least 4 characters",
    password_mismatch: "Passwords do not match",
    password_set: "Diary password has been set",
    enter_password: "Please enter password",
    unlocked: "Unlocked",
    wrong_password: "Wrong password",
    password_changed: "Password has been changed",
    confirm_remove_password: "Are you sure you want to remove the password?",
    password_removed: "Password has been removed",
    lock_diary: "Lock Diary",

    // Vehicle Section
    add_vehicle: "Add Vehicle",
    first_vehicle: "Register First Vehicle",
    vehicle_list: "Vehicle List",
    new_vehicle: "New Vehicle",
    edit_vehicle: "Edit Vehicle",
    vehicle_name_placeholder: "Vehicle name (e.g., My Car)",
    license_plate_placeholder: "License plate (e.g., ABC-1234)",
    vehicle_type_placeholder: "Type (e.g., Sedan, SUV)",
    vehicle_model_placeholder: "Model (e.g., 2023 Sonata)",
    purchase_year_placeholder: "Purchase year",
    insurance_placeholder: "Insurance company",
    vehicle_type: "Type",
    vehicle_model: "Model",
    purchase_year: "Purchase Year",
    insurance: "Insurance",
    insurance_fee: "Insurance Fee",
    register: "Register",
    update: "Update",
    vehicle_name_and_plate_required: "Please enter vehicle name and license plate",
    vehicle_saved: "Vehicle saved",
    save_error: "Save failed",
    delete_vehicle_confirm: "Do you want to delete this vehicle?",
    deleted: "Deleted",
    delete_error: "Delete failed",
    no_vehicles: "No vehicles registered",
    records_count: "Maintenance Records",
    schedules_count: "Preventive Maintenance",
    records_unit: "items",
    tap_to_add_maintenance_and_schedule:
      "Tap the vehicle to add maintenance records and preventive maintenance schedules",

    // Maintenance
    add_maintenance: "Add Maintenance Record",
    maintenance_input: "Maintenance Record Input",
    maintenance_category: "Maintenance Category",
    maintenance_date: "Maintenance Date",
    engine_oil: "Engine Oil",
    tire: "Tire",
    filter: "Filter",
    repair: "Repair",
    parts: "Parts",
    mileage: "Mileage",
    km_unit: "km",
    mileage_placeholder: "Enter mileage",
    amount: "Amount",
    won_unit: "KRW",
    amount_placeholder: "Enter amount",
    memo_placeholder: "Enter memo",
    save_maintenance: "Save Maintenance Record",
    date_required: "Please enter date",
    maintenance_saved: "Maintenance record saved",
    delete_maintenance_confirm: "Delete this maintenance record?",
    maintenance_history: "Maintenance History",
    attachments: "Attachments",
    attachments_count: "file(s)",
    no_records: "No records",

    // Preventive Maintenance Schedule
    preventive_schedule: "Preventive Maintenance Schedule",
    preventive_input: "Preventive Maintenance Input",
    scheduled_date: "Scheduled Date",
    estimated_mileage: "Estimated Mileage",
    estimated_mileage_placeholder: "Enter estimated mileage",
    description: "Description",
    description_placeholder: "Enter description",
    alarm_setting: "Alarm Setting",
    alarm_days_before: "Days before alarm",
    days_before_2: "2 days before",
    days_before_7: "7 days before",
    days_before_14: "14 days before",
    days_before_30: "30 days before",
    save_schedule: "Save Schedule",
    scheduled_date_required: "Please enter scheduled date",
    schedule_saved: "Schedule saved",
    delete_schedule_confirm: "Delete this schedule?",
    alarm_notification: "Alarm",
    maintenance_alarm_title: "Maintenance Alarm",
    maintenance_alarm_message: "Scheduled maintenance",

    // Budget Section
    analyze_budget: "Analyze Budget",
    analyzing_budget: "Analyzing...",
    budget_analysis_result: "Budget Analysis Result",
    no_transactions_for_analysis: "No transactions for analysis.",
    budget_analysis_failed: "Budget analysis failed",
    budget_summary: "Budget Summary",
    highest_spending_category: "Highest Spending Category",
    saving_tips: "Saving Tips",
    monthly_goal: "Next Month Goal",

    // Added translations
    customer_support: "Customer Support",
    customer_support_description: "Contact us anytime if you have questions or issues using the service.",
    support_email: "Support Email",
    legal_information: "Legal Information",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",

    // Privacy Policy - English
    privacy_last_updated: "Last Updated: January 2025",
    privacy_section1_title: "1. Purpose of Personal Information Collection",
    privacy_section1_intro: "Forest of Records collects and uses personal information for the following purposes:",
    privacy_purpose1: "Account registration and authentication: Email-based account management",
    privacy_purpose2:
      "Service provision: Schedule, todo, memo, diary, budget, travel, vehicle, health information management",
    privacy_purpose3: "Service improvement and customer support",
    privacy_section2_title: "2. Personal Information Collected",
    privacy_collected1: "Required: Email address, encrypted password",
    privacy_collected2: "Automatically collected: Service usage logs, IP address, cookies",
    privacy_section3_title: "3. Personal Information Storage and Management",
    privacy_storage_desc: "All personal information is securely stored on Supabase (US-based cloud service).",
    privacy_supabase_desc:
      "Supabase is SOC2 Type 2 and GDPR certified, providing enterprise-grade security. Data is encrypted at rest and access is strictly controlled.",
    privacy_section4_title: "4. Personal Information Retention Period",
    privacy_retention_desc:
      "Retained until account deletion. Upon deletion, data is immediately removed. You can delete your account anytime from the Settings section.",
    privacy_section5_title: "5. User Rights",
    privacy_right1: "View and edit personal information: Available anytime in Settings",
    privacy_right2: "Data export: Download all data in JSON/CSV format from Settings",
    privacy_right3: "Account deletion: Delete account and all data anytime from Settings",
    privacy_section6_title: "6. Data Protection Officer",

    // Terms of Service - English
    terms_last_updated: "Last Updated: January 2025",
    terms_section1_title: "1. Service Definition",
    terms_section1_desc:
      "Forest of Records is a web-based service providing schedule, todo, memo, diary, budget, travel, vehicle, health management features.",
    terms_section2_title: "2. Registration",
    terms_section2_desc:
      "Anyone can freely register with just an email address. No age, location, or other restrictions.",
    terms_section3_title: "3. Services Provided",
    terms_service1: "Schedule and todo management",
    terms_service2: "Memo and diary writing",
    terms_service3: "Budget and expense management",
    terms_service4: "Travel records and planning",
    terms_service5: "Vehicle maintenance records, health tracking, business card management, etc.",
    terms_section4_title: "4. User Obligations",
    terms_obligation1: "Do not steal others' personal information or enter false information",
    terms_obligation2: "Do not use the service for illegal purposes",
    terms_obligation3: "Do not harm others or interfere with service operations",
    terms_section5_title: "5. Copyright",
    terms_section5_desc:
      "Users retain copyright of their content. The service uses user content only for service provision and will not share with third parties without consent.",
    terms_section6_title: "6. Service Changes and Interruptions",
    terms_section6_desc:
      "Service may be temporarily suspended for system maintenance, upgrades, etc. Important changes will be announced in advance.",

    // Personal Information Section
    personal_information: "Personal Information",
    account_information: "Account Information",
    user_id: "User ID",
    account_created: "Account Created",
    change_email: "Change Email",
    update_email: "Update Email",
    new_email: "New Email",
    current_password: "Current Password",
    enter_password: "Enter password",
    updating: "Updating...",
    update: "Update",
    email_updated_success: "Email successfully updated",
    email_update_error: "Error updating email",
    data_management: "Data Management",
    data_management_description: "Download your data to back up or move to another service",
    download_my_data: "Download My Data",
    download_data_confirm: "Download all data?",
    not_available: "Not available",
    fill_all_fields: "Please fill all fields",
    view: "View",
    hide: "Hide",
    view_data: "View Data",
    data_export_description: "You can export data using the Backup/Restore section above",

    danger_zone: "Danger Zone",
    delete_account: "Delete Account",
    delete_account_title: "Confirm Account Deletion",
    account_deletion_warning:
      "Warning: Deleting your account will permanently delete all data and cannot be recovered.",
    delete_account_warning_title: "⚠️ Please confirm:",
    delete_warning_1: "All schedules, todos, notes, diaries, budgets, and other data will be deleted",
    delete_warning_2: "Deleted data cannot be recovered",
    delete_warning_3: "Account will be deleted immediately and cannot be undone",
    delete_account_confirm_instruction: "Type the following phrase exactly to continue:",
    delete_account_confirm_phrase: "delete my account",
    delete_account_phrase_mismatch: "The phrase you entered does not match",
    account_deleted_success: "Account successfully deleted",
    account_deletion_failed: "Account deletion failed",
    deleting: "Deleting...",
    delete_permanently: "Delete Permanently",
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
    back: "返回",
    back_to_forest: "返回森林",

    steps_unit: "步",
    krw_unit: "元",

    file_upload: "文件上传",
    take_photo: "拍照",
    ocr_camera: "拍摄→文字",
    ocr_upload: "图片→文字",
    handwriting: "手写",
    speech_to_text: "语音→文字",
    speech_recognition: "语音识别中",
    stop_recognition: "停止识别",
    ocr_capture_and_process: "拍摄并提取文本",
    ocr_take_photo: "拍照提取文字",
    ocr_processing: "正在处理",
    ocr_completed: "识别完成",
    ocr_no_text_found: "未找到文字",
    ocr_error_occurred: "识别出错",
    clear: "清除",
    stop_recording: "停止录音",
    audio_recording: "音频录制",
    video_recording: "视频录制",
    attachments: "附件",
    video_cannot_play: "无法播放视频",
    audio_cannot_play: "无法播放音频",
    audio_permission_required: "需要麦克风权限",
    video_permission_required: "需要摄像头权限",
    camera_permission_required: "需要相机权限",
    speech_recognition_not_supported: "浏览器不支持语音识别",
    mic_permission_required: "需要麦克风权限",
    speech_recognition_failed: "语音识别失败",

    // Sections
    notes: "笔记",
    diary: "日记",
    schedule: "日程",
    health: "健康",
    travel: "旅行",
    vehicle: "车辆",
    budget: "账本",
    business_card: "名片",
    business_cards: "名片",
    radio: "广播",
    weather: "天气",
    statistics: "统计",
    settings: "设置",

    // Notes
    title_label: "标题",
    title_required: "请输入标题",
    content: "内容",
    tags_placeholder: "标签（逗号分隔）",
    attached_files: "附件",
    filter_by_tag: "按标签筛选",

    organize_meeting_minutes: "AI会议录整理",
    organizing_meeting: "整理中...",
    content_required_for_organize: "请输入会议录内容",
    confirm_organize_meeting: "AI将整理会议录。继续吗？",
    meeting_organized_success: "会议录已整理！",
    meeting_organize_failed: "会议录整理失败",
    summarize_note: "AI笔记摘要",
    summarizing: "摘要中...",
    content_required_for_summary: "请输入要摘要的内容",
    note_summarized_success: "笔记摘要成功！",
    note_summary_failed: "笔记摘要失败",
    summary_result: "摘要结果",
    replace_with_summary: "替换为摘要",
    add_summary_below: "添加到下方",
    translate_note: "AI翻译",
    translating: "翻译中...",
    content_required_for_translation: "请输入要翻译的内容",
    translation_result: "翻译结果",
    replace_with_translation: "替换为翻译",
    add_translation_below: "添加到下方",
    select_target_language: "选择翻译语言",
    translate_to_korean: "翻译成韩语",
    translate_to_english: "翻译成英语",
    translate_to_chinese: "翻译成中文",
    translate_to_japanese: "翻译成日语",
    translation_failed: "翻译失败",

    // Health Section
    health_record: "健康记录",
    health_record_btn: "健康记录",
    add_health_record: "添加健康记录",
    medication_management_title: "用药管理",
    medication_management: "用药管理",
    medication_management_btn: "用药管理",
    health_statistics: "统计",
    health_graph: "图表",
    view_graph: "查看图表",
    recent_records: "最近记录",
    vital_signs: "生命体征",
    exercise: "运动",
    medical_expenses: "医疗费用",
    record_type: "记录类型",
    blood_pressure: "血压",
    blood_sugar: "血糖",
    temperature: "体温",
    weight: "体重",
    steps: "步数",
    distance: "距离",
    medical_expense: "医疗费用",
    medication_expense: "药费",
    medication_cost: "药费",
    memo: "备注",
    medication_name: "药品名称",
    dosage: "剂量",
    frequency: "服用频率",
    time: "服用时间",
    start_date: "开始日期",
    end_date: "结束日期",
    add_time: "添加时间",
    add_medication: "添加用药",
    save_medication_schedule: "保存用药计划",
    enable_alarm: "启用提醒",
    date_label: "日期",
    systolic_bp: "收缩压",
    diastolic_bp: "舒张压",
    systolic_placeholder: "例如：120",
    diastolic_placeholder: "例如：80",
    blood_sugar_placeholder: "例如：100",
    temperature_placeholder: "例如：36.5",
    weight_placeholder: "例如：70.0",
    steps_placeholder: "例如：10000",
    distance_placeholder: "例如：5.0",
    medical_expense_placeholder: "输入医疗费用",
    medication_expense_placeholder: "输入药费",
    memo_additional: "附加备注",
    medicine_name: "药品名称",
    medicine_name_placeholder: "请输入药品名称",
    dosage_placeholder: "例如：1片",
    frequency_placeholder: "例如：每天3次",
    medication_times: "服药时间",
    end_date_optional: "结束日期（可选）",
    add_medication_schedule: "添加用药计划",
    dosage_label: "剂量：",
    frequency_label: "频率：",
    today_medication_times: "今日服药时间",
    systolic: "收缩压",
    diastolic: "舒张压",
    no_health_records_message: "暂无健康记录。添加一条吧！",
    medical_and_medication_expenses: "医疗费和药费",
    total_expense: "总费用",

    medical_contacts: "医疗联系人",
    medical_contacts_btn: "联系人",
    manage_medical_contacts: "管理联系人",
    add_medical_contact: "添加联系人",
    contact_type: "类型",
    hospital: "医院",
    clinic: "诊所",
    pharmacy: "药店",
    contact_name: "机构名称",
    contact_phone: "电话号码",
    contact_address: "地址",
    contact_notes: "备注",
    contact_name_placeholder: "例如：首尔大学医院",
    contact_phone_placeholder: "例如：02-1234-5678",
    contact_address_placeholder: "请输入地址",
    no_medical_contacts_message: "暂无医疗联系人。添加一个开始吧！",
    save_contact: "保存联系人",

    // To-Do List translations for Chinese
    todo: "待办事项",
    todo_list: "待办事项列表",
    add_todo: "添加待办事项",
    todo_title: "待办事项",
    todo_title_required: "请填写待办事项标题",
    todo_description: "描述",
    todo_priority: "优先级",
    priority_low: "低",
    priority_medium: "中",
    priority_high: "高",
    todo_due_date: "截止日期",
    todo_repeat: "重复",
    repeat_none: "不重复",
    repeat_daily: "每天",
    repeat_weekly: "每周",
    repeat_monthly: "每月",
    todo_alarm: "提醒",
    todo_alarm_notification: "待办提醒",
    invalid_alarm_time: "无效的提醒时间",
    todo_completed: "已完成",
    todo_incomplete: "未完成",
    mark_as_completed: "标记为已完成",
    mark_as_incomplete: "标记为未完成",
    no_todos_message: "暂无待办事项。添加一个新的开始吧！",
    voice_input_todo: "语音添加",
    voice_input_active: "语音识别中...",
    total_todos: "总待办事项",
    completed_todos: "已完成待办事项",
    pending_todos: "待处理待办事项",
    filter_all: "全部",
    filter_active: "进行中",
    filter_completed: "已完成",
    confirm_delete: "确定要删除吗？",
    delete_success: "删除成功！",
    delete_failed: "删除失败",

    // Schedule Section
    special_days: "特别的日子",
    general_schedule: "一般日程",
    special_day_reminder: "特别的日子即将到来！",
    event_name: "名称",
    category: "分类",
    birthday: "生日",
    anniversary: "纪念日",
    holiday: "节日",
    vacation: "假期",
    meeting: "会议",
    other: "其他",
    alarm_time: "提醒时间",
    alarm_settings: "提醒设置",
    enable_alarm_before_event: "事件前启用提醒",
    minutes_before: "分钟前",
    "5_min_before": "提前5分钟",
    "10_min_before": "提前10分钟",
    "15_min_before": "提前15分钟",
    minutes_before_30: "提前30分钟",
    hours_before_1: "提前1小时",
    hours_before_3: "提前3小时",
    day_before_1: "提前1天",
    days_before_3: "提前3天",
    week_before_1: "提前1周",
    special_days_batch_title: "✨ 批量注册特别的日子",
    special_days_batch_description: "一次注册家庭生日、纪念日等",
    schedule_number: "日程",
    save_schedules_count: "保存日程",
    special_day_name_placeholder: "特别日子名称",
    alarm: "提醒",
    day_off: "假期",
    "30_min_before": "提前30分钟",
    "1_hour_before": "提前1小时",
    "2_hours_before": "提前2小时",
    "12_hours_before": "提前12小时",
    "1_day_before": "提前1天",
    "2_days_before": "提前2天",
    "1_week_before": "提前1周",
    add_schedule: "添加日程",
    download_ics_description: "下载ICS文件以添加到手机日历",
    title_label: "标题",
    category_label: "分类",
    description_label: "说明",
    attachments_label: "附件",

    // Travel Section
    travel_map: "旅行地图",
    map_zoom_instruction: "缩放",
    map_drag_instruction: "拖动移动",
    map_button_instruction: "使用 +/- 按钮缩放",
    destination_label: "目的地",
    destination_placeholder: "例如：济州汉拿山、首尔南山、巴黎、纽约",
    latitude_label: "纬度",
    longitude_label: "经度",
    auto_or_manual_input: "自动计算或手动输入",
    select_location_cancel: "取消位置选择",
    select_location_on_map: "在地图上直接选择位置",
    select_location_instruction: "点击地图选择确切位置",
    location_selected_message: "位置已选择！",
    start_date_label: "出发日期",
    end_date_label: "结束日期",
    category_label: "分类",
    city_category: "城市",
    nature_category: "自然",
    mountain_category: "山",
    sea_category: "海",
    historic_category: "历史遗迹",
    restaurant_category: "美食",
    cafe_category: "咖啡馆",
    other_category: "其他",
    travel_expense_label: "旅行费用 (韩元)",
    travel_expense_placeholder: "请输入旅行费用",
    expense_auto_save_notice: "将自动记录到账本",
    enter_destination: "请输入目的地",
    enter_dates: "请输入出发日期和结束日期",
    travel_saved: "旅行记录已保存！",
    travel_delete_confirm: "是否删除此旅行记录？",
    no_travel_records: "还没有旅行记录",
    add_first_travel: "添加您的第一条旅行记录！",
    file: "文件",
    close_image: "放大图片",
    close: "关闭",
    new_travel_record: "新旅行记录",
    edit_travel_record: "编辑旅行记录",
    coordinates_calculated: "坐标计算",
    attachments_count_label: "附件",
    travel_expense_with_unit: "旅行费用",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI行程优化",
    ai_travel_optimizer_description: "AI根据目的地、旅行期间和预算自动生成最佳旅行行程。",
    destination_label: "目的地",
    destination_placeholder: "例如：首尔、济州岛、东京",
    start_date_label: "开始日期",
    end_date_label: "结束日期",
    budget_label: "预算",
    budget_placeholder: "预计旅行费用（韩元）",
    travel_style_label: "旅行风格",
    select_style: "选择",
    sightseeing: "观光为主",
    relaxation: "休闲/疗养",
    food_tour: "美食之旅",
    adventure: "冒险/活动",
    cultural: "文化/历史",
    generate_itinerary: "生成行程",
    optimizing: "优化中...",
    trip_summary: "旅行摘要",
    day: "Day",
    recommendations: "推荐",
    recommended_restaurants: "推荐餐厅",
    recommended_attractions: "推荐景点",
    travel_tips: "旅行贴士",
    budget_breakdown: "预算分析",
    accommodation: "住宿",
    food: "餐费",
    transportation: "交通",
    activities: "观光/体验",
    total: "合计",
    apply_to_schedule: "添加到日程",
    regenerate: "重新生成",
    itinerary_applied: "行程已添加",
    optimization_failed: "优化失败",
    please_fill_required_fields: "请填写必填项",

    // Weather Section
    loading_weather: "正在加载天气数据...",
    refresh: "刷新",
    current_temp: "当前温度",
    weather_status: "天气状况",
    feels_like: "体感温度",
    humidity: "湿度",
    wind_speed: "风速",
    air_quality: "空气质量",
    pm25: "PM2.5",
    pm10: "PM10",
    yellow_dust: "黄沙",
    large_particles: "大颗粒物",
    air_good: "良好",
    air_moderate: "一般",
    air_bad: "差",
    air_very_bad: "非常差",
    air_high: "高",
    air_low: "低",
    weekly_forecast: "每周预报",
    max_temp: "最高",
    min_temp: "最低",
    latitude: "纬度",
    longitude: "经度",

    // Statistics Section
    loading_stats: "加载统计中...",
    total_records: "总记录",
    precious_memories: "珍贵的回忆",

    // Settings Section
    backup_restore_title: "数据备份与恢复",
    backup_description: "可以将数据导出为JSON、CSV、Excel格式。只能用JSON格式恢复。",
    export_data: "导出数据",
    restore_backup: "恢复备份",
    restoring: "恢复中...",
    json_format: "JSON格式（可恢复）",
    csv_format: "CSV格式（只读）",
    excel_format: "Excel格式（只读）",
    login_required: "需要登录",
    csv_downloaded: "CSV文件已下载",
    csv_export_failed: "CSV导出失败",
    excel_downloaded: "Excel文件已下载",
    excel_export_failed: "Excel导出失败",
    backup_downloaded: "备份文件已下载",
    backup_error: "备份失败",
    restore_success: "恢复完成",
    restore_error: "恢复失败",
    not_logged_in: "未登录",
    logged_in: "已登录",
    user_guide_title: "用户指南",
    user_guide: "用户指南",
    open_guide: "打开指南",
    connection_status_title: "连接状态",
    connection_label: "Supabase连接",
    app_developer: "应用开发者",
    developer_info: "경기도김포시 장기동 이찬세",
    app_introduction: "应用介绍",
    app_introduction_description: "记录之森是一个一体化记录管理应用，可以在一个地方管理所有日常记录。",
    notes_description: "自由记录文字、照片、视频和语音。使用标签分类，便于搜索。",
    diaries_description: "记录每天的心情和天气。在日历上一目了然。",
    diaries: "日记",
    schedules: "日程",
    schedules_description: "注册日程后，会自动显示在主屏幕日历上。启用通知功能，不要错过重要日程。",
    travel_records: "旅行记录",
    travel_records_description: "输入目的地后，地图上会自动标记红点。附加照片、视频和语音备忘录，生动保存旅行回忆。",
    vehicle_records: "车辆管理",
    vehicle_records_description: "管理车辆维修记录和预防性维修计划。维修费用自动同步到账本。",
    health_records: "健康记录",
    health_records_description: "记录血压、血糖、体重和运动量，并在图表中查看趋势。还可以管理用药计划。",
    budget_description: "记录收入和支出，查看月度统计。按类别分析，了解消费模式。",
    business_cards_description: "拍摄名片照片，自动识别并保存信息。轻松管理联系人。",
    ai_auto_fill: "AI自动填充",
    extracting_card_info: "正在提取名片信息...",
    card_info_extracted: "名片信息已自动填充",
    card_extraction_failed: "提取名片信息失败",
    please_add_card_photo_first: "请先添加名片照片",
    weather_description: "查看当前位置的实时天气和空气质量信息。",
    radio_description: "在写记录时收听广播。",
    data_backup: "数据备份",
    data_backup_description: "可以将所有记录备份和恢复为JSON文件。建议定期备份。",

    // Diary Password
    set_diary_password: "设置日记密码",
    password_description: "设置密码以保护您的日记",
    new_password: "密码",
    password_placeholder: "至少4个字符",
    confirm_password: "确认密码",
    confirm_password_placeholder: "重新输入密码",
    set_password: "设置",
    skip: "跳过",
    locked_diary: "锁定的日记",
    enter_password_to_unlock: "输入密码以解锁日记",
    password: "密码",
    unlock: "解锁",
    password_too_short: "密码至少需要4个字符",
    password_mismatch: "密码不匹配",
    password_set: "日记密码已设置",
    enter_password: "请输入密码",
    unlocked: "已解锁",
    wrong_password: "密码错误",
    password_changed: "密码已更改",
    confirm_remove_password: "确定要删除密码吗？",
    password_removed: "密码已删除",
    lock_diary: "锁定日记",

    // Vehicle Section
    add_vehicle: "添加车辆",
    first_vehicle: "注册首辆车辆",
    vehicle_list: "车辆列表",
    new_vehicle: "新车辆",
    edit_vehicle: "编辑车辆",
    vehicle_name_placeholder: "车辆名称（例如：我的车）",
    license_plate_placeholder: "车牌号（例如：京A12345）",
    vehicle_type_placeholder: "车型（例如：轿车、SUV）",
    vehicle_model_placeholder: "型号（例如：2023索纳塔）",
    purchase_year_placeholder: "购买年份",
    insurance_placeholder: "保险公司",
    vehicle_type: "车型",
    vehicle_model: "型号",
    purchase_year: "购买年份",
    insurance: "保险",
    insurance_fee: "保险费",
    register: "注册",
    update: "更新",
    vehicle_name_and_plate_required: "请输入车辆名称和车牌号",
    vehicle_saved: "车辆已保存",
    save_error: "保存失败",
    delete_vehicle_confirm: "确定要删除这辆车吗？",
    deleted: "已删除",
    delete_error: "删除失败",
    no_vehicles: "未注册车辆",
    records_count: "维修记录",
    schedules_count: "预防性维护",
    records_unit: "条",
    tap_to_add_maintenance_and_schedule: "点击车辆可添加维修记录和预防性维护计划",

    // Maintenance
    add_maintenance: "添加维修记录",
    maintenance_input: "维修记录输入",
    maintenance_category: "维修分类",
    maintenance_date: "维修日期",
    engine_oil: "机油",
    tire: "轮胎",
    filter: "滤芯",
    repair: "维修",
    parts: "零件",
    mileage: "里程",
    km_unit: "km",
    mileage_placeholder: "输入里程",
    amount: "金额",
    won_unit: "元",
    amount_placeholder: "金额输入",
    memo_placeholder: "输入备注",
    save_maintenance: "保存维修记录",
    date_required: "请输入日期",
    maintenance_saved: "维修记录已保存",
    delete_maintenance_confirm: "删除此维修记录？",
    maintenance_history: "维修历史",
    attachments: "附件",
    attachments_count: "个",
    no_records: "没有记录",

    // Preventive Maintenance Schedule
    preventive_schedule: "预防性维修计划",
    preventive_input: "预防性维修输入",
    scheduled_date: "计划日期",
    estimated_mileage: "预计里程",
    estimated_mileage_placeholder: "输入预计里程",
    description: "说明",
    description_placeholder: "输入说明",
    alarm_setting: "提醒设置",
    alarm_days_before: "提前提醒天数",
    days_before_2: "提前2天",
    days_before_7: "提前7天",
    days_before_14: "提前14天",
    days_before_30: "提前30天",
    save_schedule: "保存计划",
    scheduled_date_required: "请输入计划日期",
    schedule_saved: "计划已保存",
    delete_schedule_confirm: "删除此计划？",
    alarm_notification: "提醒",
    maintenance_alarm_title: "维修提醒",
    maintenance_alarm_message: "计划维修",

    // Budget Section
    analyze_budget: "支出分析",
    analyzing_budget: "分析中...",
    budget_analysis_result: "支出分析结果",
    no_transactions_for_analysis: "分析할 거래 내역이 없습니다.",
    budget_analysis_failed: "支出分析に失敗しました。",
    budget_summary: "支出要约",
    highest_spending_category: "最多支出类别",
    saving_tips: "省钱技巧",
    monthly_goal: "下月目标",

    // Added translations
    customer_support: "客户支持",
    customer_support_description: "如果您在使用服务时有任何疑问或问题，请随时联系我们。",
    support_email: "支持邮箱",
    legal_information: "法律信息",
    privacy_policy: "隐私政策",
    terms_of_service: "服务条款",

    // Privacy Policy - Chinese
    privacy_last_updated: "最后更新：2025年1月",
    privacy_section1_title: "1. 个人信息收集和使用目的",
    privacy_section1_intro: "记录之森为以下目的收集和使用个人信息：",
    privacy_purpose1: "会员注册和认证：基于电子邮件的帐户管理",
    privacy_purpose2: "服务提供：日程、待办事项、备忘录、日记、预算、旅行、车辆、健康信息管理",
    privacy_purpose3: "服务改进和客户支持",
    privacy_section2_title: "2. 收集的个人信息项目",
    privacy_collected1: "必需：电子邮件地址、加密密码",
    privacy_collected2: "自动收集：服务使用记录、IP地址、Cookie",
    privacy_section3_title: "3. 个人信息存储和管理",
    privacy_storage_desc: "所有个人信息都安全地存储在Supabase（美国云服务）上。",
    privacy_supabase_desc:
      "Supabase已获得SOC2 Type 2和GDPR认证，提供企业级安全。数据经过加密存储，访问权限受到严格控制。",
    privacy_section4_title: "4. 个人信息保留期限",
    privacy_retention_desc: "保留至帐户删除为止。删除后立即删除数据。您可以随时从设置部分删除帐户。",
    privacy_section5_title: "5. 用户权利",
    privacy_right1: "查看和编辑个人信息：随时可在设置中查看和修改",
    privacy_right2: "数据导出：在设置中以JSON/CSV格式下载所有数据",
    privacy_right3: "帐户删除：随时可在设置中删除帐户和所有数据",
    privacy_section6_title: "6. 个人信息保护负责人",

    // Terms of Service - Chinese
    terms_last_updated: "最后更新：2025年1月",
    terms_section1_title: "1. 服务定义",
    terms_section1_desc: "记录之森是提供日程、待办事项、备忘录、日记、预算、旅行、车辆、健康管理等功能的网络服务。",
    terms_section2_title: "2. 会员注册",
    terms_section2_desc: "任何人都可以仅使用电子邮件地址自由注册。没有年龄、地区或其他限制。",
    terms_section3_title: "3. 提供的服务",
    terms_service1: "日程和待办事项管理",
    terms_service2: "备忘录和日记撰写",
    terms_service3: "预算和账簿管理",
    terms_service4: "旅行记录和计划",
    terms_service5: "车辆维护记录、健康信息跟踪、名片管理等",
    terms_section4_title: "4. 用户义务",
    terms_obligation1: "不得盗用他人个人信息或输入虚假信息",
    terms_obligation2: "不得将服务用于非法目的",
    terms_obligation3: "不得伤害他人或妨碍服务运营",
    terms_section5_title: "5. 版权",
    terms_section5_desc:
      "用户创建的内容的版权归用户所有。服务仅为提供服务目的使用用户内容，未经用户同意不会提供给第三方。",
    terms_section6_title: "6. 服务变更和中断",
    terms_section6_desc: "服务可能因系统检查、升级等原因暂时中断。重要变更将提前通知。",

    // Personal Information Section
    personal_information: "个人信息管理",
    account_information: "帐户信息",
    user_id: "用户ID",
    account_created: "注册日期",
    change_email: "更改电子邮件",
    update_email: "更新电子邮件",
    new_email: "新电子邮件",
    current_password: "当前密码",
    enter_password: "输入密码",
    updating: "更新中...",
    update: "更新",
    email_updated_success: "电子邮件已成功更改",
    email_update_error: "更改电子邮件时出错",
    data_management: "数据管理",
    data_management_description: "下载您的数据以备份或移至其他服务",
    download_my_data: "下载我的数据",
    download_data_confirm: "下载所有数据？",
    not_available: "无信息",
    fill_all_fields: "请填写所有字段",
    view: "查看",
    hide: "隐藏",
    view_data: "查看数据",
    data_export_description: "您可以使用上面的备份/恢复部分导出数据",

    danger_zone: "危险区",
    delete_account: "删除帐户",
    delete_account_title: "确认删除帐户",
    account_deletion_warning: "警告：删除帐户将永久删除所有数据，无法恢复。",
    delete_account_warning_title: "⚠️ 请确认：",
    delete_warning_1: "所有日程、待办事项、备忘录、日记、预算等数据将被删除",
    delete_warning_2: "已删除的数据无法恢复",
    delete_warning_3: "帐户将立即删除且无法撤销",
    delete_account_confirm_instruction: "请准确输入以下短语以继续：",
    delete_account_confirm_phrase: "删除我的帐户",
    delete_account_phrase_mismatch: "您输入的短语不匹配",
    account_deleted_success: "帐户已成功删除",
    account_deletion_failed: "帐户删除失败",
    deleting: "删除中...",
    delete_permanently: "永久删除",
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
    back: "戻る",
    back_to_forest: "森に戻る",

    year: "",
    month: "",

    steps_unit: "歩",
    krw_unit: "円",

    file_upload: "ファイルアップロード",
    take_photo: "写真を撮る",
    ocr_camera: "撮影→テキスト",
    ocr_upload: "画像→テキスト",
    handwriting: "手書き",
    speech_to_text: "音声→テキスト",
    speech_recognition: "音声認識中",
    stop_recognition: "認識停止",
    ocr_capture_and_process: "撮影とテキスト抽出",
    ocr_take_photo: "撮影してテキスト抽出",
    ocr_processing: "処理中",
    ocr_completed: "認識完了",
    ocr_no_text_found: "テキストが見つかりません",
    ocr_error_occurred: "認識エラー",
    clear: "クリア",
    stop_recording: "録音停止",
    audio_recording: "オーディオ録音",
    video_recording: "ビデオ録画",
    attachments: "添付ファイル",
    video_cannot_play: "動画を再生できません",
    audio_cannot_play: "音声を再生できません",
    audio_permission_required: "マイクの許可が必要です",
    video_permission_required: "カメラの許可が必要です",
    camera_permission_required: "カメラの許可が必要です",
    speech_recognition_not_supported: "ブラウザが音声認識をサポートしていません",
    mic_permission_required: "マイクの許可が必要です",
    speech_recognition_failed: "音声認識に失敗しました",

    // Sections
    notes: "ノート",
    diary: "日記",
    schedule: "スケジュール",
    health: "健康",
    travel: "旅行",
    vehicle: "車両",
    budget: "家計簿",
    business_card: "名刺",
    business_cards: "名刺",
    radio: "ラジオ",
    weather: "天気",
    statistics: "統計",
    settings: "設定",

    // Notes
    title_label: "タイトル",
    title_required: "タイトルを入力してください",
    content: "内容",
    tags_placeholder: "タグ（カンマ区切り）",
    attached_files: "添付ファイル",
    filter_by_tag: "タグでフィルター",

    organize_meeting_minutes: "AI会議議事録整理",
    organizing_meeting: "整理中...",
    content_required_for_organize: "議事録の内容を入力してください",
    confirm_organize_meeting: "AIが議事録を整理します。続行しますか？",
    meeting_organized_success: "議事録が整理されました！",
    meeting_organize_failed: "議事録の整理に失敗しました",
    summarize_note: "AIノート要約",
    summarizing: "要約中...",
    content_required_for_summary: "要約する内容を入力してください",
    note_summarized_success: "ノートを要約しました！",
    note_summary_failed: "ノート要約に失敗しました",
    summary_result: "要約結果",
    replace_with_summary: "要約で置換",
    add_summary_below: "下に追加",
    translate_note: "AI翻訳",
    translating: "翻訳中...",
    content_required_for_translation: "翻訳する内容を入力してください",
    translation_result: "翻訳結果",
    replace_with_translation: "翻訳で置換",
    add_translation_below: "下に追加",
    select_target_language: "翻訳先言語を選択",
    translate_to_korean: "韓国語に翻訳",
    translate_to_english: "英語に翻訳",
    translate_to_chinese: "中国語に翻訳",
    translate_to_japanese: "日本語に翻訳",
    translation_failed: "翻訳に失敗しました",

    // Health Section
    health_record: "健康記録",
    health_record_btn: "健康記録",
    add_health_record: "健康記録を追加",
    medication_management_title: "服薬管理",
    medication_management: "服薬管理",
    medication_management_btn: "服薬管理",
    health_statistics: "統計",
    health_graph: "グラフ",
    view_graph: "グラフを表示",
    recent_records: "最近の記録",
    vital_signs: "バイタルサイン",
    exercise: "運動",
    medical_expenses: "医療費",
    record_type: "記録タイプ",
    blood_pressure: "血圧",
    blood_sugar: "血糖値",
    temperature: "体温",
    weight: "体重",
    steps: "歩数",
    distance: "距離",
    medical_expense: "医療費",
    medication_expense: "薬代",
    medication_cost: "薬代",
    memo: "メモ",
    medication_name: "薬品名",
    dosage: "用量",
    frequency: "服用頻度",
    time: "服用時間",
    start_date: "開始日",
    end_date: "終了日",
    add_time: "時間を追加",
    add_medication: "服薬を追加",
    save_medication_schedule: "服薬予定を保存",
    enable_alarm: "アラームを有効にする",
    date_label: "日付",
    systolic_bp: "収縮期血圧",
    diastolic_bp: "拡張期血圧",
    systolic_placeholder: "例：120",
    diastolic_placeholder: "例：80",
    blood_sugar_placeholder: "例：100",
    temperature_placeholder: "例：36.5",
    weight_placeholder: "例：70.0",
    steps_placeholder: "例：10000",
    distance_placeholder: "例：5.0",
    medical_expense_placeholder: "医療費を入力",
    medication_expense_placeholder: "薬代を入力",
    memo_additional: "追加メモ",
    medicine_name: "薬品名",
    medicine_name_placeholder: "薬品名を入力してください",
    dosage_placeholder: "例：1錠",
    frequency_placeholder: "例：1日3回",
    medication_times: "服薬時間",
    end_date_optional: "終了日（任意）",
    add_medication_schedule: "服薬予定を追加",
    dosage_label: "用量：",
    frequency_label: "頻度：",
    today_medication_times: "今日の服薬時間",
    systolic: "収縮期",
    diastolic: "拡張期",
    no_health_records_message: "健康記録がありません。追加してください！",
    medical_and_medication_expenses: "医療費と薬代",
    total_expense: "総費用",

    medical_contacts: "医療連絡先",
    medical_contacts_btn: "連絡先",
    manage_medical_contacts: "連絡先管理",
    add_medical_contact: "連絡先を追加",
    contact_type: "種類",
    hospital: "病院",
    clinic: "クリニック",
    pharmacy: "薬局",
    contact_name: "機関名",
    contact_phone: "電話番号",
    contact_address: "住所",
    contact_notes: "メモ",
    contact_name_placeholder: "例：東京大学病院",
    contact_phone_placeholder: "例：03-1234-5678",
    contact_address_placeholder: "住所を入力してください",
    no_medical_contacts_message: "医療連絡先がありません。連絡先を追加してください！",
    save_contact: "連絡先を保存",

    // To-Do List translations for Japanese
    todo: "やること",
    todo_list: "やることリスト",
    add_todo: "やることの追加",
    todo_title: "やること",
    todo_title_required: "やることのタイトルを入力してください",
    todo_description: "説明",
    todo_priority: "優先度",
    priority_low: "低",
    priority_medium: "中",
    priority_high: "高",
    todo_due_date: "期限",
    todo_repeat: "繰り返し",
    repeat_none: "繰り返しなし",
    repeat_daily: "毎日",
    repeat_weekly: "毎週",
    repeat_monthly: "毎月",
    todo_alarm: "アラーム",
    todo_alarm_notification: "やることリマインダー",
    invalid_alarm_time: "無効なアラーム時間",
    todo_completed: "完了",
    todo_incomplete: "未完了",
    mark_as_completed: "完了にする",
    mark_as_incomplete: "未完了にする",
    no_todos_message: "やることがありません。新しいものを追加してください！",
    voice_input_todo: "音声で追加",
    voice_input_active: "音声認識中...",
    total_todos: "合計やること",
    completed_todos: "完了したやること",
    pending_todos: "保留中のやること",
    filter_all: "すべて",
    filter_active: "進行中",
    filter_completed: "完了",
    confirm_delete: "本当に削除しますか？",
    delete_success: "削除されました！",
    delete_failed: "削除失敗",

    // Schedule Section
    special_days: "特別な日",
    general_schedule: "スケジュール",
    special_day_reminder: "特別な日です！",
    event_name: "名前",
    category: "分類",
    birthday: "誕生日",
    anniversary: "記念日",
    holiday: "祝日",
    vacation: "休日",
    meeting: "会議",
    other: "その他",
    alarm_time: "アラーム時間",
    alarm_settings: "アラーム設定",
    enable_alarm_before_event: "イベント前にアラームを有効にする",
    minutes_before: "分前",
    "5_min_before": "5分前",
    "10_min_before": "10分前",
    "15_min_before": "15分前",
    minutes_before_30: "30分前",
    hours_before_1: "1時間前",
    hours_before_3: "3時間前",
    day_before_1: "1日前",
    days_before_3: "3日前",
    week_before_1: "1週間前",
    special_days_batch_title: "✨ 特別な日一括登録",
    special_days_batch_description: "家族の誕生日、記念日などを一度に登録してください",
    schedule_number: "スケジュール",
    save_schedules_count: "スケジュールを保存",
    special_day_name_placeholder: "特別な日の名前",
    alarm: "アラーム",
    day_off: "休日",
    "30_min_before": "30分前",
    "1_hour_before": "1時間前",
    "2_hours_before": "2時間前",
    "12_hours_before": "12時間前",
    "1_day_before": "1日前",
    "2_days_before": "2日前",
    "1_week_before": "1週間前",
    add_schedule: "スケジュール追加",
    download_ics_description: "ICSファイルとしてダウンロードして携帯カレンダーに追加",
    title_label: "タイトル",
    category_label: "分類",
    description_label: "説明",
    attachments_label: "添付ファイル",

    // Travel Section
    travel_map: "旅行マップ",
    map_zoom_instruction: "ズーム",
    map_drag_instruction: "ドラッグして移動",
    map_button_instruction: "+/-ボタンで拡大縮小",
    destination_label: "目的地",
    destination_placeholder: "例：済州ハルラ山、ソウル南山、パリ、ニューヨーク",
    latitude_label: "緯度",
    longitude_label: "経度",
    auto_or_manual_input: "自動計算または手動入力",
    select_location_cancel: "位置選択をキャンセル",
    select_location_on_map: "地図で直接位置を選択",
    select_location_instruction: "地図をクリックして正確な位置を選択してください",
    location_selected_message: "位置が選択されました！",
    start_date_label: "出発日",
    end_date_label: "終了日",
    category_label: "カテゴリ",
    city_category: "都市",
    nature_category: "自然",
    mountain_category: "山",
    sea_category: "海",
    historic_category: "史跡",
    restaurant_category: "レストラン",
    cafe_category: "カフェ",
    other_category: "その他",
    travel_expense_label: "旅行費用 (ウォン)",
    travel_expense_placeholder: "旅行費用を入力してください",
    expense_auto_save_notice: "家計簿に自動的に記録されます",
    enter_destination: "目的地を入力してください",
    enter_dates: "出発日と終了日を入力してください",
    travel_saved: "旅行記録が保存されました！",
    travel_delete_confirm: "この旅行記録を削除しますか？",
    no_travel_records: "旅行記録がまだありません",
    add_first_travel: "最初の旅行記録を追加してください！",
    file: "ファイル",
    close_image: "拡大画像",
    close: "閉じる",
    new_travel_record: "新しい旅行記録",
    edit_travel_record: "旅行記録を編集",
    coordinates_calculated: "座標計算",
    attachments_count_label: "添付ファイル",
    travel_expense_with_unit: "旅行費用",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI旅行日程最適化",
    ai_travel_optimizer_description: "AIが目的地、旅行期間、予算に基づいて最適な旅行日程を自動生成します。",
    destination_label: "目的地",
    destination_placeholder: "例：ソウル、済州島、東京",
    start_date_label: "開始日",
    end_date_label: "終了日",
    budget_label: "予算",
    budget_placeholder: "予想旅行費用（ウォン）",
    travel_style_label: "旅行スタイル",
    select_style: "選択",
    sightseeing: "観光中心",
    relaxation: "休養/ヒーリング",
    food_tour: "グルメツアー",
    adventure: "アクティビティ/冒険",
    cultural: "文化/歴史探訪",
    generate_itinerary: "日程生成",
    optimizing: "最適化中...",
    trip_summary: "旅行概要",
    day: "Day",
    recommendations: "おすすめ",
    recommended_restaurants: "おすすめレストラン",
    recommended_attractions: "おすすめ観光地",
    travel_tips: "旅行のヒント",
    budget_breakdown: "予算分析",
    accommodation: "宿泊",
    food: "食費",
    transportation: "交通",
    activities: "観光/体験",
    total: "合計",
    apply_to_schedule: "日程に追加",
    regenerate: "再生成",
    itinerary_applied: "旅行日程が追加されました",
    optimization_failed: "最適化に失敗しました",
    please_fill_required_fields: "必須項目を入力してください",

    // Weather Section
    loading_weather: "天気データを読み込み中...",
    refresh: "更新",
    current_temp: "現在の気温",
    weather_status: "天気状況",
    feels_like: "体感温度",
    humidity: "湿度",
    wind_speed: "風速",
    air_quality: "大気質",
    pm25: "PM2.5",
    pm10: "PM10",
    yellow_dust: "黄砂",
    large_particles: "大粒子",
    air_good: "良い",
    air_moderate: "普通",
    air_bad: "悪い",
    air_very_bad: "非常に悪い",
    air_high: "高い",
    air_low: "低い",
    weekly_forecast: "週間予報",
    max_temp: "最高",
    min_temp: "最低",
    latitude: "緯度",
    longitude: "経度",

    // Statistics Section
    loading_stats: "統計を読み込み中...",
    total_records: "総記録",
    precious_memories: "大切な思い出",

    // Settings Section
    backup_restore_title: "データバックアップと復元",
    backup_description: "データをJSON、CSV、Excel形式でエクスポートできます。JSON形式のみ復元可能です。",
    export_data: "データエクスポート",
    restore_backup: "バックアップ復元",
    restoring: "復元中...",
    json_format: "JSON形式（復元可能）",
    csv_format: "CSV形式（読み取り専用）",
    excel_format: "Excel形式（読み取り専用）",
    login_required: "ログインが必要です",
    csv_downloaded: "CSVファイルがダウンロードされました",
    csv_export_failed: "CSVエクスポート失敗",
    excel_downloaded: "Excelファイルがダウンロードされました",
    excel_export_failed: "Excelエクスポート失敗",
    backup_downloaded: "バックアップファイルがダウンロードされました",
    backup_error: "バックアップ失敗",
    restore_success: "復元が完了しました",
    restore_error: "復元失敗",
    not_logged_in: "ログインしていません",
    logged_in: "ログイン済み",
    user_guide_title: "ユーザーガイド",
    user_guide: "ユーザーガイド",
    open_guide: "ガイドを開く",
    connection_status_title: "接続状態",
    connection_label: "Supabase接続",
    app_developer: "アプリ開発者",
    developer_info: "京畿道金浦市長期洞 イ・チャンセ",
    app_introduction: "アプリ紹介",
    app_introduction_description:
      "記録の森は、日常のすべての記録を一か所で管理できるオールインワン記録管理アプリです。",
    notes_description: "テキスト、写真、動画、音声を自由に記録してください。タグで分類して簡単に検索できます。",
    diaries_description: "毎日の気分と天気を記録してください。カレンダーで一目で確認できます。",
    diaries: "日記",
    schedules: "スケジュール",
    schedules_description:
      "スケジュールを登録すると、メイン画面のカレンダーに自動的に表示されます。通知機能を有効にして、重要なスケジュールを見逃さないでください。",
    travel_records: "旅行記録",
    travel_records_description:
      "目的地を入力すると、地図上に赤い点で自動的にマークされます。写真、動画、音声メモを添付して、旅行の思い出を鮮明に保存してください。",
    vehicle_records: "車両管理",
    vehicle_records_description:
      "車両整備履歴と予防整備スケジュールを管理してください。整備費用は自動的に家計簿に連動されます。",
    health_records: "健康記録",
    health_records_description:
      "血圧、血糖、体重、運動量を記録し、グラフでトレンドを確認してください。服薬スケジュールも管理できます。",
    budget_description:
      "収入と支出を記録し、月別統計を確認してください。カテゴリー別に分析して消費パターンを把握できます。",
    business_cards_description: "名刺を写真で撮って情報を自動認識して保存してください。連絡先を簡単に管理できます。",
    ai_auto_fill: "AI自動入力",
    extracting_card_info: "名刺情報を抽出中...",
    card_info_extracted: "名刺情報が自動的に入力されました",
    card_extraction_failed: "名刺情報の抽出に失敗しました",
    please_add_card_photo_first: "まず名刺の写真を追加してください",
    weather_description: "現在地のリアルタイム天気と大気質情報を確認してください。",
    radio_description: "ラジオ放送を聴きながら記録を作成してください。",
    data_backup: "データバックアップ",
    data_backup_description:
      "すべての記録をJSONファイルとしてバックアップおよび復元できます。定期的なバックアップをお勧めします。",

    // Diary Password
    set_diary_password: "日記パスワード設定",
    password_description: "日誌を保護するためのパスワードを設定します",
    new_password: "パスワード",
    password_placeholder: "最低4文字",
    confirm_password: "パスワード確認",
    confirm_password_placeholder: "パスワードを再入力",
    set_password: "設定",
    skip: "スキップ",
    locked_diary: "ロックされた日記",
    enter_password_to_unlock: "日記をロック解除するにはパスワードを入力してください",
    password: "パスワード",
    unlock: "ロック解除",
    password_too_short: "パスワードは最低4文字必要です",
    password_mismatch: "パスワードが一致しません",
    password_set: "日記パスワードが設定されました",
    enter_password: "パスワードを入力してください",
    unlocked: "ロック解除済み",
    wrong_password: "パスワードが違います",
    password_changed: "パスワードが変更されました",
    confirm_remove_password: "本当にパスワードを削除しますか？",
    password_removed: "パスワードが削除されました",
    lock_diary: "日記をロック",

    // Vehicle Section
    add_vehicle: "車両追加",
    first_vehicle: "最初の車両を登録",
    vehicle_list: "車両リスト",
    new_vehicle: "新しい車両",
    edit_vehicle: "車両編集",
    vehicle_name_placeholder: "車両名（例：マイカー）",
    license_plate_placeholder: "ナンバープレート（例：品川 330 あ 1234）",
    vehicle_type_placeholder: "車種（例：セダン、SUV）",
    vehicle_model_placeholder: "モデル（例：2023 ソナタ）",
    purchase_year_placeholder: "購入年",
    insurance_placeholder: "保険会社",
    vehicle_type: "車種",
    vehicle_model: "モデル",
    purchase_year: "購入年",
    insurance: "保険",
    insurance_fee: "保険料",
    register: "登録",
    update: "更新",
    vehicle_name_and_plate_required: "車両名とナンバープレートを入力してください",
    vehicle_saved: "車両が保存されました",
    save_error: "保存失敗",
    delete_vehicle_confirm: "この車両を削除しますか？",
    deleted: "削除されました",
    delete_error: "削除失敗",
    no_vehicles: "登録された車両がありません",
    records_count: "整備記録",
    schedules_count: "予防整備",
    records_unit: "件",
    tap_to_add_maintenance_and_schedule: "車両をタップすると整備記録と予防整備スケジュールを入力できます",

    // Maintenance
    add_maintenance: "整備記録追加",
    maintenance_input: "整備記録入力",
    maintenance_category: "整備分類",
    maintenance_date: "整備日",
    engine_oil: "エンジンオイル",
    tire: "タイヤ",
    filter: "フィルター",
    repair: "修理",
    parts: "部品",
    mileage: "走行距離",
    km_unit: "km",
    mileage_placeholder: "走行距離入力",
    amount: "金額",
    won_unit: "円",
    amount_placeholder: "金額入力",
    memo_placeholder: "メモ入力",
    save_maintenance: "整備記録保存",
    date_required: "日付を入力してください",
    maintenance_saved: "整備記録が保存されました",
    delete_maintenance_confirm: "この整備記録を削除しますか？",
    maintenance_history: "整備履歴",
    attachments: "添付ファイル",
    attachments_count: "個",
    no_records: "記録がありません",

    // Preventive Maintenance Schedule
    preventive_schedule: "予防整備スケジュール",
    preventive_input: "予防整備入力",
    scheduled_date: "予定日",
    estimated_mileage: "予想走行距離",
    estimated_mileage_placeholder: "予想走行距離入力",
    description: "説明",
    description_placeholder: "説明入力",
    alarm_setting: "アラーム設定",
    alarm_days_before: "何日前にアラーム",
    days_before_2: "2日前",
    days_before_7: "7日前",
    days_before_14: "14日前",
    days_before_30: "30日前",
    save_schedule: "スケジュール保存",
    scheduled_date_required: "予定日を入力してください",
    schedule_saved: "スケジュールが保存されました",
    delete_schedule_confirm: "このスケジュールを削除しますか？",
    alarm_notification: "アラーム",
    maintenance_alarm_title: "整備アラーム",
    maintenance_alarm_message: "予定された整備",

    // Budget Section
    analyze_budget: "支出分析",
    analyzing_budget: "分析中...",
    budget_analysis_result: "支出分析結果",
    no_transactions_for_analysis: "分析할 거래 내역이 없습니다.",
    budget_analysis_failed: "支出分析に失敗しました。",
    budget_summary: "支出要约",
    highest_spending_category: "最多支出类别",
    saving_tips: "省钱技巧",
    monthly_goal: "下月目标",

    // Added translations
    customer_support: "カスタマーサポート",
    customer_support_description: "サービスのご利用中にご質問や問題が発生した場合は、いつでもお問い合わせください。",
    support_email: "サポートメール",
    legal_information: "法的情報",
    privacy_policy: "プライバシーポリシー",
    terms_of_service: "利用規約",

    // Privacy Policy - Japanese
    privacy_last_updated: "最終更新：2025年1月",
    privacy_section1_title: "1. 個人情報の収集および利用目的",
    privacy_section1_intro: "記録の森は、以下の目的で個人情報を収集・利用します：",
    privacy_purpose1: "会員登録と認証：メールベースのアカウント管理",
    privacy_purpose2: "サービス提供：スケジュール、タスク、メモ、日記、予算、旅行、車両、健康情報管理",
    privacy_purpose3: "サービス改善とカスタマーサポート",
    privacy_section2_title: "2. 収集する個人情報項目",
    privacy_collected1: "必須：メールアドレス、暗号化パスワード",
    privacy_collected2: "自動収集：サービス利用記録、IPアドレス、クッキー",
    privacy_section3_title: "3. 個人情報の保管と管理",
    privacy_storage_desc: "すべての個人情報はSupabase（米国クラウドサービス）に安全に保管されます。",
    privacy_supabase_desc:
      "SupabaseはSOC2 Type 2およびGDPR認証を取得しており、エンタープライズグレードのセキュリティを提供します。データは暗号化され、アクセス権限は厳格に管理されます。",
    privacy_section4_title: "4. 個人情報の保有期間",
    privacy_retention_desc:
      "アカウント削除まで保有し、削除時に即座に削除されます。設定からいつでもアカウントを削除できます。",
    privacy_section5_title: "5. ユーザーの権利",
    privacy_right1: "個人情報の閲覧と編集：設定からいつでも確認・修正可能",
    privacy_right2: "データエクスポート：設定からJSON/CSV形式ですべてのデータをダウンロード可能",
    privacy_right3: "アカウント削除：設定からいつでもアカウントとすべてのデータを削除可能",
    privacy_section6_title: "6. データ保護責任者",

    // Terms of Service - Japanese
    terms_last_updated: "最終更新：2025年1月",
    terms_section1_title: "1. サービス定義",
    terms_section1_desc:
      "記録の森は、スケジュール、タスク、メモ、日記、予算、旅行、車両、健康管理機能を提供するウェブベースのサービスです。",
    terms_section2_title: "2. 会員登録",
    terms_section2_desc: "誰でもメールアドレスだけで自由に登録できます。年齢、地域、その他の制限はありません。",
    terms_section3_title: "3. 提供するサービス",
    terms_service1: "スケジュールとタスク管理",
    terms_service2: "メモと日記作成",
    terms_service3: "予算と支出管理",
    terms_service4: "旅行記録と計画",
    terms_service5: "車両整備記録、健康追跡、名刺管理など",
    terms_section4_title: "4. ユーザーの義務",
    terms_obligation1: "他人の個人情報を盗用したり虚偽情報を入力しないこと",
    terms_obligation2: "サービスを不法な目的で使用しないこと",
    terms_obligation3: "他人に害を与えたりサービス運営を妨害しないこと",
    terms_section5_title: "5. 著作権",
    terms_section5_desc:
      "ユーザーが作成したコンテンツの著作権はユーザーに帰属します。サービスはユーザーのコンテンツをサービス提供目的でのみ使用し、同意なしに第三者と共有しません。",
    terms_section6_title: "6. サービスの変更と中断",
    terms_section6_desc:
      "システムメンテナンス、アップグレードなどの理由でサービスが一時的に中断される場合があります。重要な変更は事前に通知します。",

    // Personal Information Section
    personal_information: "個人情報管理",
    account_information: "アカウント情報",
    user_id: "ユーザーID",
    account_created: "登録日",
    change_email: "メールアドレス変更",
    update_email: "メールアドレス更新",
    new_email: "新しいメールアドレス",
    current_password: "現在のパスワード",
    enter_password: "パスワードを入力",
    updating: "更新中...",
    update: "更新",
    email_updated_success: "メールアドレスが正常に変更されました",
    email_update_error: "メールアドレスの変更中にエラーが発生しました",
    data_management: "データ管理",
    data_management_description: "データをダウンロードしてバックアップまたは他のサービスに移行できます",
    download_my_data: "データをダウンロード",
    download_data_confirm: "すべてのデータをダウンロードしますか？",
    not_available: "情報なし",
    fill_all_fields: "すべてのフィールドを入力してください",
    view: "表示",
    hide: "非表示",
    view_data: "データ閲覧",
    data_export_description: "上記のバックアップ/復元セクションを使用してデータをエクスポートできます",

    danger_zone: "危険ゾーン",
    delete_account: "アカウント削除",
    delete_account_title: "アカウント削除の確認",
    account_deletion_warning: "警告：アカウントを削除すると、すべてのデータが完全に削除され、復元できません。",
    delete_account_warning_title: "⚠️ 確認してください：",
    delete_warning_1: "すべてのスケジュール、タスク、メモ、日記、予算などのデータが削除されます",
    delete_warning_2: "削除されたデータは復元できません",
    delete_warning_3: "アカウントは即座に削除され、元に戻すことはできません",
    delete_account_confirm_instruction: "続行するには、次のフレーズを正確に入力してください：",
    delete_account_confirm_phrase: "アカウントを削除します",
    delete_account_phrase_mismatch: "入力したフレーズが一致しません",
    account_deleted_success: "アカウントが正常に削除されました",
    account_deletion_failed: "アカウントの削除に失敗しました",
    deleting: "削除中...",
    delete_permanently: "完全に削除",
  },
}

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language]?.[key] || translations.ko[key] || key
}
