import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export const AppLayout = ({ activeTab, setActiveTab, pageTitle, onOpenQuickAdd, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Navbar
          title={pageTitle}
          onOpenQuickAdd={onOpenQuickAdd}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="page-body">{children}</div>
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on < 1024px) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={onOpenQuickAdd}
      />
    </div>
  );
};

export default AppLayout;
