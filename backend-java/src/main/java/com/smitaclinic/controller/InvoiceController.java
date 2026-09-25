package com.smitaclinic.controller;

import com.smitaclinic.model.Invoice;
import com.smitaclinic.repository.InvoiceRepository;
import com.smitaclinic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;

    // READ ALL: Doctor billing ledger
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // READ BY PATIENT: Patient isolated invoices
    @GetMapping("/patient/{patientId}")
    public List<Invoice> getPatientInvoices(@PathVariable Long patientId) {
        return invoiceRepository.findByPatientId(patientId);
    }

    // CREATE: Generate new bill
    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice, @RequestParam Long patientId) {
        var patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isEmpty()) return ResponseEntity.badRequest().build();

        invoice.setPatient(patientOpt.get());
        invoice.setInvoiceNumber("INV-2026-" + (invoiceRepository.count() + 301));
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }

    // UPDATE: Record payment
    @PostMapping("/{id}/pay")
    public ResponseEntity<Invoice> recordPayment(
            @PathVariable Long id,
            @RequestParam Double amount,
            @RequestParam String paymentMethod) {
        return invoiceRepository.findById(id)
                .map(inv -> {
                    double newPaid = inv.getAmountPaid() + amount;
                    double newBal = Math.max(0.0, inv.getGrandTotal() - newPaid);
                    inv.setAmountPaid(newPaid);
                    inv.setBalanceDue(newBal);
                    inv.setStatus(newBal == 0.0 ? Invoice.InvoiceStatus.PAID : Invoice.InvoiceStatus.PARTIAL);
                    inv.setPaymentMethod(paymentMethod);
                    return ResponseEntity.ok(invoiceRepository.save(inv));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Delete invoice
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (!invoiceRepository.existsById(id)) return ResponseEntity.notFound().build();
        invoiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
