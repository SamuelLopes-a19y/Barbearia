import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, Clipboard, ArrowRight, Stethoscope, Pill, Activity } from 'lucide-react';
import '../../styles/ClienteHistory.css';

export const ClienteHistory = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedcliente, setSelectedcliente] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'consulta', 'receita', 'triagem'

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const storedUser = localStorage.getItem('@Barbearia:user');
        const token = storedUser ? JSON.parse(storedUser).token : '';
        const res = await fetch('http://localhost:3001/clientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setClientes(await res.json());
      } catch (error) { console.error(error); }
    };
    fetchClientes();
  }, []);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSelectCliente = async (cliente) => {
    setLoading(true);
    setSelectedcliente(cliente); 
    
    // Pegamos o ID direto do parâmetro 'cliente' que acabou de chegar
    const pId = String(cliente._id || cliente.id);
    console.log("🔎 Buscando histórico para o Paciente ID:", pId);

    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      
      // Busca paralela de Evoluções, Receitas e Triagens
      const [resEvo, resRec, resTri] = await Promise.all([
        fetch('http://localhost:3001/evolucao', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/receitas', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/triagem/medico', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      let combinedHistory = [];

      // Processar Evoluções
      if (resEvo.ok) {
        const evos = await resEvo.json();
        const myEvos = evos
          .filter(e => String(e.id_paci || e.paciente_id || e.id_paciente || '') === pId)
          .map(e => ({ ...e, type: 'consulta', date: e.data}));
        combinedHistory = [...combinedHistory, ...myEvos];
      }

      // Processar Receitas
      if (resRec.ok) {
        const recs = await resRec.json();
        const myRecs = recs
          .filter(e => String(e.id_paci || e.paciente_id || e.id_paciente || '') === pId)
          .map(e => ({ ...e, type: 'receita', date: e.emissao }));
        combinedHistory = [...combinedHistory, ...myRecs];
      }

      // Processar Triagens
      if (resTri.ok) {
        const tris = await resTri.json();
        if (Array.isArray(tris)) {
          const myTris = tris
            .filter(e => String(e.id_paci || e.paciente_id || e.id_paciente || '') === pId)
            .map(e => ({ ...e, type: 'triagem', date: e.data }));
          combinedHistory = [...combinedHistory, ...myTris];
        }
      }

      // Ordenar por data (mais recente primeiro)
      combinedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("✅ Histórico completo:", combinedHistory);
      setHistoryData(combinedHistory);
        
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = filterType === 'all' 
    ? historyData 
    : historyData.filter(item => item.type === filterType);

  return (
    <div className="history-container">
      <div className="page-header">
        <h1>Prontuário e Histórico</h1>
        <p>Histórico clínico completo dos pacientes</p>
      </div>

      <div className="history-layout">
        <aside className="cliente-sidebar card">
          <div className="p-3">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                className="input" 
                placeholder="Nome ou CPF..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          <div className="cliente-list">
            {clientes.filter(p => p.nome?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <div key={p._id || p.id} className={`cliente-list-item ${selectedcliente?._id === p._id ? 'active' : ''}`} onClick={() => handleSelectCliente(p)}>
                <div className="cliente-avatar">{p.nome?.charAt(0)}</div>
                <div className="cliente-info">
                  <p className="name">{p.nome}</p>
                  <p className="cpf">CPF: {p.cpf}</p>
                </div>
                <ArrowRight size={14} />
              </div>
            ))}
          </div>
        </aside>

        <main className="evolution-main">
          {selectedcliente ? (
            <div className="evolution-content">
              {/* Novo Header de Resumo */}
              <div className="cliente-summary-header">
                <div className="summary-info">
                  <h2>{selectedcliente.nome}</h2>
                  <p className="text-muted">CPF: {selectedcliente.cpf}</p>
                </div>
                <div className="summary-badges">
                  <span className="summary-badge">Tipo: {selectedcliente.tipoSang || 'N/A'}</span>
                  <span className="summary-badge">{calculateAge(selectedcliente.dataNasc)} anos</span>
                </div>
              </div>

              {/* Filtros */}
              <div className="history-filters">
                <button className={`filter-chip ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>Todos</button>
                <button className={`filter-chip ${filterType === 'consulta' ? 'active' : ''}`} onClick={() => setFilterType('consulta')}>Consultas</button>
                <button className={`filter-chip ${filterType === 'receita' ? 'active' : ''}`} onClick={() => setFilterType('receita')}>Receitas</button>
                <button className={`filter-chip ${filterType === 'triagem' ? 'active' : ''}`} onClick={() => setFilterType('triagem')}>Triagens</button>
              </div>

              <div className="timeline">
                {loading ? <p>Buscando prontuário completo...</p> : filteredHistory.length === 0 ? (
                  <div className="empty-history card">
                    <Clipboard size={40}/>
                    <p>Nenhum registro encontrado neste filtro.</p>
                  </div>
                ) : (
                  filteredHistory.map((item, i) => (
                    <div key={i} className={`timeline-item ${item.type}`}>                     
                      <div className="evo-date">
                        <Calendar size={14}/> 
                        {item.date 
                          ? new Date(item.date).toLocaleDateString('pt-BR') + ' às ' + new Date(item.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
                          : "Data não registrada"}
                      </div>

                      <div className="timeline-card">
                        <h4>
                          {item.type === 'consulta' ? 'Evolução Médica' : 
                           item.type === 'receita' ? 'Receita Prescrita' : 'Triagem / Sinais Vitais'}
                        </h4>
                        
                        <div className="evo-content">
                          {item.type === 'consulta' && (
                            <>
                              <p><strong>CID:</strong> {item.cid_prin} {item.cid_secun !== 'N/A' && `| ${item.cid_secun}`}</p>
                              <p style={{marginTop: '8px', whiteSpace: 'pre-wrap'}}>{item.resumo}</p>
                            </>
                          )}
                          {item.type === 'receita' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <p><strong>Prescrição:</strong> {item.descricao}</p>
                              <p><strong>Validade:</strong> {item.validade || 'N/A'}</p>
                            </div>
                          )}
                          {item.type === 'triagem' && (
                            <p><strong>Sinais Vitais:</strong> {item.sinais_vitais} | <strong>Peso:</strong> {item.peso}kg | <strong>Classificação:</strong> {item.classificacao}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state-view">
              <FileText size={64}/>
              <p>Selecione um paciente para ver o histórico clínico.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};