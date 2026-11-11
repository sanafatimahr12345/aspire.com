import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Session, ClassItem, Section, Group, Subject } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  CalendarRange, 
  Layers, 
  Grid, 
  Bookmark, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. SESSIONS VIEW
 * ------------------------------------------------------------- */
export const SessionsView: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(StorageService.getSessions());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  // Form State
  const [sessionName, setSessionName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Archived' | 'Upcoming'>('Active');
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditingSession(null);
    setSessionName('');
    setStartDate('');
    setEndDate('');
    setStatus('Active');
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (s: Session) => {
    setEditingSession(s);
    setSessionName(s.sessionName);
    setStartDate(s.startDate);
    setEndDate(s.endDate);
    setStatus(s.status);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError('Session name is required');
      return;
    }

    let updated: Session[];
    if (editingSession) {
      updated = sessions.map(s => 
        s.sessionId === editingSession.sessionId 
          ? { ...s, sessionName, startDate, endDate, status } 
          : s
      );
      StorageService.logAction('Admin', 'Academic Setup', 'Updated Session', `Modified session ${sessionName}`);
    } else {
      const newSession: Session = {
        sessionId: `SES-${Date.now().toString().slice(-6)}`,
        sessionName,
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate || '2028-06-30',
        status,
      };
      updated = [newSession, ...sessions];
      StorageService.logAction('Admin', 'Academic Setup', 'Added Session', `Created session ${sessionName}`);
    }

    setSessions(updated);
    StorageService.saveSessions(updated);
    setIsModalOpen(false);
  };

  const handleActivate = (sessionId: string) => {
    const updated = sessions.map(s => ({
      ...s,
      status: s.sessionId === sessionId ? ('Active' as const) : s.status,
    }));
    setSessions(updated);
    StorageService.saveSessions(updated);
    StorageService.logAction('Admin', 'Academic Setup', 'Activated Session', `Set session ${sessionId} to Active`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = sessions.filter(s => s.sessionId !== deleteTarget.sessionId);
    setSessions(updated);
    StorageService.saveSessions(updated);
    StorageService.logAction('Admin', 'Academic Setup', 'Deleted Session', `Removed session ${deleteTarget.sessionName}`);
    setDeleteTarget(null);
  };

  const filtered = sessions.filter(s => 
    s.sessionName.toLowerCase().includes(search.toLowerCase()) || 
    s.sessionId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-[#800000]" />
            <span>Academic Sessions Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure intermediate admission batches, active operational years, and archives.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Session</span>
        </button>
      </div>

      {/* Search Filter Bar (Single bar) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session name or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Sessions Found
        </span>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Session Name</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.sessionId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{s.sessionId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.sessionName}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{s.startDate}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{s.endDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : s.status === 'Upcoming' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {s.status !== 'Active' && (
                        <button
                          onClick={() => handleActivate(s.sessionId)}
                          title="Activate Session"
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Activate</span>
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(s)}
                        title="Edit Session"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        title="Delete Session"
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No academic sessions match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingSession ? 'Edit Academic Session' : 'Add Academic Session'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {error && <div className="text-red-600 font-semibold">{error}</div>}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Name *</label>
                <input
                  type="text"
                  required
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. 2026-2028 (1st Year)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Archived">Archived</option>
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
                  className="px-4 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Academic Session?"
        message={`Are you sure you want to remove session "${deleteTarget?.sessionName}"? This action cannot be reversed.`}
        confirmLabel="Delete Session"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. CLASSES VIEW
 * ------------------------------------------------------------- */
export const ClassesView: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>(StorageService.getClasses());
  const sessions = StorageService.getSessions();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassItem | null>(null);

  // Form State
  const [programName, setProgramName] = useState('FSc Pre-Medical');
  const [className, setClassName] = useState('');
  const [duration, setDuration] = useState('2 Years');
  const [session, setSession] = useState(sessions[0]?.sessionName || '2025-2027');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAdd = () => {
    setEditingClass(null);
    setProgramName('FSc Pre-Medical');
    setClassName('');
    setDuration('2 Years');
    setSession(sessions[0]?.sessionName || '2025-2027');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (c: ClassItem) => {
    setEditingClass(c);
    setProgramName(c.programName);
    setClassName(c.className);
    setDuration(c.duration);
    setSession(c.session);
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    let updated: ClassItem[];
    if (editingClass) {
      updated = classes.map(c => 
        c.classId === editingClass.classId 
          ? { ...c, programName, className, duration, session, status } 
          : c
      );
      StorageService.logAction('Admin', 'Academic Setup', 'Updated Class', `Modified class ${className}`);
    } else {
      const newClass: ClassItem = {
        classId: `CLS-${Date.now().toString().slice(-6)}`,
        programName,
        className,
        duration,
        session,
        status,
      };
      updated = [newClass, ...classes];
      StorageService.logAction('Admin', 'Academic Setup', 'Added Class', `Created class ${className}`);
    }

    setClasses(updated);
    StorageService.saveClasses(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = classes.filter(c => c.classId !== deleteTarget.classId);
    setClasses(updated);
    StorageService.saveClasses(updated);
    StorageService.logAction('Admin', 'Academic Setup', 'Deleted Class', `Deleted class ${deleteTarget.className}`);
    setDeleteTarget(null);
  };

  const filtered = classes.filter(c => 
    c.className.toLowerCase().includes(search.toLowerCase()) || 
    c.programName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#800000]" />
            <span>Programs & Classes Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure intermediate programs (FSc Pre-Eng, Pre-Med, ICS, FA) and class levels.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class or program..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Classes Listed
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Class ID</th>
                <th className="py-3 px-4">Program Name</th>
                <th className="py-3 px-4">Class Name</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.classId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{c.classId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{c.programName}</td>
                  <td className="py-3 px-4 font-semibold text-[#800000]">{c.className}</td>
                  <td className="py-3 px-4 text-slate-600">{c.duration}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{c.session}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingClass ? 'Edit Class & Program' : 'Add New Class'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Track *</label>
                <select
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                  <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                  <option value="ICS Computer Science">ICS Computer Science</option>
                  <option value="ICS Economics & Stats">ICS Economics & Stats</option>
                  <option value="FA Information Technology">FA Information Technology</option>
                  <option value="FA Arts">FA Arts</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Label / Name *</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. 11th Pre-Medical (M-1)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sessions.map(s => (
                      <option key={s.sessionId} value={s.sessionName}>{s.sessionName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  className="px-4 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Class Record?"
        message={`Are you sure you want to remove class "${deleteTarget?.className}"?`}
        confirmLabel="Delete Class"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. SECTIONS VIEW
 * ------------------------------------------------------------- */
export const SectionsView: React.FC = () => {
  const [sections, setSections] = useState<Section[]>(StorageService.getSections());
  const classes = StorageService.getClasses();
  const sessions = StorageService.getSessions();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const [sectionName, setSectionName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [session, setSession] = useState(sessions[0]?.sessionName || '');
  const [capacity, setCapacity] = useState(60);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAdd = () => {
    setEditingSection(null);
    setSectionName('');
    setClassId(classes[0]?.classId || '');
    setSession(sessions[0]?.sessionName || '');
    setCapacity(60);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (s: Section) => {
    setEditingSection(s);
    setSectionName(s.sectionName);
    setClassId(s.classId);
    setSession(s.session);
    setCapacity(s.capacity);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    let updated: Section[];
    if (editingSection) {
      updated = sections.map(s => 
        s.sectionId === editingSection.sectionId 
          ? { ...s, sectionName, classId, session, capacity, status } 
          : s
      );
      StorageService.logAction('Admin', 'Academic Setup', 'Updated Section', `Modified section ${sectionName}`);
    } else {
      const newSec: Section = {
        sectionId: `SEC-${Date.now().toString().slice(-6)}`,
        sectionName,
        classId,
        session,
        capacity,
        status,
      };
      updated = [newSec, ...sections];
      StorageService.logAction('Admin', 'Academic Setup', 'Added Section', `Created section ${sectionName}`);
    }

    setSections(updated);
    StorageService.saveSections(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = sections.filter(s => s.sectionId !== deleteTarget.sectionId);
    setSections(updated);
    StorageService.saveSections(updated);
    StorageService.logAction('Admin', 'Academic Setup', 'Deleted Section', `Removed section ${deleteTarget.sectionName}`);
    setDeleteTarget(null);
  };

  const filtered = sections.filter(s => 
    s.sectionName.toLowerCase().includes(search.toLowerCase()) || 
    s.sectionId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#800000]" />
            <span>Class Sections Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage section cohorts (Green, Red, Blue, Alpha, Star) and seating capacities.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Section</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search section name or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Sections Active
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Section ID</th>
                <th className="py-3 px-4">Section Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4">Max Capacity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const cls = classes.find(c => c.classId === s.classId);
                return (
                  <tr key={s.sectionId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">{s.sectionId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.sectionName}</td>
                    <td className="py-3 px-4 font-semibold text-[#800000]">{cls?.className || s.classId}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{s.session}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{s.capacity} Students</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section Name *</label>
                <input
                  type="text"
                  required
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. Green Section (Alpha)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Class *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {classes.map(c => (
                    <option key={c.classId} value={c.classId}>{c.className} ({c.programName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sessions.map(s => (
                      <option key={s.sessionId} value={s.sessionName}>{s.sessionName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  className="px-4 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Section?"
        message={`Are you sure you want to remove section "${deleteTarget?.sectionName}"?`}
        confirmLabel="Delete Section"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. GROUPS VIEW
 * ------------------------------------------------------------- */
export const GroupsView: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(StorageService.getGroups());
  const classes = StorageService.getClasses();
  const teachers = StorageService.getTeachers();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);

  const [groupName, setGroupName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [subjectsStr, setSubjectsStr] = useState('Physics, Chemistry, Biology');
  const [incharge, setIncharge] = useState(teachers[0]?.name || '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAdd = () => {
    setEditingGroup(null);
    setGroupName('');
    setClassId(classes[0]?.classId || '');
    setSubjectsStr('Physics, Chemistry, Biology');
    setIncharge(teachers[0]?.name || '');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (g: Group) => {
    setEditingGroup(g);
    setGroupName(g.groupName);
    setClassId(g.classId);
    setSubjectsStr(g.subjects.join(', '));
    setIncharge(g.incharge);
    setStatus(g.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const subjectsArray = subjectsStr.split(',').map(s => s.trim()).filter(Boolean);

    let updated: Group[];
    if (editingGroup) {
      updated = groups.map(g => 
        g.groupId === editingGroup.groupId 
          ? { ...g, groupName, classId, subjects: subjectsArray, incharge, status } 
          : g
      );
      StorageService.logAction('Admin', 'Academic Setup', 'Updated Group', `Modified academic group ${groupName}`);
    } else {
      const newGrp: Group = {
        groupId: `GRP-${Date.now().toString().slice(-6)}`,
        groupName,
        classId,
        subjects: subjectsArray,
        incharge,
        status,
      };
      updated = [newGrp, ...groups];
      StorageService.logAction('Admin', 'Academic Setup', 'Added Group', `Created academic group ${groupName}`);
    }

    setGroups(updated);
    StorageService.saveGroups(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = groups.filter(g => g.groupId !== deleteTarget.groupId);
    setGroups(updated);
    StorageService.saveGroups(updated);
    StorageService.logAction('Admin', 'Academic Setup', 'Deleted Group', `Removed group ${deleteTarget.groupName}`);
    setDeleteTarget(null);
  };

  const filtered = groups.filter(g => 
    g.groupName.toLowerCase().includes(search.toLowerCase()) || 
    g.incharge.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#800000]" />
            <span>Academic Groups Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure study wings (Medical Wing, Engineering Wing, ICS Wing) with assigned subjects and mentors.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Group</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search group name or incharge..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Groups Configured
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Group Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Enrolled Subjects</th>
                <th className="py-3 px-4">Group Incharge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((g) => {
                const cls = classes.find(c => c.classId === g.classId);
                return (
                  <tr key={g.groupId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{g.groupName}</td>
                    <td className="py-3 px-4 font-semibold text-[#800000]">{cls?.className || g.classId}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {g.subjects.map((sub, i) => (
                          <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{g.incharge}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        g.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(g)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(g)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingGroup ? 'Edit Academic Group' : 'Add Academic Group'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Medical Science Wing"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Class *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {classes.map(c => (
                    <option key={c.classId} value={c.classId}>{c.className}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subjects (comma separated)</label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={(e) => setSubjectsStr(e.target.value)}
                  placeholder="Physics, Chemistry, Biology, Urdu..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Group Incharge</label>
                <select
                  value={incharge}
                  onChange={(e) => setIncharge(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {teachers.map(t => (
                    <option key={t.teacherId} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  className="px-4 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Academic Group?"
        message={`Are you sure you want to remove group "${deleteTarget?.groupName}"?`}
        confirmLabel="Delete Group"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. SUBJECTS VIEW
 * ------------------------------------------------------------- */
export const SubjectsView: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(StorageService.getSubjects());
  const classes = StorageService.getClasses();
  const teachers = StorageService.getTeachers();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [group, setGroup] = useState('Medical Science Wing');
  const [teacher, setTeacher] = useState(teachers[0]?.name || '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAdd = () => {
    setEditingSubject(null);
    setSubjectName('');
    setSubjectCode('');
    setClassId(classes[0]?.classId || '');
    setGroup('Medical Science Wing');
    setTeacher(teachers[0]?.name || '');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectName(sub.subjectName);
    setSubjectCode(sub.subjectCode);
    setClassId(sub.classId);
    setGroup(sub.group);
    setTeacher(sub.teacher);
    setStatus(sub.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    let updated: Subject[];
    if (editingSubject) {
      updated = subjects.map(s => 
        s.subjectId === editingSubject.subjectId 
          ? { ...s, subjectName, subjectCode, classId, group, teacher, status } 
          : s
      );
      StorageService.logAction('Admin', 'Academic Setup', 'Updated Subject', `Modified course ${subjectName}`);
    } else {
      const newSub: Subject = {
        subjectId: `SUB-${Date.now().toString().slice(-6)}`,
        subjectName,
        subjectCode: subjectCode || `SUB-${Date.now().toString().slice(-3)}`,
        classId,
        group,
        teacher,
        status,
      };
      updated = [newSub, ...subjects];
      StorageService.logAction('Admin', 'Academic Setup', 'Added Subject', `Created course ${subjectName} (${subjectCode})`);
    }

    setSubjects(updated);
    StorageService.saveSubjects(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = subjects.filter(s => s.subjectId !== deleteTarget.subjectId);
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    StorageService.logAction('Admin', 'Academic Setup', 'Deleted Subject', `Removed subject ${deleteTarget.subjectName}`);
    setDeleteTarget(null);
  };

  const filtered = subjects.filter(s => 
    s.subjectName.toLowerCase().includes(search.toLowerCase()) || 
    s.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
    s.teacher.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#800000]" />
            <span>Curriculum Subjects Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure intermediate syllabus subjects, course codes, and assigned faculty professors.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject name, code, or teacher..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Subjects Active
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Assigned Class</th>
                <th className="py-3 px-4">Group / Wing</th>
                <th className="py-3 px-4">Assigned Teacher</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const cls = classes.find(c => c.classId === s.classId);
                return (
                  <tr key={s.subjectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#800000]">{s.subjectCode}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.subjectName}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{cls?.className || s.classId}</td>
                    <td className="py-3 px-4 text-slate-600">{s.group}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{s.teacher}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Physics (Part-I)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. PHY-101"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Class *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {classes.map(c => (
                    <option key={c.classId} value={c.classId}>{c.className}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty Professor</label>
                <select
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {teachers.map(t => (
                    <option key={t.teacherId} value={t.name}>{t.name} ({t.qualification})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  className="px-4 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Subject?"
        message={`Are you sure you want to remove subject "${deleteTarget?.subjectName}"?`}
        confirmLabel="Delete Subject"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
