import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, PaymentMethod } from '../../types/clinic';
import { PaymentGatewayModal } from '../common/PaymentGatewayModal';
import {
  DollarSign,
  Receipt,
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Lock,
  Wallet,
  ExternalLink
} from 'lucide-react';

export const PatientBillingView: React.FC = () => {
  const {
    selectedPatient,
    invoices,
    recordPayment,
    setActivePrintInvoice,
    setPatientTab
  } = useClinic();

  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);

  if (!selectedPatient) return null;

  // Invoices strictly belonging to this patient
  const myInvoices = invoices.filter((i) => i.patientId === selectedPatient.id);
  const totalBilled = myInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalPaid = myInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalDue = myInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  const handleOpenPay = (inv: Invoice) => {
    setActivePaymentInvoice(inv);
  };

  const handlePaymentSuccess = (
    paidAmount: number,
    method: PaymentMethod,
    transactionId: string,
    settledVia: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'cash'
  ) => {
    if (!activePaymentInvoice) return;

    recordPayment(
      activePaymentInvoice.id,
      paidAmount,
      method,
      `Online settlement via ${settledVia.toUpperCase()} (Patient Portal)`,
      transactionId,
      settledVia
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Back Navigation & Section Pill */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPatientTab('patient-dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-bold text-slate-500">
          Patient ID: <strong className="font-mono text-slate-800">{selectedPatient.patientIdCode}</strong>
        </span>
      </div>

      {/* Top Banner (Modern header styled matching image.png aesthetic) */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>FINANCIAL LEDGER & BILLING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Invoices &amp; Instant UPI Settlements
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Itemized treatment fee breakdowns with instant PhonePe, Google Pay, UPI QR, and card settlements connected live to Dr. Smita's clinic ledger.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            <span>PhonePe Gateway Active</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Google Pay Active</span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Soft Pastel Rounded Cards styled like the treatment cards in image.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Soft Lavender Card */}
        <div className="bg-[#ede9fe]/70 border border-[#ddd6fe] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Total Treatment Cost
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100/90 text-indigo-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono tracking-tight">
            ${totalBilled.toFixed(2)}
          </div>
          <p className="text-[11px] text-indigo-800/80 font-medium">Cumulative clinical tariffs</p>
        </div>

        {/* Soft Mint/Emerald Card */}
        <div className="bg-[#e8f5e9]/70 border border-[#c8e6c9] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Total Settled
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
            ${totalPaid.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-800/80 font-medium">Verified by clinic ledger</p>
        </div>

        {/* Soft Rose/Amber Card */}
        <div className={`rounded-3xl p-6 shadow-2xs space-y-2 border ${
          totalDue > 0
            ? 'bg-[#ffebee]/70 border-[#ffcdd2]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              totalDue > 0 ? 'text-rose-900' : 'text-slate-600'
            }`}>
              Outstanding Due
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              totalDue > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${
            totalDue > 0 ? 'text-rose-950' : 'text-slate-900'
          }`}>
            ${totalDue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {totalDue > 0 ? 'Immediate online payment available below' : 'All accounts settled'}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-5">
        {myInvoices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
            <Receipt className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-bold text-sm text-slate-700">No Invoices on Record</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no billable invoices or outstanding dues with Smita Dental Clinic.
            </p>
          </div>
        ) : (
          myInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                      #{inv.invoiceNumber}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>

                    {/* Settled via PhonePe / GPay Badges */}
                    {inv.settledVia === 'phonepe' && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <span>🟣 Settled via PhonePe</span>
                        {inv.transactionId && <span className="font-mono font-normal">({inv.transactionId})</span>}
                      </span>
                    )}
                    {inv.settledVia === 'gpay' && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <span>🔵 Settled via Google Pay</span>
                        {inv.transactionId && <span className="font-mono font-normal">({inv.transactionId})</span>}
                      </span>
                    )}
                    {inv.settledVia === 'upi' && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span>🟢 Settled via UPI QR</span>
                        {inv.transactionId && <span className="font-mono font-normal">({inv.transactionId})</span>}
                      </span>
                    )}
                    {inv.settledVia === 'card' && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                        <span>💳 Settled via Card</span>
                        {inv.transactionId && <span className="font-mono font-normal">({inv.transactionId})</span>}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5">
                    Invoice Date: <strong className="text-slate-800">{inv.date}</strong> • Due Date:{' '}
                    <strong className="text-slate-800">{inv.dueDate}</strong>
                    {inv.settledAt && (
                      <span className="ml-2 text-emerald-700 font-medium">
                        • Settled on: {new Date(inv.settledAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {inv.balanceDue > 0 && (
                    <button
                      onClick={() => handleOpenPay(inv)}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-500/25"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay via PhonePe / GPay (${inv.balanceDue.toFixed(2)})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActivePrintInvoice(inv)}
                    className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Print Bill PDF</span>
                  </button>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs bg-slate-50/20">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-xs">
                    <tr>
                      <th className="py-2.5 px-4">Procedure Description</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Standard Tariff</th>
                      <th className="py-2.5 px-4 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {inv.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-3 px-4 font-semibold text-slate-900">{it.description}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{it.quantity}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">${it.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ${it.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">${inv.subtotal.toFixed(2)}</span>
                  </div>
                  {inv.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Clinic Discount:</span>
                      <span className="font-mono">-${inv.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-mono">${inv.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Paid to Date:</span>
                    <span className="font-mono">${inv.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-rose-700 border-t border-slate-200 pt-1.5 text-sm">
                    <span>Outstanding Due:</span>
                    <span className="font-mono">${inv.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Online PhonePe / Google Pay / Dynamic UPI Gateway Modal */}
      {activePaymentInvoice && (
        <PaymentGatewayModal
          invoice={activePaymentInvoice}
          onClose={() => setActivePaymentInvoice(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
