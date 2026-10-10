import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientLoginPage } from './PatientLoginPage';
import { PatientRegisterStep1 } from './PatientRegisterStep1';
import { EmailOtpVerifyStep } from './EmailOtpVerifyStep';
import { PatientProfileStep2 } from './PatientProfileStep2';
import { AdminLoginPage } from './AdminLoginPage';

export type AuthViewMode =
  | 'patient-login'
  | 'register-step1'
  | 'verify-otp'
  | 'register-step2'
  | 'admin-login';

export const AuthPage: React.FC = () => {
  const { currentUser, logout } = useClinic();

  const [authMode, setAuthMode] = useState<AuthViewMode>(() => {
    // If user is logged in as a patient:
    if (currentUser && currentUser.role === 'patient') {
      if (!currentUser.isEmailVerified && currentUser.otpCode) {
        return 'verify-otp';
      }
      if (!currentUser.isProfileComplete) {
        return 'register-step2';
      }
    }

    // Check URL hash or path
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#/admin/login' || path === '/admin/login') {
        return 'admin-login';
      }
      if (hash === '#/register') {
        return 'register-step1';
      }
    }
    return 'patient-login';
  });

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/admin/login') {
        setAuthMode('admin-login');
      } else if (hash === '#/register') {
        setAuthMode('register-step1');
      } else if (hash === '#/login' || hash === '') {
        setAuthMode('patient-login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when mode changes
  const changeMode = (mode: AuthViewMode) => {
    setAuthMode(mode);
    if (typeof window !== 'undefined') {
      if (mode === 'admin-login') {
        window.location.hash = '#/admin/login';
      } else if (mode === 'register-step1') {
        window.location.hash = '#/register';
      } else if (mode === 'patient-login') {
        window.location.hash = '#/login';
      }
    }
  };

  // If a patient is logged in but hasn't completed their profile, gate them
  if (currentUser && currentUser.role === 'patient' && !currentUser.isProfileComplete) {
    if (!currentUser.isEmailVerified && currentUser.otpCode) {
      return (
        <EmailOtpVerifyStep
          onSuccess={() => setAuthMode('register-step2')}
          onGoBack={() => {
            logout();
            changeMode('register-step1');
          }}
        />
      );
    }

    return (
      <PatientProfileStep2
        onSuccess={() => {
          // Context handles updating state and redirecting to patient-dashboard
        }}
        onGoBack={() => {
          logout();
          changeMode('register-step1');
        }}
        onSignOut={() => {
          logout();
          changeMode('patient-login');
        }}
      />
    );
  }

  // Render view according to authMode
  switch (authMode) {
    case 'admin-login':
      return (
        <AdminLoginPage
          onBackToPatientLogin={() => changeMode('patient-login')}
        />
      );

    case 'register-step1':
      return (
        <PatientRegisterStep1
          onSuccess={() => setAuthMode('verify-otp')}
          onGoToLogin={() => changeMode('patient-login')}
        />
      );

    case 'verify-otp':
      return (
        <EmailOtpVerifyStep
          onSuccess={() => setAuthMode('register-step2')}
          onGoBack={() => setAuthMode('register-step1')}
        />
      );

    case 'register-step2':
      return (
        <PatientProfileStep2
          onSuccess={() => {
            // Handled by ClinicContext setting isProfileComplete: true
          }}
          onGoBack={() => setAuthMode('register-step1')}
          onSignOut={() => changeMode('patient-login')}
        />
      );

    case 'patient-login':
    default:
      return (
        <PatientLoginPage
          onGoToRegister={() => changeMode('register-step1')}
          onGoToAdmin={() => changeMode('admin-login')}
        />
      );
  }
};
