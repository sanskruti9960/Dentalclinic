import React from 'react';
import { useClinic } from './context/ClinicContext';
import { AuthPage } from './components/auth/AuthPage';
import { Navbar } from './components/layout/Navbar';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { PrintInvoiceModal } from './components/common/PrintInvoiceModal';
import { PrintPrescriptionModal } from './components/common/PrintPrescriptionModal';
import { NewAppointmentModal } from './components/common/NewAppointmentModal';
import { ToastContainer } from './components/common/ToastContainer';

// Doctor View Components
import { DoctorScheduleView } from './components/doctor/DoctorScheduleView';
import { DoctorPatientDatabaseView } from './components/doctor/DoctorPatientDatabaseView';
import { DoctorBillingView } from './components/doctor/DoctorBillingView';
import { DoctorOverviewView } from './components/doctor/DoctorOverviewView';

// Patient View Components
import { PatientDashboardView } from './components/patient/PatientDashboardView';
import { PatientBookAppointmentView } from './components/patient/PatientBookAppointmentView';
import { PatientRecordsView } from './components/patient/PatientRecordsView';
import { PatientBillingView } from './components/patient/PatientBillingView';
import { JavaMentorView } from './components/common/JavaMentorView';

export const App: React.FC = () => {
  const { currentUser, currentRole, doctorTab, patientTab } = useClinic();

  // If user is not signed in, redirect directly to the Authentication & Intake Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <AuthPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Floating Pill Navigation Bar (Single navigation bar as requested) */}
      <Navbar />

      {/* Main Expansive Content Area (No sidebar, matching image.png clean layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 min-w-0">
        {/* If Java Mentor presentation mode is active */}
        {((currentRole === 'doctor' && doctorTab === 'java-mentor') ||
          (currentRole === 'patient' && patientTab === 'java-mentor')) && (
          <JavaMentorView />
        )}

        {currentRole === 'doctor' && doctorTab !== 'java-mentor' && (
          /* Doctor Portal Views - Exclusively for Dr. Smita Bevle */
          <>
            {doctorTab === 'dr-analytics' && <DoctorOverviewView />}
            {doctorTab === 'dr-schedule' && <DoctorScheduleView />}
            {doctorTab === 'dr-patients' && <DoctorPatientDatabaseView />}
            {doctorTab === 'dr-billing' && <DoctorBillingView />}
          </>
        )}

        {currentRole === 'patient' && patientTab !== 'java-mentor' && (
          /* Patient Portal Views - Patient only sees his/her own data */
          <>
            {patientTab === 'patient-dashboard' && <PatientDashboardView />}
            {patientTab === 'patient-book' && <PatientBookAppointmentView />}
            {patientTab === 'patient-records' && <PatientRecordsView />}
            {patientTab === 'patient-billing' && <PatientBillingView />}
          </>
        )}
      </main>

      {/* Modals & Overlays */}
      <NotificationsDrawer />
      <PrintInvoiceModal />
      <PrintPrescriptionModal />
      <NewAppointmentModal />
      <ToastContainer />
    </div>
  );
};

export default App;
