package com.dentalclinic.service;

import com.dentalclinic.dto.AuthRequest;
import com.dentalclinic.dto.AuthResponse;
import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.model.User;

import java.util.Optional;

public interface UserService {
    AuthResponse login(AuthRequest request);
    AuthResponse registerPatient(PatientRegistrationDto dto);
    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
}
