import React, { useState } from 'react';
import { Plus, Tag, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DynamicIcon from '../components/common/DynamicIcon';

export const CategoriesPage = () => {
  const { categories, transactions, deleteCategory } = useFinance();

  const [activeTab, setActiveTab] = useState('expense'); // 'expense' | 'income'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (cat) => {
    setDeletingCategory(cat);
  };

  const handleConfirmDelete = async () => {
    if (deletingCategory) {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800 }}>Categories Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Customize your income and expense categories with icons and color tags
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      {/* Type Switcher Tabs (Responsive Full Width on Mobile) */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('expense')}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: activeTab === 'expense' ? 'var(--expense)' : 'transparent',
            color: activeTab === 'expense' ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
            textAlign: 'center'
          }}
        >
          Expense ({categories.filter((c) => c.type === 'expense').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('income')}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: activeTab === 'income' ? 'var(--income)' : 'transparent',
            color: activeTab === 'income' ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
            textAlign: 'center'
          }}
        >
          Income ({categories.filter((c) => c.type === 'income').length})
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1rem' }}>
        {filteredCategories.map((cat) => {
          const count = transactions.filter((tx) => tx.category_id === cat.id).length;
          return (
            <div
              key={cat.id}
              className="glass-card glass-card-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: cat.color ? `${cat.color}22` : 'var(--bg-input)',
                    color: cat.color || 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${cat.color ? `${cat.color}44` : 'transparent'}`,
                    flexShrink: 0
                  }}
                >
                  <DynamicIcon name={cat.icon || 'Tag'} size={19} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {count} {count === 1 ? 'record' : 'records'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                <button
                  onClick={() => handleEdit(cat)}
                  className="btn btn-ghost btn-icon"
                  title="Edit Category"
                  style={{ width: '32px', height: '32px' }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDeletePrompt(cat)}
                  className="btn btn-ghost btn-icon"
                  title="Delete Category"
                  style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCategory}
        defaultType={activeTab}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deletingCategory?.name}"? Transactions using this category will remain intact.`}
      />
    </div>
  );
};

export default CategoriesPage;
