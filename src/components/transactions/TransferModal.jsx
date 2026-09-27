import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowRightLeft,
  Banknote,
  Smartphone,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const SOURCES = [
  { id: 'cash', label: 'Cash', icon: Banknote, color: '#06b6d4', bgGlow: 'rgba(6, 182, 212, 0.12)' },
  { id: 'ewallet', label: 'E-Wallet', icon: Smartphone, color: '#8b5cf6', bgGlow: 'rgba(139, 92, 246, 0.12)' },
  { id: 'bank', label: 'Bank', icon: Building, color: '#3b82f6', bgGlow: 'rgba(59, 130, 246, 0.12)' }
];

export const TransferModal = ({ isOpen, onClose, defaultFrom = 'cash', defaultTo = 'ewallet' }) => {
  const { summary, transferFunds } = useFinance();
  const { currency } = useTheme();

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFrom(defaultFrom);
      setTo(defaultTo === defaultFrom ? (defaultFrom === 'cash' ? 'ewallet' : 'cash') : defaultTo);
      setAmount('');
      setNotes('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, defaultFrom, defaultTo]);

  const getSourceBalance = (sourceId) => {
    if (sourceId === 'cash') return summary.cash.balance;
    if (sourceId === 'ewallet') return summary.ewallet.balance;
    if (sourceId === 'bank') return summary.bank.balance;
    return 0;
  };

  const handleSwapSources = () => {
    setFrom(to);
    setTo(from);
    setError('');
  };

  const handleFromChange = (sourceId) => {
    setFrom(sourceId);
    if (sourceId === to) {
      // Auto-swap to prevent same source/dest
      const remaining = SOURCES.filter((s) => s.id !== sourceId);
      setTo(remaining[0].id);
    }
    setError('');
  };

  const handleToChange = (sourceId) => {
    setTo(sourceId);
    if (sourceId === from) {
      const remaining = SOURCES.filter((s) => s.id !== sourceId);
      setFrom(remaining[0].id);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (from === to) {
      setError('Source and destination must be different.');
      return;
    }

    const sourceBalance = getSourceBalance(from);
    if (parsedAmount > sourceBalance) {
      setError(`Insufficient balance. Your ${SOURCES.find((s) => s.id === from)?.label} balance is ${formatCurrency(sourceBalance, currency)}.`);
      return;
    }

    setLoading(true);
    try {
      await transferFunds({
        from,
        to,
        amount: parsedAmount,
        notes: notes.trim(),
        date: new Date().toISOString().split('T')[0]
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fromSource = SOURCES.find((s) => s.id === from);
  const toSource = SOURCES.find((s) => s.id === to);
  const fromBalance = getSourceBalance(from);
  const parsedAmt = parseFloat(amount) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Between Accounts">
      {success ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem 1rem',
            gap: '1rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--income-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pop-in 0.35s ease'
            }}
          >
            <CheckCircle2 size={32} style={{ color: 'var(--income)' }} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Transfer Complete!</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>{formatCurrency(parsedAmt, currency)}</strong> has been moved from{' '}
            <strong style={{ color: fromSource?.color }}>{fromSource?.label}</strong> to{' '}
            <strong style={{ color: toSource?.color }}>{toSource?.label}</strong>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--danger-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* From / To Source Selection */}
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* FROM Source */}
            <div style={{ flex: 1 }}>
              <label
                className="form-label"
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}
              >
                From
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {SOURCES.map((source) => {
                  const Icon = source.icon;
                  const isSelected = from === source.id;
                  const balance = getSourceBalance(source.id);
                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => handleFromChange(source.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? source.bgGlow : 'var(--bg-input)',
                        border: `1.5px solid ${isSelected ? source.color : 'var(--border-color)'}`,
                        color: isSelected ? source.color : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        width: '100%'
                      }}
                    >
                      <Icon size={16} />
                      <div style={{ flex: 1 }}>
                        <div>{source.label}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                          {formatCurrency(balance, currency)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Swap Arrow Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '1.4rem'
              }}
            >
              <button
                type="button"
                onClick={handleSwapSources}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  border: '1px solid var(--income-border)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                title="Swap accounts"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* TO Source */}
            <div style={{ flex: 1 }}>
              <label
                className="form-label"
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}
              >
                To
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {SOURCES.map((source) => {
                  const Icon = source.icon;
                  const isSelected = to === source.id;
                  const isDisabled = from === source.id;
                  const balance = getSourceBalance(source.id);
                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => !isDisabled && handleToChange(source.id)}
                      disabled={isDisabled}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected
                          ? source.bgGlow
                          : isDisabled
                          ? 'var(--bg-primary)'
                          : 'var(--bg-input)',
                        border: `1.5px solid ${isSelected ? source.color : 'var(--border-color)'}`,
                        color: isDisabled
                          ? 'var(--text-muted)'
                          : isSelected
                          ? source.color
                          : 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        width: '100%',
                        opacity: isDisabled ? 0.4 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Icon size={16} />
                      <div style={{ flex: 1 }}>
                        <div>{source.label}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                          {formatCurrency(balance, currency)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transfer Preview Banner */}
          {parsedAmt > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                border: '1px solid var(--income-border)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span style={{ color: fromSource?.color }}>{fromSource?.label}</span>
              <ArrowRight size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ color: toSource?.color }}>{toSource?.label}</span>
              <span style={{ color: 'var(--primary)', marginLeft: '0.25rem' }}>
                {formatCurrency(parsedAmt, currency)}
              </span>
            </div>
          )}

          {/* Amount Input */}
          <div className="form-group">
            <label className="form-label">Transfer Amount ({currency})</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="form-input"
              style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}
              required
              autoFocus
            />
            {fromBalance > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.35rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span>
                  Available: <strong style={{ color: fromSource?.color }}>{formatCurrency(fromBalance, currency)}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(String(fromBalance))}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    border: '1px solid var(--income-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.15rem 0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Transfer All
                </button>
              </div>
            )}
          </div>

          {/* Optional Notes */}
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Moving savings to bank, GCash top-up"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ gap: '0.4rem' }}
            >
              <ArrowRightLeft size={16} />
              {loading ? 'Transferring...' : 'Confirm Transfer'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TransferModal;
