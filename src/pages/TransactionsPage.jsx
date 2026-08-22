import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import TransactionFilterBar from '../components/transactions/TransactionFilterBar';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const TransactionsPage = ({ initialSourceFilter = 'all' }) => {
  const { transactions, deleteTransaction } = useFinance();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState(initialSourceFilter);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const descMatch = (tx.description || '').toLowerCase().includes(q);
          const catMatch = (tx.category_name || '').toLowerCase().includes(q);
          const noteMatch = (tx.notes || '').toLowerCase().includes(q);
          if (!descMatch && !catMatch && !noteMatch) return false;
        }

        // Type
        if (selectedType !== 'all' && tx.type !== selectedType) {
          return false;
        }

        // Category
        if (selectedCategory !== 'all' && tx.category_id !== selectedCategory) {
          return false;
        }

        // Payment Source
        if (selectedSource !== 'all' && tx.payment_source !== selectedSource) {
          return false;
        }

        // Month (YYYY-MM)
        if (selectedMonth && tx.transaction_date) {
          const txMonth = tx.transaction_date.substring(0, 7);
          if (txMonth !== selectedMonth) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.transaction_date) - new Date(a.transaction_date);
        }
        if (sortBy === 'oldest') {
          return new Date(a.transaction_date) - new Date(b.transaction_date);
        }
        if (sortBy === 'highest') {
          return Number(b.amount) - Number(a.amount);
        }
        if (sortBy === 'lowest') {
          return Number(a.amount) - Number(b.amount);
        }
        return 0;
      });
  }, [transactions, searchQuery, selectedType, selectedCategory, selectedSource, selectedMonth, sortBy]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleView = (tx) => {
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

  // CSV Export
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID', 'Type', 'Category', 'Description', 'Amount', 'Payment Source', 'Date', 'Notes'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.type,
      `"${(tx.category_name || '').replace(/"/g, '""')}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.amount,
      tx.payment_source || 'cash',
      tx.transaction_date,
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `moni_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Transactions Ledger</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Showing {filteredTransactions.length} of {transactions.length} total records
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
          <Plus size={18} />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* Filter Bar */}
      <TransactionFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onExportCSV={handleExportCSV}
      />

      {/* Transaction List / Table */}
      <TransactionList
        transactions={filteredTransactions}
        onViewDetails={handleView}
        onEditTransaction={handleEdit}
        onDeleteTransaction={handleDeletePrompt}
      />

      {/* Add / Edit Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTransaction}
      />

      {/* Details Modal */}
      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
        onEdit={handleEdit}
        onDelete={handleDeletePrompt}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTx)}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTx?.description}"?`}
      />
    </div>
  );
};

export default TransactionsPage;
