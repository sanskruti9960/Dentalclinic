import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, DemoPaymentRecord } from '../../types/clinic';
import { DemoPaymentGatewayModal } from '../common/DemoPaymentGatewayModal';
import { DemoReceiptModal } from '../common/DemoReceiptModal';
import {
  Receipt,
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Wallet,
  ShieldCheck,
  History
} from 'lucide-react';

export const PatientBillingView: React.FC = () => {
  const {
    selectedPatient,
    invoices,
    demoTransactions,
    recordDemoPayment,
    setActivePrintInvoice,
    setPatientTab
  } = useClinic();

  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [activeReceiptRecord, setActiveReceiptRecord] = useState<DemoPaymentRecord | null>(null);

  if (!selectedPatient) return null;

  // Invoices strictly belonging to this patient (authorization boundary)
  const myInvoices = invoices.filter((i) => i.patientId === selectedPatient.id);
  const totalBilled = myInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalPaid = myInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalDue = myInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  // Transactions strictly belonging to this patient
  const myTransactions = demoTransactions.filter((d) => d.patientId === selectedPatient.id);

  const handleOpenPay = (inv: Invoice) => {
    setActivePaymentInvoice(inv);
  };

  const handlePaymentCompleted = (record: DemoPaymentRecord) => {
    recordDemoPayment(record);
  };

  const handleOpenReceiptFromInvoice = (inv: Invoice) => {
    const matchedRecord = myTransactions.find(
      (d) => d.invoiceId === inv.id && (d.status === 'Successful' || (d.status as any) === 'Demo Successful')
    );

    if (matchedRecord) {
      setActiveReceiptRecord(matchedRecord);
    } else {
      setActiveReceiptRecord({
        id: 'rec-' + inv.id,
        demoReference: inv.demoPaymentReference || inv.transactionId || `TXN-2026-${inv.invoiceNumber.slice(-4)}`,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        patientId: inv.patientId,
        patientName: inv.patientName,
        amount: inv.amountPaid || inv.grandTotal,
        currency: 'INR',
        timestamp: inv.demoPaidAt || inv.settledAt || new Date().toISOString(),
        paymentMethod: inv.demoPaymentMethod || 'UPI',
        status: 'Successful',
        scenarioTested: 'success',
        isDemo: true
      });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Top Back Navigation & Identification */}
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

      {/* Header Banner */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>FINANCIAL LEDGER &amp; PAYMENTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Invoices &amp; Online Payment Gateway
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Review itemized treatment tariffs and make instant online settlements via UPI, QR code, debit/credit cards, and net banking.
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="block leading-none">SECURE PAYMENTS</span>
            <span className="text-[10px] font-normal text-emerald-700">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards (INR Currency) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Invoiced */}
        <div className="bg-[#ede9fe]/70 border border-[#ddd6fe] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100/90 text-indigo-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono tracking-tight">
            ₹{totalBilled.toFixed(2)}
          </div>
          <p className="text-[11px] text-indigo-800/80 font-medium">Billed across procedures</p>
        </div>

        {/* Total Settled */}
        <div className="bg-[#e8f5e9]/70 border border-[#c8e6c9] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Settled Amount
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
            ₹{totalPaid.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-800/80 font-medium">Recorded in clinic ledger</p>
        </div>

        {/* Outstanding Due */}
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
            ₹{totalDue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {totalDue > 0 ? 'Click "Pay Now" on any due invoice below' : 'All accounts settled'}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>My Invoices ({myInvoices.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">All amounts in Indian Rupees (₹)</span>
        </div>

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
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                      #{inv.invoiceNumber}
                    </span>

                    {/* Status Badge */}
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

                    {/* Transaction Reference Badge */}
                    {(inv.isDemoPaid || inv.demoPaymentReference || inv.transactionId) && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                        <span>✓ Settled Online</span>
                        <span className="font-mono font-normal">({inv.demoPaymentReference || inv.transactionId})</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mt-1.5">
                    Invoice Date: <strong className="text-slate-800">{inv.date}</strong> • Due Date:{' '}
                    <strong className="text-slate-800">{inv.dueDate}</strong>
                    {(inv.demoPaidAt || inv.settledAt) && (
                      <span className="ml-2 text-indigo-700 font-medium">
                        • Settled: {new Date(inv.demoPaidAt || inv.settledAt!).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {inv.balanceDue > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleOpenPay(inv)}
                      className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now (₹{inv.balanceDue.toFixed(2)})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenReceiptFromInvoice(inv)}
                      className="px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Receipt</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActivePrintInvoice(inv)}
                    className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Print Bill PDF</span>
                  </button>
                </div>
              </div>

              {/* Items Table */}
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
                        <td className="py-3 px-4 text-right font-mono text-slate-600">₹{it.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ₹{it.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end text-xs">
                <div className="w-72 space-y-1.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{inv.subtotal.toFixed(2)}</span>
                  </div>
                  {inv.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Clinic Discount:</span>
                      <span className="font-mono">-₹{inv.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{inv.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Paid to Date:</span>
                    <span className="font-mono">₹{inv.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-rose-700 border-t border-slate-200 pt-1.5 text-sm">
                    <span>Outstanding Due:</span>
                    <span className="font-mono">₹{inv.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECTION: Payment History & Digital Receipts */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-sm text-slate-900">
              Payment History &amp; Receipts
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Verified settlements for your patient profile
          </span>
        </div>

        {myTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No payments recorded yet. Click "Pay Now" on any invoice above to settle dues online.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Transaction Reference</th>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {tx.demoReference}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      #{tx.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'Successful'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'Failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {tx.status === 'Successful' ? (
                        <button
                          type="button"
                          onClick={() => setActiveReceiptRecord(tx)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] transition cursor-pointer"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Online Checkout Modal */}
      {activePaymentInvoice && (
        <DemoPaymentGatewayModal
          invoice={activePaymentInvoice}
          patientId={selectedPatient.id}
          onClose={() => setActivePaymentInvoice(null)}
          onPaymentComplete={handlePaymentCompleted}
          onViewReceipt={(rec) => {
            setActivePaymentInvoice(null);
            setActiveReceiptRecord(rec);
          }}
        />
      )}

      {/* Printable Receipt Modal */}
      {activeReceiptRecord && (
        <DemoReceiptModal
          record={activeReceiptRecord}
          onClose={() => setActiveReceiptRecord(null)}
        />
      )}

    </div>
  );
};
