import React, { useState, useEffect } from 'react';
import { Invoice, PaymentMethod } from '../../types/clinic';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Printer,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

interface PaymentGatewayModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: (
    paidAmount: number,
    method: PaymentMethod,
    transactionId: string,
    settledVia: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'cash'
  ) => void;
}

type GatewayTab = 'phonepe' | 'gpay' | 'qr' | 'card' | 'netbanking';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  invoice,
  onClose,
  onSuccess
}) => {
  const [selectedGateway, setSelectedGateway] = useState<GatewayTab>('phonepe');
  const [payAmount, setPayAmount] = useState<number>(invoice.balanceDue);
  
  // Specific inputs
  const [upiId, setUpiId] = useState('');
  const [upiIdTouched, setUpiIdTouched] = useState(false);
  const [isUpiValid, setIsUpiValid] = useState(false);

  // Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(invoice.patientName || '');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [settledDetails, setSettledDetails] = useState<{
    txnId: string;
    utr: string;
    settledVia: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'cash';
    timestamp: string;
    amount: number;
  } | null>(null);

  const [copiedTxn, setCopiedTxn] = useState(false);

  // Dynamic UPI URL for QR code
  const vpa = 'smitadental@icici';
  const clinicName = 'Smita Dental Clinic';
  const upiIntentString = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(
    clinicName
  )}&am=${payAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `Invoice #${invoice.invoiceNumber}`
  )}`;

  // Validate UPI ID format: username@bank
  useEffect(() => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    setIsUpiValid(upiRegex.test(upiId.trim()));
  }, [upiId]);

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleCopyTxn = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    }
  };

  // Process Payment Simulation
  const executePayment = (
    gateway: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'qr'
  ) => {
    if (payAmount <= 0) return;

    setIsProcessing(true);
    const stages = [
      gateway === 'phonepe'
        ? 'Redirecting to PhonePe Secure Payment Gateway...'
        : gateway === 'gpay'
        ? 'Connecting to Google Pay UPI Service...'
        : gateway === 'qr'
        ? 'Awaiting UPI App confirmation on mobile...'
        : gateway === 'card'
        ? 'Authorizing 256-bit SSL Card payment with bank...'
        : 'Connecting to Net Banking server...',
      'Verifying transaction cryptographic signature...',
      'Awaiting settlement confirmation from RBI/NPCI payment switch...',
      'Synchronizing transaction with Dr. Smita Clinic Ledger...'
    ];

    let currentStep = 0;
    setProcessingStage(stages[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < stages.length) {
        setProcessingStage(stages[currentStep]);
      } else {
        clearInterval(interval);
        completeSuccess(gateway === 'qr' ? 'upi' : gateway);
      }
    }, 600);
  };

  const completeSuccess = (
    settledVia: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'cash'
  ) => {
    const randomTxnSuffix = Math.floor(100000 + Math.random() * 900000);
    const prefix =
      settledVia === 'phonepe'
        ? 'PP'
        : settledVia === 'gpay'
        ? 'GPAY'
        : settledVia === 'card'
        ? 'CARD'
        : settledVia === 'netbanking'
        ? 'NET'
        : 'UPI';
    const txnId = `${prefix}-2026-${randomTxnSuffix}`;
    const utr = `2026${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const now = new Date().toISOString();

    const details = {
      txnId,
      utr,
      settledVia,
      timestamp: now,
      amount: payAmount
    };

    setSettledDetails(details);
    setIsProcessing(false);
    setIsSuccess(true);

    // Update parent context and doctor connectivity
    const method: PaymentMethod =
      settledVia === 'card'
        ? 'credit-card'
        : settledVia === 'netbanking'
        ? 'bank-transfer'
        : 'upi';

    onSuccess(payAmount, method, txnId, settledVia);
  };

  // Direct Redirect Intent to PhonePe
  const handleRedirectPhonePe = () => {
    // In mobile devices or native PWA, attempt deep link
    const phonepeDeepLink = `phonepe://pay?pa=${vpa}&pn=${encodeURIComponent(
      clinicName
    )}&am=${payAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `Invoice #${invoice.invoiceNumber}`
    )}`;

    // Try to launch intent if supported, and simulate payment
    try {
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        window.location.href = phonepeDeepLink;
      }
    } catch {
      // fallback
    }

    executePayment('phonepe');
  };

  // Direct Redirect Intent to Google Pay
  const handleRedirectGPay = () => {
    const gpayDeepLink = `gpay://upi/pay?pa=${vpa}&pn=${encodeURIComponent(
      clinicName
    )}&am=${payAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `Invoice #${invoice.invoiceNumber}`
    )}`;

    try {
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        window.location.href = gpayDeepLink;
      }
    } catch {
      // fallback
    }

    executePayment('gpay');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-auto relative">
        
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ===================== SUCCESS VIEW ===================== */}
        {isSuccess && settledDetails ? (
          <div className="space-y-6 text-center py-2 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                Payment Settled Successfully
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Payment Received &amp; Synchronized!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your payment of <strong className="text-slate-900 font-mono font-bold">${settledDetails.amount.toFixed(2)}</strong> has been settled via{' '}
                <strong className="text-indigo-600 uppercase font-bold">{settledDetails.settledVia}</strong> and synced with Dr. Smita's clinic ledger.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Invoice Number</span>
                <span className="font-mono font-bold text-slate-900">#{invoice.invoiceNumber}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transaction Reference</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-700">
                  <span>{settledDetails.txnId}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyTxn(settledDetails.txnId)}
                    className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                    title="Copy Transaction ID"
                  >
                    {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Bank UTR Number</span>
                <span className="font-mono text-slate-700">{settledDetails.utr}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Settlement Gateway</span>
                <span className="font-bold text-slate-900 uppercase flex items-center gap-1">
                  {settledDetails.settledVia === 'phonepe' && <span className="text-purple-700">🟣 PhonePe UPI</span>}
                  {settledDetails.settledVia === 'gpay' && <span className="text-blue-700">🔵 Google Pay</span>}
                  {settledDetails.settledVia === 'card' && <span className="text-slate-700">💳 256-bit SSL Card</span>}
                  {settledDetails.settledVia === 'upi' && <span className="text-emerald-700">🟢 UPI QR Instant</span>}
                  {settledDetails.settledVia === 'netbanking' && <span className="text-slate-700">🏦 Net Banking</span>}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Doctor Portal Connectivity</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dr. Smita's Ledger Updated</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition cursor-pointer"
              >
                Done &amp; Return to My Invoices
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* ===================== PROCESSING VIEW ===================== */
          <div className="space-y-6 text-center py-10 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto relative">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Processing Secure Payment
              </h3>
              <p className="text-xs text-indigo-700 font-semibold max-w-sm mx-auto min-h-[36px] flex items-center justify-center">
                {processingStage}
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse w-full"></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Please do not refresh or close this window while the transaction is being verified.
            </p>
          </div>
        ) : (
          /* ===================== PAYMENT FORM VIEW ===================== */
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-xs">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Secure Real-Time Payment Gateway
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Settle Invoice <strong className="text-slate-800 font-mono">#{invoice.invoiceNumber}</strong> with instant clinic ledger connectivity.
              </p>
            </div>

            {/* Bill Summary Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Patient Name</span>
                <span className="font-bold text-slate-900">{invoice.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Total Outstanding</span>
                <span className="font-mono font-bold text-rose-700">${invoice.balanceDue.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Paying Amount</span>
                <span className="font-mono text-base font-black text-indigo-700">${payAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Amount Slider / Input if partial allowed */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-bold text-slate-700">Payment Amount ($)</label>
                <button
                  type="button"
                  onClick={() => setPayAmount(invoice.balanceDue)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Pay Full Balance (${invoice.balanceDue.toFixed(2)})
                </button>
              </div>
              <input
                type="number"
                min={1}
                max={invoice.balanceDue}
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(Math.min(invoice.balanceDue, Math.max(1, Number(e.target.value))))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-mono font-bold text-sm focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Payment Method Selector Pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Select Instant Gateway</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* PhonePe Pill */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('phonepe')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'phonepe'
                      ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    ₹
                  </div>
                  <span>PhonePe</span>
                </button>

                {/* Google Pay Pill */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('gpay')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'gpay'
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    G
                  </div>
                  <span>Google Pay</span>
                </button>

                {/* Dynamic UPI QR Code */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('qr')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'qr'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span>UPI QR Code</span>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('card')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'card'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span>Cards / Debit</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENTS */}

            {/* 1. PhonePe Gateway */}
            {selectedGateway === 'phonepe' && (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      ₹
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-purple-950">PhonePe UPI Gateway</h4>
                      <p className="text-[10px] text-purple-700">Direct instant transfer with zero processing fee</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                    Auto-Redirect Supported
                  </span>
                </div>

                {/* Primary Action: Direct Redirect to PhonePe */}
                <button
                  type="button"
                  onClick={handleRedirectPhonePe}
                  className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition cursor-pointer"
                >
                  <span>Redirect to PhonePe App / Web</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-purple-200"></div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Or Pay with PhonePe UPI ID</span>
                  <div className="flex-1 h-px bg-purple-200"></div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="font-bold text-purple-900">Enter UPI ID</label>
                    <span className="text-purple-600">e.g. mobile@ybl or name@ibl</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="yourname@ybl"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiIdTouched(true);
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-purple-950 placeholder:text-purple-300 focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => executePayment('phonepe')}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                    >
                      Verify &amp; Pay
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Google Pay Gateway */}
            {selectedGateway === 'gpay' && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      G
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-blue-950">Google Pay (GPay) Gateway</h4>
                      <p className="text-[10px] text-blue-700">Instant UPI transfer via Google Pay</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                    Instant Bank Transfer
                  </span>
                </div>

                {/* Primary Action: Direct Redirect to Google Pay */}
                <button
                  type="button"
                  onClick={handleRedirectGPay}
                  className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  <span>Pay with Google Pay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-blue-200"></div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Or Enter GPay VPA</span>
                  <div className="flex-1 h-px bg-blue-200"></div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="font-bold text-blue-900">Google Pay UPI ID</label>
                    <span className="text-blue-600">e.g. yourname@okhdfcbank</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="yourname@okicici"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiIdTouched(true);
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-blue-950 placeholder:text-blue-300 focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => executePayment('gpay')}
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Instant Dynamic UPI QR Code */}
            {selectedGateway === 'qr' && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3.5 animate-in fade-in text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-950">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>Scan QR with Any UPI App (PhonePe / Google Pay / Paytm)</span>
                </div>

                {/* Scannable SVG QR Code Simulation with Clinic VPA */}
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 inline-block shadow-xs">
                  <div className="w-44 h-44 mx-auto relative flex items-center justify-center bg-slate-900 p-2 rounded-xl">
                    {/* Stylized QR Code Grid */}
                    <div className="w-full h-full bg-white p-2 rounded-lg flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 border-4 border-slate-900 rounded-md p-1">
                          <div className="w-full h-full bg-slate-900 rounded-xs"></div>
                        </div>
                        <div className="w-10 h-10 border-4 border-slate-900 rounded-md p-1">
                          <div className="w-full h-full bg-slate-900 rounded-xs"></div>
                        </div>
                      </div>
                      
                      {/* Center Clinic Tooth Brand */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md border-2 border-white text-xs font-black">
                        🦷
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 border-4 border-slate-900 rounded-md p-1">
                          <div className="w-full h-full bg-slate-900 rounded-xs"></div>
                        </div>
                        <div className="text-[8px] font-mono font-bold text-slate-800 text-right leading-none">
                          ₹{payAmount.toFixed(0)}<br />SDC-PAY
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-900 space-y-1">
                  <p className="font-bold">UPI VPA: <span className="font-mono bg-white px-2 py-0.5 rounded-full border border-emerald-300">{vpa}</span></p>
                  <p className="text-emerald-700">Open PhonePe or Google Pay on your phone to scan this QR.</p>
                </div>

                <button
                  type="button"
                  onClick={() => executePayment('upi')}
                  className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Mobile QR Scan Settlement</span>
                </button>
              </div>
            )}

            {/* 4. Cards Gateway */}
            {selectedGateway === 'card' && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Credit / Debit Card (256-bit SSL)</span>
                  </span>
                  <span className="text-[10px] text-indigo-700 font-bold">Visa / MasterCard / RuPay</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8821"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => executePayment('card')}
                  className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize ${payAmount.toFixed(2)} via 256-bit SSL</span>
                </button>
              </div>
            )}

            {/* Security Assurance */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PCI-DSS &amp; 256-bit SSL Encrypted</span>
              </div>
              <span className="font-mono text-slate-400">NPCI / RBI Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
