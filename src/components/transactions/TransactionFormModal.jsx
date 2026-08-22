import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatInputDate } from '../../utils/formatters';
import { Banknote, Smartphone, Building } from 'lucide-react';

export const TransactionFormModal = ({ isOpen, onClose, initialData = null, defaultType = 'expense' }) => {
  const { categories, addTransaction, editTransaction } = useFinance();
  const { currency } = useTheme();

  const [type, setType] = useState(defaultType);
  const [paymentSource, setPaymentSource] = useState('cash');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatInputDate());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter categories dynamically based on type (BR-03)
  const availableCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setPaymentSource(initialData.payment_source || 'cash');
      setCategoryId(initialData.category_id || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setDescription(initialData.description || '');
      setDate(initialData.transaction_date ? formatInputDate(initialData.transaction_date) : formatInputDate());
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setPaymentSource('cash');
      setAmount('');
      setDescription('');
      setDate(formatInputDate());
      setNotes('');
      if (availableCategories.length > 0) {
        setCategoryId(availableCategories[0].id);
      }
    }
    setError('');
  }, [initialData, defaultType, isOpen]);

  // When type changes, ensure valid category is selected
  const handleTypeChange = (newType) => {
    setType(newType);
    const validCats = categories.filter((c) => c.type === newType);
    if (validCats.length > 0) {
      setCategoryId(validCats[0].id);
    } else {
      setCategoryId('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description for this transaction.');
      return;
    }

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type,
        payment_source: paymentSource,
        category_id: categoryId,
        amount: parsedAmount,
        description: description.trim(),
        transaction_date: date,
        notes: notes.trim()
      };

      if (initialData) {
        await editTransaction(initialData.id, payload);
      } else {
        await addTransaction(payload);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              border: '1px solid var(--danger-border)'
            }}
          >
            {error}
          </div>
        )}

        {/* Transaction Type Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem'
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: type === 'expense' ? 'var(--expense)' : 'transparent',
              color: type === 'expense' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: type === 'income' ? 'var(--income)' : 'transparent',
              color: type === 'income' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Income (+)
          </button>
        </div>

        {/* Payment Source / Method (Cash vs E-Wallet vs Bank) */}
        <div className="form-group">
          <label className="form-label">Payment Source / Account</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'cash', label: 'Cash', icon: Banknote, color: '#06b6d4' },
              { id: 'ewallet', label: 'E-Wallet', icon: Smartphone, color: '#8b5cf6' },
              { id: 'bank', label: 'Bank', icon: Building, color: '#3b82f6' }
            ].map((source) => {
              const Icon = source.icon;
              const isSelected = paymentSource === source.id;
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => setPaymentSource(source.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-active)' : 'var(--bg-input)',
                    border: `1px solid ${isSelected ? source.color : 'var(--border-color)'}`,
                    color: isSelected ? source.color : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} />
                  <span>{source.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label className="form-label">Amount ({currency})</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            style={{ fontSize: '1.2rem', fontWeight: 700 }}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="form-select"
            required
          >
            {availableCategories.length === 0 ? (
              <option value="">No categories available for {type}</option>
            ) : (
              availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            placeholder="e.g., Grocery at SM Supermarket, Client Payment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {/* Date Picker */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {/* Optional Notes */}
        <div className="form-group">
          <label className="form-label">Optional Notes</label>
          <textarea
            rows="2"
            placeholder="Additional notes or tags..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-textarea"
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
