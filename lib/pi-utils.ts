export interface PiUser {
  uid: string
  username: string
  accessToken: string
}

export interface PiSDK {
  init: (config: { version: string; sandbox?: boolean }) => void
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: ((payment: unknown) => void) | null,
  ) => Promise<{ user: PiUser; accessToken: string }>
}

declare global {
  interface Window {
    Pi?: PiSDK
  }
}

// Detect if running in Pi Network environment
export function isPiEnvironment(): boolean {
  if (typeof window === "undefined") return false
  return window.Pi !== undefined
}

// Initialize Pi SDK
export function initPiSDK(): void {
  if (typeof window === "undefined" || !window.Pi) return

  try {
    window.Pi.init({
      version: "2.0",
      sandbox: process.env.NODE_ENV === "development",
    })
  } catch (error) {
    console.error("Pi SDK initialization failed:", error)
  }
}

// Authenticate with Pi Network
export async function authenticateWithPi(): Promise<PiUser> {
  if (typeof window === "undefined" || !window.Pi) {
    throw new Error("Pi SDK not available")
  }

  try {
    const auth = await window.Pi.authenticate(["username"], null)
    return auth.user
  } catch (error) {
    console.error("Pi authentication failed:", error)
    throw error
  }
}
