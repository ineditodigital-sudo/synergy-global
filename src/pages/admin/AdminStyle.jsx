import React from 'react';
import { Save, RotateCcw, Palette, Type, Square, RefreshCcw } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminStyle = () => {
  const { content, updateContent } = useContent();
  const primaryColor = content.colors.primary;
  const secondaryColor = content.colors.secondary;
  
  const handleColorChange = (type, value) => {
    updateContent('colors', { [type]: value });
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Identidad Visual</h2>
        <div className="flex gap-3">
          <button className="admin-button admin-button-secondary flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Restaurar
          </button>
          <button className="admin-button admin-button-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Aplicar Estilos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Palette */}
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Paleta de Colores</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Color Primario (Luxury Gold)</p>
                <p className="text-xs text-gray-500">Usado en acentos, botones y elementos destacados.</p>
              </div>
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono bg-white px-2 py-1 border border-gray-200 rounded">{primaryColor.toUpperCase()}</code>
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Color Secundario (Deep Black)</p>
                <p className="text-xs text-gray-500">Usado en textos principales y fondos oscuros.</p>
              </div>
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono bg-white px-2 py-1 border border-gray-200 rounded">{secondaryColor.toUpperCase()}</code>
                <input 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-medium text-gray-900 mb-4">Acentos Sugeridos</p>
              <div className="flex gap-4">
                {['#F5F5F7', '#C6B7A0', '#1D1D1F', '#86868B', '#0071E3'].map((color) => (
                  <button 
                    key={color} 
                    onClick={() => handleColorChange('primary', color)}
                    className="w-8 h-8 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Tipografía</h3>
          </div>

          <div className="space-y-6">
            <div className="admin-form-group">
              <label className="admin-label">Fuente Principal (Headings)</label>
              <select className="admin-select">
                <option>Inter (Recomendado)</option>
                <option>Outfit</option>
                <option>Playfair Display</option>
                <option>Montserrat</option>
              </select>
              <p className="text-xs text-gray-400 mt-2 italic">"Excelencia y Prestigio Global"</p>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Fuente de Cuerpo</label>
              <select className="admin-select">
                <option>Roboto</option>
                <option>Inter</option>
                <option>Open Sans</option>
              </select>
              <p className="text-xs text-gray-400 mt-2">Lectura clara y profesional para párrafos largos.</p>
            </div>
          </div>
        </div>

        {/* UI Style */}
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-6">
            <Square className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Elementos de UI</h3>
          </div>

          <div className="space-y-6">
            <div className="admin-form-group">
              <label className="admin-label">Redondeado de Bordes (Border Radius)</label>
              <input type="range" min="0" max="24" defaultValue="12" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold uppercase">
                <span>Recto</span>
                <span>Suave</span>
                <span>Redondo</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Efecto Glassmorphism</p>
                <p className="text-xs text-gray-500">Transparencia y desenfoque en menús.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="admin-card border-blue-100 bg-blue-50/30">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-blue-600" /> Vista Previa Instantánea
          </h3>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
            <div className="h-6 w-32 bg-gray-100 rounded"></div>
            <h4 className="text-xl font-bold" style={{ color: primaryColor }}>Inversión de Lujo</h4>
            <p className="text-sm text-gray-600">Este es un ejemplo de cómo se verá tu sitio con los nuevos colores y tipografías aplicadas.</p>
            <button className="px-6 py-2 rounded-lg text-white font-bold transition-all shadow-md" style={{ backgroundColor: primaryColor }}>
              Saber más
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStyle;
