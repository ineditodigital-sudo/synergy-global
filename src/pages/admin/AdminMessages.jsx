import React, { useState } from 'react';
import { Mail, User, Clock, Trash2, CheckCircle, Search, Filter } from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alejandro Vargas', email: 'a.vargas@techcorp.com', subject: 'Real Estate Investment', date: '2 hours ago', content: 'I am interested in the Riviera Maya project. Could you send me more information about the projected ROI?', status: 'unread' },
    { id: 2, sender: 'Sarah Johnson', email: 'sjohnson@global.inc', subject: 'Supply Chain Inquiry', date: '5 hours ago', content: 'Looking to optimize our supply chain in Mexico. I saw you have experience in the industrial sector.', status: 'read' },
    { id: 3, sender: 'Roberto Gómez', email: 'roberto.g@inversiones.mx', subject: 'Strategic Partnership', date: '1 day ago', content: 'I would like to schedule a call with the CEO to discuss a possible collaboration in Monterrey.', status: 'replied' },
  ]);

  const toggleStatus = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: m.status === 'unread' ? 'read' : m.status } : m));
  };

  const deleteMessage = (id) => {
    if (window.confirm('Delete this message?')) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading uppercase tracking-wider">Inquiry Inbox</h2>
          <p className="text-[10px] text-[var(--admin-text-secondary)] uppercase tracking-widest mt-1">Review and manage potential client inquiries</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input className="admin-input pl-10 w-64" placeholder="Search messages..." />
           </div>
           <button className="admin-button admin-button-secondary flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filter
           </button>
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer group ${msg.status === 'unread' ? 'border-l-4 border-[var(--admin-accent)]' : ''}`} onClick={() => toggleStatus(msg.id)}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[var(--admin-bg)] rounded-full flex items-center justify-center text-[var(--admin-accent)] font-bold">
                    {msg.sender.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className={`text-sm uppercase tracking-wider ${msg.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{msg.sender}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">{msg.email}</span>
                    </div>
                    <p className="text-xs font-bold text-[var(--admin-accent)] mt-1 uppercase tracking-widest">{msg.subject}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 max-w-2xl">{msg.content}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
                    <Clock className="w-3 h-3" /> {msg.date}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-emerald-500"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="py-20 text-center">
               <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-heading uppercase tracking-widest text-sm">No new messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
