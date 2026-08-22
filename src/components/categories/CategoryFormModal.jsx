import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from '../../utils/defaultData';
import DynamicIcon from '../common/DynamicIcon';

export const CategoryFormModal = ({ isOpen, onClose, initialData = null, defaultType = 'expense' }) => {
  const { addCategory, editCategory } = useFinance();

  const [name, setName] = useState('');
  const [type, setType] = useState(defaultType);
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#10b981');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || 'expense');
      setIcon(initialData.icon || 'Tag');
      setColor(initialData.color || '#10b981');
    } else {
      setName('');
      setType(defaultType);
      setIcon(defaultType === 'income' ? 'TrendingUp' : 'ShoppingBag');
      setColor('#10b981');
    }
    setError('');
  }, [initialData, defaultType, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a category name.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        icon,
        color
      };

      if (initialData) {
        await editCategory(initialData.id, payload);
      } else {
        await addCategory(payload);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Category' : 'Create New Category'}
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

        {/* Category Type */}
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
            onClick={() => setType('expense')}
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
            Expense Category
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
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
            Income Category
          </button>
        </div>

        {/* Category Name */}
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            placeholder="e.g. Subscriptions, Groceries, Freelance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {/* Color Picker */}
        <div className="form-group">
          <label className="form-label">Select Color</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {AVAILABLE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: color === c ? '3px solid #ffffff' : '2px solid transparent',
                  boxShadow: color === c ? '0 0 8px ' + c : 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Icon Picker */}
        <div className="form-group">
          <label className="form-label">Select Icon</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
              gap: '0.5rem',
              maxHeight: '160px',
              overflowY: 'auto',
              padding: '0.5rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {AVAILABLE_ICONS.map((iconName) => {
              const isSelected = icon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  style={{
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-active)' : 'transparent',
                    border: `1px solid ${isSelected ? color : 'transparent'}`,
                    color: isSelected ? color : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <DynamicIcon name={iconName} size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
