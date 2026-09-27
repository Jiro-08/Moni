import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Eye, Edit2, Trash2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { isTransferTransaction } from '../../utils/calculations';
import DynamicIcon from '../common/DynamicIcon';

export const RecentTransactions = ({ onNavigateToHistory, onEditTransaction, onViewDetails, onDeleteTransaction }) => {
  const { transactions } = useFinance();
  const { currency } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE) || 1;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const recentList = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Transactions</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            {transactions.length > 0
              ? `Showing ${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, transactions.length)} of ${transactions.length} records`
              : 'Latest financial activities'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Pagination Arrows */}
          {transactions.length > ITEMS_PER_PAGE && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.25rem' }}>
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="btn btn-ghost btn-icon"
                title="Previous 5 transactions"
                style={{
                  width: '30px',
                  height: '30px',
                  opacity: currentPage === 0 ? 0.4 : 1,
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'center' }}>
                {currentPage + 1}/{totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className="btn btn-ghost btn-icon"
                title="Next 5 transactions"
                style={{
                  width: '30px',
                  height: '30px',
                  opacity: currentPage >= totalPages - 1 ? 0.4 : 1,
                  cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {onNavigateToHistory && (
            <button
              onClick={onNavigateToHistory}
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {recentList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>No transactions recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentList.map((tx) => {
            const isTransfer = isTransferTransaction(tx);
            const isIncome = tx.type === 'income';

            // Determine styling based on transfer vs income vs expense
            let iconBg = 'var(--expense-bg)';
            let iconColor = 'var(--expense)';
            let amountColor = 'var(--expense)';
            let amountPrefix = '-';

            if (isTransfer) {
              iconBg = 'rgba(99, 102, 241, 0.14)';
              iconColor = '#6366f1';
              amountColor = isIncome ? '#06b6d4' : '#6366f1';
              amountPrefix = isIncome ? '+' : '-';
            } else if (isIncome) {
              iconBg = 'var(--income-bg)';
              iconColor = 'var(--income)';
              amountColor = 'var(--income)';
              amountPrefix = '+';
            }

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: isTransfer ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid var(--border-color)',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Main row: Icon + Title + Amount */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  {/* Left: Icon & Description */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: iconBg,
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft size={18} />
                      ) : (
                        <DynamicIcon name={tx.category_icon || (isIncome ? 'TrendingUp' : 'ShoppingBag')} size={18} />
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <h4
                          style={{
                            fontSize: '0.925rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={tx.description}
                        >
                          {tx.description}
                        </h4>
                        {isTransfer && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(99, 102, 241, 0.15)',
                              color: '#6366f1',
                              fontWeight: 700
                            }}
                          >
                            Transfer
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>{tx.category_name || (isTransfer ? 'Transfer' : 'General')}</span>
                        <span>•</span>
                        <span>{formatDate(tx.transaction_date, 'short')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: amountColor,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {amountPrefix}{formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                </div>

                {/* Sub row: Source badge & Quick Action buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.45rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className={`badge ${getSourceBadgeClass(tx.payment_source)}`}>
                      {tx.payment_source || 'cash'}
                    </span>
                    {tx.notes && (
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.72rem'
                        }}
                        title={tx.notes}
                      >
                        {tx.notes}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(tx)}
                        className="btn btn-ghost btn-icon"
                        title="View Details"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    {onEditTransaction && !isTransfer && (
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="btn btn-ghost btn-icon"
                        title="Edit Transaction"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {onDeleteTransaction && (
                      <button
                        onClick={() => onDeleteTransaction(tx)}
                        className="btn btn-ghost btn-icon"
                        title="Delete Transaction"
                        style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
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
