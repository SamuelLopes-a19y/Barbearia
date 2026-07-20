import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Scissors, Mail, Lock, User, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import '../styles/Login.css';

export const Login = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('barbeiro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro('');

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          senha: password,
          tipo: role 
        })
      });

      if (!response.ok && response.status >= 500) {
        setErro("Servidor indisponível. Verifique se o backend está rodando.");
        setIsSubmitting(false);
        return;
      }

      const result = await response.json();
      console.log("Resposta do Servidor:", result);

      if (response.ok) {
        const userData = {
          id: result.usuario.id,
          nome: result.usuario.nome,
          email: email,
          role: result.usuario.tipo || role, 
          token: result.token || ''
        };

        console.log("Fazendo login no contexto com:", userData);
        login(userData); 
      } else {
        // Mensagens amigáveis baseadas na resposta do backend
        const msgErro = result.erro || result.mensagem || "Credenciais inválidas";
        setErro(msgErro);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'barbeiro', label: 'Barbeiro', icon: '✂️' },
    { value: 'atendente', label: 'Atendente', icon: '💈' },
    { value: 'admin', label: 'Administrador', icon: '⚙️' }
  ];

  return (
    <div className="login-screen">
      {/* Background decorations */}
      <div className="login-bg-decoration">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="login-wrapper">
        {/* Left panel - branding */}
        <div className="login-brand-panel">
          <div className="brand-content">
            <div className="brand-logo">
              <Scissors size={48} strokeWidth={1.5} />
            </div>
            <h1 className="brand-title">Barbearia</h1>
            <p className="brand-subtitle">Sistema de Gestão</p>
            <div className="brand-divider"></div>
            <p className="brand-tagline">Estilo, tradição e excelência em cada corte</p>
            <div className="brand-features">
              <div className="brand-feature">
                <Sparkles size={14} />
                <span>Gestão de Agendamentos</span>
              </div>
              <div className="brand-feature">
                <Sparkles size={14} />
                <span>Controle de Estoque</span>
              </div>
              <div className="brand-feature">
                <Sparkles size={14} />
                <span>Histórico de Clientes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - login form */}
        <div className="login-form-panel">
          <div className="login-form-content">
            <div className="form-header">
              <h2>Bem-vindo de volta</h2>
              <p>Faça login para acessar o sistema</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {erro && (
                <div className="login-error">
                  <AlertCircle size={16} className="error-icon-svg" />
                  <span>{erro}</span>
                </div>
              )}

              <div className="form-field">
                <label className="field-label">
                  <Mail size={14} />
                  Email
                </label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <Lock size={14} />
                  Senha
                </label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <User size={14} />
                  Perfil de Acesso
                </label>
                <div className="role-selector">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      className={`role-option ${role === r.value ? 'active' : ''}`}
                      onClick={() => setRole(r.value)}
                    >
                      <span className="role-icon">{r.icon}</span>
                      <span className="role-label">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-login"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading">Entrando...</span>
                ) : (
                  <>
                    Entrar
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
