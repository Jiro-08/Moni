import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  PieChart,
  Plus,
  Menu
} from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab, onOpenQuickAdd, onToggleSidebar }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Ledger', icon: Receipt },
    { id: 'add', label: 'Add', isAction: true },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
    { id: 'analytics', label: 'Reports', icon: PieChart }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key="action-add"
                type="button"
                onClick={onOpenQuickAdd}
                className="mobile-fab-btn"
                aria-label="Add transaction"
              >
                <Plus size={22} color="#ffffff" />
              </button>
            );
          }

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
              {isActive && <span className="mobile-nav-active-pill" />}
            </button>
          );
        })}

        {/* Extra toggle for remaining menu tabs */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="mobile-nav-item"
          aria-label="More navigation options"
        >
          <Menu size={19} color="var(--text-muted)" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
