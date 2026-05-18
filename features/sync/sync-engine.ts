import { getSupabaseBrowserClient } from '@/features/auth/supabase-client';

export type SyncDataType = 'stats' | 'tasks' | 'settings' | 'presets';

export async function pushSyncData(dataType: SyncDataType, data: any): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from('sync_data').upsert({
    user_id: session.user.id,
    data_type: dataType,
    data,
    version: Date.now(),
    updated_at: new Date(),
  }, { onConflict: 'user_id,data_type' });
}

export async function pullSyncData(dataType: SyncDataType): Promise<any> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data } = await supabase
    .from('sync_data')
    .select('data, version')
    .eq('user_id', session.user.id)
    .eq('data_type', dataType)
    .single();

  return data?.data ?? null;
}

export async function pullAllSyncData(): Promise<Record<string, any>> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};

  const { data } = await supabase
    .from('sync_data')
    .select('data_type, data')
    .eq('user_id', session.user.id);

  const result: Record<string, any> = {};
  if (data) {
    for (const row of data) {
      result[row.data_type] = row.data;
    }
  }
  return result;
}

export async function resolveConflict(
  dataType: SyncDataType,
  localData: any,
  localVersion: number,
  remoteData: any,
  remoteVersion: number
): Promise<any> {
  if (remoteVersion > localVersion) {
    return { data: remoteData, version: remoteVersion, winner: 'remote' };
  }
  return { data: localData, version: localVersion, winner: 'local' };
}
