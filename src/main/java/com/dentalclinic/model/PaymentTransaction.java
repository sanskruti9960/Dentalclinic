package com.dentalclinic.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity tracking Razorpay payment orders, checkout verification, capture status,
 * and gateway metadata linked to patient invoices.
 */
@Entity
@Table(name = "payment_transactions", indexes = {
    @Index(name = "idx_pay_txn_invoice", columnList = "invoice_id"),
    @Index(name = "idx_pay_txn_order", columnList = "razorpay_order_id"),
    @Index(name = "idx_pay_txn_payment", columnList = "razorpay_payment_id"),
    @Index(name = "idx_pay_txn_status", columnList = "status")
})
public class PaymentTransaction {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "invoice_id", nullable = false, length = 36)
    private String invoiceId;

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "razorpay_order_id", nullable = false, unique = true, length = 100)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", unique = true, length = 100)
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    @Column(name = "amount_paise", nullable = false)
    private Long amountPaise;

    @Column(name = "amount_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountInr;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentTransactionStatus status = PaymentTransactionStatus.CREATED;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // upi, card, netbanking, wallet

    @Column(length = 50)
    private String bank;

    @Column(length = 50)
    private String wallet;

    @Column(length = 100)
    private String vpa;

    @Column(name = "payer_email", length = 150)
    private String payerEmail;

    @Column(name = "payer_contact", length = 30)
    private String payerContact;

    @Column(name = "error_code", length = 100)
    private String errorCode;

    @Column(name = "error_description", columnDefinition = "TEXT")
    private String errorDescription;

    @Column(name = "error_source", length = 100)
    private String errorSource;

    @Column(name = "error_step", length = 100)
    private String errorStep;

    @Column(name = "error_reason", length = 100)
    private String errorReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "captured_at")
    private LocalDateTime capturedAt;

    public PaymentTransaction() {
    }

    public PaymentTransaction(String id, String invoiceId, String patientId, String razorpayOrderId,
                              Long amountPaise, BigDecimal amountInr, String currency) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.patientId = patientId;
        this.razorpayOrderId = razorpayOrderId;
        this.amountPaise = amountPaise;
        this.amountInr = amountInr;
        this.currency = currency;
        this.status = PaymentTransactionStatus.CREATED;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public Long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(Long amountPaise) { this.amountPaise = amountPaise; }

    public BigDecimal getAmountInr() { return amountInr; }
    public void setAmountInr(BigDecimal amountInr) { this.amountInr = amountInr; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentTransactionStatus getStatus() { return status; }
    public void setStatus(PaymentTransactionStatus status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getBank() { return bank; }
    public void setBank(String bank) { this.bank = bank; }

    public String getWallet() { return wallet; }
    public void setWallet(String wallet) { this.wallet = wallet; }

    public String getVpa() { return vpa; }
    public void setVpa(String vpa) { this.vpa = vpa; }

    public String getPayerEmail() { return payerEmail; }
    public void setPayerEmail(String payerEmail) { this.payerEmail = payerEmail; }

    public String getPayerContact() { return payerContact; }
    public void setPayerContact(String payerContact) { this.payerContact = payerContact; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getErrorDescription() { return errorDescription; }
    public void setErrorDescription(String errorDescription) { this.errorDescription = errorDescription; }

    public String getErrorSource() { return errorSource; }
    public void setErrorSource(String errorSource) { this.errorSource = errorSource; }

    public String getErrorStep() { return errorStep; }
    public void setErrorStep(String errorStep) { this.errorStep = errorStep; }

    public String getErrorReason() { return errorReason; }
    public void setErrorReason(String errorReason) { this.errorReason = errorReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCapturedAt() { return capturedAt; }
    public void setCapturedAt(LocalDateTime capturedAt) { this.capturedAt = capturedAt; }
}
