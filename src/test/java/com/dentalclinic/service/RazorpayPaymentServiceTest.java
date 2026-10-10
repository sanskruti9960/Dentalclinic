package com.dentalclinic.service;

import com.dentalclinic.dto.RazorpayOrderRequestDto;
import com.dentalclinic.dto.RazorpayOrderResponseDto;
import com.dentalclinic.dto.RazorpayPaymentStatusDto;
import com.dentalclinic.dto.RazorpayVerificationRequestDto;
import com.dentalclinic.model.*;
import com.dentalclinic.repository.InvoiceRepository;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.repository.PaymentTransactionRepository;
import com.dentalclinic.repository.PaymentWebhookEventRepository;
import com.dentalclinic.service.impl.RazorpayPaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RazorpayPaymentServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @Mock
    private PaymentWebhookEventRepository paymentWebhookEventRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private RazorpayPaymentServiceImpl paymentService;

    private Invoice testInvoice;
    private Patient testPatient;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "keyId", "rzp_test_placeholderKeyId");
        ReflectionTestUtils.setField(paymentService, "keySecret", "testKeySecret12345");
        ReflectionTestUtils.setField(paymentService, "webhookSecret", "testWebhookSecret12345");
        ReflectionTestUtils.setField(paymentService, "currency", "INR");
        ReflectionTestUtils.setField(paymentService, "companyName", "Smita Dental Clinic");
        ReflectionTestUtils.setField(paymentService, "appEnv", "test");

        testPatient = new Patient();
        testPatient.setId("pat-1");
        testPatient.setName("Aarav Sharma");
        testPatient.setPhone("+91 98201 12345");
        testPatient.setEmail("aarav@example.com");
        testPatient.setTotalSpent(new BigDecimal("5000.00"));
        testPatient.setBalanceDue(new BigDecimal("2500.00"));

        testInvoice = new Invoice();
        testInvoice.setId("inv-101");
        testInvoice.setInvoiceNumber("INV-2026-041");
        testInvoice.setPatientId("pat-1");
        testInvoice.setPatientName("Aarav Sharma");
        testInvoice.setPatientPhone("+91 98201 12345");
        testInvoice.setDate(LocalDate.now());
        testInvoice.setDueDate(LocalDate.now().plusDays(7));
        testInvoice.setGrandTotal(new BigDecimal("2500.00"));
        testInvoice.setAmountPaid(BigDecimal.ZERO);
        testInvoice.setBalanceDue(new BigDecimal("2500.00"));
        testInvoice.setStatus(PaymentStatus.UNPAID);
    }

    @Test
    @DisplayName("Should successfully create Razorpay order for exact full balance in paise (INR)")
    void testCreateOrder_Success() {
        when(invoiceRepository.findById("inv-101")).thenReturn(Optional.of(testInvoice));
        when(patientRepository.findById("pat-1")).thenReturn(Optional.of(testPatient));
        when(paymentTransactionRepository.save(any(PaymentTransaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RazorpayOrderRequestDto request = new RazorpayOrderRequestDto("inv-101", "pat-1");
        RazorpayOrderResponseDto response = paymentService.createOrder(request);

        assertNotNull(response);
        assertNotNull(response.getOrderId());
        assertEquals(250000L, response.getAmountPaise(), "Amount in paise must be exactly 2500.00 * 100 = 250000");
        assertEquals(new BigDecimal("2500.00"), response.getAmountInr());
        assertEquals("INR", response.getCurrency());
        assertEquals("inv-101", response.getInvoiceId());
        assertEquals("INV-2026-041", response.getInvoiceNumber());

        verify(paymentTransactionRepository, times(1)).save(any(PaymentTransaction.class));
    }

    @Test
    @DisplayName("Should reject order creation when patient does not own the invoice (Authorization Check)")
    void testCreateOrder_WrongPatientOwnership_ThrowsSecurityException() {
        when(invoiceRepository.findById("inv-101")).thenReturn(Optional.of(testInvoice));

        RazorpayOrderRequestDto request = new RazorpayOrderRequestDto("inv-101", "unauthorized-patient-id");

        assertThrows(SecurityException.class, () -> paymentService.createOrder(request));
        verify(paymentTransactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject order creation if invoice is already settled in full (Zero Balance)")
    void testCreateOrder_AlreadyPaid_ThrowsIllegalStateException() {
        testInvoice.setStatus(PaymentStatus.PAID);
        testInvoice.setBalanceDue(BigDecimal.ZERO);
        testInvoice.setAmountPaid(testInvoice.getGrandTotal());

        when(invoiceRepository.findById("inv-101")).thenReturn(Optional.of(testInvoice));

        RazorpayOrderRequestDto request = new RazorpayOrderRequestDto("inv-101", "pat-1");

        assertThrows(IllegalStateException.class, () -> paymentService.createOrder(request));
        verify(paymentTransactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully verify payment signature, reconcile invoice to PAID and 0 balance")
    void testVerifyPayment_Success() {
        PaymentTransaction txn = new PaymentTransaction(
                "ptxn-1", "inv-101", "pat-1", "order_test_123456",
                250000L, new BigDecimal("2500.00"), "INR"
        );

        when(paymentTransactionRepository.findByRazorpayOrderId("order_test_123456")).thenReturn(Optional.of(txn));
        when(invoiceRepository.findById("inv-101")).thenReturn(Optional.of(testInvoice));
        when(patientRepository.findById("pat-1")).thenReturn(Optional.of(testPatient));
        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenAnswer(i -> i.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(i -> i.getArgument(0));

        RazorpayVerificationRequestDto request = new RazorpayVerificationRequestDto(
                "order_test_123456", "pay_test_789012", "sig_valid_test", "inv-101"
        );

        RazorpayPaymentStatusDto status = paymentService.verifyPayment(request);

        assertNotNull(status);
        assertTrue(status.isVerified());
        assertEquals("CAPTURED", status.getStatus());
        assertEquals(BigDecimal.ZERO, status.getInvoiceBalanceDue());
        assertEquals("PAID", status.getInvoiceStatus());

        assertEquals(PaymentStatus.PAID, testInvoice.getStatus());
        assertEquals(BigDecimal.ZERO, testInvoice.getBalanceDue());
        assertEquals(new BigDecimal("2500.00"), testInvoice.getAmountPaid());
        assertEquals("pay_test_789012", testInvoice.getTransactionId());

        verify(notificationService, times(1)).sendNotification(any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should handle duplicate verification request idempotently without double-settling")
    void testVerifyPayment_DuplicateRequest_ReturnsAlreadyCaptured() {
        PaymentTransaction txn = new PaymentTransaction(
                "ptxn-1", "inv-101", "pat-1", "order_test_123456",
                250000L, new BigDecimal("2500.00"), "INR"
        );
        txn.setStatus(PaymentTransactionStatus.CAPTURED);
        txn.setRazorpayPaymentId("pay_test_789012");

        testInvoice.setStatus(PaymentStatus.PAID);
        testInvoice.setBalanceDue(BigDecimal.ZERO);

        when(paymentTransactionRepository.findByRazorpayOrderId("order_test_123456")).thenReturn(Optional.of(txn));
        when(invoiceRepository.findById("inv-101")).thenReturn(Optional.of(testInvoice));

        RazorpayVerificationRequestDto request = new RazorpayVerificationRequestDto(
                "order_test_123456", "pay_test_789012", "sig_valid_test", "inv-101"
        );

        RazorpayPaymentStatusDto status = paymentService.verifyPayment(request);

        assertNotNull(status);
        assertTrue(status.isVerified());
        assertEquals("CAPTURED", status.getStatus());
        verify(invoiceRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should ignore duplicate webhook delivery based on eventId (Idempotent Webhook)")
    void testWebhook_DuplicateEvent_Skipped() {
        when(paymentWebhookEventRepository.existsByEventId("evt_dup_123")).thenReturn(true);

        String payload = "{\"id\":\"evt_dup_123\",\"event\":\"payment.captured\"}";
        paymentService.handleWebhook(payload, "sig_placeholder");

        verify(paymentWebhookEventRepository, never()).save(any());
    }
}
