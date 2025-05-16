import styled from 'styled-components';
import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import {
  FiAlertTriangle,
  FiGlobe,
  FiList,
  FiUsers,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';
import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
} from 'victory';

// Color Palette (based on the image)
const darkBlue = '#0A192F';
const white = '#FFFFFF';
const mediumBlue = '#307AC1';
const lightBlue = '#ADD8E6';

// Styled Components
const AppContainer = styled.div`
  font-family: sans-serif;
  background-color: ${white};
  min-height: 100vh;
  display: flex;
`;

const Sidebar = styled.aside`
  background-color: ${darkBlue};
  color: ${white};
  width: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${white};
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${mediumBlue};
  }

  &.active {
    background-color: ${lightBlue};
    color: ${darkBlue};
    font-weight: bold;
  }

  svg {
    margin-right: 10px;
  }
`;

const Content = styled.main`
  flex-grow: 1;
  padding: 20px;
`;

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Widget = styled.div`
  background-color: ${white};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RiskScoreWidget = styled(Widget)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AlertListWidget = styled(Widget)`
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 8px 0;
    border-bottom: 1px solid ${lightBlue};
  }
  li:last-child {
    border-bottom: none;
  }
`;

const RiskMapWidget = styled(Widget)`
  /* Placeholder for map integration */
  height: 300px;
  background-color: ${lightBlue};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${darkBlue};
  font-weight: bold;
`;

const SupplierRiskWidget = styled(Widget)`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RiskTrendWidget = styled(Widget)`
  height: 300px;
`;

const RiskRegisterTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 10px;
    border-bottom: 1px solid ${lightBlue};
    text-align: left;
  }
  th {
    background-color: ${darkBlue};
    color: ${white};
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const SupplierTable = styled(RiskRegisterTable)``;

const PromptBox = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: ${lightBlue};
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PromptInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${mediumBlue};
  font-size: 1rem;
`;

const PromptButton = styled.button`
  padding: 8px 16px;
  background: ${mediumBlue};
  color: ${white};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: ${darkBlue};
  }
`;

const PromptResponse = styled.div`
  margin-top: 10px;
  color: ${darkBlue};
  font-size: 1rem;
