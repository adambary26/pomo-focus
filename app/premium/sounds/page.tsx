'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/auth-provider';
import { Upload, Play, Pause, Trash2, Music, Volume2, AlertCircle } from 'lucide-react';

interface CustomSound {
  id: string;
  name: string;
  url: string;
  duration?: number;
  createdAt: number;
}

const DB_NAME = 'PomoFocusSounds';
const STORE_NAME = 'sounds';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadSounds(): Promise<CustomSound[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

async function saveSound(sound: CustomSound, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ ...sound, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteSound(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getSoundBlob(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result?.blob || null);
    request.onerror = () => reject(request.error);
  });
}

export default function SoundsPage() {
  const { user } = useAuth();
  const [sounds, setSounds] = useState<CustomSound[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSounds().then(setSounds);
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.addEventListener('ended', () => setPlayingId(null));
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file (MP3, WAV, OGG)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be under 20MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const id = `custom-${Date.now()}`;
      const name = file.name.replace(/\.[^.]+$/, '');
      const sound: CustomSound = { id, name, url: '', createdAt: Date.now() };

      await saveSound(sound, file);

      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        const updatedSound = { ...sound, url, duration: audio.duration };
        setSounds((prev) => [...prev, updatedSound]);
      });
    } catch {
      setError('Failed to save sound. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const playSound = async (sound: CustomSound) => {
    if (!audioRef.current) return;

    if (playingId === sound.id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    let url = sound.url;
    if (!url) {
      const blob = await getSoundBlob(sound.id);
      if (blob) {
        url = URL.createObjectURL(blob);
        sound.url = url;
      }
    }

    if (!url) return;

    audioRef.current.src = url;
    audioRef.current.play();
    setPlayingId(sound.id);
  };

  const handleDelete = async (id: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
    await deleteSound(id);
    setSounds((prev) => prev.filter((s) => s.id !== id));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="premium-themes-page">
        <div className="premium-themes-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <Music size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to manage sounds</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>Sign in &rarr;</a>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-themes-page">
      <div className="premium-themes-container">
        <div className="premium-themes-header">
          <h1>Sound Library</h1>
          <p>Upload and manage your custom ambient sounds</p>
        </div>

        {/* Upload area */}
        <div
          className="billing-card"
          style={{
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            borderStyle: 'dashed',
            transition: 'all 0.2s',
          }}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div className="spinner" style={{ width: 24, height: 24, margin: '0 auto 8px', color: 'var(--accent)' }} />
          ) : (
            <Upload size={32} style={{ color: 'var(--accent)', marginBottom: 8 }} />
          )}
          <p style={{ fontWeight: 700, marginBottom: 4 }}>
            {uploading ? 'Uploading...' : 'Upload custom sound'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>MP3, WAV, OGG — max 20MB</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            background: 'oklch(55% 0.15 25 / 0.1)',
            borderRadius: 12,
            fontSize: 13,
            color: 'oklch(55% 0.15 25)',
            fontWeight: 600,
            marginBottom: 16,
          }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Volume control */}
        <div className="billing-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Volume2 size={16} style={{ color: 'var(--muted)' }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent)' }}
          />
          <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 30, textAlign: 'right' }}>
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Sound list */}
        {sounds.length === 0 ? (
          <div className="billing-card" style={{ textAlign: 'center', padding: 40 }}>
            <Music size={32} style={{ color: 'var(--muted)', marginBottom: 12 }} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No custom sounds yet. Upload your first ambient sound above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sounds.map((sound) => (
              <div
                key={sound.id}
                className="billing-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  marginBottom: 0,
                }}
              >
                <button
                  className={`billing-btn ${playingId === sound.id ? 'primary' : 'secondary'}`}
                  style={{ padding: '8px 12px', minWidth: 44 }}
                  onClick={() => playSound(sound)}
                >
                  {playingId === sound.id ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{sound.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDuration(sound.duration)}</div>
                </div>
                <button
                  onClick={() => handleDelete(sound.id)}
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(55% 0.15 25)'; e.currentTarget.style.background = 'oklch(55% 0.15 25 / 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
