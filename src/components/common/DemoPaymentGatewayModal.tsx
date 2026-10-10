import React, { useState } from 'react';
import { Invoice, DemoPaymentMethod, DemoPaymentRecord } from '../../types/clinic';
import { demoPaymentService } from '../../services/demoPaymentService';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Smartphone,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface DemoPaymentGatewayModalProps {
  invoice: Invoice;
  patientId: string;
  onClose: () => void;
  onPaymentComplete: (record: DemoPaymentRecord) => void;
  onViewReceipt: (record: DemoPaymentRecord) => void;
}

export const DemoPaymentGatewayModal: React.FC<DemoPaymentGatewayModalProps> = ({
  invoice,
  patientId,
  onClose,
  onPaymentComplete,
  onViewReceipt
}) => {
  // Method selection
  const [selectedMethod, setSelectedMethod] = useState<DemoPaymentMethod>('UPI');

  // Input states
  const [upiVpa, setUpiVpa] = useState('patient@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [completedRecord, setCompletedRecord] = useState<DemoPaymentRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Locked payment amount: strictly full outstanding balance only
  const payableAmount = invoice.balanceDue;

  const handleCopyRef = (refText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refText);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleStartPayment = async () => {
    setErrorMessage(null);

    // Initial validation
    const validation = demoPaymentService.validateCheckout(invoice, patientId, payableAmount);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Payment cannot be initiated.');
      return;
    }

    setIsProcessing(true);
    setProcessingMessage('Connecting to secure banking network...');

    const timer1 = setTimeout(() => {
      setProcessingMessage(`Authorizing ${selectedMethod} payment of ₹${payableAmount.toFixed(2)}...`);
    }, 400);

    const timer2 = setTimeout(() => {
      setProcessingMessage('Verifying transaction token with NPCI switch...');
    }, 800);

    try {
      const response = await demoPaymentService.processPayment(
        {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          patientId: invoice.patientId,
          patientName: invoice.patientName,
          amount: payableAmount,
          paymentMethod: selectedMethod,
          scenario: 'success'
        },
        invoice
      );

      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);

      setCompletedRecord(response.record);
      onPaymentComplete(response.record);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);
      setErrorMessage(err.message || 'An unexpected error occurred during processing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
              SD
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-tight">Smita Dental Clinic</h2>
              <p className="text-[11px] text-slate-400">Secure Payment Checkout • Invoice #{invoice.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-[11px] font-bold tracking-wide">
              <Lock className="w-3 h-3" />
              <span>256-Bit SSL Secured</span>
            </span>

            {!isProcessing && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close checkout"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          
          {/* If Transaction is already completed (Outcome Screen) */}
          {completedRecord ? (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                    ✓ Payment Completed Successfully
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    ₹{completedRecord.amount.toFixed(2)} Paid in Full
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Invoice #{invoice.invoiceNumber} has been settled and ledger updated.
                  </p>
                </div>

                {/* Reference Display */}
                <div className="bg-white rounded-2xl border border-emerald-200 p-4 max-w-md mx-auto text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">Transaction Reference:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                      <span>{completedRecord.demoReference}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyRef(completedRecord.demoReference)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition"
                        title="Copy reference"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Payment Method:</span>
                    <span className="font-semibold text-slate-800">{completedRecord.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Date &amp; Time:</span>
                    <span className="text-slate-600">{new Date(completedRecord.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Balance Due:</span>
                    <span className="font-mono font-bold text-emerald-700">₹0.00 (Fully Paid)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onViewReceipt(completedRecord)}
                    className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Payment Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE CHECKOUT FORM */
            <div className="space-y-6">
              
              {/* Error Alert if any */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Payment Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* SECTION A: Invoice & Patient Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Patient Details
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{invoice.patientName}</span>
                    <span className="text-slate-500 font-mono text-[11px] block">{invoice.patientPhone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Invoice Reference
                    </span>
                    <span className="font-mono font-bold text-indigo-900 text-xs">#{invoice.invoiceNumber}</span>
                    <span className="text-slate-500 text-[11px] block">Date: {invoice.date}</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Total Billed</span>
                    <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                      ₹{invoice.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Already Paid</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs sm:text-sm">
                      ₹{invoice.amountPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200">
                    <span className="text-[10px] text-indigo-700 block font-bold">Outstanding Balance</span>
                    <span className="font-mono font-black text-indigo-950 text-xs sm:text-sm">
                      ₹{payableAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION B: Payment Method Selection */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Select Payment Method
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'UPI'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI ID</span>
                  </button>

                  {/* QR Code */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('QR Code')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'QR Code'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR</span>
                  </button>

                  {/* Cards */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Debit/Credit Card')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'Debit/Credit Card'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  {/* Net Banking */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Net Banking')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'Net Banking'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Sub-form based on selected method */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  {selectedMethod === 'UPI' && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Virtual Payment Address (VPA / UPI ID)
                      </label>
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Instant payment via Google Pay, PhonePe, Paytm, or BHIM UPI.
                      </span>
                    </div>
                  )}

                  {selectedMethod === 'QR Code' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
                      <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                        <QrCode className="w-20 h-20 text-slate-800" />
                        <span className="text-[8px] font-bold text-slate-500 font-mono">BHIM UPI QR</span>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="font-bold text-slate-800 block text-xs">Scan using any UPI App</span>
                        <p className="text-[11px] text-slate-500">
                          Pre-configured for Smita Dental Clinic payment of ₹{payableAmount.toFixed(2)}.
                        </p>
                        <span className="inline-block text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          VPA: smitadental@icici • Ref: #{invoice.invoiceNumber}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'Debit/Credit Card' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 4242"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-center font-mono text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">CVV</label>
                          <input
                            type="password"
                            defaultValue="842"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-center font-mono text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Protected by 256-bit SSL encryption.</span>
                      </span>
                    </div>
                  )}

                  {selectedMethod === 'Net Banking' && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Select Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                      </select>
                      <span className="text-[10px] text-slate-500 block">
                        Direct authorization via your online banking portal.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Loader */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-2 animate-pulse">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <span className="font-bold text-indigo-950 block text-xs">{processingMessage}</span>
                  <span className="text-[10px] text-indigo-700">Securing payment with bank gateway switch...</span>
                </div>
              )}

              {/* Bottom Action Section */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Payable Amount</span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    ₹{payableAmount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Outstanding invoice balance</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing || payableAmount <= 0}
                    onClick={handleStartPayment}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <span>Pay ₹{payableAmount.toFixed(2)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