`;

// Dummy Data (Replace with API calls)
const overallRiskScore = 75;
const activeAlerts = 5;
const topRisks = ['Supplier A Delay', 'Geopolitical Instability', 'Demand Fluctuations'];
const supplierRiskData = [
  { x: 'High', y: 15 },
  { x: 'Medium', y: 35 },
  { x: 'Low', y: 50 },
];
const riskTrendData = [
  { x: 'Jan', y: 60 },
  { x: 'Feb', y: 65 },
  { x: 'Mar', y: 70 },
  { x: 'Apr', y: 75 },
  { x: 'May', y: 72 },
];
const riskRegisterData = [
  { id: 1, name: 'Key Supplier Bankruptcy', category: 'Supplier', likelihood: 'High', impact: 'Critical', level: 'High', status: 'Open' },
  { id: 2, name: 'Port Congestion', category: 'Logistics', likelihood: 'Medium', impact: 'High', level: 'High', status: 'In Progress' },
  { id: 3, name: 'Raw Material Price Spike', category: 'Economic', likelihood: 'Medium', impact: 'Medium', level: 'Medium', status: 'Resolved' },
];
const supplierData = [
  { id: 101, name: 'Supplier A', location: 'USA', riskScore: 80, status: 'Active' },
  { id: 102, name: 'Supplier B', location: 'China', riskScore: 65, status: 'Active' },
  { id: 103, name: 'Supplier C', location: 'Europe', riskScore: 40, status: 'Inactive' },
];

// Components
const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:3000/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.result || 'Respuesta recibida');
    } catch (err) {
      setResponse('Error al enviar el prompt');
    }
    setLoading(false);
  };

  return (
    <>
      <PromptBox as="form" onSubmit={handlePromptSubmit}>
        <PromptInput
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Escribe tu prompt aquí"
        />
        <PromptButton type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </PromptButton>
      </PromptBox>
      {response && <PromptResponse>Respuesta: {response}</PromptResponse>}
      <DashboardContainer>
        <RiskScoreWidget>
          <h2>Overall Risk Score</h2>
          <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar
              value={overallRiskScore}
              text={`${overallRiskScore}%`}
              styles={buildStyles({
                textColor: darkBlue,
                pathColor: overallRiskScore > 70 ? '#d63031' : overallRiskScore > 40 ? '#feca57' : '#2ecc71',
                trailColor: lightBlue,
              })}
            />
          </div>
        </RiskScoreWidget>

        <AlertListWidget>
          <h2>Active Alerts ({activeAlerts})</h2>
          <ul>
            {topRisks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </AlertListWidget>

        <RiskMapWidget>
          {/* Replace with actual map component */}
          Supply Chain Risk Map
        </RiskMapWidget>

        <SupplierRiskWidget>
          <h2>Supplier Risk Distribution</h2>
          <VictoryPie
            data={supplierRiskData}
            colorScale={[lightBlue, mediumBlue, darkBlue]}
            innerRadius={50}
            labelRadius={80}
            style={{ labels: { fontSize: 12, fill: darkBlue } }}
          />
        </SupplierRiskWidget>

        <RiskTrendWidget>
          <h2>Risk Trend Over Time</h2>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis tickValues={riskTrendData.map(d => d.x)} />
            <VictoryAxis dependentAxis />
            <VictoryBar
              data={riskTrendData}
              x="x"
              y="y"
              style={{ data: { fill: mediumBlue } }}
            />
          </VictoryChart>
        </RiskTrendWidget>
      </DashboardContainer>
    </>
  );
};

const RiskRegister = () => (
  <div>
    <h2>Risk Register</h2>
    <RiskRegisterTable>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Likelihood</th>
          <th>Impact</th>
          <th>Level</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {riskRegisterData.map(risk => (
          <tr key={risk.id}>
            <td>{risk.id}</td>
            <td>{risk.name}</td>
            <td>{risk.category}</td>
            <td>{risk.likelihood}</td>
            <td>{risk.impact}</td>
            <td>{risk.level}</td>
            <td>{risk.status}</td>
          </tr>
        ))}
      </tbody>
    </RiskRegisterTable>
  </div>
);

const Suppliers = () => (
  <div>
    <h2>Suppliers</h2>
    <SupplierTable>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Location</th>
          <th>Risk Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {supplierData.map(supplier => (
          <tr key={supplier.id}>
            <td>{supplier.id}</td>
            <td>{supplier.name}</td>
            <td>{supplier.location}</td>
            <td>{supplier.riskScore}</td>
            <td>{supplier.status}</td>
          </tr>
        ))}
      </tbody>
    </SupplierTable>
  </div>
);

const Reports = () => (
  <div>
    <h2>Reports & Analytics</h2>
    {/* Add reporting components here */}
    <p>Placeholder for reports and analytics.</p>
  </div>
);

const Settings = () => (
  <div>
    <h2>Settings</h2>
    {/* Add settings components here */}
    <p>Placeholder for settings.</p>
  </div>
);

const App = () => (
  <Router>
    <AppContainer>
      <Sidebar>
        <Logo>Lumina</Logo>
        <NavList>
          <NavItem>
            <StyledNavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
              <FiGlobe /> Dashboard
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/risks" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FiAlertTriangle /> Risk Register
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/suppliers" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FiUsers /> Suppliers
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FiBarChart2 /> Reports
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FiSettings /> Settings
            </StyledNavLink>
          </NavItem>
        </NavList>
      </Sidebar>
      <Content>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/risks" element={<RiskRegister />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Content>
    </AppContainer>
  </Router>
);

export default App;