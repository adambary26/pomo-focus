'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/auth-provider';
import { useSync } from '@/features/sync/sync-provider';
import { useTimerStore } from '@/features/timer/timer-engine';
import { Cloud, CloudOff, Check, AlertCircle } from 'lucide-react';

export function SyncIndicator() {
  const { user } = useAuth();
  const { syncing, syncStatus, lastSynced, syncError } = useSync();

  if (!user) return null;

  const icons: Record<string, { icon: any; color: string; label: string }> = {
    idle: { icon: CloudOff, color: 'var(--muted)', label: 'Offline' },
    syncing: { icon: Cloud, color: 'var(--accent)', label: 'Syncing...' },
    synced: { icon: Check, color: 'oklch(65% 0.18 145)', label: 'Synced' },
    error: { icon: AlertCircle, color: 'oklch(55% 0.15 25)', label: 'Sync Error' },
  };

  const { icon: Icon, color, label } = icons[syncStatus] || icons.idle;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color,
      fontWeight: 700,
    }}>
      <Icon size={12} />
      <span>{label}</span>
      {lastSynced && syncStatus === 'synced' && (
        <span style={{ color: 'var(--muted)', fontWeight: 400 }}>
          {lastSynced.toLocaleTimeString()}
        </span>
      )}
      {syncError && (
        <span style={{ color: 'oklch(55% 0.15 25)', fontSize: 10 }}>
          {syncError}
        </span>
      )}
    </div>
  );
}
