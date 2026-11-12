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
  Edit3,
  Users,
  Layers,
  Sparkles,
  ClipboardList,
  Filter,
  Check,
  BookOpen
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
  const [results, setResults] = useState<ExamResult[]>(() => StorageService.getResults());
  const [exams, setExams] = useState<Exam[]>(() => StorageService.getExams());
  const students = StorageService.getStudents();
  const classes = StorageService.getClasses();
  const sections = StorageService.getSections();
  const subjects = StorageService.getSubjects();

  // Navigation & Filtering States
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [isBulkEntryOpen, setIsBulkEntryOpen] = useState(false);
  const [isSingleStudentOpen, setIsSingleStudentOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExamResult | null>(null);
  const [printTarget, setPrintTarget] = useState<ExamResult | null>(null);

  // 1. New Custom Test Form State
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestSubject, setNewTestSubject] = useState('Physics');
  const [newTestTotalMarks, setNewTestTotalMarks] = useState<number>(50);
  const [newTestClass, setNewTestClass] = useState(classes[0]?.className || 'FSc. Pre Engineering - 1 YEAR');
  const [newTestSection, setNewTestSection] = useState('BG2');
  const [newTestDate, setNewTestDate] = useState(new Date().toISOString().slice(0, 10));

  // 2. Section-Wise Bulk Marks Entry State
  const [bulkExamTitle, setBulkExamTitle] = useState('');
  const [bulkCustomTitle, setBulkCustomTitle] = useState('');
  const [bulkSubject, setBulkSubject] = useState('Physics');
  const [bulkClass, setBulkClass] = useState('FSc. Pre Engineering - 1 YEAR');
  const [bulkSection, setBulkSection] = useState('BG2');
  const [bulkTotalMarks, setBulkTotalMarks] = useState<number>(50);
  const [bulkMarksMap, setBulkMarksMap] = useState<Record<string, number | ''>>({});

  // 3. Single Student Entry State
  const [singleStudentId, setSingleStudentId] = useState(students[0]?.studentId || '');
  const [singleExamTitle, setSingleExamTitle] = useState('');
  const [singleSubject, setSingleSubject] = useState('Physics');
  const [singleTotalMarks, setSingleTotalMarks] = useState<number>(50);
  const [singleObtainedMarks, setSingleObtainedMarks] = useState<number>(45);
  const [singlePosition, setSinglePosition] = useState('');

  // 4. Edit Result State
  const [editObtainedMarks, setEditObtainedMarks] = useState<number>(0);
  const [editTotalMarks, setEditTotalMarks] = useState<number>(0);
  const [editPosition, setEditPosition] = useState('');

  const calculateGrade = (pct: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (pct >= 85) return 'A+';
    if (pct >= 75) return 'A';
    if (pct >= 65) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // List of distinct test titles for dropdowns
  const availableTestTitles = Array.from(
    new Set([
      ...exams.map(e => e.title),
      ...results.map(r => r.examTitle),
      'Physics Chapter 1 Test',
      'Chemistry Weekly Test',
      'Mathematics Monthly Test',
      'First Term Assessment 2026',
      'Mid-Term Examination',
      'Send-Up Examination 2026',
    ])
  );

  // Distinct classes represented in system
  const classList = Array.from(
    new Set([
      'All',
      ...classes.map(c => c.className),
      ...students.map(s => s.program),
    ])
  ).filter(Boolean);

  // Filter sections dynamically based on selected class
  const availableSections = Array.from(
    new Set(
      students
        .filter(s => selectedClass === 'All' || s.program === selectedClass || s.classId === selectedClass)
        .map(s => s.sectionId)
        .filter(Boolean)
    )
  );

  // Filter students for Bulk Entry Modal
  const bulkEnrolledStudents = students.filter(s => {
    const matchClass = !bulkClass || s.program === bulkClass || s.classId === bulkClass;
    const matchSection = !bulkSection || bulkSection === 'All' || s.sectionId === bulkSection;
    return matchClass && matchSection;
  });

  // Handle Save New Custom Test
  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    const newEx: Exam = {
      examId: `EXM-${Date.now().toString().slice(-6)}`,
      title: newTestTitle.trim(),
      term: 'Class Test',
      sessionId: '2025-2027 (1st Year)',
      classId: newTestClass,
      sectionId: newTestSection,
      subject: newTestSubject,
      totalMarks: newTestTotalMarks,
      startDate: newTestDate,
      endDate: newTestDate,
      status: 'In Progress',
    };

    const updated = [newEx, ...exams];
    setExams(updated);
    StorageService.saveExams(updated);
    StorageService.logAction('Admin/Faculty', 'Examinations', 'Created Test', `Created test "${newTestTitle}" (${newTestSubject}, Full: ${newTestTotalMarks})`);

    // Pre-fill bulk modal with this test and open it
    setBulkExamTitle(newTestTitle.trim());
    setBulkSubject(newTestSubject);
    setBulkClass(newTestClass);
    setBulkSection(newTestSection);
    setBulkTotalMarks(newTestTotalMarks);
    
    // Initialize marks map for enrolled students
    const initialMap: Record<string, number | ''> = {};
    students
      .filter(s => s.program === newTestClass && (newTestSection === 'All' || s.sectionId === newTestSection))
      .forEach(s => {
        initialMap[s.studentId] = '';
      });
    setBulkMarksMap(initialMap);

    setIsAddTestOpen(false);
    setIsBulkEntryOpen(true);
    showToast(`Test "${newTestTitle}" created! Now enter student marks for Section ${newTestSection}.`);
  };

  // Open Bulk Entry Modal
  const openBulkEntryModal = () => {
    const defaultTest = availableTestTitles[0] || 'Physics Chapter 1 Test';
    setBulkExamTitle(defaultTest);
    setBulkCustomTitle('');
    setBulkSubject('Physics');
    setBulkClass(selectedClass !== 'All' ? selectedClass : 'FSc. Pre Engineering - 1 YEAR');
    setBulkSection(selectedSection !== 'All' ? selectedSection : 'BG2');
    setBulkTotalMarks(50);
    
    // Pre-populate empty marks map for enrolled students
    const initialMap: Record<string, number | ''> = {};
    bulkEnrolledStudents.forEach(s => {
      // Find existing result if available
      const existing = results.find(r => r.studentId === s.studentId && r.examTitle === defaultTest);
      initialMap[s.studentId] = existing ? existing.obtainedMarks : '';
    });
    setBulkMarksMap(initialMap);
    setIsBulkEntryOpen(true);
  };

  // Handle Save Bulk Marks for Section
  const handleSaveBulkMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = (bulkExamTitle === '__CUSTOM__' ? bulkCustomTitle : bulkExamTitle).trim() || 'Class Test';
    if (!finalTitle) {
      alert('Please specify a valid test title.');
      return;
    }

    const studentsToSave = bulkEnrolledStudents.filter(
      s => bulkMarksMap[s.studentId] !== '' && bulkMarksMap[s.studentId] !== undefined
    );

    if (studentsToSave.length === 0) {
      alert('Please enter marks for at least one student.');
      return;
    }

    const newResultRecords: ExamResult[] = [];
    const existingIds = new Set(results.map(r => `${r.studentId}_${r.examTitle}`));

    studentsToSave.forEach(s => {
      const obt = Number(bulkMarksMap[s.studentId]) || 0;
      const total = Number(bulkTotalMarks) || 50;
      const pct = Math.round((obt / total) * 1000) / 10;
      const grade = calculateGrade(pct);
      const status: 'Pass' | 'Fail' = pct >= 33 ? 'Pass' : 'Fail';

      const key = `${s.studentId}_${finalTitle}`;
      const existing = results.find(r => `${r.studentId}_${r.examTitle}` === key);

      const record: ExamResult = {
        resultId: existing?.resultId || `RES-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
        examId: `EXM-${finalTitle.replace(/\s+/g, '-').slice(0, 10)}`,
        examTitle: finalTitle,
        studentId: s.studentId,
        rollNo: s.rollNo,
        studentName: s.name,
        fatherName: s.fatherName,
        classId: s.classId || s.program,
        sectionId: s.sectionId,
        program: s.program,
        subject: bulkSubject,
        subjects: [
          {
            subjectName: bulkSubject,
            subjectCode: bulkSubject.slice(0, 3).toUpperCase(),
            totalMarks: total,
            obtainedMarks: obt,
            grade,
          },
        ],
        totalMarks: total,
        obtainedMarks: obt,
        percentage: pct,
        grade,
        status,
      };
      newResultRecords.push(record);
    });

    // Merge with existing results (replacing matches for the same student + test)
    const remaining = results.filter(
      r => !newResultRecords.some(nr => nr.studentId === r.studentId && nr.examTitle === r.examTitle)
    );
    const updated = [...newResultRecords, ...remaining];

    setResults(updated);
    StorageService.saveResults(updated);
    StorageService.logAction(
      'Faculty/Admin',
      'Examinations',
      'Published Section Marks',
      `Recorded marks for ${newResultRecords.length} students in ${bulkClass} (${bulkSection}) for test "${finalTitle}"`
    );

    setIsBulkEntryOpen(false);
    showToast(`Successfully published results for ${newResultRecords.length} students of Section ${bulkSection}!`);
  };

  // Handle Save Single Student Result
  const handleSaveSingleResult = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.studentId === singleStudentId);
    if (!st) return;

    const testName = singleExamTitle.trim() || 'Subject Evaluation Test';
    const total = Number(singleTotalMarks) || 50;
    const obt = Number(singleObtainedMarks) || 0;
    const pct = Math.round((obt / total) * 1000) / 10;
    const grade = calculateGrade(pct);
    const status: 'Pass' | 'Fail' = pct >= 33 ? 'Pass' : 'Fail';

    const newResult: ExamResult = {
      resultId: `RES-${Date.now().toString().slice(-5)}`,
      examId: `EXM-${testName.replace(/\s+/g, '-').slice(0, 10)}`,
      examTitle: testName,
      studentId: st.studentId,
      rollNo: st.rollNo,
      studentName: st.name,
      fatherName: st.fatherName,
      classId: st.classId || st.program,
      sectionId: st.sectionId,
      program: st.program,
      subject: singleSubject,
      subjects: [
        {
          subjectName: singleSubject,
          subjectCode: singleSubject.slice(0, 3).toUpperCase(),
          totalMarks: total,
          obtainedMarks: obt,
          grade,
        },
      ],
      totalMarks: total,
      obtainedMarks: obt,
      percentage: pct,
      grade,
      status,
      position: singlePosition.trim() || undefined,
    };

    const updated = [newResult, ...results.filter(r => !(r.studentId === st.studentId && r.examTitle === testName))];
    setResults(updated);
    StorageService.saveResults(updated);
    StorageService.logAction(
      'Faculty',
      'Examinations',
      'Recorded Single Result',
      `Marks recorded for ${st.name} (Roll #${st.rollNo}): ${obt}/${total} (${pct}%) in ${testName}`
    );

    setIsSingleStudentOpen(false);
    showToast(`Marks recorded for ${st.name} (${st.rollNo})!`);
  };

  // Handle Save Edited Result
  const handleSaveEditResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;

    const total = Number(editTotalMarks) || 50;
    const obt = Number(editObtainedMarks) || 0;
    const pct = Math.round((obt / total) * 1000) / 10;
    const grade = calculateGrade(pct);
    const status: 'Pass' | 'Fail' = pct >= 33 ? 'Pass' : 'Fail';

    const updated = results.map(r => {
      if (r.resultId === editingResult.resultId) {
        return {
          ...r,
          totalMarks: total,
          obtainedMarks: obt,
          percentage: pct,
          grade,
          status,
          position: editPosition.trim() || undefined,
          subjects: r.subjects && r.subjects.length > 0
            ? r.subjects.map(s => ({ ...s, totalMarks: total, obtainedMarks: obt, grade }))
            : [{ subjectName: r.subject || r.examTitle, subjectCode: 'TEST', totalMarks: total, obtainedMarks: obt, grade }],
        };
      }
      return r;
    });

    setResults(updated);
    StorageService.saveResults(updated);
    StorageService.logAction('Admin', 'Examinations', 'Updated Result', `Updated marks for ${editingResult.studentName}`);
    setEditingResult(null);
    showToast('Student result updated successfully.');
  };

  // Handle Delete Result
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = results.filter(r => r.resultId !== deleteTarget.resultId);
    setResults(updated);
    StorageService.saveResults(updated);
    StorageService.logAction('Admin', 'Examinations', 'Deleted Result', `Deleted result of ${deleteTarget.studentName}`);
    setDeleteTarget(null);
    showToast('Result deleted.');
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Roll No', 'Student Name', 'Father Name', 'Class / Program', 'Section',
      'Test / Exam', 'Subject', 'Obtained Marks', 'Full Marks', 'Percentage', 'Grade', 'Status'
    ];
    const rows = filteredResults.map(r => [
      r.rollNo, r.studentName, r.fatherName, r.program, r.sectionId || '-',
      r.examTitle, r.subject || '-', r.obtainedMarks, r.totalMarks, `${r.percentage}%`, r.grade, r.status
    ]);
    exportToCSV(`Aspire_Results_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  // Filtered Results based on class, section, exam, and search
  const filteredResults = results.filter(r => {
    const matchSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      r.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(search.toLowerCase());

    const matchClass =
      selectedClass === 'All' ||
      r.program === selectedClass ||
      r.classId === selectedClass;

    const matchSection =
      selectedSection === 'All' ||
      r.sectionId === selectedSection;

    const matchExam =
      selectedExam === 'All' ||
      r.examTitle === selectedExam ||
      r.examId === selectedExam;

    return matchSearch && matchClass && matchSection && matchExam;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & ACTION BUTTONS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#800000]" />
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Student Results & Test Marks Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create custom tests, add full marks, enter scores section-wise or student-wise, and view instant class results.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setNewTestTitle('');
              setNewTestSubject('Physics');
              setNewTestTotalMarks(50);
              setNewTestClass(selectedClass !== 'All' ? selectedClass : 'FSc. Pre Engineering - 1 YEAR');
              setNewTestSection(selectedSection !== 'All' ? selectedSection : 'BG2');
              setIsAddTestOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold bg-[#800000] hover:bg-[#680000] text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Create / Add Test</span>
          </button>

          <button
            onClick={openBulkEntryModal}
            className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>📋 Section-Wise Marks Entry</span>
          </button>

          <button
            onClick={() => {
              setSingleExamTitle(availableTestTitles[0] || 'Physics Chapter 1 Test');
              setSingleSubject('Physics');
              setSingleTotalMarks(50);
              setSingleObtainedMarks(45);
              setIsSingleStudentOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>👤 Student-Wise Entry</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Export to Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border shadow-2xs ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Result Records</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{results.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Active Filter Results</span>
          <span className="text-xl font-bold font-mono text-[#800000] mt-1 block">{filteredResults.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Class Pass Rate</span>
          <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
            {filteredResults.length > 0 
              ? `${Math.round((filteredResults.filter(r => r.status === 'Pass').length / filteredResults.length) * 100)}%` 
              : '100%'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Tests & Exams Available</span>
          <span className="text-xl font-bold font-mono text-amber-600 mt-1 block">{availableTestTitles.length}</span>
        </div>
      </div>

      {/* 3. INTERACTIVE CLASS & SECTION SELECTOR (Jis class per click karo is ka result ae) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Class Filter Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#800000]" />
              <span>Select Class (Click to view results)</span>
            </span>
            {selectedClass !== 'All' && (
              <button
                onClick={() => { setSelectedClass('All'); setSelectedSection('All'); }}
                className="text-[11px] text-[#800000] font-semibold hover:underline"
              >
                Clear Class Filter
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {classList.map((cls) => {
              const count = cls === 'All' 
                ? results.length 
                : results.filter(r => r.program === cls || r.classId === cls).length;
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSection('All');
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#800000] text-white border-[#800000] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{cls}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Section:</span>
            </span>
            <button
              onClick={() => setSelectedSection('All')}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition-colors ${
                selectedSection === 'All'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              All Sections
            </button>
            {availableSections.map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition-colors ${
                  selectedSection === sec
                    ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                Section {sec}
              </button>
            ))}
          </div>

          {/* Test Name Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Test:</span>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium max-w-xs truncate"
            >
              <option value="All">All Tests & Exams</option>
              {availableTestTitles.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number, father name, or test title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
            />
          </div>
        </div>
      </div>

      {/* 4. RESULTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Test / Exam Title</th>
                <th className="py-3 px-4 text-center">Marks (Obt / Full)</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((r) => (
                <tr key={r.resultId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#800000]">{r.rollNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{r.studentName}</div>
                    <div className="text-[10px] text-slate-400">{r.fatherName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 block">{r.program}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {r.sectionId ? `Sec ${r.sectionId}` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{r.examTitle}</span>
                    <span className="text-[10px] text-slate-500">{r.subject || 'All Subjects'}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-bold text-slate-900">{r.obtainedMarks}</span>
                    <span className="text-slate-400 font-normal"> / {r.totalMarks}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#800000]">
                    {r.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${
                      r.grade === 'A+' 
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                        : r.grade === 'A'
                        ? 'text-blue-700 bg-blue-50 border border-blue-200'
                        : r.grade === 'B'
                        ? 'text-amber-800 bg-amber-50 border border-amber-200'
                        : 'text-slate-700 bg-slate-100'
                    }`}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'Pass'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPrintTarget(r)}
                        title="Print Result Card"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingResult(r);
                          setEditObtainedMarks(r.obtainedMarks);
                          setEditTotalMarks(r.totalMarks);
                          setEditPosition(r.position || '');
                        }}
                        title="Edit Marks"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        title="Delete Result"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-600">No test results found for this selection.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click <strong>"➕ Create / Add Test"</strong> or <strong>"📋 Section-Wise Marks Entry"</strong> to add student marks.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==============================================================
       * MODAL 1: CREATE / ADD CUSTOM TEST (test ke name be kode add kare)
       * ============================================================== */}
      {isAddTestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold">Create New Test / Exam</h3>
              </div>
              <button onClick={() => setIsAddTestOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTest} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Test / Exam Name * (Type any custom test name)
                </label>
                <input
                  type="text"
                  required
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  placeholder="e.g. Physics Chapter 1 Test or Monthly Grand Test"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={newTestSubject}
                    onChange={(e) => setNewTestSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="Economics">Economics</option>
                    <option value="Commerce / I.Com">Commerce / I.Com</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Marks (Total Number) *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={1000}
                    value={newTestTotalMarks}
                    onChange={(e) => setNewTestTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Class *</label>
                  <select
                    value={newTestClass}
                    onChange={(e) => setNewTestClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {classList.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Section *</label>
                  <select
                    value={newTestSection}
                    onChange={(e) => setNewTestSection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="All">All Sections</option>
                    <option value="BG2">BG2</option>
                    <option value="G2">G2</option>
                    <option value="BG3">BG3</option>
                    <option value="G3">G3</option>
                    <option value="BG4">BG4</option>
                    <option value="G4">G4</option>
                    <option value="BG1">BG1</option>
                    <option value="G1">G1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Date</label>
                <input
                  type="date"
                  value={newTestDate}
                  onChange={(e) => setNewTestDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTestOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000] shadow-xs"
                >
                  Create Test & Enter Student Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
       * MODAL 2: BULK SECTION MARKS ENTRY (student ke list wise)
       * ============================================================== */}
      {isBulkEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-300" />
                  <span>Section-Wise Student Marks Entry Sheet</span>
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Enter test scores for all students of this class and section simultaneously.
                </p>
              </div>
              <button onClick={() => setIsBulkEntryOpen(false)} className="text-white/80 hover:text-white text-base">✕</button>
            </div>

            <form onSubmit={handleSaveBulkMarks} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Header Configuration */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Test Name *</label>
                    <select
                      value={bulkExamTitle}
                      onChange={(e) => setBulkExamTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                    >
                      {availableTestTitles.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option value="__CUSTOM__">➕ Type Custom Test Name...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <select
                      value={bulkSubject}
                      onChange={(e) => setBulkSubject(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="English">English</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Islamic Studies">Islamic Studies</option>
                      <option value="Economics">Economics</option>
                      <option value="Commerce">Commerce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Marks (Total Number) *</label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={1000}
                      value={bulkTotalMarks}
                      onChange={(e) => setBulkTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-white"
                    />
                  </div>
                </div>

                {bulkExamTitle === '__CUSTOM__' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Custom Test Title *</label>
                    <input
                      type="text"
                      required
                      value={bulkCustomTitle}
                      onChange={(e) => setBulkCustomTitle(e.target.value)}
                      placeholder="e.g. Physics Chapter 2 Numerical Quiz"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                )}

                {/* Class & Section Choosers */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Class</label>
                    <select
                      value={bulkClass}
                      onChange={(e) => {
                        setBulkClass(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      {classList.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Section</label>
                    <select
                      value={bulkSection}
                      onChange={(e) => setBulkSection(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono font-bold"
                    >
                      <option value="All">All Sections</option>
                      <option value="BG2">BG2</option>
                      <option value="G2">G2</option>
                      <option value="BG3">BG3</option>
                      <option value="G3">G3</option>
                      <option value="BG4">BG4</option>
                      <option value="G4">G4</option>
                      <option value="BG1">BG1</option>
                      <option value="G1">G1</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Fill Toolbar */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Enrolled Students in this Section ({bulkEnrolledStudents.length}):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleScore = Math.round(bulkTotalMarks * 0.85);
                      const m: Record<string, number | ''> = {};
                      bulkEnrolledStudents.forEach(s => { m[s.studentId] = sampleScore; });
                      setBulkMarksMap(m);
                    }}
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors"
                  >
                    Auto-Fill 85% Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const m: Record<string, number | ''> = {};
                      bulkEnrolledStudents.forEach(s => { m[s.studentId] = ''; });
                      setBulkMarksMap(m);
                    }}
                    className="px-2.5 py-1 text-[11px] bg-red-50 hover:bg-red-100 text-red-700 rounded font-semibold transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Student Marks Entry Grid */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Father Name</th>
                      <th className="py-2.5 px-3 text-center">Full Marks</th>
                      <th className="py-2.5 px-3 text-center w-32">Obtained Marks *</th>
                      <th className="py-2.5 px-3 text-center w-20">Percentage</th>
                      <th className="py-2.5 px-3 text-center w-16">Grade</th>
                      <th className="py-2.5 px-3 text-center w-16">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bulkEnrolledStudents.map((st, idx) => {
                      const obt = bulkMarksMap[st.studentId];
                      const obtNum = typeof obt === 'number' ? obt : null;
                      const pct = obtNum !== null ? Math.round((obtNum / bulkTotalMarks) * 1000) / 10 : null;
                      const grade = pct !== null ? calculateGrade(pct) : '-';
                      const isPass = pct !== null ? pct >= 33 : null;

                      return (
                        <tr key={st.studentId} className="hover:bg-amber-50/20 transition-colors">
                          <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-mono font-bold text-[#800000]">{st.rollNo}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{st.name}</td>
                          <td className="py-2 px-3 text-slate-500">{st.fatherName}</td>
                          <td className="py-2 px-3 text-center font-mono font-semibold text-slate-500">
                            {bulkTotalMarks}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={bulkTotalMarks}
                              value={obt ?? ''}
                              placeholder="0"
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Math.min(bulkTotalMarks, Math.max(0, Number(e.target.value)));
                                setBulkMarksMap(prev => ({
                                  ...prev,
                                  [st.studentId]: val,
                                }));
                              }}
                              className="w-24 px-2 py-1 text-center font-mono font-bold text-sm bg-white border border-slate-300 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] rounded"
                            />
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-700">
                            {pct !== null ? `${pct}%` : '-'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              grade === 'A+' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {grade}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {isPass !== null ? (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {isPass ? 'Pass' : 'Fail'}
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}

                    {bulkEnrolledStudents.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          No enrolled students found for class "{bulkClass}" and section "{bulkSection}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Save Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {Object.values(bulkMarksMap).filter(v => v !== '' && v !== undefined).length} / {bulkEnrolledStudents.length} student scores entered.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkEntryOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000] shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>💾 Save All Marks & Publish Results</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
       * MODAL 3: SINGLE STUDENT WISE ENTRY (student wise be add kare)
       * ============================================================== */}
      {isSingleStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-300" />
                <span>Single Student Test Marks Entry</span>
              </h3>
              <button onClick={() => setIsSingleStudentOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveSingleResult} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Candidate Student *</label>
                <select
                  value={singleStudentId}
                  onChange={(e) => setSingleStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  {students.map(s => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.rollNo} - {s.name} ({s.program} · Sec {s.sectionId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test / Exam Name *</label>
                <input
                  type="text"
                  required
                  value={singleExamTitle}
                  onChange={(e) => setSingleExamTitle(e.target.value)}
                  placeholder="e.g. Physics Chapter 1 Test"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={singleSubject}
                    onChange={(e) => setSingleSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Marks *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={singleTotalMarks}
                    onChange={(e) => setSingleTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marks Obtained *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={singleTotalMarks}
                    value={singleObtainedMarks}
                    onChange={(e) => setSingleObtainedMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                  />
                </div>
              </div>

              {/* Calculated Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <span>Calculated Performance:</span>
                <span className="font-bold font-mono text-[#800000]">
                  {Math.round((singleObtainedMarks / (singleTotalMarks || 1)) * 1000) / 10}% · Grade: {calculateGrade((singleObtainedMarks / (singleTotalMarks || 1)) * 100)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Position / Distinction (Optional)</label>
                <input
                  type="text"
                  value={singlePosition}
                  onChange={(e) => setSinglePosition(e.target.value)}
                  placeholder="e.g. 1st in Section"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSingleStudentOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
       * MODAL 4: EDIT RESULT
       * ============================================================== */}
      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Edit Student Score</h3>
                <p className="text-xs text-white/80">{editingResult.studentName} · {editingResult.examTitle}</p>
              </div>
              <button onClick={() => setEditingResult(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEditResult} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Marks (Total)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={editTotalMarks}
                    onChange={(e) => setEditTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Obtained Marks</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={editTotalMarks}
                    value={editObtainedMarks}
                    onChange={(e) => setEditObtainedMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Position / Rank</label>
                <input
                  type="text"
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  placeholder="e.g. 1st in Class"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingResult(null)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Update Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Student Result?"
        message={`Are you sure you want to remove the result record for ${deleteTarget?.studentName} (${deleteTarget?.rollNo})?`}
        confirmLabel="Delete Result"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Printable Result Card Modal */}
      <PrintResultCardModal
        isOpen={!!printTarget}
        result={printTarget}
        onClose={() => setPrintTarget(null)}
      />
    </div>
  );
};
