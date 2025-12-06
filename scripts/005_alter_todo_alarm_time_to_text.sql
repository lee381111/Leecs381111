-- 할일 알람 시간 컬럼을 timestamp with time zone에서 text로 변경
-- datetime-local 형식 (YYYY-MM-DDTHH:mm)을 그대로 저장하기 위함

ALTER TABLE todo_items 
ALTER COLUMN alarm_time TYPE text 
USING CASE 
  WHEN alarm_time IS NULL THEN NULL
  ELSE to_char(alarm_time AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD"T"HH24:MI')
END;

COMMENT ON COLUMN todo_items.alarm_time IS 'Alarm time in datetime-local format (YYYY-MM-DDTHH:mm)';
