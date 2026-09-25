package com.dentalclinic.controller;

import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.dto.ToothUpdateDto;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.ToothRecord;
import com.dentalclinic.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Patient Records & Dental Odontogram Chart.
 * Endpoints:
 * - GET /api/patients : Search and retrieve all patient records
 * - GET /api/patients/{id} : Single patient demographic & clinical profile
 * - POST /api/patients : Doctor intake registration
 * - GET /api/patients/{id}/chart : 32-tooth interactive Odontogram record
 * - PUT /api/patients/{id}/chart/tooth : Update tooth condition (Caries, RCT, Crown, etc.)
 */
@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getPatients(@RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(patientService.searchPatients(search));
        }
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody PatientRegistrationDto dto) {
        Patient created = patientService.createPatient(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}/chart")
    public ResponseEntity<List<ToothRecord>> getDentalChart(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientDentalChart(id));
    }

    @PutMapping("/{id}/chart/tooth")
    public ResponseEntity<ToothRecord> updateToothCondition(
            @PathVariable String id,
            @Valid @RequestBody ToothUpdateDto dto) {
        ToothRecord updated = patientService.updateToothCondition(id, dto);
        return ResponseEntity.ok(updated);
    }
}
