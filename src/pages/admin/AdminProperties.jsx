import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Home, MapPin, DollarSign, Save, LayoutGrid } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminProperties = () => {
  const { content, updateContent, saveToServer } = useContent();
  const properties = content.portfolio?.items || [];
  const [editingId, setEditingId] = useState(null);

  const handleUpdate = (id, field, value) => {
    const newItems = properties.map(p => p.id === id ? { ...p, [field]: value } : p);
    updateContent('portfolio', 'items', newItems);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta propiedad?')) {
      const newItems = properties.filter(p => p.id !== id);
      updateContent('portfolio', 'items', newItems);
    }
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      title: 'Nueva Propiedad / Activo',
      location: 'Ciudad, País',
      price: '$0.00',
      type: 'Residencial',
      specs: '0 Habitaciones | 0 Baños',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    };
    updateContent('portfolio', 'items', [...properties, newItem]);
  };

  const handleSave = async () => {
    const success = await saveToServer();
    if (success) alert('✅ Catálogo actualizado correctamente.');
    else alert('❌ Error al guardar.');
    if (success) alert('✅ Catalog updated successfully.');
    else alert('❌ Error saving changes.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Property Catalog</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Manage available real estate assets</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAdd} className="admin-button admin-button-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Property
          </button>
          <button onClick={handleSave} className="admin-button admin-button-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((prop) => (
          <div key={prop.id} className="admin-card group">
            {editingId === prop.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Title</label>
                    <input className="admin-input" value={prop.title} onChange={(e) => handleUpdate(prop.id, 'title', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Price</label>
                    <input className="admin-input" value={prop.price} onChange={(e) => handleUpdate(prop.id, 'price', e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Image URL</label>
                  <input className="admin-input" value={prop.image} onChange={(e) => handleUpdate(prop.id, 'image', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="admin-form-group">
                    <label className="admin-label">Location</label>
                    <input className="admin-input" value={prop.location} onChange={(e) => handleUpdate(prop.id, 'location', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Specs</label>
                    <input className="admin-input" value={prop.specs} onChange={(e) => handleUpdate(prop.id, 'specs', e.target.value)} />
                  </div>
                </div>
                <button onClick={() => setEditingId(null)} className="w-full py-2 bg-[var(--admin-accent)] text-white rounded text-[10px] font-bold uppercase tracking-widest">Finish Editing</button>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={prop.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-[var(--admin-text)] truncate">{prop.title}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingId(prop.id)} className="p-1.5 text-gray-400 hover:text-[var(--admin-accent)]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(prop.id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-[var(--admin-accent)] font-bold text-xs mt-1">{prop.price}</p>
                  <div className="mt-4 space-y-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {prop.location}</div>
                    <div className="flex items-center gap-2"><LayoutGrid className="w-3 h-3" /> {prop.specs}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProperties;
