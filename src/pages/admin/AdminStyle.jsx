import React, { useState } from 'react';
import { Save, RotateCcw, Palette, Type, Square, RefreshCcw, Upload } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminStyle = () => {
  const { content, updateContent, saveToServer, uploadFile } = useContent();
  const [uploading, setUploading] = useState(false);
  
  // Safe initialization with deep defaults
  const styles = {
    colors: { 
      primary: content.style?.colors?.primary || '#C6B7A0', 
      secondary: content.style?.colors?.secondary || '#2C3E35', 
      accent: content.style?.colors?.accent || '#E5DED4' 
    },
    typography: { 
      heading: content.style?.typography?.heading || 'Alata', 
      body: content.style?.typography?.body || 'Montserrat',
      headingSize: content.style?.typography?.headingSize || 48,
      bodySize: content.style?.typography?.bodySize || 16,
      navSize: content.style?.typography?.navSize || 10,
      missionBodySize: content.style?.typography?.missionBodySize || 18,
      manifestoBodySize: content.style?.typography?.manifestoBodySize || 24
    },
    logoUrl: content.style?.logoUrl || '',
    logoSize: content.style?.logoSize || 100,
    adminLogoUrl: content.style?.adminLogoUrl || '',
    adminLogoSize: content.style?.adminLogoSize || 100
  };

  const handleColorChange = (key, value) => {
    updateContent('style', 'colors', { [key]: value });
  };

  const handleFileUpload = async (e, field = 'logoUrl') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadFile(file);
    setUploading(false);
    if (result.ok) {
      updateContent('style', null, { [field]: result.url });
    } else {
      alert('Error al subir logo: ' + (result.message || ''));
    }
  };

  const handleApply = async () => {
    const success = await saveToServer();
    if (success) alert('✅ Styles applied and saved successfully.');
    else alert('❌ Error while saving styles.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Visual Identity</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Customize colors, typography and global aesthetics</p>
        </div>
        <button onClick={handleApply} className="admin-button admin-button-primary flex items-center gap-2">
          <Palette className="w-4 h-4" /> Apply Styles
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="admin-card">
          <h3 className="font-heading text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--admin-accent)]" /> Color Palette & Branding
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="colorPrimary" className="block text-xs font-bold text-[var(--admin-text)] uppercase tracking-widest">Primary Color</label>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Used for badges, highlights and borders</p>
              </div>
              <input type="color" id="colorPrimary" value={styles.colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} className="w-12 h-12 rounded cursor-pointer border-none" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="colorSecondary" className="block text-xs font-bold text-[var(--admin-text)] uppercase tracking-widest">Secondary Color</label>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Main text color and heavy sections</p>
              </div>
              <input type="color" id="colorSecondary" value={styles.colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} className="w-12 h-12 rounded cursor-pointer border-none" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="colorAccent" className="block text-xs font-bold text-[var(--admin-text)] uppercase tracking-widest">Accent Color</label>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Backgrounds and light surfaces</p>
              </div>
              <input type="color" id="colorAccent" value={styles.colors.accent} onChange={(e) => handleColorChange('accent', e.target.value)} className="w-12 h-12 rounded cursor-pointer border-none" />
            </div>
            
            <div className="pt-6 border-t border-gray-100 space-y-6">
              <div className="admin-form-group">
                <label htmlFor="logoUrl" className="admin-label">Public Website Logo</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="logoUrl"
                    className="admin-input flex-1" 
                    value={typeof styles.logoUrl === 'string' ? styles.logoUrl : ''} 
                    onChange={(e) => updateContent('style', null, { logoUrl: e.target.value })} 
                    placeholder="https://example.com/logo-public.png"
                  />
                  <label htmlFor="logoUpload" className="p-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className={`w-5 h-5 ${uploading ? 'animate-bounce text-blue-500' : 'text-gray-500'}`} />
                    <input type="file" id="logoUpload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} disabled={uploading} />
                  </label>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label htmlFor="logoSize" className="text-[10px] font-bold text-gray-400 uppercase">Logo Size</label>
                  <input type="range" id="logoSize" min="20" max="300" className="flex-1" value={styles.logoSize} onChange={(e) => updateContent('style', null, { logoSize: e.target.value })} />
                  <span className="text-[10px] font-bold text-[var(--admin-accent)]">{styles.logoSize}px</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Displayed on the live site.</p>
              </div>

              <div className="admin-form-group">
                <label htmlFor="adminLogoUrl" className="admin-label text-blue-600">Admin Dashboard Logo</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="adminLogoUrl"
                    className="admin-input flex-1 border-blue-100 focus:ring-blue-500" 
                    value={typeof styles.adminLogoUrl === 'string' ? styles.adminLogoUrl : ''} 
                    onChange={(e) => updateContent('style', null, { adminLogoUrl: e.target.value })} 
                    placeholder="https://example.com/logo-admin.png"
                  />
                  <label htmlFor="adminLogoUpload" className="p-2 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className={`w-5 h-5 ${uploading ? 'animate-bounce text-blue-600' : 'text-blue-400'}`} />
                    <input type="file" id="adminLogoUpload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'adminLogoUrl')} disabled={uploading} />
                  </label>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label htmlFor="adminLogoSize" className="text-[10px] font-bold text-blue-400 uppercase">Logo Size</label>
                  <input type="range" id="adminLogoSize" min="20" max="300" className="flex-1" value={styles.adminLogoSize} onChange={(e) => updateContent('style', null, { adminLogoSize: e.target.value })} />
                  <span className="text-[10px] font-bold text-blue-600">{styles.adminLogoSize}px</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Displayed exclusively in this admin panel.</p>
                {uploading && <p className="text-[9px] text-blue-500 mt-1 font-bold animate-pulse">Uploading asset...</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="font-heading text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Type className="w-4 h-4 text-[var(--admin-accent)]" /> Typography
          </h3>
          <div className="space-y-6">
            <div className="admin-form-group">
              <label htmlFor="headingFont" className="admin-label">Heading Font Family</label>
              <select id="headingFont" className="admin-select" value={styles.typography.heading} onChange={(e) => updateContent('style', 'typography', { ...styles.typography, heading: e.target.value })}>
                <option value="Alata">Alata (Modern Sans)</option>
                <option value="Montserrat">Montserrat (Classic Sans)</option>
                <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label htmlFor="bodyFont" className="admin-label">Body Font Family</label>
              <select id="bodyFont" className="admin-select" value={styles.typography.body} onChange={(e) => updateContent('style', 'typography', { ...styles.typography, body: e.target.value })}>
                <option value="Montserrat">Montserrat</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-form-group">
                <label htmlFor="headingSize" className="admin-label">Heading Size (Base)</label>
                <div className="flex items-center gap-3">
                  <input type="range" id="headingSize" min="20" max="80" step="1" className="flex-1" value={styles.typography.headingSize || 48} onChange={(e) => updateContent('style', 'typography', { ...styles.typography, headingSize: e.target.value })} />
                  <span className="text-[10px] font-bold text-[var(--admin-accent)]">{styles.typography.headingSize || 48}px</span>
                </div>
              </div>
              <div className="admin-form-group">
                <label htmlFor="bodySize" className="admin-label">Body Size (Base)</label>
                <div className="flex items-center gap-3">
                  <input type="range" id="bodySize" min="12" max="24" step="1" className="flex-1" value={styles.typography.bodySize || 16} onChange={(e) => updateContent('style', 'typography', { ...styles.typography, bodySize: e.target.value })} />
                  <span className="text-[10px] font-bold text-[var(--admin-accent)]">{styles.typography.bodySize || 16}px</span>
                </div>
              </div>
              <div className="admin-form-group col-span-2">
                <label htmlFor="navSize" className="admin-label">Navigation Menu Size</label>
                <div className="flex items-center gap-3">
                  <input type="range" id="navSize" min="6" max="36" step="0.5" className="flex-1" value={styles.typography.navSize || 10} onChange={(e) => updateContent('style', 'typography', { ...styles.typography, navSize: parseFloat(e.target.value) })} />
                  <span className="text-[10px] font-bold text-[var(--admin-accent)]">{styles.typography.navSize || 10}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStyle;
