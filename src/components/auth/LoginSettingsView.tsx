import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { PortalCredential } from '../../types';
import { 
  KeyRound, 
  Search, 
  Edit3, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Mail, 
  Lock,
  Building,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const LoginSettingsView: React.FC = () => {
  const [credentials, setCredentials] = useState<PortalCredential[]>(StorageService.getPortalCredentials());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  
  // Edit modal state
  const [editingCred, setEditingCred] = useState<PortalCredential | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleShowPassword = (id: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openEdit = (cred: PortalCredential) => {
    setEditingCred(cred);
    setEditName(cred.name);
    setEditEmail(cred.email);
    setEditPassword(cred.password);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCred || !editEmail.trim() || !editPassword.trim()) return;

    const updated = credentials.map(c => 
      c.id === editingCred.id 
        ? { ...c, name: editName, email: editEmail.trim(), password: editPassword.trim() } 
        : c
    );

    setCredentials(updated);
    StorageService.savePortalCredentials(updated);
    StorageService.logAction('Admin', 'Security & Credentials', 'Updated Portal Login', `Updated login credentials for ${editingCred.portalName} (${editEmail})`);
    
    setEditingCred(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const filtered = credentials.filter(c => {
    const matchSearch = 
      c.portalName.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || c.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#800000]" />
            <span>Portal Login Credentials & Security Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure official email addresses and login passwords for Teacher Portals (Kacha Khuh Campus), Administration, and Office desks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold font-mono">
            {credentials.length} Configured Logins
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Login credentials updated and synced successfully! You can now log into that portal with the new email/password.</span>
        </div>
      )}

      {/* Quick Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by teacher portal name, faculty name, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
          >
            <option value="All">All Portals ({credentials.length})</option>
            <option value="staff">Teacher Portals (7)</option>
            <option value="admin">Admin Portal</option>
            <option value="office">Office Desk</option>
            <option value="student">Student Portal</option>
          </select>
        </div>
      </div>

      {/* Credentials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Portal Name</th>
                <th className="py-3 px-4">Account Holder / Subject</th>
                <th className="py-3 px-4">Login Email / Username</th>
                <th className="py-3 px-4">Current Password</th>
                <th className="py-3 px-4">Campus Assignment</th>
                <th className="py-3 px-4 text-right">Settings Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cred) => {
                const isShow = showPasswordMap[cred.id] || false;
                return (
                  <tr key={cred.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Portal Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        {cred.portalName}
                      </div>
                      <span className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold ${
                        cred.role === 'admin'
                          ? 'bg-red-100 text-[#800000]'
                          : cred.role === 'staff'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : cred.role === 'office'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {cred.role === 'staff' ? 'Teacher Portal' : cred.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Account Holder */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{cred.name}</div>
                      {cred.subject && (
                        <div className="text-[10px] text-slate-500 font-medium">Subject: {cred.subject}</div>
                      )}
                    </td>

                    {/* Email / Username */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-900 font-bold">{cred.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">User ID: {cred.username}</div>
                    </td>

                    {/* Password with Eye Toggle */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#800000] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {isShow ? cred.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(cred.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title={isShow ? 'Hide Password' : 'Show Password'}
                        >
                          {isShow ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Campus */}
                    <td className="py-3 px-4">
                      <span className="text-slate-600 font-medium">
                        {cred.campus || 'Aspire Kacha Khuh Campus'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEdit(cred)}
                        className="px-3 py-1.5 bg-[#800000] hover:bg-[#680000] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Edit Login</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Credentials Modal */}
      {editingCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Edit Portal Credentials</h3>
                <p className="text-xs text-white/80">{editingCred.portalName}</p>
              </div>
              <button 
                onClick={() => setEditingCred(null)} 
                className="text-white/80 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Login Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="name@aspire.edu.pk"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Used by the teacher to log in.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Login Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-400">Password must be at least 4 characters</span>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = 'Aspire' + Math.floor(100 + Math.random() * 900);
                      setEditPassword(rand);
                    }}
                    className="text-[10px] text-[#800000] font-bold hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCred(null)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] hover:bg-[#680000] rounded-lg shadow-sm"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
