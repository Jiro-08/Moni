import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { syncService } from '../services/syncService';
import { useAuth } from './AuthContext';
import {
  DEFAULT_CATEGORIES,
  INITIAL_SAMPLE_TRANSACTIONS,
  INITIAL_SAMPLE_BUDGETS,
  INITIAL_SAMPLE_NOTIFICATIONS
} from '../utils/defaultData';
import { calculateFinancialSummary, calculateBudgetStatus } from '../utils/calculations';

const FinanceContext = createContext();

const STORAGE_KEYS = {
  TRANSACTIONS: 'moni_transactions',
  BUDGETS: 'moni_budgets',
  CATEGORIES: 'moni_categories',
  NOTIFICATIONS: 'moni_notifications'
};

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();

  // State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_BUDGETS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_NOTIFICATIONS;
  });

  const [loading, setLoading] = useState(false);

  // Sync state: isOnline, isSyncing, pendingCount
  const [syncState, setSyncState] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    pendingCount: syncService.getPendingCount()
  });

  // Subscribe to syncService state
  useEffect(() => {
    const unsubscribe = syncService.subscribe((state) => {
      setSyncState(state);
    });
    return () => unsubscribe();
  }, []);

  // Sync to localStorage on local state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Fetch backend data if user is logged in and online
  useEffect(() => {
    if (isSupabaseConfigured() && supabase && user && syncState.isOnline) {
      fetchBackendData();
    }
  }, [user, syncState.isOnline]);

  const fetchBackendData = async () => {
    if (!isSupabaseConfigured() || !supabase || !user) return;
    try {
      // 1. Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (catData && catData.length > 0) setCategories(catData);

      // 2. Fetch transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*, categories(name, icon, color)')
        .order('transaction_date', { ascending: false });
      if (txData) {
        setTransactions(
          txData.map((t) => ({
            ...t,
            category_name: t.categories?.name || 'Uncategorized',
            category_icon: t.categories?.icon || 'Tag',
            category_color: t.categories?.color || '#10b981'
          }))
        );
      }

      // 3. Fetch budgets
      const { data: bgData } = await supabase
        .from('budgets')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      if (bgData) {
        setBudgets(
          bgData.map((b) => ({
            ...b,
            category_name: b.categories?.name || 'All Expenses'
          }))
        );
      }

      // 4. Fetch notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (notifData) setNotifications(notifData);
    } catch (err) {
      console.warn('Offline or background data fetch skipped:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // Financial Calculations & Metrics
  // ---------------------------------------------------------------------------
  const summary = useMemo(() => {
    return calculateFinancialSummary(transactions);
  }, [transactions]);

  // Check budget thresholds and emit notifications if needed
  const checkBudgetThresholds = (currentBudgets, currentTransactions) => {
    currentBudgets.forEach((budget) => {
      const { rawPercent, status } = calculateBudgetStatus(budget, currentTransactions);
      if (status === 'exceeded') {
        addNotification({
          title: `⚠️ Budget Exceeded: ${budget.name}`,
          message: `You have spent ${rawPercent}% of your ${budget.name} budget limit.`,
          type: 'exceeded'
        });
      } else if (status === 'warning') {
        addNotification({
          title: `🔔 Budget Warning: ${budget.name}`,
          message: `You have reached ${rawPercent}% of your ${budget.name} budget threshold.`,
          type: 'warning'
        });
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Transaction Actions (Optimistic Local + Offline Sync Queue)
  // ---------------------------------------------------------------------------
  const addTransaction = async (txData) => {
    const category = categories.find((c) => c.id === txData.category_id);
    const newTx = {
      id: txData.id || 'tx-' + Date.now(),
      user_id: user?.id || 'guest-user',
      type: txData.type,
      payment_source: txData.payment_source || 'cash',
      category_id: txData.category_id,
      category_name: category?.name || 'General',
      category_icon: category?.icon || 'Tag',
      category_color: category?.color || '#10b981',
      amount: parseFloat(txData.amount),
      description: txData.description,
      notes: txData.notes || '',
      transaction_date: txData.transaction_date,
      created_at: new Date().toISOString()
    };

    // Optimistically update local state immediately
    const updatedTransactions = [newTx, ...transactions];
    setTransactions(updatedTransactions);

    // Queue for sync or sync immediately if online
    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .insert([
              {
                user_id: user.id,
                type: newTx.type,
                payment_source: newTx.payment_source,
                category_id: newTx.category_id,
                amount: newTx.amount,
                description: newTx.description,
                notes: newTx.notes,
                transaction_date: newTx.transaction_date
              }
            ])
            .select()
            .single();
          if (error) throw error;
          if (data) newTx.id = data.id;
        } catch (err) {
          console.log('Network request failed, queueing transaction for later sync...');
          syncService.enqueue({
            type: 'add_transaction',
            payload: {
              user_id: user.id,
              type: newTx.type,
              payment_source: newTx.payment_source,
              category_id: newTx.category_id,
              amount: newTx.amount,
              description: newTx.description,
              notes: newTx.notes,
              transaction_date: newTx.transaction_date
            }
          });
        }
      } else {
        // Explicitly offline, queue mutation
        syncService.enqueue({
          type: 'add_transaction',
          payload: {
            user_id: user.id,
            type: newTx.type,
            payment_source: newTx.payment_source,
            category_id: newTx.category_id,
            amount: newTx.amount,
            description: newTx.description,
            notes: newTx.notes,
            transaction_date: newTx.transaction_date
          }
        });
      }
    }

    // Trigger budget alerts if expense
    if (newTx.type === 'expense') {
      checkBudgetThresholds(budgets, updatedTransactions);
    }

    return newTx;
  };

  const editTransaction = async (id, updates) => {
    const category = categories.find((c) => c.id === updates.category_id);
    const updatedTransactions = transactions.map((tx) => {
      if (tx.id === id) {
        return {
          ...tx,
          ...updates,
          amount: parseFloat(updates.amount),
          category_name: category?.name || tx.category_name,
          category_icon: category?.icon || tx.category_icon,
          category_color: category?.color || tx.category_color,
          updated_at: new Date().toISOString()
        };
      }
      return tx;
    });

    setTransactions(updatedTransactions);

    const dbPayload = {
      type: updates.type,
      payment_source: updates.payment_source,
      category_id: updates.category_id,
      amount: parseFloat(updates.amount),
      description: updates.description,
      notes: updates.notes,
      transaction_date: updates.transaction_date,
      updated_at: new Date().toISOString()
    };

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { error } = await supabase.from('transactions').update(dbPayload).eq('id', id);
          if (error) throw error;
        } catch (err) {
          syncService.enqueue({
            type: 'edit_transaction',
            payload: { id, updates: dbPayload }
          });
        }
      } else {
        syncService.enqueue({
          type: 'edit_transaction',
          payload: { id, updates: dbPayload }
        });
      }
    }

    return true;
  };

  const deleteTransaction = async (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { error } = await supabase.from('transactions').delete().eq('id', id);
          if (error) throw error;
        } catch (err) {
          syncService.enqueue({
            type: 'delete_transaction',
            payload: { id }
          });
        }
      } else {
        syncService.enqueue({
          type: 'delete_transaction',
          payload: { id }
        });
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Budget Actions (Optimistic Local + Offline Sync Queue)
  // ---------------------------------------------------------------------------
  const addBudget = async (bgData) => {
    const category = categories.find((c) => c.id === bgData.category_id);
    const newBudget = {
      id: bgData.id || 'bg-' + Date.now(),
      user_id: user?.id || 'guest-user',
      category_id: bgData.category_id || null,
      category_name: category ? category.name : 'All Expenses',
      name: bgData.name,
      amount: parseFloat(bgData.amount),
      start_date: bgData.start_date,
      end_date: bgData.end_date,
      warning_threshold: parseInt(bgData.warning_threshold || 80, 10),
      created_at: new Date().toISOString()
    };

    const updatedBudgets = [newBudget, ...budgets];
    setBudgets(updatedBudgets);

    const dbPayload = {
      user_id: user?.id,
      category_id: newBudget.category_id,
      name: newBudget.name,
      amount: newBudget.amount,
      start_date: newBudget.start_date,
      end_date: newBudget.end_date,
      warning_threshold: newBudget.warning_threshold
    };

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { data, error } = await supabase.from('budgets').insert([dbPayload]).select().single();
          if (error) throw error;
          if (data) newBudget.id = data.id;
        } catch (err) {
          syncService.enqueue({
            type: 'add_budget',
            payload: dbPayload
          });
        }
      } else {
        syncService.enqueue({
          type: 'add_budget',
          payload: dbPayload
        });
      }
    }

    return newBudget;
  };

  const editBudget = async (id, updates) => {
    const category = categories.find((c) => c.id === updates.category_id);
    const updatedBudgets = budgets.map((bg) => {
      if (bg.id === id) {
        return {
          ...bg,
          ...updates,
          category_name: category ? category.name : 'All Expenses',
          amount: parseFloat(updates.amount),
          warning_threshold: parseInt(updates.warning_threshold || 80, 10),
          updated_at: new Date().toISOString()
        };
      }
      return bg;
    });

    setBudgets(updatedBudgets);

    const dbPayload = {
      category_id: updates.category_id || null,
      name: updates.name,
      amount: parseFloat(updates.amount),
      start_date: updates.start_date,
      end_date: updates.end_date,
      warning_threshold: parseInt(updates.warning_threshold || 80, 10),
      updated_at: new Date().toISOString()
    };

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { error } = await supabase.from('budgets').update(dbPayload).eq('id', id);
          if (error) throw error;
        } catch (err) {
          syncService.enqueue({
            type: 'edit_budget',
            payload: { id, updates: dbPayload }
          });
        }
      } else {
        syncService.enqueue({
          type: 'edit_budget',
          payload: { id, updates: dbPayload }
        });
      }
    }
  };

  const deleteBudget = async (id) => {
    setBudgets((prev) => prev.filter((bg) => bg.id !== id));

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { error } = await supabase.from('budgets').delete().eq('id', id);
          if (error) throw error;
        } catch (err) {
          syncService.enqueue({
            type: 'delete_budget',
            payload: { id }
          });
        }
      } else {
        syncService.enqueue({
          type: 'delete_budget',
          payload: { id }
        });
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Category Actions (Optimistic Local + Offline Sync Queue)
  // ---------------------------------------------------------------------------
  const addCategory = async (catData) => {
    const newCat = {
      id: catData.id || 'cat-' + Date.now(),
      user_id: user?.id || 'guest-user',
      name: catData.name,
      type: catData.type,
      icon: catData.icon || 'Tag',
      color: catData.color || '#10b981',
      created_at: new Date().toISOString()
    };

    setCategories((prev) => [...prev, newCat]);

    const dbPayload = {
      user_id: user?.id,
      name: newCat.name,
      type: newCat.type,
      icon: newCat.icon,
      color: newCat.color
    };

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { data, error } = await supabase.from('categories').insert([dbPayload]).select().single();
          if (error) throw error;
          if (data) newCat.id = data.id;
        } catch (err) {
          syncService.enqueue({
            type: 'add_category',
            payload: dbPayload
          });
        }
      } else {
        syncService.enqueue({
          type: 'add_category',
          payload: dbPayload
        });
      }
    }

    return newCat;
  };

  const editCategory = async (id, updates) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    const dbPayload = {
      name: updates.name,
      type: updates.type,
      icon: updates.icon,
      color: updates.color
    };

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { error } = await supabase.from('categories').update(dbPayload).eq('id', id);
          if (error) throw error;
        } catch (err) {
          syncService.enqueue({
            type: 'edit_category',
            payload: { id, updates: dbPayload }
          });
        }
      } else {
        syncService.enqueue({
          type: 'edit_category',
          payload: { id, updates: dbPayload }
        });
      }
    }
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (user && isSupabaseConfigured() && supabase) {
      if (syncState.isOnline) {
        try {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
        } catch (err) {
          syncService.enqueue({
            type: 'delete_category',
            payload: { id }
          });
        }
      } else {
        syncService.enqueue({
          type: 'delete_category',
          payload: { id }
        });
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Notifications Actions
  // ---------------------------------------------------------------------------
  const addNotification = (notif) => {
    const newNotif = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 5),
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      is_read: false,
      created_at: new Date().toISOString()
    };

    setNotifications((prev) => {
      const exists = prev.find(
        (n) => n.title === notif.title && Date.now() - new Date(n.created_at).getTime() < 600000
      );
      if (exists) return prev;
      return [newNotif, ...prev];
    });
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Reset to Zero (Fresh Start)
  const resetToZero = async () => {
    setTransactions([]);
    setBudgets([]);
    setNotifications([]);
    setCategories(DEFAULT_CATEGORIES);
    syncService.clearQueue();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));

    if (user && isSupabaseConfigured() && supabase && syncState.isOnline) {
      try {
        await supabase.from('transactions').delete().eq('user_id', user.id);
        await supabase.from('budgets').delete().eq('user_id', user.id);
        await supabase.from('notifications').delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Backend reset error:', err);
      }
    }
  };

  // Reset to default sample data (optional fallback)
  const resetToSampleData = () => {
    setCategories(DEFAULT_CATEGORIES);
    setTransactions(INITIAL_SAMPLE_TRANSACTIONS);
    setBudgets(INITIAL_SAMPLE_BUDGETS);
    setNotifications(INITIAL_SAMPLE_NOTIFICATIONS);
    syncService.clearQueue();
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  };

  // Manual trigger sync
  const triggerManualSync = () => {
    syncService.processQueue();
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        categories,
        notifications,
        summary,
        loading,
        syncState,
        triggerManualSync,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addBudget,
        editBudget,
        deleteBudget,
        addCategory,
        editCategory,
        deleteCategory,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        resetToZero,
        resetToSampleData,
        refreshData: fetchBackendData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
