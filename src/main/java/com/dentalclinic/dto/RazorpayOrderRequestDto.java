package com.dentalclinic.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO to initiate a full-balance Razorpay payment order.
 * Amount is purposely NOT submitted by client to prevent tampering.
 */
public class RazorpayOrderRequestDto {

    @NotBlank(message = "Invoice ID is required")
    private String invoiceId;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    public RazorpayOrderRequestDto() {
    }

    public RazorpayOrderRequestDto(String invoiceId, String patientId) {
        this.invoiceId = invoiceId;
        this.patientId = patientId;
    }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
}
