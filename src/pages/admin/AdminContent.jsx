import React, { useState } from 'react';
import { 
  Edit2, Eye, Save, Trash2, Plus, Image as ImageIcon, 
  ChevronRight, Layout, Monitor, Smartphone, Check, 
  MousePointer2, Target, Zap, Mail, Globe, ShieldCheck 
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminContent = () => {
  const { content, updateContent, resetContent } = useContent();
  const [editingPage, setEditingPage] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); 
  const [activeSection, setActiveSection] = useState('hero');
  const previewScrollRef = React.useRef(null);

  const pages = [
    { id: 1, title: 'Inicio (Home)', slug: '/', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400', key: 'home' },
    { id: 2, title: 'Misión y Visión', slug: '/mission', thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', key: 'mission' },
    { id: 3, title: 'Sobre Nosotros (Leadership)', slug: '/about', thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', key: 'about' },
    { id: 4, title: 'Portafolio', slug: '/portfolio', thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400', key: 'portfolio' },
    { id: 5, title: 'Servicios', slug: '/services', thumb: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400', key: 'services' },
    { id: 6, title: 'Contacto', slug: '/contact', thumb: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=400', key: 'contact' }
  ];

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
          
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
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
                  <div className="w-12 h-12 bg-blue-50 rounded-xl overflow-hidden border border-blue-100 flex items-center justify-center">
                    <img src={safeHero.backgroundImage} className="w-full h-full object-cover opacity-50" alt="" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Sección Hero</h3>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Cabecera Principal</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Etiqueta Superior</label>
                    <input type="text" className="admin-input" value={safeHero.badge} onChange={(e) => handleInputChange('hero', 'badge', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Título</label>
                    <input type="text" className="admin-input" value={safeHero.title} onChange={(e) => handleInputChange('hero', 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Subtítulo</label>
                    <input type="text" className="admin-input" value={safeHero.subtitle} onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)} />
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
                    <h3 className="font-bold text-gray-900">Encabezado de Página</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Título Superior</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Etiqueta (Badge)</label>
                    <input type="text" className="admin-input" value={safeHeader.badge} onChange={(e) => handleInputChange('header', 'badge', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Título Principal</label>
                    <input type="text" className="admin-input" value={safeHeader.title} onChange={(e) => handleInputChange('header', 'title', e.target.value)} />
                  </div>
                  {safeHeader.subtitle !== undefined && (
                    <div className="admin-form-group">
                      <label className="admin-label">Subtítulo</label>
                      <input type="text" className="admin-input" value={safeHeader.subtitle} onChange={(e) => handleInputChange('header', 'subtitle', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mission/Vision Card Editors with Images */}
            {pageData?.missionCard && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Tarjeta de Misión</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">URL de Imagen</label>
                    <input type="text" className="admin-input" value={pageData.missionCard.image || ''} onChange={(e) => handleInputChange('missionCard', 'image', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Texto de Misión</label>
                    <textarea className="admin-input min-h-[100px]" value={pageData.missionCard.text || ''} onChange={(e) => handleInputChange('missionCard', 'text', e.target.value)} />
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
                  <h3 className="font-bold text-gray-900">Tarjeta de Visión</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">URL de Imagen</label>
                    <input type="text" className="admin-input" value={pageData.visionCard.image || ''} onChange={(e) => handleInputChange('visionCard', 'image', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Texto de Visión</label>
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
                  <h3 className="font-bold text-gray-900">Métricas de Éxito</h3>
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
                  <h3 className="font-bold text-gray-900">Pilares Estratégicos</h3>
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
                  <h3 className="font-bold text-gray-900">Equipo Directivo</h3>
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
                      <input type="text" className="admin-input text-xs" placeholder="Cargo/Rol" value={member.role || ''} onChange={(e) => {
                        const newTeam = [...pageData.team];
                        newTeam[i] = { ...member, role: e.target.value };
                        handleInputChange('', 'team', newTeam);
                      }} />
                      <input type="text" className="admin-input text-[10px]" placeholder="URL de Foto" value={member.image || ''} onChange={(e) => {
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
                  <h3 className="font-bold text-gray-900">Sección de Valuación</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Título</label>
                    <input type="text" className="admin-input" value={pageData.valuation.title || ''} onChange={(e) => handleInputChange('valuation', 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Descripción</label>
                    <textarea className="admin-input min-h-[80px]" value={pageData.valuation.description || ''} onChange={(e) => handleInputChange('valuation', 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {pageData?.items && Array.isArray(pageData.items) && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <Layout className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">
                    {editingPage.key === 'services' ? 'Lista de Servicios' : 'Propiedades en Portafolio'}
                  </h3>
                </div>
                <div className="space-y-6">
                  {pageData.items.map((item, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-3 bg-gray-50/50">
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
                           <input type="text" className="admin-input text-[10px]" placeholder="URL de Imagen" value={item.image || ''} onChange={(e) => {
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
                             <label className="text-[9px] uppercase font-bold text-gray-400">Ubicación</label>
                             <input type="text" className="admin-input text-[10px]" value={item.location || ''} onChange={(e) => {
                               const newItems = [...pageData.items];
                               newItems[i] = { ...item, location: e.target.value };
                               handleInputChange('', 'items', newItems);
                             }} />
                           </div>
                           <div className="admin-form-group text-right">
                             <label className="text-[9px] uppercase font-bold text-gray-400">Precio / Valor</label>
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
                </div>
              </div>
            )}

            {pageData?.info && (
              <div className="admin-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 text-green-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">Información de Contacto</h3>
                </div>
                <div className="space-y-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Email Principal</label>
                    <input type="text" className="admin-input font-body" value={pageData.info.email || ''} onChange={(e) => handleInputChange('info', 'email', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Oficina Central</label>
                    <input type="text" className="admin-input" value={pageData.info.office || ''} onChange={(e) => handleInputChange('info', 'office', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">País</label>
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
                    alert('✅ Cambios guardados correctamente en el servidor.');
                  } else {
                    alert('❌ Error al guardar en el servidor. Verifica tu conexión.');
                  }
                }}
                className="admin-button admin-button-primary w-full py-4 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Guardar Cambios
              </button>
              <button 
                onClick={() => { if(window.confirm('¿Restablecer todo el contenido a valores de fábrica?')) { resetContent(); setEditingPage(null); } }}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors py-2"
              >
                Restablecer a valores predeterminados
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
          <h2 className="text-2xl font-bold font-heading">Gestión de Contenido</h2>
          <p className="text-sm text-gray-500 font-sans">Edita visualmente todas las secciones de tu sitio web.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="admin-card group hover:border-blue-300 transition-all cursor-pointer overflow-hidden p-0" onClick={() => handleEdit(page)}>
            <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
              <img src={page.thumb} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={page.title} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] bg-blue-600 px-4 py-2 rounded-full">Editar Página</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 font-heading">{page.title}</h3>
              <p className="text-[10px] text-gray-400 mt-1 font-sans uppercase tracking-widest">{page.slug}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
