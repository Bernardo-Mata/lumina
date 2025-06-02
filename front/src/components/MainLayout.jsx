import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bell, Settings, User, Box, LogOut } from "lucide-react";

function MainLayout({ GenerateButtonWithRoute }) {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
    window.location.reload(); // Opcional: fuerza recarga para limpiar estado
  };

  return (
    <div className="lumina-main-container">
      {/* Floating background elements */}
      <div className="lumina-floating-elements">
        <div className="lumina-floating-element"></div>
        <div className="lumina-floating-element"></div>
        <div className="lumina-floating-element"></div>
      </div>

      {/* Header */}
      <header className="lumina-header">
        <div className="lumina-header-content">
          <div className="lumina-logo-section">
            <div className="lumina-logo-icon">
              <Box size={20} />
            </div>
            <h1 className="lumina-logo-text">Lumina</h1>
          </div>
          <div className="lumina-header-actions">
            
            <div className="lumina-navbar-right">
              {username ? (
                <span className="lumina-navbar-welcome">
                  Welcome, <b>{username}</b>
                </span>
              ) : (
                <span className="lumina-navbar-welcome" style={{ color: "#ffb347" }}>
                  User not logged in
                </span>
              )}
            </div>
            <button className="lumina-icon-btn">
              <Bell size={20} />
            </button>
            <button className="lumina-icon-btn">
              <Settings size={20} />
            </button>
            <button className="lumina-icon-btn lumina-user-btn">
              <User size={20} />
            </button>
            {username && (
              <button
                className="lumina-icon-btn lumina-logout-btn"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="lumina-main-layout">
        {/* Sidebar */}
        <aside className="lumina-sidebar">
          <nav className="lumina-sidebar-nav">
            <ul className="lumina-nav-list">
              <li className="lumina-nav-item">
                <Link to="/summary" className="lumina-nav-link">
                  <span>Summary</span>
                </Link>
              </li>
              <li className="lumina-nav-item">
                <Link to="/dashboard" className="lumina-nav-link">
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="lumina-nav-item">
                <Link to="/alerts" className="lumina-nav-link">
                  <span>Alerts</span>
                </Link>
              </li>
              <li className="lumina-nav-item">
                <Link to="/suppliers" className="lumina-nav-link">
                  <span>Suppliers</span>
                </Link>
              </li>
              <li className="lumina-nav-item">
                <Link to="/compliance" className="lumina-nav-link">
                  <span>Compliance</span>
                </Link>
              </li>
              <li className="lumina-nav-item">
                <Link to="/disruption" className="lumina-nav-link">
                  <span>Disruption</span>
                </Link>
              </li>
              <li className="lumina-nav-item">
                <Link to="/chatbot" className="lumina-nav-link">
                  <span>ChatBot</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lumina-main-content">
          <div className="lumina-navbar">
            <div className="lumina-navbar-left"></div>
          </div>
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .lumina-main-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #0a1929 0%, #1e3a52 50%, #2d5a87 100%);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* Floating background elements */
        .lumina-floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .lumina-floating-element {
          position: absolute;
          background: radial-gradient(circle, rgba(64, 224, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: lumina-float 6s ease-in-out infinite;
        }

        .lumina-floating-element:nth-child(1) {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 80%;
          animation-delay: 0s;
        }

        .lumina-floating-element:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 10%;
          animation-delay: 2s;
        }

        .lumina-floating-element:nth-child(3) {
          width: 100px;
          height: 100px;
          top: 30%;
          left: 50%;
          animation-delay: 4s;
        }

        @keyframes lumina-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Header */
        .lumina-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          position: relative;
          z-index: 1;
        }

        .lumina-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lumina-logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .lumina-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lumina-logoGlow 2s ease-in-out infinite alternate;
          box-shadow: 0 0 20px rgba(64, 224, 255, 0.3);
          color: #0a1929;
        }

        @keyframes lumina-logoGlow {
          0% { box-shadow: 0 0 20px rgba(64, 224, 255, 0.3); }
          100% { box-shadow: 0 0 30px rgba(64, 224, 255, 0.6); }
        }

        .lumina-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 0 10px rgba(64, 224, 255, 0.5);
          margin: 0;
        }

        .lumina-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lumina-icon-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lumina-icon-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: scale(1.1);
        }

        .lumina-user-btn {
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          color: #0a1929;
        }

        .lumina-user-btn:hover {
          background: linear-gradient(135deg, #80ffff 0%, #40e0ff 100%);
        }

        .lumina-logout-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ffb347 100%);
          color: #fff;
          margin-left: 0.5rem;
          transition: background 0.3s, color 0.3s, transform 0.2s;
        }

        .lumina-logout-btn:hover {
          background: linear-gradient(135deg, #ffb347 0%, #ff6b6b 100%);
          color: #fff;
          transform: scale(1.1) rotate(-10deg);
        }

        /* Main Layout */
        .lumina-main-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        /* Sidebar */
        .lumina-sidebar {
          width: 280px;
          background: rgba(10, 25, 41, 0.7);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .lumina-sidebar-nav {
          padding: 1.5rem;
        }

        .lumina-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
        }

        .lumina-nav-item {
          opacity: 0;
          animation: lumina-slideInLeft 0.6s ease forwards;
        }

        .lumina-nav-item:nth-child(1) { animation-delay: 0.1s; }
        .lumina-nav-item:nth-child(2) { animation-delay: 0.2s; }
        .lumina-nav-item:nth-child(3) { animation-delay: 0.3s; }
        .lumina-nav-item:nth-child(4) { animation-delay: 0.4s; }
        .lumina-nav-item:nth-child(5) { animation-delay: 0.5s; }
        .lumina-nav-item:nth-child(6) { animation-delay: 0.6s; }
        .lumina-nav-item:nth-child(7) { animation-delay: 0.7s; }

        @keyframes lumina-slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .lumina-nav-link {
          display: flex;
          align-items: center;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .lumina-nav-link:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          transition: width 0.3s ease;
          z-index: -1;
        }

        .lumina-nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(8px);
        }

        .lumina-nav-link:hover:before {
          width: 4px;
        }

        .lumina-nav-link.active {
          background: rgba(64, 224, 255, 0.1);
          color: #80ffff;
          border-left: 3px solid #40e0ff;
        }

        /* Main Content */
        .lumina-main-content {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          overflow-y: auto;
          position: relative;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .lumina-sidebar {
            width: 100%;
            position: fixed;
            top: 0;
            left: -100%;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
          }

          .lumina-sidebar.open {
            left: 0;
          }

          .lumina-main-content {
            width: 100%;
          }

          .lumina-header-content {
            padding: 0 1rem;
          }

          .lumina-logo-text {
            font-size: 1.25rem;
          }

          .lumina-floating-element {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .lumina-header {
            padding: 0.75rem 1rem;
          }

          .lumina-header-actions {
            gap: 0.25rem;
          }

          .lumina-icon-btn {
            width: 36px;
            height: 36px;
          }
        }

        /* Custom scrollbar */
        .lumina-main-content::-webkit-scrollbar {
          width: 6px;
        }

        .lumina-main-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .lumina-main-content::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #40e0ff 0%, #80ffff 100%);
          border-radius: 3px;
        }

        .lumina-main-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #80ffff 0%, #40e0ff 100%);
        }
      `}</style>
    </div>
  );
}

export default MainLayout;