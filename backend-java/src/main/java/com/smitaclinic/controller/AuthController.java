package com.smitaclinic.controller;

import com.smitaclinic.model.Patient;
import com.smitaclinic.model.Role;
import com.smitaclinic.model.User;
import com.smitaclinic.repository.PatientRepository;
import com.smitaclinic.repository.UserRepository;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Comprehensive Patient Signup API:
     * Receives all necessary patient demographic, medical, emergency, and dental details
     * and feeds it into the database, generating a patient code and login account.
     */
    @PostMapping("/patient/signup")
    public ResponseEntity<?> registerPatient(@RequestBody PatientSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered."));
        }

        // 1. Create Patient User account
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "patient123"))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.ROLE_PATIENT)
                .build();
        user = userRepository.save(user);

        // 2. Generate Patient Code
        long count = patientRepository.count() + 101;
        String patientCode = "SDC-2026-" + String.format("%03d", count);

        // 3. Feed all necessary intake details into Patient entity
        Patient patient = Patient.builder()
                .patientCode(patientCode)
                .fullName(request.getFullName())
                .age(request.getAge())
                .gender(request.getGender())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .emergencyContactRelation(request.getEmergencyContactRelation())
                .medicalAlerts(request.getMedicalAlerts() != null ? request.getMedicalAlerts() : List.of())
                .chiefComplaint(request.getChiefComplaint())
                .previousDentalHistory(request.getPreviousDentalHistory())
                .registrationDate(LocalDate.now())
                .lastVisitDate(LocalDate.now())
                .totalSpent(0.0)
                .balanceDue(0.0)
                .user(user)
                .build();
        patient = patientRepository.save(patient);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Patient registered successfully",
                "patientCode", patientCode,
                "patientId", patient.getId(),
                "role", "ROLE_PATIENT"
        ));
    }

    /**
     * Doctor Login API: Exclusively for Dr. Smita Bevle
     */
    @PostMapping("/doctor/login")
    public ResponseEntity<?> doctorLogin(@RequestBody LoginRequest request) {
        // Enforce Dr. Smita Bevle credentials
        if ("dr.smitabevle@clinic.com".equalsIgnoreCase(request.getEmail()) && "doctor123".equals(request.getPassword())) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "doctorName", "Dr. Smita Bevle",
                    "role", "ROLE_DOCTOR",
                    "degree", "BDS, MDS (Prosthodontics & Oral Implantology)",
                    "regNo", "D-48921-MMC",
                    "token", "mock-jwt-token-dr-smita-bevle"
            ));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid Doctor credentials."));
    }

    /**
     * Patient Login API
     */
    @PostMapping("/patient/login")
    public ResponseEntity<?> patientLogin(@RequestBody LoginRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || userOpt.get().getRole() != Role.ROLE_PATIENT) {
            return ResponseEntity.status(401).body(Map.of("message", "Patient account not found."));
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid password."));
        }
        var patient = patientRepository.findByUserEmail(user.getEmail()).orElse(null);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "role", "ROLE_PATIENT",
                "patientId", patient != null ? patient.getId() : null,
                "patientCode", patient != null ? patient.getPatientCode() : "",
                "fullName", user.getFullName(),
                "token", "mock-jwt-token-patient-" + user.getId()
        ));
    }

    @Getter
    @Setter
    public static class PatientSignupRequest {
        private String fullName;
        private Integer age;
        private String gender;
        private String phone;
        private String email;
        private String password;
        private String address;
        private String bloodGroup;
        private String emergencyContactName;
        private String emergencyContactPhone;
        private String emergencyContactRelation;
        private List<String> medicalAlerts;
        private String chiefComplaint;
        private String previousDentalHistory;
    }

    @Getter
    @Setter
    public static class LoginRequest {
        private String email;
        private String password;
    }
}
