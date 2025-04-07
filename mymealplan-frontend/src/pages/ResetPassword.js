import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  // Funções para validar cada requisito individual
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[\W_]/.test(password);

  // Senha é válida se tudo for verdadeiro
  const isPasswordValid = isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      alert('Your password does not meet the requirements');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/reset-password/', {
        uid: uid,
        token: token,
        password: password,
      });
      alert('Password reseted succesfully');
      navigate('/login');  // Redireciona para login
    } catch (error) {
      alert('Error defining the password');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Redefinir Senha</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <div style={{ textAlign: 'left', marginBottom: '15px' }}>
        <p>Requirements:</p>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li style={{ color: isLengthValid ? 'green' : 'red' }}>
            {isLengthValid ? '✔' : '✖'} 8 Characters 
          </li>
          <li style={{ color: hasUppercase ? 'green' : 'red' }}>
            {hasUppercase ? '✔' : '✖'} One Uppercase letter
          </li>
          <li style={{ color: hasLowercase ? 'green' : 'red' }}>
            {hasLowercase ? '✔' : '✖'} One Lowercase letter
          </li>
          <li style={{ color: hasNumber ? 'green' : 'red' }}>
            {hasNumber ? '✔' : '✖'} Number
          </li>
          <li style={{ color: hasSpecialChar ? 'green' : 'red' }}>
            {hasSpecialChar ? '✔' : '✖'} Special Character
          </li>
        </ul>
      </div>

      <button type="submit" disabled={!isPasswordValid} style={{ width: '100%', padding: '10px' }}>
        Reset Password
      </button>
    </form>
  );
}

export default ResetPassword;
