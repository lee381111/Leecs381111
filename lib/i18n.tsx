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
  | "shoot"
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
  | "manage"
  | "repeat_frequency"
  | "repeat_until"
  | "repeat_schedule"
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
  | "contact_notes_placeholder"
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
  | "title_label"
  | "category_label"
  | "description_label"
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
  | "start_date_label"
  | "end_date_label"
  | "budget_label"
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
  | "privacy_section5_title"
  | "privacy_right1"
  | "privacy_right2"
  | "privacy_right3"
  | "privacy_section6_title"
  | "privacy_section7_title"
  | "privacy_termination_desc"
  | "privacy_data_deletion"
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
  | "terms_section6_title"
  | "terms_termination1"
  | "terms_termination2"
  | "terms_termination3"
  | "terms_termination4"
  | "personal_information"
  | "view"
  | "hide"
  | "account_information"
  | "user_id"
  | "account_created"
  | "change_email"
  | "update_email"
  | "new_email"
  | "enter_password"
  | "updating"
  | "data_management"
  | "data_management_description"
  | "view_data"
  | "data_export_description"
  | "fill_all_fields"
  | "email_updated_success"
  | "email_update_error"
  | "danger_zone"
  | "account_deletion_warning"
  | "data_deletion_report"
  | "data_deletion_report_desc"
  | "generate_report"
  | "generating_report"
  | "report_generated"
  | "report_generation_failed"
  | "delete_account"
  | "delete_account_title"
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
  | "delete_account_email_reuse_info"
  | "email_verification_notice_title"
  | "email_verification_notice_desc"
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
  | "app_developer"
  | "developer_info"
  | "app_designer"
  | "designer_info"
  | "customer_support"
  | "customer_support_description"
  | "support_email"
  | "app_introduction"
  | "app_introduction_description"
  | "notes_description"
  | "diaries_description"
  | "schedules_description"
  | "travel_records_description"
  | "vehicle_records_description"
  | "health_records_description"
  | "budget_description"
  | "business_cards_description"
  | "weather_description"
  | "radio_description"
  | "data_backup"
  | "data_backup_description"
  | "diaries"
  | "schedules"
  | "travel_records"
  | "vehicle_records"
  | "health_records"
  | "legal_information"
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
  | "unlocked"
  | "wrong_password"
  | "password_changed"
  | "confirm_remove_password"
  | "password_removed"
  | "lock_diary"
  | "security_question"
  | "security_not_set"
  | "enter_security_answer"
  | "security_answer_placeholder"
  | "reset_password_description"
  | "wrong_security_answer"
  | "password_reset_success"
  | "security_answer_help"
  | "diary_password_management"
  | "diary_password_description"
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
  | "storage_usage"
  | "storage_used"
  | "used"
  | "used_lowercase"
  | "remaining"
  | "storage_full"
  | "storage_warning"
  | "premium"
  | "upgrade_to_premium"
  | "premium_benefits"
  | "benefit_500mb"
  | "benefit_no_ads"
  | "benefit_priority_support"
  | "upgrade_for_1_pi"
  | "upgrade_coming_soon"
  | "email_user_storage_info"
  | "admin_storage_info"
  | "announcement_welcome"
  | "announcement_maintenance"
  | "announcement_update"
  | "announcement_event"
  | "app_title"
  | "welcome_message"
  | "logout"
  | "my_forest"
  | "note_title_placeholder"
  | "note_content_placeholder"
  | "no_notes_message"
  | "event_title_placeholder"
  | "start_time"
  | "end_time"
  | "location"
  | "location_placeholder"
  | "no_events_message"
  | "search_location"
  | "weather_loading"
  | "weather_error"
  | "precipitation"
  | "weather_description"
  | "visibility"
  | "pressure"
  | "today"
  | "tomorrow"
  | "travel_destination"
  | "travel_destination_placeholder"
  | "no_travels_message"
  | "vehicle_name"
  | "vehicle_name_placeholder"
  | "license_plate"
  | "car"
  | "motorcycle"
  | "bicycle"
  | "no_vehicles_message"
  | "add_maintenance"
  | "cost_placeholder"
  | "no_maintenance_records"
  | "diary_content_placeholder"
  | "no_diary_entries"
  | "todo_title_placeholder"
  | "completed"
  | "in_progress"
  | "not_started"
  | "radio_station_placeholder"
  | "radio_url_placeholder"
  | "add_station"
  | "no_stations_message"
  | "play"
  | "stop"
  | "of"
  | "upgrade_storage"
  | "free_plan"
  | "storage_full_warning"
  | "no_location_permission"
  | "getting_location"
  | "height"
  | "height_placeholder"
  | "blood_pressure_placeholder"
  | "blood_sugar_placeholder"
  | "heart_rate"
  | "heart_rate_placeholder"
  | "notes_optional"
  | "notes_placeholder"
  | "record_date"
  | "no_health_records"
  | "health_metrics"
  | "medication_name_placeholder"
  | "dosage_placeholder"
  | "frequency_placeholder"
  | "no_medications"
  | "add_medication"
  | "add_contact"
  | "contact_notes_placeholder"
  | "status"
  | "priority"
  | "high"
  | "medium"
  | "low"
  | "due_date"
  | "back_to_list"
  | "mark_as_in_progress"
  | "no_description"
  | "created"
  | "last_updated"
  | "agree_to_terms"
  | "sign_up"
  | "already_have_account"
  | "sign_in"
  | "email_placeholder"
  | "signing_up"
  | "signing_in"
  | "forgot_password"
  | "or_continue_with"
  | "google"
  | "dont_have_account"
  | "enter_email_for_reset"
  | "send_reset_link"
  | "sending"
  | "back_to_sign_in"
  | "reset_password"
  | "admin"
  | "consent_logs"
  | "user"
  | "terms_version"
  | "privacy_version"
  | "agreed_at"
  | "user_agent"
  | "no_consent_logs"
  | "tos_title"
  | "tos_effective_date"
  | "tos_last_updated"
  | "tos_acceptance"
  | "tos_acceptance_content"
  | "tos_1_title"
  | "tos_1_content"
  | "tos_2_title"
  | "tos_2_content"
  | "tos_3_title"
  | "tos_3_content"
  | "tos_4_title"
  | "tos_4_content"
  | "tos_5_title"
  | "tos_5_content"
  | "tos_6_title"
  | "tos_6_content"
  | "tos_7_title"
  | "tos_7_content"
  | "pp_effective_date"
  | "pp_intro"
  | "pp_1_title"
  | "pp_1_content"
  | "pp_2_title"
  | "pp_2_content"
  | "pp_3_title"
  | "pp_3_content"
  | "pp_4_title"
  | "pp_4_content"
  | "pp_5_title"
  | "pp_5_content"
  | "pp_6_title"
  | "pp_6_content"
  | "pp_7_title"
  | "pp_7_content"
  | "pp_contact"
  | "analyze_emotion"
  | "analyzing_emotion"
  | "emotion_analysis_result"
  | "emotion_analysis_failed"
  | "diary_too_short_for_analysis"
  | "emotion_positive"
  | "emotion_negative"
  | "emotion_neutral"
  | "emotion_score"
  | "main_emotions"
  | "ai_advice"

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
    shoot: "촬영", // Added Korean translation for shoot button
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
    manage: "관리",

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
    contact_notes_placeholder: "메모를 입력하세요",
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
    delete_account_email_reuse_info: "삭제된 이메일은 다시 회원가입에 사용할 수 있습니다.",
    email_verification_notice_title: "회원가입 후 이메일 확인 필요",
    email_verification_notice_desc: "회원가입 후 이메일 받은편지함에서 확인 메일을 클릭하여 인증을 완료해주세요.",

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
    security_question: "보안 질문: 태어난 도시는?",
    security_not_set: "보안 질문이 설정되지 않았습니다. 비밀번호를 완전히 제거하려면 설정에서 진행하세요.",
    enter_security_answer: "보안 답변 입력",
    security_answer_placeholder: "태어난 도시",
    reset_password_description: "새 비밀번호로 재설정",
    wrong_security_answer: "보안 답변이 올바르지 않습니다",
    password_reset_success: "비밀번호가 재설정되었습니다",
    security_answer_help: "비밀번호를 잊어버렸을 때 사용됩니다",
    diary_password_management: "일기 비밀번호 관리",
    diary_password_description: "일기 비밀번호를 제거하거나 재설정합니다",

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

    // Storage Quota Translations
    storage_usage: "저장 용량",
    storage_used: "사용 중",
    used: "사용됨",
    used_lowercase: "사용됨",
    remaining: "남음",
    storage_full: "저장 공간이 거의 찼습니다! 파일을 삭제하거나 프리미엄으로 업그레이드하세요.",
    storage_warning: "저장 공간이 80%를 초과했습니다. 공간을 확보해주세요.",
    premium: "프리미엄",
    upgrade_to_premium: "프리미엄으로 업그레이드",
    premium_benefits: "500MB 저장 공간과 더 많은 기능을 이용하세요",
    benefit_500mb: "500MB 저장 공간",
    benefit_no_ads: "광고 없음",
    benefit_priority_support: "우선 지원",
    upgrade_for_1_pi: "월 1 Pi로 업그레이드",
    upgrade_coming_soon: "프리미엄 업그레이드 기능이 곧 추가됩니다!",
    email_user_storage_info: "이메일 사용자는 500MB를 무료로 사용할 수 있습니다",
    admin_storage_info: "관리자 계정은 1GB 저장 공간을 사용할 수 있습니다",

    // Announcement Translations
    announcement_welcome: "Pi Life Manager에 오신 것을 환영합니다!",
    announcement_maintenance: "시스템 점검이 예정되어 있습니다. 서비스 이용에 참고해주세요.",
    announcement_update: "새로운 기능이 추가되었습니다. 확인해보세요!",
    announcement_event: "특별 이벤트가 진행 중입니다!",

    // New Translations
    app_title: "기록의 숲",
    welcome_message: "기록의 숲에 오신 것을 환영합니다!",
    logout: "로그아웃",
    my_forest: "나의 숲",
    note_title_placeholder: "제목을 입력하세요",
    note_content_placeholder: "내용을 입력하세요",
    no_notes_message: "기록할 노트를 추가하세요!",
    event_title_placeholder: "이벤트 제목",
    start_time: "시작 시간",
    end_time: "종료 시간",
    location: "장소",
    location_placeholder: "장소를 입력하세요",
    no_events_message: "이벤트가 없습니다. 일정을 추가하세요!",
    search_location: "장소 검색",
    weather_loading: "날씨 로딩 중...",
    weather_error: "날씨 정보를 가져오는데 실패했습니다.",
    precipitation: "강수량",
    weather_description: "날씨 설명",
    visibility: "시야",
    pressure: "기압",
    today: "오늘",
    tomorrow: "내일",
    travel_destination: "여행 목적지",
    travel_destination_placeholder: "예: 제주도, 강원도",
    no_travels_message: "여행 기록이 없습니다. 여행을 추가하세요!",
    vehicle_name: "차량 이름",
    vehicle_name_placeholder: "예: 내 아반떼",
    license_plate: "차량 번호",
    license_plate_placeholder: "예: 12가 1234",
    vehicle_type: "차종",
    car: "승용차",
    motorcycle: "오토바이",
    bicycle: "자전거",
    no_vehicles_message: "차량 기록이 없습니다. 차량을 등록하세요!",
    mileage_placeholder: "주행 거리를 입력하세요",
    add_maintenance: "정비 추가",
    cost_placeholder: "비용을 입력하세요",
    no_maintenance_records: "정비 기록이 없습니다.",
    diary_content_placeholder: "오늘 하루 어땠나요?",
    no_diary_entries: "일기 항목이 없습니다. 일기를 작성하세요!",
    todo_title_placeholder: "할일을 입력하세요",
    completed: "완료",
    in_progress: "진행 중",
    not_started: "시작 전",
    radio_station_placeholder: "라디오 방송국 이름",
    radio_url_placeholder: "라디오 스트리밍 URL",
    add_station: "방송국 추가",
    no_stations_message: "등록된 방송국이 없습니다.",
    play: "재생",
    stop: "정지",
    of: "/",
    upgrade_storage: "스토리지 업그레이드",
    free_plan: "무료 플랜",
    storage_full_warning: "스토리지 공간이 부족합니다. 불필요한 파일을 삭제하거나 업그레이드해주세요.",
    no_location_permission: "위치 접근 권한이 없습니다.",
    getting_location: "위치 정보 가져오는 중...",
    update: "업데이트",
    height: "키",
    height_placeholder: "키를 입력하세요 (cm)",
    weight: "몸무게",
    blood_pressure_placeholder: "예: 120/80",
    blood_sugar_placeholder: "예: 90",
    heart_rate: "심박수",
    heart_rate_placeholder: "심박수를 입력하세요",
    notes_optional: "메모 (선택 사항)",
    notes_placeholder: "추가 메모를 입력하세요",
    record_date: "기록 날짜",
    no_health_records: "건강 기록이 없습니다.",
    health_metrics: "건강 지표",
    medication_name_placeholder: "약 이름을 입력하세요",
    dosage_placeholder: "복용량을 입력하세요",
    frequency_placeholder: "복용 빈도를 입력하세요",
    no_medications: "등록된 약이 없습니다.",
    add_medication: "약 추가",
    medical_contacts: "의료 연락처",
    add_contact: "연락처 추가",
    contact_notes_placeholder: "메모를 입력하세요",
    todo_list: "할일 목록",
    status: "상태",
    priority: "우선순위",
    high: "높음",
    medium: "보통",
    low: "낮음",
    due_date: "마감일",
    description: "설명",
    back_to_list: "목록으로 돌아가기",
    mark_as_completed: "완료로 표시",
    mark_as_in_progress: "진행 중으로 표시",
    no_description: "설명 없음",
    created: "생성일",
    last_updated: "마지막 업데이트",
    terms_of_service: "이용약관",
    privacy_policy: "개인정보 처리방침",
    agree_to_terms: "이용약관 및 개인정보 처리방침에 동의합니다",
    sign_up: "회원가입",
    already_have_account: "이미 계정이 있나요?",
    sign_in: "로그인",
    email_placeholder: "이메일 주소",
    signing_up: "회원가입 중...",
    signing_in: "로그인 중...",
    forgot_password: "비밀번호 재설정",
    or_continue_with: "또는 다음으로 계속",
    google: "Google",
    dont_have_account: "계정이 없으신가요?",
    enter_email_for_reset: "비밀번호 재설정을 위해 이메일을 입력해주세요",
    send_reset_link: "재설정 링크 보내기",
    sending: "전송 중...",
    back_to_sign_in: "로그인으로 돌아가기",
    reset_password: "비밀번호 재설정",
    admin: "관리자",
    consent_logs: "동의 기록",
    user: "사용자",
    terms_version: "이용약관 버전",
    privacy_version: "개인정보 처리방침 버전",
    agreed_at: "동의 일시",
    user_agent: "사용자 에이전트",
    no_consent_logs: "동의 기록이 없습니다",
    tos_title: "이용약관",
    tos_effective_date: "시행일",
    tos_last_updated: "최종 수정일",
    tos_acceptance: "이용약관 동의",
    tos_acceptance_content: "본인은 위 이용약관에 동의합니다.",
    tos_1_title: "제1조 (목적)",
    tos_1_content: "본 약관은 ...",
    tos_2_title: "제2조 (정의)",
    tos_2_content: "본 약관에서 사용하는 용어의 정의는 다음과 같습니다. ...",
    tos_3_title: "제3조 (이용 계약)",
    tos_3_content: "이용 계약은 이용자가 본 약관의 내용에 대하여 동의함을 표시함으로써 체결됩니다. ...",
    tos_4_title: "제4조 (이용자의 의무)",
    tos_4_content: "이용자는 다음 각 호의 행위를 하여서는 안 됩니다. ...",
    tos_5_title: "제5조 (서비스 제공 및 중단)",
    tos_5_content: "회사는 이용자에게 안정적인 서비스를 제공합니다. ...",
    tos_6_title: "제6조 (개인정보 보호)",
    tos_6_content: "회사는 개인정보 보호법 등 관련 법령을 준수합니다. ...",
    tos_7_title: "제7조 (면책조항)",
    tos_7_content:
      "회사는 천재지변, 파업, 관련 법령의 제정/개폐 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다. ...",
    pp_title: "개인정보 처리방침",
    pp_effective_date: "시행일",
    pp_last_updated: "최종 수정일",
    pp_intro: "본 개인정보 처리방침은 ...",
    pp_1_title: "제1조 (수집하는 개인정보 항목 및 수집 방법)",
    pp_1_content:
      "회사는 이용계약의 이행, 서비스 제공, 이용자 식별, 서비스 개선을 위하여 다음과 같은 개인정보를 수집합니다. ...",
    pp_2_title: "제2조 (개인정보의 수집 및 이용 목적)",
    pp_2_content: "회사는 수집한 개인정보를 다음의 목적을 위하여만 이용합니다. ...",
    pp_3_title: "제3조 (개인정보의 보유 및 이용기간)",
    pp_3_content:
      "회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 보유·이용합니다. ...",
    pp_4_title: "제4조 (개인정보의 제3자 제공)",
    pp_4_content: "회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. ...",
    pp_5_title: "제5조 (개인정보의 파기)",
    pp_5_content:
      "회사는 개인정보 보유기간의 경과, 처리목적 달성 등 그 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. ...",
    pp_6_title: "제6조 (이용자 및 법정대리인의 권리와 그 행사 방법)",
    pp_6_content: "이용자는 언제든지 등록되어 있는 자신의 개인정보를 열람하거나 수정할 수 있습니다. ...",
    pp_7_title: "제7조 (개인정보에 관한 민원 서비스)",
    pp_7_content:
      "회사는 개인정보 처리에 관한 질문, 의견, 불만 등을 처리하기 위하여 아래와 같이 담당 부서 및 개인정보 보호책임자를 지정하고 있습니다. ...",
    pp_contact: "개인정보 보호책임자",

    analyze_emotion: "감정 분석",
    analyzing_emotion: "분석 중...",
    emotion_analysis_result: "감정 분석 결과",
    emotion_analysis_failed: "감정 분석에 실패했습니다",
    diary_too_short_for_analysis: "일기가 너무 짧아 분석할 수 없습니다",
    emotion_positive: "긍정적",
    emotion_negative: "부정적",
    emotion_neutral: "중립적",
    emotion_score: "감정 점수",
    main_emotions: "주요 감정",
    ai_advice: "AI 조언",
    security_question: "보안 질문: 태어난 도시는?",
    security_not_set: "보안 질문이 설정되지 않았습니다. 비밀번호를 완전히 제거하려면 설정에서 진행하세요.",
    enter_security_answer: "보안 답변 입력",
    security_answer_placeholder: "태어난 도시",
    reset_password_description: "새 비밀번호로 재설정",
    wrong_security_answer: "보안 답변이 올바르지 않습니다",
    password_reset_success: "비밀번호가 재설정되었습니다",
    security_answer_help: "비밀번호를 잊어버렸을 때 사용됩니다",
    diary_password_management: "일기 비밀번호 관리",
    diary_password_description: "일기 비밀번호를 제거하거나 재설정합니다",

    repeat_frequency: "반복 주기",
    repeat_until: "반복 종료일",
    repeat_schedule: "반복 일정",
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

    year: "Year",
    month: "Month",

    steps_unit: "steps",
    krw_unit: "KRW",

    file_upload: "Upload File",
    take_photo: "Take Photo",
    shoot: "Capture", // Added English translation for shoot button
    ocr_camera: "Camera→Text",
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
    manage: "Manage",

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
    medication_expense: "Medication Expense",
    medication_cost: "Medication Cost",
    memo: "Memo",
    medication_name: "Medication Name",
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
    medication_expense_placeholder: "Enter medication expense",
    memo_additional: "Additional Memo",
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
    no_health_records_message: "No health records found. Add a record!",
    medical_and_medication_expenses: "Medical & Medication Expenses",
    total_expense: "Total Expense",

    medical_contacts: "Medical Contacts",
    medical_contacts_btn: "Contacts",
    manage_medical_contacts: "Manage Contacts",
    add_medical_contact: "Add Contact",
    contact_type: "Type",
    hospital: "Hospital",
    clinic: "Clinic",
    pharmacy: "Pharmacy",
    contact_name: "Institution Name",
    contact_phone: "Phone Number",
    contact_address: "Address",
    contact_notes: "Notes",
    contact_name_placeholder: "e.g., Seoul National University Hospital",
    contact_phone_placeholder: "e.g., 02-1234-5678",
    contact_address_placeholder: "Enter address",
    contact_notes_placeholder: "Enter notes",
    no_medical_contacts_message: "No medical contacts found. Add one!",
    save_contact: "Save Contact",

    // To-Do List translations for English
    todo: "Todo",
    todo_list: "Todo List",
    add_todo: "Add Todo",
    todo_title: "Todo Title",
    todo_title_required: "Please enter a title for your todo",
    todo_description: "Description",
    todo_priority: "Priority",
    priority_low: "Low",
    priority_medium: "Medium",
    priority_high: "High",
    todo_due_date: "Due Date",
    todo_repeat: "Repeat",
    repeat_none: "None",
    repeat_daily: "Daily",
    repeat_weekly: "Weekly",
    repeat_monthly: "Monthly",
    todo_alarm: "Alarm",
    todo_alarm_notification: "Todo Reminder",
    invalid_alarm_time: "Invalid alarm time",
    todo_completed: "Completed",
    todo_incomplete: "Incomplete",
    mark_as_completed: "Mark as Completed",
    mark_as_incomplete: "Mark as Incomplete",
    no_todos_message: "No todos found. Add a new todo!",
    voice_input_todo: "Add by Voice",
    voice_input_active: "Listening...",
    total_todos: "Total Todos",
    completed_todos: "Completed Todos",
    pending_todos: "Pending Todos",
    filter_all: "All",
    filter_active: "Active",
    filter_completed: "Completed",
    confirm_delete: "Are you sure you want to delete this?",
    delete_success: "Deleted successfully!",
    delete_failed: "Deletion failed",

    // Schedule Section
    special_days: "Special Days",
    general_schedule: "General Schedule",
    special_day_reminder: "A special day is coming soon!",
    event_name: "Event Name",
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
    minutes_before: "minutes before",
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
    special_day_name_placeholder: "Name of the special day",
    alarm: "Alarm",
    day_off: "Day Off",
    "30_min_before": "30 minutes before",
    "1_hour_before": "1 hour before",
    "2_hours_before": "2 hours before",
    "12_hours_before": "12 hours before",
    "1_day_before": "1 day before",
    "2_days_before": "2 days before",
    "1_week_before": "1 week before",
    add_schedule: "Add Schedule",
    download_ics_description: "Download as an ICS file and add to your phone's calendar",
    title_label: "Title",
    category_label: "Category",
    description_label: "Description",
    attachments_label: "Attachments",

    // Travel Section
    travel_map: "Travel Map",
    map_zoom_instruction: "Zoom in",
    map_drag_instruction: "Drag to move",
    map_button_instruction: "Use +/- buttons to zoom",
    destination_label: "Destination",
    destination_placeholder: "e.g., Hallasan Mountain Jeju, Namsan Seoul, Paris, New York",
    latitude_label: "Latitude",
    longitude_label: "Longitude",
    auto_or_manual_input: "Auto-calculate or Manual Input",
    select_location_cancel: "Cancel Location Selection",
    select_location_on_map: "Select Location Directly on Map",
    select_location_instruction: "Click on the map to select the exact location",
    location_selected_message: "Location selected!",
    start_date_label: "Start Date",
    end_date_label: "End Date",
    city_category: "City",
    nature_category: "Nature",
    mountain_category: "Mountain",
    sea_category: "Sea",
    historic_category: "Historic Site",
    restaurant_category: "Restaurant",
    cafe_category: "Cafe",
    other_category: "Other",
    travel_expense_label: "Travel Expense ($)",
    travel_expense_placeholder: "Enter travel expense",
    expense_auto_save_notice: "This will be automatically recorded in your budget.",
    enter_destination: "Please enter a destination",
    enter_dates: "Please enter start and end dates",
    travel_saved: "Travel record saved!",
    travel_delete_confirm: "Do you want to delete this travel record?",
    no_travel_records: "No travel records yet",
    add_first_travel: "Add your first travel record!",
    file: "File",
    close_image: "Close Image",
    close: "Close",
    new_travel_record: "New Travel Record",
    edit_travel_record: "Edit Travel Record",
    coordinates_calculated: "Coordinates Calculated",
    attachments_count_label: "Attachments",
    travel_expense_with_unit: "Travel Expense",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI Travel Optimizer",
    ai_travel_optimizer_description:
      "AI will automatically generate the optimal travel itinerary based on your destination, duration, and budget.",
    destination_label: "Destination",
    destination_placeholder: "e.g., Seoul, Jeju Island, Tokyo",
    start_date_label: "Start Date",
    end_date_label: "End Date",
    budget_label: "Budget",
    budget_placeholder: "Estimated travel cost ($)",
    travel_style_label: "Travel Style",
    select_style: "Select Style",
    sightseeing: "Sightseeing Focused",
    relaxation: "Relaxation/Healing",
    food_tour: "Food Tour",
    adventure: "Activity/Adventure",
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
    apply_to_schedule: "Apply to Schedule",
    regenerate: "Regenerate",
    itinerary_applied: "Itinerary applied to schedule",
    optimization_failed: "Optimization failed",
    please_fill_required_fields: "Please fill in the required fields",

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
    backup_description: "You can export your data in JSON, CSV, or Excel format. Only JSON format can be restored.",
    export_data: "Export Data",
    restore_backup: "Restore Backup",
    restoring: "Restoring...",
    json_format: "JSON format (restorable)",
    csv_format: "CSV format (read-only)",
    excel_format: "Excel format (read-only)",
    login_required: "Login required",
    csv_downloaded: "CSV file downloaded",
    csv_export_failed: "CSV export failed",
    excel_downloaded: "Excel file downloaded",
    excel_export_failed: "Excel export failed",
    backup_downloaded: "Backup file downloaded",
    backup_error: "Backup failed",
    restore_success: "Restore successful",
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
    privacy_policy_description: "Review our policy on collecting and using personal information",
    privacy_last_updated: "Last Updated: December 2025",
    privacy_section1_title: "1. Information We Collect",
    privacy_section1_intro: "We collect the following information to provide services:",
    privacy_purpose1: "Email Address (for login and account management)",
    privacy_purpose2: "User-entered record data (Todos, Schedules, Budgets, Health, Travel, Notes, etc.)",
    privacy_purpose3: "Text for AI features (temporarily processed, not stored)",
    privacy_section2_title: "2. How We Store Information",
    privacy_collected1: "All data is stored encrypted on Supabase cloud.",
    privacy_collected2: "Supabase is a secure service with SOC2 and GDPR certifications.",
    privacy_section3_title: "3. Purpose of Information Use",
    privacy_storage_desc:
      "Collected information is used solely for service provision (record storage, AI analysis) and is not sold or shared with third parties.",
    privacy_supabase_desc: "When using AI features, text is sent to Groq API but not stored.",
    privacy_section4_title: "4. Personal Information Retention Period",
    privacy_retention_desc:
      "All personal information is deleted immediately upon account deletion. However, information required by law will be retained for the specified period.",
    privacy_section5_title: "5. User Rights",
    privacy_right1: "Access and modify personal information (Settings > Personal Information Management)",
    privacy_right2: "Download data (Settings > Backup/Restore)",
    privacy_right3: "Delete account (Settings > Danger Zone) - All data deleted immediately",
    privacy_section6_title: "6. Data Protection Officer",
    privacy_section7_title: "7. Personal Information Handling Upon Service Termination",
    privacy_termination_desc:
      "Upon service termination, users will be notified 30 days in advance, and a data export period will be provided.",
    privacy_data_deletion:
      "All personal information will be completely deleted from the Supabase database within 30 days of service termination.",

    // Terms of Service - English translations
    terms_of_service: "Terms of Service",
    terms_of_service_description: "Review the terms and conditions for using our service",
    terms_last_updated: "Last Updated: December 2025",
    terms_section1_title: "1. Service Description",
    terms_section1_desc:
      "This app provides services for personal life management. Basic functions are free, and premium features may be added in the future.",
    terms_section2_title: "2. Registration",
    terms_section2_desc: "Anyone can register freely with an email address.",
    terms_section3_title: "3. Services Provided",
    terms_service1: "Todo, Schedule, Diary, Note Management",
    terms_service2: "Budget, Health, Travel, Vehicle Record Management",
    terms_service3: "AI-based analysis and translation (using Groq AI)",
    terms_service4: "Data backup and restore",
    terms_service5: "Business card management, weather, radio, etc.",
    terms_section4_title: "4. User Obligations",
    terms_obligation1: "Do not collect or misuse others' personal information.",
    terms_obligation2: "Do not use the service for illegal purposes.",
    terms_obligation3: "Manage your account information securely.",
    terms_section5_title: "5. Service Changes and Notifications",
    terms_section5_desc: "Significant changes will be announced in advance via a banner at the top of the app.",
    terms_section6_title: "6. Service Interruption and Termination",
    terms_termination1:
      "The operator may interrupt service for reasons such as: natural disasters, system failures, operational reasons.",
    terms_termination2:
      "In case of service termination, notice will be given at least 30 days in advance via a banner at the top of the app.",
    terms_termination3: "A data export function will be available for 30 days after the termination notice.",
    terms_termination4: "As this is a free service, liability for damages due to service interruption is limited.",

    // Settings section - Personal Information translations for English
    personal_information: "Personal Information Management",
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
    data_export_description: "Use the data export function in the Backup/Restore section above.",
    fill_all_fields: "Please fill in all fields",
    email_updated_success: "Email updated successfully",
    email_update_error: "An error occurred while updating your email",

    // Danger Zone
    danger_zone: "Danger Zone",
    account_deletion_warning: "Deleting your account will permanently remove all your data and cannot be recovered.",
    data_deletion_report: "Generate Personal Information Deletion Report",
    data_deletion_report_desc:
      "Generates a report of deleted personal information for legal proof upon service termination.",
    generate_report: "Generate Report",
    generating_report: "Generating...",
    report_generated: "Deletion report generated",
    report_generation_failed: "Failed to generate deletion report",
    delete_account: "Delete Account",
    delete_account_title: "Delete Account",
    delete_account_warning_title: "⚠️ Warning: This action is irreversible",
    delete_warning_1: "All your records (todos, schedules, budgets, health, travel, etc.) will be permanently deleted.",
    delete_warning_2: "Your account information will be completely erased.",
    delete_warning_3: "Recovery is impossible after deletion.",
    delete_account_confirm_instruction: "To proceed, please type the following phrase exactly:",
    delete_account_confirm_phrase: "Permanently delete my account",
    delete_account_phrase_mismatch: "The phrase you entered does not match",
    account_deleted_success: "Account successfully deleted",
    account_deletion_failed: "An error occurred while deleting your account",
    deleting: "Deleting...",
    delete_permanently: "Delete Permanently",
    delete_account_email_reuse_info: "You can reuse the deleted email for signing up again.",
    email_verification_notice_title: "Email Verification Required After Sign-up",
    email_verification_notice_desc:
      "Please verify your email by clicking the confirmation link sent to your inbox after signing up.",

    // Announcement Management
    announcement_management: "Announcement Management",
    new_announcement: "New Announcement",
    edit_announcement: "Edit Announcement",
    announcement_message: "Announcement Message",
    announcement_message_placeholder: "Enter the announcement message to display to users",
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
    developer_info: "Chanse Lee, Janggi-dong, Gimpo-si",
    app_designer: "App Designer",
    designer_info: "Chanse Lee, Janggi-dong, Gimpo-si",
    back_to_forest: "Back to Forest",
    customer_support: "Customer Support",
    customer_support_description: "If you have any questions, please contact us via the email below.",
    support_email: "Support Email",
    app_introduction: "App Introduction",
    app_introduction_description:
      "This app is an integrated life management tool that allows you to manage all records of your daily life, including schedules, todos, budgets, health, travel, and vehicles, in one place.",
    notes_description: "Record notes, meeting minutes, ideas, etc., and summarize or translate them with AI.",
    diaries_description: "Write daily entries and protect them with a password.",
    schedules_description: "Manage your schedule in a calendar format and set reminders.",
    travel_records_description: "Plan your trips and optimize your itinerary with AI.",
    vehicle_records_description: "Manage vehicle maintenance records and preventive maintenance schedules.",
    health_records_description: "Manage health data, medication schedules, and medical contacts.",
    budget_description: "Record your income and expenses and analyze your budget with AI.",
    business_cards_description: "Scan business cards to automatically extract and manage information.",
    weather_description: "Check current weather and forecasts.",
    radio_description: "Listen to various radio channels.",
    data_backup: "Data Backup",
    data_backup_description: "You can export all your data in JSON, CSV, or Excel format.",
    diaries: "Diaries",
    schedules: "Schedules",
    travel_records: "Travel Records",
    vehicle_records: "Vehicle Records",
    health_records: "Health Records",
    legal_information: "Legal Information",
    privacy_policy_description: "Review our policy on collecting and using personal information",
    terms_of_service_description: "Review the terms and conditions for using our service",
    set_diary_password: "Set Diary Password",
    password_description: "Set a password to protect your diary entries.",
    new_password: "New Password",
    password_placeholder: "Minimum 4 characters",
    confirm_password: "Confirm Password",
    confirm_password_placeholder: "Re-enter password",
    set_password: "Set Password",
    skip: "Skip",
    locked_diary: "Locked Diary",
    enter_password_to_unlock: "Enter password to unlock diary",
    password: "Password",
    unlock: "Unlock",
    password_too_short: "Password must be at least 4 characters long",
    password_mismatch: "Passwords do not match",
    password_set: "Diary password has been set",
    unlocked: "Unlocked",
    wrong_password: "Incorrect password",
    password_changed: "Password changed successfully",
    confirm_remove_password: "Are you sure you want to remove the password?",
    password_removed: "Password removed successfully",
    lock_diary: "Lock Diary",
    security_question: "Security Question",
    security_not_set: "Security not set. To completely remove the password, remove it in Settings.",
    enter_security_answer: "Security Answer",
    security_answer_placeholder: "City where you were born",
    reset_password_description: "Reset to New Password",
    wrong_security_answer: "Security answer is incorrect",
    password_reset_success: "Password has been reset",
    security_answer_help: "Used when you forget your password",
    diary_password_management: "Diary Password Management",
    diary_password_description: "Remove or reset your diary password",

    // Vehicle Section Translations
    add_vehicle: "Add Vehicle",
    first_vehicle: "Register Your First Vehicle",
    vehicle_list: "Vehicle List",
    new_vehicle: "New Vehicle",
    edit_vehicle: "Edit Vehicle",
    vehicle_name_placeholder: "Vehicle Name (e.g., My Sonata)",
    license_plate_placeholder: "License Plate Number",
    vehicle_type_placeholder: "Vehicle Type (e.g., Sedan, SUV)",
    vehicle_model_placeholder: "Model Year (e.g., 2023)",
    purchase_year_placeholder: "Year of Purchase (e.g., 2023)",
    insurance_placeholder: "Insurance Company (e.g., Samsung Fire & Marine)",
    vehicle_type: "Vehicle Type",
    vehicle_model: "Model",
    purchase_year: "Purchase Year",
    insurance: "Insurance",
    insurance_fee: "Insurance Fee",
    register: "Register",
    update: "Update",
    vehicle_name_and_plate_required: "Vehicle name and license plate are required",
    vehicle_saved: "Vehicle saved successfully",
    save_error: "An error occurred while saving the vehicle",
    delete_vehicle_confirm: "Do you want to delete this vehicle?",
    deleted: "Deleted",
    delete_error: "An error occurred while deleting the vehicle",
    no_vehicles: "No vehicles registered",
    records_count: "Maintenance Records",
    schedules_count: "Maintenance Schedules",
    records_unit: "records",
    tap_to_add_maintenance_and_schedule: "Tap to add maintenance records and schedules",
    add_maintenance: "Add Maintenance Record",
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
    amount: "Cost",
    won_unit: "₩",
    amount_placeholder: "Enter cost",
    memo_placeholder: "Enter memo",
    save_maintenance: "Save Maintenance Record",
    date_required: "Date is required",
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
    description_placeholder: "Enter maintenance description",
    alarm_setting: "Alarm Setting",
    alarm_days_before: "Alarm X days before",
    days_before_2: "2 days before",
    days_before_7: "7 days before",
    days_before_14: "14 days before",
    days_before_30: "30 days before",
    save_schedule: "Save Schedule",
    scheduled_date_required: "Scheduled date is required",
    schedule_saved: "Schedule saved",
    delete_schedule_confirm: "Do you want to delete this schedule?",
    maintenance_alarm_title: "Vehicle Maintenance Reminder",
    maintenance_alarm_message: "Upcoming scheduled maintenance",

    // Storage Quota Translations
    storage_usage: "Storage Usage",
    storage_used: "Used",
    used: "Used",
    used_lowercase: "used",
    remaining: "Remaining",
    storage_full: "Storage is almost full! Delete files or upgrade to Premium.",
    storage_warning: "Storage usage has exceeded 80%. Please free up space.",
    premium: "Premium",
    upgrade_to_premium: "Upgrade to Premium",
    premium_benefits: "Get 500MB storage and more features",
    benefit_500mb: "500MB Storage",
    benefit_no_ads: "No Ads",
    benefit_priority_support: "Priority Support",
    upgrade_for_1_pi: "Upgrade for $1 Pi/month",
    upgrade_coming_soon: "Premium upgrade feature coming soon!",
    email_user_storage_info: "Email users get 500MB free storage",
    admin_storage_info: "Admin accounts get 1GB storage",

    // Announcement Translations
    announcement_welcome: "Welcome to Pi Life Manager!",
    announcement_maintenance: "Scheduled system maintenance. Please note for service usage.",
    announcement_update: "New features have been added. Check them out!",
    announcement_event: "A special event is happening!",

    // New Translations
    app_title: "Forest of Records",
    welcome_message: "Welcome to the Forest of Records!",
    logout: "Logout",
    my_forest: "My Forest",
    note_title_placeholder: "Enter title",
    note_content_placeholder: "Enter content",
    no_notes_message: "Add a note to record!",
    event_title_placeholder: "Event Title",
    start_time: "Start Time",
    end_time: "End Time",
    location: "Location",
    location_placeholder: "Enter location",
    no_events_message: "No events. Add a schedule!",
    search_location: "Search Location",
    weather_loading: "Loading weather...",
    weather_error: "Failed to fetch weather information.",
    precipitation: "Precipitation",
    weather_description: "Weather Description",
    visibility: "Visibility",
    pressure: "Pressure",
    today: "Today",
    tomorrow: "Tomorrow",
    travel_destination: "Travel Destination",
    travel_destination_placeholder: "e.g., Jeju Island, Gangwon Province",
    no_travels_message: "No travel records. Add a trip!",
    vehicle_name: "Vehicle Name",
    vehicle_name_placeholder: "e.g., My Avante",
    license_plate: "License Plate",
    license_plate_placeholder: "e.g., 12A 1234",
    vehicle_type: "Vehicle Type",
    car: "Car",
    motorcycle: "Motorcycle",
    bicycle: "Bicycle",
    no_vehicles_message: "No vehicle records. Register a vehicle!",
    mileage_placeholder: "Enter mileage",
    add_maintenance: "Add Maintenance",
    cost_placeholder: "Enter cost",
    no_maintenance_records: "No maintenance records found.",
    diary_content_placeholder: "How was your day?",
    no_diary_entries: "No diary entries. Write a diary!",
    todo_title_placeholder: "Enter todo",
    completed: "Completed",
    in_progress: "In Progress",
    not_started: "Not Started",
    radio_station_placeholder: "Radio Station Name",
    radio_url_placeholder: "Radio Streaming URL",
    add_station: "Add Station",
    no_stations_message: "No stations added.",
    play: "Play",
    stop: "Stop",
    of: "/",
    upgrade_storage: "Upgrade Storage",
    free_plan: "Free Plan",
    storage_full_warning: "Storage is full. Please delete unnecessary files or upgrade.",
    no_location_permission: "Location access permission is denied.",
    getting_location: "Getting location...",
    update: "Update",
    height: "Height",
    height_placeholder: "Enter height (cm)",
    weight: "Weight",
    blood_pressure_placeholder: "e.g., 120/80",
    blood_sugar_placeholder: "e.g., 90",
    heart_rate: "Heart Rate",
    heart_rate_placeholder: "Enter heart rate",
    notes_optional: "Notes (Optional)",
    notes_placeholder: "Enter additional notes",
    record_date: "Record Date",
    no_health_records: "No health records found.",
    health_metrics: "Health Metrics",
    medication_name_placeholder: "Enter medication name",
    dosage_placeholder: "Enter dosage",
    frequency_placeholder: "Enter frequency",
    no_medications: "No medications added.",
    add_medication: "Add Medication",
    medical_contacts: "Medical Contacts",
    add_contact: "Add Contact",
    contact_notes_placeholder: "Enter notes",
    todo_list: "Todo List",
    status: "Status",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    due_date: "Due Date",
    description: "Description",
    back_to_list: "Back to List",
    mark_as_completed: "Mark as Completed",
    mark_as_in_progress: "Mark as In Progress",
    no_description: "No description",
    created: "Created",
    last_updated: "Last Updated",
    terms_of_service: "Terms of Service",
    privacy_policy: "Privacy Policy",
    agree_to_terms: "I agree to the Terms of Service and Privacy Policy",
    sign_up: "Sign Up",
    already_have_account: "Already have an account?",
    sign_in: "Sign In",
    email_placeholder: "Email Address",
    signing_up: "Signing up...",
    signing_in: "Signing in...",
    forgot_password: "Forgot Password",
    or_continue_with: "Or continue with",
    google: "Google",
    dont_have_account: "Don't have an account?",
    enter_email_for_reset: "Enter your email for password reset",
    send_reset_link: "Send Reset Link",
    sending: "Sending...",
    back_to_sign_in: "Back to Sign In",
    reset_password: "Reset Password",
    admin: "Admin",
    consent_logs: "Consent Logs",
    user: "User",
    terms_version: "Terms Version",
    privacy_version: "Privacy Version",
    agreed_at: "Agreed At",
    user_agent: "User Agent",
    no_consent_logs: "No consent logs found",
    tos_title: "Terms of Service",
    tos_effective_date: "Effective Date",
    tos_last_updated: "Last Updated",
    tos_acceptance: "Acceptance of Terms",
    tos_acceptance_content: "I agree to the above Terms of Service.",
    tos_1_title: "Article 1 (Purpose)",
    tos_1_content: "These terms are for...",
    tos_2_title: "Article 2 (Definitions)",
    tos_2_content: "The terms used in these terms are defined as follows: ...",
    tos_3_title: "Article 3 (Service Agreement)",
    tos_3_content:
      "The service agreement is concluded when the user expresses their agreement to the contents of these terms. ...",
    tos_4_title: "Article 4 (User Obligations)",
    tos_4_content: "The user shall not engage in the following acts. ...",
    tos_5_title: "Article 5 (Service Provision and Interruption)",
    tos_5_content: "The company provides stable services to users. ...",
    tos_6_title: "Article 6 (Personal Information Protection)",
    tos_6_content: "The company complies with relevant laws such as the Personal Information Protection Act. ...",
    tos_7_title: "Article 7 (Disclaimer)",
    tos_7_content:
      "The company is exempt from responsibility for service provision in cases where service cannot be provided to due to force majeure events such as natural disasters, strikes, or enactment/amendment of relevant laws. ...",
    pp_title: "Privacy Policy",
    pp_effective_date: "Effective Date",
    pp_last_updated: "Last Updated",
    pp_intro: "This Privacy Policy is ...",
    pp_1_title: "Article 1 (Items and Methods of Personal Information Collection)",
    pp_1_content:
      "The company collects the following personal information for contract fulfillment, service provision, user identification, and service improvement. ...",
    pp_2_title: "Article 2 (Purpose of Personal Information Collection and Use)",
    pp_2_content: "The company uses the collected personal information only for the following purposes. ...",
    pp_3_title: "Article 3 (Personal Information Retention Period)",
    pp_3_content:
      "The company retains and uses personal information within the period of retention and use of personal information according to laws and regulations, or within the period of personal information retention and use consented to by the data subject at the time of collection. ...",
    pp_4_title: "Article 4 (Provision of Personal Information to Third Parties)",
    pp_4_content: "The company does not provide users' personal information to third parties in principle. ...",
    pp_5_title: "Article 5 (Destruction of Personal Information)",
    pp_5_content:
      "The company shall destroy the personal information without delay when it becomes unnecessary, such as upon expiration of the retention period or achievement of the processing purpose. ...",
    pp_6_title: "Article 6 (User Rights and Methods of Exercise)",
    pp_6_content: "Users can view or modify their registered personal information at any time. ...",
    pp_7_title: "Article 7 (Civil Service Regarding Personal Information)",
    pp_7_content:
      "The company designates the following departments and personal information protection officer to handle inquiries, opinions, and complaints regarding personal information processing. ...",
    pp_contact: "Personal Information Protection Officer",

    analyze_emotion: "Analyze Emotion",
    analyzing_emotion: "Analyzing...",
    emotion_analysis_result: "Emotion Analysis Result",
    emotion_analysis_failed: "Emotion analysis failed",
    diary_too_short_for_analysis: "Diary is too short to analyze",
    emotion_positive: "Positive",
    emotion_negative: "Negative",
    emotion_neutral: "Neutral",
    emotion_score: "Emotion Score",
    main_emotions: "Main Emotions",
    ai_advice: "AI Advice",
    security_question: "Security Question",
    security_not_set: "Security not set. To completely remove the password, remove it in Settings.",
    enter_security_answer: "Security Answer",
    security_answer_placeholder: "City where you were born",
    reset_password_description: "Reset to New Password",
    wrong_security_answer: "Security answer is incorrect",
    password_reset_success: "Password has been reset",
    security_answer_help: "Used when you forget your password",
    diary_password_management: "Diary Password Management",
    diary_password_description: "Remove or reset your diary password",

    repeat_frequency: "Repeat Frequency",
    repeat_until: "Repeat Until",
    repeat_schedule: "Repeat Schedule",
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
    back_to_forest: "森へ戻る",
    email: "メール",

    year: "年",
    month: "月",

    steps_unit: "歩",
    krw_unit: "₩",

    file_upload: "ファイルアップロード",
    take_photo: "写真撮影",
    shoot: "撮影", // Added Japanese translation for shoot button
    ocr_camera: "撮影→テキスト",
    ocr_upload: "画像→テキスト",
    handwriting: "手書き",
    speech_to_text: "音声→テキスト",
    speech_recognition: "音声認識中",
    stop_recognition: "音声認識停止",
    ocr_capture_and_process: "撮影＆テキスト抽出",
    ocr_take_photo: "撮影してテキスト抽出",
    ocr_processing: "処理中",
    ocr_completed: "認識完了",
    ocr_no_text_found: "テキストが見つかりません",
    ocr_error_occurred: "認識エラーが発生しました",
    clear: "クリア",
    stop_recording: "録音停止",
    audio_recording: "音声録音",
    video_recording: "動画録画",
    attachments: "添付ファイル",
    video_cannot_play: "動画を再生できません",
    audio_cannot_play: "音声ファイルを再生できません",
    audio_permission_required: "マイクの権限が必要です",
    video_permission_required: "カメラの権限が必要です",
    camera_permission_required: "カメラの権限が必要です",
    speech_recognition_not_supported: "ブラウザが音声認識をサポートしていません",
    mic_permission_required: "マイクの権限が必要です",
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
    filter_by_tag: "タグでフィルタ",
    manage: "管理",

    organize_meeting_minutes: "AI会議議事録整理",
    organizing_meeting: "整理中...",
    content_required_for_organize: "議事録内容を入力してください",
    confirm_organize_meeting: "AIが議事録を整理します。続行しますか？",
    meeting_organized_success: "議事録が整理されました！",
    meeting_organize_failed: "議事録の整理に失敗しました",
    summarize_note: "AIノート要約",
    summarizing: "要約中...",
    content_required_for_summary: "要約する内容を入力してください",
    note_summarized_success: "ノートが要約されました！",
    note_summary_failed: "ノートの要約に失敗しました",
    summary_result: "要約結果",
    replace_with_summary: "要約に置き換える",
    add_summary_below: "下に挿入",
    translate_note: "AI翻訳",
    translating: "翻訳中...",
    content_required_for_translation: "翻訳する内容を入力してください",
    translation_result: "翻訳結果",
    replace_with_translation: "翻訳に置き換える",
    add_translation_below: "下に挿入",
    select_target_language: "翻訳言語を選択",
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
    view_graph: "グラフ表示",
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
    medication_name: "薬の名前",
    dosage: "用量",
    frequency: "服用周期",
    time: "服用時間",
    start_date: "開始日",
    end_date: "終了日",
    add_time: "時間追加",
    add_medication: "服薬追加",
    save_medication_schedule: "服薬スケジュール保存",
    enable_alarm: "アラームをオンにする",
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
    medicine_name: "薬の名前",
    medicine_name_placeholder: "薬の名前を入力してください",
    dosage_placeholder: "例：1錠",
    frequency_placeholder: "例：1日3回",
    medication_times: "服用時間",
    end_date_optional: "終了日（任意）",
    add_medication_schedule: "服薬スケジュール追加",
    dosage_label: "用量:",
    frequency_label: "服用周期:",
    today_medication_times: "今日の服用時間",
    systolic: "収縮期",
    diastolic: "拡張期",
    no_health_records_message: "健康記録がありません。記録を追加しましょう！",
    medical_and_medication_expenses: "医療費・薬代",
    total_expense: "合計金額",

    medical_contacts: "医療連絡先",
    medical_contacts_btn: "連絡先",
    manage_medical_contacts: "連絡先管理",
    add_medical_contact: "連絡先追加",
    contact_type: "タイプ",
    hospital: "病院",
    clinic: "診療所",
    pharmacy: "薬局",
    contact_name: "機関名",
    contact_phone: "電話番号",
    contact_address: "住所",
    contact_notes: "メモ",
    contact_name_placeholder: "例：東京大学病院",
    contact_phone_placeholder: "例：03-1234-5678",
    contact_address_placeholder: "住所を入力してください",
    contact_notes_placeholder: "メモを入力してください",
    no_medical_contacts_message: "医療連絡先がありません。連絡先を追加しましょう！",
    save_contact: "連絡先を保存",

    // To-Do List translations for Japanese
    todo: "やること",
    todo_list: "やることリスト",
    add_todo: "やること追加",
    todo_title: "やることタイトル",
    todo_title_required: "やることのタイトルを入力してください",
    todo_description: "説明",
    todo_priority: "優先度",
    priority_low: "低",
    priority_medium: "中",
    priority_high: "高",
    todo_due_date: "期日",
    todo_repeat: "繰り返し",
    repeat_none: "繰り返さない",
    repeat_daily: "毎日",
    repeat_weekly: "毎週",
    repeat_monthly: "毎月",
    todo_alarm: "アラーム",
    todo_alarm_notification: "やることリマインダー",
    invalid_alarm_time: "アラーム時間が無効です",
    todo_completed: "完了",
    todo_incomplete: "未完了",
    mark_as_completed: "完了にする",
    mark_as_incomplete: "未完了にする",
    no_todos_message: "やることがありません。新しいやことを追加しましょう！",
    voice_input_todo: "音声で追加",
    voice_input_active: "認識中...",
    total_todos: "全やること",
    completed_todos: "完了したやること",
    pending_todos: "未完了のやること",
    filter_all: "すべて",
    filter_active: "進行中",
    filter_completed: "完了",
    confirm_delete: "本当に削除しますか？",
    delete_success: "削除しました！",
    delete_failed: "削除失敗",

    // Schedule Section
    special_days: "特別な日",
    general_schedule: "一般スケジュール",
    special_day_reminder: "特別な日がもうすぐです！",
    event_name: "イベント名",
    category: "カテゴリ",
    birthday: "誕生日",
    anniversary: "記念日",
    holiday: "祝日",
    vacation: "休暇",
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
    special_days_batch_title: "✨ 特別な日 一括登録",
    special_days_batch_description: "家族の誕生日、記念日などをまとめて登録しましょう",
    schedule_number: "スケジュール",
    save_schedules_count: "スケジュール保存",
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
    download_ics_description: "ICSファイルとしてダウンロードし、携帯カレンダーに追加",
    title_label: "タイトル",
    category_label: "カテゴリ",
    description_label: "説明",
    attachments_label: "添付ファイル",

    // Travel Section
    travel_map: "旅行マップ",
    map_zoom_instruction: "拡大",
    map_drag_instruction: "ドラッグして移動",
    map_button_instruction: "+/- ボタンで拡大/縮小",
    destination_label: "目的地",
    destination_placeholder: "例：富士山、京都、パリ、ニューヨーク",
    latitude_label: "緯度",
    longitude_label: "経度",
    auto_or_manual_input: "自動計算または手動入力",
    select_location_cancel: "場所選択キャンセル",
    select_location_on_map: "地図上で場所を直接選択",
    select_location_instruction: "正確な場所を選択するには地図をクリックしてください",
    location_selected_message: "場所が選択されました！",
    start_date_label: "出発日",
    end_date_label: "終了日",
    city_category: "都市",
    nature_category: "自然",
    mountain_category: "山",
    sea_category: "海",
    historic_category: "史跡",
    restaurant_category: "レストラン",
    cafe_category: "カフェ",
    other_category: "その他",
    travel_expense_label: "旅行費用（円）",
    travel_expense_placeholder: "旅行費用を入力",
    expense_auto_save_notice: "家計簿に自動記録されます",
    enter_destination: "目的地を入力してください",
    enter_dates: "出発日と終了日を入力してください",
    travel_saved: "旅行記録が保存されました！",
    travel_delete_confirm: "この旅行記録を削除しますか？",
    no_travel_records: "まだ旅行記録がありません",
    add_first_travel: "最初の旅行記録を追加しましょう！",
    file: "ファイル",
    close_image: "拡大画像",
    close: "閉じる",
    new_travel_record: "新規旅行記録",
    edit_travel_record: "旅行記録編集",
    coordinates_calculated: "座標計算済み",
    attachments_count_label: "添付ファイル",
    travel_expense_with_unit: "旅行費用",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI旅行スケジュール最適化",
    ai_travel_optimizer_description: "AIが目的地、旅行期間、予算に基づいて最適な旅行スケジュールを自動生成します。",
    destination_label: "目的地",
    destination_placeholder: "例：東京、京都、北海道",
    start_date_label: "開始日",
    end_date_label: "終了日",
    budget_label: "予算",
    budget_placeholder: "旅行予算（円）",
    travel_style_label: "旅行スタイル",
    select_style: "選択してください",
    sightseeing: "観光中心",
    relaxation: "リラクゼーション/癒し",
    food_tour: "グルメツアー",
    adventure: "アクティビティ/冒険",
    cultural: "文化/歴史探訪",
    generate_itinerary: "スケジュール生成",
    optimizing: "最適化中...",
    trip_summary: "旅行概要",
    day: "日",
    recommendations: "おすすめ",
    recommended_restaurants: "おすすめレストラン",
    recommended_attractions: "おすすめ観光地",
    travel_tips: "旅行のヒント",
    budget_breakdown: "予算内訳",
    accommodation: "宿泊",
    food: "食費",
    transportation: "交通費",
    activities: "観光・体験",
    total: "合計",
    apply_to_schedule: "スケジュールに追加",
    regenerate: "再生成",
    itinerary_applied: "旅行スケジュールが追加されました",
    optimization_failed: "最適化に失敗しました",
    please_fill_required_fields: "必須項目を入力してください",

    // Weather Section
    loading_weather: "天気データを読み込み中...",
    refresh: "更新",
    current_temp: "現在の気温",
    weather_status: "天気",
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
    loading_stats: "統計情報を読み込み中...",
    total_records: "総記録数",
    precious_memories: "大切な思い出",

    // Settings Section
    backup_restore_title: "データバックアップ＆復元",
    backup_description: "JSON、CSV、Excel形式でデータをエクスポートできます。JSON形式のみ復元可能です。",
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
    restore_success: "復元完了",
    restore_error: "復元失敗",
    not_logged_in: "未ログイン",
    logged_in: "ログイン済み",
    user_guide_title: "ユーザーガイド",
    user_guide: "ユーザーガイド",
    open_guide: "ガイドを開く",
    connection_status_title: "接続状態",
    connection_label: "Supabase接続",

    // Privacy Policy - Japanese translations
    privacy_policy: "プライバシーポリシー",
    privacy_policy_description: "個人情報の収集・利用に関するポリシーをご確認ください",
    privacy_last_updated: "最終更新日：2025年12月",
    privacy_section1_title: "1. 収集する情報",
    privacy_section1_intro: "サービス提供のために、以下の情報を収集します:",
    privacy_purpose1: "メールアドレス（ログインおよびアカウント管理用）",
    privacy_purpose2: "ユーザーが直接入力する記録データ（ToDo、スケジュール、予算、健康、旅行、メモなど）",
    privacy_purpose3: "AI機能利用時のテキスト（一時的に処理され、保存されません）",
    privacy_section2_title: "2. 情報の保存方法",
    privacy_collected1: "すべてのデータはSupabaseクラウドに暗号化されて保存されます。",
    privacy_collected2: "SupabaseはSOC2、GDPR認証を受けた安全なサービスです。",
    privacy_section3_title: "3. 情報利用目的",
    privacy_storage_desc:
      "収集した情報は、サービス提供（記録保存、AI分析）のみに使用され、第三者に販売または提供することはありません。",
    privacy_supabase_desc: "AI機能使用時、テキストはGroq APIに送信されますが、保存されません。",
    privacy_section4_title: "4. 個人情報の保有期間",
    privacy_retention_desc:
      "会員退会時には、すべての個人情報は直ちに削除されます。ただし、法令で定められた保管義務がある場合は、当該期間保管します。",
    privacy_section5_title: "5. ユーザーの権利",
    privacy_right1: "個人情報の閲覧・修正（設定 > 個人情報管理）",
    privacy_right2: "データダウンロード（設定 > バックアップ/復元）",
    privacy_right3: "アカウント削除（設定 > 危険区域） - 全データ即時削除",
    privacy_section6_title: "6. 保護責任者",
    privacy_section7_title: "7. サービス終了時の個人情報処理",
    privacy_termination_desc: "サービス終了時には、ユーザーに30日前にお知らせし、データエクスポート期間を提供します。",
    privacy_data_deletion: "サービス終了後30日以内に、すべての個人情報をSupabaseデータベースから完全に削除します。",

    // Terms of Service - Simplified Japanese translations
    terms_of_service: "利用規約",
    terms_of_service_description: "サービス利用規約および規定をご確認ください",
    terms_last_updated: "最終更新日：2025年12月",
    terms_section1_title: "1. サービス定義",
    terms_section1_desc:
      "このアプリは、個人の生活管理のためのサービスを提供します。基本機能は無料であり、将来的にプレミアム機能が追加される可能性があります。",
    terms_section2_title: "2. 会員登録",
    terms_section2_desc: "誰でもメールアドレスで自由に登録できます。",
    terms_section3_title: "3. 提供サービス",
    terms_service1: "ToDo、スケジュール、日記、メモ管理",
    terms_service2: "予算、健康、旅行、車両記録管理",
    terms_service3: "AIベースの分析と翻訳（Groq AIを使用）",
    terms_service4: "データバックアップと復元",
    terms_service5: "名刺管理、天気、ラジオなど",
    terms_section4_title: "4. ユーザーの義務",
    terms_obligation1: "他人の個人情報を無断で収集または窃用しないこと",
    terms_obligation2: "サービスを不正な目的で使用しないこと",
    terms_obligation3: "アカウント情報を安全に管理すること",
    terms_section5_title: "5. サービス変更および通知",
    terms_section5_desc: "重要な変更点は、アプリ上部バナーで事前にお知らせします。",
    terms_section6_title: "6. サービス中断および終了",
    terms_termination1: "運営者は、天災地変、システム障害、経営上の理由によりサービスを中断することができます。",
    terms_termination2: "サービス終了時には、最低30日前までにアプリ上部バナーでお知らせします。",
    terms_termination3: "終了告知後30日間、データエクスポート機能を提供します。",
    terms_termination4: "無料サービスのため、サービス中断による損害賠償責任は制限されます。",

    // Settings section - Personal Information translations for Japanese
    personal_information: "個人情報管理",
    view: "表示",
    hide: "非表示",
    account_information: "アカウント情報",
    user_id: "ユーザーID",
    account_created: "登録日",
    change_email: "メールアドレス変更",
    update_email: "メールアドレス更新",
    new_email: "新しいメールアドレス",
    enter_password: "パスワードを入力",
    updating: "更新中...",
    data_management: "データ管理",
    data_management_description: "会員の個人情報を確認・管理できます。",
    view_data: "データ参照",
    data_export_description: "上記のバックアップ/復元セクションのデータエクスポート機能を使用してください。",
    fill_all_fields: "すべての項目を入力してください",
    email_updated_success: "メールアドレスが正常に更新されました",
    email_update_error: "メールアドレスの更新中にエラーが発生しました",

    // Danger Zone
    danger_zone: "危険区域",
    account_deletion_warning: "アカウントを削除すると、すべてのデータが永久に削除され、復元できません。",
    data_deletion_report: "個人情報破棄台帳作成",
    data_deletion_report_desc: "サービス終了時に、法的な証明のための個人情報破棄台帳を作成します。",
    generate_report: "破棄台帳作成",
    generating_report: "作成中...",
    report_generated: "破棄台帳が作成されました",
    report_generation_failed: "破棄台帳の作成に失敗しました",
    delete_account: "アカウント削除",
    delete_account_title: "アカウント削除",
    delete_account_warning_title: "⚠️ 警告：この操作は元に戻せません",
    delete_warning_1: "すべての記録（ToDo、スケジュール、予算、健康、旅行など）が永久に削除されます。",
    delete_warning_2: "アカウント情報が完全に削除されます。",
    delete_warning_3: "削除後の復元は不可能です。",
    delete_account_confirm_instruction: "続行するには、以下のフレーズを正確に入力してください:",
    delete_account_confirm_phrase: "アカウントを完全に削除します",
    delete_account_phrase_mismatch: "入力したフレーズが一致しません",
    account_deleted_success: "アカウントが正常に削除されました",
    account_deletion_failed: "アカウント削除中にエラーが発生しました",
    deleting: "削除中...",
    delete_permanently: "永久削除",
    delete_account_email_reuse_info: "削除したメールアドレスは再度登録に使用できます。",
    email_verification_notice_title: "会員登録後のメール確認が必要",
    email_verification_notice_desc: "会員登録後、受信トレイの確認メールをクリックして認証を完了してください。",

    // Announcement Management
    announcement_management: "お知らせ管理",
    new_announcement: "新規お知らせ",
    edit_announcement: "お知らせ編集",
    announcement_message: "お知らせメッセージ",
    announcement_message_placeholder: "ユーザーに表示するお知らせを入力してください",
    announcement_type: "お知らせタイプ",
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
    developer_info: "金浦市 長基洞 イ・チャンセ",
    app_designer: "アプリデザイナー",
    designer_info: "金浦市 長基洞 イ・チャンセ",
    back_to_forest: "森へ戻る",
    customer_support: "カスタマーサポート",
    customer_support_description: "ご不明な点がございましたら、下記メールアドレスまでご連絡ください。",
    support_email: "サポートメール",
    app_introduction: "アプリ紹介",
    app_introduction_description:
      "このアプリは、スケジュール、ToDo、予算、健康、旅行、車両など、日常生活のすべての記録を一箇所で管理できる統合生活管理ツールです。",
    notes_description: "メモ、会議議事録、アイデアなどを記録し、AIで要約・翻訳できます。",
    diaries_description: "毎日の日記を書き、パスワードで保護できます。",
    schedules_description: "スケジュールをカレンダー形式で管理し、通知を設定できます。",
    travel_records_description: "旅行計画を立て、AIでスケジュールを最適化できます。",
    vehicle_records_description: "車両の整備記録と予防整備スケジュールを管理できます。",
    health_records_description: "健康データ、服薬スケジュール、医療連絡先を管理できます。",
    budget_description: "収入と支出を記録し、AIで予算を分析できます。",
    business_cards_description: "名刺を撮影して情報を自動抽出し、管理できます。",
    weather_description: "現在の天気と予報を確認できます。",
    radio_description: "様々なラジオチャンネルを聴くことができます。",
    data_backup: "データバックアップ",
    data_backup_description: "すべてのデータをJSON、CSV、Excel形式でエクスポート・インポートできます。",
    diaries: "日記",
    schedules: "スケジュール",
    travel_records: "旅行記録",
    vehicle_records: "車両記録",
    health_records: "健康記録",
    legal_information: "法的情報",
    privacy_policy_description: "個人情報の収集・利用に関するポリシーをご確認ください",
    terms_of_service_description: "サービス利用規約および規定をご確認ください",
    set_diary_password: "日記パスワード設定",
    password_description: "日記を保護するためのパスワードを設定してください。",
    new_password: "新しいパスワード",
    password_placeholder: "最低4文字",
    confirm_password: "パスワード確認",
    confirm_password_placeholder: "パスワードを再入力",
    set_password: "パスワード設定",
    skip: "スキップ",
    locked_diary: "ロックされた日記",
    enter_password_to_unlock: "パスワードを入力して日記を開いてください",
    password: "パスワード",
    unlock: "ロック解除",
    password_too_short: "パスワードは最低4文字必要です",
    password_mismatch: "パスワードが一致しません",
    password_set: "日記パスワードが設定されました",
    unlocked: "ロックが解除されました",
    wrong_password: "パスワードが間違っています",
    password_changed: "パスワードが変更されました",
    confirm_remove_password: "本当にパスワードを削除しますか？",
    password_removed: "パスワードが削除されました",
    lock_diary: "日記をロック",
    security_question: "セキュリティの質問: 生まれた都市?",
    security_not_set: "セキュリティが設定されていません。パスワードを完全に削除するには、設定から削除してください。",
    enter_security_answer: "セキュリティの回答",
    security_answer_placeholder: "生まれた都市",
    reset_password_description: "新しいパスワードにリセット",
    wrong_security_answer: "セキュリティの回答が正しくありません",
    password_reset_success: "パスワードがリセットされました",
    security_answer_help: "パスワードを忘れた時に使用されます",
    diary_password_management: "日記パスワード管理",
    diary_password_description: "日記のパスワードを削除またはリセットします",

    // Vehicle Section Translations
    add_vehicle: "車両追加",
    first_vehicle: "初回車両登録",
    vehicle_list: "車両リスト",
    new_vehicle: "新規車両",
    edit_vehicle: "車両編集",
    vehicle_name_placeholder: "車両名（例：マイ・ソナタ）",
    license_plate_placeholder: "車両番号",
    vehicle_type_placeholder: "車種（例：セダン、SUV）",
    vehicle_model_placeholder: "モデル年式（例：2023年式）",
    purchase_year_placeholder: "購入年（例：2023）",
    insurance_placeholder: "保険会社（例：東京海上日動）",
    vehicle_type: "車種",
    vehicle_model: "モデル",
    purchase_year: "購入年",
    insurance: "保険",
    insurance_fee: "保険料",
    register: "登録",
    update: "更新",
    vehicle_name_and_plate_required: "車両名と番号を入力してください",
    vehicle_saved: "車両が保存されました",
    save_error: "車両保存中にエラーが発生しました",
    delete_vehicle_confirm: "この車両を削除しますか？",
    deleted: "削除しました",
    delete_error: "車両削除中にエラーが発生しました",
    no_vehicles: "登録された車両がありません",
    records_count: "整備記録",
    schedules_count: "整備スケジュール",
    records_unit: "件",
    tap_to_add_maintenance_and_schedule: "タップして整備記録とスケジュールを追加",
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
    won_unit: "₩",
    amount_placeholder: "費用を入力",
    memo_placeholder: "メモを入力",
    save_maintenance: "整備記録保存",
    date_required: "日付が必要です",
    maintenance_saved: "整備記録が保存されました",
    delete_maintenance_confirm: "この整備記録を削除しますか？",
    maintenance_history: "整備履歴",
    attachments_count: "添付",
    no_records: "記録がありません",
    preventive_schedule: "予防整備スケジュール",
    preventive_input: "予防整備入力",
    scheduled_date: "予定日",
    estimated_mileage: "予想走行距離",
    estimated_mileage_placeholder: "予想走行距離を入力",
    description: "説明",
    description_placeholder: "整備内容を入力",
    alarm_setting: "アラーム設定",
    alarm_days_before: "X日前アラーム",
    days_before_2: "2日前",
    days_before_7: "7日前",
    days_before_14: "14日前",
    days_before_30: "30日前",
    save_schedule: "スケジュール保存",
    scheduled_date_required: "予定日が必要です",
    schedule_saved: "スケジュールが保存されました",
    delete_schedule_confirm: "このスケジュールを削除しますか？",
    maintenance_alarm_title: "車両整備リマインダー",
    maintenance_alarm_message: "予定されている整備スケジュール",

    // Storage Quota Translations
    storage_usage: "ストレージ使用量",
    storage_used: "使用中",
    used: "使用済み",
    used_lowercase: "使用済み",
    remaining: "残り",
    storage_full: "ストレージがいっぱいです！ファイルを削除するか、プレミアムにアップグレードしてください。",
    storage_warning: "ストレージ使用率が80%を超えました。スペースを確保してください。",
    premium: "プレミアム",
    upgrade_to_premium: "プレミアムにアップグレード",
    premium_benefits: "500MBのストレージと追加機能を利用できます",
    benefit_500mb: "500MBストレージ",
    benefit_no_ads: "広告なし",
    benefit_priority_support: "優先サポート",
    upgrade_for_1_pi: "月額1 Piでアップグレード",
    upgrade_coming_soon: "プレミアムアップグレード機能が近日登場！",
    email_user_storage_info: "メールユーザーは500MBの無料ストレージを利用できます",
    admin_storage_info: "管理者は1GBのストレージを利用できます",

    // Announcement Translations
    announcement_welcome: "Pi Life Managerへようこそ！",
    announcement_maintenance: "システムメンテナンスが予定されています。サービス利用にご注意ください。",
    announcement_update: "新機能が追加されました。ぜひご確認ください！",
    announcement_event: "特別イベント開催中！",

    // New Translations
    app_title: "記録の森",
    welcome_message: "記録の森へようこそ！",
    logout: "ログアウト",
    my_forest: "マイフォレスト",
    note_title_placeholder: "タイトルを入力",
    note_content_placeholder: "内容を入力",
    no_notes_message: "記録するノートを追加しましょう！",
    event_title_placeholder: "イベントタイトル",
    start_time: "開始時間",
    end_time: "終了時間",
    location: "場所",
    location_placeholder: "場所を入力",
    no_events_message: "イベントがありません。スケジュールを追加しましょう！",
    search_location: "場所を検索",
    weather_loading: "天気情報読み込み中...",
    weather_error: "天気情報の取得に失敗しました。",
    precipitation: "降水量",
    weather_description: "天気",
    visibility: "視程",
    pressure: "気圧",
    today: "今日",
    tomorrow: "明日",
    travel_destination: "旅行先",
    travel_destination_placeholder: "例：北海道、沖縄",
    no_travels_message: "旅行記録がありません。旅行を追加しましょう！",
    vehicle_name: "車両名",
    vehicle_name_placeholder: "例：マイ・アバンテ",
    license_plate: "車両番号",
    license_plate_placeholder: "例：123 あ 4567",
    vehicle_type: "車種",
    car: "乗用車",
    motorcycle: "バイク",
    bicycle: "自転車",
    no_vehicles_message: "車両記録がありません。車両を登録しましょう！",
    mileage_placeholder: "走行距離を入力",
    add_maintenance: "整備追加",
    cost_placeholder: "費用を入力",
    no_maintenance_records: "整備記録がありません。",
    diary_content_placeholder: "今日はどんな一日でしたか？",
    no_diary_entries: "日記がありません。日記を書きましょう！",
    todo_title_placeholder: "やること入力",
    completed: "完了",
    in_progress: "進行中",
    not_started: "未着手",
    radio_station_placeholder: "ラジオ局名",
    radio_url_placeholder: "ラジオストリーミングURL",
    add_station: "局追加",
    no_stations_message: "登録された局はありません。",
    play: "再生",
    stop: "停止",
    of: "/",
    upgrade_storage: "ストレージアップグレード",
    free_plan: "無料プラン",
    storage_full_warning: "ストレージがいっぱいです。不要なファイルを削除するか、アップグレードしてください。",
    no_location_permission: "位置情報へのアクセス権限がありません。",
    getting_location: "位置情報取得中...",
    update: "更新",
    height: "身長",
    height_placeholder: "身長を入力 (cm)",
    weight: "体重",
    blood_pressure_placeholder: "例：120/80",
    blood_sugar_placeholder: "例：90",
    heart_rate: "心拍数",
    heart_rate_placeholder: "心拍数を入力",
    notes_optional: "メモ（任意）",
    notes_placeholder: "追加メモを入力",
    record_date: "記録日",
    no_health_records: "健康記録がありません。",
    health_metrics: "健康指標",
    medication_name_placeholder: "薬の名前を入力",
    dosage_placeholder: "用量を入力",
    frequency_placeholder: "頻度を入力",
    no_medications: "登録された薬はありません。",
    add_medication: "薬を追加",
    medical_contacts: "医療連絡先",
    add_contact: "連絡先追加",
    contact_notes_placeholder: "メモを入力",
    todo_list: "やることリスト",
    status: "ステータス",
    priority: "優先度",
    high: "高",
    medium: "中",
    low: "低",
    due_date: "期日",
    description: "説明",
    back_to_list: "リストに戻る",
    mark_as_completed: "完了としてマーク",
    mark_as_in_progress: "進行中としてマーク",
    no_description: "説明なし",
    created: "作成日",
    last_updated: "最終更新日",
    terms_of_service: "利用規約",
    privacy_policy: "プライバシーポリシー",
    agree_to_terms: "利用規約およびプライバシーポリシーに同意します",
    sign_up: "サインアップ",
    already_have_account: "アカウントをお持ちですか？",
    sign_in: "サインイン",
    email_placeholder: "メールアドレス",
    signing_up: "サインアップ中...",
    signing_in: "サインイン中...",
    forgot_password: "パスワードを忘れた場合",
    or_continue_with: "またはで続行",
    google: "Google",
    dont_have_account: "アカウントをお持ちでないですか？",
    enter_email_for_reset: "パスワードリセットのためにメールアドレスを入力してください",
    send_reset_link: "リセットリンクを送信",
    sending: "送信中...",
    back_to_sign_in: "サインインに戻る",
    reset_password: "パスワードリセット",
    admin: "管理者",
    consent_logs: "同意ログ",
    user: "ユーザー",
    terms_version: "利用規約バージョン",
    privacy_version: "プライバシーポリシーバージョン",
    agreed_at: "同意日時",
    user_agent: "ユーザーエージェント",
    no_consent_logs: "同意ログがありません",
    tos_title: "利用規約",
    tos_effective_date: "発効日",
    tos_last_updated: "最終更新日",
    tos_acceptance: "利用規約への同意",
    tos_acceptance_content: "私は上記の利用規約に同意します。",
    tos_1_title: "第1条（目的）",
    tos_1_content: "本規約は...",
    tos_2_title: "第2条（定義）",
    tos_2_content: "本規約で使用される用語の定義は次のとおりです。...",
    tos_3_title: "第3条（利用契約）",
    tos_3_content: "利用契約は、利用者が本規約の内容に同意の意思表示をすることにより締結されます。...",
    tos_4_title: "第4条（利用者の義務）",
    tos_4_content: "利用者は、次の各号の行為をしてはなりません。...",
    tos_5_title: "第5条（サービス提供および中断）",
    tos_5_content: "当社は、利用者に安定したサービスを提供します。...",
    tos_6_title: "第6条（個人情報保護）",
    tos_6_content: "当社は、個人情報保護法等関連法令を遵守します。...",
    tos_7_title: "第7条（免責事項）",
    tos_7_content:
      "当社は、天災地変、ストライキ、関連法令の制定・改廃等、不可抗力によりサービスを提供できない場合には、サービス提供に関する責任を免除されます。...",
    pp_title: "プライバシーポリシー",
    pp_effective_date: "発効日",
    pp_last_updated: "最終更新日",
    pp_intro: "本プライバシーポリシーは...",
    pp_1_title: "第1条（収集する個人情報の項目および収集方法）",
    pp_1_content:
      "当社は、利用契約の履行、サービス提供、利用者識別、サービス改善のために、次のような個人情報を収集します。...",
    pp_2_title: "第2条（個人情報の収集および利用目的）",
    pp_2_content: "当社は、収集した個人情報を次の目的のためにのみ利用します。...",
    pp_3_title: "第3条（個人情報の保有および利用期間）",
    pp_3_content:
      "当社は、法令による個人情報の保有・利用期間、または情報主体から個人情報の収集時に同意を得た個人情報の保有・利用期間内で個人情報を保有・利用します。...",
    pp_4_title: "第4条（個人情報の第三者提供）",
    pp_4_content: "当社は、利用者の個人情報を原則として第三者に提供しません。...",
    pp_5_title: "第5条（個人情報の破棄）",
    pp_5_content:
      "当社は、個人情報の保有期間の経過、処理目的の達成等、当該個人情報が不要になった場合、遅滞なく当該個人情報を破棄します。...",
    pp_6_title: "第6条（利用者および法定代理人の権利と行使方法）",
    pp_6_content: "利用者は、いつでも登録されている自身の個人情報を閲覧または修正できます。...",
    pp_7_title: "第7条（個人情報に関する民事サービス）",
    pp_7_content:
      "当社は、個人情報の処理に関する質問、意見、不満などを処理するために、以下のとおり担当部署および個人情報保護責任者を指定しています。...",
    pp_contact: "個人情報保護責任者",

    analyze_emotion: "感情分析",
    analyzing_emotion: "分析中...",
    emotion_analysis_result: "感情分析結果",
    emotion_analysis_failed: "感情分析に失敗しました",
    diary_too_short_for_analysis: "日記が短すぎて分析できません",
    emotion_positive: "肯定的",
    emotion_negative: "否定的",
    emotion_neutral: "中立",
    emotion_score: "感情スコア",
    main_emotions: "主な感情",
    ai_advice: "AIアドバイス",
    security_question: "セキュリティの質問: 生まれた都市?",
    security_not_set: "セキュリティが設定されていません。パスワードを完全に削除するには、設定から削除してください。",
    enter_security_answer: "セキュリティの回答",
    security_answer_placeholder: "生まれた都市",
    reset_password_description: "新しいパスワードにリセット",
    wrong_security_answer: "セキュリティの回答が正しくありません",
    password_reset_success: "パスワードがリセットされました",
    security_answer_help: "パスワードを忘れた時に使用されます",
    diary_password_management: "日記パスワード管理",
    diary_password_description: "日記のパスワードを削除またはリセットします",

    repeat_frequency: "繰り返し頻度",
    repeat_until: "繰り返し終了日",
    repeat_schedule: "繰り返しスケジュール",
  },

  zh: {
    // Common
    title: "记录森林",
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

    year: "年",
    month: "月",

    steps_unit: "步",
    krw_unit: "₩",

    file_upload: "上传文件",
    take_photo: "拍照",
    shoot: "拍摄", // Added Chinese translation for shoot button
    ocr_camera: "拍照→文本",
    ocr_upload: "图片→文本",
    handwriting: "手写",
    speech_to_text: "语音→文本",
    speech_recognition: "语音识别中",
    stop_recognition: "停止语音识别",
    ocr_capture_and_process: "拍摄并提取文本",
    ocr_take_photo: "拍摄照片提取文本",
    ocr_processing: "处理中",
    ocr_completed: "识别完成",
    ocr_no_text_found: "未找到文本",
    ocr_error_occurred: "识别错误发生",
    clear: "清除",
    stop_recording: "停止录音",
    audio_recording: "音频录制",
    video_recording: "视频录制",
    attachments: "附件",
    video_cannot_play: "无法播放视频",
    audio_cannot_play: "无法播放音频",
    audio_permission_required: "需要麦克风权限",
    video_permission_required: "需要相机权限",
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
    budget: "预算",
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
    filter_by_tag: "按标签过滤",
    manage: "管理",

    organize_meeting_minutes: "AI会议纪要整理",
    organizing_meeting: "整理中...",
    content_required_for_organize: "请输入会议纪要内容",
    confirm_organize_meeting: "AI将整理会议纪要。继续吗？",
    meeting_organized_success: "会议纪要已整理！",
    meeting_organize_failed: "会议纪要整理失败",
    summarize_note: "AI笔记摘要",
    summarizing: "摘要中...",
    content_required_for_summary: "请输入需要摘要的内容",
    note_summarized_success: "笔记已摘要！",
    note_summary_failed: "笔记摘要失败",
    summary_result: "摘要结果",
    replace_with_summary: "替换为摘要",
    add_summary_below: "在下方添加",
    translate_note: "AI翻译",
    translating: "翻译中...",
    content_required_for_translation: "请输入需要翻译的内容",
    translation_result: "翻译结果",
    replace_with_translation: "替换为翻译",
    add_translation_below: "在下方添加",
    select_target_language: "选择目标语言",
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
    enable_alarm: "启用闹钟",
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
    medication_times: "服用时间",
    end_date_optional: "结束日期（可选）",
    add_medication_schedule: "添加用药计划",
    dosage_label: "剂量:",
    frequency_label: "服用频率:",
    today_medication_times: "今日服用时间",
    systolic: "收缩压",
    diastolic: "舒张压",
    no_health_records_message: "没有健康记录。快来添加一条吧！",
    medical_and_medication_expenses: "医疗费用与药费",
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
    contact_name_placeholder: "例如：北京协和医院",
    contact_phone_placeholder: "例如：010-1234-5678",
    contact_address_placeholder: "请输入地址",
    contact_notes_placeholder: "输入备注",
    no_medical_contacts_message: "没有医疗联系人。快来添加一个吧！",
    save_contact: "保存联系人",

    // To-Do List translations for Chinese
    todo: "待办事项",
    todo_list: "待办事项列表",
    add_todo: "添加待办事项",
    todo_title: "待办事项标题",
    todo_title_required: "请输入待办事项标题",
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
    todo_alarm: "闹钟",
    todo_alarm_notification: "待办事项提醒",
    invalid_alarm_time: "无效的闹钟时间",
    todo_completed: "已完成",
    todo_incomplete: "未完成",
    mark_as_completed: "标记为已完成",
    mark_as_incomplete: "标记为未完成",
    no_todos_message: "没有待办事项。快来添加一个吧！",
    voice_input_todo: "语音添加",
    voice_input_active: "正在聆听...",
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
    special_days: "特殊日子",
    general_schedule: "通用日程",
    special_day_reminder: "特殊日子即将到来！",
    event_name: "事件名称",
    category: "类别",
    birthday: "生日",
    anniversary: "纪念日",
    holiday: "节假日",
    vacation: "假期",
    meeting: "会议",
    other: "其他",
    alarm_time: "闹钟时间",
    alarm_settings: "闹钟设置",
    enable_alarm_before_event: "启用事件前闹钟",
    minutes_before: "分钟前",
    "5_min_before": "5分钟前",
    "10_min_before": "10分钟前",
    "15_min_before": "15分钟前",
    minutes_before_30: "30分钟前",
    hours_before_1: "1小时前",
    hours_before_3: "3小时前",
    day_before_1: "1天前",
    days_before_3: "3天前",
    week_before_1: "1周前",
    special_days_batch_title: "✨ 特殊日子批量注册",
    special_days_batch_description: "一次性注册家人、生日、纪念日等",
    schedule_number: "日程",
    save_schedules_count: "保存日程",
    special_day_name_placeholder: "特殊日子名称",
    alarm: "闹钟",
    day_off: "休息日",
    "30_min_before": "30分钟前",
    "1_hour_before": "1小时前",
    "2_hours_before": "2小时前",
    "12_hours_before": "12小时前",
    "1_day_before": "1天前",
    "2_days_before": "2天前",
    "1_week_before": "1周前",
    add_schedule: "添加日程",
    download_ics_description: "ICS文件로 다운로드하여 휴대폰 캘린더에 추가",
    title_label: "标题",
    category_label: "类别",
    description_label: "描述",
    attachments_label: "附件",

    // Travel Section
    travel_map: "旅行地图",
    map_zoom_instruction: "放大",
    map_drag_instruction: "拖动移动",
    map_button_instruction: "+/- 按钮缩放",
    destination_label: "目的地",
    destination_placeholder: "例如：北京故宫、上海外滩、巴黎埃菲尔铁塔",
    latitude_label: "纬度",
    longitude_label: "经度",
    auto_or_manual_input: "自动计算或手动输入",
    select_location_cancel: "取消选择地点",
    select_location_on_map: "在地图上直接选择地点",
    select_location_instruction: "点击地图选择确切位置",
    location_selected_message: "地点已选择！",
    start_date_label: "出发日期",
    end_date_label: "结束日期",
    city_category: "城市",
    nature_category: "自然",
    mountain_category: "山",
    sea_category: "海",
    historic_category: "历史遗迹",
    restaurant_category: "餐厅",
    cafe_category: "咖啡馆",
    other_category: "其他",
    travel_expense_label: "旅行费用（元）",
    travel_expense_placeholder: "请输入旅行费用",
    expense_auto_save_notice: "将自动记录到您的预算中",
    enter_destination: "请输入目的地",
    enter_dates: "请输入出发和结束日期",
    travel_saved: "旅行记录已保存！",
    travel_delete_confirm: "确定要删除此旅行记录吗？",
    no_travel_records: "暂无旅行记录",
    add_first_travel: "添加您的第一条旅行记录！",
    file: "文件",
    close_image: "关闭图片",
    close: "关闭",
    new_travel_record: "新旅行记录",
    edit_travel_record: "编辑旅行记录",
    coordinates_calculated: "坐标已计算",
    attachments_count_label: "附件",
    travel_expense_with_unit: "旅行费用",

    // AI Travel Optimizer
    ai_travel_optimizer: "AI旅行行程优化",
    ai_travel_optimizer_description: "AI将根据您的目的地、旅行时间和预算，自动生成最佳旅行行程。",
    destination_label: "目的地",
    destination_placeholder: "例如：北京、上海、东京",
    start_date_label: "开始日期",
    end_date_label: "结束日期",
    budget_label: "预算",
    budget_placeholder: "预计旅行花费（元）",
    travel_style_label: "旅行风格",
    select_style: "请选择",
    sightseeing: "观光为主",
    relaxation: "休闲/放松",
    food_tour: "美食之旅",
    adventure: "活动/冒险",
    cultural: "文化/历史",
    generate_itinerary: "生成行程",
    optimizing: "优化中...",
    trip_summary: "行程摘要",
    day: "天",
    recommendations: "推荐",
    recommended_restaurants: "推荐餐厅",
    recommended_attractions: "推荐景点",
    travel_tips: "旅行贴士",
    budget_breakdown: "预算分析",
    accommodation: "住宿",
    food: "餐饮",
    transportation: "交通",
    activities: "活动",
    total: "总计",
    apply_to_schedule: "添加到日程",
    regenerate: "重新生成",
    itinerary_applied: "行程已添加到日程",
    optimization_failed: "优化失败",
    please_fill_required_fields: "请填写必填字段",

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
    yellow_dust: "沙尘",
    large_particles: "大颗粒物",
    air_good: "优",
    air_moderate: "良",
    air_bad: "差",
    air_very_bad: "严重污染",
    air_high: "高",
    air_low: "低",
    weekly_forecast: "周预报",
    max_temp: "最高",
    min_temp: "最低",
    latitude: "纬度",
    longitude: "经度",

    // Statistics Section
    loading_stats: "正在加载统计信息...",
    total_records: "总记录数",
    precious_memories: "珍贵的回忆",

    // Settings Section
    backup_restore_title: "数据备份与恢复",
    backup_description: "您可以导出JSON、CSV或Excel格式的数据。只有JSON格式可以恢复。",
    export_data: "导出数据",
    restore_backup: "恢复备份",
    restoring: "正在恢复...",
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
    restore_success: "恢复成功",
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
    privacy_policy_description: "请查看我们关于收集和使用个人信息的政策",
    privacy_last_updated: "最后更新日期：2025年12月",
    privacy_section1_title: "1. 我们收集的信息",
    privacy_section1_intro: "为提供服务，我们收集以下信息：",
    privacy_purpose1: "电子邮件地址（用于登录和账户管理）",
    privacy_purpose2: "用户直接输入的记录数据（待办事项、日程、预算、健康、旅行、笔记等）",
    privacy_purpose3: "用于AI功能的文本（临时处理，不存储）",
    privacy_section2_title: "2. 信息存储方式",
    privacy_collected1: "所有数据均在Supabase云上加密存储。",
    privacy_collected2: "Supabase是经过SOC2和GDPR认证的安全服务。",
    privacy_section3_title: "3. 信息使用目的",
    privacy_storage_desc: "收集的信息仅用于服务提供（记录存储、AI分析），不会出售或分享给第三方。",
    privacy_supabase_desc: "使用AI功能时，文本会发送到Groq API，但不会存储。",
    privacy_section4_title: "4. 个人信息保留期限",
    privacy_retention_desc: "账户删除后，所有个人信息将立即删除。但是，法律要求的必要信息将保留规定期限。",
    privacy_section5_title: "5. 用户权利",
    privacy_right1: "访问和修改个人信息（设置 > 个人信息管理）",
    privacy_right2: "下载数据（设置 > 备份/恢复）",
    privacy_right3: "删除账户（设置 > 危险区域）- 所有数据立即删除",
    privacy_section6_title: "6. 数据保护官",
    privacy_section7_title: "7. 服务终止时的个人信息处理",
    privacy_termination_desc: "服务终止时，将提前30天通知用户，并提供数据导出期。",
    privacy_data_deletion: "服务终止后30天内，所有个人信息将从Supabase数据库中完全删除。",

    // Terms of Service - Simplified Chinese translations
    terms_of_service: "服务条款",
    terms_of_service_description: "请查看我们的服务使用条款和规定",
    terms_last_updated: "最后更新日期：2025年12月",
    terms_section1_title: "1. 服务定义",
    terms_section1_desc: "本应用提供个人生活管理服务。基本功能免费，未来可能会添加高级功能。",
    terms_section2_title: "2. 注册",
    terms_section2_desc: "任何人均可使用电子邮件地址自由注册。",
    terms_section3_title: "3. 服务内容",
    terms_service1: "待办事项、日程、日记、笔记管理",
    terms_service2: "预算、健康、旅行、车辆记录管理",
    terms_service3: "AI驱动的分析和翻译（使用Groq AI）",
    terms_service4: "数据备份与恢复",
    terms_service5: "名片管理、天气、广播等",
    terms_section4_title: "4. 用户义务",
    terms_obligation1: "不得非法收集或滥用他人个人信息。",
    terms_obligation2: "不得将服务用于非法目的。",
    terms_obligation3: "安全管理您的账户信息。",
    terms_section5_title: "5. 服务变更与通知",
    terms_section5_desc: "重要变更将通过应用顶部的横幅提前通知。",
    terms_section6_title: "6. 服务中断与终止",
    terms_termination1: "运营方可因以下原因中断服务：不可抗力、系统故障、运营原因。",
    terms_termination2: "服务终止时，至少提前30天通过应用顶部的横幅通知。",
    terms_termination3: "终止通知后，将提供30天的内数据导出期。",
    terms_termination4: "由于是免费服务，因服务中断造成的损害赔偿责任有限。",

    // Settings section - Personal Information translations for Chinese
    personal_information: "个人信息管理",
    view: "查看",
    hide: "隐藏",
    account_information: "账户信息",
    user_id: "用户ID",
    account_created: "注册日期",
    change_email: "更改邮箱",
    update_email: "更新邮箱",
    new_email: "新邮箱",
    enter_password: "输入密码",
    updating: "更新中...",
    data_management: "数据管理",
    data_management_description: "您可以查看和管理您的个人信息。",
    view_data: "查看数据",
    data_export_description: "请使用上方备份/恢复部分的数据导出功能。",
    fill_all_fields: "请填写所有字段",
    email_updated_success: "邮箱更新成功",
    email_update_error: "更新邮箱时出错",

    // Danger Zone
    danger_zone: "危险区域",
    account_deletion_warning: "删除您的账户将永久删除所有数据，且无法恢复。",
    data_deletion_report: "生成个人信息销毁报告",
    data_deletion_report_desc: "服务终止时，生成个人信息销毁报告以作法律证明。",
    generate_report: "生成报告",
    generating_report: "生成中...",
    report_generated: "销毁报告已生成",
    report_generation_failed: "生成销毁报告失败",
    delete_account: "删除账户",
    delete_account_title: "删除账户",
    delete_account_warning_title: "⚠️ 警告：此操作不可逆",
    delete_warning_1: "您的所有记录（待办事项、日程、预算、健康、旅行等）将被永久删除。",
    delete_warning_2: "您的账户信息将被完全清除。",
    delete_warning_3: "删除后无法恢复。",
    delete_account_confirm_instruction: "继续操作，请输入以下短语：",
    delete_account_confirm_phrase: "永久删除我的账户",
    delete_account_phrase_mismatch: "您输入的短语不匹配。",
    account_deleted_success: "账户已成功删除",
    account_deletion_failed: "删除账户时出错",
    deleting: "删除中...",
    delete_permanently: "永久删除",
    delete_account_email_reuse_info: "已删除的邮箱可以再次用于注册。",
    email_verification_notice_title: "注册后需要验证邮箱",
    email_verification_notice_desc: "注册后请点击收件箱中的确认邮件完成验证。",

    // Announcement Management
    announcement_management: "公告管理",
    new_announcement: "新公告",
    edit_announcement: "编辑公告",
    announcement_message: "公告消息",
    announcement_message_placeholder: "请输入要显示给用户的公告消息",
    announcement_type: "公告类型",
    type_info: "信息",
    type_warning: "警告",
    type_success: "成功",
    expires_at: "到期时间",
    active_announcements: "活动公告",
    no_announcements: "无活动公告",
    expires: "到期",
    save_success: "保存成功！",
    save_failed: "保存失败",
    update: "更新",
    app_developer: "应用开发者",
    developer_info: "金浦市长基洞 李灿世",
    app_designer: "应用设计师",
    designer_info: "金浦市长基洞 李灿世",
    back_to_forest: "返回森林",
    customer_support: "客户支持",
    customer_support_description: "如有疑问，请通过以下电子邮件联系我们。",
    support_email: "支持邮箱",
    app_introduction: "应用介绍",
    app_introduction_description:
      "本应用是一款集成的生活管理工具，可让您在一个地方管理日常生活中的所有记录，包括日程、待办事项、预算、健康、旅行和车辆等。",
    notes_description: "记录笔记、会议纪要、想法等，并能通过AI进行摘要和翻译。",
    diaries_description: "撰写每日日记，并可用密码保护。",
    schedules_description: "以日历格式管理日程并设置提醒。",
    travel_records_description: "规划旅行并使用AI优化行程。",
    vehicle_records_description: "管理车辆保养记录和预防性保养计划。",
    health_records_description: "管理健康数据、用药计划和医疗联系人。",
    budget_description: "记录收支并使用AI分析预算。",
    business_cards_description: "扫描名片，自动提取并管理信息。",
    weather_description: "查看当前天气和预报。",
    radio_description: "收听各种广播频道。",
    data_backup: "数据备份",
    data_backup_description: "您可以导出所有数据为JSON、CSV或Excel格式。",
    diaries: "日记",
    schedules: "日程",
    travel_records: "旅行记录",
    vehicle_records: "车辆记录",
    health_records: "健康记录",
    legal_information: "法律信息",
    privacy_policy_description: "请查看我们关于收集和使用个人信息的政策",
    terms_of_service_description: "请查看我们的服务使用条款和规定",
    set_diary_password: "设置日记密码",
    password_description: "设置密码以保护您的日记。",
    new_password: "新密码",
    password_placeholder: "至少4个字符",
    confirm_password: "确认密码",
    confirm_password_placeholder: "重新输入密码",
    set_password: "设置密码",
    skip: "跳过",
    locked_diary: "已锁定的日记",
    enter_password_to_unlock: "请输入密码解锁日记",
    password: "密码",
    unlock: "解锁",
    password_too_short: "密码至少需要4个字符",
    password_mismatch: "密码不匹配",
    password_set: "日记密码已设置",
    unlocked: "已解锁",
    wrong_password: "密码错误",
    password_changed: "密码已成功更改",
    confirm_remove_password: "确定要移除密码吗？",
    password_removed: "密码已成功移除",
    lock_diary: "锁定日记",
    security_question: "安全问题: 出生城市?",
    security_not_set: "未设置安全性。要完全删除密码，请在设置中删除。",
    enter_security_answer: "安全问题答案",
    security_answer_placeholder: "出生城市",
    reset_password_description: "重置为新密码",
    wrong_security_answer: "安全答案不正确",
    password_reset_success: "密码已重置",
    security_answer_help: "忘记密码时使用",
    diary_password_management: "日记密码管理",
    diary_password_description: "删除或重置您的日记密码",

    // Vehicle Section Translations
    add_vehicle: "添加车辆",
    first_vehicle: "注册您的第一辆车",
    vehicle_list: "车辆列表",
    new_vehicle: "新车辆",
    edit_vehicle: "编辑车辆",
    vehicle_name_placeholder: "车辆名称 (例如：我的索纳塔)",
    license_plate_placeholder: "车牌号",
    vehicle_type_placeholder: "车辆类型 (例如：轿车, SUV)",
    vehicle_model_placeholder: "型号年份 (例如：2023款)",
    purchase_year_placeholder: "购买年份 (例如：2023)",
    insurance_placeholder: "保险公司 (例如：太平洋保险)",
    vehicle_type: "车辆类型",
    vehicle_model: "型号",
    purchase_year: "购买年份",
    insurance: "保险",
    insurance_fee: "保险费",
    register: "注册",
    update: "更新",
    vehicle_name_and_plate_required: "需要车辆名称和车牌号",
    vehicle_saved: "车辆已成功保存",
    save_error: "保存车辆时发生错误",
    delete_vehicle_confirm: "确定要删除此车辆吗？",
    deleted: "已删除",
    delete_error: "删除车辆时发生错误",
    no_vehicles: "未注册车辆",
    records_count: "保养记录",
    schedules_count: "保养计划",
    records_unit: "条",
    tap_to_add_maintenance_and_schedule: "点击添加保养记录和计划",
    add_maintenance: "添加保养记录",
    maintenance_input: "保养记录输入",
    maintenance_category: "保养类别",
    maintenance_date: "保养日期",
    engine_oil: "发动机油",
    tire: "轮胎",
    filter: "滤清器",
    repair: "维修",
    parts: "零件",
    mileage: "里程",
    km_unit: "公里",
    mileage_placeholder: "输入里程",
    amount: "费用",
    won_unit: "元",
    amount_placeholder: "输入费用",
    memo_placeholder: "输入备注",
    save_maintenance: "保存保养记录",
    date_required: "日期是必需的",
    maintenance_saved: "保养记录已保存",
    delete_maintenance_confirm: "确定要删除此保养记录吗？",
    maintenance_history: "保养历史",
    attachments_count: "附件",
    no_records: "无记录",
    preventive_schedule: "预防性保养计划",
    preventive_input: "预防性保养输入",
    scheduled_date: "计划日期",
    estimated_mileage: "预计里程",
    estimated_mileage_placeholder: "输入预计里程",
    description: "描述",
    description_placeholder: "输入保养描述",
    alarm_setting: "闹钟设置",
    alarm_days_before: "提前X天提醒",
    days_before_2: "提前2天",
    days_before_7: "提前7天",
    days_before_14: "提前14天",
    days_before_30: "提前30天",
    save_schedule: "保存计划",
    scheduled_date_required: "计划日期是必需的",
    schedule_saved: "计划已保存",
    delete_schedule_confirm: "确定要删除此计划吗？",
    maintenance_alarm_title: "车辆保养提醒",
    maintenance_alarm_message: "即将到来的计划保养",

    // Storage Quota Translations
    storage_usage: "存储使用情况",
    storage_used: "已用",
    used: "已用",
    used_lowercase: "已用",
    remaining: "剩余",
    storage_full: "存储空间几乎满了！删除文件或升级到高级版。",
    storage_warning: "存储空间已超过80%。请释放空间。",
    premium: "高级版",
    upgrade_to_premium: "升级到高级版",
    premium_benefits: "获取500MB存储空间和更多功能",
    benefit_500mb: "500MB存储空间",
    benefit_no_ads: "无广告",
    benefit_priority_support: "优先支持",
    upgrade_for_1_pi: "每月1 Pi升级",
    upgrade_coming_soon: "高级版升级功能即将推出！",
    email_user_storage_info: "邮箱用户可免费获得500MB存储空间",
    admin_storage_info: "管理员账户可获得1GB存储空间",

    // Announcement Translations
    announcement_welcome: "欢迎来到Pi Life Manager！",
    announcement_maintenance: "计划系统维护。请注意服务使用。",
    announcement_update: "已添加新功能。快来看看吧！",
    announcement_event: "特别活动正在进行中！",

    // New Translations
    app_title: "记录森林",
    welcome_message: "欢迎来到记录森林！",
    logout: "登出",
    my_forest: "我的森林",
    note_title_placeholder: "输入标题",
    note_content_placeholder: "输入内容",
    no_notes_message: "添加一条记录！",
    event_title_placeholder: "事件标题",
    start_time: "开始时间",
    end_time: "结束时间",
    location: "地点",
    location_placeholder: "输入地点",
    no_events_message: "没有事件。添加日程！",
    search_location: "搜索地点",
    weather_loading: "正在加载天气...",
    weather_error: "获取天气信息失败。",
    precipitation: "降水量",
    weather_description: "天气描述",
    visibility: "能见度",
    pressure: "气压",
    today: "今天",
    tomorrow: "明天",
    travel_destination: "旅行目的地",
    travel_destination_placeholder: "例如：海南三亚、云南丽江",
    no_travels_message: "没有旅行记录。添加一次旅行！",
    vehicle_name: "车辆名称",
    vehicle_name_placeholder: "例如：我的朗逸",
    license_plate: "车牌号",
    license_plate_placeholder: "例如：京A12345",
    vehicle_type: "车辆类型",
    car: "轿车",
    motorcycle: "摩托车",
    bicycle: "自行车",
    no_vehicles_message: "没有车辆记录。注册一辆车！",
    mileage_placeholder: "输入里程",
    add_maintenance: "添加保养",
    cost_placeholder: "输入费用",
    no_maintenance_records: "没有找到保养记录。",
    diary_content_placeholder: "你今天过得怎么样？",
    no_diary_entries: "没有日记条目。写日记吧！",
    todo_title_placeholder: "输入待办事项",
    completed: "已完成",
    in_progress: "进行中",
    not_started: "未开始",
    radio_station_placeholder: "电台名称",
    radio_url_placeholder: "电台流媒体URL",
    add_station: "添加电台",
    no_stations_message: "未添加电台。",
    play: "播放",
    stop: "停止",
    of: "/",
    upgrade_storage: "升级存储空间",
    free_plan: "免费计划",
    storage_full_warning: "存储空间已满。请删除不必要的文件或升级。",
    no_location_permission: "未授予位置访问权限。",
    getting_location: "正在获取位置...",
    update: "更新",
    height: "身高",
    height_placeholder: "输入身高 (cm)",
    weight: "体重",
    blood_pressure_placeholder: "例如：120/80",
    blood_sugar_placeholder: "例如：90",
    heart_rate: "心率",
    heart_rate_placeholder: "输入心率",
    notes_optional: "备注 (可选)",
    notes_placeholder: "输入附加备注",
    record_date: "记录日期",
    no_health_records: "未找到健康记录。",
    health_metrics: "健康指标",
    medication_name_placeholder: "输入药品名称",
    dosage_placeholder: "输入剂量",
    frequency_placeholder: "输入频率",
    no_medications: "未添加药品。",
    add_medication: "添加药品",
    medical_contacts: "医疗联系人",
    add_contact: "添加联系人",
    contact_notes_placeholder: "输入备注",
    todo_list: "待办事项列表",
    status: "状态",
    priority: "优先级",
    high: "高",
    medium: "中",
    low: "低",
    due_date: "截止日期",
    description: "描述",
    back_to_list: "返回列表",
    mark_as_completed: "标记为已完成",
    mark_as_in_progress: "标记为进行中",
    no_description: "无描述",
    created: "创建于",
    last_updated: "最后更新于",
    terms_of_service: "服务条款",
    privacy_policy: "隐私政策",
    agree_to_terms: "我同意服务条款和隐私政策",
    sign_up: "注册",
    already_have_account: "已有账户？",
    sign_in: "登录",
    email_placeholder: "电子邮件地址",
    signing_up: "注册中...",
    signing_in: "登录中...",
    forgot_password: "忘记密码",
    or_continue_with: "或使用以下方式继续",
    google: "Google",
    dont_have_account: "没有账户？",
    enter_email_for_reset: "请输入您的电子邮件地址以重置密码",
    send_reset_link: "发送重置链接",
    sending: "发送中...",
    back_to_sign_in: "返回登录",
    reset_password: "重置密码",
    admin: "管理员",
    consent_logs: "同意记录",
    user: "用户",
    terms_version: "服务条款版本",
    privacy_version: "隐私政策版本",
    agreed_at: "同意时间",
    user_agent: "用户代理",
    no_consent_logs: "无同意记录",
    tos_title: "服务条款",
    tos_effective_date: "生效日期",
    tos_last_updated: "最后更新日期",
    tos_acceptance: "同意服务条款",
    tos_acceptance_content: "我同意以上服务条款。",
    tos_1_title: "第一条 (目的)",
    tos_1_content: "本条款旨在...",
    tos_2_title: "第二条 (定义)",
    tos_2_content: "本条款中使用的术语定义如下：...",
    tos_3_title: "第三条 (服务协议)",
    tos_3_content: "服务协议在用户表示同意本条款内容时成立。...",
    tos_4_title: "第四条 (用户义务)",
    tos_4_content: "用户不得进行以下行为。...",
    tos_5_title: "第五条 (服务提供与中断)",
    tos_5_content: "公司向用户提供稳定的服务。...",
    tos_6_title: "第六条 (个人信息保护)",
    tos_6_content: "公司遵守个人信息保护法等相关法律。...",
    tos_7_title: "第七条 (免责声明)",
    tos_7_content:
      "因不可抗力事件（如自然灾害、罢工、相关法律法规的制定/废止等）导致无法提供服务时，公司免除服务提供责任。...",
    pp_title: "隐私政策",
    pp_effective_date: "生效日期",
    pp_last_updated: "最后更新日期",
    pp_intro: "本隐私政策...",
    pp_1_title: "第一条 (收集的个人信息项目及方法)",
    pp_1_content: "公司为履行用户协议、提供服务、识别用户、改进服务而收集以下个人信息。...",
    pp_2_title: "第二条 (个人信息的收集及使用目的)",
    pp_2_content: "公司仅为以下目的使用收集的个人信息。...",
    pp_3_title: "第三条 (个人信息的保留及使用期间)",
    pp_3_content:
      "公司根据法律法规规定的个人信息保留·使用期间，或根据信息主体在收集个人信息时同意的保留·使用期间内保留·使用个人信息。...",
    pp_4_title: "第四条 (向第三方提供个人信息)",
    pp_4_content: "原则上，公司不向第三方提供用户的个人信息。...",
    pp_5_title: "第五条 (个人信息的销毁)",
    pp_5_content: "当个人信息超过保留期限、处理目的达成等不再需要时，公司将立即销毁该个人信息。...",
    pp_6_title: "第六条 (用户及法定代理人的权利及行使方法)",
    pp_6_content: "用户可以随时查阅或修改其注册的个人信息。...",
    pp_7_title: "第七条 (关于个人信息的民事服务)",
    pp_7_content: "公司指定以下部门及个人信息保护负责人，以处理关于个人信息处理的咨询、意见、投诉等。...",
    pp_contact: "个人信息保护负责人",

    analyze_emotion: "情感分析",
    analyzing_emotion: "分析中...",
    emotion_analysis_result: "情感分析结果",
    emotion_analysis_failed: "情感分析失败",
    diary_too_short_for_analysis: "日记太短，无法分析",
    emotion_positive: "积极",
    emotion_negative: "消极",
    emotion_neutral: "中性",
    emotion_score: "情感分数",
    main_emotions: "主要情感",
    ai_advice: "AI建议",
    security_question: "安全问题: 出生城市?",
    security_not_set: "未设置安全性。要完全删除密码，请在设置中删除。",
    enter_security_answer: "安全问题答案",
    security_answer_placeholder: "出生城市",
    reset_password_description: "重置为新密码",
    wrong_security_answer: "安全答案不正确",
    password_reset_success: "密码已重置",
    security_answer_help: "忘记密码时使用",
    diary_password_management: "日记密码管理",
    diary_password_description: "删除或重置您的日记密码",

    repeat_frequency: "重复频率",
    repeat_until: "重复结束日期",
    repeat_schedule: "重复日程",
  },
}

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language]?.[key] || translations.ko[key] || key
}
