import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // <-- agrega esto
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setMsg("Registered! You can now login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch {
      setLoading(false);
      setError("Registration failed");
    }
  };

  return (
    <div className="lumina-register-container">
      <div className="lumina-background-animation"></div>

      <div className="lumina-register-card">
        <div className="lumina-logo-section">
          <div className="lumina-logo-icon">
            <span className="lumina-logo-symbol">✦</span>
          </div>
          <div className="lumina-logo-text">LUMINA</div>
        </div>

        <h2 className="lumina-form-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="lumina-form">
          <div className="lumina-form-group">
            <input
              className="lumina-form-input"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              type="text"
            />
          </div>
          <div className="lumina-form-group">
            <input
              className="lumina-form-input"
              placeholder="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="lumina-form-group">
            <input
              className="lumina-form-input"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {msg && <div className="lumina-success-message">{msg}</div>}

          {error && <div className="lumina-error-message">{error}</div>}

          <button
            className={`lumina-register-button ${
              loading ? "lumina-loading" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "" : "Registrarse"}
          </button>
        </form>

        <div className="lumina-login-link">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </div>
      </div>

      <style jsx>{`
        .lumina-register-container {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(
            135deg,
            #0a1929 0%,
            #1e3a52 50%,
            #2d5a87 100%
          );
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .lumina-background-animation {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
                circle at 20% 80%,
                rgba(64, 224, 255, 0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 20%,
                rgba(128, 255, 255, 0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 40% 40%,
                rgba(0, 191, 255, 0.05) 0%,
                transparent 50%
              );
          animation: lumina-float 20s ease-in-out infinite;
        }

        @keyframes lumina-float {
          0%,
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        .lumina-register-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
          animation: lumina-slideUp 0.8s ease-out;
        }

        @keyframes lumina-slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lumina-logo-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .lumina-logo-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 10px 30px rgba(64, 224, 255, 0.3);
          animation: lumina-pulse 2s ease-in-out infinite alternate;
        }

        @keyframes lumina-pulse {
          from {
            box-shadow: 0 10px 30px rgba(64, 224, 255, 0.3);
          }
          to {
            box-shadow: 0 15px 40px rgba(64, 224, 255, 0.5);
          }
        }

        .lumina-logo-symbol {
          font-size: 2rem;
          color: #0a1929;
          font-weight: bold;
        }

        .lumina-logo-text {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3rem;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .lumina-form-title {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
          opacity: 0.9;
        }

        .lumina-form {
          width: 100%;
        }

        .lumina-form-group {
          margin-bottom: 1.5rem;
          position: relative;
          transition: transform 0.3s ease;
        }

        .lumina-form-group:focus-within {
          transform: scale(1.02);
        }

        .lumina-form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .lumina-form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .lumina-form-input:focus {
          outline: none;
          border-color: #40e0ff;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(64, 224, 255, 0.3);
          transform: translateY(-2px);
        }

        .lumina-success-message {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #81c784;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .lumina-error-message {
          background: rgba(255, 82, 82, 0.1);
          border: 1px solid rgba(255, 82, 82, 0.3);
          color: #ff8a80;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .lumina-register-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
          position: relative;
          overflow: hidden;
        }

        .lumina-register-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .lumina-register-button:hover::before {
          left: 100%;
        }

        .lumina-register-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(76, 175, 80, 0.4);
        }

        .lumina-register-button:active {
          transform: translateY(-1px);
        }

        .lumina-register-button.lumina-loading {
          pointer-events: none;
          background: linear-gradient(135deg, #666 0%, #888 100%);
        }

        .lumina-register-button.lumina-loading::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid transparent;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: lumina-spin 1s linear infinite;
        }

        @keyframes lumina-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .lumina-login-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .lumina-login-link a {
          color: #40e0ff;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .lumina-login-link a:hover {
          color: #80ffff;
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .lumina-register-card {
            margin: 1rem;
            padding: 2rem;
            max-width: none;
          }

          .lumina-logo-text {
            font-size: 2rem;
            letter-spacing: 0.2rem;
          }

          .lumina-logo-icon {
            width: 60px;
            height: 60px;
          }

          .lumina-logo-symbol {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .lumina-register-card {
            padding: 1.5rem;
          }

          .lumina-form-title {
            font-size: 1.3rem;
          }

          .lumina-form-input {
            padding: 0.875rem 1.25rem;
          }

          .lumina-register-button {
            padding: 0.875rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;