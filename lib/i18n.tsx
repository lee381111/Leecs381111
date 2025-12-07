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
  | "privacy_right1"
  | "privacy_right2"
  | "privacy_right3"
  | "privacy_section5_title"
  | "privacy_section6_title"
  | "terms_of_service"
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
  | "announcement_management"
  | "new_announcement"
  | "edit_announcement"
  | "announcement_message"
  | "announcement_message_placeholder"
  | "announcement_type"
  | "type_info"
  | "type_warning"
  | "type_success"
  | "expires_at"
  | "active_announcements"
  | "no_announcements"
  | "expires"
  | "save_success"
  | "save_failed"
  | "update"
  | "personal_information"
  | "account_information"
  | "user_id"
  | "account_created"
  | "change_email"
  | "update_email"
  | "new_email"
  | "updating"
  | "data_management"
  | "data_management_description"
  | "view"
  | "hide"
  | "view_data"
  | "data_export_description"
  | "fill_all_fields"
  | "email_updated_success"
  | "email_update_error"

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
    email: "이메일",

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

    // Privacy Policy - Korean translations
    privacy_policy: "개인정보 처리방침",
    privacy_last_updated: "최종 수정일: 2025년 12월",
    privacy_section1_title: "1. 수집하는 정보",
    privacy_section1_intro: "서비스 제공을 위해 다음 정보를 수집합니다:",
    privacy_purpose1: "이메일 주소 (로그인 및 계정 관리)",
    privacy_purpose2: "사용자가 직접 입력하는 기록 데이터 (할일, 일정, 예산, 건강, 여행, 메모 등)",
    privacy_purpose3: "AI 기능 이용 시 해당 텍스트 (일시적 처리, 저장하지 않음)",
    privacy_section2_title: "2. 정보 저장 방식",
    privacy_collected1: "모든 데이터는 Supabase 클라우드에 암호화되어 저장됩니다",
    privacy_collected2: "Supabase는 SOC2, GDPR 인증을 받은 안전한 서비스입니다",
    privacy_section3_title: "3. 정보 사용 목적",
    privacy_storage_desc:
      "수집한 정보는 오직 서비스 제공(기록 저장, AI 분석)에만 사용되며, 제3자에게 판매하거나 제공하지 않습니다.",
    privacy_supabase_desc: "AI 기능 사용 시 Groq API에 텍스트가 전송되지만 저장되지 않습니다.",
    privacy_section4_title: "4. 개인정보의 보유 기간",
    privacy_retention_desc:
      "회원 탈퇴 시 모든 개인정보는 즉시 삭제됩니다. 단, 법령에서 정한 보관 의무가 있는 경우 해당 기간 동안 보관합니다.",
    privacy_section5_title: "5. 사용자의 권리",
    privacy_right1: "개인정보 열람 및 수정 (설정 > 개인정보 관리)",
    privacy_right2: "데이터 다운로드 (설정 > 백업/복원)",
    privacy_right3: "계정 삭제 (설정 > 위험 구역) - 모든 데이터 즉시 삭제",
    privacy_section6_title: "6. 보호책임자",

    // Terms of Service - Simplified Korean translations
    terms_of_service: "이용약관",
    terms_last_updated: "최종 수정일: 2025년 12월",
    terms_section1_title: "1. 서비스 정의",
    terms_section1_desc:
      "이 앱은 개인 생활 관리를 위한 서비스를 제공합니다. 기본 기능은 무료이며, 향후 프리미엄 기능이 추가될 수 있습니다.",
    terms_section2_title: "2. 회원가입",
    terms_section2_desc: "누구나 이메일 주소로 자유롭게 가입할 수 있습니다.",
    terms_section3_title: "3. 제공 서비스",
    terms_service1: "할일, 일정, 일기, 메모 관리",
    terms_service2: "예산, 건강, 여행, 차량 기록 관리",
    terms_service3: "AI 기반 분석 및 번역 (Groq AI 사용)",
    terms_service4: "데이터 백업 및 복원",
    terms_service5: "명함 관리, 날씨, 라디오 등",
    terms_section4_title: "4. 사용자의 의무",
    terms_obligation1: "타인의 개인정보를 무단으로 수집하거나 도용하지 않기",
    terms_obligation2: "서비스를 불법적인 목적으로 사용하지 않기",
    terms_obligation3: "계정 정보를 안전하게 관리하기",
    terms_section5_title: "5. 서비스 변경 및 공지",
    terms_section5_desc: "중요한 변경사항은 앱 상단 배너로 사전 공지합니다.",

    app_introduction: "앱 소개",
    app_introduction_description:
      "이 앱은 일정, 할일, 예산, 건강, 여행, 차량 등 일상 생활의 모든 기록을 한 곳에서 관리할 수 있는 통합 생활 관리 도구입니다.",
    notes_description: "메모, 회의록, 아이디어 등을 기록하고 AI로 요약 및 번역할 수 있습니다.",
    diaries_description: "매일의 일기를 작성하고 비밀번호로 보호할 수 있습니다.",
    schedules_description: "일정을 캘린더 형식으로 관리하고 알림을 설정할 수 있습니다.",
    travel_records_description: "여행 계획을 세우고 AI로 일정을 최적화할 수 있습니다.",
    vehicle_records_description: "차량 정비 기록과 예방 정비 일정을 관리할 수 있습니다.",
    health_records_description: "건강 데이터, 복약 일정, 의료 연락처를 관리할 수 있습니다.",
    budget_description: "수입과 지출을 기록하고 AI로 예산을 분석할 수 있습니다.",
    business_cards_description: "명함을 촬영하여 자동으로 정보를 추출하고 관리할 수 있습니다.",
    weather_description: "현재 날씨와 예보를 확인할 수 있습니다.",
    radio_description: "다양한 라디오 채널을 들을 수 있습니다.",
    data_backup: "데이터 백업",
    data_backup_description: "모든 데이터를 JSON, CSV, Excel 형식으로 내보내거나 가져올 수 있습니다.",
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
    email: "Email",

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

    // Privacy Policy - English translations
    privacy_policy: "Privacy Policy",
    privacy_last_updated: "Last Updated: December 2025",
    privacy_section1_title: "1. Information We Collect",
    privacy_section1_intro: "We collect the following information to provide our service:",
    privacy_purpose1: "Email address (for login and account management)",
    privacy_purpose2: "User-entered data (todos, schedules, budget, health, travel, notes, etc.)",
    privacy_purpose3: "Text for AI features (processed temporarily, not stored)",
    privacy_section2_title: "2. Data Storage",
    privacy_collected1: "All data is encrypted and stored in Supabase cloud",
    privacy_collected2: "Supabase is SOC2 and GDPR certified",
    privacy_section3_title: "3. How We Use Information",
    privacy_storage_desc:
      "Collected information is used only for service provision (data storage, AI analysis) and is never sold or shared with third parties.",
    privacy_supabase_desc: "When using AI features, text is sent to Groq API but not stored.",
    privacy_section4_title: "4. Data Retention Period",
    privacy_retention_desc:
      "All personal information is deleted immediately upon account withdrawal. However, if there is a legal obligation to retain data, it will be kept for the required period.",
    privacy_section5_title: "5. Your Rights",
    privacy_right1: "View and edit personal information (Settings > Personal Information)",
    privacy_right2: "Download data (Settings > Backup/Restore)",
    privacy_right3: "Delete account (Settings > Danger Zone) - All data deleted immediately",
    privacy_section6_title: "6. Data Protection Officer",

    // Terms of Service - Simplified English translations
    terms_of_service: "Terms of Service",
    terms_last_updated: "Last Updated: December 2025",
    terms_section1_title: "1. Service Definition",
    terms_section1_desc:
      "This app provides services for personal life management. Basic features are free, and premium features may be added in the future.",
    terms_section2_title: "2. Membership Registration",
    terms_section2_desc: "Anyone can sign up freely with an email address.",
    terms_section3_title: "3. Services Provided",
    terms_service1: "Todo, Schedule, Diary, Note Management",
    terms_service2: "Budget, Health, Travel, Vehicle Record Management",
    terms_service3: "AI-based analysis and translation (using Groq AI)",
    terms_service4: "Data Backup and Restore",
    terms_service5: "Business Card Management, Weather, Radio, etc.",
    terms_section4_title: "4. User Obligations",
    terms_obligation1: "Do not collect or misuse others' personal information without authorization",
    terms_obligation2: "Do not use the service for illegal purposes",
    terms_obligation3: "Manage account information securely",
    terms_section5_title: "5. Service Changes and Announcements",
    terms_section5_desc: "Important changes will be announced in advance via a banner at the top of the app.",

    app_introduction: "App Introduction",
    app_introduction_description:
      "This app is an integrated life management tool that allows you to manage all your daily life records in one place, including schedules, todos, budgets, health, travel, and vehicles.",
    notes_description: "Record notes, meeting minutes, ideas, etc., and summarize or translate them with AI.",
    diaries_description: "Write daily entries and protect them with a password.",
    schedules_description: "Manage schedules in a calendar format and set reminders.",
    travel_records_description: "Plan your travels and optimize itineraries with AI.",
    vehicle_records_description: "Manage vehicle maintenance records and preventive maintenance schedules.",
    health_records_description: "Manage health data, medication schedules, and medical contacts.",
    budget_description: "Record income and expenses, and analyze your budget with AI.",
    business_cards_description: "Scan business cards to automatically extract and manage information.",
    weather_description: "Check current weather and forecasts.",
    radio_description: "Listen to various radio channels.",
    data_backup: "Data Backup",
    data_backup_description: "Export all your data in JSON, CSV, or Excel format.",
  },
}

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] || translations.ko[key] || key
}
