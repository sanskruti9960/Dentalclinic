package com.smitaclinic.controller;

import com.smitaclinic.model.Prescription;
import com.smitaclinic.repository.PatientRepository;
import com.smitaclinic.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    // READ ALL: Doctor
    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // READ BY PATIENT: Patient panel (isolated)
    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    // CREATE: Issued exclusively by Dr. Smita Bevle
    @PostMapping
    public ResponseEntity<Prescription> createPrescription(
            @RequestBody Prescription prescription,
            @RequestParam Long patientId) {
        var patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isEmpty()) return ResponseEntity.badRequest().build();

        prescription.setPatient(patientOpt.get());
        prescription.setDoctorName("Dr. Smita Bevle");
        prescription.setDoctorDegree("BDS, MDS (Prosthodontics & Oral Implantology)");
        prescription.setDoctorRegNo("D-48921-MMC");
        prescription.setPrescriptionNumber("RX-2026-" + (prescriptionRepository.count() + 420));
        return ResponseEntity.ok(prescriptionRepository.save(prescription));
    }

    // DELETE: Remove prescription
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        if (!prescriptionRepository.existsById(id)) return ResponseEntity.notFound().build();
        prescriptionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
