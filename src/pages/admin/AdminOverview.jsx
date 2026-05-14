import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Home, 
  MousePointer2,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle2
} from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    { label: 'Vistas Totales', value: '12,450', change: '+12%', icon: <Eye />, color: 'blue' },
    { label: 'Propiedades', value: '24', change: '+2', icon: <Home />, color: 'purple' },
    { label: 'Miembros', value: '15', change: '0', icon: <Users />, color: 'green' },
    { label: 'Leads de Contacto', value: '84', change: '+18%', icon: <MousePointer2 />, color: 'orange' },
  ];

  const recentActivity = [
    { type: 'property', title: 'Nueva propiedad añadida: Villa Mar', time: 'Hace 2 horas', status: 'published' },
    { type: 'member', title: 'Perfil de Juan Pérez actualizado', time: 'Hace 5 horas', status: 'updated' },
    { type: 'message', title: 'Nuevo mensaje de contacto de: Elena M.', time: 'Hace 1 día', status: 'new' },
    { type: 'content', title: 'Página "Misión" editada', time: 'Hace 2 días', status: 'saved' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="admin-card">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="admin-card-title">{stat.label}</p>
              <p className="admin-card-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 admin-card overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Rendimiento del Sitio</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium bg-gray-100 rounded-lg">7D</button>
              <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg">30D</button>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl flex items-end justify-between p-6 gap-2">
            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 60, 75, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {1000 + (h * 10)} vistas
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-xs text-gray-400 font-medium px-2">
            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Actividad Reciente</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">Ver todo</button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  {i !== recentActivity.length - 1 && <div className="absolute top-4 left-[3px] w-[1px] h-10 bg-gray-100"></div>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{activity.time}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[10px] text-gray-500 font-medium">#{activity.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card border-l-4 border-blue-500">
          <h4 className="font-medium mb-2">Editar Hero Section</h4>
          <p className="text-sm text-gray-500 mb-4">Actualiza el título principal y la imagen cinematográfica del inicio.</p>
          <button className="text-sm text-blue-600 font-bold flex items-center gap-1">
            Ir a editor <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="admin-card border-l-4 border-purple-500">
          <h4 className="font-medium mb-2">Nueva Propiedad</h4>
          <p className="text-sm text-gray-500 mb-4">Añade un nuevo activo al catálogo de Synergy Global.</p>
          <button className="text-sm text-purple-600 font-bold flex items-center gap-1">
            Crear ahora <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="admin-card border-l-4 border-orange-500">
          <h4 className="font-medium mb-2">Ajustes de Estilo</h4>
          <p className="text-sm text-gray-500 mb-4">Modifica la paleta de colores y tipografías globales.</p>
          <button className="text-sm text-orange-600 font-bold flex items-center gap-1">
            Personalizar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
