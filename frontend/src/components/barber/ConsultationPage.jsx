import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import '../../styles/Consultation.css';

export const ConsultationPage = ({ appointmentId, onBack }) => {
  const [appointment, setAppointment] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [selectedBarbeiroId, setSelectedBarbeiroId] = useState('');
  const [loading, setLoading] = useState(true);

  const [servicos, setServicos] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const storedUser = localStorage.getItem('@Barbearia:user');
        const userObj = storedUser ? JSON.parse(storedUser) : null;
        const token = userObj?.token || '';
        const headers = { 'Authorization': `Bearer ${token}` };

        if (userObj?.role === 'admin') {
          const resBarbeiros = await fetch('http://localhost:3001/barbeiros', { headers });
          if (resBarbeiros.ok) setBarbeiros(await resBarbeiros.json());
        } else {
          setSelectedBarbeiroId(userObj?.id || userObj?._id);
        }

        const resApt = await fetch('http://localhost:3001/agendamento/atendente', { headers });
        if (resApt.ok) {
          const apts = await resApt.json();
          const currentApt = apts.find(a => String(a._id) === String(appointmentId));
          setAppointment(currentApt);

          if (currentApt) {
            const clienteId = currentApt.id_cliente;
            const resCliente = await fetch('http://localhost:3001/clientes/buscar?id=' + clienteId, { headers });
            if (resCliente.ok) {
              setCliente(await resCliente.json());
            }
          }
        }
      } catch (error) { console.error(error); } finally { setLoadingData(false); }
    };
    fetchConsultationData();
  }, [appointmentId]);

  const handleCompleteService = async () => {
    const storedUser = localStorage.getItem('@Barbearia:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const token = userObj?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    if (!selectedBarbeiroId) return alert('Por favor, selecione o barbeiro responsável.');
    if (!servicos) return alert('Descreva os serviços realizados!');

    try {
      await fetch('http://localhost:3001/agendamento/atendente', { 
        method: 'PUT', 
        headers, 
        body: JSON.stringify({ 
          id_agend: appointmentId, 
          status: 'Concluído',
          id_barbeiro: selectedBarbeiroId
        }) 
      });
      alert('Serviço finalizado com sucesso!');
      onBack();
    } catch (error) { alert(`Erro: ${error.message}`); }
  };

  if (loadingData) return <div className="p-4">Carregando...</div>;

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <div className="consultation-header-content">
          <h1>Atendimento - {cliente?.nome || 'Cliente'}</h1>
          <p>CPF: {cliente?.cpf}</p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar</button>
      </div>

      <div className="consultation-grid">
        <div className="consultation-main">
          {JSON.parse(localStorage.getItem('@Barbearia:user'))?.role === 'admin' && (
            <div className="card mb-4" style={{ border: '1px solid #ca8a04' }}>
              <div className="card-header"><h2 className="card-title">Responsabilidade Administrativa</h2></div>
              <div className="card-content">
                <label className="label">Barbeiro Responsável pelo Atendimento</label>
                <select className="select" value={selectedBarbeiroId} onChange={(e) => setSelectedBarbeiroId(e.target.value)} required>
                  <option value="">Selecione o barbeiro...</option>
                  {barbeiros.map(d => <option key={d._id} value={d._id}>{d.nome}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="card mb-4">
            <div className="card-header"><h2 className="card-title">Serviço Realizado</h2></div>
            <div className="card-content">
              <label className="label">Tipo de Cabelo</label>
              <p style={{ color: '#999', marginBottom: '1rem' }}>{cliente?.tipoCabelo || 'N/A'}</p>

              <label className="label">Descrição do Serviço *</label>
              <textarea className="textarea" rows="6" value={servicos} onChange={(e) => setServicos(e.target.value)} placeholder="Descreva o corte, serviço ou procedimento realizado..." />

              <label className="label" style={{ marginTop: '1rem' }}>Observações</label>
              <textarea className="textarea" rows="3" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Observações adicionais..." />
            </div>
          </div>
        </div>

        <aside className="consultation-sidebar">
          <div className="card info-card">
            <div className="card-header"><h3 className="card-title">Informações do Cliente</h3></div>
            <div className="card-content">
              <p><strong>Nome:</strong> {cliente?.nome || 'N/A'}</p>
              <p><strong>Telefone:</strong> {cliente?.telefone || 'N/A'}</p>
              <p><strong>Tipo de Cabelo:</strong> {cliente?.tipoCabelo || 'N/A'}</p>
              <p><strong>Preferências:</strong> {cliente?.preferencias || 'Nenhuma'}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="consultation-actions">
        <button className="btn btn-secondary" onClick={onBack}>Cancelar</button>
        <button className="btn btn-success" onClick={handleCompleteService}>Finalizar Atendimento</button>
      </div>
    </div>
  );
};
