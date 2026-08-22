import React from 'react';
import { PiggyBank, AlertTriangle, CheckCircle, AlertCircle, Edit2, Trash2, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { calculateBudgetStatus } from '../../utils/calculations';

export const BudgetCard = ({ budget, transactions, onEdit, onDelete, onViewDetails }) => {
  const { currency } = useTheme();
  const statusInfo = calculateBudgetStatus(budget, transactions);

  const isExceeded = statusInfo.status === 'exceeded';
  const isWarning = statusInfo.status === 'warning';

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${
          isExceeded ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--primary)'
        }`
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {budget.category_name || 'Overall Budget'}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{budget.name}</h3>
          </div>

          <span
            className={`badge ${
              isExceeded ? 'badge-exceeded' : isWarning ? 'badge-warning' : 'badge-safe'
            }`}
          >
            {isExceeded ? (
              <>
                <AlertCircle size={12} />
                <span>Exceeded</span>
              </>
            ) : isWarning ? (
              <>
                <AlertTriangle size={12} />
                <span>Warning ({budget.warning_threshold || 80}%+)</span>
              </>
            ) : (
              <>
                <CheckCircle size={12} />
                <span>Safe</span>
              </>
            )}
          </span>
        </div>

        {/* Budget Limit & Spending */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Spent: <strong>{formatCurrency(statusInfo.spent, currency)}</strong>
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Limit: {formatCurrency(budget.amount, currency)}
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '10px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginTop: '0.5rem'
            }}
          >
            <div
              style={{
                width: `${statusInfo.percent}%`,
                height: '100%',
                background: isExceeded
                  ? 'linear-gradient(90deg, #f43f5e 0%, #ef4444 100%)'
                  : isWarning
                  ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {statusInfo.rawPercent}% utilized
            </span>
            <span style={{ fontWeight: 600, color: isExceeded ? 'var(--danger)' : 'var(--income)' }}>
              {isExceeded
                ? `Over by ${formatCurrency(Math.abs(statusInfo.remaining), currency)}`
                : `Remaining: ${formatCurrency(statusInfo.remaining, currency)}`}
            </span>
          </div>
        </div>

        {/* Date Period & Transaction count */}
        <div
          style={{
            padding: '0.65rem 0.85rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>
            {formatDate(budget.start_date, 'short')} - {formatDate(budget.end_date, 'short')}
          </span>
          <span>{statusInfo.transactionCount} transactions</span>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <button
          onClick={() => onViewDetails(budget, statusInfo)}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <Eye size={14} />
          <span>Details</span>
        </button>
        <button
          onClick={() => onEdit(budget)}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <Edit2 size={14} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(budget)}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.8rem', gap: '0.35rem', color: 'var(--danger)' }}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;
