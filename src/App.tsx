import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { StorageService } from './services/storage';
import { PublicWebsite } from './components/public/PublicWebsite';
import { LoginModal } from './components/auth/LoginModal';
import { DashboardLayout, AdminViewTab } from './components/layout/DashboardLayout';
import { AdminDashboardHome } from './components/dashboard/AdminDashboardHome';
import { 
  SessionsView, 
  ClassesView, 
  SectionsView, 
  GroupsView, 
  SubjectsView 
} from './components/academic/AcademicViews';
import { StudentsView } from './components/people/StudentsView';
import { 
  TeachersView, 
  EmployeesView, 
  InchargeView 
} from './components/people/StaffAndInchargeViews';
import { AttendanceView } from './components/attendance/AttendanceView';
import { 
  FeeManagementView, 
  IncomeView, 
  ExpenseView 
} from './components/finance/FinanceViews';
import { 
  ExamsScheduleView, 
  ExamResultsView 
} from './components/examination/ExaminationViews';
import { 
  NotificationsView, 
  WebsiteInquiriesView, 
  WebsiteGalleryView, 
  AuditLogsView, 
  BackupRecoveryView 
} from './components/communications/CommunicationsAndSystemViews';
import { 
  StaffPortalView, 
  StudentPortalView 
} from './components/portals/RolePortals';
import { TeacherPortal } from './components/portals/TeacherPortal';
import { FirebaseSync } from './services/firebase';

