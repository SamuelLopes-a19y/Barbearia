import React, { useState, useEffect } from 'react';
import { Users, Scissors, Calendar, TrendingUp } from 'lucide-react';
import '../../styles/Dashboard.css';

export const AttendantDashboard = () => {
  const [clients, setclients] = useState([]);
  const [barbers, setbarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const fetchData = async () => {
    const storedUser = localStorage.getItem('@Barbearia:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [clieRes, docRes, aptRes] = await Promise.all([
        fetch('http://localhost:3001/clientes', { headers }),
        fetch('http://localhost:3001/barbeiros', { headers }),
        fetch('http://localhost:3001/agendamento/atendente', { headers })
      ]);

      return {
        clients: clieRes.ok ? await clieRes.json() : [],
        barbers: docRes.ok ? await docRes.json() : [],
        appointment: aptRes.ok ? await aptRes.json() : [],
      }

    } catch (error) { console.error(error); }
  };

  useEffect(() => {

    fetchData().then(data => {
      setclients(data.clients);
      setbarbers(data.barbers);
      setAppointments(data.appointment);
    });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.data === today);
  const stats = [
    {
      title: 'Total de Clientes',
      value: clients.length,
      icon: Users,
      colorClass: 'primary',
    },
    {
      title: 'Barbeiros Disponíveis',
      value: barbers.length,
      icon: Scissors,
      colorClass: 'success',
    },
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.length,
      icon: Calendar,
      colorClass: 'primary',
    },

  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de gestão de barbearia</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="card-header stat-card-header">
                <h3 className="stat-card-title">{stat.title}</h3>
                <div className={`stat-icon ${stat.colorClass}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="card-content">
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Agendamentos de Hoje</h2>
          </div>
          <div className="card-content">
            <div className="appointments-list">
              {todayAppointments.length === 0 ? (
                <p className="empty-state">
                  Nenhum agendamento para hoje
                </p>
              ) : (
                todayAppointments.slice(0, 5).map((apt) => {
                  const client = clients.find((p) => p._id === apt.id_cliente);
                  const barber = barbers.find((d) => d._id === apt.id_barbeiro);
                  const isCompleted = apt.status === "Agendado";
                  return (
                    <div key={apt._id} className="appointment-item">
                      <div className="appointment-info">
                        <p style={{ fontWeight: '600', color: '#ffffff' }}>{client?.nome || 'Cliente'}</p>
                        <p style={{ fontSize: '0.85rem', color: '#999' }}>{barber?.nome || 'Barbeiro'}</p>
                      </div>
                      <div className="appointment-time">
                        <p>{apt.horario} às {apt.horarioFim}</p>
                        {/* Ajuste das cores e texto conforme o booleano real */}
                        <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`}>
                          {isCompleted ? 'Agendado' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Clientes Recentes</h2>
          </div>
          <div className="card-content">
            <div className="appointments-list">
              {clients.slice(0, 5).map((client) => (
                <div key={client._id} className="client-item">
                  <div className="client-avatar">
                    {client?.nome?.charAt(0) || '?'}
                  </div>
                  <div className="client-info">
                    <p>{client?.nome || 'Nome indisponível'}</p>
                    <p>{client?.cpf || 'CPF indisponível'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
