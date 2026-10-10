package com.dentalclinic.model;

/**
 * Lifecycle status of a Razorpay payment transaction.
 */
public enum PaymentTransactionStatus {
    CREATED,
    AUTHORIZED,
    CAPTURED,
    FAILED,
    CANCELLED,
    REFUNDED
}
