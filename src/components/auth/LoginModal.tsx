import React, { useState } from 'react';
import { UserRole, User } from '../../types';
import { StorageService } from '../../services/storage';
import { Lock, User as UserIcon, Shield, GraduationCap, Briefcase, Building, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  initialRole?: UserRole;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialRole = 'admin',
  onClose,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Quick switch credentials handler
  const setDemoCredentials = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'staff') {
      setUsername('staff1');
      setPassword('staff123');
    } else if (role === 'office') {
      setUsername('office1');
      setPassword('office123');
    } else if (role === 'student') {
      setUsername('asp-2026-001');
      setPassword('student123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please provide both username/ID and password.');
      return;
    }

    // Role-specific verification
    if (selectedRole === 'admin') {
      if ((cleanUser === 'admin' || cleanUser === 'principal') && cleanPass === 'admin123') {
        const user: User = {
          id: 'USR-ADMIN',
          username: 'admin',
          name: 'Principal Dr. M. Akram',
          email: 'principal@aspire.edu.pk',
          role: 'admin',
        };
        StorageService.setCurrentUser(user);
        StorageService.logAction(user.username, 'Admin', 'User Logged In', 'Administrator accessed the main management dashboard');
        onLoginSuccess(user);
        return;
      }
    } else if (selectedRole === 'staff') {
      const teachers = StorageService.getTeachers();
      const match = teachers.find(
        t => t.teacherId.toLowerCase() === cleanUser || t.email.toLowerCase().includes(cleanUser) || cleanUser === 'staff1'
      );
      if (cleanPass === 'staff123' || cleanPass === '123456') {
        const teacher = match || teachers[0];
        const user: User = {
          id: teacher.teacherId,
          username: cleanUser,
          name: teacher.name,
          email: teacher.email,
          role: 'staff',
          relatedId: teacher.teacherId,
        };
        StorageService.setCurrentUser(user);
        StorageService.logAction(user.username, 'Staff', 'Staff Logged In', `Faculty member ${teacher.name} logged in`);
        onLoginSuccess(user);
        return;
      }
    } else if (selectedRole === 'office') {
      if ((cleanUser === 'office1' || cleanUser === 'accountant') && cleanPass === 'office123') {
        const user: User = {
          id: 'ASP-EMP-01',
          username: 'office1',
          name: 'Muhammad Imran (Accounts)',
          email: 'accounts@aspire.edu.pk',
          role: 'office',
          relatedId: 'ASP-EMP-01',
        };
        StorageService.setCurrentUser(user);
        StorageService.logAction(user.username, 'Office', 'Office Logged In', 'Finance & fee desk session initiated');
        onLoginSuccess(user);
        return;
      }
    } else if (selectedRole === 'student') {
      const students = StorageService.getStudents();
      const match = students.find(
        s => s.studentId.toLowerCase() === cleanUser || s.rollNo === cleanUser || cleanUser === 'asp-2026-001'
      );
      if (cleanPass === 'student123' || cleanPass === '123456') {
        const student = match || students[0];
        const user: User = {
          id: student.studentId,
          username: student.rollNo,
          name: student.name,
          email: `${student.studentId}@student.aspire.edu.pk`,
          role: 'student',
          relatedId: student.studentId,
        };
        StorageService.setCurrentUser(user);
        StorageService.logAction(user.username, 'Student', 'Student Logged In', `Student ${student.name} accessed student portal`);
        onLoginSuccess(user);
        return;
      }
    }

    setError('Invalid credentials for selected portal. Click any of the Quick Demo buttons below for instant 1-click test credentials.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header Ribbon */}
        <div className="bg-[#800000] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">ASPIRE COLLEGE</h2>
              <p className="text-xs text-white/80">Authorized Portal Access Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setError(''); }}
              className={`flex flex-col items-center gap-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-[#800000] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('staff'); setError(''); }}
              className={`flex flex-col items-center gap-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'staff'
                  ? 'bg-white text-[#800000] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Staff</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('office'); setError(''); }}
              className={`flex flex-col items-center gap-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'office'
                  ? 'bg-white text-[#800000] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Office</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setError(''); }}
              className={`flex flex-col items-center gap-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-[#800000] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="mb-5 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                Quick 1-Click Test Credentials:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all border ${
                  selectedRole === 'admin'
                    ? 'bg-[#800000] text-white border-[#800000]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Admin (admin / admin123)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('staff')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all border ${
                  selectedRole === 'staff'
                    ? 'bg-[#800000] text-white border-[#800000]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Staff (staff1 / staff123)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('office')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all border ${
                  selectedRole === 'office'
                    ? 'bg-[#800000] text-white border-[#800000]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Office (office1 / office123)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('student')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all border ${
                  selectedRole === 'student'
                    ? 'bg-[#800000] text-white border-[#800000]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Student (101 / student123)
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'student' ? 'Student ID or Roll No' : 'Username or User ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin'
                      : selectedRole === 'staff'
                      ? 'staff1 or teacher ID'
                      : selectedRole === 'office'
                      ? 'office1'
                      : 'asp-2026-001 or Roll 101'
                  }
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000] focus:border-[#800000] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#800000] focus:border-[#800000] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#800000] hover:bg-[#680000] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Sign in to {selectedRole.toUpperCase()} Portal
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aspire College · Sahiwal Campus</span>
            <span>Helpline: 040-1234567</span>
          </div>
        </div>
      </div>
    </div>
  );
};
