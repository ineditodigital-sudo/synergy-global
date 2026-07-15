import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

// Components
import AdminOverview from './AdminOverview';
import AdminContent from './AdminContent';
import AdminStyle from './AdminStyle';
import AdminMembers from './AdminMembers';
import AdminNavigation from './AdminNavigation';
import AdminProperties from './AdminProperties';
import AdminPortfolio from './AdminPortfolio';
import AdminMedia from './AdminMedia';
import AdminGallery from './AdminGallery';
// Messages removed
import AdminSettings from './AdminSettings';
import AdminLogin from './AdminLogin';
import { useContent } from '../../context/ContentContext';

const AdminPlaceholder = ({ title, description }) => (
  <div className="admin-card glass-panel text-center py-20 animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] rounded-full flex items-center justify-center mx-auto mb-6">
      <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    </div>
    <h2 className="text-2xl font-heading text-[var(--admin-text)] uppercase tracking-wider">{title}</h2>
    <p className="text-[var(--admin-text-secondary)] mt-4 max-w-md mx-auto text-sm">{description || 'Esta sección está siendo configurada para que puedas gestionar cada detalle de Synergy Global con facilidad.'}</p>
    <div className="mt-8 flex justify-center gap-4">
      <button className="admin-button admin-button-primary">Configurar Ahora</button>
      <button className="admin-button admin-button-secondary">Ver Guía</button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();
  const { isAuthed } = useContent();

  if (!isAuthed) {
    return <AdminLogin />;
  }

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path.includes('/content')) return 'Content Management';
    if (path.includes('/properties')) return 'Properties Catalog';
    if (path.includes('/portfolio')) return 'Investment Portfolio';
    if (path.includes('/media')) return 'Asset Library';
    if (path.includes('/gallery')) return 'Gallery & Press Media';
    if (path.includes('/members')) return 'Synergy Team';
    if (path.includes('/navigation')) return 'Menus & Navigation';
    // Messages removed
    if (path.includes('/style')) return 'Identity & Styles';
    if (path.includes('/settings')) return 'System Settings';
    return 'Administration';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <main className="admin-main">
        <AdminHeader title={getTitle()} />
        
        <div className="admin-content-area mt-4">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="style" element={<AdminStyle />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="navigation" element={<AdminNavigation />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="gallery" element={<AdminGallery />} />
            {/* Messages route removed */}
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
