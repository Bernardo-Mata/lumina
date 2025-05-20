import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RiskMap from './components/RiskMap';
import Alerts from './components/Alerts';
import Suppliers from './components/Suppliers';
import RiskScores from './components/RiskScores';
import Compilance from './components/Compilance';
import Reports from './components/Reports';
import { Bell, Settings, User, Home, Map, List, CheckSquare, Shield, Activity, Server, Search, Box, TrendingUp, AlertTriangle, AlertOctagon, AlertCircle, Minimize } from 'lucide-react';

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All Risks');

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Box className="text-blue-500" size={28} />
            <h1 className="font-bold text-xl text-gray-800">AI Supply Chain Risk Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
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
        </header>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/risk-map" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                    <Map size={18} />
                    <span>Risk Map</span>
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
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />}/>
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/risk-scores" element={<RiskScores />} />
              <Route path="/compliance" element={<Compilance />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
