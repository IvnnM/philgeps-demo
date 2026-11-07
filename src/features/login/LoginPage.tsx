import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { login } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../auth/roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { action } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email, password);
    if (user) {
      action({ type: 'LOGIN', user });
      if (user.role === 'WarehouseAdmin') {
        navigate('/deliveries');
      } else if (user.role === 'Viewer') {
        navigate('/projects');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid username or password!');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header bg-dark text-white">
          <h3 className="mb-0"><i className="bi bi-box-arrow-in-right me-2"></i>PhilGEPS Tracker</h3>
        </div>
        <div className="card-body">
          <p className="text-muted small">Sign in to continue as a demo user</p>
          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@demo.example"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
            </button>
          </form>
          <div className="mt-3 pt-3 border-top">
            <p className="text-muted small mb-2"><b>Demo accounts:</b></p>
            <ul className="list-group list-group-flush small">
              {Object.entries(ROLES).map(([role, data]) => (
                <li key={role} className="list-group-item">
                  <code>{role.toLowerCase()}@demo.example</code> — {data.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
