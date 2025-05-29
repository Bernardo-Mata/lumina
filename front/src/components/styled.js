import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

// Paleta de colores
export const darkBlue = '#0A192F';
export const white = '#FFFFFF';
export const mediumBlue = '#307AC1';
export const lightBlue = '#ADD8E6';

// Styled Components
export const AppContainer = styled.div`
  font-family: sans-serif;
  background-color: ${white};
  min-height: 100vh;
  display: flex;
`;

export const Sidebar = styled.aside`
  background-color: ${darkBlue};
  color: ${white};
  width: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

export const NavItem = styled.li`
  margin-bottom: 10px;
`;

export const StyledNavLink = styled(NavLink)`
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

export const Content = styled.main`
  flex-grow: 1;
  padding: 20px;
`;

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

export const Widget = styled.div`
  background-color: ${white};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const RiskScoreWidget = styled(Widget)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AlertListWidget = styled(Widget)`
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

export const RiskMapWidget = styled(Widget)`
  /* Placeholder for map integration */
  height: 300px;
  background-color: ${lightBlue};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${darkBlue};
  font-weight: bold;
`;

export const SupplierRiskWidget = styled(Widget)`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RiskTrendWidget = styled(Widget)`
  height: 300px;
`;

export const RiskRegisterTable = styled.table`
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

export const SupplierTable = styled(RiskRegisterTable)``;

export const PromptBox = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: ${lightBlue};
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PromptInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${mediumBlue};
  font-size: 1rem;
`;

export const PromptButton = styled.button`
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

export const PromptResponse = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
`;

export const ResponseBubble = styled.div`
  background: #f1f6fb;
  color: ${darkBlue};
  border-radius: 18px 18px 18px 4px;
  padding: 14px 20px;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(48, 122, 193, 0.08);
  max-width: 70%;
  word-break: break-word;
  border: 1px solid ${lightBlue};
`;