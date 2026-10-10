package com.dentalclinic.controller;

import com.dentalclinic.dto.RazorpayOrderRequestDto;
import com.dentalclinic.dto.RazorpayOrderResponseDto;
import com.dentalclinic.dto.RazorpayPaymentStatusDto;
import com.dentalclinic.dto.RazorpayVerificationRequestDto;
import com.dentalclinic.service.RazorpayPaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller exposing secure Razorpay Payment Gateway endpoints:
 * - POST /api/payments/razorpay/create-order : Generate server-side Razorpay order
 * - POST /api/payments/razorpay/verify       : Verify checkout signature & capture
 * - POST /api/payments/razorpay/webhook      : Idempotent Razorpay webhook ingestion
 * - GET  /api/payments/razorpay/invoices/{invoiceId}/status : Check payment status
 */
@RestController
@RequestMapping("/api/payments/razorpay")
@CrossOrigin(origins = "*")
public class RazorpayPaymentController {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentController.class);

    private final RazorpayPaymentService razorpayPaymentService;

    public RazorpayPaymentController(RazorpayPaymentService razorpayPaymentService) {
        this.razorpayPaymentService = razorpayPaymentService;
    }

    /**
     * Creates a Razorpay Order for the full outstanding balance of the specified invoice.
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody RazorpayOrderRequestDto request) {
        try {
            RazorpayOrderResponseDto orderResponse = razorpayPaymentService.createOrder(request);
            return ResponseEntity.ok(orderResponse);
        } catch (SecurityException ex) {
            log.warn("Security violation creating Razorpay order: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException | IllegalStateException ex) {
            log.warn("Invalid order request: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Internal error creating Razorpay order: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unable to initiate payment: " + ex.getMessage()));
        }
    }

    /**
     * Verifies the checkout HMAC SHA-256 signature and reconciles the invoice upon successful capture.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody RazorpayVerificationRequestDto request) {
        try {
            RazorpayPaymentStatusDto status = razorpayPaymentService.verifyPayment(request);
            return ResponseEntity.ok(status);
        } catch (SecurityException ex) {
            log.error("Signature verification failure: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException | IllegalStateException ex) {
            log.warn("Verification rejection: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Error verifying payment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Payment verification failure: " + ex.getMessage()));
        }
    }

    /**
     * Webhook receiver for async server-to-server Razorpay event notifications.
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signatureHeader) {
        try {
            razorpayPaymentService.handleWebhook(rawPayload, signatureHeader);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Webhook processed successfully"));
        } catch (SecurityException ex) {
            log.warn("Rejected unauthorized webhook: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Error processing webhook: {}", ex.getMessage(), ex);
            // Return 200 or 500 depending on retry desire; return 500 for retry on transient issues
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Webhook processing error"));
        }
    }

    /**
     * Queries payment status for a specific invoice.
     */
    @GetMapping("/invoices/{invoiceId}/status")
    public ResponseEntity<RazorpayPaymentStatusDto> getPaymentStatus(@PathVariable String invoiceId) {
        return ResponseEntity.ok(razorpayPaymentService.getPaymentStatus(invoiceId));
    }
}
