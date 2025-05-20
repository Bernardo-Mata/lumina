import React, { useState } from 'react';
import { Bell, Settings, User, Home, Map, List, CheckSquare, Shield, Activity, Server, Search, Box, TrendingUp, AlertTriangle, AlertOctagon, AlertCircle, Minimize } from 'lucide-react';

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All Risks');

  return (
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
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500 text-white">
                  <Home size={18} />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <Map size={18} />
                  <span>Risk Map</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <List size={18} />
                  <span>Alerts</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <Server size={18} />
                  <span>Suppliers</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <CheckSquare size={18} />
                  <span>Compliance</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <Shield size={18} />
                  <span>Risk Scores</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <Activity size={18} />
                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Search Bar */}
          <div className="flex justify-between mb-6">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for suppliers, risks, or alerts..."
              />
            </div>
            <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-4">
              <Box size={18} />
              <span>AI Insights</span>
            </button>
          </div>
          
          {/* Risk Indicators */}
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
          
          {/* Dashboard Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Map Container */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-700">Global Supply Chain Risk Map</h2>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {['All Risks', 'Disruption', 'Political', 'Weather'].map(filter => (
                    <button
                      key={filter}
                      className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                        activeFilter === filter 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 relative" style={{ height: '300px' }}>
                <div className="absolute inset-0 bg-blue-50 m-4 rounded-lg">
                  {/* World Map Placeholder */}
                  <div className="relative w-full h-full">
                    {/* Fake country outlines */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="absolute top-1/3 left-1/3 w-24 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="absolute top-1/2 left-1/2 w-20 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="absolute top-2/3 left-1/5 w-32 h-10 bg-gray-200 rounded-lg"></div>
                    
                    {/* Risk points */}
                    <div className="absolute top-1/4 left-1/5 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-2/5 left-4/5 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
                    <div className="absolute top-7/10 left-13/20 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Alerts */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-gray-700">Recent Risk Alerts</h2>
                <a href="#" className="text-blue-500 text-sm hover:underline">View all</a>
              </div>
              
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
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertOctagon size={18} className="text-red-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">Production Facility Fire</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Monterrey, Mexico</span>
                      <span>3d ago</span>
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
            
            {/* AI Recommendations */}
            <div className="lg:col-span-5 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <Box size={20} className="text-blue-500 mr-2" />
                  <h2 className="font-bold text-gray-700">AI Recommendations</h2>
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">POWERED BY AI</span>
                </div>
              </div>
              
              <div className="divide-y">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">Diversify Shanghai Port Suppliers</h3>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">High Priority</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Current congestion at Shanghai port affects 47% of your tier 1 suppliers. Consider activating alternate suppliers in Ningbo and Qingdao ports.
                  </p>
                  <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <CheckSquare size={16} className="mr-2" />
                      Implement
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                      <AlertCircle size={16} className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">Update Supplier Documentation</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Medium Priority</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    5 critical suppliers have compliance certificates expiring in the next 30 days. Initiate renewal process to avoid disruption.
                  </p>
                  <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <CheckSquare size={16} className="mr-2" />
                      Implement
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                      <AlertCircle size={16} className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
