import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DynamicIcon from '../common/DynamicIcon';

export const TransactionList = ({ transactions, onViewDetails, onEditTransaction, onDeleteTransaction }) => {
  const { currency } = useTheme();

  if (transactions.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          No transactions match your current search or filter criteria.
        </p>
      </div>
    );
  }

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
    <>
      {/* 1. Desktop & Tablet Large Table View (Hidden on Small Mobile < 768px) */}
      <div className="glass-card hide-on-mobile" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <th style={{ padding: '0.9rem 1.25rem' }}>Transaction</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Category</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Payment Source</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Date</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Transaction info & icon */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
                            color: isIncome ? 'var(--income)' : 'var(--expense)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <DynamicIcon name={tx.category_icon || 'Tag'} size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            {tx.description}
                          </div>
                          {tx.notes && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {tx.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {tx.category_name}
                      </span>
                    </td>

                    {/* Payment Source */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge ${getSourceBadgeClass(tx.payment_source)}`}>
                        {tx.payment_source || 'cash'}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {formatDate(tx.transaction_date, 'medium')}
                    </td>

                    {/* Amount */}
                    <td
                      style={{
                        padding: '1rem 1.25rem',
                        textAlign: 'right',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: isIncome ? 'var(--income)' : 'var(--expense)'
                      }}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <button
                          onClick={() => onViewDetails(tx)}
                          className="btn btn-ghost btn-icon"
                          title="View Details"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="btn btn-ghost btn-icon"
                          title="Edit Record"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx)}
                          className="btn btn-ghost btn-icon"
                          title="Delete Record"
                          style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile Responsive Card List View (< 768px) */}
      <div className="show-on-mobile" style={{ flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              className="glass-card"
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: `4px solid ${isIncome ? 'var(--income)' : 'var(--expense)'}`
              }}
            >
              {/* Header row: Icon, Description & Amount */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
                      color: isIncome ? 'var(--income)' : 'var(--expense)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <DynamicIcon name={tx.category_icon || 'Tag'} size={19} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tx.description}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {tx.category_name}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: isIncome ? 'var(--income)' : 'var(--expense)'
                    }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              </div>

              {/* Middle row: Badges and Date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span className={`badge ${getSourceBadgeClass(tx.payment_source)}`}>
                  {tx.payment_source || 'cash'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {formatDate(tx.transaction_date, 'medium')}
                </span>
              </div>

              {/* Notes if available */}
              {tx.notes && (
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-input)',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    lineHeight: '1.4'
                  }}
                >
                  {tx.notes}
                </p>
              )}

              {/* Action Buttons Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-color)'
                }}
              >
                <button
                  onClick={() => onViewDetails(tx)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onEditTransaction(tx)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteTransaction(tx)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', color: 'var(--danger)' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TransactionList;
