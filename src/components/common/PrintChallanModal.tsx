import React from 'react';
import { FeeRecord } from '../../types';
import { Printer, X, GraduationCap, Building2 } from 'lucide-react';
import { formatPKR, formatDate } from '../../utils/exportUtils';

interface PrintChallanModalProps {
  isOpen: boolean;
  fee: FeeRecord | null;
  onClose: () => void;
}

export const PrintChallanModal: React.FC<PrintChallanModalProps> = ({
  isOpen,
  fee,
  onClose,
}) => {
  if (!isOpen || !fee) return null;

  const handlePrint = () => {
    window.print();
  };

  const copies = [
    { title: 'BANK COPY', subtitle: 'To be retained by receiving bank branch' },
    { title: 'COLLEGE COPY', subtitle: 'To be submitted to Aspire Accounts Office' },
    { title: 'STUDENT COPY', subtitle: 'To be retained by student as proof of payment' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Action Bar (Hidden when printing) */}
        <div className="no-print bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold">Official Fee Challan Preview</h3>
              <p className="text-xs text-white/80">Challan #{fee.challanNo} · {fee.studentName} (Roll #{fee.rollNo})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print 3-Part Challan</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Challan Area */}
        <div className="p-6 bg-white overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-300 border border-slate-300 p-4 rounded-lg bg-white">
            {copies.map((copy, index) => (
              <div key={index} className="px-3 py-2 flex flex-col justify-between text-xs space-y-4">
                {/* Header */}
                <div className="text-center border-b border-slate-200 pb-2">
                  <div className="flex items-center justify-center gap-1 text-[#800000] font-black text-sm tracking-tight">
                    <GraduationCap className="w-4 h-4" />
                    <span>ASPIRE COLLEGE</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Sahiwal Campus · 040-1234567</p>
                  <div className="mt-1.5 inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-800 tracking-wider">
                    {copy.title}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">{copy.subtitle}</p>
                </div>

                {/* Bank Details */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] space-y-0.5">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Designated Bank:</span>
                    <span>Meezan Bank / HBL</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>A/C Title:</span>
                    <span>Aspire College Sahiwal</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-mono">
                    <span>A/C No:</span>
                    <span>0102-010582910-1</span>
                  </div>
                </div>

                {/* Challan & Student Metadata */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-500">Challan No:</span>
                    <span className="font-mono font-bold text-slate-900">{fee.challanNo}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-500">Billing Month:</span>
                    <span className="font-semibold text-slate-800">{fee.month}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-500">Roll No:</span>
                    <span className="font-bold text-[#800000]">{fee.rollNo}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-bold text-slate-900">{fee.studentName}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-500">Father Name:</span>
                    <span className="text-slate-800">{fee.fatherName}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-500">Program:</span>
                    <span className="text-slate-800">{fee.program}</span>
                  </div>
                </div>

                {/* Financial Breakup Table */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="py-1 px-2 text-left">Fee Particulars</th>
                        <th className="py-1 px-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-1 px-2 text-slate-600">Tuition Fee</td>
                        <td className="py-1 px-2 text-right font-mono">{formatPKR(fee.monthlyFee)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 text-slate-600">Lab / Exam Dues</td>
                        <td className="py-1 px-2 text-right font-mono">{formatPKR(fee.otherCharges)}</td>
                      </tr>
                      {fee.discount > 0 && (
                        <tr className="text-emerald-700">
                          <td className="py-1 px-2">Merit Scholarship Concession</td>
                          <td className="py-1 px-2 text-right font-mono">-{formatPKR(fee.discount)}</td>
                        </tr>
                      )}
                      <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                        <td className="py-1.5 px-2">Total Payable:</td>
                        <td className="py-1.5 px-2 text-right font-mono text-[#800000]">
                          {formatPKR(fee.totalFee)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 text-slate-500">Paid Amount:</td>
                        <td className="py-1 px-2 text-right font-mono text-emerald-600 font-semibold">{formatPKR(fee.paidAmount)}</td>
                      </tr>
                      <tr className="bg-red-50/50 font-bold">
                        <td className="py-1 px-2 text-red-800">Remaining Balance:</td>
                        <td className="py-1 px-2 text-right font-mono text-red-700">{formatPKR(fee.remainingAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Instructions & Signatures */}
                <div className="space-y-3 pt-2">
                  <p className="text-[9px] text-slate-500 leading-tight">
                    * Fee once deposited is non-refundable. Please submit before 15th to avoid late payment surcharge.
                  </p>

                  <div className="pt-8 flex justify-between items-end text-[9px] text-slate-500">
                    <div className="border-t border-slate-400 w-20 text-center">
                      Cashier
                    </div>
                    <div className="border-t border-slate-400 w-24 text-center">
                      Bank Officer / Stamp
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
