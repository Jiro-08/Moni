import React, { useState } from 'react';
import {
  DollarSign,
  Cloud,
  RefreshCw,
  Sun,
  Moon,
  Trash2,
  CheckCircle2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { CURRENCY_SYMBOLS } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const SettingsPage = () => {
  const { theme, toggleTheme, currency, setCurrency } = useTheme();
  const { resetToZero, syncState, triggerManualSync } = useFinance();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Application Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Configure currency defaults, visual preferences, and offline synchronization
        </p>
      </div>

      {/* 1. Currency Preference */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <DollarSign size={20} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Currency Symbol</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Choose your primary currency representation (Default: Philippine Peso ₱)
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem' }}>
          {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => {
            const isSelected = currency === symbol;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setCurrency(symbol)}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--bg-active)' : 'var(--bg-input)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{symbol}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Offline & Sync Status */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {syncState.isOnline ? (
              <Wifi size={20} color="var(--primary)" />
            ) : (
              <WifiOff size={20} color="var(--warning)" />
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Data Storage & Sync</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {syncState.isOnline
                  ? syncState.pendingCount > 0
                    ? `${syncState.pendingCount} record(s) queued for synchronization`
                    : 'Online — all changes are synchronized'
                  : 'Offline mode active — changes are saved locally and will auto-sync when online'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerManualSync}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            disabled={syncState.isSyncing || !syncState.isOnline}
          >
            <Cloud size={14} color="var(--primary)" />
            <span>{syncState.isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        <div
          style={{
            padding: '0.85rem 1rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            <CheckCircle2 size={16} color="var(--primary)" />
            <span>Automatic Background Synchronization</span>
          </div>
          You can record transactions, adjust budgets, and manage categories even without an internet connection. When reconnected, all offline records sync automatically.
        </div>
      </div>

      {/* 3. Reset to 0 (Fresh Start) */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reset to 0 (Fresh Start)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Wipe all recorded transactions and budgets to start clean from 0.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="btn btn-danger btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Trash2 size={15} />
            <span>Reset to 0</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToZero}
        title="Reset All Records to 0"
        message="This will permanently delete all your recorded transactions, active budgets, and notifications. Your balance will be reset to 0.00. Are you sure you want to start fresh?"
        confirmText="Yes, Reset to 0"
        isDanger={true}
      />
    </div>
  );
};

export default SettingsPage;
