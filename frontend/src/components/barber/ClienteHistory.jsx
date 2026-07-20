import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, Clipboard, ArrowRight, Scissors, ShoppingCart } from 'lucide-react';
import '../../styles/ClienteHistory.css';

export const ClienteHistory = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedcliente, setSelectedcliente] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');

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

  const getBarbeiroNome = (barbeiroId) => {
    const barbeiro = barbeiros.find(b => String(b._id) === String(barbeiroId));
    return barbeiro ? barbeiro.nome : (barbeiroId || 'N/A');
  };

  const handleSelectCliente = async (cliente) => {
    setLoading(true);
    setSelectedcliente(cliente); 
    
    const pId = String(cliente._id || cliente.id);

    try {
      const storedUser = localStorage.getItem('@Barbearia:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      
      // Buscar barbeiros para resolver nomes
      const resBarb = await fetch('http://localhost:3001/barbeiros', { headers: { 'Authorization': `Bearer ${token}` } });
      if (resBarb.ok) {
        setBarbeiros(await resBarb.json());
      }

      // Buscar agendamentos do cliente
      const resApt = await fetch('http://localhost:3001/agendamento/atendente', { headers: { 'Authorization': `Bearer ${token}` } });
      
      // Buscar vendas do cliente
      const resVendas = await fetch('http://localhost:3001/vendas/produtos', { headers: { 'Authorization': `Bearer ${token}` } });
      
      let combinedHistory = [];

      if (resApt.ok) {
        const agendamentos = await resApt.json();
        const myAgend = (Array.isArray(agendamentos) ? agendamentos : [])
          .filter(e => String(e.id_cliente) === pId)
          .map(e => ({ 
            ...e, 
            type: 'agendamento', 
            date: e.data_criacao || e.data,
            barbeiroNome: getBarbeiroNome(e.id_barbeiro)
          }));
        combinedHistory = [...combinedHistory, ...myAgend];
      }

      if (resVendas.ok) {
        const vendas = await resVendas.json();
        const myVendas = (Array.isArray(vendas) ? vendas : [])
          .filter(v => String(v.id_cliente) === pId)
          .map(v => ({
            ...v,
            type: 'venda',
            date: v.dataVenda || v.data_criacao,
            produtosLista: [{
              nome: v.nome_produto || v.produtoNome || 'Produto',
              quantidade: v.quantidade || 1,
              preco_unitario: v.valor_unitario || (v.valor_total / (v.quantidade || 1)) || 0,
              preco: v.valor_unitario || (v.valor_total / (v.quantidade || 1)) || 0
            }]
          }));
        combinedHistory = [...combinedHistory, ...myVendas];
      }

      combinedHistory.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      setHistoryData(combinedHistory);
        
    } catch (error) {
      console.error("Erro na requisição:", error);
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
        <h1>Histórico de Clientes</h1>
        <p>Veja o histórico de serviços, agendamentos e compras dos clientes</p>
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
              <div className="cliente-summary-header">
                <div className="summary-info">
                  <h2>{selectedcliente.nome}</h2>
                  <p className="text-muted">CPF: {selectedcliente.cpf}</p>
                </div>
                <div className="summary-badges">
                  <span className="summary-badge">Tipo de Cabelo: {selectedcliente.tipoCabelo || 'N/A'}</span>
                  <span className="summary-badge">{calculateAge(selectedcliente.dataNasc)} anos</span>
                </div>
              </div>

              <div className="history-filters">
                <button className={`filter-chip ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>Todos</button>
                <button className={`filter-chip ${filterType === 'agendamento' ? 'active' : ''}`} onClick={() => setFilterType('agendamento')}>Agendamentos</button>
                <button className={`filter-chip ${filterType === 'venda' ? 'active' : ''}`} onClick={() => setFilterType('venda')}>Compras</button>
              </div>

              <div className="timeline">
                {loading ? <p>Buscando histórico...</p> : filteredHistory.length === 0 ? (
                  <div className="empty-history card">
                    <Clipboard size={40}/>
                    <p>Nenhum registro encontrado neste filtro.</p>
                  </div>
                ) : (
                  filteredHistory.map((item, i) => (
                    <div key={i} className={`timeline-item ${item.type}`}>                     
                      <div className="evo-date">
                        {item.type === 'agendamento' ? <Calendar size={14}/> : <ShoppingCart size={14}/>} 
                        {item.date 
                          ? new Date(item.date).toLocaleDateString('pt-BR') + ' às ' + (item.horario || '')
                          : "Data não registrada"}
                      </div>

                      {item.type === 'agendamento' && (
                        <div className="timeline-card">
                          <h4>
                            <Scissors size={14} style={{marginRight: '4px'}} />
                            Agendamento
                          </h4>
                          <div className="evo-content">
                            <p><strong>Cliente:</strong> {selectedcliente.nome}</p>
                            <p><strong>Barbeiro:</strong> {item.barbeiroNome || getBarbeiroNome(item.id_barbeiro)}</p>
                            <p><strong>Status:</strong> {item.status || 'N/A'}</p>
                            {item.descricao && <p style={{marginTop: '8px', whiteSpace: 'pre-wrap'}}>{item.descricao}</p>}
                          </div>
                        </div>
                      )}

                      {item.type === 'venda' && (
                        <div className="timeline-card">
                          <h4>
                            <ShoppingCart size={14} style={{marginRight: '4px'}} />
                            Compra de Produtos
                          </h4>
                          <div className="evo-content">
                            <p><strong>Cliente:</strong> {selectedcliente.nome}</p>
                            <p><strong>Total:</strong> R$ {(item.valor_total || 0).toFixed(2)}</p>
                            {item.produtosLista && item.produtosLista.length > 0 && (
                              <div style={{marginTop: '8px'}}>
                                <strong>Produtos:</strong>
                                <ul style={{listStyle: 'none', padding: '4px 0 0 0'}}>
                                  {item.produtosLista.map((prod, idx) => (
                                    <li key={idx} style={{padding: '2px 0', fontSize: '0.85rem'}}>
                                      • {prod.nome || prod.produtoNome || 'Produto'} - Qtd: {prod.quantidade || 1} - R$ {((prod.preco_unitario || prod.preco || 0) * (prod.quantidade || 1)).toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state-view">
              <FileText size={64}/>
              <p>Selecione um cliente para ver o histórico.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
