import React from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DynamicIcon from '../common/DynamicIcon';
import { PiggyBank, AlertTriangle, CheckCircle, AlertCircle, Edit2, Calendar } from 'lucide-react';

export const BudgetDetailsModal = ({ isOpen, onClose, budget, statusInfo, onEdit }) => {
  const { transactions } = useFinance();
  const { currency } = useTheme();

  if (!budget || !statusInfo) return null;

  const isExceeded = statusInfo.status === 'exceeded';
  const isWarning = statusInfo.status === 'warning';

  // Find all transactions that contributed to this budget
  const relatedExpenses = transactions.filter((tx) => {
    if (tx.type !== 'expense') return false;
    if (budget.category_id && tx.category_id !== budget.category_id) return false;
    if (budget.start_date && budget.end_date) {
      const txTime = new Date(tx.transaction_date).getTime();
      const sTime = new Date(budget.start_date).getTime();
      const eTime = new Date(budget.end_date).getTime();
      if (txTime < sTime || txTime > eTime) return false;
    }
    return true;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Budget Details" maxWidth="600px">
      <div>
        {/* Top Summary Banner */}
        <div
          style={{
            padding: '1.25rem',
            background: isExceeded ? 'var(--danger-bg)' : isWarning ? 'var(--warning-bg)' : 'var(--income-bg)',
            border: `1px solid ${
              isExceeded ? 'var(--danger-border)' : isWarning ? 'var(--warning-border)' : 'var(--income-border)'
            }`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isExceeded ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--income)'
                }}
              >
                {budget.category_name || 'All Expenses'}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '2px' }}>{budget.name}</h3>
            </div>

            <span
              className={`badge ${
                isExceeded ? 'badge-exceeded' : isWarning ? 'badge-warning' : 'badge-safe'
              }`}
            >
              {isExceeded ? 'Exceeded Limit' : isWarning ? 'Warning Level' : 'Within Budget'}
            </span>
          </div>

          <div
            style={{
              height: '10px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginTop: '1rem',
              marginBottom: '0.5rem'
            }}
          >
            <div
              style={{
                width: `${statusInfo.percent}%`,
                height: '100%',
                background: isExceeded
                  ? 'var(--danger)'
                  : isWarning
                  ? 'var(--warning)'
                  : 'var(--primary)',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
            <span>
              Spent: <strong>{formatCurrency(statusInfo.spent, currency)}</strong> ({statusInfo.rawPercent}%)
            </span>
            <span>
              Limit: <strong>{formatCurrency(budget.amount, currency)}</strong>
            </span>
          </div>
        </div>

        {/* Breakdown Key Figures */}
        <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining Allowance</span>
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: isExceeded ? 'var(--danger)' : 'var(--income)',
                marginTop: '3px'
              }}
            >
              {isExceeded
                ? `-${formatCurrency(Math.abs(statusInfo.remaining), currency)}`
                : formatCurrency(statusInfo.remaining, currency)}
            </h4>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Period</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              <Calendar size={15} color="var(--primary)" />
              <span>{formatDate(budget.start_date, 'short')} - {formatDate(budget.end_date, 'short')}</span>
            </div>
          </div>
        </div>

        {/* Related Transactions List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Contributing Transactions ({relatedExpenses.length})
          </h4>

          <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {relatedExpenses.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                No expenses have been recorded against this budget yet.
              </p>
            ) : (
              relatedExpenses.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <DynamicIcon name={tx.category_icon || 'ShoppingBag'} size={16} color="var(--expense)" />
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.description}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        {formatDate(tx.transaction_date, 'short')}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontWeight: 700, color: 'var(--expense)' }}>
                    -{formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(budget);
            }}
            className="btn btn-primary"
          >
            <Edit2 size={16} />
            <span>Edit Budget</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BudgetDetailsModal;
