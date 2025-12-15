-- Add admin policy for viewing all user consents
CREATE POLICY "Admins can view all consents"
  ON public.user_consents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'lee381111@gmail.com'
    )
  );
