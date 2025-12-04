'use server'

import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function signIn(email: string, password: string) {
  console.log('[v0] Server Action: signIn called')
  console.log('[v0] Email:', email)
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    console.log('[v0] Server fetch response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.log('[v0] Server fetch error:', errorData)
      return { data: null, error: { message: errorData.error_description || '로그인에 실패했습니다' } }
    }

    const data = await response.json()
    console.log('[v0] Server fetch success, user:', data.user?.id)
    
    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('sb-access-token', data.access_token, {
      path: '/',
      maxAge: data.expires_in,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    
    return { data, error: null }
  } catch (error) {
    console.log('[v0] Server Action error:', error)
    return { 
      data: null, 
      error: { message: error instanceof Error ? error.message : '서버 오류가 발생했습니다' }
    }
  }
}
