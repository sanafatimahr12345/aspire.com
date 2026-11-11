import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { User, Assignment, Student, ExamResult, FeeRecord, AttendanceRecord } from '../../types';
import { formatPKR, formatDate } from '../../utils/exportUtils';
import { PrintChallanModal } from '../common/PrintChallanModal';
import { PrintResultCardModal } from '../common/PrintResultCardModal';
import { 
  GraduationCap, 
  Layers, 
  CheckSquare, 
  BookOpen, 
  Plus, 
  Users, 
  Calendar, 
  Award, 
  CreditCard, 
  Clock, 
  FileText, 
  Printer, 
  Bell, 
  User as UserIcon,
  Phone,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. STAFF PORTAL COMPONENT
 * ------------------------------------------------------------- */
export const StaffPortalView: React.FC<{ currentUser: User; activeTab: string }> = ({ currentUser, activeTab }) => {
  const teachers = StorageService.getTeachers();
  const currentTeacher = teachers.find(t => t.teacherId === currentUser.relatedId) || teachers[0];
  const allStudents = StorageService.getStudents();
  const classes = StorageService.getClasses();
  const [assignments, setAssignments] = useState<Assignment[]>(StorageService.getAssignments());
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);

  // New assignment form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(currentTeacher.assignedSubjects[0] || 'Physics');
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [dueDate, setDueDate] = useState('2026-11-18');
  const [description, setDescription] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAsn: Assignment = {
      assignmentId: `ASN-${Date.now().toString().slice(-4)}`,
      title,
      subject,
      classId,
      sectionId: 'SEC-ENG1-A',
      teacherId: currentTeacher.teacherId,
      teacherName: currentTeacher.name,
      dueDate,
      description,
      maxScore: 20,
    };

    const updated = [newAsn, ...assignments];
    setAssignments(updated);
    StorageService.saveAssignments(updated);
    StorageService.logAction(currentTeacher.name, 'Faculty', 'Created Assignment', `Assigned "${title}" to ${classId}`);
    setIsAddAssignmentOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Profile Card */}
      <div className="bg-gradient-to-r from-[#800000] to-[#5a0000] p-6 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-amber-300 font-heading font-black text-2xl">
            {currentTeacher.name.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Faculty Member</span>
            <h2 className="text-2xl font-bold font-heading">{currentTeacher.name}</h2>
            <p className="text-xs text-white/80">{currentTeacher.qualification} · Specialization: {currentTeacher.specialization}</p>
          </div>
        </div>
        <div className="text-right bg-white/10 px-4 py-2 rounded-xl border border-white/20">
          <span className="text-[10px] text-white/70 block uppercase">Faculty ID</span>
          <span className="font-mono font-bold text-sm">{currentTeacher.teacherId}</span>
        </div>
      </div>

      {/* Assigned Classes & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#800000]" />
              <span>Assigned Teaching Courses</span>
            </h3>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {currentTeacher.assignedSubjects.length} Courses
            </span>
          </div>

          <div className="space-y-2">
            {currentTeacher.assignedSubjects.map((sub, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{sub}</span>
                  <span className="text-[11px] text-slate-500">Regular Lecture: Period 2 & 4</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-[#800000]" />
              <span>Assigned Intermediate Classes</span>
            </h3>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {currentTeacher.assignedClasses.length} Cohorts
            </span>
          </div>

          <div className="space-y-2">
            {currentTeacher.assignedClasses.map((cls, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#800000] block">{cls}</span>
                  <span className="text-[11px] text-slate-500">Hall B-1 · High Street Campus</span>
                </div>
                <span className="font-mono text-slate-700 font-bold">~60 Students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Homework & Assignments Manager */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#800000]" />
              <span>Homework & Class Assignments</span>
            </h3>
            <p className="text-xs text-slate-500">Publish coursework for students to submit in registers</p>
          </div>
          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        </div>

        <div className="space-y-3">
          {assignments.map(a => (
            <div key={a.assignmentId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                <span className="font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Due: {a.dueDate}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-medium">
                <span>Subject: <strong className="text-[#800000]">{a.subject}</strong></span>
                <span>Max Marks: <strong>{a.maxScore}</strong></span>
                <span>Teacher: {a.teacherName}</span>
              </div>
              <p className="text-slate-600 mt-1">{a.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Assignment Modal */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Create Class Assignment</h3>
              <button onClick={() => setIsAddAssignmentOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Thermodynamics Problems"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {currentTeacher.assignedSubjects.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions / Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of problems, book pages, and submission format..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. STUDENT PORTAL COMPONENT
 * ------------------------------------------------------------- */
export const StudentPortalView: React.FC<{ currentUser: User; activeTab: string }> = ({ currentUser, activeTab }) => {
  const students = StorageService.getStudents();
  // Find current student by relatedId or rollNo
  const student = students.find(
    s => s.studentId === currentUser.relatedId || s.rollNo === currentUser.username
  ) || students[0];

  const fees = StorageService.getFees().filter(f => f.studentId === student.studentId || f.rollNo === student.rollNo);
  const attendance = StorageService.getAttendance().filter(a => a.studentId === student.studentId || a.rollNo === student.rollNo);
  const results = StorageService.getResults().filter(r => r.studentId === student.studentId || r.rollNo === student.rollNo);
  const notifications = StorageService.getNotifications().filter(n => n.target === 'All' || n.target === 'Students');

  // Print targets
  const [printChallan, setPrintChallan] = useState<FeeRecord | null>(null);
  const [printResult, setPrintResult] = useState<ExamResult | null>(null);

  // Turnout percentage
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 95;

  return (
    <div className="space-y-6">
      {/* Student ID Banner */}
      <div className="bg-gradient-to-r from-[#800000] via-[#8c1d1d] to-[#590000] p-6 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-amber-300 font-heading font-black text-3xl">
            {student.name.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Enrolled Intermediate Scholar</span>
            <h2 className="text-2xl font-bold font-heading">{student.name}</h2>
            <p className="text-xs text-white/80">Father: {student.fatherName} · Program: <strong className="text-white">{student.program}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-white/10 px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-white/70 block uppercase">Roll Number</span>
            <span className="font-mono font-bold text-lg text-amber-300">#{student.rollNo}</span>
          </div>
          <div className="text-right bg-white/10 px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-white/70 block uppercase">Attendance</span>
            <span className="font-mono font-bold text-lg text-emerald-300">{attendancePct}%</span>
          </div>
        </div>
      </div>

      {/* Tabs / Subsections according to activeTab or Unified View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#800000]" />
              <span>Tuition Fee & Challan Status</span>
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {student.feeStatus}
            </span>
          </div>

          <div className="space-y-3">
            {fees.map(f => (
              <div key={f.feeId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{f.month}</span>
                  <span className="font-mono text-slate-500">Challan #{f.challanNo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Due</span>
                    <span className="font-bold text-slate-800">{formatPKR(f.totalFee)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Paid</span>
                    <span className="font-bold text-emerald-700">{formatPKR(f.paidAmount)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Remaining</span>
                    <span className="font-bold text-red-700">{formatPKR(f.remainingAmount)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Payment Method: {f.paymentMethod || 'Bank Deposit'}
                  </span>
                  <button
                    onClick={() => setPrintChallan(f)}
                    className="px-3 py-1 bg-[#800000] text-white rounded font-semibold text-[11px] flex items-center gap-1 hover:bg-[#680000] transition-colors"
                  >
                    <Printer className="w-3 h-3 text-amber-300" />
                    <span>View / Print Challan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#800000]" />
              <span>Attendance History</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {attendancePct}% Overall
            </span>
          </div>

          <div className="space-y-2">
            {attendance.slice(0, 5).map(att => (
              <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900 block">{att.date}</span>
                  <span className="text-[10px] text-slate-400">Class Session Attendance</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  att.status === 'Present'
                    ? 'bg-emerald-100 text-emerald-800'
                    : att.status === 'Late'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {att.status}
                </span>
              </div>
            ))}
            {attendance.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No attendance exceptions recorded. Attendance status: 100% Nominal.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Examination Marksheet & Results */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Award className="w-5 h-5 text-[#800000]" />
              <span>Official Examination Results & Transcripts</span>
            </h3>
            <p className="text-xs text-slate-500">View and print certified intermediate term marks cards</p>
          </div>
        </div>

        <div className="space-y-4">
          {results.map(r => (
            <div key={r.resultId} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-base text-slate-900">{r.examTitle}</span>
                  <p className="text-slate-500 text-[11px]">Board Curriculum · Aspire College Examination Authority</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Marks Obtained</span>
                    <span className="font-mono font-extrabold text-sm text-[#800000]">
                      {r.obtainedMarks} / {r.totalMarks} ({r.percentage}%)
                    </span>
                  </div>
                  <button
                    onClick={() => setPrintResult(r)}
                    className="px-3.5 py-1.5 bg-[#800000] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-[#680000] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Print Official Marksheet</span>
                  </button>
                </div>
              </div>

              {/* Subject Breakup */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {r.subjects.map((sub, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 block truncate">{sub.subjectName}</span>
                    <div className="font-mono font-bold text-sm text-slate-900 mt-1">{sub.obtainedMarks} / {sub.totalMarks}</div>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700">{sub.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Notifications */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#800000]" />
          <span>College Announcements & Circulars</span>
        </h3>

        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{n.title}</span>
                <span className="font-mono text-[10px] text-slate-400">{n.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modals for Print */}
      <PrintChallanModal
        isOpen={!!printChallan}
        fee={printChallan}
        onClose={() => setPrintChallan(null)}
      />

      <PrintResultCardModal
        isOpen={!!printResult}
        result={printResult}
        onClose={() => setPrintResult(null)}
      />
    </div>
  );
};
