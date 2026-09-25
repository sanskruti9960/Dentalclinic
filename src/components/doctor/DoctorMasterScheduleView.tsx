import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, AppointmentStatus } from '../../types/clinic';
import {
  CalendarDays,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Stethoscope,
  Send,
  Mail,
  PhoneCall,
  Trash2
} from 'lucide-react';

export const DoctorMasterScheduleView: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    deleteAppointment,
    setIsNewAppointmentModalOpen,
    setSelectedPatientId,
    setDoctorTab,
    setIsNotificationDrawerOpen,
    notifications
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<'operatory' | 'list'>('operatory');
  const [chairFilter, setChairFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Reschedule Modal State
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>(todayStr);
  const [newTime, setNewTime] = useState<string>('02:30 PM');
  const [rescheduleReason, setRescheduleReason] = useState<string>('Clinical procedure adjustment by Dr. Smita Bevle');

  // Cancel Modal State
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Doctor emergency surgery / schedule update');

  // Filter appointments for the selected date
  const dateAppointments = appointments.filter((a) => {
    if (a.date !== selectedDate) return false;
    if (chairFilter !== 'all' && a.chair !== chairFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleExecuteReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt) return;

    // Reschedule appointment and triggers simulated SMS & Email notifications back to patient
    rescheduleAppointment(rescheduleModalApt.id, newDate, newTime, rescheduleReason);
    setRescheduleModalApt(null);
  };

  const handleExecuteCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt) return;

    // Cancels appointment and triggers simulated SMS & Email notifications back to patient
    updateAppointmentStatus(cancelModalApt.id, 'cancelled', cancelReason);
    setCancelModalApt(null);
  };

  const OPERATORY_CHAIRS = [
    { id: 1, name: 'Operatory 1 - Surgical & Implant Suite', doctor: 'Dr. Smita Bevle', spec: 'Prosthodontics & Oral Implants' },
    { id: 2, name: 'Operatory 2 - Restorative & Endodontics', doctor: 'Dr. Smita Bevle', spec: 'Single-Visit Rotary RCT' },
    { id: 3, name: 'Operatory 3 - Consultation & Hygiene', doctor: 'Dr. Smita Bevle', spec: 'Ultrasonic Scaling & Whitening' }
  ];

  const STATUS_STYLES: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
    'scheduled': { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-800', label: 'Scheduled' },
    'checked-in': { bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', label: 'Checked In (Lobby)' },
    'in-chair': { bg: 'bg-emerald-50 border-emerald-400 font-bold', text: 'text-emerald-900', label: 'In Operatory Chair' },
    'completed': { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', label: 'Completed' },
    'rescheduled': { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', label: 'Rescheduled' },
    'cancelled': { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', label: 'Cancelled' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with real-time indicators and notification feed trigger */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Master Schedule & Live Appointments
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sole Dental Surgeon: <strong className="text-slate-800">Dr. Smita Bevle</strong> (BDS, MDS). Modifying appointments dispatches simulated SMS notices to patients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Notification Dispatch Log Button */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>SMS Feed ({notifications.length})</span>
          </button>

          {/* Book New In-Clinic Appointment Button */}
          <button
            onClick={() => setIsNewAppointmentModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Date Switcher & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedDate === todayStr
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={chairFilter}
            onChange={(e) => setChairFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Operatories</option>
            <option value="1">Operatory 1 (Surgical)</option>
            <option value="2">Operatory 2 (Restorative)</option>
            <option value="3">Operatory 3 (Consultation)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="checked-in">Checked In</option>
            <option value="in-chair">In-Chair</option>
            <option value="completed">Completed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('operatory')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'operatory' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Chairs View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'list' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              List View ({dateAppointments.length})
            </button>
          </div>
        </div>
      </div>

      {/* Operatory Chairs Layout (Responsive CSS Grid: 3 columns on desktop, 1 column on phone) */}
      {viewMode === 'operatory' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {OPERATORY_CHAIRS.map((chair) => {
            const chairAppointments = dateAppointments.filter((a) => a.chair === chair.id);
            const inChairApt = chairAppointments.find((a) => a.status === 'in-chair');

            return (
              <div
                key={chair.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col"
              >
                {/* Chair Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200/90 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{chair.name}</h4>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{chair.doctor} • {chair.spec}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {chairAppointments.length} Bookings
                  </span>
                </div>

                {/* In Chair Status Banner */}
                {inChairApt && (
                  <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Active In-Chair: {inChairApt.patientName}
                    </span>
                    <button
                      onClick={() => updateAppointmentStatus(inChairApt.id, 'completed')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition"
                    >
                      Finish Treatment
                    </button>
                  </div>
                )}

                {/* Appointments list in chair */}
                <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[500px]">
                  {chairAppointments.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                      <p className="text-xs font-semibold text-slate-500">No appointments for this operatory</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Slots are available for booking</p>
                    </div>
                  ) : (
                    chairAppointments.map((apt) => {
                      const style = STATUS_STYLES[apt.status];
                      return (
                        <div
                          key={apt.id}
                          className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-300 transition space-y-2 text-xs shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-teal-600" />
                              {apt.time}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border ${style.bg} ${style.text}`}>
                              {style.label}
                            </span>
                          </div>

                          <div>
                            <div
                              onClick={() => {
                                setSelectedPatientId(apt.patientId);
                                setDoctorTab('dr-patients');
                              }}
                              className="font-bold text-teal-800 hover:underline cursor-pointer text-xs"
                              title="Open Patient Dental Database Record"
                            >
                              {apt.patientName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{apt.patientPhone}</span>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 font-medium">
                            Procedure: <strong className="text-slate-900">{apt.procedure}</strong>
                            {apt.notes && <div className="text-slate-500 mt-0.5 text-[10px] italic">"{apt.notes}"</div>}
                          </div>

                          {/* Quick Workflow Controls for Doctor */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                            <div className="flex items-center gap-1">
                              {apt.status === 'scheduled' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'checked-in')}
                                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[10px] transition cursor-pointer"
                                >
                                  Check In
                                </button>
                              )}
                              {(apt.status === 'checked-in' || apt.status === 'scheduled') && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'in-chair')}
                                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] transition cursor-pointer"
                                >
                                  Seat In Chair
                                </button>
                              )}
                              {apt.status === 'in-chair' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                  className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] transition cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                            </div>

                            {/* Reschedule & Cancel & Delete Controls (CRUD) */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setRescheduleModalApt(apt);
                                  setNewDate(apt.date);
                                  setNewTime(apt.time);
                                }}
                                title="Reschedule & Dispatch SMS to Patient"
                                className="p-1 rounded-lg border border-slate-200 hover:bg-purple-50 hover:text-purple-700 text-slate-500 text-[10px] transition cursor-pointer"
                              >
                                Reschedule
                              </button>
                              {apt.status !== 'cancelled' && (
                                <button
                                  onClick={() => setCancelModalApt(apt)}
                                  title="Cancel & Dispatch SMS to Patient"
                                  className="p-1 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-500 text-[10px] transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Delete appointment for ${apt.patientName}?`)) {
                                    deleteAppointment(apt.id);
                                  }
                                }}
                                title="Delete appointment (CRUD)"
                                className="p-1 rounded-lg border border-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-400 text-[10px] transition cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-rose-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {dateAppointments.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">No appointments scheduled for {selectedDate}</p>
              </div>
            ) : (
              dateAppointments.map((apt) => {
                const style = STATUS_STYLES[apt.status];
                return (
                  <div key={apt.id} className="p-4 sm:p-5 hover:bg-teal-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div className="w-16 font-mono font-bold text-slate-900">{apt.time}</div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{apt.patientName}</div>
                        <div className="text-slate-500 text-[11px]">{apt.procedure} • Chair #{apt.chair} (Dr. Smita Bevle)</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                      <button
                        onClick={() => {
                          setRescheduleModalApt(apt);
                          setNewDate(apt.date);
                          setNewTime(apt.time);
                        }}
                        className="px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px]"
                      >
                        Reschedule
                      </button>
                      {apt.status !== 'cancelled' && (
                        <button
                          onClick={() => setCancelModalApt(apt)}
                          className="px-2.5 py-1 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete appointment for ${apt.patientName}?`)) {
                            deleteAppointment(apt.id);
                          }
                        }}
                        className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-rose-600"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL (Triggers simulated SMS & Email to patient) */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">Reschedule Appointment</h3>
              </div>
              <button
                onClick={() => setRescheduleModalApt(null)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 space-y-1">
              <div className="font-bold">Patient: {rescheduleModalApt.patientName}</div>
              <div className="text-[11px]">Current Slot: {rescheduleModalApt.date} at {rescheduleModalApt.time}</div>
              <div className="text-[10px] text-purple-700 flex items-center gap-1 pt-1">
                <Send className="w-3 h-3" />
                <span>Submitting will automatically send simulated SMS & Email to patient</span>
              </div>
            </div>

            <form onSubmit={handleExecuteReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select New Date</label>
                <input
                  type="date"
                  value={newDate}
                  min={todayStr}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  {['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:30 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Rescheduling</label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Clinical schedule adjustment, patient request..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL (Triggers simulated SMS & Email to patient) */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Cancel Appointment</h3>
              </div>
              <button
                onClick={() => setCancelModalApt(null)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
              <div className="font-bold">Patient: {cancelModalApt.patientName} ({cancelModalApt.patientPhone})</div>
              <div className="text-[11px]">Slot: {cancelModalApt.date} at {cancelModalApt.time}</div>
              <div className="text-[10px] text-rose-700 flex items-center gap-1 pt-1">
                <Send className="w-3 h-3" />
                <span>A cancellation SMS & Email will be dispatched to the patient</span>
              </div>
            </div>

            <form onSubmit={handleExecuteCancel} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-rose-500 focus:outline-none"
                >
                  <option value="Doctor unavailable / Emergency surgery">Doctor unavailable / Emergency surgery</option>
                  <option value="Patient requested cancellation">Patient requested cancellation</option>
                  <option value="Equipment maintenance in Operatory">Equipment maintenance in Operatory</option>
                  <option value="Clinical contraindication / unwell">Clinical contraindication / unwell</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalApt(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Confirm Cancellation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
