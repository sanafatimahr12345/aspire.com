import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { FeeRecord, Income, Expense, Student } from '../../types';
import { formatPKR, formatDate, exportToCSV } from '../../utils/exportUtils';
import { PrintChallanModal } from '../common/PrintChallanModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Plus, 
  Download, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Receipt,
  Clock,
  DollarSign
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. FEE MANAGEMENT
 * ------------------------------------------------------------- */
export const FeeManagementView: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>(StorageService.getFees());
  const classes = StorageService.getClasses();
  const students = StorageService.getStudents();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');

  // Modals
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [collectTarget, setCollectTarget] = useState<FeeRecord | null>(null);
  const [printTarget, setPrintTarget] = useState<FeeRecord | null>(null);
  const [isGenerateChallanOpen, setIsGenerateChallanOpen] = useState(false);

  // Collect Fee Form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Challan' | 'Online / JazzCash' | 'EasyPaisa'>('Bank Challan');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));

  // Generate Challan Form for Student
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || '');
  const [billingMonth, setBillingMonth] = useState('November 2026');
  const [tuitionFee, setTuitionFee] = useState(8500);
  const [otherCharges, setOtherCharges] = useState(1000);
  const [discount, setDiscount] = useState(0);

  const openCollectFee = (f: FeeRecord) => {
    setCollectTarget(f);
    setPaymentAmount(f.remainingAmount);
    setPaymentMethod('Bank Challan');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setIsCollectModalOpen(true);
  };

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectTarget) return;

    const newPaid = (collectTarget.paidAmount || 0) + Number(paymentAmount);
    const newRemaining = Math.max(collectTarget.totalFee - newPaid, 0);
    const newStatus: 'Paid' | 'Partial' | 'Unpaid' = 
      newRemaining === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';

    const updated = fees.map(f => 
      f.feeId === collectTarget.feeId 
        ? {
            ...f,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            paymentDate,
            paymentMethod,
            feeStatus: newStatus,
          }
        : f
    );

    // Also update student's fee status
    const allStudents = StorageService.getStudents();
    const updatedStudents = allStudents.map(st => 
      st.studentId === collectTarget.studentId 
        ? { ...st, feeStatus: newStatus } 
        : st
    );
    StorageService.saveStudents(updatedStudents);

    // Log to income & audit
    if (paymentAmount > 0) {
      const allIncome = StorageService.getIncome();
      allIncome.unshift({
        incomeId: `INC-${Date.now().toString().slice(-5)}`,
        category: 'Fee Collection',
        description: `Tuition fee payment for ${collectTarget.studentName} (Roll #${collectTarget.rollNo})`,
        amount: Number(paymentAmount),
        date: paymentDate,
        paymentMethod,
        receivedBy: 'Muhammad Imran (Accounts Desk)',
      });
      StorageService.saveIncome(allIncome);
    }

    StorageService.logAction(
      'Office Staff',
      'Finance Desk',
      'Fee Collected',
      `Received Rs. ${paymentAmount} for ${collectTarget.studentName} (${collectTarget.challanNo})`
    );

    setFees(updated);
    StorageService.saveFees(updated);
    setIsCollectModalOpen(false);
  };

  const handleCreateNewChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.studentId === selectedStudentId);
    if (!st) return;

    const total = tuitionFee + otherCharges - discount;
    const newFee: FeeRecord = {
      feeId: `FEE-${Date.now().toString().slice(-6)}`,
      studentId: st.studentId,
      studentName: st.name,
      fatherName: st.fatherName,
      rollNo: st.rollNo,
      program: st.program,
      classId: st.classId,
      month: billingMonth,
      monthlyFee: tuitionFee,
      otherCharges,
      discount,
      totalFee: total,
      paidAmount: 0,
      remainingAmount: total,
      feeStatus: 'Unpaid',
      challanNo: `CH-${Date.now().toString().slice(-6)}`,
    };

    const updated = [newFee, ...fees];
    setFees(updated);
    StorageService.saveFees(updated);
    StorageService.logAction('Office Staff', 'Finance Desk', 'Generated Challan', `Issued Challan ${newFee.challanNo} for ${st.name}`);
    setIsGenerateChallanOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Challan No', 'Roll No', 'Student Name', 'Father Name', 'Program',
      'Month', 'Tuition Fee', 'Other Charges', 'Discount', 'Total Fee',
      'Paid Amount', 'Remaining', 'Status', 'Payment Method', 'Date'
    ];
    const rows = filtered.map(f => [
      f.challanNo, f.rollNo, f.studentName, f.fatherName, f.program,
      f.month, f.monthlyFee, f.otherCharges, f.discount, f.totalFee,
      f.paidAmount, f.remainingAmount, f.feeStatus, f.paymentMethod || '-', f.paymentDate || '-'
    ]);
    exportToCSV(`Aspire_Fee_Ledger_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const filtered = fees.filter(f => {
    const matchSearch = 
      f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.rollNo.includes(search) ||
      f.challanNo.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === 'All' || f.classId === classFilter;
    const matchStatus = statusFilter === 'All' || f.feeStatus === statusFilter;
    const matchMonth = monthFilter === 'All' || f.month === monthFilter;
    return matchSearch && matchClass && matchStatus && matchMonth;
  });

  const totalCollected = filtered.reduce((s, f) => s + f.paidAmount, 0);
  const totalPending = filtered.reduce((s, f) => s + f.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#800000]" />
            <span>Student Fee & Challan Management Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate 3-part bank challans, collect tuition dues, track defaulters, and print official receipts.
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
            onClick={() => setIsGenerateChallanOpen(true)}
            className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Fee Challan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Filtered Invoices</span>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{filtered.length} Invoices</div>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800">Total Fee Realized</span>
          <div className="text-xl font-extrabold text-emerald-900 font-mono mt-1">{formatPKR(totalCollected)}</div>
        </div>
        <div className="bg-red-50/60 p-4 rounded-xl border border-red-200 shadow-xs">
          <span className="text-xs font-semibold text-red-800">Pending Balances</span>
          <div className="text-xl font-extrabold text-red-900 font-mono mt-1">{formatPKR(totalPending)}</div>
        </div>
      </div>

      {/* SINGLE Unified Filter Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or challan number..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-xs">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Classes</option>
            {classes.map(c => <option key={c.classId} value={c.classId}>{c.className}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="All">All Months</option>
            <option value="November 2026">November 2026</option>
            <option value="October 2026">October 2026</option>
          </select>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Challan No</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4 text-right">Total Payable</th>
                <th className="py-3 px-4 text-right">Paid Amount</th>
                <th className="py-3 px-4 text-right">Remaining</th>
                <th className="py-3 px-4">Status</th>
                <th className="no-print py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f) => (
                <tr key={f.feeId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{f.challanNo}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#800000]">{f.rollNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{f.studentName}</div>
                    <div className="text-[10px] text-slate-400">{f.program}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{f.month}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatPKR(f.totalFee)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                    {formatPKR(f.paidAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-red-700">
                    {formatPKR(f.remainingAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.feeStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.feeStatus === 'Partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {f.feeStatus}
                    </span>
                  </td>
                  <td className="no-print py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {f.feeStatus !== 'Paid' && (
                        <button
                          onClick={() => openCollectFee(f)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors"
                        >
                          Collect
                        </button>
                      )}
                      <button
                        onClick={() => setPrintTarget(f)}
                        title="Print Official Challan"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Challan</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No fee challan records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && collectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Collect Student Fee</h3>
                <p className="text-xs text-white/80">{collectTarget.studentName} · Roll #{collectTarget.rollNo}</p>
              </div>
              <button onClick={() => setIsCollectModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCollection} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Invoice Fee:</span>
                  <span className="font-mono font-bold text-slate-900">{formatPKR(collectTarget.totalFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Already Paid:</span>
                  <span className="font-mono text-emerald-700 font-semibold">{formatPKR(collectTarget.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="font-semibold text-slate-800">Remaining Balance:</span>
                  <span className="font-mono font-bold text-red-700">{formatPKR(collectTarget.remainingAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (PKR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={collectTarget.remainingAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-[#800000]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Bank Challan">Bank Challan (Meezan/HBL)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Online / JazzCash">Online / JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Fee Challan Modal */}
      {isGenerateChallanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#800000] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Generate Fee Challan</h3>
              <button onClick={() => setIsGenerateChallanOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNewChallan} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student *</label>
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing Month</label>
                <select
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="November 2026">November 2026</option>
                  <option value="December 2026">December 2026</option>
                  <option value="January 2027">January 2027</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tuition Fee</label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lab / Exam</label>
                  <input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 flex justify-between font-bold text-xs">
                <span className="text-slate-800">Total Net Payable:</span>
                <span className="font-mono text-[#800000]">
                  {formatPKR(tuitionFee + otherCharges - discount)}
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateChallanOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#800000] rounded-lg hover:bg-[#680000]"
                >
                  Create Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official 3-Copy Print Challan Modal */}
      <PrintChallanModal
        isOpen={!!printTarget}
        fee={printTarget}
        onClose={() => setPrintTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. INCOME MANAGEMENT
 * ------------------------------------------------------------- */
export const IncomeView: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>(StorageService.getIncome());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);

  const [category, setCategory] = useState<Income['category']>('Fee Collection');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(10000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Cash Counter');
  const [receivedBy, setReceivedBy] = useState('Muhammad Imran');

  const openAdd = () => {
    setDescription('');
    setAmount(15000);
    setDate(new Date().toISOString().slice(0, 10));
    setPaymentMethod('Bank Deposit');
    setReceivedBy('Muhammad Imran');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    const newInc: Income = {
      incomeId: `INC-${Date.now().toString().slice(-6)}`,
      category,
      description,
      amount,
      date,
      paymentMethod,
      receivedBy,
    };

    const updated = [newInc, ...incomes];
    setIncomes(updated);
    StorageService.saveIncome(updated);
    StorageService.logAction('Office Staff', 'Accounts', 'Added Income', `Recorded income of Rs. ${amount} (${category})`);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = incomes.filter(i => i.incomeId !== deleteTarget.incomeId);
    setIncomes(updated);
    StorageService.saveIncome(updated);
    StorageService.logAction('Admin', 'Accounts', 'Deleted Income', `Removed income voucher ${deleteTarget.incomeId}`);
    setDeleteTarget(null);
  };

  const filtered = incomes.filter(i => 
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Campus Income & Revenue Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tuition collections, prospectus sales, examination dues, and sports funds.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Income</span>
        </button>
      </div>

      <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-800">Total Filtered Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5">{formatPKR(total)}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search income description or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Vouchers
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Voucher ID</th>
                <th className="py-3 px-4">Income Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inc) => (
                <tr key={inc.incomeId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{inc.incomeId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {inc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{inc.description}</td>
                  <td className="py-3 px-4 text-slate-600">{inc.paymentMethod}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{inc.date}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                    {formatPKR(inc.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(inc)}
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
              <h3 className="text-base font-bold">Record Income Voucher</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Income Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Fee Collection">Fee Collection</option>
                  <option value="Prospectus Sale">Prospectus Sale</option>
                  <option value="Lab Dues">Lab Dues</option>
                  <option value="Sports Fund">Sports Fund</option>
                  <option value="Donation / Grant">Donation / Grant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Prospectus Sales Batch 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Received Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Received By</label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
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
                  className="px-4 py-2 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Income Voucher?"
        message={`Are you sure you want to delete income voucher "${deleteTarget?.incomeId}"?`}
        confirmLabel="Delete Voucher"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. EXPENSE MANAGEMENT
 * ------------------------------------------------------------- */
export const ExpenseView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(StorageService.getExpenses());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const [category, setCategory] = useState<Expense['category']>('Campus Maintenance');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(25000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Cash Voucher');
  const [approvedBy, setApprovedBy] = useState('Principal / Admin');

  const openAdd = () => {
    setDescription('');
    setAmount(25000);
    setDate(new Date().toISOString().slice(0, 10));
    setPaymentMethod('Cash Voucher');
    setApprovedBy('Principal / Admin');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    const newExp: Expense = {
      expenseId: `EXP-${Date.now().toString().slice(-6)}`,
      category,
      description,
      amount,
      date,
      paymentMethod,
      approvedBy,
    };

    const updated = [newExp, ...expenses];
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    StorageService.logAction('Office Staff', 'Accounts', 'Added Expense', `Recorded expense of Rs. ${amount} (${category})`);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = expenses.filter(e => e.expenseId !== deleteTarget.expenseId);
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    StorageService.logAction('Admin', 'Accounts', 'Deleted Expense', `Removed expense voucher ${deleteTarget.expenseId}`);
    setDeleteTarget(null);
  };

  const filtered = expenses.filter(e => 
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span>Campus Operational Expense Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Faculty salaries, electricity, generator fuel, lab consumables, and printing costs.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-xs font-bold bg-[#800000] text-white rounded-lg shadow-sm hover:bg-[#680000] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      <div className="bg-red-50/60 p-4 rounded-xl border border-red-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-red-800">Total Filtered Expenditures</span>
          <div className="text-2xl font-extrabold text-red-900 font-mono mt-0.5">{formatPKR(total)}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expense description or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filtered.length} Expense Vouchers
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Expense ID</th>
                <th className="py-3 px-4">Expense Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((exp) => (
                <tr key={exp.expenseId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{exp.expenseId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{exp.description}</td>
                  <td className="py-3 px-4 text-slate-600">{exp.approvedBy}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{exp.date}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-red-700">
                    {formatPKR(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(exp)}
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
              <h3 className="text-base font-bold">Record Campus Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Faculty Salaries">Faculty Salaries</option>
                  <option value="Staff Salaries">Staff Salaries</option>
                  <option value="Electricity & Generator">Electricity & Generator</option>
                  <option value="Lab Consumables">Lab Consumables</option>
                  <option value="Printing & Stationery">Printing & Stationery</option>
                  <option value="Campus Maintenance">Campus Maintenance</option>
                  <option value="Sports & Events">Sports & Events</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Particulars *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Diesel fuel for backup generator"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Disbursement Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Approved By</label>
                  <input
                    type="text"
                    value={approvedBy}
                    onChange={(e) => setApprovedBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
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
                  className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Expense Voucher?"
        message={`Are you sure you want to remove expense voucher "${deleteTarget?.expenseId}"?`}
        confirmLabel="Delete Voucher"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
