import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Notification, WebsiteInquiry, GalleryItem, AuditLog } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Bell, 
  MessageSquare, 
  Image, 
  History, 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Send
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. NOTIFICATIONS & ANNOUNCEMENTS
 * ------------------------------------------------------------- */
export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(StorageService.getNotifications());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<Notification['target']>('All');
  const [priority, setPriority] = useState<Notification['priority']>('Normal');

  const openAdd = () => {
    setTitle('');
    setMessage('');
    setTarget('All');
    setPriority('Normal');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: Notification = {
      id: `NOTIF-${Date.now().toString().slice(-5)}`,
      title,
      message,
      target,
      priority,
      date: new Date().toISOString().slice(0, 10),
      author: 'Admin Office',
    };

    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    StorageService.logAction('Admin', 'Circulars', 'Broadcast Notification', `Issued notice "${title}" to ${target}`);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = notifications.filter(n => n.id !== deleteTarget.id);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    StorageService.logAction('Admin', 'Circulars', 'Deleted Notification', `Removed circular "${deleteTarget.title}"`);
    setDeleteTarget(null);
  };

  const filtered = notifications.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#800000]" />
            <span>Campus Circulars & Notifications Broadcast</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch announcements to students, faculty, or office portals with priority badges.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-[#800000]/40 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  n.priority === 'Urgent'
                    ? 'bg-red-100 text-red-800'
                    : n.priority === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {n.priority} Priority
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Target: <strong className="text-slate-800">{n.target}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400">{n.date}</span>
                <button
                  onClick={() => setDeleteTarget(n)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            <div className="text-[10px] text-slate-400 pt-1">
              Issued by: <strong>{n.author}</strong> · Aspire College Sahiwal
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">New Campus Notification</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Holiday Notification"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="All">All Campuses & Users</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Faculty Staff Only</option>
                    <option value="Office">Office & Accounts Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent / Red Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Body / Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the full text of the circular..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Notification?"
        message={`Are you sure you want to delete notification "${deleteTarget?.title}"?`}
        confirmLabel="Delete Notice"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. WEBSITE INQUIRIES
 * ------------------------------------------------------------- */
export const WebsiteInquiriesView: React.FC = () => {
  const [inquiries, setInquiries] = useState<WebsiteInquiry[]>(StorageService.getInquiries());
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<WebsiteInquiry | null>(null);

  const handleStatusChange = (id: string, status: WebsiteInquiry['status']) => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    setInquiries(updated);
    StorageService.saveInquiries(updated);
    StorageService.logAction('Admin', 'Admissions Desk', 'Updated Inquiry Status', `Set inquiry ${id} to ${status}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = inquiries.filter(i => i.id !== deleteTarget.id);
    setInquiries(updated);
    StorageService.saveInquiries(updated);
    StorageService.logAction('Admin', 'Admissions Desk', 'Deleted Inquiry', `Removed inquiry ${deleteTarget.id}`);
    setDeleteTarget(null);
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = 
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.phone.includes(search) ||
      i.program.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#800000]" />
            <span>Prospective Admission Inquiries Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Online inquiries submitted by students and parents through the public Aspire website.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, phone, or program..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Inquiries</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Inquiry ID</th>
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Program of Interest</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Question / Message</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{inq.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{inq.name}</div>
                    <div className="text-[10px] text-slate-400">{inq.email}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#800000]">{inq.program}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{inq.phone}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs">{inq.message}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{inq.date}</td>
                  <td className="py-3 px-4">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                      className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100 border border-slate-300"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(inq)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No admission inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Inquiry?"
        message={`Are you sure you want to remove inquiry from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Inquiry"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. WEBSITE GALLERY MANAGEMENT
 * ------------------------------------------------------------- */
export const WebsiteGalleryView: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Campus');
  const [imageUrl, setImageUrl] = useState('/assets/gallery/main_campus_building.png');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newItem: GalleryItem = {
      id: `GAL-${Date.now().toString().slice(-4)}`,
      title,
      category,
      imageUrl,
      date: new Date().toISOString().slice(0, 10),
      isPublic: true,
    };

    const updated = [newItem, ...gallery];
    setGallery(updated);
    StorageService.saveGallery(updated);
    StorageService.logAction('Admin', 'Website Media', 'Added Gallery Image', `Uploaded "${title}" to category ${category}`);
    setIsModalOpen(false);
  };

  const toggleVisibility = (id: string) => {
    const updated = gallery.map(g => g.id === id ? { ...g, isPublic: !g.isPublic } : g);
    setGallery(updated);
    StorageService.saveGallery(updated);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = gallery.filter(g => g.id !== deleteTarget.id);
    setGallery(updated);
    StorageService.saveGallery(updated);
    StorageService.logAction('Admin', 'Website Media', 'Deleted Gallery Image', `Deleted "${deleteTarget.title}"`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Image className="w-5 h-5 text-[#800000]" />
            <span>Website Media & Campus Gallery Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Curate campus photographs, science laboratories, academic library, and sports activities.
          </p>
        </div>
        <button
          onClick={() => {
            setTitle('');
            setCategory('Campus');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Image</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold text-[#800000] uppercase tracking-wider">{item.category}</span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{item.date}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => toggleVisibility(item.id)}
                className={`text-[11px] font-semibold ${item.isPublic ? 'text-emerald-700' : 'text-slate-400'}`}
              >
                {item.isPublic ? '● Published' : '○ Hidden'}
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Add Campus Gallery Image</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image Caption / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Biology Dissection Lab"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Campus">Campus</option>
                  <option value="Labs">Labs</option>
                  <option value="Library">Library</option>
                  <option value="Sports">Sports</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image Source / Path</label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                >
                  <option value="/src/assets/images/hero_college_campus_1794107216820.jpg">Campus Front Lawn & Courtyard</option>
                  <option value="/src/assets/images/college_library_students_1794107217308.jpg">Central Research Library</option>
                  <option value="/src/assets/images/college_science_lab_1794107217396.jpg">Chemistry & Science Labs</option>
                  <option value="/src/assets/images/college_sports_campus_1794107217713.jpg">Athletic Grounds & Sports</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Gallery Image?"
        message={`Are you sure you want to remove "${deleteTarget?.title}" from the gallery?`}
        confirmLabel="Delete Image"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. AUDIT LOGS
 * ------------------------------------------------------------- */
export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(StorageService.getAuditLogs());
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <History className="w-5 h-5 text-[#800000]" />
            <span>Administrative Audit Trail & Security Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of student admissions, fee receipts, examination changes, and credential logins.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user, or details..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Recorded Actions
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-500">{l.id}</td>
                  <td className="py-3 px-4 text-slate-700">{l.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-sans">{l.user}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">{l.role}</td>
                  <td className="py-3 px-4 font-bold text-[#800000] font-sans">{l.action}</td>
                  <td className="py-3 px-4 font-sans text-slate-700 max-w-md">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. BACKUP & RECOVERY
 * ------------------------------------------------------------- */
export const BackupRecoveryView: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aspire_College_DB_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccessMsg('Complete database snapshot exported to your computer successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importFullBackup(content);
      if (success) {
        setSuccessMsg('Database restored from backup file successfully! Refreshing view...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setErrorMsg('Invalid backup file structure. Please ensure it is a valid Aspire College JSON export.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    StorageService.resetToDefaults();
    setIsResetConfirmOpen(false);
    setSuccessMsg('Database reset to fresh Aspire College Sahiwal demonstration dataset. Reloading...');
    setTimeout(() => window.location.reload(), 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Database className="w-5 h-5 text-[#800000]" />
            <span>Database Backup & Disaster Recovery</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Export complete relational JSON snapshots, restore archives, or reset demo rosters.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Export Backup */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#800000] flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Download Full Database</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Downloads all students, faculty, fee invoices, attendance history, exam results, and inquiries as an authenticated JSON file.
            </p>
          </div>
          <button
            onClick={handleDownloadBackup}
            className="w-full py-2.5 px-4 bg-[#800000] hover:bg-[#680000] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Export JSON Snapshot</span>
          </button>
        </div>

        {/* Card 2: Restore from file */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Restore from JSON Archive</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload a previous Aspire JSON snapshot to instantly restore classes, enrolled scholars, and accounting ledgers.
            </p>
          </div>
          <label className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-300">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Select JSON File</span>
            <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" />
          </label>
        </div>

        {/* Card 3: Reset to defaults */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset Demo Database</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Restore the original Aspire College Sahiwal demonstration dataset with active sessions, sample teachers, and fee records.
            </p>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Entire Database?"
        message="This will overwrite current student and fee records with the default Aspire College demo dataset."
        confirmLabel="Reset to Default"
        isDestructive={true}
        onConfirm={handleResetDefaults}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
