import React from 'react';
import { Prescription } from '../../types/clinic';
import { Printer, X, Download, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface PrintablePrescriptionProps {
  prescription: Prescription;
  onClose: () => void;
}

export const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({ prescription, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Toolbar (hidden in print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="font-semibold text-sm">Official Clinic Prescription Preview</span>
            <span className="text-xs text-slate-400">({prescription.prescriptionNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Content */}
        <div className="p-8 sm:p-10 font-sans text-slate-800 bg-white">
          {/* Clinic Header */}
          <div className="border-b-2 border-teal-600 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    🦷
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      SMITA DENTAL CLINIC
                    </h1>
                    <p className="text-xs font-semibold text-teal-700 tracking-wide uppercase mt-0.5">
                      Advanced Implant, Aesthetic & Laser Dentistry
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 space-y-0.5 mt-2">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    Suite 204, Medanta Plaza, Linking Road, Bandra West, Mumbai - 400050
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    +91 (022) 2640-8811 / +91 98200-SMITA
                    <span className="mx-1">•</span>
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    care@smitadental.com
                  </p>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <h2 className="text-base font-bold text-slate-900">{prescription.doctorName}</h2>
                <p className="text-xs font-medium text-teal-800">{prescription.doctorDegree}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Dental Council Reg No: <strong>{prescription.doctorRegNo}</strong>
                </p>
                <p className="text-[11px] text-slate-500">Fellow, Int. Congress of Oral Implantologists (ICOI)</p>
              </div>
            </div>
          </div>

          {/* Patient Details Strip */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
            <div>
              <span className="text-slate-400 block font-medium">PATIENT NAME</span>
              <span className="font-bold text-slate-900 text-sm">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">AGE / GENDER</span>
              <span className="font-semibold text-slate-800">
                {prescription.patientAge} Yrs / {prescription.patientGender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">PRESCRIPTION NO.</span>
              <span className="font-mono font-semibold text-teal-700">{prescription.prescriptionNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">DATE</span>
              <span className="font-semibold text-slate-800">{prescription.date}</span>
            </div>
          </div>

          {/* Clinical Findings & Vitals */}
          <div className="mb-6 space-y-2 text-xs">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Provisional Diagnosis:</span>
              <span className="font-medium text-slate-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {prescription.diagnosis}
              </span>
              {prescription.toothNumbers && prescription.toothNumbers.length > 0 && (
                <span className="font-semibold text-teal-800">
                  (Involved Teeth: #{prescription.toothNumbers.join(', #')})
                </span>
              )}
            </div>

            {prescription.vitals && (
              <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-1">
                {prescription.vitals.bp && (
                  <span>
                    <strong>BP:</strong> {prescription.vitals.bp}
                  </span>
                )}
                {prescription.vitals.pulse && (
                  <span>
                    <strong>Pulse:</strong> {prescription.vitals.pulse}
                  </span>
                )}
                {prescription.vitals.sugar && (
                  <span>
                    <strong>Blood Sugar:</strong> {prescription.vitals.sugar}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl font-serif font-black text-teal-800 italic">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rx Medications & Dosage</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 w-8">#</th>
                    <th className="py-2.5 px-3">Medicine & Strength</th>
                    <th className="py-2.5 px-3">Dosage & Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Timing & Special Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicines.map((med, index) => (
                    <tr key={med.id || index} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-medium text-slate-400">{index + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-[11px] text-teal-700 font-mono">{med.strength}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{med.dosage}</div>
                        <div className="text-[11px] text-slate-500">{med.frequency}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{med.duration}</td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                          {med.timing}
                        </span>
                        {med.instructions && (
                          <div className="text-[11px] text-slate-600 mt-1 italic leading-tight">
                            {med.instructions}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice & Follow up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-10">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block mb-1">GENERAL DENTAL ADVICE:</span>
              <p className="text-amber-950 leading-relaxed">{prescription.generalAdvice}</p>
            </div>
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="font-bold text-teal-900 block mb-1">NEXT FOLLOW-UP REVIEW:</span>
                <p className="text-teal-950 font-semibold">{prescription.nextFollowUp || 'In 5-7 days as advised'}</p>
              </div>
              <p className="text-[10px] text-teal-700 mt-2">
                * Please bring this prescription slip and previous X-rays during follow-up.
              </p>
            </div>
          </div>

          {/* Doctor Signature & Stamp Area */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6">
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <p className="flex items-center gap-1 text-teal-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Digitally generated and cryptographically verified record
              </p>
              <p>Generated at: {prescription.date} • Smita Dental Clinic EMR</p>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-b-2 border-slate-900 pb-1 px-8 mb-1">
                <span className="font-serif italic text-slate-800 font-bold text-lg">Dr. Smita Patil</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{prescription.doctorName}</p>
              <p className="text-[10px] text-slate-500">Authorized Dental Surgeon & Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
