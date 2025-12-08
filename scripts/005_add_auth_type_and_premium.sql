-- profiles 테이블에 인증 타입과 프리미엄 상태 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS auth_type TEXT DEFAULT 'email' CHECK (auth_type IN ('email', 'pi')),
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS storage_quota BIGINT DEFAULT 524288000,
ADD COLUMN IF NOT EXISTS storage_used BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS pi_username TEXT,
ADD COLUMN IF NOT EXISTS user_id TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS name TEXT;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_auth_type ON profiles(auth_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 코멘트 추가
COMMENT ON COLUMN profiles.auth_type IS '인증 방식: email (이메일 로그인) 또는 pi (파이 네트워크 로그인)';
COMMENT ON COLUMN profiles.is_premium IS '프리미엄 구독 여부 (Pi 사용자만 해당)';
COMMENT ON COLUMN profiles.premium_expires_at IS '프리미엄 만료일';
COMMENT ON COLUMN profiles.storage_quota IS '저장 용량 한도 (bytes)';
COMMENT ON COLUMN profiles.storage_used IS '사용 중인 저장 용량 (bytes)';
COMMENT ON COLUMN profiles.pi_username IS 'Pi 네트워크 사용자명';
COMMENT ON COLUMN profiles.user_id IS '사용자 고유 ID';
