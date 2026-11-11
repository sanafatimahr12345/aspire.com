import React, { useState } from 'react';
import { UserRole } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  Calendar,
  CheckCircle2,
  ChevronDown,
  LogIn,
  ExternalLink
} from 'lucide-react';

interface PublicWebsiteProps {
  onOpenLogin: (role: UserRole) => void;
  onNavigateToPortal?: () => void;
  onSelectTeacher?: (teacherName: string) => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onOpenLogin, onSelectTeacher }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Inquiry form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('F.Sc');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const inquiries = StorageService.getInquiries();
    const newInquiry = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      name: fullName.trim(),
      email: email.trim() || 'Not provided',
      phone: phone.trim(),
      program,
      message: message.trim() || 'I want admission details...',
      date: new Date().toISOString().slice(0, 10),
      status: 'New' as const,
    };

    inquiries.unshift(newInquiry);
    StorageService.saveInquiries(inquiries);
    StorageService.logAction('Website Visitor', 'Public User', 'Admission Inquiry Submitted', `Inquiry for ${program} by ${fullName}`);

    setFormSubmitted(true);
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  // 4 Featured Program Cards on Hero (matching reference image)
  const heroPrograms = [
    {
      letter: 'F',
      name: 'F.Sc',
      desc: 'Pre-Medical & Pre-Engineering',
      detail: '11th 1st Year · After 10 Months',
    },
    {
      letter: 'I',
      name: 'ICS',
      desc: 'Computer Science',
      detail: '11th 1st Year · After 10 Months',
    },
    {
      letter: 'C',
      name: 'I.Com',
      desc: 'Commerce & Banking',
      detail: '11th 1st Year · After 10 Months',
    },
    {
      letter: 'D',
      name: 'DIT',
      desc: 'Info Technology',
      detail: '11th 1st Year · After 10 Months',
    },
  ];

  // Campus Gallery images matching layout using the exact uploaded photos
  const galleryFeatured = {
    title: 'Main Campus Building',
    subtitle: 'Aspire College Block A',
    image: '/assets/gallery/main_campus_building.png',
  };

  const galleryGrid = [
    {
      title: 'Morning Assembly',
      image: '/assets/gallery/morning_assembly.png',
    },
    {
      title: 'Management Office',
      image: '/assets/gallery/management_office.png',
    },
    {
      title: 'Farewell Ceremony',
      image: '/assets/gallery/farewell_ceremony.png',
    },
    {
      title: 'Student Life',
      image: '/assets/gallery/student_life.png',
    },
  ];

  // Faculty teacher list in footer (matching reference image)
  const footerTeachers = [
    'Muhammad Mahmood (F.Sc)',
    'Maqsood Hussain (I.Com)',
    'Nadeem Akhtar (ICS)',
    'Jamshed Abbas (DIT)',
    'Dr. Asad (Bio)',
    'Asif Mehmood (Math)',
    'Tariq Ali (Eng)',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. Header Navigation Bar (Exact match to reference) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#990000] flex items-center justify-center text-white font-bold text-sm">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-extrabold tracking-tight text-[#990000] block uppercase font-heading">
                ASPIRE COLLEGE
              </span>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">
                MANAGEMENT SYSTEM
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-700">
            <a href="#programs" className="hover:text-[#990000] transition-colors">Programs</a>
            <a href="#gallery" className="hover:text-[#990000] transition-colors">Gallery</a>
            <a href="#admission" className="hover:text-[#990000] transition-colors">Admission</a>
          </nav>

          {/* Admin Login Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenLogin('admin')}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#990000] hover:bg-[#800000] rounded-md shadow-xs transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Exact red background banner with 2x2 white cards) */}
      <section 
        className="relative bg-[#8b1515] text-white py-14 lg:py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 21, 21, 0.92), rgba(115, 12, 12, 0.95)), url('/assets/gallery/main_campus_building.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full border border-white/40 text-[11px] font-semibold tracking-wider uppercase text-white/90">
                ADMISSION OPEN 2026-27
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-black tracking-tight text-white font-heading leading-tight uppercase">
                A COLLEGE WHERE<br />
                AMBITION IS<br />
                <span className="text-amber-400">FORMED</span>
              </h1>

              <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
                Aspire College Management System – Excellence in F.Sc, ICS, I.Com &amp; DIT. Real-onboard sessions with guaranteed rewards and incharge management.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#admission"
                  className="px-6 py-2.5 text-xs font-bold bg-white text-[#8b1515] rounded-full shadow-md hover:bg-slate-100 transition-all uppercase tracking-wide"
                >
                  Enroll Now
                </a>

                <button
                  onClick={() => onOpenLogin('admin')}
                  className="px-6 py-2.5 text-xs font-bold text-white border border-white rounded-full hover:bg-white/10 transition-all uppercase tracking-wide"
                >
                  Admin Login
                </button>
              </div>

              <div className="pt-2 text-[11px] text-white/80 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Sahiwal Campus · Session 2026-27</span>
              </div>
            </div>

            {/* Right: 2x2 White Program Cards */}
            <div id="programs" className="lg:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heroPrograms.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 text-slate-900 shadow-xl border border-white/20 hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#990000] text-white flex items-center justify-center font-bold text-xs mb-3 shadow-xs">
                      {p.letter}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-heading leading-none">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {p.desc}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                      {p.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Campus Gallery Section (Exact match: 1 large left card + 2x2 right grid) */}
      <section id="gallery" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Campus Gallery
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real campus using supplied assets: same as same
              </p>
            </div>
            <span className="text-xs font-semibold text-[#990000]">
              5 images · 1 featured
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Large Featured Card */}
            <div 
              onClick={() => setSelectedImage(galleryFeatured.image)}
              className="lg:col-span-5 relative rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group h-[320px] lg:h-[400px] bg-slate-100"
            >
              <img
                src={galleryFeatured.image}
                alt={galleryFeatured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <h4 className="text-base font-bold leading-tight">{galleryFeatured.title}</h4>
                <p className="text-xs text-white/80 mt-0.5">{galleryFeatured.subtitle}</p>
              </div>
            </div>

            {/* Right 2x2 Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              {galleryGrid.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(item.image)}
                  className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group h-[155px] lg:h-[192px] bg-slate-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                    <span className="text-xs font-bold drop-shadow-sm">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl bg-black">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="Gallery Large View" 
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* 4. Student Admission Enquiry Form Section (Exact match) */}
      <section id="admission" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Information Column */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block text-[10px] font-bold text-[#990000] uppercase tracking-wider bg-red-100 px-2 py-0.5 rounded-sm">
                ADMISSION FORM 2026
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Student Admission<br />Enquiry Form
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                Fill form, data saves to Website Inquiries (in-memory/session - same to same logic). Our office will contact you.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#990000] shrink-0" />
                  <span>040-1234567 / 0300-1234567</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#990000] shrink-0" />
                  <span>admissions@aspire.edu.pk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#990000] shrink-0" />
                  <span>Aspire College, Sahiwal Road, Punjab</span>
                </div>
              </div>
            </div>

            {/* Right Enquiry Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
                {formSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-base font-bold text-emerald-900">Enquiry Submitted Successfully!</h4>
                    <p className="text-xs text-emerald-700">
                      Your admission enquiry has been saved to the management database. Our admission officer will reach out.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="mt-3 px-4 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ali Raza"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ali@gmail.com"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Program */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0300-..."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Program *
                        </label>
                        <select
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                        >
                          <option value="F.Sc">F.Sc (Pre-Medical &amp; Pre-Engineering)</option>
                          <option value="ICS">ICS (Computer Science)</option>
                          <option value="I.Com">I.Com (Commerce &amp; Banking)</option>
                          <option value="DIT">DIT (Information Technology)</option>
                          <option value="FA">FA (Arts &amp; Humanities)</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Message */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="I want admission details..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs rounded-md shadow-xs transition-colors"
                    >
                      Submit Admission Enquiry
                    </button>

                    <p className="text-[10px] text-slate-400 text-center">
                      Data is safely stored in the system (just migrate when out to db/api)
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer (Exact match: Dark black background, 4 columns, teacher portal pills) */}
      <footer className="bg-[#0a0a0a] text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-900">
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-xs bg-[#990000] flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <span className="font-bold text-white text-sm font-heading tracking-tight uppercase">
                  ASPIRE COLLEGE
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A College Where Ambition Is Formed. Real system for campus build with fixed incharge module.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#admission" className="hover:text-white transition-colors">Admission</a></li>
              </ul>
            </div>

            {/* Column 3: Portals & Teacher Incharge Pills */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Portals</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onOpenLogin('staff')}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full transition-colors"
                  >
                    Staff Portal
                  </button>
                  <button
                    onClick={() => onOpenLogin('office')}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full transition-colors"
                  >
                    Office Portal
                  </button>
                  <button
                    onClick={() => onOpenLogin('student')}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full transition-colors"
                  >
                    Student Portal
                  </button>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                  TEACHER PORTALS - Farha Allah Dastgir (11)
                </h5>
                <div className="flex flex-wrap gap-1">
                  {footerTeachers.map((tName, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectTeacher ? onSelectTeacher(tName) : onOpenLogin('staff')}
                      className="px-2 py-0.5 text-[10px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-full transition-colors cursor-pointer hover:text-white"
                    >
                      {tName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact</h4>
              <p className="text-xs text-slate-300">040-1234567</p>
              <p className="text-xs text-slate-300 mt-1">aspire.edu.pk</p>
              <p className="text-xs text-slate-400 mt-1">Sahiwal, Punjab</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-600 font-mono">
            aspire college management system - intermediate in f.sc, ics, i.com - sargodha / sahiwal
          </div>
        </div>
      </footer>
    </div>
  );
};
