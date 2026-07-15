import React from 'react';
import { Save, Shield, Globe, Bell, Mail, Key, Database } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminSettings = () => {
  const { content, updateContent, saveToServer } = useContent();

  const handleInfoChange = (field, value) => {
    updateContent('contact', 'info', { [field]: value });
  };

  const handleSave = async () => {
    const success = await saveToServer();
    if (success) alert('✅ Configuration saved successfully.');
    else alert('❌ Error while saving.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">System Settings</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Technical and operational configuration for Synergy Global</p>
        </div>
        <button onClick={handleSave} className="admin-button admin-button-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Everything
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="admin-card">
            <h3 className="font-heading text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--admin-accent)]" /> Corporate Information
            </h3>
            <div className="space-y-4">
              <div className="admin-form-group">
                <label className="admin-label">Contact Email</label>
                <input className="admin-input" value={content.contact?.info?.email || ''} onChange={(e) => handleInfoChange('email', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Headquarters</label>
                <input className="admin-input" value={content.contact?.info?.office || ''} onChange={(e) => handleInfoChange('office', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Primary Region</label>
                <input className="admin-input" value={content.contact?.info?.country || ''} onChange={(e) => handleInfoChange('country', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="admin-card">
             <h3 className="font-heading text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
               <Shield className="w-4 h-4 text-[var(--admin-accent)]" /> Security & SEO
             </h3>
             <div className="space-y-4">
                <div className="admin-form-group">
                  <label className="admin-label">Global Meta Title</label>
                  <input className="admin-input" defaultValue="Synergy Global | Investment & Strategic Development" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Google Analytics ID</label>
                  <input className="admin-input" defaultValue="G-XXXXXXXXXX" placeholder="G-XXXXXXXXXX" />
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="admin-card bg-[var(--admin-bg)] border-[var(--admin-accent)]/20">
             <h3 className="font-heading text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
               <Database className="w-4 h-4 text-[var(--admin-accent)]" /> Server Status (Demo Mode)
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                   <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Database</span>
                   <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-bold rounded">JSON MODE</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                   <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Storage</span>
                   <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">ONLINE</span>
                </div>
                <div className="flex justify-between items-center py-2">
                   <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">System Version</span>
                   <span className="text-xs font-mono text-gray-400">v1.2.0-demo</span>
                </div>
             </div>
           </div>

           <div className="admin-card border-red-50">
              <h3 className="font-heading text-sm uppercase tracking-wider text-red-600 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Danger Zone
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">These actions cannot be undone.</p>
              <button className="w-full py-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-600 hover:text-white transition-all">
                Put Site in Maintenance Mode
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
