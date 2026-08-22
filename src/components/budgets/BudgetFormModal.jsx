import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatInputDate } from '../../utils/formatters';

export const BudgetFormModal = ({ isOpen, onClose, initialData = null }) => {
  const { categories, addBudget, editBudget } = useFinance();
  const { currency } = useTheme();

  const [name, setName] = useState('');
  const [budgetType, setBudgetType] = useState('category'); // 'overall' | 'category'
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setBudgetType(initialData.category_id ? 'category' : 'overall');
      setCategoryId(initialData.category_id || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setStartDate(initialData.start_date ? formatInputDate(initialData.start_date) : '');
      setEndDate(initialData.end_date ? formatInputDate(initialData.end_date) : '');
      setWarningThreshold(initialData.warning_threshold || 80);
    } else {
      // Default dates to current month range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      setName('');
      setBudgetType('category');
      setCategoryId(expenseCategories.length > 0 ? expenseCategories[0].id : '');
      setAmount('');
      setStartDate(formatInputDate(firstDay));
      setEndDate(formatInputDate(lastDay));
      setWarningThreshold(80);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid budget limit greater than 0.');
      return;
    }

    if (!name.trim()) {
      setError('Please provide a name for this budget.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please provide both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        category_id: budgetType === 'category' ? categoryId || null : null,
        amount: parsedAmount,
        start_date: startDate,
        end_date: endDate,
        warning_threshold: parseInt(warningThreshold, 10)
      };

      if (initialData) {
        await editBudget(initialData.id, payload);
      } else {
        await addBudget(payload);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save budget.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Budget' : 'Create Budget Limit'}
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

        {/* Budget Scope (Overall vs Category) */}
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
            onClick={() => setBudgetType('category')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: budgetType === 'category' ? 'var(--primary)' : 'transparent',
              color: budgetType === 'category' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Category Specific
          </button>
          <button
            type="button"
            onClick={() => setBudgetType('overall')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: budgetType === 'overall' ? 'var(--primary)' : 'transparent',
              color: budgetType === 'overall' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Overall Monthly
          </button>
        </div>

        {/* Budget Name */}
        <div className="form-group">
          <label className="form-label">Budget Name</label>
          <input
            type="text"
            placeholder="e.g. Dining Out Budget, Monthly Total Limit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {/* Category Select if Category-specific */}
        {budgetType === 'category' && (
          <div className="form-group">
            <label className="form-label">Assigned Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-select"
              required
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount Limit */}
        <div className="form-group">
          <label className="form-label">Budget Limit ({currency})</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            style={{ fontSize: '1.15rem', fontWeight: 700 }}
            required
          />
        </div>

        {/* Dates Range */}
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Warning Threshold Slider */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label className="form-label">Warning Threshold Alert</label>
            <span style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '0.875rem' }}>
              {warningThreshold}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={warningThreshold}
            onChange={(e) => setWarningThreshold(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--warning)' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            We'll notify you in-app when your spending reaches {warningThreshold}% of this budget.
          </span>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Budget' : 'Create Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetFormModal;
