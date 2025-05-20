import React from 'react';
import { Box, TrendingUp, Minimize, AlertOctagon, AlertTriangle, AlertCircle } from 'lucide-react';

const Dashboard = () => (
  <div className="p-6">
    {/* Título */}
    <div className="flex items-center mb-6">
      <Box className="text-blue-500 mr-2" size={28} />
      <h2 className="font-bold text-2xl text-gray-800">Dashboard</h2>
    </div>

    {/* Indicadores */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-4 border-t-4 border-red-500">
        <h3 className="text-gray-500 font-medium">Disruption Risk</h3>
        <div className="text-3xl font-bold my-2">78%</div>
        <div className="flex items-center text-red-500 text-sm">
          <TrendingUp size={16} className="mr-1" />
          <span>12% from last month</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-t-4 border-yellow-500">
        <h3 className="text-gray-500 font-medium">Compliance Issues</h3>
        <div className="text-3xl font-bold my-2">24</div>
        <div className="flex items-center text-red-500 text-sm">
          <TrendingUp size={16} className="mr-1" />
          <span>3 new issues</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-t-4 border-green-500">
        <h3 className="text-gray-500 font-medium">Supplier Health</h3>
        <div className="text-3xl font-bold my-2">92%</div>
        <div className="flex items-center text-green-500 text-sm">
          <TrendingUp size={16} className="mr-1 transform rotate-180" />
          <span>4% improvement</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-t-4 border-gray-400">
        <h3 className="text-gray-500 font-medium">On-time Delivery</h3>
        <div className="text-3xl font-bold my-2">86%</div>
        <div className="flex items-center text-gray-500 text-sm">
          <Minimize size={16} className="mr-1" />
          <span>Unchanged</span>
        </div>
      </div>
    </div>

    {/* Alertas recientes */}
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="font-bold text-gray-700 mb-4">Recent Risk Alerts</h3>
      <ul className="divide-y">
        <li className="flex p-4 hover:bg-gray-50">
          <div className="flex-shrink-0 mr-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertOctagon size={18} className="text-red-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800">Port Congestion Alert</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shanghai, China</span>
              <span>2h ago</span>
            </div>
          </div>
        </li>
        <li className="flex p-4 hover:bg-gray-50">
          <div className="flex-shrink-0 mr-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle size={18} className="text-yellow-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800">Compliance Document Expired</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>TechSupplier Inc.</span>
              <span>1d ago</span>
            </div>
          </div>
        </li>
        <li className="flex p-4 hover:bg-gray-50">
          <div className="flex-shrink-0 mr-3">
            <div className="p-2 bg-green-100 rounded-full">
              <AlertCircle size={18} className="text-green-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800">Minor Shipping Delay</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Los Angeles, USA</span>
              <span>5d ago</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
);

export default Dashboard;