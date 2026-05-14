import React from 'react';
import { GripVertical, Plus, Edit2, Trash2, Link as LinkIcon, ChevronRight } from 'lucide-react';

const AdminNavigation = () => {
  const menuItems = [
    { id: 1, label: 'Inicio', path: '/' },
    { id: 2, label: 'Sobre Nosotros', path: '/about' },
    { id: 3, label: 'Servicios', path: '/services', children: [
      { id: 31, label: 'Supply Chain', path: '/services/supply-chain' },
      { id: 32, label: 'Real Estate', path: '/services/real-estate' },
    ]},
    { id: 4, label: 'Propiedades', path: '/portfolio' },
    { id: 5, label: 'Contacto', path: '/contact' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menús y Navegación</h2>
        <button className="admin-button admin-button-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Menú
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" /> Estructura del Menú Principal
            </h3>
            
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                      <div>
                        <span className="font-medium text-gray-900">{item.label}</span>
                        <span className="text-xs text-gray-400 ml-3">{item.path}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  {item.children && (
                    <div className="ml-12 space-y-2 border-l-2 border-gray-100 pl-4">
                      {item.children.map((child) => (
                        <div key={child.id} className="p-3 bg-white rounded-lg border border-gray-100 flex justify-between items-center group hover:border-blue-100">
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-gray-200" />
                            <span className="text-sm font-medium text-gray-700">{child.label}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                      <button className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-2 hover:underline">
                        <Plus className="w-3 h-3" /> Añadir sub-elemento
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 rounded-xl text-sm text-gray-500 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Añadir elemento al menú
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-600" /> Configuración del Header
            </h3>
            <div className="space-y-4">
              <div className="admin-form-group">
                <label className="admin-label">Logo del Header</label>
                <div className="w-full h-20 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  Logo actual: synergy-logo.svg
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Header Pegajoso (Sticky)</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card border-orange-100">
            <h3 className="font-semibold mb-2">Consejo de Experto</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mantén el menú principal con menos de 6 elementos para asegurar una visualización óptima en tablets y laptops pequeñas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
