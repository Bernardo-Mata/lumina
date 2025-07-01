import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Suppliers from './components/Suppliers';
import Summary from './components/Summary';
import Compilance from './components/Compilance';
import ChatBot from './components/ChatBot';
import Disruption from './components/Disruption';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';
import Maps from './components/Maps'; // Asegúrate de que este componente esté implementado correctamente

import './index.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [llmSimData, setLlmSimData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch insights combinados al cargar o cuando cambia el token
  useEffect(() => {
    const fetchInsightsLLMSim = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/insights-llm-sim', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLlmSimData(data);
        } else {
          setLlmSimData(null);
        }
      } catch (err) {
        setLlmSimData(null);
      }
      setLoading(false);
    };
    fetchInsightsLLMSim();
  }, [token]);

  // Redirección según autenticación
  useEffect(() => {
    if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
      if (window.location.pathname === "/login" || window.location.pathname === "/register") {
        window.location.replace("/summary");
      }
    } else {
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.replace("/login");
      }
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* Login y registro SIN layout */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas CON layout */}
          <Route
            path="/"
            element={
              token ? (
                <MainLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="summary" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Summary
                  loading={loading}
                  llmSimData={llmSimData}
                />
              </div>
            } />
            <Route
              path="dashboard"
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                  <Dashboard
                    data={llmSimData ? llmSimData.dashboard : []}
                    loading={loading}
                  />
                  <Alerts
                    data={llmSimData ? llmSimData.alerts : []}
                    loading={loading}
                  />
                  <Maps />
                  <Suppliers
                    data={llmSimData ? llmSimData.suppliers : []}
                    loading={loading}
                  />
                </div>
              }
            />
            <Route
              path="alerts"
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Alerts
                    data={llmSimData ? llmSimData.alerts : []}
                    loading={loading}
                  />
                </div>
              }
            />
            <Route
              path="suppliers"
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Suppliers
                    data={llmSimData ? llmSimData.suppliers : []}
                    loading={loading}
                  />
                </div>
              }
            />
            <Route path="compliance" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Compilance
                  data={llmSimData ? llmSimData.compliance : []}
                  loading={loading}
                />
              </div>
            } />
            <Route path="chatbot" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ChatBot
                  data={{}}
                  loading={false}
                />
              </div>
            } />
            <Route path="disruption" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Disruption
                  message={
                    llmSimData && llmSimData.disruption && llmSimData.disruption.length > 0
                      ? llmSimData.disruption[llmSimData.disruption.length - 1].summary
                      : undefined
                  }
                />
              </div>
            } />
            {/* IMPLEMENTACIÓN DE MAPS */}
            <Route path="maps" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Maps />
              </div>
            } />
            {/* ...otras rutas si las hay... */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
