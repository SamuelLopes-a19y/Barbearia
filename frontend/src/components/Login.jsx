import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Activity } from 'lucide-react';
import '../styles/Login.css';

export const Login = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
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

      const result = await response.json();
      console.log("Resposta do Servidor:", result);

      if (response.ok) {
        // CORREÇÃO AQUI: Adicionando o ID que o backend enviou
        const userData = {
          id: result.usuario._id || result.usuario.id, // Captura o ID do banco
          nome: result.usuario.nome,
          email: email,
          role: role, 
          token: result.token || ''
        };

        console.log("Fazendo login no contexto com:", userData);
        login(userData); 
      } else {
        setErro(result.erro || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      setErro("Erro ao processar login. Verifique o console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            {erro && <p style={{ color: 'red', marginBottom: '10px' }}>{erro}</p>}
            
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="role">Perfil de Acesso</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select"
              >
                <option value="barbeiro">Barbeiro</option>
                <option value="atendente">Atendente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};