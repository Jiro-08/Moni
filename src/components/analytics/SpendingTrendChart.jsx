import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SpendingTrendChart = ({ transactions }) => {
  const { currency, theme } = useTheme();

  // Aggregate daily expenses sorted chronologically
  const expenseTransactions = transactions
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

  const dailyMap = {};
  expenseTransactions.forEach((tx) => {
    const d = tx.transaction_date;
    dailyMap[d] = (dailyMap[d] || 0) + (Number(tx.amount) || 0);
  });

  const chartData = Object.keys(dailyMap).map((date) => ({
    date: formatDate(date, 'short'),
    amount: dailyMap[date]
  }));

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="glass-card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Spending Velocity & Trends</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Timeline of your day-to-day expenditure
        </p>
      </div>

      <div style={{ flex: 1, width: '100%' }}>
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <p>No recent expenditure records found.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                tickFormatter={(v) => `${currency}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value, currency), 'Expense']}
                contentStyle={{
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontSize: '0.85rem'
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SpendingTrendChart;
