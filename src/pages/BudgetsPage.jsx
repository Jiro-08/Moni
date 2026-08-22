import React, { useState } from 'react';
import { Plus, PiggyBank, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatters';
import { calculateBudgetStatus } from '../utils/calculations';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import BudgetDetailsModal from '../components/budgets/BudgetDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const BudgetsPage = () => {
  const { budgets, transactions, deleteBudget } = useFinance();
  const { currency } = useTheme();

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedStatusInfo, setSelectedStatusInfo] = useState(null);

  const [deletingBudget, setDeletingBudget] = useState(null);

  // Overall calculations across all budgets
  let totalAllocated = 0;
  let totalBudgetSpent = 0;
  let exceededCount = 0;
  let warningCount = 0;

  budgets.forEach((bg) => {
    totalAllocated += Number(bg.amount) || 0;
    const st = calculateBudgetStatus(bg, transactions);
    totalBudgetSpent += st.spent;
    if (st.status === 'exceeded') exceededCount++;
    if (st.status === 'warning') warningCount++;
  });

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (budget, statusInfo) => {
    setSelectedBudget(budget);
    setSelectedStatusInfo(statusInfo);
    setIsDetailsOpen(true);
  };

  const handleDeletePrompt = (budget) => {
    setDeletingBudget(budget);
  };

  const handleConfirmDelete = async () => {
    if (deletingBudget) {
      await deleteBudget(deletingBudget.id);
      setDeletingBudget(null);
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Budget Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Set category limits, monitor spending velocity, and prevent overspending
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
          <Plus size={18} />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Metric Summaries Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '1.75rem' }}>
        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total Budget Limit
          </span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {formatCurrency(totalAllocated, currency)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across all active budgets</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total Spent
          </span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--expense)' }}>
            {formatCurrency(totalBudgetSpent, currency)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {totalAllocated > 0 ? Math.round((totalBudgetSpent / totalAllocated) * 100) : 0}% total allocated
          </span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Budget Warnings
          </span>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              marginTop: '0.35rem',
              color: warningCount > 0 ? 'var(--warning)' : 'var(--text-primary)'
            }}
          >
            {warningCount}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>At 80%+ utilization threshold</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Exceeded Budgets
          </span>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              marginTop: '0.35rem',
              color: exceededCount > 0 ? 'var(--danger)' : 'var(--income)'
            }}
          >
            {exceededCount}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {exceededCount === 0 ? 'All budgets within limit' : 'Over limit limits'}
          </span>
        </div>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <PiggyBank size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Budgets Created Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            Take control of your finances by setting monthly limits on food, transportation, or overall expenses.
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            Create Your First Budget
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <BudgetFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingBudget}
      />

      {/* Details Modal */}
      <BudgetDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        budget={selectedBudget}
        statusInfo={selectedStatusInfo}
        onEdit={handleEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget "${deletingBudget?.name}"?`}
      />
    </div>
  );
};

export default BudgetsPage;
