import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setMessage('Password reset link sent to your email.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage('Failed to send reset link.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div id="forgotPassword-container">
      <h2>Reset Your Password</h2>
      <div id="forgot-login-box">
        <form onSubmit={handleReset}>
          <label htmlFor="email">Enter your school e-mail</label>
          <input
            type="email"
            id="email"
            placeholder="you@usao.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p id="forgot-msg">{message}</p>}
          <div id="forgot-login-buttons">
            <button type="submit" id="forgot-button1">SEND RESET LINK</button>
            <button id="forgot-button2" onClick={() => navigate('/login')}>CANCEL</button>
          </div>
        </form>
      </div>
      <p>Once submitted, check spam box on your e-mail account<br/> in case you don't see it in your inbox.</p>
    </div>
  );
};

export default ForgotPassword;
