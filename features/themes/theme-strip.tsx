'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';
import { PALETTES, PREMIUM_PALETTES } from './palettes';
import { Crown } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-provider';
import { getSupabaseBrowserClient } from '@/features/auth/supabase-client';

export function ThemeStrip() {
  const { palette, setPalette } = useTheme();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    supabase
      .from('subscriptions')
      .select('status, plan, current_period_end')
      .eq('user_id', user.id)
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.status === 'active' && data?.plan === 'premium' && data?.current_period_end && new Date(data.current_period_end) > new Date()) {
          setIsPremium(true);
        }
      });
  }, [user]);

  const handlePremiumClick = (id: string) => {
    if (isPremium) {
      setPalette(id);
    } else {
      window.location.href = '/pricing';
    }
  };

  return (
    <div>
      <div className="card-title">
        Themes
        <span className="theme-count">{PALETTES.length + PREMIUM_PALETTES.length}</span>
      </div>
      <div className="theme-strip">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            className={`theme-dot${p.id === palette ? ' active' : ''}`}
            style={{ background: p.color }}
            onClick={() => setPalette(p.id)}
            title={p.label}
          />
        ))}
        {PREMIUM_PALETTES.slice(0, 4).map((p) => {
          const active = palette === p.id;
          return (
            <button
              key={p.id}
              className={`theme-dot premium-dot${active ? ' active' : ''}`}
              style={{ background: p.color }}
              onClick={() => handlePremiumClick(p.id)}
              title={`${p.label}${!isPremium ? ' (Premium)' : ''}`}
            >
              {!isPremium && <Crown size={8} />}
            </button>
          );
        })}
        {!isPremium && (
          <button
            className="theme-dot more-dot"
            onClick={() => window.location.href = '/pricing'}
            title="Unlock all premium themes"
          >
            <Crown size={10} />
          </button>
        )}
      </div>
    </div>
  );
}
