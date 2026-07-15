import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, ExternalLink, Save, X, Globe, Briefcase } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminMembers = () => {
  const { content, updateContent, saveToServer } = useContent();
  const team = content.about?.team || [];
  const [editingMember, setEditingMember] = useState(null);
  const [isDetailedView, setIsDetailedView] = useState(false);

  const handleUpdateMember = (id, field, value) => {
    const newTeam = team.map(m => m.id === id ? { ...m, [field]: value } : m);
    updateContent('about', 'team', newTeam);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Remove this team member?')) {
      const newTeam = team.filter(m => m.id !== id);
      updateContent('about', 'team', newTeam);
    }
  };

  const handleAddMember = () => {
    const newMember = {
      id: Date.now(),
      name: 'New Member',
      role: 'Position / Title',
      email: 'email@synergy.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'Professional biography goes here...',
      specialties: ['Strategy', 'Real Estate'],
      locations: ['Global'],
      status: 'active'
    };
    updateContent('about', 'team', [...team, newMember]);
  };

  const handleSave = async () => {
    const success = await saveToServer();
    if (success) alert('✅ Team updated successfully.');
    else alert('❌ Error saving changes.');
  };

  const currentMember = team.find(m => m.id === editingMember);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Synergy Team</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Manage the firm's talent and leadership</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAddMember} className="admin-button admin-button-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Member
          </button>
          <button onClick={handleSave} className="admin-button admin-button-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="admin-card group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded object-cover border-2 border-white shadow-md" />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  member.isHidden ? 'bg-gray-400' : 'bg-emerald-500'
                }`}></span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingMember(member.id); setIsDetailedView(true); }} className="p-2 text-gray-400 hover:text-[var(--admin-accent)] rounded"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteMember(member.id)} className="p-2 text-gray-400 hover:text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <h3 className="font-heading text-sm uppercase tracking-wider text-[var(--admin-text)]">{member.name}</h3>
            <p className="text-[10px] text-[var(--admin-accent)] font-bold uppercase tracking-[0.2em] mb-4">{member.role}</p>
            
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-4 h-4" /> {member.email}
              </div>
            </div>

            <button onClick={() => { setEditingMember(member.id); setIsDetailedView(true); }} className="w-full mt-6 py-3 bg-[var(--admin-bg)] text-[var(--admin-text)] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[var(--admin-accent)]/10 transition-colors flex items-center justify-center gap-2">
              Edit Full Profile <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
        {team.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
             <p className="text-gray-400 font-heading uppercase tracking-widest text-sm">No members found</p>
          </div>
        )}
      </div>

      {/* Detailed Edit Overlay */}
      {isDetailedView && currentMember && (
        <div className="fixed inset-0 bg-[var(--admin-text)]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-heading uppercase tracking-widest">Edit Member Profile</h3>
              <button onClick={() => setIsDetailedView(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div className="admin-form-group">
                    <label className="admin-label">Full Name</label>
                    <input className="admin-input" value={currentMember.name} onChange={(e) => handleUpdateMember(currentMember.id, 'name', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Role / Position</label>
                    <input className="admin-input" value={currentMember.role} onChange={(e) => handleUpdateMember(currentMember.id, 'role', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Email Address</label>
                    <input className="admin-input" value={currentMember.email} onChange={(e) => handleUpdateMember(currentMember.id, 'email', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Profile Image URL</label>
                    <input className="admin-input" value={currentMember.image} onChange={(e) => handleUpdateMember(currentMember.id, 'image', e.target.value)} />
                  </div>
                  <div className="admin-form-group mt-6">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={currentMember.isHidden || false} onChange={(e) => handleUpdateMember(currentMember.id, 'isHidden', e.target.checked)} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${currentMember.isHidden ? 'bg-[var(--admin-accent)]' : 'bg-gray-200'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${currentMember.isHidden ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--admin-text)]">Hide Member Profile</div>
                        <div className="text-[10px] text-gray-400">Keep data but hide from website carousels</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Photo Preview */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6">
                  <img src={currentMember.image} className="w-48 h-60 object-cover rounded-xl shadow-xl mb-4" alt="" />
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Live Profile Preview</p>
                </div>
              </div>

              {/* Bio / Full Story */}
              <div className="admin-form-group">
                <label className="admin-label">Professional Biography</label>
                <textarea 
                  className="admin-input min-h-[150px] leading-relaxed" 
                  value={currentMember.bio} 
                  onChange={(e) => handleUpdateMember(currentMember.id, 'bio', e.target.value)}
                  placeholder="Detailed biography that appears on the individual profile page..."
                />
              </div>

              {/* Specialties & Markets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="admin-label">Specialties (Comma separated)</label>
                  <textarea 
                    className="admin-input min-h-[80px]" 
                    value={currentMember.specialties?.join(', ')} 
                    onChange={(e) => handleUpdateMember(currentMember.id, 'specialties', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="e.g. Real Estate, Global Trade, Law"
                  />
                </div>
                <div className="space-y-4">
                  <label className="admin-label">Key Markets (Comma separated)</label>
                  <textarea 
                    className="admin-input min-h-[80px]" 
                    value={currentMember.locations?.join(', ')} 
                    onChange={(e) => handleUpdateMember(currentMember.id, 'locations', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="e.g. California, Mexico City, Madrid"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={() => setIsDetailedView(false)} 
                  className="admin-button admin-button-primary w-full py-4 text-sm tracking-[0.2em]"
                >
                  Confirm and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
