import { useEffect } from 'react';
import { useUiStore } from '../../stores/uiStore.js';

const TOAST_STYLES = {
  success: 'bg-nature-100 text-nature-800 border-nature-300',
  error: 'bg-secondary-100 text-secondary-800 border-secondary-300',
  info: 'bg-primary-100 text-primary-800 border-primary-300',
  warning: 'bg-accent-100 text-accent-800 border-accent-300',
};

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  info: '💡',
  warning: '⚠️',
};

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-card border shadow-lg animate-[slideIn_0.3s_ease-out] ${style}`}>
      <span>{TOAST_ICONS[toast.type] || TOAST_ICONS.info}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  const dismissToast = useUiStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
