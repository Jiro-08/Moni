import React from 'react';
import { Bell, CheckCheck, Trash2, AlertCircle, AlertTriangle, Info, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatDate } from '../../utils/formatters';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications } = useFinance();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'exceeded':
        return <AlertCircle size={16} color="var(--danger)" />;
      case 'warning':
        return <AlertTriangle size={16} color="var(--warning)" />;
      case 'reminder':
        return <Calendar size={16} color="var(--info)" />;
      default:
        return <Info size={16} color="var(--primary)" />;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        right: '1.5rem',
        width: '360px',
        maxWidth: '90vw',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100,
        overflow: 'hidden'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="var(--primary)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Notifications</h4>
          <span
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.1rem 0.5rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {notifications.filter((n) => !n.is_read).length} new
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={markAllNotificationsRead}
            title="Mark all as read"
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            <CheckCheck size={14} />
          </button>
          <button
            onClick={clearAllNotifications}
            title="Clear all"
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.875rem' }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              style={{
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid var(--border-color)',
                background: notif.is_read ? 'transparent' : 'rgba(16, 185, 129, 0.05)',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                display: 'flex',
                gap: '0.75rem'
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {notif.title}
                  </h5>
                  {!notif.is_read && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'inline-block'
                      }}
                    />
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                  {notif.message}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {formatDate(notif.created_at, 'short')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
