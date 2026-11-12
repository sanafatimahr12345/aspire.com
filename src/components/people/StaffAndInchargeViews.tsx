import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Teacher, Employee, Incharge, Student } from '../../types';
import { formatPKR } from '../../utils/exportUtils';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award,
  Users,
  Upload
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. TEACHERS MANAGEMENT
 * ------------------------------------------------------------- */
export const TeachersView: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(StorageService.getTeachers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);

  // Form Fields
  const [teacherId, setTeacherId] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Sahiwal, Punjab');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [assignedSubjectsStr, setAssignedSubjectsStr] = useState('');
  const [assignedClassesStr, setAssignedClassesStr] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10));
  const [salary, setSalary] = useState(120000);
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Resigned'>('Active');

  const openAdd = () => {
    setEditingTeacher(null);
    setTeacherId(`ASP-TCH-${String(teachers.length + 1).padStart(2, '0')}`);
    setName('');
    setFatherName('');
    setGender('Male');
    setPhone('0300-');
    setEmail('');
    setAddress('Sahiwal');
    setQualification('M.Phil');
    setSpecialization('');
    setAssignedSubjectsStr('');
    setAssignedClassesStr('');
    setJoiningDate(new Date().toISOString().slice(0, 10));
    setSalary(120000);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setTeacherId(t.teacherId);
    setName(t.name);
    setFatherName(t.fatherName);
    setGender(t.gender);
    setPhone(t.phone);
    setEmail(t.email);
    setAddress(t.address);
    setQualification(t.qualification);
    setSpecialization(t.specialization);
    setAssignedSubjectsStr(t.assignedSubjects.join(', '));
    setAssignedClassesStr(t.assignedClasses.join(', '));
    setJoiningDate(t.joiningDate);
    setSalary(t.salary);
    setStatus(t.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subjectsArr = assignedSubjectsStr.split(',').map(s => s.trim()).filter(Boolean);
    const classesArr = assignedClassesStr.split(',').map(c => c.trim()).filter(Boolean);

    let updated: Teacher[];
    if (editingTeacher) {
      updated = teachers.map(t => 
        t.teacherId === editingTeacher.teacherId
          ? {
              ...t,
              name,
              fatherName,
              gender,
              phone,
              email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@aspire.edu.pk`,
              address,
              qualification,
              specialization,
              assignedSubjects: subjectsArr,
              assignedClasses: classesArr,
              joiningDate,
              salary,
              status,
            }
          : t
      );
      StorageService.logAction('Admin', 'Faculty Management', 'Updated Teacher', `Modified details of ${name}`);
    } else {
      const newTeacher: Teacher = {
        teacherId,
        name,
        fatherName,
        gender,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@aspire.edu.pk`,
        address,
        qualification,
        specialization,
        assignedSubjects: subjectsArr,
        assignedClasses: classesArr,
        joiningDate,
        salary,
        status,
      };
      updated = [newTeacher, ...teachers];
      StorageService.logAction('Admin', 'Faculty Management', 'Added Teacher', `Appointed faculty member ${name}`);
    }

    setTeachers(updated);
    StorageService.saveTeachers(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = teachers.filter(t => t.teacherId !== deleteTarget.teacherId);
    setTeachers(updated);
    StorageService.saveTeachers(updated);
    StorageService.logAction('Admin', 'Faculty Management', 'Deleted Teacher', `Removed faculty member ${deleteTarget.name}`);
    setDeleteTarget(null);
  };

  const filtered = teachers.filter(t => {
    const matchSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.qualification.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#800000]" />
            <span>Teachers & Teaching Faculty Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Faculty profiles, academic specializations, assigned subjects, and teaching cohorts.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by teacher name, subject, or specialization..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Faculty ID</th>
                <th className="py-3 px-4">Teacher Name</th>
                <th className="py-3 px-4">Qualification & Specialization</th>
                <th className="py-3 px-4">Assigned Subjects</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Monthly Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.teacherId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{t.teacherId}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[10px] text-slate-400">{t.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{t.qualification}</div>
                    <div className="text-[10px] text-slate-500">{t.specialization}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {t.assignedSubjects.map((sub, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{t.phone}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatPKR(t.salary)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingTeacher(t)}
                        title="View Full Profile"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(t)}
                        title="Edit Teacher"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        title="Delete Teacher"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingTeacher ? 'Edit Teacher Record' : 'Add New Faculty Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Tariq Mahmood"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Father Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@aspire.edu.pk"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Ph.D. in Physics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Optics & Electromagnetism"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Subjects (comma separated)</label>
                <input
                  type="text"
                  value={assignedSubjectsStr}
                  onChange={(e) => setAssignedSubjectsStr(e.target.value)}
                  placeholder="Physics (Part-I), Physics (Part-II)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Classes (comma separated)</label>
                <input
                  type="text"
                  value={assignedClassesStr}
                  onChange={(e) => setAssignedClassesStr(e.target.value)}
                  placeholder="11th Pre-Engineering, 12th Pre-Engineering..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
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
                  Save Teacher Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Profile Modal */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-amber-300 font-bold text-lg">
                  {viewingTeacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{viewingTeacher.name}</h3>
                  <p className="text-xs text-white/80">{viewingTeacher.teacherId} · {viewingTeacher.qualification}</p>
                </div>
              </div>
              <button onClick={() => setViewingTeacher(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block">Specialization</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{viewingTeacher.specialization}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Monthly Compensation</span>
                  <span className="font-bold font-mono text-[#800000] text-sm mt-0.5 block">{formatPKR(viewingTeacher.salary)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Contact: <strong className="font-mono">{viewingTeacher.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email: {viewingTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Address: {viewingTeacher.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Appointment Date: {viewingTeacher.joiningDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setViewingTeacher(null)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Teacher Record?"
        message={`Are you sure you want to remove teacher "${deleteTarget?.name}"?`}
        confirmLabel="Delete Teacher"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. EMPLOYEES MANAGEMENT
 * ------------------------------------------------------------- */
export const EmployeesView: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(StorageService.getEmployees());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Accounts & Finance');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('Sahiwal');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10));
  const [salary, setSalary] = useState(65000);
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Terminated'>('Active');

  const openAdd = () => {
    setEditingEmployee(null);
    setName('');
    setDesignation('');
    setDepartment('Accounts & Finance');
    setContact('0321-');
    setAddress('Sahiwal');
    setJoiningDate(new Date().toISOString().slice(0, 10));
    setSalary(65000);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setDesignation(emp.designation);
    setDepartment(emp.department);
    setContact(emp.contact);
    setAddress(emp.address);
    setJoiningDate(emp.joiningDate);
    setSalary(emp.salary);
    setStatus(emp.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let updated: Employee[];
    if (editingEmployee) {
      updated = employees.map(emp => 
        emp.employeeId === editingEmployee.employeeId
          ? { ...emp, name, designation, department, contact, address, joiningDate, salary, status }
          : emp
      );
      StorageService.logAction('Admin', 'Staff Administration', 'Updated Employee', `Updated employee ${name}`);
    } else {
      const newEmp: Employee = {
        employeeId: `ASP-EMP-${String(employees.length + 1).padStart(2, '0')}`,
        name,
        designation,
        department,
        contact,
        address,
        joiningDate,
        salary,
        status,
      };
      updated = [newEmp, ...employees];
      StorageService.logAction('Admin', 'Staff Administration', 'Added Employee', `Employed ${name} (${designation})`);
    }

    setEmployees(updated);
    StorageService.saveEmployees(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = employees.filter(e => e.employeeId !== deleteTarget.employeeId);
    setEmployees(updated);
    StorageService.saveEmployees(updated);
    StorageService.logAction('Admin', 'Staff Administration', 'Deleted Employee', `Removed employee ${deleteTarget.name}`);
    setDeleteTarget(null);
  };

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#800000]" />
            <span>Administrative & Support Staff Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Accounts officers, lab assistants, librarians, transport incharge, and campus security.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee name, role, or department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Staff Members
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{emp.employeeId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{emp.name}</td>
                  <td className="py-3 px-4 font-semibold text-[#800000]">{emp.designation}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.department}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{emp.contact}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatPKR(emp.salary)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(emp)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(emp)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingEmployee ? 'Edit Employee Details' : 'Add New Support Staff'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Muhammad Imran"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Accountant"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Accounts & Finance">Accounts & Finance</option>
                    <option value="General Administration">General Administration</option>
                    <option value="Science Laboratories">Science Laboratories</option>
                    <option value="Central Library">Central Library</option>
                    <option value="Transport & Logistics">Transport & Logistics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Salary</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
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
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
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
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Employee?"
        message={`Are you sure you want to remove employee "${deleteTarget?.name}"?`}
        confirmLabel="Delete Employee"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. INCHARGE MANAGEMENT
 * ------------------------------------------------------------- */
export const InchargeView: React.FC = () => {
  const [incharges, setIncharges] = useState<Incharge[]>(StorageService.getIncharges());
  const teachers = StorageService.getTeachers();
  const classes = StorageService.getClasses();
  const sections = StorageService.getSections();
  const sessions = StorageService.getSessions();
  const students = StorageService.getStudents();

  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncharge, setEditingIncharge] = useState<Incharge | null>(null);
  const [viewingStudentsFor, setViewingStudentsFor] = useState<Incharge | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Incharge | null>(null);

  // Form Fields
  const [teacherId, setTeacherId] = useState(teachers[0]?.teacherId || '');
  const [customName, setCustomName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [experience, setExperience] = useState('11 Years');
  const [designation, setDesignation] = useState('Incharge');
  const [campus, setCampus] = useState('Aspire Kacha Khuh Campus');
  const [phone, setPhone] = useState('923049562722');
  const [photo, setPhoto] = useState('');
  const [program, setProgram] = useState('FSc Pre-Medical');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [sectionId, setSectionId] = useState('G1');
  const [group, setGroup] = useState('Medical 1st Year');
  const [session, setSession] = useState('FALL 2026');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAdd = () => {
    setEditingIncharge(null);
    setTeacherId(teachers[0]?.teacherId || '');
    setCustomName('');
    setFatherName('S/O ');
    setExperience('11 Years');
    setDesignation('Incharge');
    setCampus('Aspire Kacha Khuh Campus');
    setPhone('+92 ');
    setPhoto('');
    setProgram('FSc Pre-Medical');
    setClassId(classes[0]?.classId || '');
    setSectionId('G1');
    setGroup('Medical 1st Year');
    setSession('FALL 2026');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEdit = (inc: Incharge) => {
    setEditingIncharge(inc);
    setTeacherId(inc.teacherOrEmployeeId);
    setCustomName(inc.name);
    setFatherName(inc.fatherName || '');
    setExperience(inc.experience || '11 Years');
    setDesignation(inc.designation || 'Incharge');
    setCampus(inc.campus || 'Aspire Kacha Khuh Campus');
    setPhone(inc.contact || '');
    setPhoto(inc.photo || '');
    setProgram(inc.program);
    setClassId(inc.classId);
    setSectionId(inc.sectionId);
    setGroup(inc.group);
    setSession(inc.session);
    setStatus(inc.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const teacherMatch = teachers.find(t => t.teacherId === teacherId);
    const teacherName = customName.trim() || (teacherMatch ? teacherMatch.name : 'Assigned Mentor');
    const teacherPhone = phone.trim() || (teacherMatch ? teacherMatch.phone : '040-1234567');

    let updated: Incharge[];
    if (editingIncharge) {
      updated = incharges.map(inc => 
        inc.inchargeId === editingIncharge.inchargeId
          ? {
              ...inc,
              name: teacherName,
              teacherOrEmployeeId: teacherId,
              program,
              classId,
              sectionId,
              group,
              contact: teacherPhone,
              session,
              status,
              fatherName,
              experience,
              designation,
              campus,
              photo: photo.trim() || undefined,
            }
          : inc
      );
      StorageService.logAction('Admin', 'Academic Mentorship', 'Updated Incharge Assignment', `Updated assignment for ${teacherName}`);
    } else {
      const newInc: Incharge = {
        inchargeId: `INC-${String(incharges.length + 1).padStart(2, '0')}`,
        name: teacherName,
        teacherOrEmployeeId: teacherId,
        program,
        classId,
        sectionId,
        group,
        contact: teacherPhone,
        session,
        status,
        fatherName,
        experience,
        designation,
        campus,
        photo: photo.trim() || undefined,
      };
      updated = [newInc, ...incharges];
      StorageService.logAction('Admin', 'Academic Mentorship', 'Assigned Incharge', `Assigned ${teacherName} as incharge`);
    }

    setIncharges(updated);
    StorageService.saveIncharges(updated);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = incharges.filter(i => i.inchargeId !== deleteTarget.inchargeId);
    setIncharges(updated);
    StorageService.saveIncharges(updated);
    StorageService.logAction('Admin', 'Academic Mentorship', 'Removed Incharge Assignment', `Removed assignment of ${deleteTarget.name}`);
    setDeleteTarget(null);
  };

  const filtered = incharges.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.program.toLowerCase().includes(search.toLowerCase());
    const matchProg = programFilter === 'All' || i.program === programFilter;
    return matchSearch && matchProg;
  });

  // Assigned students helper
  const getAssignedStudents = (inc: Incharge): Student[] => {
    return students.filter(s => s.classId === inc.classId || s.sectionId === inc.sectionId);
  };

  // Photo avatar helper
  const renderInchargePhoto = (inc: Incharge, index: number) => {
    if (inc.photo) {
      return (
        <img
          src={inc.photo}
          alt={inc.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shrink-0"
        />
      );
    }
    // Faculty avatar palette
    const bgColors = [
      'bg-amber-100 text-amber-900 border-amber-300',
      'bg-orange-100 text-orange-900 border-orange-300',
      'bg-red-100 text-red-900 border-red-300',
      'bg-indigo-100 text-indigo-900 border-indigo-300',
      'bg-emerald-100 text-emerald-900 border-emerald-300',
      'bg-purple-100 text-purple-900 border-purple-300',
      'bg-sky-100 text-sky-900 border-sky-300',
    ];
    const colorClass = bgColors[index % bgColors.length];

    return (
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${colorClass}`}>
        <span>{inc.name.split(' ').filter(p => !p.startsWith('Prof.')).map(p => p[0]).join('').slice(0, 2) || inc.name.slice(0, 2)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SECTION: 7 Incharge Cards (Exact match to screenshot image_d756f6fe.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {incharges.map((inc, index) => (
          <div
            key={inc.inchargeId}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              {renderInchargePhoto(inc, index)}
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight truncate">
                  {inc.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {inc.fatherName || `S/O ${inc.name.split(' ').pop()}`}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300">
                {inc.experience || `${11 + index} Years`}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {inc.designation || 'Incharge'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. MAIN BOTTOM CONTAINER (Search Bar & Table matching screenshot image_d756f6fe.png) */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-2xs p-5 space-y-4">
        {/* Search & Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incharge, collection..."
              className="w-full pl-8 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-full shadow-2xs focus:outline-hidden focus:border-[#800000]"
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 font-mono">
              Total: {incharges.length} • Photo circle • Collection • Experience badge
            </span>
            <button
              onClick={openAdd}
              className="px-3 py-1.5 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-2xs hover:bg-[#680000] transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Incharge</span>
            </button>
          </div>
        </div>

        {/* Incharge Table matching image_d756f6fe.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-2.5 px-4 w-14">Photo</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Collection / Qualification</th>
                <th className="py-2.5 px-4">Designation</th>
                <th className="py-2.5 px-4">Experience</th>
                <th className="py-2.5 px-4">Phone</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inc, index) => (
                <tr key={inc.inchargeId} className="hover:bg-slate-50/60 transition-colors">
                  {/* Photo circle */}
                  <td className="py-3 px-4">
                    {renderInchargePhoto(inc, index)}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 text-xs block">
                      {inc.name}
                    </span>
                  </td>

                  {/* Collection / Qualification */}
                  <td className="py-3 px-4 text-slate-600">
                    <span>{inc.fatherName || `S/O ${inc.name.split(' ').pop()}`}</span>
                  </td>

                  {/* Designation */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {inc.designation || 'Incharge'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {inc.campus || 'Aspire Kacha Khuh Campus'}
                    </div>
                  </td>

                  {/* Experience Badge */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300">
                      {inc.experience || `${11 + index} Years`}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {inc.contact}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(inc)}
                        title="Edit Incharge"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(inc)}
                        title="Delete Incharge"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingIncharge ? 'Edit Incharge Assignment' : 'Assign Faculty Section Incharge'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Incharge Name *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Prof. Muhammad Zahid Ramzan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Collection / S/O *</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="S/O M Ramzan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Badge)</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="11 Years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="923049562722"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Incharge"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus</label>
                  <input
                    type="text"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="Aspire Kacha Khuh Campus"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Incharge Photo (Upload from PC / Computer)
                </label>
                {photo ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <img
                      src={photo}
                      alt="Uploaded Incharge"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 border border-white shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">Photo Selected from PC</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">Ready to save with record</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer transition-colors shadow-2xs">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setPhoto('')}
                        className="px-2.5 py-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#800000] bg-slate-50 hover:bg-amber-50/20 rounded-xl cursor-pointer transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#800000]/10 flex items-center justify-center text-slate-600 group-hover:text-[#800000] mb-1.5 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#800000]">
                      📁 Choose Image from PC / Computer
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Select photo directly from your device (PNG, JPG, JPEG, WEBP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Linked Faculty Member</label>
                <select
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    const t = teachers.find(tch => tch.teacherId === e.target.value);
                    if (t && !customName) {
                      setCustomName(t.name);
                      setFatherName(`S/O ${t.fatherName}`);
                      setPhone(t.phone);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {teachers.map(t => (
                    <option key={t.teacherId} value={t.teacherId}>{t.name} ({t.qualification})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Track *</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                  <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                  <option value="ICS Computer Science">ICS Computer Science</option>
                  <option value="FA IT">FA IT</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Class</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {classes.map(c => <option key={c.classId} value={c.classId}>{c.className}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sections.map(sec => <option key={sec.sectionId} value={sec.sectionId}>{sec.sectionName}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sessions.map(s => <option key={s.sessionId} value={s.sessionName}>{s.sessionName}</option>)}
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
                  Save Incharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Assigned Students Modal */}
      {viewingStudentsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Assigned Section Students</h3>
                <p className="text-xs text-white/80">Incharge: {viewingStudentsFor.name} · {viewingStudentsFor.program}</p>
              </div>
              <button onClick={() => setViewingStudentsFor(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-6">
              <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Father Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Fee Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getAssignedStudents(viewingStudentsFor).map(s => (
                      <tr key={s.studentId}>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#800000]">{s.rollNo}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{s.fatherName}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{s.phone}</td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-700">{s.feeStatus}</td>
                      </tr>
                    ))}
                    {getAssignedStudents(viewingStudentsFor).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No students currently enrolled in this specific assigned section.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setViewingStudentsFor(null)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Incharge Assignment?"
        message={`Are you sure you want to remove ${deleteTarget?.name} from this incharge role?`}
        confirmLabel="Remove Assignment"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
