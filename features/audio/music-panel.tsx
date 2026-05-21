'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { MUSIC_TRACKS } from './ambient-player';

export function MusicPanel() {
  const [selectedTrack, setSelectedTrack] = useState('none');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTrackChange = (trackId: string) => {
    setSelectedTrack(trackId);
    if (trackId === 'none') {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    const track = MUSIC_TRACKS.find((t) => t.id === trackId);
    if (track && audioRef.current) {
      audioRef.current.src = track.url;
      if (playing) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || selectedTrack === 'none') return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <div>
      <div className="card-title">Music</div>
      <select
        id="music-track-select"
        className="skip-select"
        style={{ width: '100%', marginBottom: 10, height: 32, fontSize: 11 }}
        value={selectedTrack}
        onChange={(e) => handleTrackChange(e.target.value)}
      >
        {MUSIC_TRACKS.map((track) => (
          <option key={track.id} value={track.id}>{track.label}</option>
        ))}
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="timer-btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: 11, flex: 1 }}
          onClick={togglePlay}
          disabled={selectedTrack === 'none'}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
          <span style={{ marginLeft: 4 }}>{playing ? 'Pause' : 'Play'}</span>
        </button>
        <input
          id="music-volume"
          type="range"
          className="setting-range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ width: 80 }}
        />
      </div>
      <div style={{ fontSize: 9, opacity: 0.45, marginTop: 8, textAlign: 'center' }}>
        Tracks: Orange Free Sounds (CC BY-NC 4.0)
      </div>
    </div>
  );
}
