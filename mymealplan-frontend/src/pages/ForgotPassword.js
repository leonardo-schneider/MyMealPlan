import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

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
    <div className="side-form">
      <div className="login-box" id="forgot-login-box">
        <h2>Forgot Password</h2>
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
          {message && <p className="forgot-msg">{message}</p>}
          <button type="submit">SEND RESET LINK</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
