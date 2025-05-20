import React from 'react';
import { RiskRegisterTable } from '../App'; // O desde un archivo de styled components

const riskRegisterData = [
  { id: 1, name: 'Key Supplier Bankruptcy', category: 'Supplier', likelihood: 'High', impact: 'Critical', level: 'High', status: 'Open' },
  { id: 2, name: 'Port Congestion', category: 'Logistics', likelihood: 'Medium', impact: 'High', level: 'High', status: 'In Progress' },
  { id: 3, name: 'Raw Material Price Spike', category: 'Economic', likelihood: 'Medium', impact: 'Medium', level: 'Medium', status: 'Resolved' },
];

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

export default RiskRegister;