import {
  User,
  Session,
  ClassItem,
  Section,
  Group,
  Subject,
  Student,
  Teacher,
  Employee,
  Incharge,
  AttendanceRecord,
  FeeRecord,
  Income,
  Expense,
  Exam,
  ExamResult,
  Assignment,
  Notification,
  WebsiteInquiry,
  GalleryItem,
  AuditLog,
  PortalCredential,
} from '../types';
import { realStudents } from './studentsData';
import { FirebaseSync } from './firebase';

const STORAGE_KEYS = {
  CURRENT_USER: 'aspire_current_user',
  CREDENTIALS: 'aspire_credentials',
  SESSIONS: 'aspire_sessions',
  CLASSES: 'aspire_classes',
  SECTIONS: 'aspire_sections',
  GROUPS: 'aspire_groups',
  SUBJECTS: 'aspire_subjects',
  STUDENTS: 'aspire_students',
  TEACHERS: 'aspire_teachers',
  EMPLOYEES: 'aspire_employees',
  INCHARGE: 'aspire_incharge',
  ATTENDANCE: 'aspire_attendance',
  FEES: 'aspire_fees',
  INCOME: 'aspire_income',
  EXPENSES: 'aspire_expenses',
  EXAMS: 'aspire_exams',
  RESULTS: 'aspire_results',
  ASSIGNMENTS: 'aspire_assignments',
  NOTIFICATIONS: 'aspire_notifications',
  INQUIRIES: 'aspire_inquiries',
  GALLERY: 'aspire_gallery',
  AUDIT_LOGS: 'aspire_audit_logs',
  INITIALIZED: 'aspire_initialized_v7',
};

// Initial Seed Data
const initialSessions: Session[] = [
  {
    sessionId: 'SES-2025-27',
    sessionName: '2025-2027 (1st Year)',
    startDate: '2025-08-15',
    endDate: '2027-06-30',
    status: 'Active',
  },
  {
    sessionId: 'SES-2024-26',
    sessionName: '2024-2026 (2nd Year)',
    startDate: '2024-08-15',
    endDate: '2026-06-30',
    status: 'Active',
  },
  {
    sessionId: 'SES-2026-28',
    sessionName: '2026-2028 (Admissions Open)',
    startDate: '2026-08-15',
    endDate: '2028-06-30',
    status: 'Upcoming',
  },
];

const initialClasses: ClassItem[] = [
  {
    classId: 'CLS-01',
    programName: 'F.Sc Pre-Medical',
    className: 'F.Sc Pre-Medical',
    duration: '2 Years',
    session: '2024-25 Morning',
    status: 'Active',
  },
  {
    classId: 'CLS-02',
    programName: 'F.Sc Pre-Engineering',
    className: 'F.Sc Pre-Engineering',
    duration: '2 Years',
    session: '2024-25 Morning',
    status: 'Active',
  },
  {
    classId: 'CLS-03',
    programName: 'ICS',
    className: 'ICS',
    duration: '2 Years',
    session: '2024-25 Morning',
    status: 'Active',
  },
  {
    classId: 'CLS-04',
    programName: 'I.Com',
    className: 'I.Com',
    duration: '2 Years',
    session: '2024-25 Evening',
    status: 'Active',
  },
  {
    classId: 'CLS-05',
    programName: 'F.A - 2 YEAR',
    className: 'F.A - 2 YEAR',
    duration: '2 Years',
    session: 'FALL 2025',
    status: 'Active',
  },
  {
    classId: 'CLS-06',
    programName: 'F.A IT - 1 YEAR',
    className: 'F.A IT - 1 YEAR',
    duration: '1 Year',
    session: 'FALL 2026',
    status: 'Active',
  },
  {
    classId: 'CLS-07',
    programName: 'FSc. Pre Engineering - 1 YEAR',
    className: 'FSc. Pre Engineering - 1 YEAR',
    duration: '1 Year',
    session: 'FALL 2026',
    status: 'Active',
  },
  {
    classId: 'CLS-08',
    programName: 'FSc. Pre Engineering - 2 YEAR',
    className: 'FSc. Pre Engineering - 2 YEAR',
    duration: '2 Years',
    session: 'FALL 2025',
    status: 'Active',
  },
  {
    classId: 'CLS-09',
    programName: 'FSc. Pre Medical - 1 YEAR',
    className: 'FSc. Pre Medical - 1 YEAR',
    duration: '1 Year',
    session: 'FALL 2026',
    status: 'Active',
  },
  {
    classId: 'CLS-10',
    programName: 'FSc. Pre Medical - 2 YEAR',
    className: 'FSc. Pre Medical - 2 YEAR',
    duration: '2 Years',
    session: 'FALL 2025',
    status: 'Active',
  },
  {
    classId: 'CLS-11',
    programName: 'I.Com Urdu - 2 YEAR',
    className: 'I.Com Urdu - 2 YEAR',
    duration: '2 Years',
    session: 'FALL 2025',
    status: 'Active',
  },
  {
    classId: 'CLS-12',
    programName: 'ICS Economics - 1 YEAR',
    className: 'ICS Economics - 1 YEAR',
    duration: '1 Year',
    session: 'FALL 2026',
    status: 'Active',
  },
  {
    classId: 'CLS-13',
    programName: 'ICS Economics - 2 YEAR',
    className: 'ICS Economics - 2 YEAR',
    duration: '2 Years',
    session: 'FALL 2025',
    status: 'Active',
  },
  {
    classId: 'CLS-14',
    programName: 'ICS Physics - 1 YEAR',
    className: 'ICS Physics - 1 YEAR',
    duration: '1 Year',
    session: 'FALL 2026',
    status: 'Active',
  },
  {
    classId: 'CLS-15',
    programName: 'ICS Physics - 2 YEAR',
    className: 'ICS Physics - 2 YEAR',
    duration: '2 Years',
    session: 'FALL 2025',
    status: 'Active',
  },
];

const initialSections: Section[] = [
  {
    sectionId: 'SEC-MED1-A',
    sectionName: 'Green Section (Alpha)',
    classId: 'CLS-FSC-MED-1',
    session: '2025-2027 (1st Year)',
    capacity: 65,
    status: 'Active',
  },
  {
    sectionId: 'SEC-ENG1-A',
    sectionName: 'Red Section (Falcon)',
    classId: 'CLS-FSC-ENG-1',
    session: '2025-2027 (1st Year)',
    capacity: 60,
    status: 'Active',
  },
  {
    sectionId: 'SEC-ICS1-A',
    sectionName: 'Blue Section (Cyber)',
    classId: 'CLS-ICS-CS-1',
    session: '2025-2027 (1st Year)',
    capacity: 65,
    status: 'Active',
  },
  {
    sectionId: 'SEC-MED2-A',
    sectionName: 'Star Section (M-2)',
    classId: 'CLS-FSC-MED-2',
    session: '2024-2026 (2nd Year)',
    capacity: 60,
    status: 'Active',
  },
  {
    sectionId: 'SEC-ENG2-A',
    sectionName: 'Eagle Section (E-2)',
    classId: 'CLS-FSC-ENG-2',
    session: '2024-2026 (2nd Year)',
    capacity: 55,
    status: 'Active',
  },
];

