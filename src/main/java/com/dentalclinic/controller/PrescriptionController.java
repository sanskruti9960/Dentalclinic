package com.dentalclinic.controller;

import com.dentalclinic.model.ClinicalNote;
import com.dentalclinic.model.Prescription;
import com.dentalclinic.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Electronic Dental Prescriptions (Rx) and Doctor Clinical Notes.
 * Endpoints:
 * - GET /api/prescriptions/patient/{patientId} : Patient prescription archive
 * - POST /api/prescriptions : Issue digital Rx with medicine dosage instructions
 * - GET /api/prescriptions/notes/patient/{patientId} : Doctor operatory notes
 * - POST /api/prescriptions/notes : Add clinical sitting examination note
 */
@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsForPatient(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable String id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@Valid @RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.createPrescription(prescription));
    }

    @GetMapping("/notes/patient/{patientId}")
    public ResponseEntity<List<ClinicalNote>> getPatientClinicalNotes(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.getClinicalNotesForPatient(patientId));
    }

    @PostMapping("/notes")
    public ResponseEntity<ClinicalNote> addClinicalNote(@Valid @RequestBody ClinicalNote note) {
        return ResponseEntity.ok(prescriptionService.addClinicalNote(note));
    }
}
