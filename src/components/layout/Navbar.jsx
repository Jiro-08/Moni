import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Plus,
  User as UserIcon,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import NotificationDropdown from './NotificationDropdown';

export const Navbar = ({ title, onOpenQuickAdd, onToggleSidebar }) => {
  const { profile, user, isSupabaseActive } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, syncState, triggerManualSync } = useFinance();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header
      className="app-header"
      style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-ghost btn-icon mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {/* Quick Add Button (Desktop only, mobile has bottom FAB) */}
        {onOpenQuickAdd && (
          <button
            onClick={onOpenQuickAdd}
            className="btn btn-primary btn-sm hide-on-mobile"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-full)' }}
          >
            <Plus size={16} />
            <span style={{ display: 'inline-block' }}>Add Record</span>
          </button>
        )}

        {/* Connection & Sync Status Indicator */}
        <button
          type="button"
          onClick={triggerManualSync}
          title={
            !syncState.isOnline
              ? 'You are offline. Changes are saved locally and will sync when reconnected.'
              : syncState.isSyncing
              ? 'Synchronizing pending records...'
              : syncState.pendingCount > 0
              ? `${syncState.pendingCount} record(s) queued for sync. Click to sync now.`
              : 'All records synchronized.'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: !syncState.isOnline
              ? 'rgba(245, 158, 11, 0.12)'
              : syncState.isSyncing
              ? 'rgba(59, 130, 246, 0.12)'
              : 'var(--primary-light)',
            border: `1px solid ${
              !syncState.isOnline
                ? 'rgba(245, 158, 11, 0.3)'
                : syncState.isSyncing
                ? 'rgba(59, 130, 246, 0.3)'
                : 'var(--income-border)'
            }`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: !syncState.isOnline
              ? 'var(--warning)'
              : syncState.isSyncing
              ? 'var(--info)'
              : 'var(--primary)',
            cursor: syncState.pendingCount > 0 || syncState.isOnline ? 'pointer' : 'default'
          }}
        >
          <span
            className="pulse-dot"
            style={{
              backgroundColor: !syncState.isOnline
                ? 'var(--warning)'
                : syncState.isSyncing
                ? 'var(--info)'
                : 'var(--primary)'
            }}
          />
          <span className="hide-on-xs">
            {!syncState.isOnline
              ? syncState.pendingCount > 0
                ? `Offline (${syncState.pendingCount})`
                : 'Offline'
              : syncState.isSyncing
              ? 'Syncing...'
              : syncState.pendingCount > 0
              ? `Sync (${syncState.pendingCount})`
              : 'Synced'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
          style={{ width: '36px', height: '36px' }}
        >
          {theme === 'dark' ? <Sun size={17} color="#eab308" /> : <Moon size={17} color="#6366f1" />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative', width: '36px', height: '36px' }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--danger)',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-primary)'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User profile avatar / pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.6rem 0.25rem 0.25rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}
          >
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span
            className="hide-on-mobile"
            style={{
              fontSize: '0.825rem',
              fontWeight: 600,
              maxWidth: '100px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {profile?.full_name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
