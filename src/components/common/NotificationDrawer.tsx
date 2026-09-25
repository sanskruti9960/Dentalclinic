import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  MessageSquare,
  Mail,
  X,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    clearNotifications
  } = useClinic();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Simulated Outbound Feeds</h3>
              <p className="text-[11px] text-teal-100">Live SMS & Email Dispatch Log</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                title="Clear notification log"
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/15 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live status bar */}
        <div className="px-4 py-2 bg-teal-50 border-b border-teal-100 flex items-center justify-between text-xs">
          <span className="text-teal-800 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Automated Patient Communication Engine Active
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-200/60 text-teal-900 font-bold font-mono">
            {notifications.length} Messages
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No outbound notifications yet</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                When Dr. Smita reschedules or cancels appointments, or writes prescriptions, automated SMS & Email alerts will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isSms = notif.type === 'sms';
              return (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        isSms
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {isSms ? <PhoneCall className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                      <span>{isSms ? 'SMS Gateway' : 'Email SMTP'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.timestamp}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{notif.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      To: {notif.recipientName} ({notif.recipientContact})
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed font-sans text-[11px]">
                    "{notif.message}"
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-700">
                    <span className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Delivered to handset/inbox
                    </span>
                    <span className="text-slate-400">Carrier: Jio/Airtel</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Simulating Twilio / SendGrid live telecom webhook sync
        </div>
      </div>
    </div>
  );
};
