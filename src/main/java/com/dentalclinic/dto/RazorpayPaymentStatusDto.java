package com.dentalclinic.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO representing verified payment transaction state and resulting invoice balance.
 */
public class RazorpayPaymentStatusDto {

    private String transactionId;
    private String invoiceId;
    private String invoiceNumber;
    private String status;
    private BigDecimal amountInr;
    private String currency;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String paymentMethod;
    private LocalDateTime verifiedAt;
    private BigDecimal invoiceBalanceDue;
    private String invoiceStatus;
    private boolean verified;
    private String message;

    public RazorpayPaymentStatusDto() {
    }

    // Getters and Setters
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getAmountInr() { return amountInr; }
    public void setAmountInr(BigDecimal amountInr) { this.amountInr = amountInr; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public BigDecimal getInvoiceBalanceDue() { return invoiceBalanceDue; }
    public void setInvoiceBalanceDue(BigDecimal invoiceBalanceDue) { this.invoiceBalanceDue = invoiceBalanceDue; }

    public String getInvoiceStatus() { return invoiceStatus; }
    public void setInvoiceStatus(String invoiceStatus) { this.invoiceStatus = invoiceStatus; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
