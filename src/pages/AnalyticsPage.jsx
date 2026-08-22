import React, { useState, useMemo } from 'react';
import { Calendar, Download } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import StatSummary from '../components/analytics/StatSummary';
import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import SpendingTrendChart from '../components/analytics/SpendingTrendChart';

export const AnalyticsPage = () => {
  const { transactions } = useFinance();
  const [period, setPeriod] = useState('all'); // 'all' | 'this_month' | 'last_month' | '3_months' | 'this_year'

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    if (period === 'this_month') {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return transactions.filter((tx) => {
        const d = new Date(tx.transaction_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    }

    if (period === 'last_month') {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const targetMonth = lastMonthDate.getMonth();
      const targetYear = lastMonthDate.getFullYear();
      return transactions.filter((tx) => {
        const d = new Date(tx.transaction_date);
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      });
    }

    if (period === '3_months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).getTime();
      return transactions.filter((tx) => {
        return new Date(tx.transaction_date).getTime() >= threeMonthsAgo;
      });
    }

    if (period === 'this_year') {
      const currentYear = now.getFullYear();
      return transactions.filter((tx) => {
        return new Date(tx.transaction_date).getFullYear() === currentYear;
      });
    }

    return transactions;
  }, [transactions, period]);

  return (
    <div>
      {/* Header & Period Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800 }}>Reports & Financial Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Visual breakdown of cashflow, spending distribution, and trends
          </p>
        </div>

        {/* Period Selector Tabs (Scrollable on Mobile) */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { id: 'all', label: 'All Time' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: '3_months', label: '3 Months' },
            { id: 'this_year', label: 'This Year' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.8rem',
                background: period === item.id ? 'var(--primary)' : 'transparent',
                color: period === item.id ? '#ffffff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Stat Summary Cards */}
      <StatSummary transactions={filteredTransactions} />

      {/* 2. Charts Row: Income vs Expense & Category Pie */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        <IncomeExpenseChart transactions={filteredTransactions} />
        <CategoryPieChart transactions={filteredTransactions} />
      </div>

      {/* 3. Spending Velocity Trend Chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SpendingTrendChart transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
