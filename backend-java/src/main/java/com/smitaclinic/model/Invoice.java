package com.smitaclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String invoiceNumber; // e.g. INV-2026-301

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    private String patientName;
    private String patientPhone;

    private LocalDate invoiceDate = LocalDate.now();
    private LocalDate dueDate;

    @ElementCollection
    @CollectionTable(name = "invoice_line_items", joinColumns = @JoinColumn(name = "invoice_id"))
    private List<InvoiceItem> items = new ArrayList<>();

    private Double subtotal = 0.0;
    private Double taxAmount = 0.0;
    private Double discountAmount = 0.0;
    private Double grandTotal = 0.0;
    private Double amountPaid = 0.0;
    private Double balanceDue = 0.0;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status = InvoiceStatus.UNPAID;

    private String paymentMethod; // "CASH", "CARD", "UPI", "BANK_TRANSFER"
    private String notes;

    public enum InvoiceStatus {
        PAID,
        PARTIAL,
        UNPAID
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InvoiceItem {
        private String description;
        private Integer toothNumber;
        private Integer quantity;
        private Double unitPrice;
        private Double discount;
        private Double total;
    }
}
