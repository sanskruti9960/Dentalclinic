import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  onBackToPatientLogin: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToPatientLogin }) => {
  const { login } = useClinic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter staff email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter staff password.');
      return;
    }

    setIsSubmitting(true);
    // Explicitly enforce 'doctor' role requirement
    const result = login(cleanEmail, password, 'doctor');
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials or unauthorized account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      
      {/* Top Floating Pill Brand Header */}
      <header className="max-w-md w-full mx-auto pt-2 sm:pt-4">
        <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700/80 shadow-md rounded-full px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToPatientLogin}
              className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Return to Patient Login"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide">
              Smita Dental
            </span>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
            Staff Portal
          </span>
        </div>
      </header>

      {/* Main Staff Login Card */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-slate-800/90 rounded-3xl sm:rounded-[2.5rem] border border-slate-700 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          
          {/* Prominent Back Navigation Arrow */}
          <div className="mb-4">
            <button
              type="button"
              onClick={onBackToPatientLogin}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>Back to Patient Login</span>
            </button>
          </div>

          {/* Security Notice Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Restricted Access • Staff &amp; Clinicians Only</span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Staff &amp; Provider Login</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Authorized clinical workstation login for Dr. Smita Bevle and practice administrators.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div
              className="mb-5 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="staff-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="staff-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="provider@clinic.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="staff-password" className="block text-xs font-bold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="staff-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs transition shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Authorize & Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Return to Patient Login */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 text-center">
            <button
              type="button"
              onClick={onBackToPatientLogin}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Patient Login</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-5 text-center text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
          Notice: Access to this workstation is monitored. Unauthorized login attempts are logged in compliance with healthcare data privacy policies.
        </p>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center pt-4 pb-2 text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} Smita Dental Clinic • Provider &amp; Clinical Administration</p>
      </footer>
    </div>
  );
};
