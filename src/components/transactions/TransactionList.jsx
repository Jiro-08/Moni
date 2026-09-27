import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight, ArrowRightLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { isTransferTransaction } from '../../utils/calculations';
import DynamicIcon from '../common/DynamicIcon';

export const TransactionList = ({
  transactions,
  onViewDetails,
  onEditTransaction,
  onDeleteTransaction,
  pageSize = 5
}) => {
  const { currency } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const tableTopRef = useRef(null);

  // Reset to first page when the transactions list changes (due to filtering, searching, or adding)
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length, transactions[0]?.id]);

  if (transactions.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          No transactions match your current search or filter criteria.
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, transactions.length);
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (tableTopRef.current) {
      tableTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
    <div ref={tableTopRef}>
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
              {currentTransactions.map((tx) => {
                const isTransfer = isTransferTransaction(tx);
                const isIncome = tx.type === 'income';

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
                            <DynamicIcon name={tx.category_icon || (isIncome ? 'TrendingUp' : 'Tag')} size={18} />
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {tx.description}
                            </span>
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
                        {tx.category_name || (isTransfer ? 'Transfer' : 'General')}
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
                        color: amountColor
                      }}
                    >
                      {amountPrefix}{formatCurrency(tx.amount, currency)}
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
                        {onEditTransaction && !isTransfer && (
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="btn btn-ghost btn-icon"
                            title="Edit Record"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <Edit2 size={15} />
                          </button>
                        )}
                        {onDeleteTransaction && (
                          <button
                            onClick={() => onDeleteTransaction(tx)}
                            className="btn btn-ghost btn-icon"
                            title="Delete Record"
                            style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'var(--bg-input)',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{startIndex + 1}–{endIndex}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{transactions.length}</strong> transactions
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                opacity: safePage === 1 ? 0.4 : 1,
                cursor: safePage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {/* Page number pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .map((page, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span style={{ padding: '0 0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`btn btn-sm ${page === safePage ? 'btn-primary' : 'btn-ghost'}`}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          padding: '0 0.5rem',
                          fontSize: '0.8rem',
                          fontWeight: page === safePage ? 700 : 500
                        }}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                opacity: safePage === totalPages ? 0.4 : 1,
                cursor: safePage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Mobile Responsive Card List View (< 768px) */}
      <div className="show-on-mobile" style={{ flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        {currentTransactions.map((tx) => {
          const isTransfer = isTransferTransaction(tx);
          const isIncome = tx.type === 'income';

          let iconBg = 'var(--expense-bg)';
          let iconColor = 'var(--expense)';
          let amountColor = 'var(--expense)';
          let amountPrefix = '-';
          let borderAccent = 'var(--expense)';

          if (isTransfer) {
            iconBg = 'rgba(99, 102, 241, 0.14)';
            iconColor = '#6366f1';
            amountColor = isIncome ? '#06b6d4' : '#6366f1';
            amountPrefix = isIncome ? '+' : '-';
            borderAccent = '#6366f1';
          } else if (isIncome) {
            iconBg = 'var(--income-bg)';
            iconColor = 'var(--income)';
            amountColor = 'var(--income)';
            amountPrefix = '+';
            borderAccent = 'var(--income)';
          }

          return (
            <div
              key={tx.id}
              className="glass-card"
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: `4px solid ${borderAccent}`
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
                      background: iconBg,
                      color: iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isTransfer ? (
                      <ArrowRightLeft size={19} />
                    ) : (
                      <DynamicIcon name={tx.category_icon || (isIncome ? 'TrendingUp' : 'Tag')} size={19} />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {tx.category_name || (isTransfer ? 'Transfer' : 'General')}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: amountColor
                    }}
                  >
                    {amountPrefix}{formatCurrency(tx.amount, currency)}
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
                {onEditTransaction && !isTransfer && (
                  <button
                    onClick={() => onEditTransaction(tx)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                )}
                {onDeleteTransaction && (
                  <button
                    onClick={() => onDeleteTransaction(tx)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Mobile Pagination Card */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{transactions.length}</strong> transactions
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Page {safePage} of {totalPages}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%' }}>
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="btn btn-secondary"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                opacity: safePage === 1 ? 0.4 : 1,
                cursor: safePage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="btn btn-secondary"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                opacity: safePage === totalPages ? 0.4 : 1,
                cursor: safePage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
