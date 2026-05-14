import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Home, 
  Users, 
  Briefcase, 
  Menu, 
  Settings, 
  LogOut,
  Palette,
  Mail
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', path: '/admin' },
    { icon: <FileText />, label: 'Contenido', path: '/admin/content' },
    { icon: <Home />, label: 'Propiedades', path: '/admin/properties' },
    { icon: <Briefcase />, label: 'Portafolio', path: '/admin/portfolio' },
    { icon: <Users />, label: 'Miembros', path: '/admin/members' },
    { icon: <Menu />, label: 'Navegación', path: '/admin/navigation' },
    { icon: <Mail />, label: 'Mensajes', path: '/admin/messages' },
    { icon: <Palette />, label: 'Estilo', path: '/admin/style' },
    { icon: <Settings />, label: 'Configuración', path: '/admin/settings' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span>Synergy Admin</span>
      </div>
      
      <nav className="admin-nav">
        {navItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/admin'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-100">
        <button className="admin-nav-item w-full border-none bg-transparent cursor-pointer text-red-500 hover:bg-red-50">
          <LogOut />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