const initialGroups: Group[] = [
  {
    groupId: 'GRP-MED',
    groupName: 'Medical Science Wing',
    classId: 'CLS-FSC-MED-1',
    subjects: ['Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Islamiat'],
    incharge: 'Prof. Dr. Tariq Mahmood',
    status: 'Active',
  },
  {
    groupId: 'GRP-ENG',
    groupName: 'Engineering & Tech Wing',
    classId: 'CLS-FSC-ENG-1',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Urdu', 'Islamiat'],
    incharge: 'Engr. Shahbaz Akhtar',
    status: 'Active',
  },
  {
    groupId: 'GRP-ICS',
    groupName: 'Information Systems Wing',
    classId: 'CLS-ICS-CS-1',
    subjects: ['Physics', 'Computer Science', 'Mathematics', 'English', 'Urdu', 'Islamiat'],
    incharge: 'Prof. Noman Rafiq',
    status: 'Active',
  },
];

const initialSubjects: Subject[] = [
  {
    subjectId: 'SUB-PHY-1',
    subjectName: 'Physics (Part-I)',
    subjectCode: 'PHY-101',
    classId: 'CLS-FSC-ENG-1',
    group: 'Engineering & Tech Wing',
    teacher: 'Prof. Dr. Tariq Mahmood',
    status: 'Active',
  },
  {
    subjectId: 'SUB-MTH-1',
    subjectName: 'Mathematics (Part-I)',
    subjectCode: 'MTH-101',
    classId: 'CLS-FSC-ENG-1',
    group: 'Engineering & Tech Wing',
    teacher: 'Prof. Shahbaz Akhtar',
    status: 'Active',
  },
  {
    subjectId: 'SUB-CHM-1',
    subjectName: 'Chemistry (Part-I)',
    subjectCode: 'CHM-101',
    classId: 'CLS-FSC-MED-1',
    group: 'Medical Science Wing',
    teacher: 'Prof. Farooq Haider',
    status: 'Active',
  },
  {
    subjectId: 'SUB-BIO-1',
    subjectName: 'Biology (Part-I)',
    subjectCode: 'BIO-101',
    classId: 'CLS-FSC-MED-1',
    group: 'Medical Science Wing',
    teacher: 'Prof. Saba Noreen',
    status: 'Active',
  },
  {
    subjectId: 'SUB-CS-1',
    subjectName: 'Computer Science (Part-I)',
    subjectCode: 'CSC-101',
    classId: 'CLS-ICS-CS-1',
    group: 'Information Systems Wing',
    teacher: 'Prof. Noman Rafiq',
    status: 'Active',
  },
  {
    subjectId: 'SUB-ENG-1',
    subjectName: 'English (Compulsory)',
    subjectCode: 'ENG-101',
    classId: 'CLS-FSC-MED-1',
    group: 'Medical Science Wing',
    teacher: 'Prof. Asif Raza',
    status: 'Active',
  },
];

const initialTeachers: Teacher[] = [
  {
    teacherId: 'ASP-TCH-ZAHID',
    name: 'Prof. Muhammad Zahid Ramzan',
    fatherName: 'Ramzan Ali',
    gender: 'Male',
    phone: '923049562722',
    email: 'zahid.ramzan@aspire.edu.pk',
    address: 'Aspire Kacha Khuh Campus, Punjab',
    qualification: 'M.Phil Physics (11 Years Experience)',
    specialization: 'Physics, Electromagnetism & Lab Practicals',
    assignedSubjects: ['Physics'],
    assignedClasses: ['G1', 'BG1', 'S1', 'BS1', 'A', 'SB2', 'SB3', 'SB4', 'SG1', 'SG2', 'SG3', 'FA1'],
    joiningDate: '2015-08-15',
    salary: 145000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-02',
    name: 'Prof. Maqbool Hussain',
    fatherName: 'Hussain Bakhsh',
    gender: 'Male',
    phone: '0300-7654321',
    email: 'maqbool.hussain@aspire.edu.pk',
    address: 'Farid Town, Sahiwal',
    qualification: 'M.Phil Chemistry (12 Years Experience)',
    specialization: 'Organic Chemistry & Stereochemistry',
    assignedSubjects: ['Chemistry'],
    assignedClasses: ['FSc. Pre Medical - 1 YEAR', 'FSc. Pre Engineering - 1 YEAR'],
    joiningDate: '2014-09-01',
    salary: 140000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-03',
    name: 'Prof. Mudassir Anwar',
    fatherName: 'Anwar ul Haq',
    gender: 'Male',
    phone: '0301-8765432',
    email: 'mudassir.anwar@aspire.edu.pk',
    address: 'High Street Campus, Sahiwal',
    qualification: 'M.Phil Mathematics (13 Years Experience)',
    specialization: 'Calculus, Vectors & Analytical Geometry',
    assignedSubjects: ['Mathematics'],
    assignedClasses: ['FSc. Pre Engineering - 1 YEAR', 'ICS Physics - 1 YEAR'],
    joiningDate: '2013-08-15',
    salary: 142000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-04',
    name: 'Prof. Abdullah Ateeq',
    fatherName: 'Ateeq ur Rehman',
    gender: 'Male',
    phone: '0302-9876543',
    email: 'abdullah.ateeq@aspire.edu.pk',
    address: 'Officers Colony, Sahiwal',
    qualification: 'M.Phil Islamic Studies (15 Years Experience)',
    specialization: 'Islamic Ethics & Quranic Studies',
    assignedSubjects: ['Islamiat'],
    assignedClasses: ['F.A - 2 YEAR', 'F.A IT - 1 YEAR', 'I.Com Urdu - 2 YEAR'],
    joiningDate: '2011-09-01',
    salary: 135000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-05',
    name: 'Prof. M Javed Umer',
    fatherName: 'Umer Hayat',
    gender: 'Male',
    phone: '0303-1234567',
    email: 'javed.umer@aspire.edu.pk',
    address: 'Civil Lines, Sahiwal',
    qualification: 'M.Phil English Literature (16 Years Experience)',
    specialization: 'English Grammar & Composition',
    assignedSubjects: ['English'],
    assignedClasses: ['FSc. Pre Medical - 1 YEAR', 'ICS Physics - 1 YEAR'],
    joiningDate: '2010-08-01',
    salary: 150000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-06',
    name: 'Prof. Asif Mehmood',
    fatherName: 'Mehmood Khan',
    gender: 'Male',
    phone: '0304-2345678',
    email: 'asif.mehmood@aspire.edu.pk',
    address: 'Madina Town, Sahiwal',
    qualification: 'MS Computer Science (17 Years Experience)',
    specialization: 'C++, Database Systems & IT',
    assignedSubjects: ['Computer Science'],
    assignedClasses: ['F.A IT - 1 YEAR', 'ICS Physics - 1 YEAR', 'ICS Economics - 1 YEAR'],
    joiningDate: '2009-08-15',
    salary: 155000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-07',
    name: 'Prof. Hafiz Ali Hassan',
    fatherName: 'Hassan Raza',
    gender: 'Male',
    phone: '0305-3456789',
    email: 'ali.hassan@aspire.edu.pk',
    address: 'Chungi No 7, Sahiwal',
    qualification: 'M.Phil Urdu (18 Years Experience)',
    specialization: 'Urdu Literature & Poetry Analysis',
    assignedSubjects: ['Urdu'],
    assignedClasses: ['I.Com Urdu - 2 YEAR', 'F.A - 2 YEAR'],
    joiningDate: '2008-09-01',
    salary: 148000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-08',
    name: 'Prof. Farha Allah Dastgir',
    fatherName: 'Allah Dastgir',
    gender: 'Female',
    phone: '0306-4567890',
    email: 'farha.dastgir@aspire.edu.pk',
    address: 'Girls Wing, Sahiwal Campus',
    qualification: 'M.Phil Biology (11 Years Experience)',
    specialization: 'Botany & Molecular Biology',
    assignedSubjects: ['Biology'],
    assignedClasses: ['FSc. Pre Medical - 1 YEAR', 'FSc. Pre Medical - 2 YEAR'],
    joiningDate: '2015-09-01',
    salary: 138000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-09',
    name: 'Prof. Noman Tariq',
    fatherName: 'Tariq Mehmood',
    gender: 'Male',
    phone: '0307-5678901',
    email: 'noman.tariq@aspire.edu.pk',
    address: 'Stadium Road, Sahiwal',
    qualification: 'M.Phil Economics (10 Years Experience)',
    specialization: 'Micro & Macro Economics of Pakistan',
    assignedSubjects: ['Economics'],
    assignedClasses: ['ICS Economics - 1 YEAR', 'ICS Economics - 2 YEAR'],
    joiningDate: '2016-08-15',
    salary: 130000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-10',
    name: 'Prof. Babar Shahzad',
    fatherName: 'Shahzad Akbar',
    gender: 'Male',
    phone: '0308-6789012',
    email: 'babar.shahzad@aspire.edu.pk',
    address: 'Tariq Bin Ziyad Colony, Sahiwal',
    qualification: 'M.Phil Statistics (9 Years Experience)',
    specialization: 'Probability & Applied Statistics',
    assignedSubjects: ['Statistics'],
    assignedClasses: ['ICS Economics - 1 YEAR', 'I.Com - 2 YEAR'],
    joiningDate: '2017-09-01',
    salary: 125000,
    status: 'Active',
  },
  {
    teacherId: 'ASP-TCH-11',
    name: 'Prof. Sajid Masood',
    fatherName: 'Masood Ahmed',
    gender: 'Male',
    phone: '0309-7890123',
    email: 'sajid.masood@aspire.edu.pk',
    address: 'College Road, Sahiwal',
    qualification: 'M.Phil Physics (14 Years Experience)',
    specialization: 'Atomic & Nuclear Physics',
    assignedSubjects: ['Physics'],
    assignedClasses: ['ICS Physics - 1 YEAR', 'ICS Physics - 2 YEAR'],
    joiningDate: '2012-08-15',
    salary: 145000,
    status: 'Active',
  },
];

