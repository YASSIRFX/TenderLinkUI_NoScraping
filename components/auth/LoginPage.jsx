import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import UserService from '../service/UserService';
import { AuthContext } from '../../AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await UserService.login(email, password);
      if (userData.token) {
        login(userData.token, userData.role);
        navigate('/profile');
      } else {
        setError(userData.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay" />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" /> Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <FaLock className="input-icon" /> Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="login-button">
              <FaSignInAlt className="button-icon" /> Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;