export default function App() {
  // Sync state version to force UI refresh when Firebase delivers updates
  const [, setSyncTick] = useState(0);

  // Initialize sample data on first run and wire Firestore realtime listeners
  useEffect(() => {
    StorageService.initializeIfEmpty();

    // Subscribe to cloud changes from Firestore
    const unsubs = [
      FirebaseSync.subscribeSlice('aspire_portal', 'students', (items) => {
        if (Array.isArray(items) && items.length > 0) {
          localStorage.setItem('aspire_students', JSON.stringify(items));
          setSyncTick(t => t + 1);
        }
      }),
      FirebaseSync.subscribeSlice('aspire_portal', 'attendance', (items) => {
        if (Array.isArray(items)) {
          localStorage.setItem('aspire_attendance', JSON.stringify(items));
          setSyncTick(t => t + 1);
        }
      }),
      FirebaseSync.subscribeSlice('aspire_portal', 'fees', (items) => {
        if (Array.isArray(items)) {
          localStorage.setItem('aspire_fees', JSON.stringify(items));
          setSyncTick(t => t + 1);
        }
      }),
      FirebaseSync.subscribeSlice('aspire_portal', 'results', (items) => {
        if (Array.isArray(items)) {
          localStorage.setItem('aspire_results', JSON.stringify(items));
          setSyncTick(t => t + 1);
        }
      }),
      FirebaseSync.subscribeSlice('aspire_portal', 'inquiries', (items) => {
        if (Array.isArray(items)) {
          localStorage.setItem('aspire_inquiries', JSON.stringify(items));
          setSyncTick(t => t + 1);
        }
      })
    ];

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return StorageService.getCurrentUser();
  });
  const [currentTab, setCurrentTab] = useState<AdminViewTab>('dashboard');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('admin');

  // Handle direct teacher portal login from footer
  const handleSelectTeacher = (teacherName: string) => {
    const teachers = StorageService.getTeachers();
    const matched = teachers.find(t => t.name.toLowerCase().includes(teacherName.toLowerCase()) || teacherName.toLowerCase().includes(t.name.toLowerCase()));
    const u: User = {
      id: matched?.teacherId || 'ASP-TCH-ZAHID',
      username: 'staff',
      name: matched?.name || teacherName,
      email: matched?.email || 'zahid.ramzan@aspire.edu.pk',
      role: 'staff',
      relatedId: matched?.teacherId || 'ASP-TCH-ZAHID',
    };
    StorageService.setCurrentUser(u);
    setCurrentUser(u);
    setCurrentTab('dashboard');
  };

  // If user is not logged in, show Public Website
  const handleOpenLogin = (role: UserRole) => {
    setLoginRole(role);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentTab('dashboard');
  };

  const handleSwitchRole = (role: UserRole) => {
    if (role === 'admin') {
      const u: User = {
        id: 'USR-ADMIN',
        username: 'admin',
        name: 'Principal Dr. M. Akram',
        email: 'principal@aspire.edu.pk',
        role: 'admin',
      };
      StorageService.setCurrentUser(u);
      setCurrentUser(u);
    } else if (role === 'staff') {
      const teachers = StorageService.getTeachers();
      const u: User = {
        id: teachers[0]?.teacherId || 'ASP-TCH-01',
        username: 'staff1',
        name: teachers[0]?.name || 'Prof. Dr. Tariq Mahmood',
        email: teachers[0]?.email || 'tariq.mahmood@aspire.edu.pk',
        role: 'staff',
        relatedId: teachers[0]?.teacherId || 'ASP-TCH-01',
      };
      StorageService.setCurrentUser(u);
      setCurrentUser(u);
    } else if (role === 'office') {
      const u: User = {
        id: 'ASP-EMP-01',
        username: 'office1',
        name: 'Muhammad Imran (Accounts Desk)',
        email: 'accounts@aspire.edu.pk',
        role: 'office',
        relatedId: 'ASP-EMP-01',
      };
      StorageService.setCurrentUser(u);
      setCurrentUser(u);
    } else if (role === 'student') {
      const students = StorageService.getStudents();
      const u: User = {
        id: students[0]?.studentId || 'asp-2026-001',
        username: students[0]?.rollNo || '101',
        name: students[0]?.name || 'Hamza Ali',
        email: 'hamza.ali@student.aspire.edu.pk',
        role: 'student',
        relatedId: students[0]?.studentId || 'asp-2026-001',
      };
      StorageService.setCurrentUser(u);
      setCurrentUser(u);
    }
    setCurrentTab('dashboard');
  };

  // If no user is logged in, show Public Website
  if (!currentUser) {
    return (
      <>
        <PublicWebsite onOpenLogin={handleOpenLogin} onSelectTeacher={handleSelectTeacher} />
        <LoginModal
          isOpen={isLoginOpen}
          initialRole={loginRole}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // If Staff / Teacher is logged in, render the exact dedicated Teacher Portal layout
  if (currentUser.role === 'staff') {
    return (
      <TeacherPortal
        currentUser={currentUser}
        onLogout={handleLogout}
        onViewMainSite={() => setCurrentUser(null)}
      />
    );
  }

  // Render Portal View content based on role and tab
  const renderContent = () => {
    // 1. Student Portal
    if (currentUser.role === 'student') {
      return <StudentPortalView currentUser={currentUser} activeTab={currentTab} />;
    }

    // 2. Staff Portal
    if (currentUser.role === 'staff') {
      if (currentTab === 'attendance') {
        return <AttendanceView />;
      }
      if (currentTab === 'results') {
        return <ExamResultsView />;
      }
      return <StaffPortalView currentUser={currentUser} activeTab={currentTab} />;
    }

    // 3. Office Portal
    if (currentUser.role === 'office') {
      if (currentTab === 'fees') {
        return <FeeManagementView />;
      }
      if (currentTab === 'income') {
        return <IncomeView />;
      }
      if (currentTab === 'expense') {
        return <ExpenseView />;
      }
      if (currentTab === 'students') {
        return <StudentsView />;
      }
      // Office Dashboard shows Fee Management & fast desk
      return (
        <div className="space-y-6">
          <div className="bg-[#800000] text-white p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-amber-300 uppercase">Accounts & Finance Desk</span>
            <h2 className="text-2xl font-bold font-heading mt-1">Aspire Accounts & Fee Collection Counter</h2>
            <p className="text-xs text-white/80 mt-1">Search student by Roll Number to verify dues and issue 3-part bank challans.</p>
          </div>
          <FeeManagementView />
        </div>
      );
    }

    // 4. Admin Management Dashboard Views
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboardHome onNavigate={setCurrentTab} />;
      case 'sessions':
        return <SessionsView />;
      case 'classes':
        return <ClassesView />;
      case 'sections':
        return <SectionsView />;
      case 'groups':
        return <GroupsView />;
      case 'subjects':
        return <SubjectsView />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'employees':
        return <EmployeesView />;
      case 'incharge':
        return <InchargeView />;
      case 'attendance':
        return <AttendanceView />;
      case 'fees':
        return <FeeManagementView />;
      case 'income':
        return <IncomeView />;
      case 'expense':
        return <ExpenseView />;
      case 'exams':
        return <ExamsScheduleView />;
      case 'results':
      case 'performance':
        return <ExamResultsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'inquiries':
        return <WebsiteInquiriesView />;
      case 'gallery':
        return <WebsiteGalleryView />;
      case 'audit':
        return <AuditLogsView />;
      case 'backup':
        return <BackupRecoveryView />;
      default:
        return <AdminDashboardHome onNavigate={setCurrentTab} />;
    }
  };

  return (
    <>
      <DashboardLayout
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={handleLogout}
        onViewPublicSite={() => setCurrentUser(null)}
        onSwitchRole={handleSwitchRole}
      >
        {renderContent()}
      </DashboardLayout>

      <LoginModal
        isOpen={isLoginOpen}
        initialRole={loginRole}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
