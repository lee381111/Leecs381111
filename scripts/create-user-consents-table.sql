-- 약관 동의 로그를 저장하는 새로운 테이블 생성
-- 기존 테이블은 전혀 수정하지 않음

CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL DEFAULT 'v1.0_2025-12',
  privacy_version TEXT NOT NULL DEFAULT 'v1.0_2025-12',
  agreed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 동의 로그만 조회 가능
CREATE POLICY "Users can view their own consents"
  ON user_consents
  FOR SELECT
  USING (auth.uid() = user_id);

-- 시스템만 동의 로그 삽입 가능 (회원가입 시)
CREATE POLICY "System can insert consents"
  ON user_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_agreed_at ON user_consents(agreed_at DESC);
