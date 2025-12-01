// Simple authentication system for v0 preview
// This can be easily migrated to Supabase when deployed to Vercel

export interface User {
  id: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

// Store users in localStorage (for v0 preview)
// In production, this would use Supabase
const USERS_KEY = "app_users"
const CURRENT_USER_KEY = "app_current_user"

function getUsers(): Record<string, { email: string; password: string; id: string; createdAt: string }> {
  if (typeof window === "undefined") return {}
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : {}
}

function saveUsers(users: Record<string, { email: string; password: string; id: string; createdAt: string }>) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  // Validate email
  if (!email || !email.includes("@")) {
    return { user: null, error: "유효한 이메일 주소를 입력해주세요." }
  }

  // Validate password
  if (!password || password.length < 6) {
    return { user: null, error: "비밀번호는 최소 6자 이상이어야 합니다." }
  }

  const users = getUsers()

  // Check if user already exists
  if (users[email]) {
    return { user: null, error: "이미 등록된 이메일입니다." }
  }

  // Create new user
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    createdAt: new Date().toISOString(),
  }

  users[email] = {
    email,
    password, // In production, this would be hashed
    id: user.id,
    createdAt: user.createdAt,
  }

  saveUsers(users)

  return { user, error: null }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const users = getUsers()

  if (!users[email]) {
    return { user: null, error: "등록되지 않은 이메일입니다. 아래 '회원가입' 링크를 클릭하여 새 계정을 만들어주세요." }
  }

  // Check password
  if (users[email].password !== password) {
    return { user: null, error: "비밀번호가 일치하지 않습니다." }
  }

  // Create user object
  const user: User = {
    id: users[email].id,
    email: users[email].email,
    createdAt: users[email].createdAt,
  }

  // Save current user
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }

  return { user, error: null }
}

export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(CURRENT_USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(CURRENT_USER_KEY)
}
