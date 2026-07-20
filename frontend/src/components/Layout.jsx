import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Scissors,
  Search,
  LogOut,
  Menu,
  X,
  House,
  Package
} from 'lucide-react';
import '../styles/Layout.css';

export const Sidebar = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const { currentUser, logout } = useApp();

  const getMenuItems = () => {
    const role = currentUser?.role;

    if (role === 'atendente') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Gestão de Usuários', icon: Users },
        { id: 'scheduling', label: 'Agendamentos', icon: Calendar },
        { id: 'store', label: 'Estoque', icon: Package }
      ];
    }

    if (role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Gestão de Usuários', icon: Users },
        { id: 'scheduling', label: 'Agendamentos', icon: Calendar },
        { id: 'history', label: 'Histórico de Clientes', icon: Search },
        { id: 'store', label: 'Estoque', icon: Package }
      ];
    }

    if (role === 'barbeiro') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', label: 'Histórico de Clientes', icon: Search }
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <House size={20} />
            </div>
            <span className="sidebar-brand-text">BARBEARIA</span>
          </div>
          <button
            className="btn-ghost btn-icon sidebar-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={logout}>
            <LogOut />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export const TopBar = ({ onMenuClick }) => {
  const { currentUser } = useApp();

  const getRoleName = (role) => {
    const roles = {
      admin: 'Administrador',
      atendente: 'Atendente',
      barbeiro: 'Barbeiro',
    };
    return roles[role] || role;
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <button
            className="btn-ghost btn-icon topbar-menu-btn"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>
          <div className="topbar-welcome">
            <span className="topbar-welcome-label">Bem-vindo,</span>
            <p className="topbar-welcome-name">{currentUser?.name}</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="topbar-user-info">
            <p className="topbar-user-name">{currentUser?.name}</p>
            <p className="topbar-user-role">
              {currentUser?.role && getRoleName(currentUser.role)}
            </p>
          </div>
          <div className="topbar-avatar">
            {currentUser?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
