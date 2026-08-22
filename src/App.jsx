import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import TransactionFormModal from './components/transactions/TransactionFormModal';

const AppContent = () => {
  const { user, loading, guestLogin } = useAuth();

  // Public routing state
  const [publicView, setPublicView] = useState('landing'); // 'landing' | 'login' | 'signup' | 'forgot-password'

  // Authenticated app active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Global Quick Add Modal
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="pulse-dot" style={{ width: '16px', height: '16px' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading Moni Financial Hub...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, render public screens
  if (!user) {
    if (publicView === 'login') {
      return (
        <LoginPage
          onNavigateSignup={() => setPublicView('signup')}
          onNavigateForgotPassword={() => setPublicView('forgot-password')}
          onGuestLogin={guestLogin}
        />
      );
    }
    if (publicView === 'signup') {
      return <SignupPage onNavigateLogin={() => setPublicView('login')} />;
    }
    if (publicView === 'forgot-password') {
      return <ForgotPasswordPage onNavigateLogin={() => setPublicView('login')} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setPublicView('signup')}
        onGuestLogin={guestLogin}
        onLogin={() => setPublicView('login')}
      />
    );
  }

  // Handle drill-down from Dashboard wallet breakdown to transactions ledger
  const handleSelectSourceFilter = (sourceId) => {
    setSourceFilter(sourceId);
    setActiveTab('transactions');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'transactions':
        return 'Transaction Ledger';
      case 'budgets':
        return 'Budget Management';
      case 'analytics':
        return 'Reports & Analytics';
      case 'categories':
        return 'Category Management';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Application Settings';
      default:
        return 'Moni Financial Hub';
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      pageTitle={getPageTitle()}
      onOpenQuickAdd={() => setIsQuickAddOpen(true)}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          onNavigateTab={setActiveTab}
          onSelectSourceFilter={handleSelectSourceFilter}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsPage initialSourceFilter={sourceFilter} />
      )}

      {activeTab === 'budgets' && <BudgetsPage />}

      {activeTab === 'analytics' && <AnalyticsPage />}

      {activeTab === 'categories' && <CategoriesPage />}

      {activeTab === 'profile' && <ProfilePage />}

      {activeTab === 'settings' && <SettingsPage />}

      {/* Global Quick Add Record Modal */}
      <TransactionFormModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </AppLayout>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
