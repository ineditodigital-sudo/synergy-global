import React from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, ExternalLink } from 'lucide-react';

const AdminMembers = () => {
  const members = [
    { id: 1, name: 'Sujon Miah', role: 'Fundador & CEO', email: 'sujon@synergy.com', status: 'active', image: 'https://i.pravatar.cc/150?u=sujon' },
    { id: 2, name: 'Elena Rodriguez', role: 'Directora de Inversiones', email: 'elena@synergy.com', status: 'active', image: 'https://i.pravatar.cc/150?u=elena' },
    { id: 3, name: 'Marcus Chen', role: 'Asesor Senior Real Estate', email: 'marcus@synergy.com', status: 'away', image: 'https://i.pravatar.cc/150?u=marcus' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipo Synergy</h2>
        <button className="admin-button admin-button-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Añadir Miembro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="admin-card group">
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  member.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                }`}></span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
            <p className="text-sm text-blue-600 font-medium mb-4">{member.role}</p>
            
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-4 h-4" /> {member.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="w-4 h-4" /> +1 (555) 123-4567
              </div>
            </div>

            <button className="w-full mt-6 py-2 bg-gray-50 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Ver Perfil Público <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMembers;
