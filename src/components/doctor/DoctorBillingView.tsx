import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, PaymentMethod, DemoPaymentRecord, DemoPaymentStatus } from '../../types/clinic';
import { DENTAL_TARIFF_ITEMS } from '../../data/mockData';
import { DemoReceiptModal } from '../common/DemoReceiptModal';
import {
  DollarSign,
  Receipt,
  Plus,
  Trash2,
  Printer,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Wallet
} from 'lucide-react';

export const DoctorBillingView: React.FC = () => {
  const {
    invoices,
    patients,
    demoTransactions,
    addInvoice,
    deleteInvoice,
    recordPayment,
    setActivePrintInvoice,
    setSelectedPatientId,
    setDoctorTab
  } = useClinic();

  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [activeReceiptRecord, setActiveReceiptRecord] = useState<DemoPaymentRecord | null>(null);

  // Counter Payment Recording Modal State
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cash');
  const [payNotes, setPayNotes] = useState('');

  // New Invoice Modal State
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoicePatientId, setInvoicePatientId] = useState(patients[0]?.id || '');
  const [selectedItems, setSelectedItems] = useState<{ description: string; unitPrice: number; quantity: number }[]>([
    { description: DENTAL_TARIFF_ITEMS[0].description, unitPrice: DENTAL_TARIFF_ITEMS[0].price, quantity: 1 }
  ]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'unpaid'
        ? inv.status !== 'paid'
        : inv.status === 'paid';
    const matchesSearch =
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientPhone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const handleOpenPayment = (inv: Invoice) => {
    setActivePaymentInvoice(inv);
    setPayAmount(inv.balanceDue);
    setPayMethod('cash');
    setPayNotes('');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentInvoice || payAmount <= 0) return;
    recordPayment(activePaymentInvoice.id, payAmount, payMethod, payNotes);
    setActivePaymentInvoice(null);
  };

  const handleAddItemToNewInvoice = () => {
    setSelectedItems((prev) => [
      ...prev,
      { description: DENTAL_TARIFF_ITEMS[1].description, unitPrice: DENTAL_TARIFF_ITEMS[1].price, quantity: 1 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === invoicePatientId);
    if (!patient || selectedItems.length === 0) return;

    const subtotal = selectedItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const grandTotal = Math.max(0, subtotal - discountAmount);

    const newInv = addInvoice({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: selectedItems.map((it, idx) => ({
        id: 'item-' + Date.now() + idx,
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.unitPrice * it.quantity
      })),
      subtotal,
      discount: discountAmount,
      tax: 0,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      status: 'unpaid'
    });

    setIsCreateInvoiceOpen(false);
    setActivePrintInvoice(newInv);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CLINIC FINANCIAL REVENUE &amp; LEDGER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tariff Invoicing &amp; Payment Gateway Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Real-time balance tracking, surgical procedure billing, and synchronized electronic payment gateway transaction logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateInvoiceOpen(true)}
          className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* KPI Cards (All in INR Currency) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Invoiced */}
        <div className="bg-[#ede9fe]/70 border border-[#ddd6fe] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Total Invoiced Revenue
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono tracking-tight">
            ₹{totalBilled.toFixed(2)}
          </div>
          <p className="text-[11px] text-indigo-800/80 font-medium">Billed across surgical cases</p>
        </div>

        {/* Collected Revenue */}
        <div className="bg-[#e8f5e9]/70 border border-[#c8e6c9] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Collected Revenue
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
            ₹{totalCollected.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-800/80 font-medium">Verified in clinic ledger</p>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-[#ffebee]/70 border border-[#ffcdd2] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-950 font-mono tracking-tight">
            ₹{totalOutstanding.toFixed(2)}
          </div>
          <p className="text-[11px] text-rose-800/80 font-medium">Receivables pending</p>
        </div>
      </div>

      {/* Main Clinic Invoices Master Table */}
      <div className="space-y-4">
        {/* Search & Filter Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search master invoice number, patient name, phone..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-bold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setFilterStatus('unpaid')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                filterStatus === 'unpaid' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unpaid / Partial
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                filterStatus === 'paid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paid in Full
            </button>
          </div>
        </div>

        {/* Master Invoices Table */}
        <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-5">Patient Name</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Procedures</th>
                  <th className="py-3.5 px-5 text-right">Total</th>
                  <th className="py-3.5 px-5 text-right">Paid</th>
                  <th className="py-3.5 px-5 text-right">Balance Due</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      No matching invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-indigo-900">
                        #{inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => {
                            setSelectedPatientId(inv.patientId);
                            setDoctorTab('dr-patients');
                          }}
                          className="font-bold text-slate-900 hover:text-indigo-600 hover:underline cursor-pointer"
                        >
                          {inv.patientName}
                        </button>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{inv.patientPhone}</div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 font-mono">{inv.date}</td>
                      <td className="py-3.5 px-5 max-w-[200px] truncate text-slate-700 font-medium">
                        {inv.items.map((i) => i.description).join(', ')}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">
                        ₹{inv.grandTotal.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-semibold text-emerald-700">
                        ₹{inv.amountPaid.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-rose-700">
                        ₹{inv.balanceDue.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {inv.status}
                          </span>

                          {(inv.isDemoPaid || inv.demoPaymentReference || inv.transactionId) && (
                            <button
                              type="button"
                              onClick={() => {
                                const matched = demoTransactions.find(
                                  (t) => t.invoiceId === inv.id && t.status === 'Successful'
                                );
                                setActiveReceiptRecord(
                                  matched || {
                                    id: 'rec-' + inv.id,
                                    demoReference:
                                      inv.demoPaymentReference || inv.transactionId || `TXN-2026-${inv.invoiceNumber.slice(-4)}`,
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
                                  }
                                );
                              }}
                              className="text-[9px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200 transition cursor-pointer"
                              title="Click to view payment voucher"
                            >
                              Paid Online ({inv.demoPaymentReference || inv.transactionId})
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.balanceDue > 0 && (
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-bold transition cursor-pointer text-xs"
                              title="Counter Settlement (Cash/POS)"
                            >
                              Counter ₹
                            </button>
                          )}
                          <button
                            onClick={() => setActivePrintInvoice(inv)}
                            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="Print / View Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete invoice #${inv.invoiceNumber}?`)) {
                                deleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Counter Payment Modal */}
      {activePaymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-4 text-xs border border-slate-100">
            <h3 className="font-black text-lg text-slate-900">Record Counter Settlement</h3>
            <p className="text-slate-500">
              Receiving payment for Invoice #{activePaymentInvoice.invoiceNumber} from{' '}
              <strong>{activePaymentInvoice.patientName}</strong>.
            </p>

            <form onSubmit={handleProcessPayment} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount to Collect (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min={1}
                  max={activePaymentInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-base font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-medium focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="cash">Counter Cash</option>
                  <option value="credit-card">POS Card Machine</option>
                  <option value="debit-card">Debit Card POS</option>
                  <option value="upi">Clinic QR Code Standee</option>
                  <option value="bank-transfer">Direct NEFT/IMPS Bank Transfer</option>
                  <option value="insurance">Dental Insurance TPA</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Receipt Note (Optional)</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Cash counter receipt #8912"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActivePaymentInvoice(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {isCreateInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 text-xs my-8 border border-slate-100">
            <h3 className="font-black text-lg text-slate-900">Create Clinical Tax Invoice</h3>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={invoicePatientId}
                  onChange={(e) => setInvoicePatientId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900 cursor-pointer"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientIdCode}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Treatment Tariff Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItemToNewInvoice}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Item
                  </button>
                </div>

                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const next = [...selectedItems];
                        next[idx].description = e.target.value;
                        setSelectedItems(next);
                      }}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                      placeholder="Procedure description"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const next = [...selectedItems];
                        next[idx].unitPrice = Number(e.target.value);
                        setSelectedItems(next);
                      }}
                      className="w-24 p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-right"
                      placeholder="₹ Price"
                    />
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic Concession Discount (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal Viewer */}
      {activeReceiptRecord && (
        <DemoReceiptModal
          record={activeReceiptRecord}
          onClose={() => setActiveReceiptRecord(null)}
        />
      )}

    </div>
  );
};
