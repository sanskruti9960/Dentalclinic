package com.dentalclinic.service;

import com.dentalclinic.dto.RazorpayOrderRequestDto;
import com.dentalclinic.dto.RazorpayOrderResponseDto;
import com.dentalclinic.dto.RazorpayPaymentStatusDto;
import com.dentalclinic.dto.RazorpayVerificationRequestDto;

/**
 * Service for managing secure, full-balance Razorpay payment gateway lifecycle.
 */
public interface RazorpayPaymentService {

    /**
     * Creates a server-authoritative Razorpay order for the exact outstanding invoice balance.
     */
    RazorpayOrderResponseDto createOrder(RazorpayOrderRequestDto request);

    /**
     * Cryptographically verifies checkout signature, confirms payment capture, and reconciles invoice.
     */
    RazorpayPaymentStatusDto verifyPayment(RazorpayVerificationRequestDto request);

    /**
     * Idempotently processes signed Razorpay webhooks.
     */
    void handleWebhook(String rawPayload, String signatureHeader);

    /**
     * Retrieves current payment status and transaction record for a specific invoice.
     */
    RazorpayPaymentStatusDto getPaymentStatus(String invoiceId);
}
