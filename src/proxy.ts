// ============================================================
// Next.js Proxy (Auth Guard)
// Replaces the deprecated "middleware" file convention.
// See: https://nextjs.org/docs/messages/middleware-to-proxy
// ============================================================

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
