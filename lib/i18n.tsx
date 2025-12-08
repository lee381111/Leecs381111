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
  | "app_designer"
  | "designer_info"
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
  | "privacy_policy_description"
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
  | "terms_of_service_description"
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
  | "terms_termination1"
  | "terms_termination2"
  | "terms_termination3"
  | "terms_termination4"
  | "terms_section6_title"
  | "privacy_section7_title"
  | "privacy_termination_desc"
  | "privacy_data_deletion"
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
  | "data_deletion_report"
  | "data_deletion_report_desc"
  | "generate_report"
  | "generating_report"
  | "report_generated"
  | "report_generation_failed"

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
    privacy_policy_description: "개인정보 수집 및 사용에 관한 정책을 확인하세요",
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
    privacy_section7_title: "7. 서비스 종료 시 개인정보 처리",
    privacy_termination_desc: "서비스 종료 시 사용자에게 30일 전 공지하며, 데이터 내보내기 기간을 제공합니다.",
    privacy_data_deletion: "서비스 종료 후 30일 이내에 모든 개인정보를 Supabase 데이터베이스에서 완전히 삭제합니다.",

    // Terms of Service - Simplified Korean translations
    terms_of_service: "이용약관",
    terms_of_service_description: "서비스 이용 약관 및 규정을 확인하세요",
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
    terms_section6_title: "6. 서비스 중단 및 종료",
    terms_termination1: "운영자는 다음 사유로 서비스를 중단할 수 있습니다: 천재지변, 시스템 장애, 경영상 이유",
    terms_termination2: "서비스 종료 시 최소 30일 전 앱 상단 배너로 공지합니다",
    terms_termination3: "종료 공지 후 30일간 데이터 내보내기 기능을 제공합니다",
    terms_termination4: "무료 서비스이므로 서비스 중단으로 인한 손해배상 책임은 제한됩니다",

    // Settings section - Personal Information translations for Korean
    personal_information: "개인정보 관리",
    view: "보기",
    hide: "숨기기",
    account_information: "계정 정보",
    user_id: "사용자 ID",
    account_created: "가입일",
    change_email: "이메일 변경",
    update_email: "이메일 업데이트",
    new_email: "새 이메일",
    enter_password: "비밀번호 입력",
    updating: "업데이트 중...",
    data_management: "데이터 관리",
    data_management_description: "회원님의 개인정보를 확인하고 관리할 수 있습니다.",
    view_data: "데이터 조회",
    data_export_description: "위 백업/복원 섹션의 데이터 내보내기 기능을 사용하세요.",
    fill_all_fields: "모든 필드를 입력해주세요",
    email_updated_success: "이메일이 성공적으로 업데이트되었습니다",
    email_update_error: "이메일 업데이트 중 오류가 발생했습니다",

    // Danger Zone
    danger_zone: "위험 구역",
    account_deletion_warning: "계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.",
    data_deletion_report: "개인정보 파기 대장 생성",
    data_deletion_report_desc: "서비스 종료 시 법적 증명을 위한 개인정보 파기 대장을 생성합니다.",
    generate_report: "파기 대장 생성",
    generating_report: "생성 중...",
    report_generated: "파기 대장이 생성되었습니다",
    report_generation_failed: "파기 대장 생성에 실패했습니다",
    delete_account: "계정 삭제",
    delete_account_title: "계정 삭제",
    delete_account_warning_title: "⚠️ 경고: 이 작업은 되돌릴 수 없습니다",
    delete_warning_1: "모든 기록 (할일, 일정, 예산, 건강, 여행 등)이 영구 삭제됩니다",
    delete_warning_2: "계정 정보가 완전히 삭제됩니다",
    delete_warning_3: "삭제 후에는 복구가 불가능합니다",
    delete_account_confirm_instruction: "계속하려면 아래에 다음 문구를 정확히 입력하세요:",
    delete_account_confirm_phrase: "계정을 영구적으로 삭제합니다",
    delete_account_phrase_mismatch: "입력한 문구가 일치하지 않습니다",
    account_deleted_success: "계정이 성공적으로 삭제되었습니다",
    account_deletion_failed: "계정 삭제 중 오류가 발생했습니다",
    deleting: "삭제 중...",
    delete_permanently: "영구 삭제",

    // Announcement Management
    announcement_management: "공지사항 관리",
    new_announcement: "새 공지사항",
    edit_announcement: "공지사항 수정",
    announcement_message: "공지사항 메시지",
    announcement_message_placeholder: "사용자에게 표시할 공지사항을 입력하세요",
    announcement_type: "공지 유형",
    type_info: "정보",
    type_warning: "경고",
    type_success: "성공",
    expires_at: "만료일",
    active_announcements: "활성 공지사항",
    no_announcements: "활성 공지사항이 없습니다",
    expires: "만료",
    save_success: "저장되었습니다!",
    save_failed: "저장 실패",
    update: "업데이트",
    app_developer: "앱 개발자",
    developer_info: "김포시 장기동 이찬세",
    app_designer: "앱 디자이너",
    designer_info: "김포시 장기동 이찬세",
    back_to_forest: "숲으로 돌아가기",
    customer_support: "고객 지원",
    customer_support_description: "문의사항이 있으시면 아래 이메일로 연락해주세요.",
    support_email: "지원 이메일",
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
    diaries: "일기",
    schedules: "일정",
    travel_records: "여행 기록",
    vehicle_records: "차량 기록",
    health_records: "건강 기록",
    legal_information: "법적 정보",
    privacy_policy_description: "개인정보 수집 및 사용에 관한 정책을 확인하세요",
    terms_of_service_description: "서비스 이용 약관 및 규정을 확인하세요",
    set_diary_password: "일기 비밀번호 설정",
    password_description: "일기를 보호하기 위한 비밀번호를 설정하세요",
    new_password: "새 비밀번호",
    password_placeholder: "최소 4자 이상",
    confirm_password: "비밀번호 확인",
    confirm_password_placeholder: "비밀번호 재입력",
    set_password: "비밀번호 설정",
    skip: "건너뛰기",
    locked_diary: "잠긴 일기",
    enter_password_to_unlock: "비밀번호를 입력하여 일기를 확인하세요",
    password: "비밀번호",
    unlock: "잠금 해제",
    password_too_short: "비밀번호는 최소 4자 이상이어야 합니다",
    password_mismatch: "비밀번호가 일치하지 않습니다",
    password_set: "일기 비밀번호가 설정되었습니다",
    unlocked: "잠금이 해제되었습니다",
    wrong_password: "비밀번호가 틀렸습니다",
    password_changed: "비밀번호가 변경되었습니다",
    confirm_remove_password: "정말 비밀번호를 제거하시겠습니까?",
    password_removed: "비밀번호가 제거되었습니다",
    lock_diary: "일기 잠그기",

    // Vehicle Section Translations
    add_vehicle: "차량 추가",
    first_vehicle: "첫 차량 등록",
    vehicle_list: "차량 목록",
    new_vehicle: "새 차량",
    edit_vehicle: "차량 수정",
    vehicle_name_placeholder: "차량 이름 (예: 내 소나타)",
    license_plate_placeholder: "차량 번호",
    vehicle_type_placeholder: "차종 (예: 세단, SUV)",
    vehicle_model_placeholder: "모델명 (예: 2023년형)",
    purchase_year_placeholder: "구매년도 (예: 2023)",
    insurance_placeholder: "보험사 (예: 삼성화재)",
    vehicle_type: "차종",
    vehicle_model: "모델",
    purchase_year: "구매년도",
    insurance: "보험",
    insurance_fee: "보험료",
    register: "등록",
    update: "수정",
    vehicle_name_and_plate_required: "차량 이름과 번호를 입력해주세요",
    vehicle_saved: "차량이 저장되었습니다",
    save_error: "저장 중 오류가 발생했습니다",
    delete_vehicle_confirm: "이 차량을 삭제하시겠습니까?",
    deleted: "삭제되었습니다",
    delete_error: "삭제 중 오류가 발생했습니다",
    no_vehicles: "등록된 차량이 없습니다",
    records_count: "정비 기록",
    schedules_count: "정비 일정",
    records_unit: "건",
    tap_to_add_maintenance_and_schedule: "터치하여 정비 기록 및 일정 추가",
    add_maintenance: "정비 기록 추가",
    maintenance_input: "정비 기록 입력",
    maintenance_category: "정비 항목",
    maintenance_date: "정비 날짜",
    engine_oil: "엔진오일",
    tire: "타이어",
    filter: "필터",
    repair: "수리",
    parts: "부품",
    mileage: "주행거리",
    km_unit: "km",
    mileage_placeholder: "주행거리 입력",
    amount: "비용",
    won_unit: "원",
    amount_placeholder: "비용 입력",
    memo_placeholder: "메모 입력",
    save_maintenance: "정비 기록 저장",
    date_required: "날짜를 입력해주세요",
    maintenance_saved: "정비 기록이 저장되었습니다",
    delete_maintenance_confirm: "이 정비 기록을 삭제하시겠습니까?",
    maintenance_history: "정비 이력",
    attachments_count: "첨부",
    no_records: "기록이 없습니다",
    preventive_schedule: "예방 정비 일정",
    preventive_input: "예방 정비 입력",
    scheduled_date: "예정일",
    estimated_mileage: "예상 주행거리",
    estimated_mileage_placeholder: "예상 주행거리 입력",
    description: "설명",
    description_placeholder: "정비 내용 입력",
    alarm_setting: "알림 설정",
    alarm_days_before: "일 전 알림",
    days_before_1: "일 전",
    days_before_2: "2일 전",
    days_before_7: "7일 전",
    days_before_14: "14일 전",
    days_before_30: "30일 전",
    save_schedule: "일정 저장",
    scheduled_date_required: "예정일을 입력해주세요",
    schedule_saved: "일정이 저장되었습니다",
    delete_schedule_confirm: "이 일정을 삭제하시겠습니까?",
    maintenance_alarm_title: "차량 정비 알림",
    maintenance_alarm_message: "예정된 정비 일정",
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
    privacy_policy_description: "View our privacy policy and data collection practices",
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
    privacy_section7_title: "7. Personal Information Processing Upon Service Termination",
    privacy_termination_desc:
      "Users will be notified 30 days before service termination and provided with data export period.",
    privacy_data_deletion:
      "All personal information will be completely deleted from Supabase database within 30 days after service termination.",

    // Terms of Service - Simplified English translations
    terms_of_service: "Terms of Service",
    terms_of_service_description: "View service terms and conditions",
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
    terms_section5_title: "5. Service Changes and Notifications",
    terms_section5_desc: "Important changes will be notified via banner at the top of the app.",
    terms_section6_title: "6. Service Suspension and Termination",
    terms_termination1:
      "The operator may suspend the service for the following reasons: natural disasters, system failures, business reasons",
    terms_termination2: "Users will be notified at least 30 days in advance via app banner when service terminates",
    terms_termination3: "Data export feature will be provided for 30 days after termination notice",
    terms_termination4: "As a free service, liability for damages from service termination is limited",

    // Settings section - Personal Information translations for English
    personal_information: "Personal Information",
    view: "View",
    hide: "Hide",
    account_information: "Account Information",
    user_id: "User ID",
    account_created: "Account Created",
    change_email: "Change Email",
    update_email: "Update Email",
    new_email: "New Email",
    enter_password: "Enter Password",
    updating: "Updating...",
    data_management: "Data Management",
    data_management_description: "You can view and manage your personal information.",
    view_data: "View Data",
    data_export_description: "Use the data export feature in the Backup/Restore section above.",
    fill_all_fields: "Please fill all fields",
    email_updated_success: "Email updated successfully",
    email_update_error: "Error updating email",

    // Danger Zone
    danger_zone: "Danger Zone",
    account_deletion_warning: "Deleting your account will permanently erase all your data and cannot be recovered.",
    data_deletion_report: "Generate Data Deletion Report",
    data_deletion_report_desc: "Generate a data deletion report for legal proof upon service termination.",
    generate_report: "Generate Report",
    generating_report: "Generating...",
    report_generated: "Data deletion report generated",
    report_generation_failed: "Failed to generate data deletion report",
    delete_account: "Delete Account",
    delete_account_title: "Delete Account",
    delete_account_warning_title: "⚠️ Warning: This action is irreversible",
    delete_warning_1: "All your records (todos, schedules, budget, health, travel, etc.) will be permanently deleted",
    delete_warning_2: "Your account information will be completely erased",
    delete_warning_3: "Recovery will be impossible after deletion",
    delete_account_confirm_instruction: "To proceed, please type the following phrase exactly:",
    delete_account_confirm_phrase: "Permanently delete account",
    delete_account_phrase_mismatch: "The entered phrase does not match",
    account_deleted_success: "Your account has been successfully deleted",
    account_deletion_failed: "An error occurred while deleting your account",
    deleting: "Deleting...",
    delete_permanently: "Delete Permanently",

    // Announcement Management
    announcement_management: "Announcement Management",
    new_announcement: "New Announcement",
    edit_announcement: "Edit Announcement",
    announcement_message: "Announcement Message",
    announcement_message_placeholder: "Enter the announcement to display to users",
    announcement_type: "Announcement Type",
    type_info: "Info",
    type_warning: "Warning",
    type_success: "Success",
    expires_at: "Expires At",
    active_announcements: "Active Announcements",
    no_announcements: "No active announcements",
    expires: "Expires",
    save_success: "Saved successfully!",
    save_failed: "Save failed",
    update: "Update",
    app_developer: "App Developer",
    developer_info: "Lee Chan-se, Janggi-dong, Gimpo",
    app_designer: "App Designer",
    designer_info: "Lee Chan-se, Janggi-dong, Gimpo",
    back_to_forest: "Back to Forest",
    customer_support: "Customer Support",
    customer_support_description: "If you have any questions, please contact us via email below.",
    support_email: "Support Email",
    app_introduction: "App Introduction",
    app_introduction_description:
      "This app is an integrated life management tool that allows you to manage all your daily life records, including schedules, to-dos, budgets, health, travel, and vehicles, in one place.",
    notes_description: "Record notes, meeting minutes, ideas, and summarize/translate them with AI.",
    diaries_description: "Write daily diaries and protect them with a password.",
    schedules_description: "Manage your schedule in a calendar format and set reminders.",
    travel_records_description: "Plan your trips and optimize your itinerary with AI.",
    vehicle_records_description: "Manage vehicle maintenance records and preventive maintenance schedules.",
    health_records_description: "Manage your health data, medication schedules, and medical contacts.",
    budget_description: "Record income and expenses and analyze your budget with AI.",
    business_cards_description: "Scan business cards to automatically extract and manage information.",
    weather_description: "Check current weather and forecasts.",
    radio_description: "Listen to various radio channels.",
    data_backup: "Data Backup",
    data_backup_description: "Export or import all your data in JSON, CSV, or Excel format.",
    diaries: "Diaries",
    schedules: "Schedules",
    travel_records: "Travel Records",
    vehicle_records: "Vehicle Records",
    health_records: "Health Records",
    legal_information: "Legal Information",
    privacy_policy_description: "View our privacy policy and data collection practices",
    terms_of_service_description: "View service terms and conditions",
    set_diary_password: "Set Diary Password",
    password_description: "Set a password to protect your diary",
    new_password: "New Password",
    password_placeholder: "At least 4 characters",
    confirm_password: "Confirm Password",
    confirm_password_placeholder: "Re-enter password",
    set_password: "Set Password",
    skip: "Skip",
    locked_diary: "Locked Diary",
    enter_password_to_unlock: "Enter password to unlock your diary",
    password: "Password",
    unlock: "Unlock",
    password_too_short: "Password must be at least 4 characters",
    password_mismatch: "Passwords do not match",
    password_set: "Diary password has been set",
    unlocked: "Diary unlocked",
    wrong_password: "Wrong password",
    password_changed: "Password changed",
    confirm_remove_password: "Are you sure you want to remove the password?",
    password_removed: "Password removed",
    lock_diary: "Lock Diary",

    // Vehicle Section Translations
    add_vehicle: "Add Vehicle",
    first_vehicle: "Register First Vehicle",
    vehicle_list: "Vehicle List",
    new_vehicle: "New Vehicle",
    edit_vehicle: "Edit Vehicle",
    vehicle_name_placeholder: "Vehicle name (e.g., My Sonata)",
    license_plate_placeholder: "License plate",
    vehicle_type_placeholder: "Vehicle type (e.g., Sedan, SUV)",
    vehicle_model_placeholder: "Model (e.g., 2023 model)",
    purchase_year_placeholder: "Purchase year (e.g., 2023)",
    insurance_placeholder: "Insurance provider (e.g., State Farm)",
    vehicle_type: "Type",
    vehicle_model: "Model",
    purchase_year: "Purchase Year",
    insurance: "Insurance",
    insurance_fee: "Insurance Fee",
    register: "Register",
    update: "Update",
    vehicle_name_and_plate_required: "Please enter vehicle name and license plate",
    vehicle_saved: "Vehicle saved",
    save_error: "An error occurred while saving",
    delete_vehicle_confirm: "Do you want to delete this vehicle?",
    deleted: "Deleted",
    delete_error: "An error occurred while deleting",
    no_vehicles: "No vehicles registered",
    records_count: "Maintenance Records",
    schedules_count: "Maintenance Schedules",
    records_unit: " records",
    tap_to_add_maintenance_and_schedule: "Tap to add maintenance records and schedules",
    add_maintenance: "Add Maintenance",
    maintenance_input: "Maintenance Input",
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
    won_unit: "USD",
    amount_placeholder: "Enter amount",
    memo_placeholder: "Enter memo",
    save_maintenance: "Save Maintenance",
    date_required: "Please enter a date",
    maintenance_saved: "Maintenance record saved",
    delete_maintenance_confirm: "Do you want to delete this maintenance record?",
    maintenance_history: "Maintenance History",
    attachments_count: "Attachments",
    no_records: "No records",
    preventive_schedule: "Preventive Maintenance Schedule",
    preventive_input: "Preventive Maintenance Input",
    scheduled_date: "Scheduled Date",
    estimated_mileage: "Estimated Mileage",
    estimated_mileage_placeholder: "Enter estimated mileage",
    description: "Description",
    description_placeholder: "Enter maintenance details",
    alarm_setting: "Alarm Settings",
    alarm_days_before: "days before alarm",
    days_before_1: "day(s) before",
    days_before_2: "2 days before",
    days_before_7: "7 days before",
    days_before_14: "14 days before",
    days_before_30: "30 days before",
    save_schedule: "Save Schedule",
    scheduled_date_required: "Please enter scheduled date",
    schedule_saved: "Schedule saved",
    delete_schedule_confirm: "Do you want to delete this schedule?",
    maintenance_alarm_title: "Vehicle Maintenance Reminder",
    maintenance_alarm_message: "Scheduled maintenance",
  },

  zh: {
    // Common
    title: "记录之林",
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
    email: "电子邮件",

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
    map_button_instruction: "+/-按钮缩放",
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
    edit_travel_record: "旅行记录 수정",
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

    // Privacy Policy - Chinese translations
    privacy_policy: "隐私政策",
    privacy_policy_description: "查看我们的隐私政策和数据收集做法",
    privacy_last_updated: "最后更新：2025年12月",
    privacy_section1_title: "1. 收集的信息",
    privacy_section1_intro: "为提供服务，我们收集以下信息：",
    privacy_purpose1: "电子邮件地址（用于登录和账户管理）",
    privacy_purpose2: "用户输入的数据（待办事项、日程、预算、健康、旅行、笔记等）",
    privacy_purpose3: "AI功能使用时的文本（临时处理，不存储）",
    privacy_section2_title: "2. 数据存储",
    privacy_collected1: "所有数据均加密存储在Supabase云端",
    privacy_collected2: "Supabase已通过SOC2和GDPR认证",
    privacy_section3_title: "3. 信息使用方式",
    privacy_storage_desc: "收集的信息仅用于提供服务（数据存储、AI分析），绝不出售或共享给第三方。",
    privacy_supabase_desc: "使用AI功能时，文本会发送到Groq API，但不会存储。",
    privacy_section4_title: "4. 个人信息保留期限",
    privacy_retention_desc: "会员退出时，所有个人信息将立即删除。但如法律规定有保留义务，则在规定期限内保留。",
    privacy_section5_title: "5. 用户权利",
    privacy_right1: "查看和修改个人信息（设置 > 个人信息管理）",
    privacy_right2: "下载数据（设置 > 备份/恢复）",
    privacy_right3: "删除账户（设置 > 危险区域）- 立即删除所有数据",
    privacy_section6_title: "6. 保护负责人",
    privacy_section7_title: "7. 服务终止时的个人信息处理",
    privacy_termination_desc: "服务终止前30天通知用户，并提供数据导出期限。",
    privacy_data_deletion: "服务终止后30天内从Supabase数据库中完全删除所有个人信息。",

    // Terms of Service - Simplified Chinese translations
    terms_of_service: "服务条款",
    terms_of_service_description: "查看服务条款和条件",
    terms_last_updated: "最后更新：2025年12月",
    terms_section1_title: "1. 服务定义",
    terms_section1_desc: "本应用提供个人生活管理服务。基本功能免费，未来可能会增加高级功能。",
    terms_section2_title: "2. 注册",
    terms_section2_desc: "任何人都可以使用电子邮件地址自由注册。",
    terms_section3_title: "3. 提供服务",
    terms_service1: "待办事项、日程、日记、笔记管理",
    terms_service2: "预算、健康、旅行、车辆记录管理",
    terms_service3: "基于AI的分析和翻译（使用Groq AI）",
    terms_service4: "数据备份与恢复",
    terms_service5: "名片管理、天气、广播等",
    terms_section4_title: "4. 用户义务",
    terms_obligation1: "不得非法收集或盗用他人个人信息",
    terms_obligation2: "不得将服务用于非法目的",
    terms_obligation3: "安全管理账户信息",
    terms_section5_title: "5. 服务变更和通知",
    terms_section5_desc: "重要变更将通过应用顶部横幅通知。",
    terms_section6_title: "6. 服务暂停和终止",
    terms_termination1: "运营商可能因以下原因暂停服务：自然灾害、系统故障、经营原因",
    terms_termination2: "服务终止时将提前至少30天通过应用横幅通知",
    terms_termination3: "通知后30天内提供数据导出功能",
    terms_termination4: "作为免费服务，服务中断造成的损害赔偿责任有限",

    // Settings section - Personal Information translations for Chinese
    personal_information: "个人信息管理",
    view: "查看",
    hide: "隐藏",
    account_information: "账户信息",
    user_id: "用户ID",
    account_created: "注册日期",
    change_email: "更改电子邮件",
    update_email: "更新电子邮件",
    new_email: "新电子邮件",
    enter_password: "请输入密码",
    updating: "更新中...",
    data_management: "数据管理",
    data_management_description: "您可以查看和管理您的个人信息。",
    view_data: "查看数据",
    data_export_description: "请使用上方“备份/恢复”部分的数据导出功能。",
    fill_all_fields: "请填写所有字段",
    email_updated_success: "电子邮件已成功更新",
    email_update_error: "更新电子邮件时出错",

    // Danger Zone
    danger_zone: "危险区域",
    account_deletion_warning: "删除账户将永久删除所有数据，且无法恢复。",
    data_deletion_report: "生成个人信息销毁台账",
    data_deletion_report_desc: "服务终止时，为法律证明生成个人信息销毁台账。",
    generate_report: "生成台账",
    generating_report: "生成中...",
    report_generated: "销毁台账已生成",
    report_generation_failed: "销毁台账生成失败",
    delete_account: "删除账户",
    delete_account_title: "删除账户",
    delete_account_warning_title: "⚠️ 警告：此操作不可逆",
    delete_warning_1: "所有记录（待办事项、日程、预算、健康、旅行等）将永久删除",
    delete_warning_2: "您的账户信息将完全删除",
    delete_warning_3: "删除后无法恢复",
    delete_account_confirm_instruction: "继续操作，请准确输入以下短语：",
    delete_account_confirm_phrase: "永久删除账户",
    delete_account_phrase_mismatch: "输入的短语不匹配",
    account_deleted_success: "您的账户已成功删除",
    account_deletion_failed: "删除账户时出错",
    deleting: "删除中...",
    delete_permanently: "永久删除",

    // Announcement Management
    announcement_management: "公告管理",
    new_announcement: "新公告",
    edit_announcement: "编辑公告",
    announcement_message: "公告消息",
    announcement_message_placeholder: "请输入要显示给用户的公告",
    announcement_type: "公告类型",
    type_info: "信息",
    type_warning: "警告",
    type_success: "成功",
    expires_at: "到期日期",
    active_announcements: "活跃公告",
    no_announcements: "没有活跃公告",
    expires: "到期",
    save_success: "已保存！",
    save_failed: "保存失败",
    update: "更新",
    app_developer: "应用开发者",
    developer_info: "李赞世，金浦市长基洞",
    app_designer: "应用设计师",
    designer_info: "李赞世，金浦市长基洞",
    back_to_forest: "返回森林",
    customer_support: "客户支持",
    customer_support_description: "如果您有任何问题，请通过以下电子邮件与我们联系。",
    support_email: "支持邮箱",
    app_introduction: "应用介绍",
    app_introduction_description:
      "本应用是一款集成的生活管理工具，可让您在一个地方管理日常生活的各项记录，包括日程、待办事项、预算、健康、旅行、车辆等。",
    notes_description: "记录笔记、会议记录、想法，并使用AI进行摘要和翻译。",
    diaries_description: "撰写每日日记并用密码保护。",
    schedules_description: "以日历格式管理日程并设置提醒。",
    travel_records_description: "规划您的旅行并使用AI优化行程。",
    vehicle_records_description: "管理车辆维护记录和预防性维护计划。",
    health_records_description: "管理您的健康数据、用药计划和医疗联系人。",
    budget_description: "记录收入和支出，并使用AI分析您的预算。",
    business_cards_description: "扫描名片以自动提取和管理信息。",
    weather_description: "查看当前天气和预报。",
    radio_description: "收听各种广播频道。",
    data_backup: "数据备份",
    data_backup_description: "以JSON、CSV或Excel格式导出或导入所有数据。",
    diaries: "日记",
    schedules: "日程",
    travel_records: "旅行记录",
    vehicle_records: "车辆记录",
    health_records: "健康记录",
    legal_information: "法律信息",
    privacy_policy_description: "查看我们的隐私政策和数据收集做法",
    terms_of_service_description: "查看服务条款和条件",
    set_diary_password: "设置日记密码",
    password_description: "设置密码以保护您的日记",
    new_password: "新密码",
    password_placeholder: "至少4个字符",
    confirm_password: "确认密码",
    confirm_password_placeholder: "重新输入密码",
    set_password: "设置密码",
    skip: "跳过",
    locked_diary: "已锁定的日记",
    enter_password_to_unlock: "输入密码以解锁您的日记",
    password: "密码",
    unlock: "解锁",
    password_too_short: "密码必须至少4个字符",
    password_mismatch: "密码不匹配",
    password_set: "日记密码已设置",
    unlocked: "已解锁",
    wrong_password: "密码错误",
    password_changed: "密码已更改",
    confirm_remove_password: "您确定要删除密码吗？",
    password_removed: "密码已删除",
    lock_diary: "锁定日记",

    // Vehicle Section Translations
    add_vehicle: "添加车辆",
    first_vehicle: "注册首辆车辆",
    vehicle_list: "车辆列表",
    new_vehicle: "新车辆",
    edit_vehicle: "编辑车辆",
    vehicle_name_placeholder: "车辆名称（例：我的索纳塔）",
    license_plate_placeholder: "车牌号",
    vehicle_type_placeholder: "车型（例：轿车、SUV）",
    vehicle_model_placeholder: "型号（例：2023款）",
    purchase_year_placeholder: "购买年份（例：2023）",
    insurance_placeholder: "保险公司（例：平安保险）",
    vehicle_type: "车型",
    vehicle_model: "型号",
    purchase_year: "购买年份",
    insurance: "保险",
    insurance_fee: "保险费",
    register: "注册",
    update: "更新",
    vehicle_name_and_plate_required: "请输入车辆名称和车牌号",
    vehicle_saved: "车辆已保存",
    save_error: "保存时出错",
    delete_vehicle_confirm: "是否删除此车辆？",
    deleted: "已删除",
    delete_error: "删除时出错",
    no_vehicles: "未注册车辆",
    records_count: "维护记录",
    schedules_count: "维护计划",
    records_unit: "条",
    tap_to_add_maintenance_and_schedule: "点击添加维护记录和计划",
    add_maintenance: "添加维护记录",
    maintenance_input: "维护记录输入",
    maintenance_category: "维护项目",
    maintenance_date: "维护日期",
    engine_oil: "机油",
    tire: "轮胎",
    filter: "滤清器",
    repair: "维修",
    parts: "配件",
    mileage: "里程",
    km_unit: "公里",
    mileage_placeholder: "输入里程",
    amount: "费用",
    won_unit: "元",
    amount_placeholder: "输入费用",
    memo_placeholder: "输入备注",
    save_maintenance: "保存维护记录",
    date_required: "请输入日期",
    maintenance_saved: "维护记录已保存",
    delete_maintenance_confirm: "是否删除此维护记录？",
    maintenance_history: "维护历史",
    attachments_count: "附件",
    no_records: "无记录",
    preventive_schedule: "预防性维护计划",
    preventive_input: "预防性维护输入",
    scheduled_date: "计划日期",
    estimated_mileage: "预计里程",
    estimated_mileage_placeholder: "输入预计里程",
    description: "说明",
    description_placeholder: "输入维护详情",
    alarm_setting: "提醒设置",
    alarm_days_before: "天前提醒",
    days_before_1: "天前",
    days_before_2: "2天前",
    days_before_7: "7天前",
    days_before_14: "14天前",
    days_before_30: "30天前",
    save_schedule: "保存计划",
    scheduled_date_required: "请输入计划日期",
    schedule_saved: "计划已保存",
    delete_schedule_confirm: "是否删除此计划？",
    maintenance_alarm_title: "车辆维护提醒",
    maintenance_alarm_message: "计划维护",
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
    email: "メールアドレス",

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

    // Privacy Policy - Japanese translations
    privacy_policy: "プライバシーポリシー",
    privacy_policy_description: "プライバシーポリシーとデータ収集方法を確認してください",
    privacy_last_updated: "最終更新: 2025年12月",
    privacy_section1_title: "1. 収集する情報",
    privacy_section1_intro: "サービス提供のため、以下の情報を収集します：",
    privacy_purpose1: "メールアドレス（ログインとアカウント管理用）",
    privacy_purpose2: "ユーザーが入力したデータ（ToDo、予定、予算、健康、旅行、メモなど）",
    privacy_purpose3: "AI機能使用時のテキスト（一時的に処理、保存しません）",
    privacy_section2_title: "2. データ保存",
    privacy_collected1: "すべてのデータはSupabaseクラウドに暗号化して保存されます",
    privacy_collected2: "SupabaseはSOC2とGDPR認証を取得しています",
    privacy_section3_title: "3. 情報の使用方法",
    privacy_storage_desc:
      "収集した情報はサービス提供（データ保存、AI分析）のみに使用され、第三者に販売または共有することはありません。",
    privacy_supabase_desc: "AI機能使用時、テキストはGroq APIに送信されますが保存されません。",
    privacy_section4_title: "4. 個人情報の保持期間",
    privacy_retention_desc:
      "会員退会時にすべての個人情報は即時削除されます。ただし、法令で定められた保管義務がある場合は、該当期間保管します。",
    privacy_section5_title: "5. ユーザーの権利",
    privacy_right1: "個人情報の閲覧と編集（設定 > 個人情報管理）",
    privacy_right2: "データのダウンロード（設定 > バックアップ/復元）",
    privacy_right3: "アカウント削除（設定 > 危険ゾーン）- すべてのデータを即座に削除",
    privacy_section6_title: "6. 保護責任者",
    privacy_section7_title: "7. サービス終了時の個人情報処理",
    privacy_termination_desc: "サービス終了の30日前にユーザーに通知し、データエクスポート期間を提供します。",
    privacy_data_deletion: "サービス終了後30日以内にSupabaseデータベースからすべての個人情報を完全に削除します。",

    // Terms of Service - Simplified Japanese translations
    terms_of_service: "利用規約",
    terms_of_service_description: "サービス利用規約と条件を確認してください",
    terms_last_updated: "最終更新: 2025年12月",
    terms_section1_title: "1. サービス定義",
    terms_section1_desc:
      "このアプリは個人の生活管理のためのサービスを提供します。基本機能は無料であり、将来的にはプレミアム機能が追加される可能性があります。",
    terms_section2_title: "2. 会員登録",
    terms_section2_desc: "誰でもメールアドレスで自由に登録できます。",
    terms_section3_title: "3. 提供サービス",
    terms_service1: "ToDo、スケジュール、日記、ノート管理",
    terms_service2: "予算、健康、旅行、車両記録管理",
    terms_service3: "AIベースの分析と翻訳（Groq AIを使用）",
    terms_service4: "データバックアップと復元",
    terms_service5: "名片管理、天気、ラジオなど",
    terms_section4_title: "4. ユーザーの義務",
    terms_obligation1: "他人の個人情報を無断で収集または盗用しない",
    terms_obligation2: "サービスを違法な目的で使用しない",
    terms_obligation3: "アカウント情報を安全に管理する",
    terms_section5_title: "5. サービスの変更と通知",
    terms_section5_desc: "重要な変更は、アプリ上部のバナーで事前にお知らせします。",
    terms_section6_title: "6. サービスの中断と終了",
    terms_termination1: "運営者は次の理由でサービスを中断できます：天災、システム障害、経営上の理由",
    terms_termination2: "サービス終了時は少なくとも30日前にアプリバナーで通知します",
    terms_termination3: "通知後30日間データエクスポート機能を提供します",
    terms_termination4: "無料サービスのため、サービス中断による損害賠償責任は制限されます",

    // Settings section - Personal Information translations for Japanese
    personal_information: "個人情報管理",
    view: "表示",
    hide: "非表示",
    account_information: "アカウント情報",
    user_id: "ユーザーID",
    account_created: "アカウント作成日",
    change_email: "メールアドレス変更",
    update_email: "メールアドレス更新",
    new_email: "新しいメールアドレス",
    enter_password: "パスワード入力",
    updating: "更新中...",
    data_management: "データ管理",
    data_management_description: "個人情報を確認・管理できます。",
    view_data: "データ表示",
    data_export_description: "上記の「バックアップ/復元」セクションのデータエクスポート機能を使用してください。",
    fill_all_fields: "すべてのフィールドを入力してください",
    email_updated_success: "メールアドレスが正常に更新されました",
    email_update_error: "メールアドレスの更新中にエラーが発生しました",

    // Danger Zone
    danger_zone: "危険ゾーン",
    account_deletion_warning: "アカウントを削除すると、すべてのデータが永久に削除され、復元できません。",
    data_deletion_report: "個人情報破棄台帳作成",
    data_deletion_report_desc: "サービス終了時、法的証明のため個人情報破棄台帳を作成します。",
    generate_report: "台帳作成",
    generating_report: "作成中...",
    report_generated: "破棄台帳が作成されました",
    report_generation_failed: "破棄台帳作成に失敗しました",
    delete_account: "アカウント削除",
    delete_account_title: "アカウント削除",
    delete_account_warning_title: "⚠️ 警告：この操作は元に戻せません",
    delete_warning_1: "すべての記録（ToDo、スケジュール、予算、健康、旅行など）が永久に削除されます",
    delete_warning_2: "アカウント情報が完全に削除されます",
    delete_warning_3: "削除後の復元は不可能です",
    delete_account_confirm_instruction: "続行するには、次のフレーズを正確に入力してください：",
    delete_account_confirm_phrase: "アカウントを永久に削除する",
    delete_account_phrase_mismatch: "入力されたフレーズが一致しません",
    account_deleted_success: "アカウントは正常に削除されました",
    account_deletion_failed: "アカウント削除中にエラーが発生しました",
    deleting: "削除中...",
    delete_permanently: "永久削除",

    // Announcement Management
    announcement_management: "お知らせ管理",
    new_announcement: "新規お知らせ",
    edit_announcement: "お知らせ編集",
    announcement_message: "お知らせメッセージ",
    announcement_message_placeholder: "ユーザーに表示するお知らせを入力してください",
    announcement_type: "お知らせの種類",
    type_info: "情報",
    type_warning: "警告",
    type_success: "成功",
    expires_at: "有効期限",
    active_announcements: "アクティブなお知らせ",
    no_announcements: "アクティブなお知らせはありません",
    expires: "有効期限",
    save_success: "保存されました！",
    save_failed: "保存失敗",
    update: "更新",
    app_developer: "アプリ開発者",
    developer_info: "イ・チャンセ、金浦市長基洞",
    app_designer: "アプリデザイナー",
    designer_info: "イ・チャンセ、金浦市長基洞",
    back_to_forest: "森に戻る",
    customer_support: "カスタマーサポート",
    customer_support_description: "ご質問がございましたら、下記メールアドレスまでご連絡ください。",
    support_email: "サポートメールアドレス",
    app_introduction: "アプリ紹介",
    app_introduction_description:
      "このアプリは、スケジュール、ToDo、予算、健康、旅行、車両など、日常生活のすべての記録を一つの場所で管理できる統合生活管理ツールです。",
    notes_description: "ノート、会議議事録、アイデアなどを記録し、AIで要約・翻訳できます。",
    diaries_description: "毎日の日記を書き、パスワードで保護できます。",
    schedules_description: "スケジュールをカレンダー形式で管理し、リマインダーを設定できます。",
    travel_records_description: "旅行計画を立て、AIで旅程を最適化できます。",
    vehicle_records_description: "車両のメンテナンス記録と予防メンテナンススケジュールを管理できます。",
    health_records_description: "健康データ、服薬スケジュール、医療連絡先を管理できます。",
    budget_description: "収入と支出を記録し、AIで予算を分析できます。",
    business_cards_description: "名刺をスキャンして情報を自動抽出し、管理できます。",
    weather_description: "現在の天気と予報を確認できます。",
    radio_description: "様々なラジオチャンネルを聴くことができます。",
    data_backup: "データバックアップ",
    data_backup_description: "すべてのデータをJSON、CSV、Excel形式でエクスポートまたはインポートできます。",
    diaries: "日記",
    schedules: "スケジュール",
    travel_records: "旅行記録",
    vehicle_records: "車両記録",
    health_records: "健康記録",
    legal_information: "法的情報",
    privacy_policy_description: "プライバシーポリシーとデータ収集方法を確認してください",
    terms_of_service_description: "サービス利用規約と条件を確認してください",
    set_diary_password: "日記のパスワード設定",
    password_description: "日記を保護するためのパスワードを設定してください",
    new_password: "新しいパスワード",
    password_placeholder: "最低4文字以上",
    confirm_password: "パスワード確認",
    confirm_password_placeholder: "パスワード再入力",
    set_password: "パスワード設定",
    skip: "スキップ",
    locked_diary: "ロックされた日記",
    enter_password_to_unlock: "パスワードを入力して日記を確認してください",
    password: "パスワード",
    unlock: "ロック解除",
    password_too_short: "パスワードは最低4文字以上必要です",
    password_mismatch: "パスワードが一致しません",
    password_set: "日記のパスワードが設定されました",
    unlocked: "ロックが解除されました",
    wrong_password: "パスワードが間違っています",
    password_changed: "パスワードが変更されました",
    confirm_remove_password: "本当にパスワードを削除しますか？",
    password_removed: "パスワードが削除されました",
    lock_diary: "日記をロック",

    // Vehicle Section Translations
    add_vehicle: "車両追加",
    first_vehicle: "最初の車両を登録",
    vehicle_list: "車両リスト",
    new_vehicle: "新しい車両",
    edit_vehicle: "車両編集",
    vehicle_name_placeholder: "車両名（例：マイソナタ）",
    license_plate_placeholder: "ナンバープレート",
    vehicle_type_placeholder: "車種（例：セダン、SUV）",
    vehicle_model_placeholder: "モデル（例：2023年式）",
    purchase_year_placeholder: "購入年（例：2023）",
    insurance_placeholder: "保険会社（例：東京海上）",
    vehicle_type: "車種",
    vehicle_model: "モデル",
    purchase_year: "購入年",
    insurance: "保険",
    insurance_fee: "保険料",
    register: "登録",
    update: "更新",
    vehicle_name_and_plate_required: "車両名とナンバープレートを入力してください",
    vehicle_saved: "車両が保存されました",
    save_error: "保存中にエラーが発生しました",
    delete_vehicle_confirm: "この車両を削除しますか？",
    deleted: "削除されました",
    delete_error: "削除中にエラーが発生しました",
    no_vehicles: "登録された車両がありません",
    records_count: "整備記録",
    schedules_count: "整備予定",
    records_unit: "件",
    tap_to_add_maintenance_and_schedule: "タップして整備記録と予定を追加",
    add_maintenance: "整備記録追加",
    maintenance_input: "整備記録入力",
    maintenance_category: "整備項目",
    maintenance_date: "整備日",
    engine_oil: "エンジンオイル",
    tire: "タイヤ",
    filter: "フィルター",
    repair: "修理",
    parts: "部品",
    mileage: "走行距離",
    km_unit: "km",
    mileage_placeholder: "走行距離を入力",
    amount: "費用",
    won_unit: "円",
    amount_placeholder: "費用を入力",
    memo_placeholder: "メモを入力",
    save_maintenance: "整備記録保存",
    date_required: "日付を入力してください",
    maintenance_saved: "整備記録が保存されました",
    delete_maintenance_confirm: "この整備記録を削除しますか？",
    maintenance_history: "整備履歴",
    attachments_count: "添付",
    no_records: "記録がありません",
    preventive_schedule: "予防整備予定",
    preventive_input: "予防整備入力",
    scheduled_date: "予定日",
    estimated_mileage: "予想走行距離",
    estimated_mileage_placeholder: "予想走行距離を入力",
    description: "説明",
    description_placeholder: "整備内容を入力",
    alarm_setting: "アラーム設定",
    alarm_days_before: "日前アラーム",
    days_before_1: "日前",
    days_before_2: "2日前",
    days_before_7: "7日前",
    days_before_14: "14日前",
    days_before_30: "30日前",
    save_schedule: "予定保存",
    scheduled_date_required: "予定日を入力してください",
    schedule_saved: "予定が保存されました",
    delete_schedule_confirm: "この予定を削除しますか？",
    maintenance_alarm_title: "車両整備アラーム",
    maintenance_alarm_message: "予定された整備",
  },
}

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language]?.[key] || translations.ko[key] || key
}
