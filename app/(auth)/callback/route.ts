import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    const errorUrl = new URL('/login', requestUrl.origin);
    errorUrl.searchParams.set('error', decodeURIComponent(errorDescription || error));
    return NextResponse.redirect(errorUrl);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  if (type === 'signup') {
    const successUrl = new URL('/login', requestUrl.origin);
    successUrl.searchParams.set('message', 'Email confirmed! Please sign in.');
    return NextResponse.redirect(successUrl);
  }

  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
  }

  if (type === 'email_change') {
    const successUrl = new URL('/settings', requestUrl.origin);
    successUrl.searchParams.set('message', 'Email updated successfully!');
    return NextResponse.redirect(successUrl);
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
