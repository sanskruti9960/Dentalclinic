package com.dentalclinic.dto;

import java.math.BigDecimal;

/**
 * Response DTO returned to client containing server-generated Razorpay order details.
 */
public class RazorpayOrderResponseDto {

    private String orderId;
    private Long amountPaise;
    private BigDecimal amountInr;
    private String currency;
    private String keyId;
    private String invoiceId;
    private String invoiceNumber;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String clinicName;
    private String description;

    public RazorpayOrderResponseDto() {
    }

    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(Long amountPaise) { this.amountPaise = amountPaise; }

    public BigDecimal getAmountInr() { return amountInr; }
    public void setAmountInr(BigDecimal amountInr) { this.amountInr = amountInr; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getClinicName() { return clinicName; }
    public void setClinicName(String clinicName) { this.clinicName = clinicName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
