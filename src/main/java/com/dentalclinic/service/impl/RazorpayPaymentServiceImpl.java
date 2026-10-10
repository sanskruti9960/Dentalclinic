package com.dentalclinic.service.impl;

import com.dentalclinic.dto.RazorpayOrderRequestDto;
import com.dentalclinic.dto.RazorpayOrderResponseDto;
import com.dentalclinic.dto.RazorpayPaymentStatusDto;
import com.dentalclinic.dto.RazorpayVerificationRequestDto;
import com.dentalclinic.model.*;
import com.dentalclinic.repository.InvoiceRepository;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.repository.PaymentTransactionRepository;
import com.dentalclinic.repository.PaymentWebhookEventRepository;
import com.dentalclinic.service.NotificationService;
import com.dentalclinic.service.RazorpayPaymentService;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Robust service implementation for server-authoritative Razorpay payment gateway integration.
 * Enforces full-balance payment, cryptographic signature verification, idempotent webhooks,
 * and atomic database reconciliation with patient financial records.
 */
@Service
@Transactional
public class RazorpayPaymentServiceImpl implements RazorpayPaymentService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentServiceImpl.class);

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentWebhookEventRepository paymentWebhookEventRepository;
    private final NotificationService notificationService;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    @Value("${razorpay.company-name:Smita Dental Clinic & Implant Centre}")
    private String companyName;

    @Value("${app.env:test}")
    private String appEnv;

    public RazorpayPaymentServiceImpl(InvoiceRepository invoiceRepository,
                                      PatientRepository patientRepository,
                                      PaymentTransactionRepository paymentTransactionRepository,
                                      PaymentWebhookEventRepository paymentWebhookEventRepository,
                                      NotificationService notificationService) {
        this.invoiceRepository = invoiceRepository;
        this.patientRepository = patientRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.paymentWebhookEventRepository = paymentWebhookEventRepository;
        this.notificationService = notificationService;
    }

    private boolean isPlaceholderKey() {
        return keyId == null || keyId.isBlank() || keyId.contains("placeholderKeyId") || keyId.equals("rzp_test_placeholderKeyId");
    }

    @Override
    public RazorpayOrderResponseDto createOrder(RazorpayOrderRequestDto request) {
        // 1. Fetch trusted invoice from database
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + request.getInvoiceId()));

        // 2. Validate patient authorization & ownership
        if (!invoice.getPatientId().equals(request.getPatientId())) {
            throw new SecurityException("Unauthorized access: Invoice " + invoice.getInvoiceNumber() +
                    " does not belong to patient " + request.getPatientId());
        }

        // 3. Verify invoice is payable & calculate outstanding balance server-side
        BigDecimal balanceDue = invoice.getBalanceDue();
        if (balanceDue == null || balanceDue.compareTo(BigDecimal.ZERO) <= 0 || invoice.getStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Invoice " + invoice.getInvoiceNumber() +
                    " is already settled in full. No outstanding balance due.");
        }

        // 4. Enforce exact full-balance payment in INR paise (safe integer arithmetic)
        long amountPaise = balanceDue.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        if (amountPaise <= 0) {
            throw new IllegalStateException("Calculated payment amount must be greater than zero.");
        }

        // 5. Fetch patient demographic details for checkout prefill
        Patient patient = patientRepository.findById(invoice.getPatientId()).orElse(null);
        String patientEmail = (patient != null && patient.getEmail() != null) ? patient.getEmail() : "";
        String patientPhone = (patient != null && patient.getPhone() != null) ? patient.getPhone() : invoice.getPatientPhone();

        // 6. Create Razorpay Order
        String razorpayOrderId;
        if (!isPlaceholderKey()) {
            try {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountPaise);
                orderRequest.put("currency", currency);
                orderRequest.put("receipt", invoice.getInvoiceNumber());

                JSONObject notes = new JSONObject();
                notes.put("clinic", companyName);
                notes.put("invoice_id", invoice.getId());
                notes.put("invoice_number", invoice.getInvoiceNumber());
                notes.put("patient_id", invoice.getPatientId());
                notes.put("patient_name", invoice.getPatientName());
                notes.put("payment_type", "FULL_BALANCE_SETTLEMENT");
                orderRequest.put("notes", notes);

                Order order = client.orders.create(orderRequest);
                razorpayOrderId = order.get("id");
                log.info("Successfully created genuine Razorpay Order ID: {} for Invoice: {}", razorpayOrderId, invoice.getInvoiceNumber());
            } catch (Exception ex) {
                log.error("Failed to create order via Razorpay SDK: {}", ex.getMessage(), ex);
                throw new RuntimeException("Razorpay gateway error: " + ex.getMessage(), ex);
            }
        } else {
            // Test Mode Simulation when merchant account keys are pending onboarding
            razorpayOrderId = "order_test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            log.warn("Using Razorpay Test Order Simulation (keys not yet configured): {}", razorpayOrderId);
        }

        // 7. Persist local payment attempt
        PaymentTransaction txn = new PaymentTransaction(
                "ptxn-" + UUID.randomUUID().toString().substring(0, 8),
                invoice.getId(),
                invoice.getPatientId(),
                razorpayOrderId,
                amountPaise,
                balanceDue,
                currency
        );
        txn.setPayerEmail(patientEmail);
        txn.setPayerContact(patientPhone);
        paymentTransactionRepository.save(txn);

        // 8. Construct response for frontend checkout
        RazorpayOrderResponseDto response = new RazorpayOrderResponseDto();
        response.setOrderId(razorpayOrderId);
        response.setAmountPaise(amountPaise);
        response.setAmountInr(balanceDue);
        response.setCurrency(currency);
        response.setKeyId(keyId);
        response.setInvoiceId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setPatientName(invoice.getPatientName());
        response.setPatientEmail(patientEmail);
        response.setPatientPhone(patientPhone);
        response.setClinicName(companyName);
        response.setDescription("Full Balance Payment for Dental Treatment Invoice #" + invoice.getInvoiceNumber());

        return response;
    }

    @Override
    public RazorpayPaymentStatusDto verifyPayment(RazorpayVerificationRequestDto request) {
        log.info("Verifying payment for Order ID: {}, Payment ID: {}, Invoice ID: {}",
                request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getInvoiceId());

        // 1. Fetch matching payment attempt
        PaymentTransaction txn = paymentTransactionRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("No payment attempt found for Razorpay Order ID: " +
                        request.getRazorpayOrderId()));

        // Check if already captured (idempotency check)
        if (txn.getStatus() == PaymentTransactionStatus.CAPTURED) {
            log.info("Payment attempt for Order ID: {} is already CAPTURED.", txn.getRazorpayOrderId());
            Invoice invoice = invoiceRepository.findById(txn.getInvoiceId()).orElse(null);
            return buildStatusDto(txn, invoice, true, "Payment has already been confirmed and reconciled.");
        }

        // 2. Fetch trusted invoice
        Invoice invoice = invoiceRepository.findById(txn.getInvoiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + txn.getInvoiceId()));

        // 3. Cryptographically verify signature using HMAC SHA256
        boolean signatureValid = false;
        if (!isPlaceholderKey()) {
            signatureValid = verifyHmacSha256Signature(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    keySecret
            );
            if (!signatureValid) {
                txn.setStatus(PaymentTransactionStatus.FAILED);
                txn.setErrorCode("BAD_SIGNATURE");
                txn.setErrorDescription("Cryptographic signature mismatch. Possible payment tampering.");
                paymentTransactionRepository.save(txn);
                log.error("Signature verification failed for order {}", request.getRazorpayOrderId());
                throw new SecurityException("Cryptographic signature verification failed.");
            }
        } else {
            // Test Mode Simulation fallback: accept valid test signature format
            signatureValid = request.getRazorpaySignature() != null && !request.getRazorpaySignature().isBlank();
        }

        // 4. Verify payment capture status directly from Razorpay API when genuine keys are active
        String paymentMethod = "online";
        if (!isPlaceholderKey()) {
            try {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                Payment payment = client.payments.fetch(request.getRazorpayPaymentId());
                String status = payment.get("status");
                Long paidPaise = ((Number) payment.get("amount")).longValue();

                if (!"captured".equalsIgnoreCase(status) && !"authorized".equalsIgnoreCase(status)) {
                    txn.setStatus(PaymentTransactionStatus.FAILED);
                    txn.setErrorCode("PAYMENT_NOT_CAPTURED");
                    txn.setErrorDescription("Payment status on Razorpay is " + status);
                    paymentTransactionRepository.save(txn);
                    throw new IllegalStateException("Payment was not captured by Razorpay. Current status: " + status);
                }

                // Verify exact amount
                if (!paidPaise.equals(txn.getAmountPaise())) {
                    txn.setStatus(PaymentTransactionStatus.FAILED);
                    txn.setErrorCode("AMOUNT_MISMATCH");
                    txn.setErrorDescription("Expected " + txn.getAmountPaise() + " paise, but received " + paidPaise);
                    paymentTransactionRepository.save(txn);
                    throw new IllegalStateException("Paid amount does not match expected invoice balance.");
                }

                if (payment.has("method")) {
                    paymentMethod = payment.get("method").toString();
                }
            } catch (Exception ex) {
                log.error("Error communicating with Razorpay API for payment {}: {}", request.getRazorpayPaymentId(), ex.getMessage());
                throw new RuntimeException("Razorpay payment verification error: " + ex.getMessage(), ex);
            }
        }

        // 5. Update Payment Transaction to CAPTURED
        LocalDateTime now = LocalDateTime.now();
        txn.setRazorpayPaymentId(request.getRazorpayPaymentId());
        txn.setRazorpaySignature(request.getRazorpaySignature());
        txn.setStatus(PaymentTransactionStatus.CAPTURED);
        txn.setPaymentMethod(paymentMethod);
        txn.setVerifiedAt(now);
        txn.setCapturedAt(now);
        paymentTransactionRepository.save(txn);

        // 6. Reconcile Invoice in Database (Zero balance, marked PAID)
        BigDecimal settlingAmount = txn.getAmountInr();
        invoice.setAmountPaid(invoice.getAmountPaid().add(settlingAmount));
        invoice.setBalanceDue(BigDecimal.ZERO);
        invoice.setStatus(PaymentStatus.PAID);
        invoice.setPaymentMethod("RAZORPAY_" + paymentMethod.toUpperCase());
        invoice.setPaymentNotes("Full balance settled via Razorpay (Payment ID: " + request.getRazorpayPaymentId() + ")");
        invoice.setTransactionId(request.getRazorpayPaymentId());
        invoiceRepository.save(invoice);

        // 7. Update Patient Balance Due
        Patient patient = patientRepository.findById(invoice.getPatientId()).orElse(null);
        if (patient != null) {
            patient.setTotalSpent(patient.getTotalSpent().add(settlingAmount));
            BigDecimal newPatientBalance = patient.getBalanceDue().subtract(settlingAmount);
            patient.setBalanceDue(newPatientBalance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newPatientBalance);
            patientRepository.save(patient);
        }

        // 8. Send SMS Notification
        notificationService.sendNotification(
                "SMS",
                invoice.getPatientName(),
                invoice.getPatientPhone(),
                "Payment Confirmation: " + invoice.getInvoiceNumber(),
                "Payment of Rs. " + settlingAmount + " received successfully via Razorpay (Txn: " +
                        request.getRazorpayPaymentId() + "). Balance is Rs. 0.00. Thank you!",
                invoice.getPatientId(),
                "PATIENT"
        );

        log.info("Invoice {} successfully reconciled and marked PAID via Razorpay.", invoice.getInvoiceNumber());
        return buildStatusDto(txn, invoice, true, "Payment verified and invoice settled in full.");
    }

    @Override
    public void handleWebhook(String rawPayload, String signatureHeader) {
        log.info("Received Razorpay webhook event.");

        // 1. Verify Webhook Signature
        if (!isPlaceholderKey()) {
            boolean valid = verifyHmacSha256Signature(rawPayload, signatureHeader, webhookSecret);
            if (!valid) {
                log.error("Invalid Razorpay webhook signature!");
                throw new SecurityException("Webhook cryptographic signature mismatch.");
            }
        }

        // 2. Parse Event JSON
        JSONObject eventJson = new JSONObject(rawPayload);
        String eventId = eventJson.optString("id", "evt_" + UUID.randomUUID().toString());
        String eventType = eventJson.optString("event", "unknown");

        // 3. Idempotency Check
        if (paymentWebhookEventRepository.existsByEventId(eventId)) {
            log.info("Webhook event {} has already been processed. Skipping duplicate delivery.", eventId);
            return;
        }

        // 4. Log Webhook Event
        PaymentWebhookEvent webhookEvent = new PaymentWebhookEvent(
                "wh-" + UUID.randomUUID().toString().substring(0, 8),
                eventId,
                eventType,
                null,
                null,
                rawPayload
        );

        try {
            JSONObject payloadObj = eventJson.optJSONObject("payload");
            if (payloadObj != null) {
                JSONObject paymentObj = payloadObj.optJSONObject("payment");
                if (paymentObj != null) {
                    JSONObject paymentEntity = paymentObj.optJSONObject("entity");
                    if (paymentEntity != null) {
                        String paymentId = paymentEntity.optString("id");
                        String orderId = paymentEntity.optString("order_id");
                        webhookEvent.setRazorpayPaymentId(paymentId);
                        webhookEvent.setRazorpayOrderId(orderId);

                        // Process payment.captured event
                        if ("payment.captured".equalsIgnoreCase(eventType) && orderId != null && !orderId.isBlank()) {
                            Optional<PaymentTransaction> txnOpt = paymentTransactionRepository.findByRazorpayOrderId(orderId);
                            if (txnOpt.isPresent()) {
                                PaymentTransaction txn = txnOpt.get();
                                if (txn.getStatus() != PaymentTransactionStatus.CAPTURED) {
                                    txn.setStatus(PaymentTransactionStatus.CAPTURED);
                                    txn.setRazorpayPaymentId(paymentId);
                                    txn.setCapturedAt(LocalDateTime.now());
                                    paymentTransactionRepository.save(txn);

                                    // Reconcile Invoice if not already done
                                    Invoice invoice = invoiceRepository.findById(txn.getInvoiceId()).orElse(null);
                                    if (invoice != null && invoice.getStatus() != PaymentStatus.PAID) {
                                        invoice.setAmountPaid(invoice.getAmountPaid().add(txn.getAmountInr()));
                                        invoice.setBalanceDue(BigDecimal.ZERO);
                                        invoice.setStatus(PaymentStatus.PAID);
                                        invoice.setPaymentMethod("RAZORPAY_WEBHOOK");
                                        invoice.setTransactionId(paymentId);
                                        invoiceRepository.save(invoice);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            webhookEvent.setProcessed(true);
            webhookEvent.setProcessedAt(LocalDateTime.now());
        } catch (Exception ex) {
            log.error("Error processing webhook payload: {}", ex.getMessage(), ex);
            webhookEvent.setProcessed(false);
            webhookEvent.setProcessingError(ex.getMessage());
        }

        paymentWebhookEventRepository.save(webhookEvent);
    }

    @Override
    public RazorpayPaymentStatusDto getPaymentStatus(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));

        var transactions = paymentTransactionRepository.findByInvoiceIdOrderByCreatedAtDesc(invoiceId);
        if (transactions.isEmpty()) {
            RazorpayPaymentStatusDto dto = new RazorpayPaymentStatusDto();
            dto.setInvoiceId(invoice.getId());
            dto.setInvoiceNumber(invoice.getInvoiceNumber());
            dto.setInvoiceBalanceDue(invoice.getBalanceDue());
            dto.setInvoiceStatus(invoice.getStatus().name());
            dto.setStatus("NO_PAYMENT_ATTEMPT");
            dto.setVerified(invoice.getStatus() == PaymentStatus.PAID);
            return dto;
        }

        PaymentTransaction latestTxn = transactions.get(0);
        return buildStatusDto(latestTxn, invoice, latestTxn.getStatus() == PaymentTransactionStatus.CAPTURED,
                "Current payment status: " + latestTxn.getStatus());
    }

    /**
     * Standard RFC 2104 HMAC SHA-256 cryptographic signature calculation and constant-time comparison.
     */
    private boolean verifyHmacSha256Signature(String data, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String calculatedSignature = hexString.toString();

            return MessageDigest.isEqual(
                    calculatedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Error computing HMAC SHA256: {}", e.getMessage());
            return false;
        }
    }

    private RazorpayPaymentStatusDto buildStatusDto(PaymentTransaction txn, Invoice invoice, boolean verified, String message) {
        RazorpayPaymentStatusDto dto = new RazorpayPaymentStatusDto();
        dto.setTransactionId(txn.getId());
        dto.setInvoiceId(txn.getInvoiceId());
        dto.setInvoiceNumber(invoice != null ? invoice.getInvoiceNumber() : "");
        dto.setStatus(txn.getStatus().name());
        dto.setAmountInr(txn.getAmountInr());
        dto.setCurrency(txn.getCurrency());
        dto.setRazorpayOrderId(txn.getRazorpayOrderId());
        dto.setRazorpayPaymentId(txn.getRazorpayPaymentId());
        dto.setPaymentMethod(txn.getPaymentMethod());
        dto.setVerifiedAt(txn.getVerifiedAt());
        dto.setInvoiceBalanceDue(invoice != null ? invoice.getBalanceDue() : BigDecimal.ZERO);
        dto.setInvoiceStatus(invoice != null ? invoice.getStatus().name() : "");
        dto.setVerified(verified);
        dto.setMessage(message);
        return dto;
    }
}
