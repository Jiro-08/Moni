import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';

export const IncomeExpenseChart = ({ transactions }) => {
  const { currency, theme } = useTheme();

  // Group transactions by month (last 6 months)
  const monthlyDataMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyDataMap[key] = { month: key, income: 0, expense: 0 };
  }

  transactions.forEach((tx) => {
    const d = new Date(tx.transaction_date);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyDataMap[key]) {
      const amount = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        monthlyDataMap[key].income += amount;
      } else if (tx.type === 'expense') {
        monthlyDataMap[key].expense += amount;
      }
    }
  });

  const chartData = Object.values(monthlyDataMap);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="glass-card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Income vs Expenses</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Monthly financial cashflow comparison
        </p>
      </div>

      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke={textColor} fontSize={12} tickLine={false} />
            <YAxis
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `${currency}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            />
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
            <Legend wrapperStyle={{ fontSize: '0.85rem', paddingTop: '10px' }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
