# Moni: Personal Budget and Expense Tracker 

A personal finance and expense management web application built with **React** and **Supabase**, designed according to the full project specification.

---

##  Key Features

### 1. Dashboard & Command Center
- **Summary Cards**: Live calculation of Total Balance (`Total Income - Total Expenses`), Total Income, Total Expenses, and Remaining Budget.
- **Cash & E-Wallet Separation**: Independent monitoring and ledger drilldown for **Cash In Hand**, **E-Wallet** (GCash, Maya), and **Bank Accounts**.
- **Interactive Charts**: Monthly Income vs Expense comparison bar chart and Category spending breakdown donut chart.
- **Recent Transactions & Budget Quick View**: Fast status checks and one-click quick action buttons.

### 2.  Full Transaction Ledger
- Record **Income** and **Expenses** with amount, payment source, category, date, description, and notes.
- **Dynamic Category Filtering**: Selecting *Income* shows income categories; selecting *Expense* shows expense categories.
- **Search & Multi-filtering**: Search by keyword/notes, filter by category, payment source (Cash, E-Wallet, Bank), type, and month.
- **Sorting**: Newest, Oldest, Highest amount, and Lowest amount.
- **CSV Export**: 1-click ledger export.

### 3.  Smart Budget Management
- Create **Monthly Overall Budgets** and **Category-Specific Budgets**.
- **Proactive Warnings**: Live threshold tracking (Safe, Warning at 80%+, Exceeded).
- **Budget Drilldown**: View all contributing transactions for each budget period.

### 4.  Reports & Visual Analytics
- Financial summaries (Net balance, Average daily spending, Top spending category).
- Recharts visualizations:
  - **Bar Chart**: Income vs Expenses over time.
  - **Donut Chart**: Category spending distribution with interactive percentages.
  - **Area Chart**: Daily spending velocity timeline.
- Period filters: *All Time*, *This Month*, *Last Month*, *Last 3 Months*, *This Year*.

### 5.  Custom Category Management
- Pre-populated default categories for Income (Salary, Allowance, Freelance, Business, Investment, Gift, Other) and Expense (Food & Dining, Transportation, Housing, Utilities, Education, Healthcare, Shopping, etc.).
- Create custom categories with custom icons and colors.

### 6.  In-App Notifications & Settings
- Real-time budget warning alerts and threshold notifications.
- Currency selection (Default **Philippine Peso ₱**, USD $, EUR €, etc.).
- Dark & Light mode themes with glassmorphic luxury styling.
- Local demo mode out of the box with realistic Philippine Peso data.

---

##  Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

##  Supabase Database Integration

The application is fully functional offline with **Demo / LocalStorage Mode**. To connect your live Supabase database:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the script located at [`supabase/schema.sql`](supabase/schema.sql) (or click **Copy SQL Schema** in the Moni Settings page).
3. Connect either by:
   - Entering your Supabase URL & Anon Key directly inside the **Settings** page in the Moni app, **OR**
   - Creating a `.env` file in the project root:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

---

##  Project Structure

```
Moni(WebApp)/
├── index.html
├── package.json
├── vite.config.js
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema with RLS & Triggers
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css               # Design system tokens, glassmorphism & responsive CSS
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state
│   │   ├── FinanceContext.jsx  # Transactions, budgets, categories, notifications & calculations
│   │   └── ThemeContext.jsx    # Dark/Light theme & currency preferences
│   ├── services/
│   │   ├── supabase.js         # Supabase client initializer
│   │   ├── authService.js      # Auth & demo login service
│   │   ├── transactionService.js
│   │   ├── budgetService.js
│   │   └── categoryService.js
│   ├── components/
│   │   ├── common/             # Modal, DynamicIcon, ConfirmDialog
│   │   ├── layout/             # Navbar, Sidebar, NotificationDropdown, AppLayout
│   │   ├── dashboard/          # SummaryCards, CashWalletBreakdown, RecentTransactions, BudgetOverviewCard
│   │   ├── transactions/       # TransactionList, TransactionFilterBar, TransactionFormModal, TransactionDetailsModal
│   │   ├── budgets/            # BudgetCard, BudgetFormModal, BudgetDetailsModal
│   │   ├── analytics/          # IncomeExpenseChart, CategoryPieChart, SpendingTrendChart, StatSummary
│   │   └── categories/         # CategoryFormModal
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── BudgetsPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── SettingsPage.jsx
│   └── utils/
│       ├── formatters.js       # Currency & date formatters (₱, PHP, YYYY-MM-DD)
│       ├── defaultData.js      # Default categories, icons, colors & sample demo records
│       └── calculations.js     # Balances, savings rate, budget status computations
```
