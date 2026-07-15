import React from 'react';
import { 
  Users, 
  Home, 
  MousePointer2,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AdminOverview = () => {
  const { content } = useContent();
  const propertiesCount = content.portfolio?.items?.length || 0;
  const membersCount = content.about?.team?.length || 0;

  const stats = [
    { label: 'Total Views', value: '12,450', change: '+12%', icon: <Eye />, color: 'var(--admin-accent)' },
    { label: 'Properties', value: propertiesCount.toString(), change: '+2', icon: <Home />, color: 'var(--admin-accent)' },
    { label: 'Members', value: membersCount.toString(), change: '0', icon: <Users />, color: 'var(--admin-accent)' },
    { label: 'Contact Leads', value: '84', change: '+18%', icon: <MousePointer2 />, color: 'var(--admin-accent)' },
  ];

  const recentActivity = [
    { type: 'property', title: 'New property added: Villa Mar', time: '2 hours ago', status: 'published' },
    { type: 'member', title: 'Juan Pérez profile updated', time: '5 hours ago', status: 'updated' },
    { type: 'message', title: 'New contact message from: Elena M.', time: '1 day ago', status: 'new' },
    { type: 'content', title: '"Mission" page edited', time: '2 days ago', status: 'saved' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="admin-card">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'
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
            <h3 className="font-heading text-lg uppercase tracking-wider">Site Performance</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-[10px] font-bold bg-gray-100 rounded uppercase tracking-wider">7D</button>
              <button className="px-3 py-1 text-[10px] font-bold bg-[var(--admin-text)] text-white rounded uppercase tracking-wider">30D</button>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-end justify-between p-6 gap-2">
            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 60, 75, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-[var(--admin-accent)]/20 rounded-t-sm hover:bg-[var(--admin-accent)] transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--admin-text)] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {1000 + (h * 10)} views
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-xs text-gray-400 font-medium px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg uppercase tracking-wider">Recent Activity</h3>
            <button className="text-[var(--admin-accent)] text-xs font-bold uppercase tracking-widest hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-2 h-2 bg-[var(--admin-accent)] rounded-full mt-2"></div>
                  {i !== recentActivity.length - 1 && <div className="absolute top-4 left-[3px] w-[1px] h-10 bg-[var(--admin-border)]"></div>}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--admin-text)] group-hover:text-[var(--admin-accent)] transition-colors">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[var(--admin-text-secondary)] uppercase font-bold tracking-wider">{activity.time}</span>
                    <span className="w-1 h-1 bg-[var(--admin-border)] rounded-full"></span>
                    <span className="text-[10px] text-[var(--admin-text-secondary)] font-medium">#{activity.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card border-l-4 border-[var(--admin-accent)]">
          <h4 className="font-heading uppercase tracking-wider text-sm mb-2">Edit Hero Section</h4>
          <p className="text-xs text-[var(--admin-text-secondary)] mb-4 leading-relaxed">Update the main title and cinematic image of the home page.</p>
          <button className="text-[10px] text-[var(--admin-accent)] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            Go to editor <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="admin-card border-l-4 border-[var(--admin-text)]">
          <h4 className="font-heading uppercase tracking-wider text-sm mb-2">New Property</h4>
          <p className="text-xs text-[var(--admin-text-secondary)] mb-4 leading-relaxed">Add a new asset to the Synergy Global catalog.</p>
          <button className="text-[10px] text-[var(--admin-accent)] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            Create now <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="admin-card border-l-4 border-[var(--admin-accent)]">
          <h4 className="font-heading uppercase tracking-wider text-sm mb-2">Style Settings</h4>
          <p className="text-xs text-[var(--admin-text-secondary)] mb-4 leading-relaxed">Modify the global color palette and typography.</p>
          <button className="text-[10px] text-[var(--admin-accent)] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            Customize <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
