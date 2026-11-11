import React from 'react';
import { StorageService } from '../../services/storage';
import { AdminViewTab } from '../layout/DashboardLayout';
import { 
  Building, 
  Layers, 
  Users, 
  Check, 
  Eye, 
  ArrowRight
} from 'lucide-react';

interface AdminDashboardHomeProps {
  onNavigate: (tab: AdminViewTab) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({ onNavigate }) => {
  const students = StorageService.getStudents();
  const classes = StorageService.getClasses();
  const incharges = StorageService.getIncharges();
  const notifications = StorageService.getNotifications();
  const inquiries = StorageService.getInquiries();

  // Program count for pie chart
  const programCounts: { [key: string]: number } = {};
  students.forEach(s => {
    programCounts[s.program] = (programCounts[s.program] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      {/* 1. Top 4 Stat Metric Cards (Exact match to top 4 cards in user's image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: ACTIVE SESSIONS */}
        <div 
          onClick={() => onNavigate('sessions')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#800000]/40 cursor-pointer transition-all relative flex flex-col justify-between h-[106px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-xs">
              <Building className="w-3.5 h-3.5" />
            </div>
            <Eye className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ACTIVE SESSIONS
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono leading-tight">
              5
            </div>
            <span className="text-[10px] text-slate-400 block">
              Live academic years
            </span>
          </div>
        </div>

        {/* Card 2: LIVE CLASSES */}
        <div 
          onClick={() => onNavigate('classes')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#800000]/40 cursor-pointer transition-all relative flex flex-col justify-between h-[106px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <Eye className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              LIVE CLASSES
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono leading-tight">
              15
            </div>
            <span className="text-[10px] text-slate-400 block">
              F.Sc / ICS / I.Com
            </span>
          </div>
        </div>

        {/* Card 3: TOTAL STUDENTS */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#800000]/40 cursor-pointer transition-all relative flex flex-col justify-between h-[106px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-3.5 h-3.5" />
            </div>
            <Eye className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              TOTAL STUDENTS
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono leading-tight">
              326
            </div>
            <span className="text-[10px] text-slate-400 block">
              Click expands People
            </span>
          </div>
        </div>

        {/* Card 4: FEE COLLECTION */}
        <div 
          onClick={() => onNavigate('fees')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#800000]/40 cursor-pointer transition-all relative flex flex-col justify-between h-[106px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs font-bold text-xs">
              $
            </div>
            <Eye className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              FEE COLLECTION
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono leading-tight">
              Rs 30,000
            </div>
            <span className="text-[10px] text-slate-400 block">
              This month
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Main Multi-line Chart + Two Right-Hand Stacked Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column: Financial & Academic Overview (Wide Multi-line Chart) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900">
              Financial & Academic Overview
            </h3>
            <span className="text-[9px] font-bold tracking-wider text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase">
              FINAL GOOD VERSION
            </span>
          </div>

          {/* SVG Smooth Curve Graph matching screenshot */}
          <div className="relative w-full h-[240px] pt-4">
            <svg viewBox="0 0 700 230" className="w-full h-full overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="50" y1="20" x2="680" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <text x="40" y="24" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">600000</text>

              <line x1="50" y1="70" x2="680" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <text x="40" y="74" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">450000</text>

              <line x1="50" y1="120" x2="680" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />
              <text x="40" y="124" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">300000</text>

              <line x1="50" y1="170" x2="680" y2="170" stroke="#f1f5f9" strokeDasharray="3 3" />
              <text x="40" y="174" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">150000</text>

              <line x1="50" y1="210" x2="680" y2="210" stroke="#e2e8f0" />
              <text x="40" y="214" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

              {/* Month Labels along bottom */}
              <text x="50" y="226" fontSize="9" fill="#94a3b8">Jan</text>
              <text x="200" y="226" fontSize="9" fill="#94a3b8">Feb</text>
              <text x="360" y="226" fontSize="9" fill="#94a3b8">Mar</text>
              <text x="520" y="226" fontSize="9" fill="#94a3b8">Apr</text>
              <text x="670" y="226" fontSize="9" fill="#94a3b8">May</text>

              {/* Line 1 (Red: Income) */}
              <path
                d="M 50 82 C 140 92, 190 98, 230 92 C 300 80, 340 50, 420 52 C 500 55, 590 50, 680 32"
                fill="none"
                stroke="#c51616"
                strokeWidth="2"
              />

              {/* Line 2 (Black: Expense) */}
              <path
                d="M 50 135 C 130 138, 180 144, 230 142 C 310 140, 360 128, 430 132 C 520 135, 600 132, 680 118"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1.8"
              />

              {/* Line 3 (Yellow/Amber: Students / Linear Flatline at base) */}
              <line
                x1="50"
                y1="206"
                x2="680"
                y2="206"
                stroke="#eab308"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Legend below graph matching reference */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c51616] inline-block" />
              <span>Income</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
              <span>Expense</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Students</span>
            </span>
          </div>
        </div>

        {/* Right Column: Two Stacked Cards (Notifications by Audience & Inquiries Program Wise) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Top Right Card: Notifications by Audience */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs h-[160px] flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-800">
              Notifications by Audience
            </h4>

            {/* Red Histogram Bars */}
            <div className="relative w-full h-[100px] flex items-end justify-around px-2 pt-2">
              {/* Y Axis Grid lines */}
              <div className="absolute inset-x-0 top-0 border-b border-slate-100 text-[9px] text-slate-400 pl-1 font-mono">60</div>
              <div className="absolute inset-x-0 top-6 border-b border-slate-100 text-[9px] text-slate-400 pl-1 font-mono">45</div>
              <div className="absolute inset-x-0 top-12 border-b border-slate-100 text-[9px] text-slate-400 pl-1 font-mono">30</div>
              <div className="absolute inset-x-0 top-18 border-b border-slate-100 text-[9px] text-slate-400 pl-1 font-mono">15</div>

              {/* Students Bar (tall red) */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className="w-14 bg-[#a00000] rounded-sm h-[58px]" />
                <span className="text-[10px] text-slate-500">Students</span>
              </div>

              {/* Staff Bar (medium red) */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className="w-14 bg-[#a00000] rounded-sm h-[20px]" />
                <span className="text-[10px] text-slate-500">Staff</span>
              </div>

              {/* Office Bar (short red) */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className="w-14 bg-[#a00000] rounded-sm h-[14px]" />
                <span className="text-[10px] text-slate-500">Office</span>
              </div>
            </div>
          </div>

          {/* Bottom Right Card: Inquiries Program Wise (Pie Chart) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs h-[165px] flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-800">
              Inquiries Program Wise
            </h4>

            {/* Segmented Donut / Pie Chart matching reference */}
            <div className="flex items-center justify-center py-1">
              <svg viewBox="0 0 160 120" className="w-36 h-24 overflow-visible">
                {/* Slice 1: Dark Red (50%) */}
                <path
                  d="M 80 60 L 80 10 A 50 50 0 0 1 125 75 Z"
                  fill="#8c1212"
                />
                <text x="56" y="66" fontSize="9" fill="#c51616" fontWeight="bold">30</text>

                {/* Slice 2: Bright Red (25%) */}
                <path
                  d="M 80 60 L 125 75 A 50 50 0 0 1 95 108 Z"
                  fill="#1e293b"
                />
                <text x="134" y="65" fontSize="9" fill="#1e293b" fontWeight="bold">10</text>

                {/* Slice 3: Yellow / Amber (25%) */}
                <path
                  d="M 80 60 L 95 108 A 50 50 0 0 1 45 95 Z"
                  fill="#f59e0b"
                />
                <text x="96" y="112" fontSize="9" fill="#d97706" fontWeight="bold">20</text>

                {/* Slice 4: Deep Crimson remainder */}
                <path
                  d="M 80 60 L 45 95 A 50 50 0 0 1 80 10 Z"
                  fill="#b91c1c"
                />
                <text x="105" y="14" fontSize="8" fill="#b91c1c" fontWeight="bold">50</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Quick Access - Click to expand submenus (same-to-same behavior) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 mb-3">
          Quick Access - Click to expand submenus (same-to-same behavior)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Quick Item 1: Total Students */}
          <div
            onClick={() => onNavigate('students')}
            className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-slate-800">Total Students</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Expands People submenu → Students table
            </p>
          </div>

          {/* Quick Item 2: Classes */}
          <div
            onClick={() => onNavigate('classes')}
            className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-800">Classes</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Expands Academic Setup → Classes table
            </p>
          </div>

          {/* Quick Item 3: Incharge (Fixed) highlighted border */}
          <div
            onClick={() => onNavigate('incharge')}
            className="p-3 rounded-lg border border-amber-300/80 bg-amber-50/30 hover:bg-amber-50/60 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-amber-800 mb-1">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">Incharge (Fixed)</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Name • Collection • Image • Experience
            </p>
          </div>

          {/* Quick Item 4: Backup */}
          <div
            onClick={() => onNavigate('backup')}
            className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Backup</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Download / Import JSON
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
