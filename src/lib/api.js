/**
 * MBS Hunt Platform — Service Layer
 *
 * Dual-mode: when Supabase env vars are set, queries Supabase.
 * Otherwise, reads/writes Zustand stores (localStorage dev mode).
 * All methods return Promises in both modes.
 */
import { supabase, isRemote } from './supabase.js';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

const delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));

export const api = {
  isRemote,

  /* ── Hunts ── */
  async getHunts() {
    if (isRemote) {
      const { data, error } = await supabase.from('hunts').select('*');
      if (error) throw error;
      useHuntStore.getState().setHunts(data);
      return data;
    }
    await delay();
    return useHuntStore.getState().hunts;
  },

  async getHunt(slug) {
    if (isRemote) {
      const { data, error } = await supabase
        .from('hunts')
        .select('*, stops(*)')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    }
    await delay();
    return useHuntStore.getState().hunts.find((h) => h.slug === slug) || null;
  },

  async saveHunt(hunt) {
    if (isRemote) {
      const { data, error } = await supabase.from('hunts').upsert(hunt).select().single();
      if (error) throw error;
      return data;
    }
    await delay();
    useHuntStore.getState().addHunt(hunt);
    return hunt;
  },

  /* ── Players ── */
  async registerPlayer({ name, email }) {
    if (isRemote) {
      const { data, error } = await supabase
        .from('players')
        .upsert({ name, email }, { onConflict: 'email' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    await delay();
    usePlayerStore.getState().register({ name, email });
    return { name, email };
  },

  /* ── Collection ── */
  async collectStop(huntSlug, stopData) {
    if (isRemote) {
      const player = usePlayerStore.getState().player;
      const { error } = await supabase.from('collections').insert({
        player_email: player.email,
        hunt_slug: huntSlug,
        stop_id: stopData.stopId,
        collected_at: stopData.collectedAt,
      });
      if (error) throw error;
    }
    usePlayerStore.getState().collectStop(huntSlug, stopData);
  },

  async getCollection(huntSlug) {
    if (isRemote) {
      const player = usePlayerStore.getState().player;
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('player_email', player.email)
        .eq('hunt_slug', huntSlug);
      if (error) throw error;
      return data;
    }
    await delay();
    return usePlayerStore.getState().collections[huntSlug] || [];
  },

  /* ── Photo Moments ── */
  async uploadPhoto(huntId, stopId, file) {
    if (isRemote) {
      const player = usePlayerStore.getState().player;
      const path = `hunts/${huntId}/${stopId}/${player.email}_${Date.now()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from('photos')
        .upload(path, file, { contentType: 'image/jpeg' });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(path);

      usePlayerStore.getState().addPhoto(huntId, stopId, publicUrl);
      return publicUrl;
    }
    // Local mode: base64 already saved to store by the component
    await delay();
    return null;
  },
};
