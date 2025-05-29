export const overallRiskScore = 75;
export const activeAlerts = 5;
export const topRisks = ['Supplier A Delay', 'Geopolitical Instability', 'Demand Fluctuations'];
export const supplierRiskData = [
  { x: 'High', y: 15 },
  { x: 'Medium', y: 35 },
  { x: 'Low', y: 50 },
];
export const riskTrendData = [
  { x: 'Jan', y: 60 },
  { x: 'Feb', y: 65 },
  { x: 'Mar', y: 70 },
  { x: 'Apr', y: 75 },
  { x: 'May', y: 72 },
];
export const riskRegisterData = [
  { id: 1, name: 'Key Supplier Bankruptcy', category: 'Supplier', likelihood: 'High', impact: 'Critical', level: 'High', status: 'Open' },
  { id: 2, name: 'Port Congestion', category: 'Logistics', likelihood: 'Medium', impact: 'High', level: 'High', status: 'In Progress' },
  { id: 3, name: 'Raw Material Price Spike', category: 'Economic', likelihood: 'Medium', impact: 'Medium', level: 'Medium', status: 'Resolved' },
];
export const supplierData = [
  { id: 101, name: 'Supplier A', location: 'USA', riskScore: 80, status: 'Active' },
  { id: 102, name: 'Supplier B', location: 'China', riskScore: 65, status: 'Active' },
  { id: 103, name: 'Supplier C', location: 'Europe', riskScore: 40, status: 'Inactive' },
];