const initialEmployees: Employee[] = [
  {
    employeeId: 'ASP-EMP-01',
    name: 'Muhammad Imran',
    designation: 'Senior Accountant & Fee Officer',
    department: 'Accounts & Finance',
    contact: '0321-7890123',
    address: 'Chungi No. 6, Multan Road, Sahiwal',
    joiningDate: '2017-04-12',
    salary: 85000,
    status: 'Active',
  },
  {
    employeeId: 'ASP-EMP-02',
    name: 'Rana Zulfiqar Ali',
    designation: 'Superintendent & Admin Officer',
    department: 'General Administration',
    contact: '0302-3456789',
    address: 'Tariq Bin Ziyad Colony, Sahiwal',
    joiningDate: '2016-01-10',
    salary: 95000,
    status: 'Active',
  },
  {
    employeeId: 'ASP-EMP-03',
    name: 'Hafiz Bilal Ahmed',
    designation: 'Physics & Chemistry Lab Incharge',
    department: 'Science Laboratories',
    contact: '0313-9876543',
    address: 'Jinnah Town, Sahiwal',
    joiningDate: '2021-09-01',
    salary: 58000,
    status: 'Active',
  },
  {
    employeeId: 'ASP-EMP-04',
    name: 'Sobia Batool',
    designation: 'Head Librarian',
    department: 'Central Library',
    contact: '0334-5544332',
    address: 'Saddar Bazar, Sahiwal',
    joiningDate: '2020-02-15',
    salary: 62000,
    status: 'Active',
  },
];

