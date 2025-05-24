import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Suppliers from './components/Suppliers';
import Summary from './components/Summary';
import RiskScores from './components/RiskScores';
import Compilance from './components/Compilance';
import Reports from './components/Reports';
import { Bell, Settings, User, Home, Map, List, CheckSquare, Shield, Activity, Server, Box, Table } from 'lucide-react';
import { Chart } from 'chart.js';

// Map each route to its API endpoint
const ENDPOINTS = {
  '/dashboard': 'http://127.0.0.1:8000/api/dashboard',
  '/alerts': 'http://127.0.0.1:8000/api/alerts-summary',
  '/suppliers': 'http://127.0.0.1:8000/api/suppliers',
  '/compliance': 'http://127.0.0.1:8000/api/compliance',
  '/reports': 'http://127.0.0.1:8000/api/reports',
  '/risk-scores': 'http://127.0.0.1:8000/api/risk-scores',
  '/summary': 'http://127.0.0.1:8000/api/summary', // <-- Add this line
  // Add more as needed
};

// Custom hook to get current location
function useCurrentPath() {
  const location = useLocation();
  return location.pathname;
}

const App = () => {
  // Store data for each endpoint
  const [data, setData] = useState({});
  // Store loading state for each endpoint
  const [loading, setLoading] = useState({});

  // Fetch data for a specific endpoint
  const handleGenerateInsights = async (endpoint) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(prev => ({ ...prev, [endpoint]: json }));
    } catch (e) {
      setData(prev => ({ ...prev, [endpoint]: { error: 'Error to obtain the insights' } }));
    }
    setLoading(prev => ({ ...prev, [endpoint]: false }));
  };

  function GenerateButtonWithRoute() {
    const path = useCurrentPath();
    const endpoint = ENDPOINTS[path];
    if (!endpoint) return null;
    return (
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        onClick={() => handleGenerateInsights(endpoint)}
        style={{ marginLeft: 16 }}
        disabled={loading[endpoint]}
      >
        {loading[endpoint] ? 'Generating...' : 'Generating insights'}
      </button>
    );
  }

  function getDataForRoute(path) {
    const endpoint = ENDPOINTS[path];
    return data[endpoint];
  }
  function getLoadingForRoute(path) {
    const endpoint = ENDPOINTS[path];
    return loading[endpoint] || false;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-blue shadow-md px-6 py-3 ">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Box className="text-blue-500" size={28} />
              <h1 className="font-bold text-xl text-gray-800">Lumina</h1>
            </div>
            <div className="flex items-center space-x-4">
              <GenerateButtonWithRoute />
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full bg-blue-500 text-white">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden w-full">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link to="/summary" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Home size={18} />
                    <span>Summary</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Table size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/alerts" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <List size={18} />
                    <span>Alerts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Server size={18} />
                    <span>Suppliers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/compliance" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <CheckSquare size={18} />
                    <span>Compliance</span>
                  </Link>
                </li>
                <li>
                  <Link to="/risk-scores" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Shield size={18} />
                    <span>Risk Scores</span>
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Activity size={18} />
                    <span>Reports</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          {/* Main Content */}
          <main className="flex-1 w-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/summary" replace />} />
              <Route
                  path="/summary"
                  element={
                    <Summary
                      data={getDataForRoute('/summary')}
                      loading={getLoadingForRoute('/summary')}
                    />
                  }
                />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    data={getDataForRoute('/dashboard')}
                    loading={getLoadingForRoute('/dashboard')}
                  />
                }
              />
              <Route
                path="/alerts"
                element={
                  <Alerts
                    data={getDataForRoute('/alerts')}
                    loading={getLoadingForRoute('/alerts')}
                  />
                }
              />
              <Route
                path="/suppliers"
                element={
                  <Suppliers
                    data={getDataForRoute('/suppliers')}
                    loading={getLoadingForRoute('/suppliers')}
                  />
                }
              />
              {/* <Route path="/risk-map" element={<RiskMap />} /> */}
              <Route path="/risk-scores" element={
                <RiskScores
                  data={getDataForRoute('/risk-scores')}
                  loading={getLoadingForRoute('/risk-scores')}
                />
              } />
              <Route path="/compliance" element={
                <Compilance
                  data={getDataForRoute('/compliance')}
                  loading={getLoadingForRoute('/compliance')}
                />
              } />
              <Route path="/reports" element={
                <Reports
                  data={getDataForRoute('/reports')}
                  loading={getLoadingForRoute('/reports')}
                />
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
