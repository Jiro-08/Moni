import React from 'react';
import { PiggyBank, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateBudgetStatus } from '../../utils/calculations';

export const BudgetOverviewCard = ({ onNavigateToBudgets, onOpenAddBudget }) => {
  const { budgets, transactions } = useFinance();
  const { currency } = useTheme();

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Budget Overview</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Spending limits & target progress
          </p>
        </div>
        <button
          onClick={onNavigateToBudgets}
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}
        >
          <span>Manage</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {budgets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          <PiggyBank size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No budgets configured yet.</p>
          <button onClick={onOpenAddBudget} className="btn btn-primary btn-sm">
            Set a Budget
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {budgets.slice(0, 4).map((budget) => {
            const statusInfo = calculateBudgetStatus(budget, transactions);
            const isExceeded = statusInfo.status === 'exceeded';
            const isWarning = statusInfo.status === 'warning';

            return (
              <div
                key={budget.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 600 }}>{budget.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Limit: {formatCurrency(budget.amount, currency)}
                    </span>
                  </div>

                  <span
                    className={`badge ${
                      isExceeded
                        ? 'badge-exceeded'
                        : isWarning
                        ? 'badge-warning'
                        : 'badge-safe'
                    }`}
                  >
                    {isExceeded ? 'Exceeded' : isWarning ? 'Warning (80%+)' : 'Safe'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: '8px',
                    background: 'var(--bg-active)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
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
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Spent: <strong>{formatCurrency(statusInfo.spent, currency)}</strong>
                  </span>
                  <span style={{ color: isExceeded ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {isExceeded
                      ? `Over by ${formatCurrency(Math.abs(statusInfo.remaining), currency)}`
                      : `Left: ${formatCurrency(statusInfo.remaining, currency)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetOverviewCard;
