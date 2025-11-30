import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface SupabaseClient {
  auth: {
    signUp: (credentials: { email: string; password: string; options?: any }) => Promise<any>
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<any>
    signOut: () => Promise<void>
    getSession: () => Promise<{ data: { session: any | null } }>
    onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } }
  }
  from: (table: string) => {
    select: (columns?: string) => any
    insert: (data: any) => Promise<any>
    update: (data: any) => any
    delete: () => any
    upsert: (data: any) => Promise<any>
  }
}

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient
  
  supabaseClient = createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
  
  return supabaseClient
}
