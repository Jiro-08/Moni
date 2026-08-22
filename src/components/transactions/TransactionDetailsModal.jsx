import React from 'react';
import Modal from '../common/Modal';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DynamicIcon from '../common/DynamicIcon';
import { Edit2, Trash2, Calendar, FileText, Wallet, Tag } from 'lucide-react';

export const TransactionDetailsModal = ({ isOpen, onClose, transaction, onEdit, onDelete }) => {
  const { currency } = useTheme();

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div>
        {/* Header Hero Amount */}
        <div
          style={{
            padding: '1.5rem',
            background: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
            border: `1px solid ${isIncome ? 'var(--income-border)' : 'var(--expense-border)'}`,
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: isIncome ? 'var(--income)' : 'var(--expense)'
            }}
          >
            {isIncome ? 'Income Received' : 'Expense Paid'}
          </span>
          <h2
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: isIncome ? 'var(--income)' : 'var(--expense)',
              marginTop: '0.25rem'
            }}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {transaction.description}
          </p>
        </div>

        {/* Breakdown Details List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Tag size={16} />
              <span>Category</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {transaction.category_name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Wallet size={16} />
              <span>Payment Source</span>
            </div>
            <span
              className="badge"
              style={{
                textTransform: 'uppercase',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)'
              }}
            >
              {transaction.payment_source || 'Cash'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Calendar size={16} />
              <span>Transaction Date</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {formatDate(transaction.transaction_date, 'long')}
            </span>
          </div>

          {transaction.notes && (
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <FileText size={16} />
                <span>Notes</span>
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-input)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: '1.5'
                }}
              >
                {transaction.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(transaction);
            }}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              className="btn btn-primary"
            >
              <Edit2 size={16} />
              <span>Edit Record</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
