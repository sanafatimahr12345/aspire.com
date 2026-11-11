import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Student } from '../../types';
import { exportToCSV, formatDate } from '../../utils/exportUtils';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Printer, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Filter,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const sessions = StorageService.getSessions();
  const classes = StorageService.getClasses();
  const sections = StorageService.getSections();

  // Search & Filter state (Single unified bar)
  const [search, setSearch] = useState('');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [feeStatusFilter, setFeeStatusFilter] = useState('All');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  // Form Fields
  const [studentId, setStudentId] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('2008-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [address, setAddress] = useState('');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().slice(0, 10));
  const [session, setSession] = useState(sessions[0]?.sessionName || '2025-2027 (1st Year)');
  const [program, setProgram] = useState('FSc Pre-Medical');
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [sectionId, setSectionId] = useState(sections[0]?.sectionId || '');
  const [group, setGroup] = useState('Medical Science Wing');
  const [admissionStatus, setAdmissionStatus] = useState<'Active' | 'Suspended' | 'Passed Out' | 'Struck Off'>('Active');
  const [feeStatus, setFeeStatus] = useState<'Paid' | 'Partial' | 'Unpaid'>('Paid');
  const [formError, setFormError] = useState('');

  const openAdd = () => {
    setEditingStudent(null);
    setFormError('');
    // Auto-generate next Student ID and Roll Number
    const nextId = `asp-2026-${String(students.length + 1).padStart(3, '0')}`;
    const nextRoll = String(100 + students.length + 1);

    setStudentId(nextId);
    setRollNo(nextRoll);
    setName('');
    setFatherName('');
    setDob('2008-01-01');
    setGender('Male');
    setPhone('0300-');
    setFatherPhone('0300-');
    setAddress('Sahiwal, Punjab');
    setAdmissionDate(new Date().toISOString().slice(0, 10));
    setSession(sessions[0]?.sessionName || '2025-2027 (1st Year)');
    setProgram('FSc Pre-Medical');
    setClassId(classes[0]?.classId || '');
    setSectionId(sections[0]?.sectionId || '');
    setGroup('Medical Science Wing');
    setAdmissionStatus('Active');
    setFeeStatus('Paid');
    setIsAddEditOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setFormError('');
    setStudentId(s.studentId);
    setRollNo(s.rollNo);
    setName(s.name);
    setFatherName(s.fatherName);
    setDob(s.dob);
    setGender(s.gender);
    setPhone(s.phone);
    setFatherPhone(s.fatherPhone);
    setAddress(s.address);
    setAdmissionDate(s.admissionDate);
    setSession(s.session);
    setProgram(s.program);
    setClassId(s.classId);
    setSectionId(s.sectionId);
    setGroup(s.group);
    setAdmissionStatus(s.admissionStatus);
    setFeeStatus(s.feeStatus);
    setIsAddEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations: Unique student ID and roll number
    const duplicateId = students.find(
      s => s.studentId.toLowerCase() === studentId.trim().toLowerCase() && 
      (!editingStudent || s.studentId !== editingStudent.studentId)
    );
    if (duplicateId) {
      setFormError(`Student ID "${studentId}" is already assigned to ${duplicateId.name}.`);
      return;
    }

    const duplicateRoll = students.find(
      s => s.rollNo.trim() === rollNo.trim() && 
      s.classId === classId && 
      (!editingStudent || s.studentId !== editingStudent.studentId)
    );
    if (duplicateRoll) {
      setFormError(`Roll Number "${rollNo}" already exists in this class.`);
      return;
    }

    let updated: Student[];
    if (editingStudent) {
      updated = students.map(s => 
        s.studentId === editingStudent.studentId
          ? {
              ...s,
              rollNo,
              name,
              fatherName,
              dob,
              gender,
              phone,
              fatherPhone,
              address,
              admissionDate,
              session,
              program,
              classId,
              sectionId,
              group,
              admissionStatus,
              feeStatus,
            }
          : s
      );
      StorageService.logAction('Admin', 'Student Management', 'Updated Student', `Modified records for ${name} (Roll #${rollNo})`);
    } else {
      const newStudent: Student = {
        studentId,
        rollNo,
        name,
        fatherName,
        dob,
        gender,
        phone,
        fatherPhone,
        address,
        admissionDate,
        session,
        program,
        classId,
        sectionId,
        group,
        admissionStatus,
        feeStatus,
      };
      updated = [newStudent, ...students];
      StorageService.logAction('Admin', 'Student Management', 'Enrolled Student', `Enrolled ${name} (Roll #${rollNo}) in ${program}`);
    }

    setStudents(updated);
    StorageService.saveStudents(updated);
    setIsAddEditOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = students.filter(s => s.studentId !== deleteTarget.studentId);
    setStudents(updated);
    StorageService.saveStudents(updated);
    StorageService.logAction('Admin', 'Student Management', 'Deleted Student', `Removed student ${deleteTarget.name} (${deleteTarget.studentId})`);
    setDeleteTarget(null);
  };

  // Export to Excel CSV
  const handleExportCSV = () => {
    const headers = [
      'Student ID', 'Roll No', 'Student Name', 'Father Name', 'Gender',
      'Contact', 'Father Contact', 'Program', 'Class', 'Session',
      'Address', 'Fee Status', 'Admission Status'
    ];
    const rows = filtered.map(s => [
      s.studentId, s.rollNo, s.name, s.fatherName, s.gender,
      s.phone, s.fatherPhone, s.program, s.classId, s.session,
      s.address, s.feeStatus, s.admissionStatus
    ]);
    exportToCSV(`Aspire_College_Students_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handlePrintList = () => {
    window.print();
  };

  // Filtering Logic
  const filtered = students.filter(s => {
    const matchSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(search.toLowerCase());

    const matchSession = sessionFilter === 'All' || s.session === sessionFilter;
    const matchProgram = programFilter === 'All' || s.program === programFilter;
    const matchClass = classFilter === 'All' || s.classId === classFilter;
    const matchSection = sectionFilter === 'All' || s.sectionId === sectionFilter;
    const matchGender = genderFilter === 'All' || s.gender === genderFilter;
    const matchFee = feeStatusFilter === 'All' || s.feeStatus === feeStatusFilter;

    return matchSearch && matchSession && matchProgram && matchClass && matchSection && matchGender && matchFee;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-[#800000]" />
            <span>Students Management Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete academic roster, admissions records, fee statuses, and exportable directories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handlePrintList}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Student List</span>
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Printable Header (Visible only when printing) */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold text-[#800000]">ASPIRE COLLEGE SAHIWAL</h1>
        <p className="text-xs text-slate-600">Official Student Enrollment & Nominal Roll Directory</p>
        <p className="text-[10px] text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* SINGLE Unified Filter Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number, father name, or student ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter By:</span>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div>
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="All">All Sessions</option>
              {sessions.map(s => <option key={s.sessionId} value={s.sessionName}>{s.sessionName}</option>)}
            </select>
          </div>

          <div>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="All">All Programs</option>
              <option value="FSc Pre-Medical">FSc Pre-Medical</option>
              <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
              <option value="ICS Computer Science">ICS Computer Science</option>
              <option value="FA IT">FA IT</option>
              <option value="FA Arts">FA Arts</option>
            </select>
          </div>

          <div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="All">All Classes</option>
              {classes.map(c => <option key={c.classId} value={c.classId}>{c.className}</option>)}
            </select>
          </div>

          <div>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="All">All Sections</option>
              {sections.map(s => <option key={s.sectionId} value={s.sectionId}>{s.sectionName}</option>)}
            </select>
          </div>

          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="All">All Fee Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="no-print py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                return (
                  <tr key={s.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.studentId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#800000]">{s.rollNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{s.program}</div>
                      <div className="text-[10px] text-slate-400">{s.session}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {s.sectionId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{s.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.feeStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.feeStatus === 'Paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="no-print py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(s)}
                          title="View Profile"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          title="Edit Student"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          title="Delete Student"
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No students match the current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong className="text-slate-800">{filtered.length}</strong> of {students.length} students</span>
          <span className="font-mono text-[11px]">Aspire College Master Registry</span>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingStudent ? 'Edit Student Record' : 'Enroll New Intermediate Student'}
              </h3>
              <button onClick={() => setIsAddEditOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* ID and Roll */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID (Unique) *</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="asp-2026-008"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="108"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Daniyal Khan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father Name *</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Tariq Khan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* DOB, Gender & Contacts */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Date</label>
                  <input
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Phone / Mobile *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Father Phone *</label>
                  <input
                    type="tel"
                    required
                    value={fatherPhone}
                    onChange={(e) => setFatherPhone(e.target.value)}
                    placeholder="0301-9876543"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Colony, City..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Academic Placement */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {sessions.map(s => <option key={s.sessionId} value={s.sessionName}>{s.sessionName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                    <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                    <option value="ICS Computer Science">ICS Computer Science</option>
                    <option value="FA IT">FA IT</option>
                    <option value="FA Arts">FA Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {classes.map(c => <option key={c.classId} value={c.classId}>{c.className}</option>)}
                  </select>
                </div>
              </div>

              {/* Section, Admission Status & Fee Status */}
              <div className="grid grid-cols-3 gap-3">
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Status</label>
                  <select
                    value={admissionStatus}
                    onChange={(e) => setAdmissionStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Passed Out">Passed Out</option>
                    <option value="Struck Off">Struck Off</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Status</label>
                  <select
                    value={feeStatus}
                    onChange={(e) => setFeeStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000] shadow-xs"
                >
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal View */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-amber-300 font-bold text-lg">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{viewingStudent.name}</h3>
                  <p className="text-xs text-white/80">Roll #{viewingStudent.rollNo} · {viewingStudent.studentId}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block">Father&apos;s Name</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{viewingStudent.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Program Track</span>
                  <span className="font-bold text-[#800000] text-sm mt-0.5 block">{viewingStudent.program}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Academic Session</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{viewingStudent.session}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Fee Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold mt-1 ${
                    viewingStudent.feeStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : viewingStudent.feeStatus === 'Partial'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingStudent.feeStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Student Phone: <strong className="font-mono">{viewingStudent.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Father Contact: <strong className="font-mono">{viewingStudent.fatherPhone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Address: {viewingStudent.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Admission Date: {viewingStudent.admissionDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const st = viewingStudent;
                    setViewingStudent(null);
                    openEdit(st);
                  }}
                  className="px-4 py-2 font-semibold text-[#800000] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Student from Roster?"
        message={`Are you sure you want to permanently delete student "${deleteTarget?.name}" (Roll #${deleteTarget?.rollNo})?`}
        confirmLabel="Delete Student"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
