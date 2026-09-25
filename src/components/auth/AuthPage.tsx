import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientRegistrationInput } from '../../types/clinic';
import {
  Stethoscope,
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  MapPin
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, registerPatientWithAccount, users, patients } = useClinic();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRoleTab, setSelectedRoleTab] = useState<'doctor' | 'patient'>('patient');

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign Up / New Patient Comprehensive Registration State
  const [formData, setFormData] = useState<PatientRegistrationInput>({
    name: '',
    age: 30,
    gender: 'Male',
    phone: '',
    email: '',
    password: '',
    address: '',
    bloodGroup: 'B+',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Spouse',
    medicalAlerts: [],
    chiefComplaint: '',
    previousDentalHistory: ''
  });

  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  const availableMedicalAlerts = [
    'Type II Diabetes',
    'Hypertension',
    'Cardiac Pacemaker / Heart Condition',
    'Penicillin / Amoxicillin Allergy',
    'Latex Allergy',
    'Bleeding Disorder / Anticoagulants',
    'Asthmatic',
    'Pregnancy'
  ];

  const handleToggleAlert = (alert: string) => {
    setFormData((prev) => {
      const exists = prev.medicalAlerts.includes(alert);
      return {
        ...prev,
        medicalAlerts: exists
          ? prev.medicalAlerts.filter((a) => a !== alert)
          : [...prev.medicalAlerts, alert]
      };
    });
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail) {
      setLoginError('Please enter your email address.');
      return;
    }
    const success = login(loginEmail, loginPassword);
    if (!success) {
      setLoginError('Invalid credentials or unregistered email. Please try again.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required contact and demographic details.');
      return;
    }
    if (!formData.chiefComplaint) {
      alert('Please briefly state your primary dental concern or reason for visit.');
      return;
    }

    registerPatientWithAccount(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Decorative subtle backdrop elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 mb-3">
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
              <path d="M9 10c.8 0 1.5.7 1.5 1.5S9.8 13 9 13s-1.5-.7-1.5-1.5S8.2 10 9 10z" />
              <path d="M15 10c.8 0 1.5.7 1.5 1.5S15.8 13 15 13s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smita Dental Clinic</h1>
          <p className="text-xs font-bold text-indigo-700 mt-1 uppercase tracking-wider">
            Dr. Smita Bevle (BDS, MDS) • Sole Dental Surgeon
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Advanced Prosthodontics, Dental Implants & Laser Dentistry Center
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Top Auth Mode Tabs (Sign In vs Register) */}
          <div className="grid grid-cols-2 border-b border-slate-100 text-xs font-bold">
            <button
              onClick={() => setAuthMode('signin')}
              className={`py-4 text-center transition cursor-pointer ${
                authMode === 'signin'
                  ? 'border-b-2 border-indigo-600 text-indigo-900 bg-indigo-50/40'
                  : 'text-slate-500 hover:text-slate-800 bg-slate-50/50'
              }`}
            >
              Sign In to Portal
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`py-4 text-center transition cursor-pointer ${
                authMode === 'signup'
                  ? 'border-b-2 border-indigo-600 text-indigo-900 bg-indigo-50/40'
                  : 'text-slate-500 hover:text-slate-800 bg-slate-50/50'
              }`}
            >
              New Patient Registration
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* 1. SIGN IN FLOW */}
            {authMode === 'signin' && (
              <div className="space-y-6">
                {/* Role Filter Selector */}
                <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleTab('patient');
                      setLoginError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRoleTab === 'patient'
                        ? 'bg-white text-indigo-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Patient Portal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleTab('doctor');
                      setLoginError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRoleTab === 'doctor'
                        ? 'bg-white text-purple-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-purple-600" />
                    <span>Dr. Smita Bevle (Doctor)</span>
                  </button>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder={selectedRoleTab === 'doctor' ? 'dr.smita@clinic.com' : 'patient@example.com'}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In to {selectedRoleTab === 'doctor' ? 'Dr. Smita Workstation' : 'Patient Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-slate-500">
                  {selectedRoleTab === 'patient' ? (
                    <p>
                      First time visiting Smita Dental Clinic?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="font-bold text-indigo-700 hover:underline cursor-pointer"
                      >
                        Register as a New Patient
                      </button>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Restricted to Dr. Smita Bevle (Sole Dental Surgeon).
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 2. COMPREHENSIVE NEW PATIENT INTAKE FORM (FEED DIRECTLY TO DATABASE) */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>New Patient Electronic Registration Intake</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Please provide all required clinical & demographic details. This will automatically feed into Dr. Smita Bevle's database.
                  </p>
                </div>

                {signupStep === 1 && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Legal Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ananya Deshmukh"
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ananya@example.com"
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile Phone <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98200 00000"
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={110}
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Portal Password</label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Create login password"
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-mono"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Street address, Apartment, City"
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.name || !formData.phone || !formData.email) {
                            alert('Please complete the contact information first.');
                            return;
                          }
                          setSignupStep(2);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Medical History & Chief Complaint</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {signupStep === 2 && (
                  <div className="space-y-3 animate-in fade-in">
                    {/* Emergency Contact */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Emergency Contact Person
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Contact Name"
                          required
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Relation (e.g. Spouse)"
                          required
                          value={formData.emergencyContactRelation}
                          onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                          className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                        <input
                          type="tel"
                          placeholder="Emergency Phone"
                          required
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                          className="p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>

                    {/* Medical Alerts Toggle Checkboxes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Medical Alerts & Health Conditions (Check all that apply)
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {availableMedicalAlerts.map((alert) => {
                          const checked = formData.medicalAlerts.includes(alert);
                          return (
                            <button
                              type="button"
                              key={alert}
                              onClick={() => handleToggleAlert(alert)}
                              className={`p-2 rounded-xl text-left text-[11px] font-semibold transition border cursor-pointer flex items-center justify-between ${
                                checked
                                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{alert}</span>
                              {checked && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chief Dental Concern */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chief Dental Concern / Reason for Visit <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formData.chiefComplaint}
                        onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                        placeholder="e.g. Toothache in lower molar, bleeding gums, aesthetic consultation..."
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Previous Dental History */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Past Dental Treatment History (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.previousDentalHistory}
                        onChange={(e) => setFormData({ ...formData, previousDentalHistory: e.target.value })}
                        placeholder="e.g. Fillings 2 years ago, braces, wisdom teeth extracted..."
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Registration & Enter Portal</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Smita Dental Clinic • Dr. Smita Bevle (BDS, MDS) • Sole Practitioner • Private & Secure Healthcare Portal
        </p>
      </div>
    </div>
  );
};