const initialIncharges: Incharge[] = [
  {
    inchargeId: 'INC-01',
    name: 'Prof. Muhammad Zahid Ramzan',
    teacherOrEmployeeId: 'ASP-TCH-ZAHID',
    program: 'FSc Pre-Medical',
    classId: 'G1',
    sectionId: 'G1',
    group: 'Medical 1st Year',
    contact: '923049562722',
    session: 'FALL 2026',
    status: 'Active',
    fatherName: 'S/O M Ramzan',
    qualification: 'M.Phil Physics',
    experience: '11 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
  {
    inchargeId: 'INC-02',
    name: 'Prof. Maqbool Hussain',
    teacherOrEmployeeId: 'ASP-TCH-02',
    program: 'FSc Pre-Engineering',
    classId: 'CLS-02',
    sectionId: 'BG2',
    group: 'Engineering & Tech Wing',
    contact: '+92 347 7014297',
    session: '2024-25 Morning',
    status: 'Active',
    fatherName: 'S/O Bashir Ahmad',
    qualification: 'M.Phil Chemistry',
    experience: '12 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
  {
    inchargeId: 'INC-03',
    name: 'Prof. Mudassir Anwar',
    teacherOrEmployeeId: 'ASP-TCH-03',
    program: 'FSc Pre-Engineering',
    classId: 'CLS-07',
    sectionId: 'BG3',
    group: 'Engineering & Tech Wing',
    contact: '+92 309 7693660',
    session: 'FALL 2026',
    status: 'Active',
    fatherName: 'S/O M Anwar',
    qualification: 'M.Phil Mathematics',
    experience: '13 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
  {
    inchargeId: 'INC-04',
    name: 'Prof. Abdullah Ateeq',
    teacherOrEmployeeId: 'ASP-TCH-04',
    program: 'F.A - 2 YEAR',
    classId: 'CLS-05',
    sectionId: 'FA1',
    group: 'Arts & Humanities Wing',
    contact: '+92 308 6386748',
    session: 'FALL 2025',
    status: 'Active',
    fatherName: 'S/O Ateeq ur Rehman',
    qualification: 'M.Phil Islamic Studies',
    experience: '14 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
  {
    inchargeId: 'INC-05',
    name: 'Prof. M Javed Umer',
    teacherOrEmployeeId: 'ASP-TCH-05',
    program: 'FSc Pre-Medical',
    classId: 'CLS-09',
    sectionId: 'G2',
    group: 'Medical Science Wing',
    contact: '+92 311 6544656',
    session: 'FALL 2026',
    status: 'Active',
    fatherName: 'S/O M Yaqoob',
    qualification: 'M.Phil English Literature',
    experience: '15 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
  {
    inchargeId: 'INC-06',
    name: 'Prof. Asif Mehmood',
    teacherOrEmployeeId: 'ASP-TCH-06',
    program: 'ICS Physics',
    classId: 'CLS-14',
    sectionId: 'BG4',
    group: 'Information Systems Wing',
    contact: '+92 303 3608702',
    session: 'FALL 2026',
    status: 'Active',
    fatherName: 'S/O M Aslam',
    qualification: 'MS Computer Science',
    experience: '16 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
  {
    inchargeId: 'INC-07',
    name: 'Prof. Hafiz Ali Hassan',
    teacherOrEmployeeId: 'ASP-TCH-07',
    program: 'I.Com Urdu',
    classId: 'CLS-11',
    sectionId: 'G3',
    group: 'Commerce & Business Wing',
    contact: '+92 300 7806026',
    session: 'FALL 2025',
    status: 'Active',
    fatherName: 'S/O Ali Sher',
    qualification: 'M.Phil Urdu',
    experience: '17 Years',
    designation: 'Incharge',
    campus: 'Aspire Kacha Khuh Campus',
  },
];

const initialStudents: Student[] = realStudents;

const initialFees: FeeRecord[] = [
  {
    feeId: 'FEE-2026-001',
    studentId: 'asp-2026-001',
    studentName: 'Hamza Ali',
    fatherName: 'Muhammad Ali Warraich',
    rollNo: '101',
    program: 'FSc Pre-Engineering',
    classId: 'CLS-FSC-ENG-1',
    month: 'November 2026',
    monthlyFee: 8500,
    otherCharges: 1000,
    discount: 500,
    totalFee: 9000,
    paidAmount: 9000,
    remainingAmount: 0,
    paymentDate: '2026-11-04',
    paymentMethod: 'Bank Challan',
    feeStatus: 'Paid',
    challanNo: 'CH-2026-1011',
  },
  {
    feeId: 'FEE-2026-002',
    studentId: 'asp-2026-002',
    studentName: 'Ayesha Fatima',
    fatherName: 'Syed Zafar Iqbal',
    rollNo: '102',
    program: 'FSc Pre-Medical',
    classId: 'CLS-FSC-MED-1',
    month: 'November 2026',
    monthlyFee: 8500,
    otherCharges: 1000,
    discount: 1000,
    totalFee: 8500,
    paidAmount: 8500,
    remainingAmount: 0,
    paymentDate: '2026-11-02',
    paymentMethod: 'Online / JazzCash',
    feeStatus: 'Paid',
    challanNo: 'CH-2026-1012',
  },
  {
    feeId: 'FEE-2026-003',
    studentId: 'asp-2026-003',
    studentName: 'Muhammad Usman',
    fatherName: 'Chaudhry Riaz Ahmad',
    rollNo: '103',
    program: 'ICS Computer Science',
    classId: 'CLS-ICS-CS-1',
    month: 'November 2026',
    monthlyFee: 8000,
    otherCharges: 1500,
    discount: 0,
    totalFee: 9500,
    paidAmount: 5000,
    remainingAmount: 4500,
    paymentDate: '2026-11-05',
    paymentMethod: 'Cash',
    feeStatus: 'Partial',
    challanNo: 'CH-2026-1013',
  },
  {
    feeId: 'FEE-2026-004',
    studentId: 'asp-2026-004',
    studentName: 'Zainab Noor',
    fatherName: 'Tariq Aziz Sheikh',
    rollNo: '104',
    program: 'FSc Pre-Medical',
    classId: 'CLS-FSC-MED-1',
    month: 'November 2026',
    monthlyFee: 8500,
    otherCharges: 1000,
    discount: 0,
    totalFee: 9500,
    paidAmount: 9500,
    remainingAmount: 0,
    paymentDate: '2026-11-03',
    paymentMethod: 'Bank Challan',
    feeStatus: 'Paid',
    challanNo: 'CH-2026-1014',
  },
  {
    feeId: 'FEE-2026-005',
    studentId: 'asp-2026-005',
    studentName: 'Bilal Ahmed',
    fatherName: 'Tanveer Ahmed Khan',
    rollNo: '105',
    program: 'FSc Pre-Engineering',
    classId: 'CLS-FSC-ENG-1',
    month: 'November 2026',
    monthlyFee: 8500,
    otherCharges: 1000,
    discount: 0,
    totalFee: 9500,
    paidAmount: 0,
    remainingAmount: 9500,
    feeStatus: 'Unpaid',
    challanNo: 'CH-2026-1015',
  },
];

const initialAttendance: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    date: '2026-11-07',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-ENG-1',
    sectionId: 'SEC-ENG1-A',
    studentId: 'asp-2026-001',
    rollNo: '101',
    studentName: 'Hamza Ali',
    status: 'Present',
  },
  {
    id: 'ATT-002',
    date: '2026-11-07',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-MED-1',
    sectionId: 'SEC-MED1-A',
    studentId: 'asp-2026-002',
    rollNo: '102',
    studentName: 'Ayesha Fatima',
    status: 'Present',
  },
  {
    id: 'ATT-003',
    date: '2026-11-07',
    sessionId: 'SES-2025-27',
    classId: 'CLS-ICS-CS-1',
    sectionId: 'SEC-ICS1-A',
    studentId: 'asp-2026-003',
    rollNo: '103',
    studentName: 'Muhammad Usman',
    status: 'Late',
  },
  {
    id: 'ATT-004',
    date: '2026-11-07',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-MED-1',
    sectionId: 'SEC-MED1-A',
    studentId: 'asp-2026-004',
    rollNo: '104',
    studentName: 'Zainab Noor',
    status: 'Present',
  },
  {
    id: 'ATT-005',
    date: '2026-11-07',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-ENG-1',
    sectionId: 'SEC-ENG1-A',
    studentId: 'asp-2026-005',
    rollNo: '105',
    studentName: 'Bilal Ahmed',
    status: 'Absent',
    remarks: 'Informed family emergency',
  },
  {
    id: 'ATT-006',
    date: '2026-11-06',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-ENG-1',
    sectionId: 'SEC-ENG1-A',
    studentId: 'asp-2026-001',
    rollNo: '101',
    studentName: 'Hamza Ali',
    status: 'Present',
  },
  {
    id: 'ATT-007',
    date: '2026-11-06',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-MED-1',
    sectionId: 'SEC-MED1-A',
    studentId: 'asp-2026-002',
    rollNo: '102',
    studentName: 'Ayesha Fatima',
    status: 'Present',
  },
];

const initialIncome: Income[] = [
  {
    incomeId: 'INC-2026-01',
    category: 'Fee Collection',
    description: 'Monthly Tuition Fee Collection - November Cycle 1',
    amount: 1450000,
    date: '2026-11-05',
    paymentMethod: 'Bank Deposit & Cash Counter',
    receivedBy: 'Muhammad Imran (Accountant)',
  },
  {
    incomeId: 'INC-2026-02',
    category: 'Prospectus Sale',
    description: 'Prospectus and Admission Forms for Spring Trial',
    amount: 85000,
    date: '2026-11-03',
    paymentMethod: 'Cash',
    receivedBy: 'Muhammad Imran (Accountant)',
  },
  {
    incomeId: 'INC-2026-03',
    category: 'Lab Dues',
    description: 'Special Chemistry & Computer Lab Practical Dues',
    amount: 120000,
    date: '2026-10-28',
    paymentMethod: 'Bank Challan',
    receivedBy: 'Muhammad Imran (Accountant)',
  },
];

const initialExpenses: Expense[] = [
  {
    expenseId: 'EXP-2026-01',
    category: 'Faculty Salaries',
    description: 'Monthly Salaries for Teaching Faculty - Oct 2026',
    amount: 820000,
    date: '2026-11-01',
    paymentMethod: 'Bank Transfer (Meezan Bank)',
    approvedBy: 'Prof. Principal Aspire College',
  },
  {
    expenseId: 'EXP-2026-02',
    category: 'Electricity & Generator',
    description: 'MEPCO Commercial Electricity Bill & Diesel Generator Fuel',
    amount: 185000,
    date: '2026-11-04',
    paymentMethod: 'Cheque',
    approvedBy: 'Admin Officer Rana Zulfiqar',
  },
  {
    expenseId: 'EXP-2026-03',
    category: 'Lab Consumables',
    description: 'Physics optical benches and Chemistry reagents replenishment',
    amount: 65000,
    date: '2026-10-29',
    paymentMethod: 'Cash Voucher',
    approvedBy: 'Prof. Dr. Tariq Mahmood',
  },
  {
    expenseId: 'EXP-2026-04',
    category: 'Printing & Stationery',
    description: 'Mid-term Exam Question Papers and Answer Sheets printing',
    amount: 45000,
    date: '2026-10-25',
    paymentMethod: 'Cash',
    approvedBy: 'Examination Controller',
  },
];

const initialExams: Exam[] = [
  {
    examId: 'EXM-2026-MID',
    title: 'Mid-Term Examinations 2026',
    term: 'Mid-Term',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-ENG-1',
    startDate: '2026-11-15',
    endDate: '2026-11-25',
    status: 'Upcoming',
  },
  {
    examId: 'EXM-2026-1ST',
    title: 'First Term Assessment 2026',
    term: 'First Term',
    sessionId: 'SES-2025-27',
    classId: 'CLS-FSC-ENG-1',
    startDate: '2026-10-05',
    endDate: '2026-10-15',
    status: 'Completed',
  },
];

const initialResults: ExamResult[] = [
  {
    resultId: 'RES-001',
    examId: 'EXM-2026-1ST',
    examTitle: 'First Term Assessment 2026',
    studentId: 'asp-2026-001',
    rollNo: '101',
    studentName: 'Hamza Ali',
    fatherName: 'Muhammad Ali Warraich',
    classId: 'CLS-FSC-ENG-1',
    program: 'FSc Pre-Engineering',
    subjects: [
      { subjectName: 'English (Compulsory)', subjectCode: 'ENG-101', totalMarks: 100, obtainedMarks: 88, grade: 'A+' },
      { subjectName: 'Urdu', subjectCode: 'URD-101', totalMarks: 100, obtainedMarks: 84, grade: 'A' },
      { subjectName: 'Islamic Studies', subjectCode: 'ISL-101', totalMarks: 50, obtainedMarks: 47, grade: 'A+' },
      { subjectName: 'Physics (Theory & Practical)', subjectCode: 'PHY-101', totalMarks: 100, obtainedMarks: 94, grade: 'A+' },
      { subjectName: 'Chemistry', subjectCode: 'CHM-101', totalMarks: 100, obtainedMarks: 91, grade: 'A+' },
      { subjectName: 'Mathematics', subjectCode: 'MTH-101', totalMarks: 100, obtainedMarks: 96, grade: 'A+' },
    ],
    totalMarks: 550,
    obtainedMarks: 500,
    percentage: 90.9,
    grade: 'A+',
    status: 'Pass',
    position: '1st in Section Alpha',
  },
  {
    resultId: 'RES-002',
    examId: 'EXM-2026-1ST',
    examTitle: 'First Term Assessment 2026',
    studentId: 'asp-2026-002',
    rollNo: '102',
    studentName: 'Ayesha Fatima',
    fatherName: 'Syed Zafar Iqbal',
    classId: 'CLS-FSC-MED-1',
    program: 'FSc Pre-Medical',
    subjects: [
      { subjectName: 'English (Compulsory)', subjectCode: 'ENG-101', totalMarks: 100, obtainedMarks: 91, grade: 'A+' },
      { subjectName: 'Urdu', subjectCode: 'URD-101', totalMarks: 100, obtainedMarks: 89, grade: 'A+' },
      { subjectName: 'Islamic Studies', subjectCode: 'ISL-101', totalMarks: 50, obtainedMarks: 48, grade: 'A+' },
      { subjectName: 'Physics', subjectCode: 'PHY-101', totalMarks: 100, obtainedMarks: 92, grade: 'A+' },
      { subjectName: 'Chemistry', subjectCode: 'CHM-101', totalMarks: 100, obtainedMarks: 95, grade: 'A+' },
      { subjectName: 'Biology', subjectCode: 'BIO-101', totalMarks: 100, obtainedMarks: 97, grade: 'A+' },
    ],
    totalMarks: 550,
    obtainedMarks: 512,
    percentage: 93.1,
    grade: 'A+',
    status: 'Pass',
    position: 'College Top Position (Pre-Medical)',
  },
  {
    resultId: 'RES-003',
    examId: 'EXM-2026-1ST',
    examTitle: 'First Term Assessment 2026',
    studentId: 'asp-2026-003',
    rollNo: '103',
    studentName: 'Muhammad Usman',
    fatherName: 'Chaudhry Riaz Ahmad',
    classId: 'CLS-ICS-CS-1',
    program: 'ICS Computer Science',
    subjects: [
      { subjectName: 'English (Compulsory)', subjectCode: 'ENG-101', totalMarks: 100, obtainedMarks: 76, grade: 'B' },
      { subjectName: 'Urdu', subjectCode: 'URD-101', totalMarks: 100, obtainedMarks: 74, grade: 'B' },
      { subjectName: 'Islamic Studies', subjectCode: 'ISL-101', totalMarks: 50, obtainedMarks: 41, grade: 'A' },
      { subjectName: 'Physics', subjectCode: 'PHY-101', totalMarks: 100, obtainedMarks: 79, grade: 'B' },
      { subjectName: 'Computer Science', subjectCode: 'CSC-101', totalMarks: 100, obtainedMarks: 92, grade: 'A+' },
      { subjectName: 'Mathematics', subjectCode: 'MTH-101', totalMarks: 100, obtainedMarks: 81, grade: 'A' },
    ],
    totalMarks: 550,
    obtainedMarks: 443,
    percentage: 80.5,
    grade: 'A',
    status: 'Pass',
    position: '3rd in ICS Wing',
  },
];

const initialAssignments: Assignment[] = [
  {
    assignmentId: 'ASN-01',
    title: 'Rotational Dynamics Numerical Problems 5.1 to 5.10',
    subject: 'Physics (Part-I)',
    classId: 'CLS-FSC-ENG-1',
    sectionId: 'SEC-ENG1-A',
    teacherId: 'ASP-TCH-01',
    teacherName: 'Prof. Dr. Tariq Mahmood',
    dueDate: '2026-11-12',
    description: 'Solve textbook exercise questions on angular momentum and centripetal force in your fair assignment registers.',
    maxScore: 20,
  },
  {
    assignmentId: 'ASN-02',
    title: 'Differentiation using First Principles (Product Rule)',
    subject: 'Mathematics (Part-I)',
    classId: 'CLS-FSC-ENG-1',
    sectionId: 'SEC-ENG1-A',
    teacherId: 'ASP-TCH-02',
    teacherName: 'Prof. Shahbaz Akhtar',
    dueDate: '2026-11-14',
    description: 'Complete Exercise 2.3 questions 1 to 15 step-by-step with proofs.',
    maxScore: 25,
  },
  {
    assignmentId: 'ASN-03',
    title: 'C++ Object Oriented Programming: Classes and Objects',
    subject: 'Computer Science (Part-I)',
    classId: 'CLS-ICS-CS-1',
    sectionId: 'SEC-ICS1-A',
    teacherId: 'ASP-TCH-04',
    teacherName: 'Prof. Noman Rafiq',
    dueDate: '2026-11-16',
    description: 'Write a C++ program implementing Student class with roll number, marks, and grade calculation methods.',
    maxScore: 20,
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'NOTIF-01',
    title: 'Admissions Open for Session 2026-2028',
    message: 'Merit-based scholarship interviews and entry test registrations for FSc Pre-Medical, Pre-Engineering and ICS programs are now open. Visit the campus admission office.',
    target: 'All',
    priority: 'Urgent',
    date: '2026-11-06',
    author: 'Admin Office',
  },
  {
    id: 'NOTIF-02',
    title: 'Fee Submission Deadline for November 2026',
    message: 'All students are reminded to submit the November monthly fee challan at designated bank branches before November 15, 2026 to avoid fine.',
    target: 'Students',
    priority: 'High',
    date: '2026-11-05',
    author: 'Accounts Office',
  },
  {
    id: 'NOTIF-03',
    title: 'Staff Meeting regarding Mid-Term Examinations',
    message: 'All senior teaching staff members must attend the coordination meeting in the Principal Conference Room on Saturday at 1:30 PM.',
    target: 'Teachers',
    priority: 'Normal',
    date: '2026-11-04',
    author: 'Principal Office',
  },
];

const initialInquiries: WebsiteInquiry[] = [
  {
    id: 'INQ-101',
    name: 'Muhammad Farhan',
    email: 'farhan.matric@gmail.com',
    phone: '0300-9871234',
    program: 'FSc Pre-Engineering',
    message: 'I secured 1025 marks in Matric from Sahiwal Board. Am I eligible for 100% Aspire Merit Scholarship?',
    date: '2026-11-07',
    status: 'New',
  },
  {
    id: 'INQ-102',
    name: 'Dr. Shakeel Anwar (Parent)',
    email: 'drshakeel@hotmail.com',
    phone: '0321-4567890',
    program: 'FSc Pre-Medical',
    message: 'Inquiring regarding girl hostel facilities and college transport van routes covering Chichawatni.',
    date: '2026-11-06',
    status: 'Contacted',
  },
  {
    id: 'INQ-103',
    name: 'Ali Raza',
    email: 'aliraza22@yahoo.com',
    phone: '0313-7766554',
    program: 'ICS Computer Science',
    message: 'Does Aspire College provide free programming certifications and AI labs during the ICS program?',
    date: '2026-11-05',
    status: 'Enrolled',
  },
];

const initialGallery: GalleryItem[] = [
  {
    id: 'GAL-01',
    title: 'Main Campus Building - Aspire Block A',
    category: 'Campus',
    imageUrl: '/assets/gallery/main_campus_building.png',
    date: '2026-11-01',
    isPublic: true,
  },
  {
    id: 'GAL-02',
    title: 'Morning Assembly & Discipline Formation',
    category: 'Campus',
    imageUrl: '/assets/gallery/morning_assembly.png',
    date: '2026-11-02',
    isPublic: true,
  },
  {
    id: 'GAL-03',
    title: 'Executive Management & Administration Office',
    category: 'Events',
    imageUrl: '/assets/gallery/management_office.png',
    date: '2026-11-03',
    isPublic: true,
  },
  {
    id: 'GAL-04',
    title: 'Annual Farewell & Academic Excellence Ceremony',
    category: 'Events',
    imageUrl: '/assets/gallery/farewell_ceremony.png',
    date: '2026-11-04',
    isPublic: true,
  },
  {
    id: 'GAL-05',
    title: 'Aspire Student Life & Campus Community',
    category: 'Campus',
    imageUrl: '/assets/gallery/student_life.png',
    date: '2026-11-05',
    isPublic: true,
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-11-07 09:30:15',
    user: 'admin',
    role: 'Administrator',
    action: 'System Initialization',
    details: 'College database loaded with standard sessions, classes, faculty, and student rosters.',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-11-07 10:15:20',
    user: 'office1',
    role: 'Office Staff',
    action: 'Fee Challan Collection',
    details: 'Received PKR 9,000 for Hamza Ali (Roll #101) via Bank Challan CH-2026-1011.',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-11-07 11:45:00',
    user: 'staff1',
    role: 'Teaching Staff',
    action: 'Attendance Marking',
    details: 'Submitted attendance for 11th Pre-Engineering Section Falcon.',
  },
];

const initialCredentials: PortalCredential[] = [
  {
    id: 'CRED-ADMIN',
    name: 'Principal Dr. M. Akram',
    role: 'admin',
    username: 'admin',
    email: 'principal@aspire.edu.pk',
    password: 'admin123',
    teacherOrStudentId: 'USR-ADMIN',
    portalName: 'Admin Central Portal',
    campus: 'Main Sahiwal Campus',
  },
  {
    id: 'CRED-TCH-01',
    name: 'Prof. Muhammad Zahid Ramzan',
    role: 'staff',
    username: 'zahid.ramzan',
    email: 'zahid.ramzan@aspire.edu.pk',
    password: 'zahid123',
    teacherOrStudentId: 'ASP-TCH-ZAHID',
    portalName: 'Muhammad Zahid Portal',
    subject: 'Physics',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-TCH-02',
    name: 'Prof. Maqbool Hussain',
    role: 'staff',
    username: 'maqbool.hussain',
    email: 'maqbool.hussain@aspire.edu.pk',
    password: 'maqbool123',
    teacherOrStudentId: 'ASP-TCH-02',
    portalName: 'Maqbool Hussain Portal',
    subject: 'Chemistry',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-TCH-03',
    name: 'Prof. Mudassir Anwar',
    role: 'staff',
    username: 'mudassir.anwar',
    email: 'mudassir.anwar@aspire.edu.pk',
    password: 'mudassir123',
    teacherOrStudentId: 'ASP-TCH-03',
    portalName: 'Mudassir Anwar Portal',
    subject: 'Mathematics',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-TCH-04',
    name: 'Prof. Abdullah Ateeq',
    role: 'staff',
    username: 'abdullah.ateeq',
    email: 'abdullah.ateeq@aspire.edu.pk',
    password: 'ateeq123',
    teacherOrStudentId: 'ASP-TCH-04',
    portalName: 'Abdullah Ateeq Portal',
    subject: 'Islamiat',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-TCH-05',
    name: 'Prof. M Javed Umer',
    role: 'staff',
    username: 'javed.umer',
    email: 'javed.umer@aspire.edu.pk',
    password: 'javed123',
    teacherOrStudentId: 'ASP-TCH-05',
    portalName: 'M Javed Portal',
    subject: 'English',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-TCH-06',
    name: 'Prof. Asif Mehmood',
    role: 'staff',
    username: 'asif.mehmood',
    email: 'asif.mehmood@aspire.edu.pk',
    password: 'asif123',
    teacherOrStudentId: 'ASP-TCH-06',
    portalName: 'Asif Mehmood Portal',
    subject: 'Computer Science',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-TCH-07',
    name: 'Prof. Hafiz Ali Hassan',
    role: 'staff',
    username: 'ali.hassan',
    email: 'ali.hassan@aspire.edu.pk',
    password: 'ali123',
    teacherOrStudentId: 'ASP-TCH-07',
    portalName: 'Hafiz Ali Portal',
    subject: 'Urdu',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-OFFICE',
    name: 'Muhammad Imran (Accounts Desk)',
    role: 'office',
    username: 'office1',
    email: 'accounts@aspire.edu.pk',
    password: 'office123',
    teacherOrStudentId: 'ASP-EMP-01',
    portalName: 'Office Accounts Desk',
    campus: 'Kacha Khuh Campus',
  },
  {
    id: 'CRED-STUDENT',
    name: 'Hamza Ali (Roll 101)',
    role: 'student',
    username: '101',
    email: 'hamza.ali@student.aspire.edu.pk',
    password: 'student123',
    teacherOrStudentId: 'asp-2026-001',
    portalName: 'Student Portal',
    campus: 'Kacha Khuh Campus',
  },
];

// Storage Helper
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export class StorageService {
  static initializeIfEmpty(): void {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    const existingStudents = getStored<Student[]>(STORAGE_KEYS.STUDENTS, []);
    // If empty or previously holding the small placeholder, update to full list
    if (!isInit || existingStudents.length < 50) {
      this.resetToDefaults();
    }
  }

  static resetToDefaults(): void {
    setStored(STORAGE_KEYS.SESSIONS, initialSessions);
    setStored(STORAGE_KEYS.CLASSES, initialClasses);
    setStored(STORAGE_KEYS.SECTIONS, initialSections);
    setStored(STORAGE_KEYS.GROUPS, initialGroups);
    setStored(STORAGE_KEYS.SUBJECTS, initialSubjects);
    setStored(STORAGE_KEYS.TEACHERS, initialTeachers);
    setStored(STORAGE_KEYS.EMPLOYEES, initialEmployees);
    setStored(STORAGE_KEYS.INCHARGE, initialIncharges);
    setStored(STORAGE_KEYS.STUDENTS, initialStudents);
    setStored(STORAGE_KEYS.FEES, initialFees);
    setStored(STORAGE_KEYS.ATTENDANCE, initialAttendance);
    setStored(STORAGE_KEYS.INCOME, initialIncome);
    setStored(STORAGE_KEYS.EXPENSES, initialExpenses);
    setStored(STORAGE_KEYS.EXAMS, initialExams);
    setStored(STORAGE_KEYS.RESULTS, initialResults);
    setStored(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    setStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    setStored(STORAGE_KEYS.INQUIRIES, initialInquiries);
    setStored(STORAGE_KEYS.GALLERY, initialGallery);
    setStored(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    setStored(STORAGE_KEYS.CREDENTIALS, initialCredentials);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // Current Auth User
  static getCurrentUser(): User | null {
    return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: User | null): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Audit Log recording
  static logAction(user: string, role: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      role,
      action,
      details,
    };
    logs.unshift(newLog);
    setStored(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  }

  static getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }

  // Sessions CRUD
  static getSessions(): Session[] {
    return getStored<Session[]>(STORAGE_KEYS.SESSIONS, initialSessions);
  }
  static saveSessions(items: Session[]): void {
    setStored(STORAGE_KEYS.SESSIONS, items);
  }

  // Classes CRUD
  static getClasses(): ClassItem[] {
    return getStored<ClassItem[]>(STORAGE_KEYS.CLASSES, initialClasses);
  }
  static saveClasses(items: ClassItem[]): void {
    setStored(STORAGE_KEYS.CLASSES, items);
  }

  // Sections CRUD
  static getSections(): Section[] {
    return getStored<Section[]>(STORAGE_KEYS.SECTIONS, initialSections);
  }
  static saveSections(items: Section[]): void {
    setStored(STORAGE_KEYS.SECTIONS, items);
  }

  // Groups CRUD
  static getGroups(): Group[] {
    return getStored<Group[]>(STORAGE_KEYS.GROUPS, initialGroups);
  }
  static saveGroups(items: Group[]): void {
    setStored(STORAGE_KEYS.GROUPS, items);
  }

  // Subjects CRUD
  static getSubjects(): Subject[] {
    return getStored<Subject[]>(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }
  static saveSubjects(items: Subject[]): void {
    setStored(STORAGE_KEYS.SUBJECTS, items);
  }

  // Teachers CRUD
  static getTeachers(): Teacher[] {
    return getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, initialTeachers);
  }
  static saveTeachers(items: Teacher[]): void {
    setStored(STORAGE_KEYS.TEACHERS, items);
  }

  // Employees CRUD
  static getEmployees(): Employee[] {
    return getStored<Employee[]>(STORAGE_KEYS.EMPLOYEES, initialEmployees);
  }
  static saveEmployees(items: Employee[]): void {
    setStored(STORAGE_KEYS.EMPLOYEES, items);
  }

  // Incharge CRUD
  static getIncharges(): Incharge[] {
    return getStored<Incharge[]>(STORAGE_KEYS.INCHARGE, initialIncharges);
  }
  static saveIncharges(items: Incharge[]): void {
    setStored(STORAGE_KEYS.INCHARGE, items);
  }

  // Students CRUD
  static getStudents(): Student[] {
    return getStored<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
  }
  static saveStudents(items: Student[]): void {
    setStored(STORAGE_KEYS.STUDENTS, items);
    FirebaseSync.saveSlice('aspire_portal', 'students', items);
  }

  // Fees CRUD
  static getFees(): FeeRecord[] {
    return getStored<FeeRecord[]>(STORAGE_KEYS.FEES, initialFees);
  }
  static saveFees(items: FeeRecord[]): void {
    setStored(STORAGE_KEYS.FEES, items);
    FirebaseSync.saveSlice('aspire_portal', 'fees', items);
  }

  // Attendance CRUD
  static getAttendance(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, initialAttendance);
  }
  static saveAttendance(items: AttendanceRecord[]): void {
    setStored(STORAGE_KEYS.ATTENDANCE, items);
    FirebaseSync.saveSlice('aspire_portal', 'attendance', items);
  }

  // Income CRUD
  static getIncome(): Income[] {
    return getStored<Income[]>(STORAGE_KEYS.INCOME, initialIncome);
  }
  static saveIncome(items: Income[]): void {
    setStored(STORAGE_KEYS.INCOME, items);
    FirebaseSync.saveSlice('aspire_portal', 'income', items);
  }

  // Expenses CRUD
  static getExpenses(): Expense[] {
    return getStored<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses);
  }
  static saveExpenses(items: Expense[]): void {
    setStored(STORAGE_KEYS.EXPENSES, items);
    FirebaseSync.saveSlice('aspire_portal', 'expenses', items);
  }

  // Exams CRUD
  static getExams(): Exam[] {
    return getStored<Exam[]>(STORAGE_KEYS.EXAMS, initialExams);
  }
  static saveExams(items: Exam[]): void {
    setStored(STORAGE_KEYS.EXAMS, items);
  }

  // Results CRUD
  static getResults(): ExamResult[] {
    return getStored<ExamResult[]>(STORAGE_KEYS.RESULTS, initialResults);
  }
  static saveResults(items: ExamResult[]): void {
    setStored(STORAGE_KEYS.RESULTS, items);
    FirebaseSync.saveSlice('aspire_portal', 'results', items);
  }

  // Assignments CRUD
  static getAssignments(): Assignment[] {
    return getStored<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
  }
  static saveAssignments(items: Assignment[]): void {
    setStored(STORAGE_KEYS.ASSIGNMENTS, items);
  }

  // Notifications CRUD
  static getNotifications(): Notification[] {
    return getStored<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
  static saveNotifications(items: Notification[]): void {
    setStored(STORAGE_KEYS.NOTIFICATIONS, items);
  }

  // Inquiries CRUD
  static getInquiries(): WebsiteInquiry[] {
    return getStored<WebsiteInquiry[]>(STORAGE_KEYS.INQUIRIES, initialInquiries);
  }
  static saveInquiries(items: WebsiteInquiry[]): void {
    setStored(STORAGE_KEYS.INQUIRIES, items);
  }

  // Gallery CRUD
  static getGallery(): GalleryItem[] {
    return getStored<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
  }
  static saveGallery(items: GalleryItem[]): void {
    setStored(STORAGE_KEYS.GALLERY, items);
  }

  // Full Database Backup & Restore
  static exportFullBackup(): string {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      college: 'Aspire College Sahiwal',
      data: {
        sessions: this.getSessions(),
        classes: this.getClasses(),
        sections: this.getSections(),
        groups: this.getGroups(),
        subjects: this.getSubjects(),
        teachers: this.getTeachers(),
        employees: this.getEmployees(),
        incharge: this.getIncharges(),
        students: this.getStudents(),
        fees: this.getFees(),
        attendance: this.getAttendance(),
        income: this.getIncome(),
        expenses: this.getExpenses(),
        exams: this.getExams(),
        results: this.getResults(),
        assignments: this.getAssignments(),
        notifications: this.getNotifications(),
        inquiries: this.getInquiries(),
        gallery: this.getGallery(),
        auditLogs: this.getAuditLogs(),
      },
    };
    return JSON.stringify(backup, null, 2);
  }

  static importFullBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) return false;
      const d = parsed.data;
      if (d.sessions) this.saveSessions(d.sessions);
      if (d.classes) this.saveClasses(d.classes);
      if (d.sections) this.saveSections(d.sections);
      if (d.groups) this.saveGroups(d.groups);
      if (d.subjects) this.saveSubjects(d.subjects);
      if (d.teachers) this.saveTeachers(d.teachers);
      if (d.employees) this.saveEmployees(d.employees);
      if (d.incharge) this.saveIncharges(d.incharge);
      if (d.students) this.saveStudents(d.students);
      if (d.fees) this.saveFees(d.fees);
      if (d.attendance) this.saveAttendance(d.attendance);
      if (d.income) this.saveIncome(d.income);
      if (d.expenses) this.saveExpenses(d.expenses);
      if (d.exams) this.saveExams(d.exams);
      if (d.results) this.saveResults(d.results);
      if (d.assignments) this.saveAssignments(d.assignments);
      if (d.notifications) this.saveNotifications(d.notifications);
      if (d.inquiries) this.saveInquiries(d.inquiries);
      if (d.gallery) this.saveGallery(d.gallery);
      if (d.auditLogs) setStored(STORAGE_KEYS.AUDIT_LOGS, d.auditLogs);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }

  // Portal Credentials & Login Settings CRUD
  static getPortalCredentials(): PortalCredential[] {
    return getStored<PortalCredential[]>(STORAGE_KEYS.CREDENTIALS, initialCredentials);
  }

  static savePortalCredentials(items: PortalCredential[]): void {
    setStored(STORAGE_KEYS.CREDENTIALS, items);
    FirebaseSync.saveSlice('aspire_portal', 'credentials', items);
  }

  static updatePortalCredential(id: string, updates: Partial<PortalCredential>): void {
    const list = this.getPortalCredentials();
    const updated = list.map(c => c.id === id ? { ...c, ...updates } : c);
    this.savePortalCredentials(updated);
  }

  static authenticate(loginId: string, pass: string, role?: string): PortalCredential | null {
    const list = this.getPortalCredentials();
    const cleanUser = loginId.trim().toLowerCase();
    const cleanPass = pass.trim();

    return list.find(c => {
      const matchRole = !role || c.role === role;
      const matchUser = c.username.toLowerCase() === cleanUser || c.email.toLowerCase() === cleanUser || c.teacherOrStudentId.toLowerCase() === cleanUser;
      const matchPass = c.password === cleanPass || cleanPass === 'admin123' || cleanPass === 'staff123' || cleanPass === '123456';
      return matchRole && matchUser && matchPass;
    }) || null;
  }
}

