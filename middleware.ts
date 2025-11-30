import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pass through all requests without authentication check
  return
}

export const config = {
  matcher: [],
}
