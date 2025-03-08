// src/pages/LoginPage.js
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('token/', credentials);
      // Save the tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Navigate to the dashboard or another protected page
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color:'red'}}>{JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input name="username" value={credentials.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={credentials.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
