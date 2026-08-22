// ==============================================================================
// Offline Synchronization Engine
// Queues local mutations when offline and flushes to backend when online.
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';

const SYNC_QUEUE_KEY = 'moni_sync_queue';

class SyncService {
  constructor() {
    this.listeners = new Set();
    this.isSyncing = false;
    this.initNetworkListeners();
  }

  getQueue() {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveQueue(queue) {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    this.notify();
  }

  enqueue(action) {
    const queue = this.getQueue();
    const item = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      ...action
    };
    queue.push(item);
    this.saveQueue(queue);

    // If online, attempt to process immediately
    if (navigator.onLine) {
      this.processQueue();
    }
    return item;
  }

  clearQueue() {
    localStorage.removeItem(SYNC_QUEUE_KEY);
    this.notify();
  }

  getPendingCount() {
    return this.getQueue().length;
  }

  isOnline() {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = {
      isOnline: this.isOnline(),
      isSyncing: this.isSyncing,
      pendingCount: this.getPendingCount()
    };
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (e) {
        console.error('Sync listener error:', e);
      }
    });
  }

  initNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncService] Device is online. Flushing sync queue...');
        this.notify();
        this.processQueue();
      });

      window.addEventListener('offline', () => {
        console.log('[SyncService] Device is offline. Changes will be queued locally.');
        this.notify();
      });

      // Periodic check every 45s when online
      setInterval(() => {
        if (this.isOnline() && this.getPendingCount() > 0 && !this.isSyncing) {
          this.processQueue();
        }
      }, 45000);
    }
  }

  async processQueue() {
    if (this.isSyncing || !this.isOnline() || !isSupabaseConfigured() || !supabase) {
      this.notify();
      return;
    }

    const queue = this.getQueue();
    if (queue.length === 0) {
      this.notify();
      return;
    }

    this.isSyncing = true;
    this.notify();

    const remainingQueue = [];

    for (const item of queue) {
      try {
        const success = await this.executeSyncItem(item);
        if (!success) {
          remainingQueue.push(item);
        }
      } catch (err) {
        console.warn(`[SyncService] Failed to sync item ${item.type}:`, err);
        remainingQueue.push(item);
      }
    }

    this.saveQueue(remainingQueue);
    this.isSyncing = false;
    this.notify();
  }

  async executeSyncItem(item) {
    if (!supabase) return false;

    switch (item.type) {
      // 1. Transactions
      case 'add_transaction': {
        const { error } = await supabase.from('transactions').insert([item.payload]);
        return !error;
      }
      case 'edit_transaction': {
        const { id, updates } = item.payload;
        const { error } = await supabase.from('transactions').update(updates).eq('id', id);
        return !error;
      }
      case 'delete_transaction': {
        const { error } = await supabase.from('transactions').delete().eq('id', item.payload.id);
        return !error;
      }

      // 2. Budgets
      case 'add_budget': {
        const { error } = await supabase.from('budgets').insert([item.payload]);
        return !error;
      }
      case 'edit_budget': {
        const { id, updates } = item.payload;
        const { error } = await supabase.from('budgets').update(updates).eq('id', id);
        return !error;
      }
      case 'delete_budget': {
        const { error } = await supabase.from('budgets').delete().eq('id', item.payload.id);
        return !error;
      }

      // 3. Categories
      case 'add_category': {
        const { error } = await supabase.from('categories').insert([item.payload]);
        return !error;
      }
      case 'edit_category': {
        const { id, updates } = item.payload;
        const { error } = await supabase.from('categories').update(updates).eq('id', id);
        return !error;
      }
      case 'delete_category': {
        const { error } = await supabase.from('categories').delete().eq('id', item.payload.id);
        return !error;
      }

      default:
        return true;
    }
  }
}

export const syncService = new SyncService();
