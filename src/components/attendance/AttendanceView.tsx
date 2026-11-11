import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { AttendanceRecord, AttendanceStatus, Student } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';
import { 
  CheckSquare, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Printer, 
  Download, 
  Save, 
  Users,
  Check
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const sessions = StorageService.getSessions();
  const classes = StorageService.getClasses();
  const sections = StorageService.getSections();
  const allStudents = StorageService.getStudents();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(StorageService.getAttendance());

  // Filter Selection
  const [selectedDate, setSelectedDate] = useState('2026-11-07');
  const [selectedSession, setSelectedSession] = useState(sessions[0]?.sessionName || '2025-2027 (1st Year)');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.classId || '');
  const [selectedSection, setSelectedSection] = useState(sections[0]?.sectionId || '');

  // Local Attendance Sheet State for the current day & class
  // Map of studentId -> AttendanceStatus
  const [sheetStatus, setSheetStatus] = useState<{ [studentId: string]: AttendanceStatus }>({});
  const [sheetRemarks, setSheetRemarks] = useState<{ [studentId: string]: string }>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Enrolled students in the selected class / section
  const enrolledStudents = allStudents.filter(s => {
    const matchClass = !selectedClass || s.classId === selectedClass;
    const matchSection = !selectedSection || s.sectionId === selectedSection;
    return matchClass && matchSection;
  });

  // Sync initial state from storage whenever date/class/section changes
  React.useEffect(() => {
    const initialStatus: { [id: string]: AttendanceStatus } = {};
    const initialRemarks: { [id: string]: string } = {};

    enrolledStudents.forEach(st => {
      const existing = attendanceRecords.find(
        a => a.date === selectedDate && a.studentId === st.studentId
      );
      if (existing) {
        initialStatus[st.studentId] = existing.status;
        initialRemarks[st.studentId] = existing.remarks || '';
      } else {
        initialStatus[st.studentId] = 'Present'; // Default to Present
      }
    });

    setSheetStatus(initialStatus);
    setSheetRemarks(initialRemarks);
    setSavedSuccess(false);
  }, [selectedDate, selectedClass, selectedSection, enrolledStudents.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setSheetStatus(prev => ({ ...prev, [studentId]: status }));
    setSavedSuccess(false);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: { [id: string]: AttendanceStatus } = {};
    enrolledStudents.forEach(st => {
      updated[st.studentId] = status;
    });
    setSheetStatus(updated);
    setSavedSuccess(false);
  };

  const handleSaveAttendance = () => {
    const updatedRecords = attendanceRecords.filter(
      a => !(a.date === selectedDate && enrolledStudents.some(st => st.studentId === a.studentId))
    );

    enrolledStudents.forEach(st => {
      const record: AttendanceRecord = {
        id: `ATT-${selectedDate}-${st.rollNo}`,
        date: selectedDate,
        sessionId: selectedSession,
        classId: selectedClass,
        sectionId: selectedSection,
        studentId: st.studentId,
        rollNo: st.rollNo,
        studentName: st.name,
        status: sheetStatus[st.studentId] || 'Present',
        remarks: sheetRemarks[st.studentId] || '',
      };
      updatedRecords.push(record);
    });

    setAttendanceRecords(updatedRecords);
    StorageService.saveAttendance(updatedRecords);
    StorageService.logAction(
      'Staff/Admin',
      'Attendance Desk',
      'Marked Attendance',
      `Saved daily attendance for ${selectedClass} (${enrolledStudents.length} students) on ${selectedDate}`
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Turnout Stats Calculation
  const totalEnrolled = enrolledStudents.length;
  const presentCount = enrolledStudents.filter(s => (sheetStatus[s.studentId] || 'Present') === 'Present').length;
  const lateCount = enrolledStudents.filter(s => sheetStatus[s.studentId] === 'Late').length;
  const absentCount = enrolledStudents.filter(s => sheetStatus[s.studentId] === 'Absent').length;
  const leaveCount = enrolledStudents.filter(s => sheetStatus[s.studentId] === 'Leave').length;

  const attendanceRate = totalEnrolled > 0 
    ? Math.round(((presentCount + lateCount) / totalEnrolled) * 100) 
    : 100;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Date', 'Class', 'Section', 'Status', 'Remarks'];
    const rows = enrolledStudents.map(s => [
      s.rollNo,
      s.name,
      selectedDate,
      s.classId,
      s.sectionId,
      sheetStatus[s.studentId] || 'Present',
      sheetRemarks[s.studentId] || ''
    ]);
    exportToCSV(`Aspire_Attendance_${selectedDate}_${selectedClass}`, headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#800000]" />
            <span>Attendance Management Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily marking, biometric reconciliation, and calculated attendance percentages.
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
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Header */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold text-[#800000]">ASPIRE COLLEGE SAHIWAL</h1>
        <p className="text-xs text-slate-700 font-bold uppercase">Daily Faculty Class Attendance Sheet</p>
        <div className="text-[11px] text-slate-600 mt-1 flex justify-center gap-6">
          <span>Date: <strong>{selectedDate}</strong></span>
          <span>Class: <strong>{selectedClass}</strong></span>
          <span>Section: <strong>{selectedSection}</strong></span>
          <span>Turnout: <strong>{attendanceRate}%</strong></span>
        </div>
      </div>

      {/* Single Filter Selection Ribbon */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Attendance Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              {sessions.map(s => <option key={s.sessionId} value={s.sessionName}>{s.sessionName}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              {classes.map(c => <option key={c.classId} value={c.classId}>{c.className}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              {sections.map(sec => <option key={sec.sectionId} value={sec.sectionId}>{sec.sectionName}</option>)}
            </select>
          </div>
        </div>

        {/* Quick Batch Actions & Turnout Summary */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Quick Mark All:</span>
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="px-2.5 py-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="px-2.5 py-1 font-semibold text-red-800 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
            >
              All Absent
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-700 font-mono">Present: {presentCount}</span>
            <span className="text-amber-700 font-mono">Late: {lateCount}</span>
            <span className="text-red-700 font-mono">Absent: {absentCount}</span>
            <span className="text-blue-700 font-mono">Leave: {leaveCount}</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono font-bold">
              Rate: {attendanceRate}%
            </span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Attendance records successfully persisted to college database!</span>
        </div>
      )}

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
                <th className="py-3 px-4">Remarks / Gate Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolledStudents.map((st) => {
                const currentStatus = sheetStatus[st.studentId] || 'Present';
                return (
                  <tr key={st.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#800000]">{st.rollNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-3 px-4 text-slate-600">{st.fatherName}</td>
                    <td className="py-3 px-4">
                      {/* Attendance Radio Buttons */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.studentId, 'Present')}
                          className={`px-3 py-1 rounded font-bold transition-all text-xs ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.studentId, 'Late')}
                          className={`px-3 py-1 rounded font-bold transition-all text-xs ${
                            currentStatus === 'Late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.studentId, 'Absent')}
                          className={`px-3 py-1 rounded font-bold transition-all text-xs ${
                            currentStatus === 'Absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'
                          }`}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.studentId, 'Leave')}
                          className={`px-3 py-1 rounded font-bold transition-all text-xs ${
                            currentStatus === 'Leave'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          LV
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={sheetRemarks[st.studentId] || ''}
                        onChange={(e) => setSheetRemarks(prev => ({ ...prev, [st.studentId]: e.target.value }))}
                        placeholder="Optional remarks..."
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
              {enrolledStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No students found in the selected Class / Section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
