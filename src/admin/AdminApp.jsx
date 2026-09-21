import { Routes, Route, Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import './admin.css';
import AdminProvider from './AdminProvider.jsx';
import { useAdmin } from './context.js';
import Layout from './components/Layout.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import { Toasts, ConfirmDialog, SessionExpiredDialog, RecoveryBanner } from './components/Overlays.jsx';
import { Spinner } from './components/ui.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PagesIndex from './pages/PagesIndex.jsx';
import PageEditor from './pages/PageEditor.jsx';
import PropertiesList from './pages/PropertiesList.jsx';
import PropertyEditor from './pages/PropertyEditor.jsx';
import ServicesList from './pages/ServicesList.jsx';
import ServiceEditor from './pages/ServiceEditor.jsx';
import TeamList from './pages/TeamList.jsx';
import MemberEditor from './pages/MemberEditor.jsx';
import GalleryEditor from './pages/GalleryEditor.jsx';
import MenuEditor from './pages/MenuEditor.jsx';
import DesignEditor from './pages/DesignEditor.jsx';
import SettingsEditor from './pages/SettingsEditor.jsx';
import MediaLibrary from './pages/MediaLibrary.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

function Shell() {
  const { session, loadState, reload, t } = useAdmin();

  if (!session) return <LoginScreen />;
  if (loadState === 'loading') {
    return (
      <div className="sg-admin flex items-center justify-center gap-3 text-[var(--a-muted)]">
        <Spinner /> {t('common.loading')}
      </div>
    );
  }
  if (loadState === 'error') {
    return (
      <div className="sg-admin flex items-center justify-center p-6">
        <div className="a-card max-w-md text-center">
          <p className="font-semibold mt-0">{t('load.errorTitle')}</p>
          <p className="text-sm text-[var(--a-muted)]">{t('load.errorText')}</p>
          <button type="button" className="a-btn a-btn-primary" onClick={() => reload()}>
            <RefreshCw size={16} /> {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <RecoveryBanner />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="pages" element={<PagesIndex />} />
        <Route path="pages/:pageKey" element={<PageEditor />} />
        <Route path="properties" element={<PropertiesList />} />
        <Route path="properties/:id" element={<PropertyEditor />} />
        <Route path="services" element={<ServicesList />} />
        <Route path="services/:id" element={<ServiceEditor />} />
        <Route path="team" element={<TeamList />} />
        <Route path="team/:id" element={<MemberEditor />} />
        <Route path="gallery" element={<GalleryEditor />} />
        <Route path="menu" element={<MenuEditor />} />
        <Route path="design" element={<DesignEditor />} />
        <Route path="settings" element={<SettingsEditor />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}

export default function AdminApp() {
  return (
    <AdminProvider>
      {/* One themed root, so dialogs and toasts get the CMS colors too. */}
      <div className="sg-admin">
        <Shell />
        <SessionExpiredDialog />
        <ConfirmDialog />
        <Toasts />
      </div>
    </AdminProvider>
  );
}
