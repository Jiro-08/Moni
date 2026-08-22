// ==============================================================================
// Default Categories & Sample Financial Data
// ==============================================================================

export const DEFAULT_CATEGORIES = [
  // Income Categories
  { id: 'cat-inc-1', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { id: 'cat-inc-2', name: 'Allowance', type: 'income', icon: 'Gift', color: '#06b6d4' },
  { id: 'cat-inc-3', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3b82f6' },
  { id: 'cat-inc-4', name: 'Business', type: 'income', icon: 'TrendingUp', color: '#8b5cf6' },
  { id: 'cat-inc-5', name: 'Investment', type: 'income', icon: 'PieChart', color: '#ec4899' },
  { id: 'cat-inc-6', name: 'Gift', type: 'income', icon: 'Heart', color: '#f43f5e' },
  { id: 'cat-inc-7', name: 'Other Income', type: 'income', icon: 'PlusCircle', color: '#64748b' },

  // Expense Categories
  { id: 'cat-exp-1', name: 'Food and Dining', type: 'expense', icon: 'Utensils', color: '#f97316' },
  { id: 'cat-exp-2', name: 'Transportation', type: 'expense', icon: 'Car', color: '#eab308' },
  { id: 'cat-exp-3', name: 'Housing', type: 'expense', icon: 'Home', color: '#14b8a6' },
  { id: 'cat-exp-4', name: 'Utilities', type: 'expense', icon: 'Zap', color: '#0284c7' },
  { id: 'cat-exp-5', name: 'Education', type: 'expense', icon: 'BookOpen', color: '#6366f1' },
  { id: 'cat-exp-6', name: 'Healthcare', type: 'expense', icon: 'Activity', color: '#ef4444' },
  { id: 'cat-exp-7', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'cat-exp-8', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#a855f7' },
  { id: 'cat-exp-9', name: 'Subscriptions', type: 'expense', icon: 'CreditCard', color: '#3b82f6' },
  { id: 'cat-exp-10', name: 'Personal Care', type: 'expense', icon: 'Smile', color: '#f43f5e' },
  { id: 'cat-exp-11', name: 'Savings', type: 'expense', icon: 'PiggyBank', color: '#10b981' },
  { id: 'cat-exp-12', name: 'Other Expenses', type: 'expense', icon: 'MoreHorizontal', color: '#64748b' },
];

export const AVAILABLE_ICONS = [
  'Briefcase', 'Gift', 'Laptop', 'TrendingUp', 'PieChart', 'Heart', 'PlusCircle',
  'Utensils', 'Car', 'Home', 'Zap', 'BookOpen', 'Activity', 'ShoppingBag',
  'Film', 'CreditCard', 'Smile', 'PiggyBank', 'Coffee', 'Smartphone', 'Plane',
  'Music', 'Shield', 'Tag', 'DollarSign', 'MoreHorizontal'
];

export const AVAILABLE_COLORS = [
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#eab308',
  '#84cc16', '#14b8a6', '#64748b'
];

// Helper to get relative dates for dynamic realistic timestamps
const today = new Date();
const getPastDateStr = (daysAgo) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SAMPLE_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    payment_source: 'bank',
    category_id: 'cat-inc-1',
    category_name: 'Salary',
    amount: 45000,
    description: 'Monthly Tech Salary',
    notes: 'Direct deposit for the current pay period',
    transaction_date: getPastDateStr(2),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-2',
    type: 'income',
    payment_source: 'ewallet',
    category_id: 'cat-inc-3',
    category_name: 'Freelance',
    amount: 12500,
    description: 'UI Design Freelance Client',
    notes: 'Received via GCash / E-Wallet',
    transaction_date: getPastDateStr(5),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-3',
    type: 'expense',
    payment_source: 'ewallet',
    category_id: 'cat-exp-1',
    category_name: 'Food and Dining',
    amount: 1450,
    description: 'Weekend Grocery & Market',
    notes: 'Supermarket replenishment',
    transaction_date: getPastDateStr(1),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-4',
    type: 'expense',
    payment_source: 'cash',
    category_id: 'cat-exp-2',
    category_name: 'Transportation',
    amount: 320,
    description: 'Commute & Gas Allowance',
    notes: 'Cash payment',
    transaction_date: getPastDateStr(1),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-5',
    type: 'expense',
    payment_source: 'bank',
    category_id: 'cat-exp-3',
    category_name: 'Housing',
    amount: 12000,
    description: 'Apartment Monthly Rental',
    notes: 'Online bank transfer',
    transaction_date: getPastDateStr(10),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-6',
    type: 'expense',
    payment_source: 'ewallet',
    category_id: 'cat-exp-4',
    category_name: 'Utilities',
    amount: 3800,
    description: 'Electricity & Fiber Internet',
    notes: 'Paid via Maya E-Wallet',
    transaction_date: getPastDateStr(8),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-7',
    type: 'expense',
    payment_source: 'cash',
    category_id: 'cat-exp-1',
    category_name: 'Food and Dining',
    amount: 680,
    description: 'Dinner with Colleagues',
    notes: 'Cash dinner bill',
    transaction_date: getPastDateStr(3),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-8',
    type: 'expense',
    payment_source: 'ewallet',
    category_id: 'cat-exp-9',
    category_name: 'Subscriptions',
    amount: 549,
    description: 'Spotify & Cloud Storage',
    notes: 'Auto-debit renewal',
    transaction_date: getPastDateStr(6),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-9',
    type: 'expense',
    payment_source: 'cash',
    category_id: 'cat-exp-10',
    category_name: 'Personal Care',
    amount: 1200,
    description: 'Haircut & Grooming',
    notes: 'Salon cash payment',
    transaction_date: getPastDateStr(7),
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-10',
    type: 'income',
    payment_source: 'cash',
    category_id: 'cat-inc-6',
    category_name: 'Gift',
    amount: 3000,
    description: 'Birthday Cash Gift',
    notes: 'Family gift',
    transaction_date: getPastDateStr(9),
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SAMPLE_BUDGETS = [
  {
    id: 'bg-1',
    name: 'Monthly Overall Budget',
    category_id: null, // overall
    category_name: 'All Expenses',
    amount: 30000,
    start_date: getPastDateStr(20),
    end_date: getPastDateStr(-10),
    warning_threshold: 80,
    created_at: new Date().toISOString()
  },
  {
    id: 'bg-2',
    name: 'Food and Dining Budget',
    category_id: 'cat-exp-1',
    category_name: 'Food and Dining',
    amount: 6000,
    start_date: getPastDateStr(20),
    end_date: getPastDateStr(-10),
    warning_threshold: 80,
    created_at: new Date().toISOString()
  },
  {
    id: 'bg-3',
    name: 'Transportation Budget',
    category_id: 'cat-exp-2',
    category_name: 'Transportation',
    amount: 2500,
    start_date: getPastDateStr(20),
    end_date: getPastDateStr(-10),
    warning_threshold: 80,
    created_at: new Date().toISOString()
  },
  {
    id: 'bg-4',
    name: 'Utilities & Bills',
    category_id: 'cat-exp-4',
    category_name: 'Utilities',
    amount: 4500,
    start_date: getPastDateStr(20),
    end_date: getPastDateStr(-10),
    warning_threshold: 80,
    created_at: new Date().toISOString()
  },
  {
    id: 'bg-5',
    name: 'Entertainment & Leisure',
    category_id: 'cat-exp-8',
    category_name: 'Entertainment',
    amount: 2000,
    start_date: getPastDateStr(20),
    end_date: getPastDateStr(-10),
    warning_threshold: 80,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Budget Alert: Food & Dining',
    message: 'You have used over 35% of your monthly Food and Dining budget.',
    type: 'info',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'notif-2',
    title: 'Monthly Summary Ready',
    message: 'Your personal finance overview for the current billing cycle is looking healthy!',
    type: 'reminder',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
