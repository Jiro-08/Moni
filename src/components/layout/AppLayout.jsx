import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const AppLayout = ({ activeTab, setActiveTab, pageTitle, onOpenQuickAdd, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Navigation Sidebar */}
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
    </div>
  );
};

export default AppLayout;
