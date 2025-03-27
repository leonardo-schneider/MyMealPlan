import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Exemplo: Faz uma requisição POST para o endpoint de autenticação
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: senha }),
      });

      if (!response.ok) {
        // Caso a resposta não seja 200, mostre um erro
        setErro('Credenciais inválidas');
        return;
      }

      const data = await response.json();
      // Supondo que o backend retorne um token se as credenciais forem válidas
      if (data.access && data.refresh) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        navigate('/dashboard');
      } else {
        setErro('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setErro('Ocorreu um erro. Tente novamente.');
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh');
      const response = await fetch('http://localhost:8000/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      const data = await response.json();
      if (data.access) {
        localStorage.setItem('access', data.access);
        console.log('Access token refreshed!');
      } else {
        console.error('Failed to refresh token', data);
      }
    } catch (error) {
      console.error('Refresh token error:', error);
    }
  };
  
  return (
    <div className="container">
      <div className="side-image" />
      <div className="side-form">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
