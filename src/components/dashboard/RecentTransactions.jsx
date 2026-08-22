import React from 'react';
import { ArrowUpRight, ArrowDownRight, Eye, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DynamicIcon from '../common/DynamicIcon';

export const RecentTransactions = ({ onNavigateToHistory, onEditTransaction, onViewDetails, onDeleteTransaction }) => {
  const { transactions } = useFinance();
  const { currency } = useTheme();

  const recentList = transactions.slice(0, 5);

  const getSourceBadgeClass = (source) => {
    switch (source) {
      case 'cash':
        return 'badge-cash';
      case 'ewallet':
        return 'badge-ewallet';
      case 'bank':
        return 'badge-bank';
      default:
        return 'badge-cash';
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Transactions</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Latest financial activities
          </p>
        </div>
        <button
          onClick={onNavigateToHistory}
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}
        >
          <span>View All</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>No transactions recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentList.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Icon & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
                      color: isIncome ? 'var(--income)' : 'var(--expense)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <DynamicIcon name={tx.category_icon || (isIncome ? 'TrendingUp' : 'ShoppingBag')} size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 600 }}>{tx.description}</h4>
                      <span className={`badge ${getSourceBadgeClass(tx.payment_source)}`}>
                        {tx.payment_source}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {tx.category_name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(tx.transaction_date, 'medium')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isIncome ? 'var(--income)' : 'var(--expense)'
                    }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(tx)}
                        className="btn btn-ghost btn-icon"
                        title="View Details"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {onEditTransaction && (
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="btn btn-ghost btn-icon"
                        title="Edit Transaction"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    {onDeleteTransaction && (
                      <button
                        onClick={() => onDeleteTransaction(tx)}
                        className="btn btn-ghost btn-icon"
                        title="Delete Transaction"
                        style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
