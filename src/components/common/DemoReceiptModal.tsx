import React from 'react';
import { DemoPaymentRecord } from '../../types/clinic';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DemoReceiptModalProps {
  record: DemoPaymentRecord;
  onClose: () => void;
}

export const DemoReceiptModal: React.FC<DemoReceiptModalProps> = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        
        {/* Top Action Bar (hidden on print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-100">
              Payment Receipt
            </span>
            <span className="text-xs font-mono text-slate-400">({record.demoReference})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close Receipt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 print:p-0">
          
          {/* Clinic Branding */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">SMITA DENTAL CLINIC</h2>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                Dr. Smita Bevle (BDS, MDS - Prosthodontics &amp; Implantology)
              </p>
              <p className="text-xs text-slate-500">Reg. No: MMC D-48921 • Operatories 1–3</p>
              <p className="text-xs text-slate-500">Bandra West, Mumbai - 400050 • Tel: +91 98200-SMITA</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                ✓ PAYMENT SETTLED
              </span>
              <div className="text-xs text-slate-500 mt-2 font-mono">
                Ref: <strong className="text-slate-900 font-bold">{record.demoReference}</strong>
              </div>
              <div className="text-xs text-slate-500">
                {new Date(record.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Patient (Billed To)
              </span>
              <span className="font-bold text-slate-900 text-sm block">{record.patientName}</span>
              <span className="text-slate-500 font-mono text-[11px]">ID: {record.patientId}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Invoice Details
              </span>
              <span className="font-mono font-bold text-slate-900 block">#{record.invoiceNumber}</span>
              <span className="text-slate-500 text-[11px]">Electronic Settlement</span>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Payment Method
              </span>
              <span className="font-semibold text-slate-800">{record.paymentMethod}</span>
            </div>

            <div className="text-right pt-2 border-t border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Remaining Balance
              </span>
              <span className="font-mono font-bold text-emerald-700">₹0.00 (Fully Paid)</span>
            </div>
          </div>

          {/* Amount Paid Highlight */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Amount Paid
              </span>
              <span className="text-xs text-slate-300">Invoice balance cleared</span>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
                ₹{record.amount.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">INR (Indian Rupees)</span>
            </div>
          </div>

          {/* Verification & Signatory */}
          <div className="border-t border-slate-200 pt-5 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official digital payment voucher • Smita Dental Clinic</span>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-slate-700 text-sm">Dr. Smita Bevle</div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Authorized Signatory</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
