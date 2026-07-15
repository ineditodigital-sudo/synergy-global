import React from 'react';
import { User } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminHeader = ({ title }) => {
  const { logout } = useContent();
  return (
    <header className="admin-header">
      <div>
        <h1 className="text-2xl font-heading uppercase tracking-wider text-[var(--admin-text)]">{title || 'Dashboard'}</h1>
        <p className="text-[10px] text-[var(--admin-text-secondary)] mt-1 uppercase tracking-[0.2em] font-bold">Welcome back, Administrator</p>
      </div>

        <div className="flex items-center gap-6">
          <button
            onClick={logout}
            className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] border border-[var(--admin-border)] rounded-full px-4 py-2 transition-colors"
          >
            Cerrar sesion
          </button>
          <div className="flex items-center gap-3 pl-6 border-l border-[var(--admin-border)]">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-[var(--admin-text)] uppercase tracking-widest leading-none">Administrator</p>
              <p className="text-[9px] text-[var(--admin-text-secondary)] uppercase tracking-tighter mt-1">Synergy Lead</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--admin-accent)] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
          </div>
        </div>
    </header>
  );
};

export default AdminHeader;
