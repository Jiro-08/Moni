// ==============================================================================
// Financial Calculations & Aggregations
// ==============================================================================

/**
 * Calculate financial totals (Total Income, Total Expenses, Net Balance)
 * and source breakdowns (Cash, E-Wallet, Bank)
 */
export function calculateFinancialSummary(transactions = []) {
  let totalIncome = 0;
  let totalExpenses = 0;

  let cashIncome = 0;
  let cashExpenses = 0;

  let ewalletIncome = 0;
  let ewalletExpenses = 0;

  let bankIncome = 0;
  let bankExpenses = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const source = tx.payment_source || 'cash';

    if (tx.type === 'income') {
      totalIncome += amount;
      if (source === 'cash') cashIncome += amount;
      else if (source === 'ewallet') ewalletIncome += amount;
      else if (source === 'bank') bankIncome += amount;
    } else if (tx.type === 'expense') {
      totalExpenses += amount;
      if (source === 'cash') cashExpenses += amount;
      else if (source === 'ewallet') ewalletExpenses += amount;
      else if (source === 'bank') bankExpenses += amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;
  const cashBalance = cashIncome - cashExpenses;
  const ewalletBalance = ewalletIncome - ewalletExpenses;
  const bankBalance = bankIncome - bankExpenses;

  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpenses,
    totalBalance,
    cash: { income: cashIncome, expenses: cashExpenses, balance: cashBalance },
    ewallet: { income: ewalletIncome, expenses: ewalletExpenses, balance: ewalletBalance },
    bank: { income: bankIncome, expenses: bankExpenses, balance: bankBalance },
    savingsRate
  };
}

/**
 * Calculate utilization and status for a budget item
 */
export function calculateBudgetStatus(budget, transactions = []) {
  const budgetAmount = Number(budget.amount) || 0;
  if (budgetAmount <= 0) return { spent: 0, remaining: 0, percent: 0, status: 'safe' };

  // Filter matching expenses
  const relevantExpenses = transactions.filter((tx) => {
    if (tx.type !== 'expense') return false;

    // Check category match if category_id is specified
    if (budget.category_id && tx.category_id !== budget.category_id) {
      return false;
    }

    // Check date interval if specified
    if (budget.start_date && budget.end_date) {
      const txDate = new Date(tx.transaction_date).getTime();
      const sDate = new Date(budget.start_date).getTime();
      const eDate = new Date(budget.end_date).getTime();
      if (txDate < sDate || txDate > eDate) return false;
    }

    return true;
  });

  const spent = relevantExpenses.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const remaining = budgetAmount - spent;
  const percent = Math.min(100, Math.round((spent / budgetAmount) * 100));
  const rawPercent = (spent / budgetAmount) * 100;

  const threshold = budget.warning_threshold || 80;

  let status = 'safe';
  if (rawPercent >= 100) {
    status = 'exceeded';
  } else if (rawPercent >= threshold) {
    status = 'warning';
  }

  return {
    spent,
    remaining,
    percent,
    rawPercent: Math.round(rawPercent),
    status,
    transactionCount: relevantExpenses.length
  };
}
