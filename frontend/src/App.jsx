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
  const [consultationAppointmentId, setConsultationAppointmentId] = useState(null);

  if (!currentUser) {
    return <Login />;
  }

  const getDefaultPage = () => {
    if (currentUser.role === 'atendente' || currentUser.role === 'admin') {
      return 'dashboard';
    }
    return 'dashboard';
  };

  const actualPage = currentPage || getDefaultPage();

  const renderPage = () => {
    // Handle doctor consultation flow
    if (consultationAppointmentId && (currentUser.role === 'barbeiro' || currentUser.role === 'admin')) {
      return (
        <ConsultationPage
          appointmentId={consultationAppointmentId}
          onBack={() => {
            setConsultationAppointmentId(null);
            setCurrentPage('queue');
          }}
        />
      );
    }

        // Nurse pages
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

    if (currentUser.role === 'recepcionista') {
      switch (actualPage) {
        case 'dashboard':
          return <AttendantDashboard />;
        case 'users':
          return <UserManagement />;
        case 'scheduling':
          return <Scheduling />;
        case 'history':
          return <ClienteHistory />;
        default:
          return <AttendantDashboard />;
      }
    }

    // Nurse pages
    if (currentUser.role === 'enfermeiro') {
      switch (actualPage) {
        case 'store':
          return <StorePage />;
        default:
      }
    }

    // Doctor pages
    if (currentUser.role === 'medico') {
      switch (actualPage) {
        case 'consultation':
          return <ConsultationPage
              appointmentId={consultationAppointmentId}
              onBack={() => {
                setConsultationAppointmentId(null);
                setCurrentPage('queue');
              }}
            />
           
        case 'history':
          return <ClienteHistory />;
        default:
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
          setConsultationAppointmentId(null);
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
