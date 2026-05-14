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

const AdminPlaceholder = ({ title, description }) => (
  <div className="admin-card glass-panel text-center py-20 animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
    </div>
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2 max-w-md mx-auto">{description || 'Esta sección está siendo configurada para que puedas gestionar cada detalle de Synergy Global con facilidad.'}</p>
    <div className="mt-8 flex justify-center gap-4">
      <button className="admin-button admin-button-primary">Configurar Ahora</button>
      <button className="admin-button admin-button-secondary">Ver Guía</button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Panel de Control';
    if (path.includes('/content')) return 'Gestión de Contenido';
    if (path.includes('/properties')) return 'Catálogo de Propiedades';
    if (path.includes('/portfolio')) return 'Portafolio de Inversión';
    if (path.includes('/members')) return 'Equipo Synergy';
    if (path.includes('/navigation')) return 'Menús y Navegación';
    if (path.includes('/messages')) return 'Bandeja de Entrada';
    if (path.includes('/style')) return 'Identidad y Estilos';
    if (path.includes('/settings')) return 'Ajustes del Sistema';
    return 'Administración';
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
            
            {/* Remaining placeholders with custom text */}
            <Route path="properties" element={
              <AdminPlaceholder 
                title="Gestión de Propiedades" 
                description="Administra los listados de activos inmobiliarios, precios, características y galerías de imágenes de alta resolución." 
              />
            } />
            <Route path="portfolio" element={
              <AdminPlaceholder 
                title="Portafolio de Inversión" 
                description="Controla los proyectos destacados y el track record de inversiones globales de Synergy." 
              />
            } />
            <Route path="navigation" element={
              <AdminPlaceholder 
                title="Menús y Navegación" 
                description="Configura los enlaces del header, footer y la jerarquía de navegación para una experiencia de usuario fluida." 
              />
            } />
            <Route path="messages" element={
              <AdminPlaceholder 
                title="Mensajes de Contacto" 
                description="Gestión centralizada de leads y consultas recibidas a través de los formularios del sitio." 
              />
            } />
            <Route path="settings" element={
              <AdminPlaceholder 
                title="Configuración General" 
                description="Ajustes de dominio, SEO global, integraciones de Analytics y datos de contacto corporativos." 
              />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
