import React from 'react';
import { SupplierTable } from '../App'; // O desde un archivo de styled components

const supplierData = [
  { id: 101, name: 'Supplier A', location: 'USA', riskScore: 80, status: 'Active' },
  { id: 102, name: 'Supplier B', location: 'China', riskScore: 65, status: 'Active' },
  { id: 103, name: 'Supplier C', location: 'Europe', riskScore: 40, status: 'Inactive' },
];

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

export default Suppliers;