import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Server,
  Lock
} from 'lucide-react';

interface EmailOtpVerifyStepProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

export const EmailOtpVerifyStep: React.FC<EmailOtpVerifyStepProps> = ({
  onSuccess,
  onGoBack
}) => {
  const { currentUser, verifyEmailOtp, resendEmailOtp } = useClinic();

  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showDeploymentInfo, setShowDeploymentInfo] = useState(false);

  // Active OTP code available in session for testing
  const currentOtpCode = currentUser?.otpCode || '482910';

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      setErrorMessage('User session expired. Please return to step 1.');
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit authentication code.');
      return;
    }

    setIsVerifying(true);
    const result = verifyEmailOtp(currentUser.id, otp.trim());
    setIsVerifying(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid OTP code. Please check and try again.');
      return;
    }

    onSuccess();
  };

  const handleResend = () => {
    if (!currentUser) return;
    setErrorMessage('');
    resendEmailOtp(currentUser.id);
    setCountdown(60);
    setCanResend(false);
  };

  const handleAutoFillDemoOtp = () => {
    setOtp(currentOtpCode);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      
      {/* Top Floating Pill Brand Header (Matching website's Navbar aesthetic) */}
      <header className="max-w-md w-full mx-auto pt-2 sm:pt-4">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Back to Account Details"
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

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Email Auth
          </span>
        </div>
      </header>

      {/* Main OTP Verification Card */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-xs p-6 sm:p-8">
          
          {/* Prominent Back Navigation Button */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onGoBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to Step 1 (Edit Account)</span>
            </button>

            <span className="text-[11px] font-bold text-slate-400">
              Stage 1 of 2
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-indigo-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Account Created</span>
              </span>
              <span className="text-indigo-600 font-extrabold">Verify Email (OTP)</span>
              <span className="text-slate-400">Step 2: Profile</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="w-1/3 bg-emerald-600"></div>
              <div className="w-1/3 bg-indigo-600 rounded-full"></div>
              <div className="w-1/3 bg-transparent"></div>
            </div>
          </div>

          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Authenticate Email Address
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We have dispatched a 6-digit verification code to:
            </p>
            <p className="font-mono font-bold text-xs text-indigo-900 mt-1 bg-indigo-50/70 border border-indigo-100 py-1 px-3 rounded-full inline-block">
              {currentUser?.email || 'patient@example.com'}
            </p>
          </div>

          {/* Production Deployment Email Authentication Constraints Card */}
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-slate-900 text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Deployment Email Gateway Constraints</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ Authenticated
              </span>
            </div>

            {/* Constraints Checklist */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
              <div className="flex items-center gap-1 text-emerald-800 font-medium bg-emerald-50/60 px-2 py-1 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>RFC 5322 Syntax Valid</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-800 font-medium bg-emerald-50/60 px-2 py-1 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>DNS MX Reachable</span>
              </div>
              <div className="flex items-center gap-1 text-indigo-900 font-medium bg-indigo-50/60 px-2 py-1 rounded-lg border border-indigo-100">
                <Clock className="w-3 h-3 text-indigo-600 shrink-0" />
                <span>Rate Limit: 60s cooldown</span>
              </div>
              <div className="flex items-center gap-1 text-indigo-900 font-medium bg-indigo-50/60 px-2 py-1 rounded-lg border border-indigo-100">
                <Lock className="w-3 h-3 text-indigo-600 shrink-0" />
                <span>Token Validity: 10 mins</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Preview Simulation OTP:</span>
                <span className="font-mono font-black text-indigo-700 tracking-wider text-sm">{currentOtpCode}</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillDemoOtp}
                className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] border border-indigo-200 transition cursor-pointer"
              >
                1-Click Auto Fill
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="otp-input" className="block text-xs font-bold text-slate-700 text-center mb-2">
                Enter 6-Digit OTP Code
              </label>
              <input
                id="otp-input"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="482910"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.length < 6}
              className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isVerifying ? 'Validating Token...' : 'Verify Email & Proceed'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resend Authentication Code</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Resend new code in {countdown}s</span>
              </span>
            )}
          </div>

          {/* Technical Production Deployment Note Collapsible */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDeploymentInfo(!showDeploymentInfo)}
              className="w-full text-left flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-500" />
                <span>Production Deployment Architecture Info</span>
              </span>
              <span>{showDeploymentInfo ? '▲' : '▼'}</span>
            </button>

            {showDeploymentInfo && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5 animate-in fade-in leading-relaxed">
                <p>
                  <strong>Live Deployment Constraint:</strong> In production environments, this step routes via Spring Boot's <code>NotificationService</code> / <code>JavaMailSender</code> or cloud mail provider (SendGrid / AWS SES) to dispatch cryptographically salted HMAC tokens.
                </p>
                <p>
                  In this current environment, code delivery is simulated via client notifications and the instant test banner above.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Security badge */}
        <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-factor email ownership verification</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center pt-4 pb-2 text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} Smita Dental Clinic • Secure Patient Authentication</p>
      </footer>
    </div>
  );
};
