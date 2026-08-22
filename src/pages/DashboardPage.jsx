import React, { useState } from 'react';
import SummaryCards from '../components/dashboard/SummaryCards';
import CashWalletBreakdown from '../components/dashboard/CashWalletBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetOverviewCard from '../components/dashboard/BudgetOverviewCard';
import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle, MinusCircle, PiggyBank } from 'lucide-react';

export const DashboardPage = ({ onNavigateTab, onSelectSourceFilter }) => {
  const { transactions, deleteTransaction } = useFinance();

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const [deletingTx, setDeletingTx] = useState(null);

  const handleOpenAddTx = (type) => {
    setEditingTransaction(null);
    setTxModalType(type);
    setIsTxModalOpen(true);
  };

  const handleEditTx = (tx) => {
    setEditingTransaction(tx);
    setTxModalType(tx.type);
    setIsTxModalOpen(true);
  };

  const handleViewTx = (tx) => {
    setSelectedTransaction(tx);
    setIsDetailsOpen(true);
  };

  const handleDeletePrompt = (tx) => {
    setDeletingTx(tx);
  };

  const handleConfirmDelete = async () => {
    if (deletingTx) {
      await deleteTransaction(deletingTx.id);
      setDeletingTx(null);
    }
  };

  return (
    <div>
      {/* Quick Action Floating / Hero Buttons */}
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Financial Command Center</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Real-time balance, cashflow, and spending limits
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleOpenAddTx('income')}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'var(--income-border)',
              color: 'var(--income)',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <PlusCircle size={16} />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => handleOpenAddTx('expense')}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'var(--expense-border)',
              color: 'var(--expense)',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <MinusCircle size={16} />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <PiggyBank size={16} />
            <span>New Budget</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards (Total Balance, Income, Expenses, Remaining Budget) */}
      <SummaryCards />

      {/* 2. Cash vs E-Wallet Breakdown (Objectives 4, 5, 6, 7 & 8) */}
      <CashWalletBreakdown onSelectSourceFilter={onSelectSourceFilter} />

      {/* 3. Interactive Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}
      >
        <IncomeExpenseChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>

      {/* 4. Recent Transactions & Budget Overview Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <RecentTransactions
          onNavigateToHistory={() => onNavigateTab('transactions')}
          onEditTransaction={handleEditTx}
          onViewDetails={handleViewTx}
          onDeleteTransaction={handleDeletePrompt}
        />
        <BudgetOverviewCard
          onNavigateToBudgets={() => onNavigateTab('budgets')}
          onOpenAddBudget={() => setIsBudgetModalOpen(true)}
        />
      </div>

      {/* Transaction Add / Edit Modal */}
      <TransactionFormModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        initialData={editingTransaction}
        defaultType={txModalType}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
        onEdit={handleEditTx}
        onDelete={handleDeletePrompt}
      />

      {/* Budget Creation Modal */}
      <BudgetFormModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Deletion Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingTx)}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to permanently delete "${deletingTx?.description}"?`}
      />
    </div>
  );
};

export default DashboardPage;
