package com.smitaclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String patientCode; // e.g. SDC-2026-101

    @Column(nullable = false)
    private String fullName;

    private Integer age;

    private String gender;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(length = 1000)
    private String address;

    private String bloodGroup; // A+, B+, O+, AB+, etc.

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    // Medical Alerts & Systemic Conditions
    @ElementCollection
    @CollectionTable(name = "patient_medical_alerts", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "alert_condition")
    private List<String> medicalAlerts = new ArrayList<>();

    // Chief Dental Complaint & Past Dental History
    @Column(length = 2000)
    private String chiefComplaint;

    @Column(length = 2000)
    private String previousDentalHistory;

    private LocalDate registrationDate = LocalDate.now();

    private LocalDate lastVisitDate = LocalDate.now();

    private Double totalSpent = 0.0;

    private Double balanceDue = 0.0;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prescription> prescriptions = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invoice> invoices = new ArrayList<>();
}
