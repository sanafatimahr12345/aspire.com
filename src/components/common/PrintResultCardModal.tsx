import React from 'react';
import { ExamResult } from '../../types';
import { Printer, X, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

interface PrintResultCardModalProps {
  isOpen: boolean;
  result: ExamResult | null;
  onClose: () => void;
}

export const PrintResultCardModal: React.FC<PrintResultCardModalProps> = ({
  isOpen,
  result,
  onClose,
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Action Bar (Hidden when printing) */}
        <div className="no-print bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold">Academic Result Card Preview</h3>
              <p className="text-xs text-white/80">{result.studentName} · Roll #{result.rollNo} · {result.examTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Transcript</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document */}
        <div className="p-8 bg-white printable-document text-slate-900">
          <div className="border-4 border-double border-[#800000] p-6 rounded-lg bg-white relative">
            {/* Header Lockup */}
            <div className="text-center pb-4 border-b-2 border-slate-300">
              <div className="flex items-center justify-center gap-2 text-[#800000] font-heading font-black text-2xl tracking-tight">
                <GraduationCap className="w-8 h-8 text-[#800000]" />
                <span>ASPIRE COLLEGE</span>
              </div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-0.5">
                Sahiwal Campus · Affiliated with BISE Sahiwal
              </p>
              <p className="text-[11px] text-slate-500">
                High Street, Officers Colony, Sahiwal · Tel: 040-1234567 · aspire.edu.pk
              </p>

              <div className="mt-4 inline-block px-4 py-1.5 bg-[#800000] text-amber-300 rounded font-heading font-bold text-sm tracking-wide shadow-xs">
                PROVISIONAL INTERMEDIATE RESULT CARD
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-1">{result.examTitle}</p>
            </div>

            {/* Candidate Particulars Grid */}
            <div className="my-5 grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Roll Number:</span>
                <span className="font-mono font-bold text-[#800000]">{result.rollNo}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Registration ID:</span>
                <span className="font-mono font-semibold text-slate-800">{result.studentId.toUpperCase()}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900">{result.studentName}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Father&apos;s Name:</span>
                <span className="font-semibold text-slate-800">{result.fatherName}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Program:</span>
                <span className="font-semibold text-slate-800">{result.program}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Session:</span>
                <span className="font-semibold text-slate-800">2025-2027</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="border border-slate-300 rounded-md overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#800000] text-white font-semibold">
                  <tr>
                    <th className="py-2 px-3 text-left">Code</th>
                    <th className="py-2 px-3 text-left">Subject / Discipline</th>
                    <th className="py-2 px-3 text-center">Total Marks</th>
                    <th className="py-2 px-3 text-center">Pass Marks</th>
                    <th className="py-2 px-3 text-center">Marks Obtained</th>
                    <th className="py-2 px-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.subjects.map((subj, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-2 px-3 font-mono text-slate-500">{subj.subjectCode}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{subj.subjectName}</td>
                      <td className="py-2 px-3 text-center font-mono">{subj.totalMarks}</td>
                      <td className="py-2 px-3 text-center font-mono text-slate-500">
                        {Math.round(subj.totalMarks * 0.33)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                        {subj.obtainedMarks}
                      </td>
                      <td className="py-2 px-3 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          subj.grade === 'A+' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-800'
                        }`}>
                          {subj.grade}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Aggregate Summary Row */}
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={2} className="py-2.5 px-3 uppercase text-slate-800">
                      Total Aggregate Marks:
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">{result.totalMarks}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                      {Math.round(result.totalMarks * 0.33)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#800000] text-sm">
                      {result.obtainedMarks}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-700 text-sm">
                      {result.grade}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Result Classification Box */}
            <div className="mt-5 p-4 rounded-lg border border-slate-300 bg-slate-50 flex flex-wrap items-center justify-between text-xs gap-4">
              <div>
                <span className="text-slate-500">Percentage:</span>{' '}
                <span className="font-bold font-mono text-slate-900 text-sm">{result.percentage}%</span>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>{' '}
                <span className={`font-bold px-2 py-0.5 rounded ${
                  result.status === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              {result.position && (
                <div>
                  <span className="text-slate-500">Distinction:</span>{' '}
                  <span className="font-bold text-amber-700">{result.position}</span>
                </div>
              )}
            </div>

            {/* Signature & Seal Area */}
            <div className="mt-12 pt-8 flex items-end justify-between text-xs text-slate-600">
              <div className="text-center w-36">
                <div className="border-t border-slate-400 pt-1 font-semibold">
                  Prepared By (Data Entry)
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#800000]/40 mx-auto flex items-center justify-center text-[9px] text-[#800000]/70 font-bold uppercase text-center p-2 leading-none">
                  Aspire College Official Seal
                </div>
              </div>

              <div className="text-center w-40">
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                  Principal / Controller
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Aspire College Sahiwal</div>
              </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-2">
              This provisional transcript is computer generated. In case of any discrepancy, college master register shall govern.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
