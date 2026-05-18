'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/auth-provider';
import { pushSyncData, pullAllSyncData, type SyncDataType } from './sync-engine';

interface SyncContextValue {
  syncing: boolean;
  lastSynced: Date | null;
  syncError: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  pushData: (dataType: SyncDataType, data: any) => Promise<void>;
  pullData: () => Promise<Record<string, any>>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const pushData = useCallback(async (dataType: SyncDataType, data: any) => {
    if (!user) return;
    setSyncing(true);
    setSyncStatus('syncing');
    setSyncError(null);
    try {
      await pushSyncData(dataType, data);
      setLastSynced(new Date());
      setSyncStatus('synced');
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sync failed');
      setSyncStatus('error');
    } finally {
      setSyncing(false);
    }
  }, [user]);

  const pullData = useCallback(async () => {
    if (!user) return {};
    setSyncing(true);
    setSyncStatus('syncing');
    setSyncError(null);
    try {
      const data = await pullAllSyncData();
      setLastSynced(new Date());
      setSyncStatus('synced');
      return data;
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Pull failed');
      setSyncStatus('error');
      return {};
    } finally {
      setSyncing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSyncStatus('idle');
      setLastSynced(null);
      return;
    }
    pullData();
  }, [user, pullData]);

  return (
    <SyncContext.Provider value={{ syncing, lastSynced, syncError, syncStatus, pushData, pullData }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
}
