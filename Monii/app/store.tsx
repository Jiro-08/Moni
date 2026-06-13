import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AccountType = 'Cash' | 'E-Wallet';
type TransactionType = 'expense' | 'income';
export type CurrencyOption = 'USD ($)' | 'NGN (₦)' | 'EUR (€)' | 'PHP (₱)';
export type DateFormatOption = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type LanguageOption = 'English (US)' | 'French (FR)' | 'Spanish (ES)';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  account: AccountType;
  date: string;
  note: string;
}

interface AppStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  currency: CurrencyOption;
  dateFormat: DateFormatOption;
  language: LanguageOption;
  themeMode: 'light' | 'dark' | 'system';
  setCurrency: (value: CurrencyOption) => void;
  setDateFormat: (value: DateFormatOption) => void;
  setLanguage: (value: LanguageOption) => void;
  setThemeMode: (value: 'light' | 'dark' | 'system') => void;
}

const AppContext = createContext<AppStore | undefined>(undefined);

const getDateOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const initialTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Monthly Salary',
    category: 'Salary',
    amount: 4500,
    type: 'income',
    account: 'E-Wallet',
    date: getDateOffset(0),
    note: 'June salary deposit',
  },
  {
    id: '2',
    title: 'Dining Out',
    category: 'Dining',
    amount: -42.5,
    type: 'expense',
    account: 'Cash',
    date: getDateOffset(-1),
    note: 'Dinner with friends',
  },
  {
    id: '3',
    title: 'Uber Trip',
    category: 'Transport',
    amount: -18.2,
    type: 'expense',
    account: 'E-Wallet',
    date: getDateOffset(-2),
    note: 'Ride home',
  },
  {
    id: '4',
    title: 'Personal Care',
    category: 'Personal',
    amount: -65,
    type: 'expense',
    account: 'Cash',
    date: getDateOffset(-3),
    note: 'Gym and self-care',
  },
  {
    id: '5',
    title: 'Allowance',
    category: 'Allowance',
    amount: 120,
    type: 'income',
    account: 'Cash',
    date: getDateOffset(-5),
    note: 'Weekly allowance',
  },
  {
    id: '6',
    title: 'Coffee',
    category: 'Dining',
    amount: -12.5,
    type: 'expense',
    account: 'E-Wallet',
    date: getDateOffset(-6),
    note: 'Morning coffee',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [currency, setCurrency] = useState<CurrencyOption>('USD ($)');
  const [dateFormat, setDateFormat] = useState<DateFormatOption>('DD/MM/YYYY');
  const [language, setLanguage] = useState<LanguageOption>('English (US)');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions((current) => [{ ...transaction, id: Date.now().toString() }, ...current]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      removeTransaction,
      currency,
      dateFormat,
      language,
      themeMode,
      setCurrency,
      setDateFormat,
      setLanguage,
      setThemeMode,
    }),
    [transactions, currency, dateFormat, language, themeMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}
