import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Award, Calculator, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';

export const StatSummary = ({ transactions }) => {
  const { currency } = useTheme();

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = {};
  const dates = new Set();

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.transaction_date) dates.add(tx.transaction_date);

    if (tx.type === 'income') {
      totalIncome += amount;
    } else if (tx.type === 'expense') {
      totalExpense += amount;
      const cat = tx.category_name || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    }
  });

  const netBalance = totalIncome - totalExpense;

  // Find top spending category
  let topCategory = 'None';
  let topCategoryAmount = 0;
  Object.keys(categoryTotals).forEach((cat) => {
    if (categoryTotals[cat] > topCategoryAmount) {
      topCategoryAmount = categoryTotals[cat];
      topCategory = cat;
    }
  });

  // Calculate average spending per active day
  const activeDays = Math.max(1, dates.size);
  const avgDailySpending = totalExpense / activeDays;

  return (
    <div className="grid-cols-4" style={{ marginBottom: '1.75rem' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
          <TrendingUp size={16} color="var(--income)" />
          <span>Total Income</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--income)' }}>
          {formatCurrency(totalIncome, currency)}
        </h3>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
          <TrendingDown size={16} color="var(--expense)" />
          <span>Total Expenses</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--expense)' }}>
          {formatCurrency(totalExpense, currency)}
        </h3>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Award size={16} color="var(--warning)" />
          <span>Top Spending Category</span>
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {topCategory}
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {topCategoryAmount > 0 ? formatCurrency(topCategoryAmount, currency) : 'No expenses'}
        </span>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Calculator size={16} color="var(--info)" />
          <span>Daily Avg Spending</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
          {formatCurrency(avgDailySpending, currency)}
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Across {activeDays} recorded days
        </span>
      </div>
    </div>
  );
};

export default StatSummary;
