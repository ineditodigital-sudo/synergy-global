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
  Mail,
  Images,
  GalleryHorizontal
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminSidebar = () => {
  const { content } = useContent();
  const logoUrl = content.style?.adminLogoUrl || content.style?.logoUrl;

  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', path: '/admin' },
    { icon: <FileText />, label: 'Content', path: '/admin/content' },
    { icon: <Home />, label: 'Properties', path: '/admin/properties' },
    { icon: <Briefcase />, label: 'Portfolio', path: '/admin/portfolio' },
    { icon: <Images />, label: 'Assets', path: '/admin/media' },
    { icon: <GalleryHorizontal />, label: 'Gallery', path: '/admin/gallery' },
    { icon: <Users />, label: 'Members', path: '/admin/members' },
    { icon: <Menu />, label: 'Navigation', path: '/admin/navigation' },
    // Messages removed
    { icon: <Palette />, label: 'Styles', path: '/admin/style' },
    { icon: <Settings />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Synergy Global" 
            className="object-contain" 
            style={{ height: 'var(--admin-logo-size, 32px)' }}
          />
        ) : (
          <>
            <div className="w-8 h-8 bg-[var(--admin-text)] flex items-center justify-center rounded">
              <span className="text-white text-xs">S</span>
            </div>
            <span className="font-heading">Synergy <span className="text-sand">Global</span></span>
          </>
        )}
      </div>
      
      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/admin'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-[var(--admin-border)]">
        <button className="admin-nav-item w-full text-left hover:text-red-500 transition-colors">
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
