import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {
  FiAlertTriangle,
  FiGlobe,
  FiUsers,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';

import {
  AppContainer, Sidebar, Logo, NavList, NavItem, StyledNavLink, Content
} from './components/styled';

import Dashboard from './components/Dashboard';
import RiskRegister from './components/RiskRegister';
import Suppliers from './components/Suppliers';
import Reports from './components/Reports';
import Settings from './components/Settings';

const App = () => (
    <h1>Hola</h1>
  
);

export default App;