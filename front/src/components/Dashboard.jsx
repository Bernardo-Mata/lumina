import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory';

// Importa los styled components y datos necesarios desde App.jsx o crea un archivo para ellos si los vas a reutilizar
import {
  PromptBox, PromptInput, PromptButton, PromptResponse, ResponseBubble,
  DashboardContainer, RiskScoreWidget, AlertListWidget, RiskMapWidget,
  SupplierRiskWidget, RiskTrendWidget
} from '../App'; // O crea un archivo de styled components

const darkBlue = '#0A192F';
const mediumBlue = '#307AC1';
const lightBlue = '#ADD8E6';

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

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      await fetch('http://127.0.0.1:8000/process-text/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });
      const resp = await fetch('http://127.0.0.1:8000/get-response/', { method: 'GET' });
      if (resp.ok) {
        const data = await resp.text();
        setResponse(data);
      } else {
        setResponse('Error al obtener respuesta del LLM.');
      }
    } catch (err) {
      setResponse('Error de conexión con el LLM.');
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
          placeholder="Ask any questtion..."
        />
        <PromptButton type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </PromptButton>
      </PromptBox>
      {response && (
        <PromptResponse>
          <ResponseBubble>
            <strong>Respuesta:</strong> {response}
          </ResponseBubble>
        </PromptResponse>
      )}
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

export default Dashboard;