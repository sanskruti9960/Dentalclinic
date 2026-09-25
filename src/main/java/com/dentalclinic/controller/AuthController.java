package com.dentalclinic.controller;

import com.dentalclinic.dto.AuthRequest;
import com.dentalclinic.dto.AuthResponse;
import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for User Authentication, Sign-in, and Patient Portal Registration.
 * Endpoints:
 * - POST /api/auth/login : Doctor / Patient Authentication
 * - POST /api/auth/register : New Patient Self-Registration
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = userService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody PatientRegistrationDto dto) {
        AuthResponse response = userService.registerPatient(dto);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
