// Master password management for app-level security
// This provides the first layer of authentication

const HARDCODED_MASTER_PASSWORD = "lee381111" // 여기서 비밀번호를 변경하세요
const ENABLE_MASTER_PASSWORD = true // false로 설정하면 마스터 비밀번호 기능 비활성화

const MASTER_SESSION_KEY = "app_master_session"
const SESSION_DURATION = 10 * 365 * 24 * 60 * 60 * 1000 // 10 years

export interface MasterPasswordSession {
  verified: boolean
  timestamp: number
}

export function isMasterPasswordEnabled(): boolean {
  return ENABLE_MASTER_PASSWORD
}

export function isMasterPasswordSet(): boolean {
  return ENABLE_MASTER_PASSWORD
}

export function setMasterSession() {
  createMasterSession()
}

export function setMasterPassword(password: string): boolean {
  if (typeof window === "undefined") return false

  try {
    // Hash the password using a simple hash (in production, use bcrypt or similar)
    const hash = btoa(password) // Base64 encoding as simple hash
    localStorage.setItem("masterPasswordHash", hash)

    // Create session after setting password
    createMasterSession()

    return true
  } catch {
    return false
  }
}

export function verifyMasterPassword(password: string): boolean {
  if (!ENABLE_MASTER_PASSWORD) {
    return true
  }

  if (typeof window === "undefined") {
    return false
  }

  // Check if there's a stored hash (user-set password)
  const storedHash = localStorage.getItem("masterPasswordHash")

  if (storedHash) {
    // Verify against stored hash
    try {
      const hash = btoa(password)
      if (hash === storedHash) {
        createMasterSession()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Fall back to hardcoded password
  if (password !== HARDCODED_MASTER_PASSWORD) {
    return false
  }

  createMasterSession()
  return true
}

// Create master password session
function createMasterSession() {
  if (typeof window === "undefined") return

  const session: MasterPasswordSession = {
    verified: true,
    timestamp: Date.now(),
  }

  localStorage.setItem(MASTER_SESSION_KEY, JSON.stringify(session))
}

// Check if master password session is valid
export function isMasterSessionValid(): boolean {
  if (!ENABLE_MASTER_PASSWORD) {
    return true
  }

  if (typeof window === "undefined") return false

  const sessionStr = localStorage.getItem(MASTER_SESSION_KEY)
  if (!sessionStr) return false

  try {
    const session: MasterPasswordSession = JSON.parse(sessionStr)
    const now = Date.now()

    // Check if session is still valid (within 10 years)
    if (now - session.timestamp > SESSION_DURATION) {
      // Session expired
      clearMasterSession()
      return false
    }

    return session.verified
  } catch {
    return false
  }
}

// Clear master password session
export function clearMasterSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(MASTER_SESSION_KEY)
}
