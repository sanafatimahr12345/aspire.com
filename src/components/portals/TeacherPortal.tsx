import React, { useState } from 'react';
import { User, Student, Teacher } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Calendar, 
  Award, 
  FileText, 
  User as UserIcon, 
  LogOut, 
  CheckSquare, 
  CheckCircle2, 
  Plus, 
  Search,
  Filter,
  ArrowLeft,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Printer
} from 'lucide-react';

interface TeacherPortalProps {
  currentUser: User;
  onLogout: () => void;
  onViewMainSite: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  onLogout,
  onViewMainSite,
}) => {
  const teachers = StorageService.getTeachers();
  // Find current teacher or default to Prof. Muhammad Zahid Ramzan
  const teacher = teachers.find(t => t.name.includes('Zahid') || t.teacherId === currentUser.relatedId) || {
    teacherId: 'ASP-TCH-ZAHID',
    name: 'Prof. Muhammad Zahid Ramzan',
    fatherName: 'Ramzan Ali',
    gender: 'Male',
    phone: '923049562722',
    email: 'zahid.ramzan@aspire.edu.pk',
    address: 'Kacha Khuh Campus, Punjab',
    qualification: 'M.Phil Physics (11 Years Experience)',
    specialization: 'Physics & Laboratory Practicals',
    assignedSubjects: ['Physics'],
    assignedClasses: ['G1', 'BG1', 'S1', 'BS1', 'A', 'SB2', 'SB3', 'SB4', 'SG1', 'SG2', 'SG3', 'FA1'],
    joiningDate: '2015-08-15',
    salary: 135000,
    status: 'Active' as const
  };

  const assignedClassList = [
    'G1', 'BG1', 'S1', 'BS1', 'A', 'SB2', 'SB3', 'SB4', 'SG1', 'SG2', 'SG3', 'FA1'
  ];

  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'classes' | 'students' | 'attendance' | 'results' | 'reports' | 'profile'>('dashboard');

  // Interactive Attendance state
  const allStudents = StorageService.getStudents();
  const [selectedClass, setSelectedClass] = useState<string>('G1');
  const [attDate, setAttDate] = useState<string>('2026-11-11');
  const [attStatusMap, setAttStatusMap] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Filter students for current class
  const classStudents = allStudents.filter(s => {
    if (selectedClass === 'G1') return s.sectionId === 'G1' || s.sectionId === 'G2' || s.program.includes('Medical');
    if (selectedClass === 'BG1') return s.sectionId.includes('BG') || s.program.includes('Engineering');
    if (selectedClass === 'FA1') return s.program.includes('F.A');
    return s.sectionId.includes(selectedClass) || true;
  }).slice(0, 25);

  const handleToggleAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttStatusMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    const existing = StorageService.getAttendance();
    const newRecords = classStudents.map((s, idx) => ({
      id: `ATT-ZAHID-${Date.now()}-${idx}`,
      date: attDate,
      sessionId: 'SES-2025-27',
      classId: selectedClass,
      sectionId: selectedClass,
      studentId: s.studentId,
      rollNo: s.rollNo,
      studentName: s.name,
      status: attStatusMap[s.studentId] || 'Present',
    }));
    StorageService.saveAttendance([...newRecords, ...existing]);
    StorageService.logAction(teacher.name, 'Teacher', 'Marked Attendance', `Attendance submitted for class ${selectedClass} on ${attDate}`);
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Add Result state
  const [resultStudentRoll, setResultStudentRoll] = useState(classStudents[0]?.rollNo || 'F26ENG1BA2');
  const [examName, setExamName] = useState('Physics Chapter 1 Test');
  const [totalMarks, setTotalMarks] = useState<number>(50);
  const [phyMarks, setPhyMarks] = useState<number>(45);
  const [resultSaved, setResultSaved] = useState(false);

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    const student = allStudents.find(s => s.rollNo === resultStudentRoll) || classStudents[0];
    const results = StorageService.getResults();
    const pct = Math.round((Number(phyMarks) / (Number(totalMarks) || 1)) * 1000) / 10;
    const calculatedGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 
      pct >= 85 ? 'A+' : pct >= 75 ? 'A' : pct >= 65 ? 'B' : pct >= 55 ? 'C' : pct >= 33 ? 'D' : 'F';

    const newRes = {
      resultId: `RES-TCH-${Date.now().toString().slice(-4)}`,
      examId: 'EXM-2026-TERM1',
      examTitle: examName,
      studentId: student?.studentId || 'std-1',
      rollNo: student?.rollNo || resultStudentRoll,
      studentName: student?.name || 'Student',
      fatherName: student?.fatherName || 'Father',
      classId: selectedClass,
      program: student?.program || 'FSc Pre-Medical',
      subjects: [
        { subjectName: 'Physics', subjectCode: 'PHY-101', totalMarks: Number(totalMarks), obtainedMarks: Number(phyMarks), grade: calculatedGrade }
      ],
      totalMarks: Number(totalMarks),
      obtainedMarks: Number(phyMarks),
      percentage: pct,
      grade: calculatedGrade,
      status: (pct >= 33 ? 'Pass' : 'Fail') as 'Pass' | 'Fail',
      position: 'Class Evaluated'
    };
    StorageService.saveResults([newRes, ...results]);
    StorageService.logAction(teacher.name, 'Teacher', 'Entered Exam Result', `Result saved for Roll #${resultStudentRoll} in ${examName}`);
    setResultSaved(true);
    setTimeout(() => setResultSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row text-slate-800 font-sans">
      {/* 1. LEFT SIDEBAR (Dark navy #0b1329 matching exact screenshot) */}
      <aside className="w-full md:w-64 bg-[#0b1329] text-white flex flex-col shrink-0 select-none border-r border-slate-900 shadow-xl">
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-md bg-white text-[#800000] font-black text-lg flex items-center justify-center shadow-xs">
            A
          </div>
          <div>
            <h1 className="text-xs font-black tracking-wider text-white uppercase leading-none">
              ASPIRE COLLEGE
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">Teacher Portal</span>
          </div>
        </div>

        {/* Teacher Profile Card */}
        <div className="p-3 mx-3 my-3 bg-[#111c38] rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#800000] flex items-center justify-center text-white shrink-0 shadow-inner">
            <UserIcon className="w-5 h-5 text-amber-200" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-bold text-white truncate leading-tight">
              {teacher.name}
            </h2>
            <span className="text-[10px] text-slate-400 block truncate">Physics</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'dashboard'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-emerald-400">📊</span>
            <span>Dashboard</span>
          </button>

          {/* My Classes (12) */}
          <button
            onClick={() => setActiveMenu('classes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'classes'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📚</span>
            <span>My Classes (12)</span>
          </button>

          {/* Students (0) */}
          <button
            onClick={() => setActiveMenu('students')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'students'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👨‍🎓</span>
            <span>Students ({classStudents.length})</span>
          </button>

          {/* Attendance */}
          <button
            onClick={() => setActiveMenu('attendance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'attendance'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📅</span>
            <span>Attendance</span>
          </button>

          {/* Results Add/Edit */}
          <button
            onClick={() => setActiveMenu('results')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'results'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📝</span>
            <span>Results Add/Edit</span>
          </button>

          {/* Reports */}
          <button
            onClick={() => setActiveMenu('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'reports'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📋</span>
            <span>Reports</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveMenu('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeMenu === 'profile'
                ? 'bg-[#152347] text-white shadow-inner font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👤</span>
            <span>Profile</span>
          </button>
        </nav>

        {/* Logout (Red matching screenshot) */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Dashboard - G1 - Medical 1st Year + Section A Incharge
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {teacher.name} | Physics | {assignedClassList.join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-md border border-slate-200">
              2026-11-11
            </span>
            <button
              onClick={onViewMainSite}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <span>←</span>
              <span>Main Site</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB 1: DASHBOARD VIEW (Exact match to screenshot) */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 4 Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. MY CLASSES */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    MY CLASSES
                  </span>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-heading">
                      12
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    {assignedClassList.join(', ')}
                  </p>
                </div>

                {/* 2. MY STUDENTS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    MY STUDENTS
                  </span>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-heading">
                      0
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Enrolled in Incharge Section</p>
                </div>

                {/* 3. SUBJECT */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    SUBJECT
                  </span>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-heading">
                      Physics
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">11 Years</p>
                </div>

                {/* 4. INCHARGE (Dark maroon card matching screenshot) */}
                <div className="bg-[#800000] p-5 rounded-2xl text-white shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-white/70 uppercase">
                    INCHARGE
                  </span>
                  <div className="my-2">
                    <span className="text-sm font-bold text-white block leading-tight">
                      G1 - Medical 1st Year + Section A Incharge
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80 font-medium">
                    Aspire Kacha Khuh Campus
                  </p>
                </div>
              </div>

              {/* Quick Actions - All Points Working */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                  Quick Actions - All Points Working
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Mark Attendance (Green tint button) */}
                  <button
                    onClick={() => setActiveMenu('attendance')}
                    className="py-3 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <span>📅</span>
                    <span>Mark Attendance</span>
                  </button>

                  {/* Add Result (Peach/red tint button) */}
                  <button
                    onClick={() => setActiveMenu('results')}
                    className="py-3 px-4 rounded-xl text-xs font-bold text-red-800 bg-red-50/70 hover:bg-red-100/80 border border-red-200 flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <span>📝</span>
                    <span>Add Result</span>
                  </button>

                  {/* View Students (Gray tint button) */}
                  <button
                    onClick={() => setActiveMenu('students')}
                    className="py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-300/80 flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <span>👨‍🎓</span>
                    <span>View Students</span>
                  </button>
                </div>
              </div>

              {/* Bottom Navy Footer Band (Exact match to screenshot) */}
              <div className="bg-[#0b1329] text-white p-5 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                {/* Col 1: Teacher Details */}
                <div className="md:col-span-4 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Teacher
                  </span>
                  <div className="font-bold text-sm text-white">{teacher.name}</div>
                  <div className="text-slate-300 text-[11px]">{teacher.email}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{teacher.phone}</div>
                </div>

                {/* Col 2: Classes Pills */}
                <div className="md:col-span-5 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                    Classes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {assignedClassList.map((cls, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#152347] border border-white/10 text-white font-mono text-[10px] font-bold"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Col 3: Aspire Campus */}
                <div className="md:col-span-3 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Aspire
                  </span>
                  <div className="text-white font-bold">Kacha Khuh Campus</div>
                  <div className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <span>✓</span> All Points Working
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY CLASSES (12) */}
          {activeMenu === 'classes' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Assigned Teaching Cohorts ({assignedClassList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Regular daily lecture periods & lab sessions for {teacher.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-[#800000] text-xs font-bold rounded-lg">
                    12 Active Batches
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {assignedClassList.map((cls, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-[#800000] text-white font-mono font-bold text-xs rounded-md">
                          Class {cls}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold block">Physics (Theory + Practical)</span>
                        <span className="text-[11px] text-slate-500">Room Hall #{i + 1} • Period {((i % 4) + 1)}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Enrolled: ~45 students</span>
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setActiveMenu('attendance');
                          }}
                          className="text-[#800000] font-bold hover:underline"
                        >
                          Mark Attendance →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENTS DIRECTORY */}
          {activeMenu === 'students' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Students Incharge Roster
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enrolled students in {teacher.name}'s assigned sections
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    {assignedClassList.map((c, i) => (
                      <option key={i} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Father Name</th>
                      <th className="py-2.5 px-3">Program</th>
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3">Fee Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.map((s) => (
                      <tr key={s.studentId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#800000]">{s.rollNo}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{s.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{s.fatherName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{s.program}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold">{s.sectionId}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {s.feeStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setResultStudentRoll(s.rollNo);
                              setActiveMenu('results');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#800000] hover:text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Add Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MARK ATTENDANCE */}
          {activeMenu === 'attendance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Mark Daily Attendance - Physics Lecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submit verified attendance into college records and sync to cloud
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    {assignedClassList.map((c, i) => (
                      <option key={i} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {attendanceSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Attendance successfully saved to cloud and college management records!</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3 text-right">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.map((s) => {
                      const status = attStatusMap[s.studentId] || 'Present';
                      return (
                        <tr key={s.studentId} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#800000]">{s.rollNo}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.name}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono">{s.sectionId}</td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-[11px] font-bold">
                              <button
                                type="button"
                                onClick={() => handleToggleAttendance(s.studentId, 'Present')}
                                className={`px-3 py-1 transition-colors ${
                                  status === 'Present' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleAttendance(s.studentId, 'Late')}
                                className={`px-3 py-1 transition-colors border-x border-slate-300 ${
                                  status === 'Late' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                Late
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleAttendance(s.studentId, 'Absent')}
                                className={`px-3 py-1 transition-colors ${
                                  status === 'Absent' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-6 py-2.5 bg-[#800000] hover:bg-[#680000] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4 text-amber-300" />
                  <span>Submit Attendance ({classStudents.length} Students)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: RESULTS ADD/EDIT */}
          {activeMenu === 'results' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Exam Result Entry - Physics Department
                </h3>
                <p className="text-xs text-slate-500">
                  Record official assessment marks for board and internal evaluation
                </p>
              </div>

              {resultSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Exam result recorded and marks card updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveResult} className="space-y-4 max-w-xl text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                  <select
                    value={resultStudentRoll}
                    onChange={(e) => setResultStudentRoll(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {classStudents.map(s => (
                      <option key={s.studentId} value={s.rollNo}>
                        {s.rollNo} - {s.name} ({s.program})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assessment Title</label>
                    <input
                      type="text"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      disabled
                      value="Physics (Theory & Practical)"
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg text-xs text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Marks (Full Number) *</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Marks Obtained *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={totalMarks}
                      value={phyMarks}
                      onChange={(e) => setPhyMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#800000] hover:bg-[#680000] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Save Exam Result</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeMenu === 'reports' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Academic & Attendance Progress Report
              </h3>
              <p className="text-xs text-slate-500">
                Summary metrics for 12 assigned teaching cohorts under {teacher.name}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Average Attendance</span>
                  <div className="text-2xl font-black text-emerald-900 mt-1">94.8%</div>
                  <span className="text-[11px] text-emerald-700">High engagement across Section G1</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Pass Percentage</span>
                  <div className="text-2xl font-black text-amber-900 mt-1">96.2%</div>
                  <span className="text-[11px] text-amber-700">First Term Examination</span>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-[10px] font-bold text-red-800 uppercase">Total Practical Hours</span>
                  <div className="text-2xl font-black text-red-900 mt-1">84 Hrs</div>
                  <span className="text-[11px] text-red-700">Lab Experiments Complete</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeMenu === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#800000] text-white flex items-center justify-center font-heading font-black text-2xl shadow-md">
                  Z
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{teacher.name}</h3>
                  <p className="text-xs text-slate-500">
                    Senior Faculty Member • Physics Department • {teacher.qualification}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Department & Role</span>
                  <span className="font-bold text-slate-800">Physics & Section A Incharge</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Official Email</span>
                  <span className="font-bold text-slate-800">{teacher.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Contact Number</span>
                  <span className="font-bold text-slate-800">{teacher.phone}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Campus Assignment</span>
                  <span className="font-bold text-slate-800">Aspire Kacha Khuh Campus</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
