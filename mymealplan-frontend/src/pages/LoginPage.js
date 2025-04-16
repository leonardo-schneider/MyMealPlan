import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import uniLogo from "../Images/Assets/uni-logo.webp";
import './LoginPage.css';
import Footer from './components/Footer.js';


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
        setErro('Invalid credentials');
        return;
      }

      const data = await response.json();
      // Supondo que o backend retorne um token se as credenciais forem válidas
      if (data.access && data.refresh) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        navigate('/dashboard');
      } else {
        setErro('Invalid credentials');
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

  const [showPassword, setShowPassword] = useState(false);

  
  return (
  <>
    <div className="container">
      <div className="side-image">
        {/*This is navigation*/}
        <div className="login-navigation">
          <Link to="/home" id="logo">MyMealPlan</Link>
          <ul>            
            <Link to="/home"><li>Home</li></Link>
            <Link to="/about"><li>About</li></Link>
            <Link to="/register"><li>Sign Up</li></Link>
          </ul>
        </div>
        <img src={uniLogo} alt="University Logo" id="uni-logo"/>
      </div>
      <div className="side-form">
        <div className="login-box">
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">School E-mail</label>
            <input
              id = "email"
              type="email"
              placeholder="e.g johndoe1234@usao.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="senha">Password</label>
            <div className="password-wrapper">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="******"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  id="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
          
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <button id="signIn-button"type="submit">SIGN IN NOW</button>
          </form>
          <p id="createAcc">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
    {/* Footer */}
    <Footer />
  </>
  );
};

export default LoginPage;
