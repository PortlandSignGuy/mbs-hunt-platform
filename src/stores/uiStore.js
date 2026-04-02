import { create } from 'zustand';

let toastCounter = 0;

export const useUiStore = create((set) => ({
  /* ── Toasts ── */
  toasts: [],

  addToast: (input) => {
    const toast =
      typeof input === 'string'
        ? { id: ++toastCounter, type: 'info', message: input }
        : { id: ++toastCounter, type: 'info', ...input };
    set((s) => ({ toasts: [...s.toasts.slice(-4), toast] }));
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  /* ── Sidebar (mobile) ── */
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
