import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

interface PatientRegisterStep1Props {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export const PatientRegisterStep1: React.FC<PatientRegisterStep1Props> = ({
  onSuccess,
  onGoToLogin
}) => {
  const { createPatientAccount, users } = useClinic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field Touched states for live validation
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email Validation (RFC 5322 pattern)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isEmailDuplicate = users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // Comprehensive Password Validations (Healthcare Standard)
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber;

  // Password matching
  const isConfirmValid = confirmPassword.length > 0 && password === confirmPassword;

  // Password Strength Score (0 to 4)
  const passwordStrengthScore = [
    hasMinLength,
    hasUpper && hasLower,
    hasNumber,
    hasSpecial
  ].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    setTermsTouched(true);

    const cleanEmail = email.trim();
    if (!cleanEmail || !isEmailValid) {
      setErrorMessage('Please provide a valid email address (e.g. yourname@domain.com).');
      return;
    }

    if (isEmailDuplicate) {
      setErrorMessage('An account with this email address already exists. Please sign in instead.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.');
      return;
    }

    if (!isConfirmValid) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please acknowledge the Terms of Service and Patient Privacy Notice.');
      return;
    }

    setIsSubmitting(true);
    const result = createPatientAccount({
      email: cleanEmail,
      password,
      agreedToTerms
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
      return;
    }

    // Advance to Email OTP verification
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      
      {/* Top Floating Pill Brand Header (Matching website's Navbar aesthetic) */}
      <header className="max-w-md w-full mx-auto pt-2 sm:pt-4">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToLogin}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Return to Patient Login"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide">
              Smita Dental
            </span>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
            Patient Portal
          </span>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-xs p-6 sm:p-8">
          
          {/* Prominent Back Navigation Arrow Pill */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onGoToLogin}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to Patient Login</span>
            </button>

            <span className="text-[11px] font-bold text-slate-400">
              Stage 1 of 2
            </span>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-indigo-600 font-extrabold">Step 1: Account Credentials</span>
              <span className="text-slate-400">Step 2: Profile</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              <div className="w-1/2 bg-transparent"></div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Patient Account
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Register your electronic account to book dental visits, inspect treatment plans, and view digital invoices.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div
              className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {errorMessage.includes('already exists') && (
                  <button
                    type="button"
                    onClick={onGoToLogin}
                    className="block font-bold text-rose-900 underline mt-1 cursor-pointer"
                  >
                    Click here to Sign In →
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address with Live Validation & Duplicate Check */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                {emailTouched && (
                  <span
                    className={`text-[10px] font-bold ${
                      isEmailDuplicate
                        ? 'text-rose-600'
                        : isEmailValid
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {isEmailDuplicate
                      ? '⚠️ Email already registered'
                      : isEmailValid
                      ? '✓ Valid email format'
                      : 'Invalid email'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-email"
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
                    emailTouched && (!isEmailValid || isEmailDuplicate)
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {emailTouched && isEmailDuplicate && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  An account is already linked to this email. Please sign in or use another email.
                </p>
              )}
              {emailTouched && !isEmailValid && !isEmailDuplicate && (
                <p className="text-[11px] text-rose-600 mt-1">
                  Please enter a valid format: username@domain.com
                </p>
              )}
            </div>

            {/* Password Field with Live Validation & Strength Meter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                {password.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-500">
                    Strength:{' '}
                    <span
                      className={
                        passwordStrengthScore >= 3
                          ? 'text-emerald-600 font-extrabold'
                          : passwordStrengthScore === 2
                          ? 'text-amber-600 font-extrabold'
                          : 'text-rose-600 font-extrabold'
                      }
                    >
                      {passwordStrengthScore >= 3
                        ? 'Strong'
                        : passwordStrengthScore === 2
                        ? 'Moderate'
                        : 'Weak'}
                    </span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onBlur={() => setPasswordTouched(true)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!passwordTouched) setPasswordTouched(true);
                  }}
                  placeholder="Min 8 characters (upper, lower & numbers)"
                  className={`w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                    passwordTouched && !isPasswordValid
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-600'
                  }`}
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

              {/* Dynamic Strength Checklist Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                <span
                  className={`px-2 py-0.5 rounded-full border transition ${
                    hasMinLength
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {hasMinLength ? '✓' : '•'} 8+ chars
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border transition ${
                    hasUpper
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {hasUpper ? '✓' : '•'} Uppercase (A-Z)
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border transition ${
                    hasLower
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {hasLower ? '✓' : '•'} Lowercase (a-z)
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border transition ${
                    hasNumber
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {hasNumber ? '✓' : '•'} Number (0-9)
                </span>
              </div>
            </div>

            {/* Confirm Password with Live Matching */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-slate-700">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                {confirmPasswordTouched && confirmPassword.length > 0 && (
                  <span
                    className={`text-[10px] font-bold ${
                      isConfirmValid ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isConfirmValid ? '✓ Passwords match' : 'Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
                  }}
                  placeholder="Re-enter password to confirm"
                  className={`w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                    confirmPasswordTouched && confirmPassword.length > 0 && !isConfirmValid
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Healthcare Privacy Consent */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setTermsTouched(true);
                  }}
                  className={`mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer ${
                    termsTouched && !agreedToTerms ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                  }`}
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I agree to the <strong className="text-slate-800">Terms of Service</strong> and acknowledge the <strong className="text-slate-800">Patient Privacy Policy</strong> regarding electronic dental health record storage.
                </span>
              </label>
              {termsTouched && !agreedToTerms && (
                <p className="text-[10px] text-rose-600 mt-1 font-medium pl-6">
                  Consent is required to create a patient profile.
                </p>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Continue to Email Verification'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Existing User Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline transition cursor-pointer"
              >
                Sign In to Patient Portal
              </button>
            </p>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Passwords are encrypted and never stored in plain text</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center pt-4 pb-2 text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} Smita Dental Clinic. Confidential Healthcare Portal.</p>
      </footer>
    </div>
  );
};
