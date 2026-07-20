import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, Package, Minus } from 'lucide-react';
import '../styles/Store.css';

export const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [atendentes, setAtendentes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    qnt_estoque: 0,
    id_atendente: ''
  });
  
  const [vendaModalOpen, setVendaModalOpen] = useState(false);
  const [selectedProductForVenda, setSelectedProductForVenda] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [vendaData, setVendaData] = useState({ id_cliente: '', quantidade: 1, id_atendente: '' });

  const fetchProducts = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
      const res = await fetch('http://localhost:3001/produtos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return {
        produtos: res.ok ? await res.json() : []
      }
    } catch (error) { console.error("Erro ao buscar produtos:", error); }
  };

  const fetchClientes = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
      const res = await fetch('http://localhost:3001/clientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setClientes(await res.json());
    } catch (error) { console.error("Erro ao buscar clientes:", error); }
  };

  const fetchAtendentes = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
      const res = await fetch('http://localhost:3001/atendentes', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      return {
        atendentes: res.ok ? await res.json() : []
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data.produtos || []);
    });
    fetchAtendentes().then(data => {
      if (data) setAtendentes(data.atendentes);
    });
  }, [fetchAtendentes]);

  const lowStockProducts = (products || []).filter((prod) => (prod.qnt_estoque || 0) <= 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userObj = JSON.parse(localStorage.getItem('@Barbearia:user'));
    
    const atendenteId = userObj?.role === 'admin' ? formData.id_atendente : (userObj?.id || userObj?._id);

    if (!atendenteId) return alert("Selecione o atendente responsável.");

    const payload = {
      nome: formData.nome,
      marca: formData.marca,
      qnt_estoque: Number(formData.qnt_estoque),
      id_atendente: atendenteId
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct ? { ...payload, _id: editingProduct._id } : payload;
      
      const res = await fetch('http://localhost:3001/produtos', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userObj.token}` },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(editingProduct ? 'Atualizado!' : 'Cadastrado!');
        setIsOpen(false);
        resetForm();
        const data = await fetchProducts();
        setProducts(data.produtos || []);
      } else {
        const result = await res.json();
        alert(`Erro: ${result.erros ? result.erros.join(', ') : result.erro}`);
      }
    } catch (error) { console.error(error); }
  };

  const handleVendaSubmit = async (e) => {
    e.preventDefault();
    const userObj = JSON.parse(localStorage.getItem('@Barbearia:user'));
    
    const atendenteId = userObj?.role === 'admin' ? vendaData.id_atendente : (userObj?.id || userObj?._id);

    if (!atendenteId) return alert("Selecione o atendente que está realizando a venda.");

    const payload = {
      id_produto: selectedProductForVenda._id,
      id_cliente: vendaData.id_cliente,
      id_atendente: atendenteId,
      quantidade: Number(vendaData.quantidade)
    };

    try {
      const res = await fetch('http://localhost:3001/produtos/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userObj.token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Venda realizada com sucesso!');
        setVendaModalOpen(false);
        const data = await fetchProducts();
        setProducts(data.produtos || []);
      } else {
        const result = await res.json();
        alert(`Erro: ${result.erros ? result.erros.join(', ') : result.erro}`);
      }
    } catch (error) { console.error(error); }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', qnt_estoque: 0, id_atendente: '' });
    setEditingProduct(null);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      nome: prod.nome,
      marca: prod.marca,
      qnt_estoque: prod.qnt_estoque || 0,
      id_atendente: prod.id_atendente || ''
    });
    setIsOpen(true);
  };

  const handleVendaClick = (prod) => {
    setSelectedProductForVenda(prod);
    setVendaData({ id_cliente: '', quantidade: 1, id_atendente: '' });
    setVendaModalOpen(true);
    if (clientes.length === 0) fetchClientes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir produto?')) return;
    const token = JSON.parse(localStorage.getItem('@Barbearia:user'))?.token;
    const res = await fetch('http://localhost:3001/produtos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      alert('Produto excluído com sucesso!');
    }
    const data = await fetchProducts();
    setProducts(data.produtos || []);
  };

  return (
    <div>
      <div className="store-header">
        <div className="store-header-content">
          <h1>Estoque de Produtos</h1>
          <p>Gerencie o estoque de produtos da barbearia</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Adicionar Produto
        </button>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="stock-alert">
          <div className="stock-alert-title"><AlertTriangle size={20} /> Alerta de Estoque Baixo</div>
          <p>{lowStockProducts.length} item(s) com estoque crítico.</p>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Total</h3>
            <div className="stat-icon primary"><Package size={16} /></div>
          </div>
          <div className="card-content"><div className="stat-value">{products.length}</div></div>
        </div>
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Crítico</h3>
            <div className="stat-icon success"><AlertTriangle size={16} /></div>
          </div>
          <div className="card-content"><div className="stat-value">{lowStockProducts.length}</div></div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>Produto</th><th>Marca</th><th>Quantidade</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>
            {(products || []).map((prod) => (
              <tr key={prod._id}>
                <td>
                  <div style={{ fontWeight: '500' }}>{prod.nome}</div>
                </td>
                <td>{prod.marca}</td>
                <td>{prod.qnt_estoque || 0}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-ghost btn-icon btn-sell" onClick={() => handleVendaClick(prod)} title="Registrar Venda"><Minus size={16} /></button>
                    <button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(prod)}><Pencil size={16} /></button>
                    <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(prod._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Cadastro/Edição */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => { setIsOpen(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingProduct ? 'Editar' : 'Novo'} Produto</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Seletor para Admin no Cadastro */}
                  {JSON.parse(localStorage.getItem('@Barbearia:user'))?.role === 'admin' && (
                    <div className="form-group form-group-full">
                      <label className="label">Atendente Responsável pelo Estoque</label>
                      <select className="select" value={formData.id_atendente} onChange={e => setFormData({ ...formData, id_atendente: e.target.value })} required>
                        <option value="">Selecione...</option>
                        {atendentes.map(a => <option key={a._id} value={a._id}>{a.nome}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="form-group"><label className="label">Nome</label><input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Marca</label><input className="input" value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Quantidade em Estoque</label><input type="number" className="input" value={formData.qnt_estoque} onChange={e => setFormData({ ...formData, qnt_estoque: parseInt(e.target.value) })} required /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Venda */}
      {vendaModalOpen && (
        <div className="modal-overlay" onClick={() => setVendaModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Registrar Venda</h2></div>
            <div className="modal-body">
              <form onSubmit={handleVendaSubmit}>
                <div className="form-grid">
                  {/* Seletor para Admin na Venda */}
                  {JSON.parse(localStorage.getItem('@Barbearia:user'))?.role === 'admin' && (
                    <div className="form-group form-group-full">
                      <label className="label">Atendente Realizando a Venda</label>
                      <select className="select" value={vendaData.id_atendente} onChange={e => setVendaData({ ...vendaData, id_atendente: e.target.value })} required>
                        <option value="">Selecione...</option>
                        {atendentes.map(a => <option key={a._id} value={a._id}>{a.nome}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="form-group form-group-full"><label className="label">Cliente</label><select className="select" value={vendaData.id_cliente} onChange={e => setVendaData({ ...vendaData, id_cliente: e.target.value })} required><option value="">Selecione...</option>{clientes.map(p => (<option key={p._id} value={p._id}>{p.nome} - {p.cpf}</option>))}</select></div>
                  <div className="form-group"><label className="label">Quantidade</label><input type="number" className="input" min="1" max={selectedProductForVenda?.qnt_estoque || 0} value={vendaData.quantidade} onChange={e => setVendaData({ ...vendaData, quantidade: parseInt(e.target.value) })} required /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setVendaModalOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Confirmar Venda</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
