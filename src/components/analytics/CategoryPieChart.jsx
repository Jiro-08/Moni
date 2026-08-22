import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_COLORS = [
  '#f97316', '#eab308', '#14b8a6', '#0284c7', '#6366f1',
  '#ef4444', '#ec4899', '#a855f7', '#3b82f6', '#f43f5e',
  '#10b981', '#64748b'
];

export const CategoryPieChart = ({ transactions }) => {
  const { currency, theme } = useTheme();

  // Aggregate expenses by category
  const expenseMap = {};
  let totalExpense = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      const amount = Number(tx.amount) || 0;
      const catName = tx.category_name || 'Other';
      totalExpense += amount;
      expenseMap[catName] = (expenseMap[catName] || 0) + amount;
    }
  });

  const chartData = Object.keys(expenseMap).map((name, idx) => ({
    name,
    value: expenseMap[name],
    percent: totalExpense > 0 ? Math.round((expenseMap[name] / totalExpense) * 100) : 0,
    color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
  })).sort((a, b) => b.value - a.value);

  const isDark = theme === 'dark';

  if (chartData.length === 0) {
    return (
      <div className="glass-card" style={{ height: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No expense data to display for this period.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Expenses by Category</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Distribution of your spending
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          minHeight: '260px'
        }}
      >
        <div style={{ flex: '1 1 180px', minHeight: '220px', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatCurrency(value, currency)]}
                contentStyle={{
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontSize: '0.85rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown legend */}
        <div
          style={{
            flex: '1 1 180px',
            maxHeight: '220px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            paddingRight: '0.25rem'
          }}
        >
          {chartData.map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                  {item.name}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginLeft: '0.4rem' }}>
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
