'use client';

import { useState, useEffect } from 'react';
import { useTimerStore } from '../timer/timer-engine';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, setSettings } = useTimerStore();
  const [workDur, setWorkDur] = useState(settings.workDur);
  const [shortDur, setShortDur] = useState(settings.shortDur);
  const [longDur, setLongDur] = useState(settings.longDur);
  const [interval, setInterval] = useState(settings.interval);

  useEffect(() => {
    setWorkDur(settings.workDur);
    setShortDur(settings.shortDur);
    setLongDur(settings.longDur);
    setInterval(settings.interval);
  }, [settings, open]);

  const handleSave = () => {
    setSettings({ workDur, shortDur, longDur, interval });
    onClose();
  };

  if (!open) return null;

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Timer settings</h2>
        <div className="setting-group">
          <label>Work duration <span>{workDur}</span> min</label>
          <input
            type="range"
            className="setting-range"
            min={5}
            max={60}
            value={workDur}
            onChange={(e) => setWorkDur(parseInt(e.target.value))}
          />
        </div>
        <div className="setting-group">
          <label>Short break <span>{shortDur}</span> min</label>
          <input
            type="range"
            className="setting-range"
            min={1}
            max={15}
            value={shortDur}
            onChange={(e) => setShortDur(parseInt(e.target.value))}
          />
        </div>
        <div className="setting-group">
          <label>Long break <span>{longDur}</span> min</label>
          <input
            type="range"
            className="setting-range"
            min={5}
            max={30}
            value={longDur}
            onChange={(e) => setLongDur(parseInt(e.target.value))}
          />
        </div>
        <div className="setting-group">
          <label>Long break after <span>{interval}</span> sessions</label>
          <input
            type="range"
            className="setting-range"
            min={2}
            max={8}
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
          />
        </div>
        <button className="modal-close" onClick={handleSave}>
          Done
        </button>
      </div>
    </div>
  );
}
