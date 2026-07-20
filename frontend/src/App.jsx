import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Login } from '../src/components/Login';
import { Sidebar, TopBar } from '../src/components/Layout';
import { AttendantDashboard } from '../src/components/attendant/Dashboard';
import { UserManagement } from '../src/components/attendant/UserManagement';
import { Scheduling } from '../src/components/attendant/Scheduling';
import { StorePage } from '../src/components/StorePage';
import { ClienteHistory } from '../src/components/barber/ClienteHistory';
import '../src/styles/global.css';
import '../src/styles/App.css';

const AppContent = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Login />;
  }

  const getDefaultPage = () => {
    if (currentUser.role === 'atendente' || currentUser.role === 'admin' || currentUser.role === 'barbeiro') {
      return 'dashboard';
    }
    return 'dashboard';
  };

  const actualPage = currentPage || getDefaultPage();

  const renderPage = () => {
    // Admin pages
    if (currentUser.role === 'admin') {
      switch (actualPage) {
        case 'dashboard':
          return <AttendantDashboard />;
        case 'users':
          return <UserManagement />;
        case 'scheduling':
          return <Scheduling />;
        case 'history':
          return <ClienteHistory/>;
        case 'store':
          return <StorePage />;
        default:
          return <AttendantDashboard />;
      }
    }

    // Atendente pages
    if (currentUser.role === 'atendente') {
      switch (actualPage) {
        case 'dashboard':
          return <AttendantDashboard />;
        case 'users':
          return <UserManagement />;
        case 'scheduling':
          return <Scheduling />;
        case 'store':
          return <StorePage />;
        default:
          return <AttendantDashboard />;
      }
    }

    // Barbeiro pages
    if (currentUser.role === 'barbeiro') {
      switch (actualPage) {
        case 'dashboard':
          return <AttendantDashboard />;
        case 'history':
          return <ClienteHistory />;
        default:
          return <AttendantDashboard />;
      }
    }

    return <AttendantDashboard />;
  };

  return (
    <div className="app-container">
      <Sidebar
        currentPage={actualPage}
        onNavigate={(page) => {
          setCurrentPage(page);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main-wrapper">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-main-content">
          <div className="app-content-container">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
