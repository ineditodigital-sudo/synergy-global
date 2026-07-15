import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, ExternalLink, Save, Globe } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminPortfolio = () => {
  const { content, updateContent, saveToServer } = useContent();
  const projects = content.portfolio?.items || [];
  const [editingId, setEditingId] = useState(null);

  const handleUpdate = (id, field, value) => {
    const newItems = projects.map(p => p.id === id ? { ...p, [field]: value } : p);
    updateContent('portfolio', 'items', newItems);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este proyecto del portafolio?')) {
      const newItems = projects.filter(p => p.id !== id);
      updateContent('portfolio', 'items', newItems);
    }
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      title: 'Nuevo Proyecto de Inversión',
      location: 'Ubicación Global',
      price: 'Consultar',
      type: 'Industrial / Commercial',
      specs: 'Track Record Highlight',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    };
    updateContent('portfolio', 'items', [...projects, newItem]);
  };

  const handleSave = async () => {
    const success = await saveToServer();
    if (success) alert('✅ Portafolio de inversión actualizado.');
    else alert('❌ Error al guardar.');
    if (success) alert('✅ Investment portfolio updated.');
    else alert('❌ Error saving.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Investment Portfolio</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Control of assets and strategic global projects</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAdd} className="admin-button admin-button-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </button>
          <button onClick={handleSave} className="admin-button admin-button-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="admin-card group p-0 overflow-hidden relative">
            <div className="h-48 bg-gray-100 relative">
               <img src={project.image} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2 py-0.5 bg-sand/90 text-sage text-[8px] font-bold uppercase tracking-[0.2em] rounded-sm mb-2 inline-block">
                    {project.type}
                  </span>
                  <h3 className="font-heading text-lg text-white truncate">{project.title}</h3>
               </div>
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingId(project.id)} className="p-2.5 bg-white/90 rounded-full text-gray-900 shadow-xl hover:text-blue-600 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-white/90 rounded-full text-gray-900 shadow-xl hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Investment</p>
                  <p className="font-heading text-xl text-sage">{project.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Location</p>
                  <div className="flex items-center gap-1.5 text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                    <Globe className="w-3.5 h-3.5 text-sand" /> {project.location}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setEditingId(project.id)}
                className="w-full py-3 border border-gray-200 text-gray-600 text-[9px] font-bold uppercase tracking-[0.3em] rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                Manage Full Asset Details <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Property Editor Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-heading uppercase tracking-widest text-sage">Asset Configuration</h3>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mt-1">Detailed management for: {projects.find(p => p.id === editingId)?.title}</p>
              </div>
              <button onClick={() => setEditingId(null)} className="p-2.5 hover:bg-white rounded-full transition-all border border-gray-200 shadow-sm">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Visuals & Core Info */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="relative group rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                    <img src={projects.find(p => p.id === editingId)?.image} className="w-full aspect-[4/3] object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white text-[10px] font-bold uppercase tracking-widest">Preview Only</p>
                    </div>
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-label">Property Title</label>
                    <input className="admin-input" value={projects.find(p => p.id === editingId)?.title} onChange={(e) => handleUpdate(editingId, 'title', e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="admin-form-group">
                      <label className="admin-label">Investment Price</label>
                      <input className="admin-input font-heading text-lg" value={projects.find(p => p.id === editingId)?.price} onChange={(e) => handleUpdate(editingId, 'price', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Location</label>
                      <input className="admin-input" value={projects.find(p => p.id === editingId)?.location} onChange={(e) => handleUpdate(editingId, 'location', e.target.value)} />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Image/Poster URL</label>
                    <input className="admin-input text-[10px]" value={projects.find(p => p.id === editingId)?.image} onChange={(e) => handleUpdate(editingId, 'image', e.target.value)} />
                  </div>
                </div>

                {/* Right Column: Descriptions & Lists */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="admin-form-group">
                    <label className="admin-label">Executive Description</label>
                    <textarea 
                      className="admin-input min-h-[160px] leading-relaxed text-sm" 
                      value={projects.find(p => p.id === editingId)?.description} 
                      onChange={(e) => handleUpdate(editingId, 'description', e.target.value)}
                      placeholder="Comprehensive overview of the asset and investment opportunity..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Specs Object Editor */}
                    <div className="space-y-4">
                      <label className="admin-label flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" /> Technical Specs
                      </label>
                      <div className="p-5 bg-gray-50 rounded-2xl space-y-4 border border-gray-100">
                        {['beds', 'baths', 'area', 'year', 'lot'].map(key => (
                          <div key={key} className="flex items-center gap-3">
                            <span className="w-16 text-[9px] uppercase font-bold text-gray-400">{key}</span>
                            <input 
                              className="admin-input text-xs py-2" 
                              placeholder="e.g. 6"
                              value={projects.find(p => p.id === editingId)?.specs?.[key] || ''}
                              onChange={(e) => {
                                const currentSpecs = projects.find(p => p.id === editingId)?.specs || {};
                                handleUpdate(editingId, 'specs', { ...currentSpecs, [key]: e.target.value });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features Array Editor */}
                    <div className="space-y-4">
                      <label className="admin-label flex items-center gap-2">
                        <Save className="w-3.5 h-3.5" /> Features & Amenities
                      </label>
                      <textarea 
                        className="admin-input min-h-[180px] text-xs leading-loose"
                        placeholder="Private Gym, Wine Cellar, Smart Home System... (Comma separated)"
                        value={Array.isArray(projects.find(p => p.id === editingId)?.features) ? projects.find(p => p.id === editingId)?.features.join(', ') : ''}
                        onChange={(e) => handleUpdate(editingId, 'features', e.target.value.split(',').map(f => f.trim()).filter(f => f !== ''))}
                      />
                      <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest text-center">Separate items with commas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setEditingId(null)}
                className="admin-button admin-button-primary w-full py-5 text-sm tracking-[0.4em]"
              >
                Sync with Portfolio and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
