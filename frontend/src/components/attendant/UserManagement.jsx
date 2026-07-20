import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import '../../styles/UserManagement.css';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <div>
      <div className="page-header">
        <h1>Gestão de Usuários</h1>
        <p>Gerencie clientes, barbeiros e atendentes</p>
      </div>

      <div className="tabs">
        <div className="tabs-list">
          <button className={`tab-trigger ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>Clientes</button>
          <button className={`tab-trigger ${activeTab === 'barbers' ? 'active' : ''}`} onClick={() => setActiveTab('barbers')}>Barbeiros</button>
          <button className={`tab-trigger ${activeTab === 'receptionists' ? 'active' : ''}`} onClick={() => setActiveTab('receptionists')}>Atendentes</button>
        </div>
        <div className={`tab-content ${activeTab === 'clients' ? 'active' : ''}`}><ClientsTab /></div>
        <div className={`tab-content ${activeTab === 'barbers' ? 'active' : ''}`}><BarbersTab /></div>
        <div className={`tab-content ${activeTab === 'receptionists' ? 'active' : ''}`}><ReceptionistsTab /></div>
      </div>
    </div>
  );
};

/* --- COMPONENTE ENDEREÇO REUTILIZÁVEL --- */
const AddressForm = ({ endereco, onChange }) => (
  <div className="form-group form-group-full">
    <h3 style={{ marginBottom: '15px', color: '#F05A11', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '10px' }}>
      Endereço
    </h3>
    <div className="form-grid">
      <div className="form-group">
        <label className="label">CEP</label>
        <input type="text" className="input" value={endereco.cep} onChange={(e) => onChange({ ...endereco, cep: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Estado (UF)</label>
        <input type="text" className="input" maxLength="2" placeholder="Ex: MG" value={endereco.estado} onChange={(e) => onChange({ ...endereco, estado: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Cidade</label>
        <input type="text" className="input" value={endereco.cidade} onChange={(e) => onChange({ ...endereco, cidade: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Bairro</label>
        <input type="text" className="input" value={endereco.bairro} onChange={(e) => onChange({ ...endereco, bairro: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Rua</label>
        <input type="text" className="input" value={endereco.rua} onChange={(e) => onChange({ ...endereco, rua: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Número</label>
        <input type="text" className="input" value={endereco.numero} onChange={(e) => onChange({ ...endereco, numero: e.target.value })} required />
      </div>
    </div>
  </div>
);

/* --- ABA clientes --- */
const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCliente, seteditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', preferencias: '', dataNasc: '', telefone: '', tipoCabelo: '',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchClients = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
      const res = await fetch('http://localhost:3001/clientes', { headers: { 'Authorization': `Bearer ${token}` } });
      return {
        clients: res.ok ? await res.json() : [],
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchClients().then(data => {
    setClients(data.clients);
  }); }, [fetchClients]);

  const resetForm = () => {
    setFormData({ nome: '', cpf: '', email: '', preferencias: '', dataNasc: '', telefone: '', tipoCabelo: '', endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    seteditingCliente(null);
  };

  const handleEdit = (p) => {
    seteditingCliente(p);
    setFormData({ ...p, dataNasc: p.dataNasc ? p.dataNasc.split('T')[0] : '', preferencias: p.preferencias,tipoCabelo: p.tipoCabelo, endereco: p.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Barbearia:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData };
    try {
      
      if (editingCliente) {
        payload._id = editingCliente._id;
        if (authData?.role === 'admin') payload.id_admin = authData.id;
        else payload.id_atendente = authData.id;
        const res = await fetch('http://localhost:3001/clientes', { method: 'PUT', headers: headers, body: JSON.stringify(payload) });

        alert((await res.json()).mensagem)
        
      } else {
        const res = await fetch('http://localhost:3001/clientes', { method: 'POST', headers: headers, body: JSON.stringify(payload) });
        console.log(await res.json())
      }
      fetchClients(); setIsOpen(false); resetForm();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir cliente?')) return;
    console.log(id)
    const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
    const res = await fetch('http://localhost:3001/clientes', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
    console.log(await res.json())
    fetchClients();
  };

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Cliente</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>CPF</th><th>Email</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{clients.map(p => (<tr key={p._id}><td>{p.nome}</td><td>{p.cpf}</td><td>{p.email}</td><td>
            <div className="table-actions">
<button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(p)} title="Editar"><Pencil size={16} /></button>
              <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(p._id)} title="Excluir"><Trash2 size={16} /></button>
            </div></td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => { setIsOpen(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Nome Completo</label>
                    <input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="label">CPF</label>
                    <input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Email</label>
                    <input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Data Nasc.</label>
                    <input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label className="label">Telefone</label>
                    <input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label className="label">Tipo de cabelo</label>
                    <input className="input" value={formData.tipoCabelo} onChange={e => setFormData({ ...formData, tipoCabelo: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label className="label">Preferencias</label>
                    <textarea 
                      className="input" 
                      value={formData.preferencias} 
                      onChange={e => setFormData({ ...formData, preferencias: e.target.value })} 
                      required 
                      rows={4} 
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>

                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>

                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- ABA BARBEIROSS --- */
const BarbersTab = () => {
  const [barbers, setBarbers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', uf: '', especialidade: '', descricao: '',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchBarbeiros = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
      const res = await fetch('http://localhost:3001/barbeiros', { headers: { 'Authorization': `Bearer ${token}` } });
      return {
        barbers: res.ok ? await res.json() : [],
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchBarbeiros().then(data => {
    setBarbers(data.barbers);
  }); }, [fetchBarbeiros]);

  const handleEdit = (d) => {
    setEditingBarber(d);
    setFormData({ ...d, dataNasc: d.dataNasc ? d.dataNasc.split('T')[0] : '', senha: '', endereco: d.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Barbearia:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData, telefone: Number(formData.telefone) };
    if (editingBarber) {
      payload._id = editingBarber._id;
      if (authData?.role === 'admin') payload.id_admin = authData.id;
      else payload.id_atendente = authData.id;
      const res = await fetch('http://localhost:3001/barbeiros', { method: 'PUT', headers, body: JSON.stringify(payload) });
      console.log(await res.json())
    } else {
      const res = await fetch('http://localhost:3001/barbeiros', { method: 'POST', headers, body: JSON.stringify(payload) });
      console.log(await res.json())
    }
    fetchBarbeiros(); setIsOpen(false); setEditingBarber(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir?')) return;
    const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
    const res = await fetch('http://localhost:3001/barbeiros', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    });

    if(res.ok){
      const mensagem = await res.json();
      alert(mensagem.mensagem)
    }
    fetchBarbeiros();
  };

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Barbeiro</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Especialidade</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{barbers.map(d => (<tr key={d._id}><td>{d.nome}</td><td>{d.email}</td><td>{d.especialidade}</td><td><div className="table-actions"><button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(d)} title="Editar"><Pencil size={16} /></button>
          <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(d._id)} title="Excluir"><Trash2 size={16} /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingBarber ? 'Editar Barbeiro' : 'Novo Barbeiro'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  
                  <div className="form-group">
                    <label className="label">Nome</label>
                    <input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">CPF</label>
                    <input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Email</label>
                    <input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Senha</label>
                  <input className="input" type="password" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required={!editingBarber} autoComplete=""/></div>
                  
                  <div className="form-group">
                    <label className="label">Data Nasc.</label>
                    <input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Telefone</label>
                    <input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Especialidade</label>
                    <textarea 
                      className="input" 
                      value={formData.especialidade} 
                      onChange={e => setFormData({ ...formData, especialidade: e.target.value })} 
                      required 
                      rows={4} 
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Descrição</label>
                    <textarea 
                      className="input" 
                      value={formData.descricao} 
                      onChange={e => setFormData({ ...formData, descricao: e.target.value })} 
                      required 
                      rows={4} 
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>
                  
                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- ABA atendente --- */
const ReceptionistsTab = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', turno: 'Manhã',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchReceptionists = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
      const res = await fetch('http://localhost:3001/atendentes', { headers: { 'Authorization': `Bearer ${token}` } });
      return {
        receptionists: res.ok ? await res.json() : [],
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchReceptionists().then(data => {
    setReceptionists(data.receptionists)
  }); }, [fetchReceptionists]);

  const handleEdit = (r) => {
    setEditingReceptionist(r);
    setFormData({ ...r, dataNasc: r.dataNasc ? r.dataNasc.split('T')[0] : '', senha: '', endereco: r.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Barbearia:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData };
    if (editingReceptionist) {
      payload._id = editingReceptionist._id;
      if (authData?.role === 'admin') payload.id_admin = authData.id;
      else payload.id_atendente = authData.id;
      const res = await fetch('http://localhost:3001/atendentes', { method: 'PUT', headers, body: JSON.stringify(payload) });
      console.log(await res.json())
    } else {
      await fetch('http://localhost:3001/atendentes', { method: 'POST', headers, body: JSON.stringify(payload) });
    }
    fetchReceptionists(); setIsOpen(false); setEditingReceptionist(null);
  };

  const handleDelete = async (id) => { 
    if (window.confirm('Excluir?')) { 
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token; 
      await fetch('http://localhost:3001/atendentes', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify({ id: id }) 
      }); 
      fetchReceptionists(); } }

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Atendente</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>CPF</th><th>Turno</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{receptionists.map(r => (<tr key={r._id}><td>{r.nome}</td><td>{r.cpf}</td><td>{r.turno}</td>
          <td><div className="table-actions"><button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(r)} title="Editar"><Pencil size={16} /></button>
          <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(r._id)} title="Excluir"><Trash2 size={16} /></button></div>
          </td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingReceptionist ? 'Editar Atendente' : 'Novo Atendente'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Nome</label><input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">CPF</label><input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Senha</label><input className="input" type="password" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required={!editingReceptionist} /></div>
                  <div className="form-group"><label className="label">Data Nasc.</label><input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Telefone</label><input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Turno</label><select className="select" value={formData.turno} onChange={e => setFormData({ ...formData, turno: e.target.value })}><option value="Manhã">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option></select></div>
                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};