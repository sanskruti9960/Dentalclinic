package com.dentalclinic.repository;

import com.dentalclinic.model.PaymentTransaction;
import com.dentalclinic.model.PaymentTransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {

    Optional<PaymentTransaction> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PaymentTransaction> findByRazorpayPaymentId(String razorpayPaymentId);

    List<PaymentTransaction> findByInvoiceIdOrderByCreatedAtDesc(String invoiceId);

    List<PaymentTransaction> findByPatientIdOrderByCreatedAtDesc(String patientId);

    List<PaymentTransaction> findByInvoiceIdAndStatus(String invoiceId, PaymentTransactionStatus status);
}
