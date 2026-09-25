package com.dentalclinic.service.impl;

import com.dentalclinic.dto.AuthRequest;
import com.dentalclinic.dto.AuthResponse;
import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.User;
import com.dentalclinic.model.UserRole;
import com.dentalclinic.repository.UserRepository;
import com.dentalclinic.service.NotificationService;
import com.dentalclinic.service.PatientService;
import com.dentalclinic.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Service implementation for User Authentication and Patient account linking.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PatientService patientService;
    private final NotificationService notificationService;

    public UserServiceImpl(UserRepository userRepository, PatientService patientService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.patientService = patientService;
        this.notificationService = notificationService;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, null, "No account found with this email address.", null);
        }

        User user = userOpt.get();
        // In academic prototype password verification (can be paired with BCryptPasswordEncoder)
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(false, null, "Invalid password credentials.", null);
        }

        String token = "JWT_" + UUID.randomUUID().toString().replace("-", "");
        return new AuthResponse(true, token, "Login successful as " + user.getRole(), user);
    }

    @Override
    public AuthResponse registerPatient(PatientRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail().toLowerCase().trim())) {
            return new AuthResponse(false, null, "An account with this email already exists.", null);
        }

        // 1. Create Patient Clinical Profile
        Patient patient = patientService.createPatient(dto);

        // 2. Create User Credentials
        String userId = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                userId,
                dto.getName(),
                dto.getEmail().toLowerCase().trim(),
                dto.getPhone(),
                dto.getPassword(),
                UserRole.PATIENT,
                patient.getId(),
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
        );
        userRepository.save(user);

        // Link User ID back to Patient
        patient.setUserId(userId);
        patientService.updatePatient(patient.getId(), patient);

        // Send Welcome SMS/Email alert
        notificationService.sendNotification(
                "SMS",
                patient.getName(),
                patient.getPhone(),
                "Welcome to Smita Dental Clinic",
                "Hello " + patient.getName() + ", your patient ID is " + patient.getPatientIdCode() + ". Book appointments 24/7 online.",
                patient.getId(),
                "PATIENT"
        );

        String token = "JWT_" + UUID.randomUUID().toString().replace("-", "");
        return new AuthResponse(true, token, "Registration successful!", user);
    }

    @Override
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim());
    }
}
