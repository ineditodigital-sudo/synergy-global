import React, { useState } from 'react';
import { GripVertical, Plus, Edit2, Trash2, Link as LinkIcon, ChevronRight, Save } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminNavigation = () => {
  const { content, updateContent, saveToServer } = useContent();
  const menuItems = content.navigation?.mainMenu || [];
  const [editingId, setEditingId] = useState(null);

  const handleUpdate = (id, field, value) => {
    const newMenu = menuItems.map(item => item.id === id ? { ...item, [field]: value } : item);
    updateContent('navigation', 'mainMenu', newMenu);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this menu link?')) {
      const newMenu = menuItems.filter(item => item.id !== id);
      updateContent('navigation', 'mainMenu', newMenu);
    }
  };

  const handleAdd = () => {
    const newItem = { id: Date.now(), label: 'New Link', path: '/' };
    updateContent('navigation', 'mainMenu', [...menuItems, newItem]);
  };

  const handleSave = async () => {
    const success = await saveToServer();
    if (success) alert('✅ Menu updated successfully.');
    else alert('❌ Error while saving.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Menus and Navigation</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Configure the main site access points</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="admin-button admin-button-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <h3 className="font-heading text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" /> Main Menu Structure
            </h3>
            
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="p-4 bg-gray-50/50 rounded border border-gray-100 flex justify-between items-center group hover:border-[var(--admin-accent)] transition-colors">
                    {editingId === item.id ? (
                      <div className="flex-1 flex gap-4">
                        <input className="admin-input flex-1" value={item.label} onChange={(e) => handleUpdate(item.id, 'label', e.target.value)} placeholder="Label" />
                        <input className="admin-input flex-1" value={item.path} onChange={(e) => handleUpdate(item.id, 'path', e.target.value)} placeholder="Path" />
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-[var(--admin-accent)] text-white rounded text-[10px] font-bold uppercase tracking-widest">OK</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                          <div>
                            <span className="font-medium text-[var(--admin-text)] uppercase tracking-widest text-xs">{item.label}</span>
                            <span className="text-[10px] text-[var(--admin-text-secondary)] ml-3 font-mono">{item.path}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingId(item.id)} className="p-2 text-gray-400 hover:text-[var(--admin-accent)] rounded"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={handleAdd} className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 rounded-xl text-sm text-gray-500 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <h3 className="font-heading text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[var(--admin-accent)]" /> Header Configuration
            </h3>
            <div className="space-y-4">
              <div className="admin-form-group">
                <label className="admin-label">Header Logo</label>
                <div className="w-full h-20 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  Current logo: synergy-logo.svg
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--admin-bg)] rounded border border-[var(--admin-border)]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text)]">Sticky Header</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--admin-accent)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
