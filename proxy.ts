import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const all: { name: string; value: string }[] = [];
          for (const [name, value] of request.cookies.getAll().map((c) => [c.name, c.value])) {
            all.push({ name, value });
          }
          return all;
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set({ name, value, ...options });
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/premium')) {
    if (!session) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan, current_period_end')
      .eq('user_id', session.user.id)
      .single();

    const isPremium =
      subscription?.status === 'active' &&
      subscription?.plan === 'premium' &&
      subscription?.current_period_end &&
      new Date(subscription.current_period_end) > new Date();

    if (!isPremium) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  if (pathname === '/billing' && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/settings' && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/premium/:path*',
    '/billing',
    '/settings',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
