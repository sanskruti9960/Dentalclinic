import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientTabId, DoctorTabId } from '../../types/clinic';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  FileText,
  Users,
  Activity,
  Receipt,
  LogOut,
  User,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    currentUser,
    logout,
    currentRole,
    patientTab,
    setPatientTab,
    doctorTab,
    setDoctorTab,
    patients,
    appointments,
    invoices,
    prescriptions,
    selectedPatient
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');

  // Filter invoices for current patient strictly
  const myInvoices = selectedPatient
    ? invoices.filter((i) => i.patientId === selectedPatient.id)
    : [];
  const myUnpaidInvoices = myInvoices.filter((i) => i.status !== 'paid');

  // Patient Module Navigation Items
  const patientNavItems: {
    id: PatientTabId;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'patient-dashboard',
      label: 'My Dashboard',
      description: 'Care summary & quick reserve',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'patient-book',
      label: 'Book Appointment',
      description: 'Live schedule & open slots',
      icon: <Calendar className="w-5 h-5 shrink-0" />,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'patient-records',
      label: 'My Records & Rx',
      description: 'Digital treatment prescriptions',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: prescriptions.filter((r) => r.patientId === selectedPatient?.id).length || undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'patient-billing',
      label: 'My Bills & Invoices',
      description: 'Payments & online checkout',
      icon: <Receipt className="w-5 h-5 shrink-0" />,
      badge: myUnpaidInvoices.length > 0 ? `${myUnpaidInvoices.length} Due` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold'
    }
  ];

  // Doctor Module Navigation Items
  const doctorNavItems: {
    id: DoctorTabId;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dr-analytics',
      label: 'Practice Overview',
      description: 'Clinic KPIs & Operatory chairs',
      icon: <Activity className="w-5 h-5 shrink-0" />
    },
    {
      id: 'dr-schedule',
      label: 'Master Schedule',
      description: 'Daily schedule & chair status',
      icon: <CalendarDays className="w-5 h-5 shrink-0" />,
      badge: todayAppointments.length,
      badgeColor: 'bg-indigo-600 text-white font-bold'
    },
    {
      id: 'dr-patients',
      label: 'Patient Database',
      description: 'Full CRUD, charting & Rx',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: patients.length,
      badgeColor: 'bg-slate-200 text-slate-700'
    },
    {
      id: 'dr-billing',
      label: 'Billing & Invoices',
      description: 'Ledger, receipts & print bills',
      icon: <Receipt className="w-5 h-5 shrink-0" />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden no-print"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-20 left-0 h-[calc(100vh-5rem)] z-40 md:z-20 w-64 lg:w-72 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out no-print rounded-r-3xl my-2 shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Section */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1">
          {/* Active Mode Tag */}
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {currentRole === 'patient' ? 'Patient Portal' : 'Doctor Workstation'}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentRole === 'patient'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
              }`}
            >
              {currentRole === 'patient' ? 'Patient' : 'Dr. Smita Bevle'}
            </span>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1.5 pt-1">
            {currentRole === 'patient'
              ? patientNavItems.map((item) => {
                  const isActive = patientTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPatientTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left group ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}>
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs truncate">{item.label}</div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-indigo-100 font-normal' : 'text-slate-400'
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] shrink-0 font-mono ${
                            isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              : doctorNavItems.map((item) => {
                  const isActive = doctorTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDoctorTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left group ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}>
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs truncate">{item.label}</div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-indigo-100 font-normal' : 'text-slate-400'
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] shrink-0 font-mono ${
                            isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
          </div>

          {/* Quick Active Patient Box in Patient Role */}
          {currentRole === 'patient' && selectedPatient && (
            <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-150 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                  Your Account
                </span>
                <span className="font-mono text-[10px] text-indigo-900 font-bold bg-indigo-200/60 px-1.5 py-0.5 rounded">
                  {selectedPatient.patientIdCode}
                </span>
              </div>
              <div>
                <div className="font-black text-slate-900 text-xs">{selectedPatient.name}</div>
                <div className="text-[11px] text-slate-500">{selectedPatient.phone}</div>
                <div className="text-[10px] text-indigo-700 font-medium mt-0.5">Blood Group: {selectedPatient.bloodGroup}</div>
              </div>
            </div>
          )}

          {/* Dr. Smita Info Box in Doctor Role */}
          {currentRole === 'doctor' && (
            <div className="mt-4 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-150 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  DS
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Dr. Smita Bevle</div>
                  <div className="text-[10px] text-purple-900 font-semibold">Lead Dental Surgeon</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-purple-200/50">
                Operatory 1 & 2 • BDS, MDS (MMC D-48921)
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer: Sign Out Button */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/50 rounded-b-3xl">
          <div className="space-y-2 text-xs">
            <div className="text-[10px] text-slate-400 text-center">
              {currentRole === 'patient'
                ? 'Smita Dental Clinic • Patient Health Record'
                : 'Smita Dental Clinic • Administrative Control'}
            </div>
            <button
              onClick={logout}
              className="w-full py-2 px-3 rounded-full bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs border border-slate-200 hover:border-rose-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
