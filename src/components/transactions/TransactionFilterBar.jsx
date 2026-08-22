import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Download, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const TransactionFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  selectedMonth,
  setSelectedMonth,
  sortBy,
  setSortBy,
  onExportCSV
}) => {
  const { categories } = useFinance();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedSource('all');
    setSelectedMonth('');
    setSortBy('newest');
  };

  const activeFiltersCount =
    (selectedType !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSource !== 'all' ? 1 : 0) +
    (selectedMonth ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0);

  const hasActiveFilters = searchQuery || activeFiltersCount > 0;

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
      {/* Top Search & Filter Toggle Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '0.75rem'
        }}
      >
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search description, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Mobile Filter Expand Button */}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="btn btn-secondary btn-sm show-on-mobile"
          style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}
        >
          <SlidersHorizontal size={15} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.7rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {activeFiltersCount}
            </span>
          )}
          {mobileFiltersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {onExportCSV && (
          <button
            onClick={onExportCSV}
            className="btn btn-secondary btn-sm hide-on-mobile"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        )}

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
          >
            <X size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Controls Grid (Always visible on Desktop, collapsible on Mobile) */}
      <div
        className={mobileFiltersOpen ? 'filters-visible' : 'filters-desktop-only'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        {/* Type Filter */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select"
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.825rem', minHeight: '38px' }}
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.825rem', minHeight: '38px' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>

        {/* Source / Account Filter */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Payment Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="form-select"
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.825rem', minHeight: '38px' }}
          >
            <option value="all">All Sources</option>
            <option value="cash">Cash</option>
            <option value="ewallet">E-Wallet</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-input"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem', minHeight: '38px' }}
          />
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.825rem', minHeight: '38px' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilterBar;
