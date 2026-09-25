import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Calendar,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Stethoscope,
  Receipt,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const DoctorPracticeOverviewView: React.FC = () => {
  const {
    patients,
    appointments,
    invoices,
    setDoctorTab,
    setSelectedPatientId,
    setIsNewAppointmentModalOpen,
    setIsNewPatientModalOpen,
    setIsNewInvoiceModalOpen
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const totalPatients = patients.length;
  const todayAppointmentsCount = todayAppointments.length;
  const inChairCount = todayAppointments.filter((a) => a.status === 'in-chair').length;
  const checkedInCount = todayAppointments.filter((a) => a.status === 'checked-in').length;
  const completedTodayCount = todayAppointments.filter((a) => a.status === 'completed').length;

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.balanceDue, 0);

  const todayRevenue = invoices
    .filter((inv) => inv.date === todayStr)
    .reduce((sum, inv) => sum + inv.amountPaid, 0);

  const chairs = [
    {
      id: 1,
      name: 'Operatory 1 (Surgical)',
      doctor: 'Dr. Smita Bevle (BDS, MDS)',
      specialty: 'Oral Implants & Prosthodontics',
      activeAppointment: todayAppointments.find((a) => a.chair === 1 && a.status === 'in-chair')
    },
    {
      id: 2,
      name: 'Operatory 2 (Restorative)',
      doctor: 'Dr. Smita Bevle (BDS, MDS)',
      specialty: 'Single-Visit Endodontics',
      activeAppointment: todayAppointments.find((a) => a.chair === 2 && a.status === 'in-chair')
    },
    {
      id: 3,
      name: 'Operatory 3 (Hygiene)',
      doctor: 'Dr. Smita Bevle (BDS, MDS)',
      specialty: 'Ultrasonic Scaling & Whitening',
      activeAppointment: todayAppointments.find((a) => a.chair === 3 && a.status === 'in-chair')
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Clinic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Visits</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{todayAppointmentsCount}</div>
            <div className="text-[11px] text-teal-700 font-semibold mt-0.5">
              {inChairCount} in chair • {checkedInCount} waiting
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Patients</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalPatients}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Registered in database</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Bills</span>
            <div className="text-2xl font-black text-rose-600 mt-1">${totalOutstanding.toFixed(0)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Pending collection</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Today</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{completedTodayCount}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Discharged patients</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operatory Chairs Live Status */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Operatory Chairs Occupancy Status
          </h3>
          <button
            onClick={() => setDoctorTab('dr-schedule')}
            className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Master Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chairs.map((chair) => (
            <div
              key={chair.id}
              className={`p-4 rounded-2xl border transition ${
                chair.activeAppointment
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{chair.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    chair.activeAppointment
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {chair.activeAppointment ? 'In Chair' : 'Available'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{chair.doctor}</div>
              {chair.activeAppointment ? (
                <div className="mt-3 p-2.5 bg-white rounded-xl border border-emerald-200 text-xs">
                  <div className="font-bold text-slate-900">{chair.activeAppointment.patientName}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{chair.activeAppointment.procedure}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{chair.activeAppointment.time}</div>
                </div>
              ) : (
                <div className="mt-3 py-2 text-center text-xs text-slate-400">
                  Operatory sterilized and ready
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
