export interface ConflictResolution {
  dataType: string;
  localVersion: number;
  remoteVersion: number;
  winner: 'local' | 'remote' | 'merge';
  resolvedData: any;
}

export function resolveSyncConflict(
  localData: any,
  localVersion: number,
  remoteData: any,
  remoteVersion: number,
  dataType: string
): ConflictResolution {
  if (remoteVersion > localVersion) {
    return { dataType, localVersion, remoteVersion, winner: 'remote', resolvedData: remoteData };
  }

  if (dataType === 'tasks') {
    const merged = mergeTasks(localData, remoteData);
    return { dataType, localVersion, remoteVersion, winner: 'merge', resolvedData: merged };
  }

  return { dataType, localVersion, remoteVersion, winner: 'local', resolvedData: localData };
}

function mergeTasks(local: any, remote: any): any {
  const localTasks = Array.isArray(local) ? local : [];
  const remoteTasks = Array.isArray(remote) ? remote : [];
  const taskMap = new Map();

  for (const task of [...localTasks, ...remoteTasks]) {
    const existing = taskMap.get(task.id);
    if (!existing || new Date(task.updatedAt || task.createdAt) > new Date(existing.updatedAt || existing.createdAt)) {
      taskMap.set(task.id, task);
    }
  }

  return Array.from(taskMap.values());
}
