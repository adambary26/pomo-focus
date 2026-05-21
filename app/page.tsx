'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Settings, User, LogOut, CreditCard, Crown, BarChart3, Zap, CheckSquare } from 'lucide-react';
import { useTheme } from '@/features/themes/theme-provider';
import { useAuth } from '@/features/auth/auth-provider';
import { ThemeStrip } from '@/features/themes/theme-strip';
import { TimerDisplay } from '@/features/timer/timer-display';
import { TimerControls } from '@/features/timer/timer-controls';
import { StatsPanel } from '@/features/stats/stats-panel';
import { TasksPanel } from '@/features/tasks/tasks-panel';
import { MusicPanel } from '@/features/audio/music-panel';
import { SettingsModal } from '@/features/settings/settings-modal';
import { PresetsSelector } from '@/features/presets/presets-selector';
import { FocusRings } from '@/components/focus-rings';

type SidebarTab = 'stats' | 'tools' | 'tasks';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('stats');
  const authMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(e.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [authMenuOpen]);

  const tabs: { id: SidebarTab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <>
      <div className="sky">
        <div className="cloud cloud-1">
          <span style={{ width: 90, height: 90, left: 0, top: 20 }} />
          <span style={{ width: 130, height: 130, left: 55, top: -5 }} />
          <span style={{ width: 100, height: 100, left: 125, top: 25 }} />
          <span style={{ width: 80, height: 80, left: 180, top: 15 }} />
          <span style={{ width: 70, height: 70, left: 240, top: 35 }} />
        </div>
        <div className="cloud cloud-2">
          <span style={{ width: 80, height: 80, left: 0, top: 15 }} />
          <span style={{ width: 110, height: 110, left: 45, top: -5 }} />
          <span style={{ width: 90, height: 90, left: 105, top: 20 }} />
          <span style={{ width: 70, height: 70, left: 155, top: 10 }} />
        </div>
        <div className="cloud cloud-3">
          <span style={{ width: 110, height: 110, left: 0, top: 25 }} />
          <span style={{ width: 150, height: 150, left: 65, top: -10 }} />
          <span style={{ width: 120, height: 120, left: 150, top: 20 }} />
          <span style={{ width: 100, height: 100, left: 210, top: 30 }} />
          <span style={{ width: 90, height: 90, left: 270, top: 15 }} />
          <span style={{ width: 70, height: 70, left: 315, top: 40 }} />
        </div>
        <div className="cloud cloud-4">
          <span style={{ width: 70, height: 70, left: 0, top: 10 }} />
          <span style={{ width: 90, height: 90, left: 35, top: -3 }} />
          <span style={{ width: 80, height: 80, left: 80, top: 15 }} />
          <span style={{ width: 60, height: 60, left: 125, top: 8 }} />
        </div>
        <div className="cloud cloud-5">
          <span style={{ width: 85, height: 85, left: 0, top: 18 }} />
          <span style={{ width: 120, height: 120, left: 50, top: -8 }} />
          <span style={{ width: 100, height: 100, left: 115, top: 22 }} />
          <span style={{ width: 75, height: 75, left: 170, top: 12 }} />
          <span style={{ width: 65, height: 65, left: 220, top: 30 }} />
        </div>
      </div>

      <header>
        <div className="header-left">
          <div className="logo">
            <img src="/candle.png" alt="Candle Logo" />
            <span className="logo-text">Pomo</span>
          </div>
        </div>
        <div className="header-actions" style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={toggleTheme} title="Toggle dark mode">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="icon-btn" onClick={() => setSettingsOpen(true)} title="Settings">
            <Settings size={16} />
          </button>
          {user ? (
            <div ref={authMenuRef} style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                onClick={() => setAuthMenuOpen(!authMenuOpen)}
                title="Account"
                style={{
                  background: authMenuOpen ? 'oklch(from var(--accent) l c h / 0.15)' : undefined,
                  color: authMenuOpen ? 'var(--accent)' : undefined,
                }}
              >
                <User size={16} />
              </button>
              {authMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: 8,
                  minWidth: 200,
                  boxShadow: '0 8px 32px oklch(0% 0 0 / 0.12)',
                  zIndex: 50,
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setSettingsOpen(true); setAuthMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--fg)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                  <a
                    href="/billing"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--fg)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <CreditCard size={14} />
                    Billing
                  </a>
                  <a
                    href="/pricing"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(from var(--accent) l c h / 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Crown size={14} />
                    Upgrade to Premium
                  </a>
                  <button
                    onClick={() => { signOut(); setAuthMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'oklch(55% 0.15 25)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(55% 0.15 25 / 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="icon-btn"
              title="Sign in"
              style={{ textDecoration: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <User size={16} />
            </a>
          )}
        </div>
      </header>

      <div className="app">
        <div className="panel-bar">
          <div className="panel-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                  <button
                    key={tab.id}
                    className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="panel-content" key={activeTab}>
            {activeTab === 'stats' && (
              <div className="panel-window">
                <div className="bento-grid">
                  <div className="bento-card bento-wide">
                    <FocusRings />
                  </div>
                  <div className="bento-card">
                    <StatsPanel />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tools' && (
              <div className="panel-window">
                <div className="bento-grid">
                  <div className="bento-card">
                    <PresetsSelector />
                  </div>
                  <div className="bento-card">
                    <ThemeStrip />
                  </div>
                  <div className="bento-card">
                    <MusicPanel />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tasks' && (
              <div className="panel-window">
                <div className="bento-grid bento-single">
                  <div className="bento-card">
                    <TasksPanel />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <main className="main">
          <div className="timer-area">
            <TimerDisplay />
            <TimerControls />
          </div>
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
