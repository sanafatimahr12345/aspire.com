import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { 
  GraduationCap, 
  LayoutDashboard, 
  CalendarRange, 
  Layers, 
  Grid, 
  Bookmark, 
  BookOpen, 
  Users, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  CheckSquare, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  FileSpreadsheet, 
  Award, 
  LineChart, 
  Bell, 
  MessageSquare, 
  Image, 
  History, 
  Database, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';

export type AdminViewTab = 
  | 'dashboard'
  | 'sessions'
  | 'classes'
  | 'sections'
  | 'groups'
  | 'subjects'
  | 'students'
  | 'teachers'
  | 'employees'
  | 'incharge'
  | 'attendance'
  | 'fees'
  | 'income'
  | 'expense'
  | 'exams'
  | 'results'
  | 'performance'
  | 'notifications'
  | 'inquiries'
  | 'gallery'
  | 'audit'
  | 'backup'
  // Staff Portal Tabs
  | 'staff-classes'
  | 'staff-assignments'
  // Student Portal Tabs
  | 'student-profile'
  | 'student-fees'
  | 'student-attendance'
  | 'student-results';

interface DashboardLayoutProps {
  currentUser: User;
  currentTab: AdminViewTab;
  onSelectTab: (tab: AdminViewTab) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onSwitchRole: (role: UserRole) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  onViewPublicSite,
  onSwitchRole,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSwitchRoleOpen, setIsSwitchRoleOpen] = useState(false);

  // Grouped Navigation for Admin
  const adminNavSections = [
    {
      title: 'DASHBOARD',
      items: [
        { id: 'dashboard' as AdminViewTab, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ACADEMIC SETUP',
      items: [
        { id: 'sessions' as AdminViewTab, label: 'Sessions', icon: CalendarRange },
        { id: 'classes' as AdminViewTab, label: 'Classes', icon: Layers },
        { id: 'sections' as AdminViewTab, label: 'Sections', icon: Grid },
        { id: 'groups' as AdminViewTab, label: 'Groups', icon: Bookmark },
        { id: 'subjects' as AdminViewTab, label: 'Subjects', icon: BookOpen },
      ],
    },
    {
      title: 'PEOPLE MANAGEMENT',
      items: [
        { id: 'students' as AdminViewTab, label: 'Students', icon: Users },
        { id: 'teachers' as AdminViewTab, label: 'Teachers', icon: Briefcase },
        { id: 'employees' as AdminViewTab, label: 'Employees', icon: UserCheck },
        { id: 'incharge' as AdminViewTab, label: 'Incharge', icon: ShieldCheck },
      ],
    },
    {
      title: 'ATTENDANCE',
      items: [
        { id: 'attendance' as AdminViewTab, label: 'Attendance Management', icon: CheckSquare },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'fees' as AdminViewTab, label: 'Fee Management', icon: CreditCard },
        { id: 'income' as AdminViewTab, label: 'Income', icon: TrendingUp },
        { id: 'expense' as AdminViewTab, label: 'Expense', icon: TrendingDown },
      ],
    },
    {
      title: 'EXAMINATION',
      items: [
        { id: 'exams' as AdminViewTab, label: 'Exams', icon: FileSpreadsheet },
        { id: 'results' as AdminViewTab, label: 'Examination Results', icon: Award },
        { id: 'performance' as AdminViewTab, label: 'Student Performance', icon: LineChart },
      ],
    },
    {
      title: 'COMMUNICATIONS',
      items: [
        { id: 'notifications' as AdminViewTab, label: 'Notifications', icon: Bell },
        { id: 'inquiries' as AdminViewTab, label: 'Website Inquiries', icon: MessageSquare },
        { id: 'gallery' as AdminViewTab, label: 'Website Gallery', icon: Image },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'audit' as AdminViewTab, label: 'Audit Logs', icon: History },
        { id: 'backup' as AdminViewTab, label: 'Backup & Recovery', icon: Database },
      ],
    },
  ];

  // Staff Portal Nav Items
  const staffNavItems = [
    { id: 'dashboard' as AdminViewTab, label: 'Staff Dashboard', icon: LayoutDashboard },
    { id: 'staff-classes' as AdminViewTab, label: 'My Assigned Classes', icon: Layers },
    { id: 'attendance' as AdminViewTab, label: 'Mark Attendance', icon: CheckSquare },
    { id: 'staff-assignments' as AdminViewTab, label: 'Assignments & Homework', icon: BookOpen },
    { id: 'results' as AdminViewTab, label: 'Student Marks Entry', icon: Award },
  ];

  // Office Portal Nav Items
  const officeNavItems = [
    { id: 'dashboard' as AdminViewTab, label: 'Office Dashboard', icon: LayoutDashboard },
    { id: 'fees' as AdminViewTab, label: 'Fee Collection & Challans', icon: CreditCard },
    { id: 'income' as AdminViewTab, label: 'Income Records', icon: TrendingUp },
    { id: 'expense' as AdminViewTab, label: 'Campus Expenses', icon: TrendingDown },
    { id: 'students' as AdminViewTab, label: 'Student Records Directory', icon: Users },
  ];

  // Student Portal Nav Items
  const studentNavItems = [
    { id: 'dashboard' as AdminViewTab, label: 'My Student Portal', icon: LayoutDashboard },
    { id: 'student-profile' as AdminViewTab, label: 'My Profile & Enrollment', icon: UserIcon },
    { id: 'student-fees' as AdminViewTab, label: 'Fee Status & Challans', icon: CreditCard },
    { id: 'student-attendance' as AdminViewTab, label: 'My Attendance Logs', icon: CheckSquare },
    { id: 'student-results' as AdminViewTab, label: 'Exams & Result Cards', icon: Award },
    { id: 'notifications' as AdminViewTab, label: 'Campus Notifications', icon: Bell },
  ];

  const handleNavClick = (tab: AdminViewTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Human readable title helper for breadcrumb
  const getTabLabel = (tab: AdminViewTab): string => {
    const all = [
      ...adminNavSections.flatMap(s => s.items),
      ...staffNavItems,
      ...officeNavItems,
      ...studentNavItems,
    ];
    const match = all.find(i => i.id === tab);
    return match ? match.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col font-sans">
      {/* Top Header Navigation (Exact match to reference screenshot: white background, clean title, sub-label, local session button & logout) */}
      <header className="no-print sticky top-0 z-30 bg-white text-slate-800 shadow-xs border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Brand / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center font-black text-sm shadow-xs">
              A
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-wider text-[#800000] uppercase block leading-none">
                ASPIRE COLLEGE
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {currentUser.role.toUpperCase()} PORTAL
              </span>
            </div>
          </div>

          <div className="pl-3 sm:pl-4 border-l border-slate-200 ml-1 sm:ml-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
                {getTabLabel(currentTab)}
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-slate-400 leading-none">
              Final Restore Same-To-Same • Incharge Fixed • Graphx only here
            </span>
          </div>
        </div>

        {/* Right: Role Switcher, Public Site, Session badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsSwitchRoleOpen(!isSwitchRoleOpen)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline text-slate-400">Role:</span>
              <span className="capitalize font-bold text-[#800000]">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isSwitchRoleOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsSwitchRoleOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Portal
                </div>
                <button
                  onClick={() => onSwitchRole('admin')}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-100 ${
                    currentUser.role === 'admin' ? 'text-[#800000] font-bold bg-red-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Admin Portal</span>
                  {currentUser.role === 'admin' && <span className="text-[10px] text-[#800000] font-bold">Active</span>}
                </button>
                <button
                  onClick={() => onSwitchRole('staff')}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-100 ${
                    currentUser.role === 'staff' ? 'text-[#800000] font-bold bg-red-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Staff Portal</span>
                  {currentUser.role === 'staff' && <span className="text-[10px] text-[#800000] font-bold">Active</span>}
                </button>
                <button
                  onClick={() => onSwitchRole('office')}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-100 ${
                    currentUser.role === 'office' ? 'text-[#800000] font-bold bg-red-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Office Portal</span>
                  {currentUser.role === 'office' && <span className="text-[10px] text-[#800000] font-bold">Active</span>}
                </button>
                <button
                  onClick={() => onSwitchRole('student')}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-100 ${
                    currentUser.role === 'student' ? 'text-[#800000] font-bold bg-red-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Student Portal</span>
                  {currentUser.role === 'student' && <span className="text-[10px] text-[#800000] font-bold">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* View Public Website */}
          <button
            onClick={onViewPublicSite}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
          >
            <ExternalLink className="w-3 h-3 text-slate-500" />
            <span>Public Site</span>
          </button>

          {/* Yellow pill: LOCAL SESSION - NO PERSIST (exact match to screenshot) */}
          <div className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            LOCAL SESSION • NO PERSIST
          </div>

          {/* Logout button (matching reference) */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 hover:text-red-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop & Mobile Overlay (Exact light sidebar with rounded red pill buttons & badges) */}
        <aside
          className={`no-print fixed inset-y-0 left-0 z-40 w-60 bg-white text-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col border-r border-slate-200 shadow-2xs ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Sidebar Close Header */}
          <div className="lg:hidden p-4 bg-slate-50 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <GraduationCap className="w-5 h-5 text-[#800000]" />
              <span>Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Navigation Menu matching screenshot */}
          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-3 text-xs">
            {/* Top Red Active Dashboard Pill Button */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left ${
                currentTab === 'dashboard'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-slate-500'}`} />
              <span>Dashboard</span>
            </button>

            {/* Academic Setup Section */}
            <div>
              <button 
                onClick={() => handleNavClick('sessions')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <span className="flex items-center gap-2">
                  <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Setup</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="pl-6 space-y-0.5 mt-0.5">
                {[
                  { id: 'sessions', label: 'Sessions', count: '5' },
                  { id: 'classes', label: 'Classes', count: '15' },
                  { id: 'sections', label: 'Sections' },
                  { id: 'groups', label: 'Groups' },
                  { id: 'subjects', label: 'Subjects' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as AdminViewTab)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-[11px] rounded transition-colors text-left ${
                      currentTab === item.id 
                        ? 'font-bold text-[#800000] bg-red-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* People Management Section */}
            <div>
              <button 
                onClick={() => handleNavClick('students')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>People Management</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="pl-6 space-y-0.5 mt-0.5">
                {[
                  { id: 'students', label: 'Students', count: '326' },
                  { id: 'teachers', label: 'Teachers' },
                  { id: 'employees', label: 'Employees' },
                  { id: 'incharge', label: 'Incharge', count: '7', highlight: true },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as AdminViewTab)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-[11px] rounded transition-colors text-left ${
                      currentTab === item.id 
                        ? 'font-bold text-[#800000] bg-red-100/70 border border-red-200 shadow-2xs' 
                        : item.highlight 
                        ? 'bg-amber-50/70 border border-amber-200/80 font-bold text-slate-800 hover:bg-amber-100/70' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.count && (
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                        item.highlight ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Yellow / Red Pill Button: Login Settings */}
            <div className="pt-1">
              <button
                onClick={() => handleNavClick('audit')}
                className="w-full py-1.5 px-3 rounded-lg border border-red-200 bg-red-50/40 hover:bg-red-50 text-[#800000] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🔐 Login Settings</span>
              </button>
            </div>

            {/* Attendance */}
            <button
              onClick={() => handleNavClick('attendance')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-left ${
                currentTab === 'attendance'
                  ? 'bg-red-50 text-[#800000] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>Attendance</span>
            </button>

            {/* Finance */}
            <div>
              <button 
                onClick={() => handleNavClick('income')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <span className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Finance</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-red-100 ml-5">
                {[
                  { id: 'income', label: 'Income' },
                  { id: 'expense', label: 'Expense' },
                  { id: 'fees', label: 'Fee Management' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as AdminViewTab)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-[11px] rounded transition-colors text-left ${
                      currentTab === item.id 
                        ? 'font-bold text-[#800000] bg-red-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exams */}
            <button
              onClick={() => handleNavClick('exams')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-left ${
                currentTab === 'exams'
                  ? 'bg-red-50 text-[#800000] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
              <span>Exams</span>
            </button>

            {/* Results with green ALL badge (exact match) */}
            <button
              onClick={() => handleNavClick('results')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl border border-red-200 bg-red-50/50 text-[#800000] hover:bg-red-50 transition-colors text-left`}
            >
              <span className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#800000] text-white flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900">Results</span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ALL
              </span>
            </button>

            {/* Communications */}
            <div>
              <button 
                onClick={() => handleNavClick('notifications')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>Communications</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-red-100 ml-5">
                {[
                  { id: 'notifications', label: 'Notifications' },
                  { id: 'inquiries', label: 'Website Inquiries', count: '2' },
                  { id: 'gallery', label: 'Website Gallery' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as AdminViewTab)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-[11px] rounded transition-colors text-left ${
                      currentTab === item.id 
                        ? 'font-bold text-[#800000] bg-red-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* System */}
            <div>
              <button 
                onClick={() => handleNavClick('audit')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span>System</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-red-100 ml-5">
                {[
                  { id: 'audit', label: 'Audit Logs' },
                  { id: 'backup', label: 'Backup & Recovery' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as AdminViewTab)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-[11px] rounded transition-colors text-left ${
                      currentTab === item.id 
                        ? 'font-bold text-[#800000] bg-red-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Another Login Settings Button */}
            <div className="pt-1">
              <button
                onClick={() => handleNavClick('audit')}
                className="w-full py-1.5 px-3 rounded-lg border border-red-200 bg-red-50/40 hover:bg-red-50 text-[#800000] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🔐 Login Settings</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer User Card (Exact match to bottom left card in screenshot) */}
          <div className="p-3 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <img
                    src="/assets/gallery/student_life.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">admin user</span>
                  <span className="text-[9px] text-slate-400 block">in-memory session</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-slate-700" 
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile menu backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 bg-[#fbfbfb]">
          <div className="max-w-7xl mx-auto space-y-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
