'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from './toast-store';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 8px 32px oklch(0% 0 0 / 0.15)',
            animation: 'toastSlideUp 0.3s ease-out',
            maxWidth: 400,
          }}
        >
          <span style={{ fontSize: 24 }}>{toast.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', margin: 0 }}>{toast.title}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{toast.description}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
