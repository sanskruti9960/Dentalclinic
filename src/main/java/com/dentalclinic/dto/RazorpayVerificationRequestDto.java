package com.dentalclinic.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO containing client-side Razorpay checkout response for cryptographic server verification.
 */
public class RazorpayVerificationRequestDto {

    @NotBlank(message = "Razorpay order ID is required")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay payment ID is required")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay signature is required")
    private String razorpaySignature;

    @NotBlank(message = "Invoice ID is required")
    private String invoiceId;

    public RazorpayVerificationRequestDto() {
    }

    public RazorpayVerificationRequestDto(String razorpayOrderId, String razorpayPaymentId,
                                          String razorpaySignature, String invoiceId) {
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.invoiceId = invoiceId;
    }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }
}
