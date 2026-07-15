import React, { useState } from 'react';
import { 
  Edit2, Eye, Save, Trash2, Plus, Image as ImageIcon, 
  ChevronRight, Layout, Monitor, Smartphone, Check, 
  MousePointer2, Target, Zap, Mail, Globe, ShieldCheck, FileText, Play, Upload, Type
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminContent = () => {
  const { content, updateContent, saveToServer, uploadFile } = useContent();
  const [editingPage, setEditingPage] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); 
  const [activeSection, setActiveSection] = useState('hero');
  const [uploading, setUploading] = useState(false);
  const previewScrollRef = React.useRef(null);

  const pages = [
    { id: 1, title: 'Home', slug: '/', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400', key: 'home' },
    { id: 2, title: 'Mission & Vision', slug: '/mission', thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', key: 'mission' },
    { id: 3, title: 'About Us', slug: '/about', thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', key: 'about' },
    { id: 4, title: 'Our Services', slug: '/services', thumb: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400', key: 'services' },
    { id: 5, title: 'Leadership', slug: '/team', thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400', key: 'about' },
    { id: 6, title: 'Key Partnerships', slug: '/partnerships', thumb: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400', key: 'partnerships' },
    { id: 7, title: 'Legal Services', slug: '/legal', thumb: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', key: 'legal' },
    { id: 8, title: 'Contact Us', slug: '/contact', thumb: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=400', key: 'contact' }
  ];

  const handleFileUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadFile(file);
    setUploading(false);
    if (result.ok) {
      handleInputChange(section, field, result.url);
    } else {
      alert('Error al subir archivo: ' + (result.message || ''));
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setActiveSection('hero');
  };

  const handleInputChange = (section, field, value) => {
    updateContent(editingPage.key, section, { [field]: value });
  };

  const getPageContent = () => {
    if (!editingPage) return content.home;
    const data = content[editingPage.key] || content.home || {};
    return data;
  };

  if (editingPage) {
    const pageData = getPageContent();
    const safeHero = pageData.hero || { badge: '', title: '', subtitle: '', backgroundImage: '' };
    const safeHeader = pageData.header || { badge: '', title: '', subtitle: '' };

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => setEditingPage(null)} className="hover:text-blue-600 font-medium font-sans uppercase tracking-widest text-[10px]">Contenido</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-bold font-heading">{editingPage.title}</span>
          </div>
          
          <div className="flex items-center bg-gray-100 p-1 rounded">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[var(--admin-accent)]' : 'text-gray-400'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[var(--admin-accent)]' : 'text-gray-400'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Editor Panel */}
          <div className="xl:col-span-5 space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Generic Header/Hero Editor for any page */}
            {pageData.hero && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[var(--admin-bg)] rounded overflow-hidden border border-[var(--admin-border)] flex items-center justify-center">
                    <img src={safeHero.backgroundImage} className="w-full h-full object-cover opacity-50" alt="" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm uppercase tracking-wider text-[var(--admin-text)]">Hero Section</h3>
                    <p className="text-[10px] text-[var(--admin-accent)] font-bold uppercase tracking-widest">Main Header</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Top Badge</label>
                    <input type="text" className="admin-input" value={safeHero.badge} onChange={(e) => handleInputChange('hero', 'badge', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Title</label>
                    <input type="text" className="admin-input" value={safeHero.title} onChange={(e) => handleInputChange('hero', 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Subtitle</label>
                    <input type="text" className="admin-input" value={safeHero.subtitle} onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Desktop Content Alignment
                    </label>
                    <select 
                      className="admin-select" 
                      value={safeHero.desktopAlign || 'left'} 
                      onChange={(e) => handleInputChange('hero', 'desktopAlign', e.target.value)}
                    >
                      <option value="left">Left (Default)</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">Changes text alignment only on desktop devices.</p>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Background Image URL</label>
                    <div className="flex gap-2">
                      <input type="text" className="admin-input flex-1" value={safeHero.backgroundImage || ''} onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)} />
                      <label className="p-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <Upload className="w-5 h-5 text-gray-500" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero', 'backgroundImage')} />
                      </label>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label text-indigo-600 flex items-center gap-2">
                      <Play className="w-3 h-3" /> Background Video URL (iPhone Autoplay)
                    </label>
                    <div className="flex gap-2">
                      <input type="text" className="admin-input flex-1 border-indigo-100 focus:ring-indigo-500" value={safeHero.backgroundVideo || ''} onChange={(e) => handleInputChange('hero', 'backgroundVideo', e.target.value)} placeholder="https://example.com/video.mp4" />
                      <label className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                        <Upload className="w-5 h-5 text-indigo-600" />
                        <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'hero', 'backgroundVideo')} />
                      </label>
                    </div>
                    {uploading && <p className="text-[10px] text-indigo-500 mt-1 animate-pulse">Uploading file... please wait.</p>}
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Mobile Content Alignment
                    </label>
                    <select 
                      className="admin-select" 
                      value={safeHero.mobileAlign || 'center'} 
                      onChange={(e) => handleInputChange('hero', 'mobileAlign', e.target.value)}
                    >
                      <option value="center">Center (Default)</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">Changes text alignment only on mobile devices.</p>
                  </div>
                </div>
              </div>
            )}

            {pageData.header && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <Layout className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Page Header</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Top Title</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Badge</label>
                    <input type="text" className="admin-input" value={safeHeader.badge} onChange={(e) => handleInputChange('header', 'badge', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Main Title</label>
                    <input type="text" className="admin-input" value={safeHeader.title} onChange={(e) => handleInputChange('header', 'title', e.target.value)} />
                  </div>
                  {safeHeader.subtitle !== undefined && (
                    <div className="admin-form-group">
                      <label className="admin-label">Subtitle</label>
                      <input type="text" className="admin-input" value={safeHeader.subtitle} onChange={(e) => handleInputChange('header', 'subtitle', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {pageData?.manifesto && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900">Manifesto Section</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Title</label>
                    <input type="text" className="admin-input" value={pageData.manifesto.title || ''} onChange={(e) => handleInputChange('manifesto', 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Description</label>
                    <textarea className="admin-input min-h-[100px]" value={pageData.manifesto.subtitle || ''} onChange={(e) => handleInputChange('manifesto', 'subtitle', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Manifesto Text Font Size</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="12" 
                        max="48" 
                        step="1" 
                        className="flex-1" 
                        value={content.style?.typography?.manifestoBodySize || 24} 
                        onChange={(e) => updateContent('style', 'typography', { ...content.style?.typography, manifestoBodySize: parseInt(e.target.value) })} 
                      />
                      <span className="text-[10px] font-bold text-[var(--admin-accent)]">{content.style?.typography?.manifestoBodySize || 24}px</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pageData?.narrative && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900">Brand Narrative</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Main Title</label>
                    <input type="text" className="admin-input" value={pageData.narrative.title || ''} onChange={(e) => handleInputChange('narrative', 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Paragraph 1</label>
                    <textarea className="admin-input min-h-[100px]" value={pageData.narrative.text1 || ''} onChange={(e) => handleInputChange('narrative', 'text1', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Paragraph 2</label>
                    <textarea className="admin-input min-h-[100px]" value={pageData.narrative.text2 || ''} onChange={(e) => handleInputChange('narrative', 'text2', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
            
            {pageData?.missionCard && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Mission Card</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Image URL</label>
                    <input type="text" className="admin-input" value={pageData.missionCard.image || ''} onChange={(e) => handleInputChange('missionCard', 'image', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Mission Text</label>
                    <textarea className="admin-input min-h-[100px]" value={pageData.missionCard.text || ''} onChange={(e) => handleInputChange('missionCard', 'text', e.target.value)} />
                  </div>
                  <div className="admin-form-group pt-4 border-t border-gray-100">
                    <label className="admin-label text-amber-600 flex items-center gap-2">
                      <Type className="w-4 h-4" /> Card Text Font Size
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="12" 
                        max="36" 
                        step="1" 
                        className="flex-1" 
                        value={content.style?.typography?.missionBodySize || 18} 
                        onChange={(e) => updateContent('style', 'typography', { ...content.style?.typography, missionBodySize: parseInt(e.target.value) })} 
                      />
                      <span className="text-[10px] font-bold text-amber-600">{content.style?.typography?.missionBodySize || 18}px</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Adjusts text size for both Mission and Vision cards to maintain symmetry.</p>
                  </div>
                </div>
              </div>
            )}

            {pageData?.visionCard && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Vision Card</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Image URL</label>
                    <input type="text" className="admin-input" value={pageData.visionCard.image || ''} onChange={(e) => handleInputChange('visionCard', 'image', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Vision Text</label>
                    <textarea className="admin-input min-h-[100px]" value={pageData.visionCard.text || ''} onChange={(e) => handleInputChange('visionCard', 'text', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {pageData?.metrics?.items && Array.isArray(pageData.metrics.items) && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 text-amber-600">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Success Metrics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {pageData.metrics.items.map((item, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <input type="text" className="admin-input text-[10px] font-bold" value={item.label || ''} onChange={(e) => {
                        const newItems = [...pageData.metrics.items];
                        newItems[i] = { ...item, label: e.target.value };
                        handleInputChange('metrics', 'items', newItems);
                      }} />
                      <input type="text" className="admin-input text-lg font-serif text-amber-700" value={item.value || ''} onChange={(e) => {
                        const newItems = [...pageData.metrics.items];
                        newItems[i] = { ...item, value: e.target.value };
                        handleInputChange('metrics', 'items', newItems);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pageData?.pillars && Array.isArray(pageData.pillars) && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100 text-purple-600">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Strategic Pillars</h3>
                </div>
                <div className="space-y-4">
                  {pageData.pillars.map((pillar, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-3 bg-gray-50/30">
                      <input type="text" className="admin-input font-bold" value={pillar.title || ''} onChange={(e) => {
                        const newItems = [...pageData.pillars];
                        newItems[i] = { ...(pillar || {}), title: e.target.value };
                        handleInputChange('', 'pillars', newItems);
                      }} />
                      <textarea className="admin-input text-xs" value={pillar.desc || ''} onChange={(e) => {
                        const newItems = [...pageData.pillars];
                        newItems[i] = { ...(pillar || {}), desc: e.target.value };
                        handleInputChange('', 'pillars', newItems);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Editor (About Page) */}
            {pageData?.team && Array.isArray(pageData.team) && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Executive Team</h3>
                </div>
                <div className="space-y-6">
                  {pageData.team.map((member, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-3 bg-gray-50/30">
                      <div className="flex items-center gap-3">
                        <img src={member.image} className="w-10 h-10 rounded-full object-cover shadow-sm border border-white" alt="" />
                        <input type="text" className="admin-input font-bold" value={member.name || ''} onChange={(e) => {
                          const newTeam = [...pageData.team];
                          newTeam[i] = { ...member, name: e.target.value };
                          handleInputChange('', 'team', newTeam);
                        }} />
                      </div>
                      <input type="text" className="admin-input text-xs" placeholder="Position/Role" value={member.role || ''} onChange={(e) => {
                        const newTeam = [...pageData.team];
                        newTeam[i] = { ...member, role: e.target.value };
                        handleInputChange('', 'team', newTeam);
                      }} />
                      <input type="text" className="admin-input text-[10px]" placeholder="Photo URL" value={member.image || ''} onChange={(e) => {
                        const newTeam = [...pageData.team];
                        newTeam[i] = { ...member, image: e.target.value };
                        handleInputChange('', 'team', newTeam);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pageData?.valuation && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Valuation Section</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Title</label>
                    <input type="text" className="admin-input" value={pageData.valuation.title || ''} onChange={(e) => handleInputChange('valuation', 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Description</label>
                    <textarea className="admin-input min-h-[80px]" value={pageData.valuation.description || ''} onChange={(e) => handleInputChange('valuation', 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {pageData?.items && Array.isArray(pageData.items) && (
              <div className="admin-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                      <Layout className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      {editingPage.key === 'services' ? 'Services List' : 'Portfolio Properties'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      const newItem = editingPage.key === 'services' 
                        ? { id: Date.now(), title: 'New Service', desc: 'Service description...' }
                        : { id: Date.now(), title: 'New Property', location: 'Location', price: '$0.00', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' };
                      handleInputChange('', 'items', [...pageData.items, newItem]);
                    }}
                    className="p-2 bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] rounded-lg hover:bg-[var(--admin-accent)]/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-6">
                  {pageData.items.map((item, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-3 bg-gray-50/50 group/item relative">
                      <button 
                        onClick={() => {
                          const newItems = pageData.items.filter((_, idx) => idx !== i);
                          handleInputChange('', 'items', newItems);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex gap-3">
                         <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                           <img src={item.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div className="flex-1 space-y-2">
                           <input type="text" className="admin-input font-bold" value={item.title || ''} onChange={(e) => {
                             const newItems = [...pageData.items];
                             newItems[i] = { ...item, title: e.target.value };
                             handleInputChange('', 'items', newItems);
                           }} />
                           <input type="text" className="admin-input text-[10px]" placeholder="Image URL" value={item.image || ''} onChange={(e) => {
                             const newItems = [...pageData.items];
                             newItems[i] = { ...item, image: e.target.value };
                             handleInputChange('', 'items', newItems);
                           }} />
                         </div>
                      </div>
                      
                      {item.desc !== undefined && (
                        <textarea className="admin-input text-xs min-h-[60px]" value={item.desc || ''} onChange={(e) => {
                          const newItems = [...pageData.items];
                          newItems[i] = { ...item, desc: e.target.value };
                          handleInputChange('', 'items', newItems);
                        }} />
                      )}
                      
                      {item.location !== undefined && (
                        <div className="grid grid-cols-2 gap-2">
                           <div className="admin-form-group">
                             <label className="text-[9px] uppercase font-bold text-gray-400">Location</label>
                             <input type="text" className="admin-input text-[10px]" value={item.location || ''} onChange={(e) => {
                               const newItems = [...pageData.items];
                               newItems[i] = { ...item, location: e.target.value };
                               handleInputChange('', 'items', newItems);
                             }} />
                           </div>
                           <div className="admin-form-group text-right">
                             <label className="text-[9px] uppercase font-bold text-gray-400">Price / Value</label>
                             <input type="text" className="admin-input text-[10px] text-right" value={item.price || ''} onChange={(e) => {
                               const newItems = [...pageData.items];
                               newItems[i] = { ...item, price: e.target.value };
                               handleInputChange('', 'items', newItems);
                             }} />
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {pageData.items.length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No items added</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {pageData?.info && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 text-green-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Primary Email</label>
                    <input type="text" className="admin-input font-body" value={pageData.info.email || ''} onChange={(e) => handleInputChange('info', 'email', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Headquarters</label>
                    <input type="text" className="admin-input" value={pageData.info.office || ''} onChange={(e) => handleInputChange('info', 'office', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Country</label>
                    <input type="text" className="admin-input" value={pageData.info.country || ''} onChange={(e) => handleInputChange('info', 'country', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={async () => {
                  const success = await saveToServer();
                  if (success) {
                    alert('✅ Changes saved successfully to the server.');
                  } else {
                    alert('❌ Error saving to server. Check your connection.');
                  }
                }}
                className="admin-button admin-button-primary w-full py-4 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Save Changes
              </button>
              <button 
                onClick={() => { if(window.confirm('Reset all content to factory values?')) { resetContent(); setEditingPage(null); } }}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors py-2"
              >
                Reset to default values
              </button>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="xl:col-span-7">
            <div className={`mx-auto transition-all duration-500 overflow-hidden border-[12px] border-gray-900 rounded-[3rem] shadow-2xl bg-white ${
              viewMode === 'mobile' ? 'max-w-[375px] h-[700px]' : 'w-full h-[700px]'
            }`}>
              <div className="bg-gray-100 px-6 py-3 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white rounded-md py-1 px-3 text-[10px] text-gray-400 border border-gray-200 truncate font-sans">
                  synergyglobal.investments{editingPage.slug}
                </div>
              </div>

              <div className="relative h-full bg-white">
                <iframe 
                  id="live-preview-iframe"
                  src={`${window.location.origin}${editingPage.slug}${editingPage.slug.includes('?') ? '&' : '?'}preview=true`}
                  className="w-full h-full border-none"
                  title="Live Preview"
                  key={editingPage.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Content Management</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] font-sans uppercase tracking-[0.2em] mt-1">Visually edit all sections of your website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="admin-card group hover:border-[var(--admin-accent)] transition-all cursor-pointer overflow-hidden p-0" onClick={() => handleEdit(page)}>
            <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
              <img src={page.thumb} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={page.title} />
              <div className="absolute inset-0 bg-[var(--admin-text)]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] bg-[var(--admin-accent)] px-4 py-2 rounded">Edit Page</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-heading text-sm uppercase tracking-wider text-[var(--admin-text)]">{page.title}</h3>
              <p className="text-[10px] text-[var(--admin-text-secondary)] mt-1 font-mono uppercase tracking-widest">{page.slug}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
