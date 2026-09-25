package com.smitaclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String appointmentNumber; // e.g. APT-20260923-01

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    private String patientName;
    private String patientPhone;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private String timeSlot; // e.g. "10:30 AM"

    private Integer durationMinutes = 45;

    // Single doctor enforcement
    @Column(nullable = false)
    private String doctorName = "Dr. Smita Bevle";

    private Integer chairNumber = 1; // Operatory 1

    @Column(nullable = false)
    private String procedureName; // e.g. Root Canal, Consultation, Implant

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    @Column(length = 1000)
    private String clinicalNotes;

    private String cancellationReason;

    public enum AppointmentStatus {
        SCHEDULED,
        CHECKED_IN,
        IN_CHAIR,
        COMPLETED,
        RESCHEDULED,
        CANCELLED
    }
}
