import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const AdminHeader = ({ title }) => {
  return (
    <header className="admin-header">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title || 'Dashboard'}</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenido de nuevo, Administrador</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
            <User className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
