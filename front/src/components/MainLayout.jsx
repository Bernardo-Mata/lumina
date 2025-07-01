import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bell, Settings, User, Box, LogOut } from "lucide-react";

function MainLayout({ GenerateButtonWithRoute }) {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para mostrar/ocultar popover y almacenar alertas
  const [showAlerts, setShowAlerts] = useState(false);
  const [highRiskAlerts, setHighRiskAlerts] = useState([]);

  // Cargar alertas de high risk al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/user_alerts", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(alerts => {
        // Filtra solo las alertas de high risk
        const high = alerts.filter(a => a.priority && a.priority.toLowerCase() === "high");
        setHighRiskAlerts(high);
      })
      .catch(() => setHighRiskAlerts([]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
    window.location.reload();
  };

  // Nav link active
  const navLinkClass = (path) =>
    `main-nav-link${location.pathname.startsWith(path) ? " main-nav-link-active" : ""}`;

  return (
    <>
      <style>{`
        .main-bg {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
        }
        .main-header {
          background: #fff;
          box-shadow: 0 1.5px 4px #0001;
          border-bottom: 1px solid #e5e7eb;
        }
        .main-header-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 72px;
        }
        .main-logo-block {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .main-logo {
          width: 2rem;
          height: 2rem;
          background: #2563eb;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .main-logo-icon {
          color: #fff;
        }
        .main-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2563eb;
          letter-spacing: 0.03em;
        }
        .main-header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .main-header-user {
          font-size: 0.95rem;
          color: #64748b;
        }
        .main-header-user b {
          color: #2563eb;
        }
        .main-header-btn,
        .main-header-btn-blue {
          padding: 0.5rem 1rem;
          background: #fff;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 1px 2px #0001;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .main-header-btn:hover,
        .main-header-btn:focus {
          background: #f3f4f6;
          outline: none;
        }
        .main-header-btn:focus {
          box-shadow: 0 0 0 2px #2563eb55;
        }
        .main-header-btn-blue {
          background: #2563eb;
          color: #fff;
          font-weight: 500;
        }
        .main-header-btn-blue:hover,
        .main-header-btn-blue:focus {
          background: #1d4ed8;
        }
        .main-header-btn-blue:focus {
          box-shadow: 0 0 0 2px #2563eb55;
        }
        .main-alert-popover {
          position: absolute;
          right: 0;
          margin-top: 0.5rem;
          width: 18rem;
          background: #fff;
          border: 1px solid #dbeafe;
          border-radius: 0.75rem;
          box-shadow: 0 8px 32px #0001, 0 1.5px 4px #0001;
          z-index: 50;
          padding: 1rem;
        }
        .main-alert-title {
          font-weight: 600;
          color: #2563eb;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .main-alert-item {
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: #fee2e2;
          border-left: 4px solid #ef4444;
        }
        .main-alert-item-title {
          font-weight: 600;
          color: #dc2626;
          font-size: 0.85rem;
        }
        .main-alert-item-desc {
          font-size: 0.85rem;
          color: #334155;
        }
        .main-alert-more {
          text-align: center;
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 0.5rem;
        }
        .main-sidebar {
          background: #fff;
          border-right: 1px solid #e5e7eb;
          box-shadow: 0 1.5px 4px #0001;
          width: 14rem;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0.5rem;
        }
        .main-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .main-nav-link {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          color: #111827;
          background: none;
          border: none;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .main-nav-link:hover,
        .main-nav-link:focus {
          background: #f3f4f6;
          color: #2563eb;
          outline: none;
        }
        .main-nav-link-active {
          border-bottom: 2px solid #2563eb;
          color: #2563eb;
          background: #fff;
          box-shadow: 0 1px 2px #0001;
        }
        .main-content {
          flex: 1;
          min-width: 0;
          background: #f9fafb;
          overflow-y: auto;
          padding: 2rem 0;
        }
        .main-content-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (max-width: 900px) {
          .main-header-inner, .main-content-inner {
            padding: 0 0.5rem;
          }
          .main-sidebar {
            width: 100px;
            padding: 1rem 0.25rem;
          }
        }
        @media (max-width: 600px) {
          .main-header-inner, .main-content-inner {
            padding: 0 0.25rem;
          }
          .main-sidebar {
            display: none;
          }
        }
      `}</style>
      <div className="main-bg">
        {/* Header */}
        <header className="main-header">
          <div className="main-header-inner">
            <div className="main-logo-block">
              <div className="main-logo">
                <Box size={20} className="main-logo-icon" />
              </div>
              <h1 className="main-title">Lumina</h1>
            </div>
            <div className="main-header-actions">
              <span className="main-header-user">
                {username ? (
                  <>Welcome, <b>{username}</b></>
                ) : (
                  <span style={{ color: "#eab308" }}>User not logged in</span>
                )}
              </span>
              {/* Notificaciones */}
              <div style={{ position: "relative" }}>
                <button
                  className="main-header-btn"
                  title="Notifications"
                  onClick={() => setShowAlerts(v => !v)}
                >
                  <Bell size={22} style={{ color: "#2563eb" }} />
                </button>
                {showAlerts && (
                  <div className="main-alert-popover">
                    <div className="main-alert-title">High Risk Alerts</div>
                    {highRiskAlerts.length === 0 ? (
                      <div className="main-alert-item-desc" style={{ color: "#94a3b8" }}>No high risk alerts</div>
                    ) : (
                      highRiskAlerts.slice(0, 4).map((alert, idx) => (
                        <div key={idx} className="main-alert-item">
                          <div className="main-alert-item-title">{alert.product_type || alert.sku}</div>
                          <div className="main-alert-item-desc">{alert.description}</div>
                        </div>
                      ))
                    )}
                    {highRiskAlerts.length > 4 && (
                      <div className="main-alert-more">
                        +{highRiskAlerts.length - 4} more...
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="main-header-btn" title="Settings">
                <Settings size={22} style={{ color: "#2563eb" }} />
              </button>
              <button className="main-header-btn" title="User">
                <User size={22} style={{ color: "#2563eb" }} />
              </button>
              {username && (
                <button
                  className="main-header-btn-blue"
                  onClick={handleLogout}
                  title="Log out"
                >
                  <LogOut size={18} />
                  LogOut
                </button>
              )}
            </div>
          </div>
        </header>

        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Sidebar */}
          <aside className="main-sidebar">
            <nav>
              <ul className="main-nav-list">
                <li>
                  <Link to="/summary" className={navLinkClass("/summary")}>
                    Summary
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/alerts" className={navLinkClass("/alerts")}>
                    Alerts
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className={navLinkClass("/suppliers")}>
                    Suppliers
                  </Link>
                </li>
                <li>
                  <Link to="/compliance" className={navLinkClass("/compliance")}>
                    Compliance
                  </Link>
                </li>
                <li>
                  <Link to="/disruption" className={navLinkClass("/disruption")}>
                    Disruption
                  </Link>
                </li>
                <li>
                  <Link to="/chatbot" className={navLinkClass("/chatbot")}>
                    ChatBot
                  </Link>
                </li>
                <li>
                  <Link to="/maps" className={navLinkClass("/maps")}>
                    Maps
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="main-content-inner">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default MainLayout;