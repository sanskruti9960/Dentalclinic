import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Phone, X, HelpCircle, Sparkles } from 'lucide-react';

interface PatientLoginPageProps {
  onGoToRegister: () => void;
  onGoToAdmin: () => void;
}

export const PatientLoginPage: React.FC<PatientLoginPageProps> = ({
  onGoToRegister,
  onGoToAdmin
}) => {
  const { login } = useClinic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Live email validation
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailTouched(true);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    // Explicitly enforce 'patient' role for the public patient login
    const result = login(cleanEmail, password, 'patient');
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      
      {/* Top Floating Pill Brand Header (Matching website's Navbar aesthetic) */}
      <header className="max-w-md w-full mx-auto pt-2 sm:pt-4">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide">
              Smita Dental
            </span>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Patient Portal</span>
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-xs p-6 sm:p-8">
          
          <div className="mb-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-2 border border-indigo-100">
              Secure Healthcare Access
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Patient Login</h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Sign in to manage appointments, review treatment records, and view dental prescriptions.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div
              className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {errorMessage.includes('Staff credentials detected') && (
                  <button
                    type="button"
                    onClick={onGoToAdmin}
                    className="block font-bold text-rose-900 underline mt-1 cursor-pointer"
                  >
                    Go to Staff Portal Login →
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Validation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="patient-email" className="block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                {emailTouched && (
                  <span className={`text-[10px] font-bold ${isEmailValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isEmailValid ? '✓ Valid format' : 'Invalid email'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="patient-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onBlur={() => setEmailTouched(true)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                    emailTouched && !isEmailValid && email.length > 0
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="patient-password" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="patient-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
              <span>{isSubmitting ? 'Signing in...' : 'Sign In to Patient Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              First time visiting Smita Dental Clinic?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="font-extrabold text-indigo-700 hover:text-indigo-900 hover:underline transition cursor-pointer"
              >
                Create Patient Account
              </button>
            </p>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted patient authentication &amp; data privacy</span>
        </div>
      </main>

      {/* Understated Public Footer */}
      <footer className="max-w-md w-full mx-auto text-center pt-6 pb-2 text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} Smita Dental Clinic. All rights reserved.</p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span>Patient Privacy Protected</span>
          <span>•</span>
          {/* Unobtrusive link to staff portal */}
          <button
            type="button"
            onClick={onGoToAdmin}
            className="text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            Staff Portal
          </button>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 sm:p-7 relative">
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-2xs">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-black text-slate-900">Account Password Assistance</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              To safeguard your private medical records and identity, password resets are processed securely by clinic reception.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-slate-900">+91 98200 11223</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-slate-900">reception@smitadental.com</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 leading-snug">
                Please mention your registered email when contacting reception for identity verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(false)}
              className="mt-5 w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
