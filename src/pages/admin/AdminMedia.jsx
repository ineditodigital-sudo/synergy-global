import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Copy, Check, Upload, Search, Filter } from 'lucide-react';

const AdminMedia = () => {
  const [copied, setCopied] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Mock media library
  const [media, setMedia] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', name: 'Home Hero.jpg', size: '1.2 MB', date: '2026-05-10' },
    { id: 2, url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', name: 'Building Exterior.jpg', size: '2.4 MB', date: '2026-05-11' },
    { id: 3, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', name: 'Office Interior.jpg', size: '1.8 MB', date: '2026-05-12' },
    { id: 4, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', name: 'Luxury Villa.jpg', size: '3.1 MB', date: '2026-05-13' },
    { id: 5, url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', name: 'Logistics Center.jpg', size: '1.5 MB', date: '2026-05-14' },
  ]);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
        name: 'Uploaded File.jpg',
        size: '0.9 MB',
        date: new Date().toISOString().split('T')[0]
      };
      setMedia([newFile, ...media]);
      setUploading(false);
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this asset?')) {
      setMedia(media.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Asset Library</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Manage and upload high-resolution media assets</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleUpload} disabled={uploading} className="admin-button admin-button-primary flex items-center gap-2">
            {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div className="col-span-full flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input type="text" placeholder="Search assets by name..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--admin-accent)]" />
          </div>
          <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {media.map((item) => (
          <div key={item.id} className="admin-card p-0 overflow-hidden group">
            <div className="h-40 bg-gray-100 relative overflow-hidden">
               <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
               <div className="absolute inset-0 bg-[var(--admin-text)]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleCopy(item.url, item.id)} className="p-2 bg-white rounded-full text-[var(--admin-text)] hover:bg-[var(--admin-accent)] hover:text-white transition-all transform hover:scale-110">
                    {copied === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
            <div className="p-3">
               <p className="text-xs font-bold text-[var(--admin-text)] truncate">{item.name}</p>
               <div className="flex justify-between items-center mt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">{item.size}</span>
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">{item.date}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMedia;
