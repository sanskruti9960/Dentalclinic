package com.smitaclinic.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clinic_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ROLE_DOCTOR (Dr. Smita Bevle) or ROLE_PATIENT

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Patient patientProfile;

    private LocalDateTime createdAt = LocalDateTime.now();
}
