import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", username);
        navigate("/summary");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch {
      setLoading(false);
      setError("Login failed");
    }
  };

  return (
    <>
      <style>{`
        .login-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          position: relative;
          padding: 16px;
        }
        .login-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2563eb1a 0%, #bfdbfe1a 50%, #2563eb1a 100%);
          pointer-events: none;
          z-index: 0;
        }
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 8px 32px #0001, 0 1.5px 4px #0001;
          border: 1px solid #e5e7eb;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-logo-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          width: 64px;
          height: 64px;
          background: #2563eb;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px #2563eb22;
          margin-bottom: 0.75rem;
        }
        .login-logo-icon {
          color: #fff;
          font-size: 2rem;
          font-weight: bold;
        }
        .login-title {
          font-size: 2rem;
          font-weight: bold;
          color: #2563eb;
          letter-spacing: 0.03em;
          text-shadow: 0 1px 2px #2563eb22;
          margin-bottom: 0.25rem;
        }
        .login-subtitle {
          font-size: 1rem;
          color: #2563eb;
          font-weight: 300;
          opacity: 0.9;
        }
        .login-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .login-form {
          width: 100%;
        }
        .login-field {
          margin-bottom: 1rem;
        }
        .login-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          color: #111827;
          font-size: 1rem;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #2563eb33;
        }
        .login-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          text-align: center;
        }
        .login-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 1px 2px #2563eb22;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .login-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px #2563eb55;
        }
        .login-btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .login-spinner {
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #fff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: login-spin 1s linear infinite;
          vertical-align: middle;
        }
        @keyframes login-spin {
          to { transform: rotate(360deg); }
        }
        .login-links {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1.5rem;
          gap: 0.5rem;
        }
        .login-link {
          color: #2563eb;
          font-size: 0.95rem;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s;
          padding: 0;
        }
        .login-link:hover,
        .login-link:focus {
          color: #1d4ed8;
          outline: none;
        }
        .login-register {
          color: #15803d;
          font-size: 0.95rem;
          font-weight: 500;
          background: none;
          border: none;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-register:hover,
        .login-register:focus {
          background: #bbf7d0;
          outline: none;
        }
        .login-register-underline {
          text-decoration: underline;
        }
      `}</style>
      <div className="login-bg">
        <div className="login-gradient" />
        <div className="login-card">
          <div className="login-logo-block">
            <div className="login-logo">
              <span className="login-logo-icon">✦</span>
            </div>
            <div className="login-title">LUMINA</div>
            <div className="login-subtitle">Supply Chain Intelligence</div>
          </div>
          <h2 className="login-heading">Inicia sesión en tu cuenta</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                className="login-input"
                placeholder="Usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                type="text"
              />
            </div>
            <div className="login-field">
              <label className="login-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                className="login-input"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}
            <button
              className={`login-btn${loading ? " login-btn-disabled" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
          <div className="login-links">
            <button
              className="login-link"
              onClick={e => {
                e.preventDefault();
                alert("Funcionalidad no implementada");
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <button
              className="login-register"
              onClick={e => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              ¿No tienes cuenta? <span className="login-register-underline">Crea una</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;