import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateBudgetStatus } from '../../utils/calculations';

export const SummaryCards = () => {
  const { summary, budgets, transactions } = useFinance();
  const { currency } = useTheme();

  // Find overall budget or sum all active budgets
  const overallBudget = budgets.find((b) => !b.category_id) || budgets[0];
  const budgetStatus = overallBudget
    ? calculateBudgetStatus(overallBudget, transactions)
    : null;

  return (
    <div className="grid-cols-4" style={{ marginBottom: '1.75rem' }}>
      {/* 1. Total Balance */}
      <div className="glass-card glass-card-interactive" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Total Balance
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.03em' }}>
              {formatCurrency(summary.totalBalance, currency)}
            </h3>
          </div>
          <div
            style={{
              padding: '0.65rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)'
            }}
          >
            <Wallet size={22} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.8rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: summary.totalBalance >= 0 ? 'var(--income)' : 'var(--expense)',
              fontWeight: 700
            }}
          >
            {summary.totalBalance >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            {summary.savingsRate.toFixed(1)}% savings rate
          </span>
          <span style={{ color: 'var(--text-muted)' }}>of income retained</span>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="glass-card glass-card-interactive">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Total Income
            </span>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                marginTop: '0.35rem',
                color: 'var(--income)',
                letterSpacing: '-0.03em'
              }}
            >
              +{formatCurrency(summary.totalIncome, currency)}
            </h3>
          </div>
          <div
            style={{
              padding: '0.65rem',
              background: 'var(--income-bg)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--income)'
            }}
          >
            <TrendingUp size={22} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>From all payment sources</span>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="glass-card glass-card-interactive">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Total Expenses
            </span>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                marginTop: '0.35rem',
                color: 'var(--expense)',
                letterSpacing: '-0.03em'
              }}
            >
              -{formatCurrency(summary.totalExpenses, currency)}
            </h3>
          </div>
          <div
            style={{
              padding: '0.65rem',
              background: 'var(--expense-bg)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--expense)'
            }}
          >
            <TrendingDown size={22} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>All recorded spending</span>
        </div>
      </div>

      {/* 4. Remaining Budget */}
      <div className="glass-card glass-card-interactive">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Remaining Budget
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.03em' }}>
              {budgetStatus
                ? formatCurrency(budgetStatus.remaining, currency)
                : 'No budget set'}
            </h3>
          </div>
          <div
            style={{
              padding: '0.65rem',
              background: 'rgba(245, 158, 11, 0.15)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--warning)'
            }}
          >
            <PiggyBank size={22} />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {budgetStatus ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${budgetStatus.percent}%`,
                    height: '100%',
                    background:
                      budgetStatus.status === 'exceeded'
                        ? 'var(--danger)'
                        : budgetStatus.status === 'warning'
                        ? 'var(--warning)'
                        : 'var(--primary)',
                    borderRadius: 'var(--radius-full)'
                  }}
                />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                {budgetStatus.rawPercent}%
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Set a monthly limit to track
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
