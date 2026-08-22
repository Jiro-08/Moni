import React, { useState } from 'react';
import { User, Mail, Calendar, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { formatDate } from '../utils/formatters';

export const ProfilePage = () => {
  const { profile, user, updateProfile, isSupabaseActive } = useAuth();
  const { transactions, budgets } = useFinance();

  const [fullName, setFullName] = useState(profile?.full_name || 'Alex Rivera');
  const [email] = useState(profile?.email || 'guest@moni.app');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>User Profile</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage your personal account credentials and profile details
        </p>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
            }}
          >
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{fullName}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                {user ? 'Account Active' : 'Guest Session'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="email"
                value={email}
                disabled
                className="form-input"
                style={{ paddingLeft: '2.75rem', opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Email address is managed securely via authentication credentials.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {saved ? (
                <>
                  <Check size={16} />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <span>{loading ? 'Saving...' : 'Save Profile'}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Overview Stats */}
      <div className="grid-cols-2">
        <div className="glass-card">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Activity</span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {transactions.length} Transactions
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recorded in ledger</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Budgets</span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {budgets.length} Spending Limits
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Currently monitored</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
