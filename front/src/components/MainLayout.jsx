import React from "react";
import { Outlet } from "react-router-dom";
import { Bell, Settings, User, Box } from "lucide-react";
import { Link } from "react-router-dom";

function MainLayout({ GenerateButtonWithRoute }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue shadow-md px-6 py-3 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Box className="text-blue-500" size={28} />
            <h1 className="font-bold text-xl text-gray-800">Lumina</h1>
          </div>
          <div className="flex items-center space-x-4">
            {GenerateButtonWithRoute && <GenerateButtonWithRoute />}
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
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/summary" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                  <span>Summary</span>
                </Link>
              </li>
              {/* ...resto de tus links... */}
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;