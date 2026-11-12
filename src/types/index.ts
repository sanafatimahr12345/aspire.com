export type UserRole = 'admin' | 'staff' | 'office' | 'student';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  relatedId?: string; // Teacher ID or Student ID or Employee ID
}

export interface PortalCredential {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  email: string;
  password: string;
  teacherOrStudentId: string;
  portalName: string;
  subject?: string;
  campus?: string;
}

export interface Session {
  sessionId: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Archived' | 'Upcoming';
}

export interface ClassItem {
  classId: string;
  programName: string;
  className: string;
  duration: string;
  session: string;
  status: 'Active' | 'Inactive';
}

export interface Section {
  sectionId: string;
  sectionName: string;
  classId: string;
  session: string;
  capacity: number;
  status: 'Active' | 'Inactive';
}

export interface Group {
  groupId: string;
  groupName: string;
  classId: string;
  subjects: string[];
  incharge: string;
  status: 'Active' | 'Inactive';
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  classId: string;
  group: string;
  teacher: string;
  status: 'Active' | 'Inactive';
}

export interface Student {
  studentId: string;
  rollNo: string;
  name: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  fatherPhone: string;
  address: string;
  admissionDate: string;
  session: string;
  program: string;
  classId: string;
  sectionId: string;
  group: string;
  photo?: string;
  admissionStatus: 'Active' | 'Suspended' | 'Passed Out' | 'Struck Off';
  feeStatus: 'Paid' | 'Partial' | 'Unpaid';
}

export interface Teacher {
  teacherId: string;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  qualification: string;
  specialization: string;
  assignedSubjects: string[];
  assignedClasses: string[];
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Resigned';
}

export interface Employee {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  contact: string;
  address: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface Incharge {
  inchargeId: string;
  name: string;
  teacherOrEmployeeId: string;
  program: string;
  classId: string;
  sectionId: string;
  group: string;
  contact: string;
  session: string;
  status: 'Active' | 'Inactive';
  fatherName?: string;
  qualification?: string;
  experience?: string;
  designation?: string;
  campus?: string;
  photo?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  sessionId: string;
  classId: string;
  sectionId: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface FeeRecord {
  feeId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  rollNo: string;
  program: string;
  classId: string;
  month: string;
  monthlyFee: number;
  otherCharges: number;
  discount: number;
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Bank Challan' | 'Online / JazzCash' | 'EasyPaisa';
  feeStatus: 'Paid' | 'Partial' | 'Unpaid';
  challanNo: string;
}

export interface Income {
  incomeId: string;
  category: 'Fee Collection' | 'Prospectus Sale' | 'Lab Dues' | 'Sports Fund' | 'Donation / Grant' | 'Other';
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  receivedBy: string;
}

export interface Expense {
  expenseId: string;
  category: 'Faculty Salaries' | 'Staff Salaries' | 'Electricity & Generator' | 'Lab Consumables' | 'Printing & Stationery' | 'Campus Maintenance' | 'Sports & Events' | 'Other';
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  approvedBy: string;
}

export interface Exam {
  examId: string;
  title: string;
  term: 'First Term' | 'Mid-Term' | 'Pre-Board / Send-up' | 'Annual Board Trial' | 'Class Test' | 'Monthly Test' | string;
  sessionId: string;
  classId: string;
  sectionId?: string;
  subject?: string;
  totalMarks?: number;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

export interface SubjectMarkEntry {
  subjectName: string;
  subjectCode: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
}

export interface ExamResult {
  resultId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  classId: string;
  sectionId?: string;
  program: string;
  subject?: string;
  subjects: SubjectMarkEntry[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Pass' | 'Fail';
  position?: string;
}

export interface Assignment {
  assignmentId: string;
  title: string;
  subject: string;
  classId: string;
  sectionId: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  description: string;
  maxScore: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  target: 'All' | 'Students' | 'Teachers' | 'Office';
  priority: 'Normal' | 'High' | 'Urgent';
  date: string;
  author: string;
}

export interface WebsiteInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Labs' | 'Library' | 'Sports' | 'Events';
  imageUrl: string;
  date: string;
  isPublic: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}
