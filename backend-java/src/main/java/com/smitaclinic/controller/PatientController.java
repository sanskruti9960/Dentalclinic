package com.smitaclinic.controller;

import com.smitaclinic.model.Patient;
import com.smitaclinic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientRepository patientRepository;

    // READ ALL: Doctor only
    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // READ SINGLE: Patient can read their own; Doctor can read any
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE: Register new patient in clinic
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public Patient createPatient(@RequestBody Patient patient) {
        long count = patientRepository.count() + 101;
        patient.setPatientCode("SDC-2026-" + String.format("%03d", count));
        return patientRepository.save(patient);
    }

    // UPDATE: Update patient record
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient updates) {
        return patientRepository.findById(id)
                .map(existing -> {
                    if (updates.getFullName() != null) existing.setFullName(updates.getFullName());
                    if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
                    if (updates.getEmail() != null) existing.setEmail(updates.getEmail());
                    if (updates.getAddress() != null) existing.setAddress(updates.getAddress());
                    if (updates.getBloodGroup() != null) existing.setBloodGroup(updates.getBloodGroup());
                    if (updates.getMedicalAlerts() != null) existing.setMedicalAlerts(updates.getMedicalAlerts());
                    if (updates.getChiefComplaint() != null) existing.setChiefComplaint(updates.getChiefComplaint());
                    return ResponseEntity.ok(patientRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Remove patient (Doctor only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (!patientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        patientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
