package com.dentalclinic.service.impl;

import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.dto.ToothUpdateDto;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.ToothCondition;
import com.dentalclinic.model.ToothRecord;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.repository.ToothRecordRepository;
import com.dentalclinic.service.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service handling Patient demographics, search, and 32-tooth Odontogram chart.
 */
@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final ToothRecordRepository toothRecordRepository;

    public PatientServiceImpl(PatientRepository patientRepository, ToothRecordRepository toothRecordRepository) {
        this.patientRepository = patientRepository;
        this.toothRecordRepository = toothRecordRepository;
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    @Override
    public Optional<Patient> getPatientByCode(String code) {
        return patientRepository.findByPatientIdCode(code);
    }

    @Override
    public List<Patient> searchPatients(String query) {
        if (query == null || query.trim().isEmpty()) {
            return patientRepository.findAll();
        }
        return patientRepository.searchPatients(query.trim());
    }

    @Override
    public Patient createPatient(PatientRegistrationDto dto) {
        String patientId = "pat-" + UUID.randomUUID().toString().substring(0, 8);
        long count = patientRepository.count() + 101;
        String code = "SDC-2026-" + count;

        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setPatientIdCode(code);
        patient.setName(dto.getName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setEmergencyContactName(dto.getEmergencyContactName());
        patient.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        patient.setEmergencyContactRelation(dto.getEmergencyContactRelation());
        patient.setMedicalAlerts(dto.getMedicalAlerts() != null ? dto.getMedicalAlerts() : List.of());
        patient.setChiefComplaint(dto.getChiefComplaint());
        patient.setPreviousDentalHistory(dto.getPreviousDentalHistory());
        patient.setRegistrationDate(LocalDate.now());

        Patient saved = patientRepository.save(patient);

        // Initialize 32 healthy teeth for patient Odontogram (FDI / Universal adult notation)
        for (int tooth = 1; tooth <= 32; tooth++) {
            ToothRecord tr = new ToothRecord(
                    "tr-" + UUID.randomUUID().toString().substring(0, 8),
                    saved.getId(),
                    tooth,
                    ToothCondition.HEALTHY,
                    null
            );
            toothRecordRepository.save(tr);
        }

        return saved;
    }

    @Override
    public Patient updatePatient(String id, Patient patient) {
        patient.setId(id);
        return patientRepository.save(patient);
    }

    @Override
    public List<ToothRecord> getPatientDentalChart(String patientId) {
        return toothRecordRepository.findByPatientIdOrderByToothNumberAsc(patientId);
    }

    @Override
    public ToothRecord updateToothCondition(String patientId, ToothUpdateDto dto) {
        Optional<ToothRecord> existing = toothRecordRepository.findByPatientIdAndToothNumber(patientId, dto.getToothNumber());
        ToothRecord record;
        if (existing.isPresent()) {
            record = existing.get();
            record.setCondition(dto.getCondition());
            record.setNotes(dto.getNotes());
        } else {
            record = new ToothRecord(
                    "tr-" + UUID.randomUUID().toString().substring(0, 8),
                    patientId,
                    dto.getToothNumber(),
                    dto.getCondition(),
                    dto.getNotes()
            );
        }
        return toothRecordRepository.save(record);
    }
}
