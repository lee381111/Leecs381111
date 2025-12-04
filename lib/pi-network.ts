// Pi Network SDK types and utilities
export interface PiPaymentData {
  amount: number
  memo: string
  metadata: Record<string, any>
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void
  onReadyForServerCompletion: (paymentId: string, txid: string) => void
  onCancel: (paymentId: string) => void
  onError: (error: Error, payment?: any) => void
}

export interface PiSDK {
  init: (config: { version: string; sandbox?: boolean }) => Promise<void>
  createPayment: (paymentData: PiPaymentData, callbacks: PiPaymentCallbacks) => void
  authenticate: (scopes: string[], onIncompletePaymentFound: (payment: any) => void) => Promise<any>
}

// Declare Pi SDK on window
declare global {
  interface Window {
    Pi?: PiSDK
  }
}

let isInitialized = false

export const isPiBrowser = (): boolean => {
  if (typeof window === "undefined") return false
  const userAgent = window.navigator.userAgent.toLowerCase()
  return userAgent.includes("pibrowser") || userAgent.includes("pi/")
}

// Load and initialize Pi SDK script
export const loadPiSDK = async (): Promise<void> => {
  if (isInitialized && window.Pi) {
    return
  }

  // Load the script if not already loaded
  if (!window.Pi) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://sdk.minepi.com/pi-sdk.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Pi SDK"))
      document.head.appendChild(script)
    })
  }

  // Initialize the SDK
  if (window.Pi && !isInitialized) {
    try {
      await window.Pi.init({ version: "2.0", sandbox: true })
      isInitialized = true
      console.log("[v0] Pi SDK initialized successfully")
    } catch (error) {
      console.error("[v0] Failed to initialize Pi SDK:", error)
      throw error
    }
  }
}

// Check if Pi SDK is available and initialized
export const isPiSDKAvailable = (): boolean => {
  return typeof window !== "undefined" && !!window.Pi && isInitialized
}

// Reset initialization state (for testing)
export const resetPiSDK = () => {
  isInitialized = false
}
