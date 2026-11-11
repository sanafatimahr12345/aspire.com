import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Exam, ExamResult, Student, SubjectMarkEntry } from '../../types';
import { PrintResultCardModal } from '../common/PrintResultCardModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { exportToCSV } from '../../utils/exportUtils';
import { 
  FileSpreadsheet, 
  Award, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  Trash2, 
  CheckCircle2, 
  TrendingUp,
  FileCheck,
  Edit3
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. EXAMS SCHEDULE
 * ------------------------------------------------------------- */
export const ExamsScheduleView: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>(StorageService.getExams());
  const sessions = StorageService.getSessions();
  const classes = StorageService.getClasses();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  const [title, setTitle] = useState('');
  const [term, setTerm] = useState<Exam['term']>('Mid-Term');
  const [sessionId, setSessionId] = useState(sessions[0]?.sessionName || '');
  const [classId, setClassId] = useState(classes[0]?.classId || '');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [status, setStatus] = useState<Exam['status']>('Upcoming');

  const openAdd = () => {
    setTitle('');
    setTerm('Mid-Term');
    setStartDate('2026-11-20');
    setEndDate('2026-11-30');
    setStatus('Upcoming');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newExam: Exam = {
      examId: `EXM-${Date.now().toString().slice(-6)}`,
      title,
      term,
      sessionId,
      classId,
      startDate,
      endDate,
      status,
    };

    const updated = [newExam, ...exams];
    setExams(updated);
    StorageService.saveExams(updated);
    StorageService.logAction('Admin', 'Examination Controller', 'Created Exam Schedule', `Scheduled ${title}`);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = exams.filter(e => e.examId !== deleteTarget.examId);
    setExams(updated);
    StorageService.saveExams(updated);
    StorageService.logAction('Admin', 'Examination Controller', 'Deleted Exam', `Removed exam ${deleteTarget.title}`);
    setDeleteTarget(null);
  };

  const filtered = exams.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.term.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#800000]" />
            <span>Examinations Controller & Schedules</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure First Term, Mid-Term, Pre-Board Send-up, and Annual Board Trial exams.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Examination</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Exam ID</th>
                <th className="py-3 px-4">Examination Title</th>
                <th className="py-3 px-4">Academic Term</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.examId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{e.examId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{e.title}</td>
                  <td className="py-3 px-4 font-semibold text-[#800000]">{e.term}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{e.startDate}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{e.endDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      e.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : e.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(e)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              <h3 className="text-base font-bold">Schedule Examination</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Assessment 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Term Category *</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="First Term">First Term</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="Pre-Board / Send-up">Pre-Board / Send-up</option>
                  <option value="Annual Board Trial">Annual Board Trial</option>
                </select>
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
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
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
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Examination?"
        message={`Are you sure you want to remove exam "${deleteTarget?.title}"?`}
        confirmLabel="Delete Exam"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. EXAMINATION RESULTS & TRANSCRIPTS
 * ------------------------------------------------------------- */
export const ExamResultsView: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>(StorageService.getResults());
  const exams = StorageService.getExams();
  const students = StorageService.getStudents();

  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('All');
  const [isNewResultOpen, setIsNewResultOpen] = useState(false);
  const [printTarget, setPrintTarget] = useState<ExamResult | null>(null);

  // New Marks Entry Form
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.examId || '');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || '');
  const [positionInput, setPositionInput] = useState('');

  // 6 Intermediate Subjects Default Form
  const [phyMarks, setPhyMarks] = useState<number>(85);
  const [chemMarks, setChemMarks] = useState<number>(88);
  const [bioOrMathMarks, setBioOrMathMarks] = useState<number>(90);
  const [engMarks, setEngMarks] = useState<number>(84);
  const [urdMarks, setUrdMarks] = useState<number>(80);
  const [islMarks, setIslMarks] = useState<number>(45);

  const calculateGrade = (pct: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (pct >= 85) return 'A+';
    if (pct >= 75) return 'A';
    if (pct >= 65) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.studentId === selectedStudentId);
    const ex = exams.find(x => x.examId === selectedExamId);
    if (!st || !ex) return;

    const subjects: SubjectMarkEntry[] = [
      { subjectName: 'English (Compulsory)', subjectCode: 'ENG-101', totalMarks: 100, obtainedMarks: engMarks, grade: calculateGrade(engMarks) },
      { subjectName: 'Urdu', subjectCode: 'URD-101', totalMarks: 100, obtainedMarks: urdMarks, grade: calculateGrade(urdMarks) },
      { subjectName: 'Islamic Studies', subjectCode: 'ISL-101', totalMarks: 50, obtainedMarks: islMarks, grade: calculateGrade((islMarks / 50) * 100) },
      { subjectName: 'Physics (Theory & Practical)', subjectCode: 'PHY-101', totalMarks: 100, obtainedMarks: phyMarks, grade: calculateGrade(phyMarks) },
      { subjectName: 'Chemistry', subjectCode: 'CHM-101', totalMarks: 100, obtainedMarks: chemMarks, grade: calculateGrade(chemMarks) },
      { subjectName: st.program.includes('Pre-Medical') ? 'Biology' : 'Mathematics', subjectCode: 'MTH-101', totalMarks: 100, obtainedMarks: bioOrMathMarks, grade: calculateGrade(bioOrMathMarks) },
    ];

    const total = 550;
    const obtained = engMarks + urdMarks + islMarks + phyMarks + chemMarks + bioOrMathMarks;
    const pct = Math.round((obtained / total) * 1000) / 10;
    const finalGrade = calculateGrade(pct);
    const passStatus: 'Pass' | 'Fail' = pct >= 33 ? 'Pass' : 'Fail';

    const newResult: ExamResult = {
      resultId: `RES-${Date.now().toString().slice(-5)}`,
      examId: ex.examId,
      examTitle: ex.title,
      studentId: st.studentId,
      rollNo: st.rollNo,
      studentName: st.name,
      fatherName: st.fatherName,
      classId: st.classId,
      program: st.program,
      subjects,
      totalMarks: total,
      obtainedMarks: obtained,
      percentage: pct,
      grade: finalGrade,
      status: passStatus,
      position: positionInput || undefined,
    };

    const updated = [newResult, ...results];
    setResults(updated);
    StorageService.saveResults(updated);
    StorageService.logAction(
      'Faculty/Controller',
      'Examinations',
      'Published Result',
      `Result recorded for ${st.name} (Roll #${st.rollNo}) in ${ex.title}: ${pct}% (${finalGrade})`
    );
    setIsNewResultOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Roll No', 'Student Name', 'Father Name', 'Program', 'Examination',
      'Total Marks', 'Obtained Marks', 'Percentage', 'Grade', 'Status', 'Distinction'
    ];
    const rows = filtered.map(r => [
      r.rollNo, r.studentName, r.fatherName, r.program, r.examTitle,
      r.totalMarks, r.obtainedMarks, `${r.percentage}%`, r.grade, r.status, r.position || '-'
    ]);
    exportToCSV(`Aspire_Results_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const filtered = results.filter(r => {
    const matchSearch = 
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.includes(search) ||
      r.examTitle.toLowerCase().includes(search.toLowerCase());
    const matchExam = examFilter === 'All' || r.examId === examFilter;
    return matchSearch && matchExam;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-[#800000]" />
            <span>Examination Results & Student Performance Marksheets</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Subject-wise score entry, grade calculation, and printable official BISE-format result cards.
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
            onClick={() => setIsNewResultOpen(true)}
            className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Enter Student Marks</span>
          </button>
        </div>
      </div>

      {/* SINGLE Filter Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or exam..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Exam:</span>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Examinations</option>
            {exams.map(x => <option key={x.examId} value={x.examId}>{x.title}</option>)}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Examination</th>
                <th className="py-3 px-4 text-center">Marks (Obt / Max)</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Status</th>
                <th className="no-print py-3 px-4 text-right">Official Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.resultId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#800000]">{r.rollNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{r.studentName}</div>
                    <div className="text-[10px] text-slate-400">{r.fatherName}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{r.program}</td>
                  <td className="py-3 px-4 text-slate-600">{r.examTitle}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    {r.obtainedMarks} / {r.totalMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#800000]">
                    {r.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${
                      r.grade === 'A+' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-800'
                    }`}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {r.status}
                    </span>
                  </td>
                  <td className="no-print py-3 px-4 text-right">
                    <button
                      onClick={() => setPrintTarget(r)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors ml-auto"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#800000]" />
                      <span>Print Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Entry Modal */}
      {isNewResultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Record Student Examination Marks</h3>
              <button onClick={() => setIsNewResultOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveResult} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Examination *</label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {exams.map(x => <option key={x.examId} value={x.examId}>{x.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Candidate *</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {students.map(s => (
                      <option key={s.studentId} value={s.studentId}>
                        Roll #{s.rollNo} - {s.name} ({s.program})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Marks Inputs */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                  Subject Marks Entry (BISE Intermediate Pattern):
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">English (Max 100)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={engMarks}
                      onChange={(e) => setEngMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Urdu (Max 100)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={urdMarks}
                      onChange={(e) => setUrdMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Islamiat (Max 50)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={50}
                      value={islMarks}
                      onChange={(e) => setIslMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Physics (Max 100)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={phyMarks}
                      onChange={(e) => setPhyMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Chemistry (Max 100)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={chemMarks}
                      onChange={(e) => setChemMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Math / Bio (Max 100)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={bioOrMathMarks}
                      onChange={(e) => setBioOrMathMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between font-bold text-xs text-slate-900 border-t border-slate-200">
                  <span>Calculated Aggregate:</span>
                  <span className="font-mono text-[#800000]">
                    {engMarks + urdMarks + islMarks + phyMarks + chemMarks + bioOrMathMarks} / 550 (
                    {Math.round(((engMarks + urdMarks + islMarks + phyMarks + chemMarks + bioOrMathMarks) / 550) * 1000) / 10}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Distinction / Class Rank (Optional)</label>
                <input
                  type="text"
                  value={positionInput}
                  onChange={(e) => setPositionInput(e.target.value)}
                  placeholder="e.g. 1st in Pre-Engineering Wing"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewResultOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Publish Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Result Card Modal */}
      <PrintResultCardModal
        isOpen={!!printTarget}
        result={printTarget}
        onClose={() => setPrintTarget(null)}
      />
    </div>
  );
};
