-- 기존 관리자 정책 삭제
DROP POLICY IF EXISTS "Admins can view all consents" ON public.user_consents;

-- profiles 테이블을 사용하는 관리자 정책 생성
CREATE POLICY "Admins can view all consents"
  ON public.user_consents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.email = 'lee381111@gmail.com'
    )
  );
