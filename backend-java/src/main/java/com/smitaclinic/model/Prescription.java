package com.smitaclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String prescriptionNumber; // e.g. RX-2026-418

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    private String patientName;
    private Integer patientAge;
    private String patientGender;

    private LocalDate prescriptionDate = LocalDate.now();

    // Sole Doctor: Dr. Smita Bevle
    private String doctorName = "Dr. Smita Bevle";
    private String doctorDegree = "BDS, MDS (Prosthodontics & Oral Implantology)";
    private String doctorRegNo = "D-48921-MMC";

    @Column(length = 2000)
    private String diagnosis;

    @ElementCollection
    @CollectionTable(name = "prescription_medicines", joinColumns = @JoinColumn(name = "prescription_id"))
    private List<PrescriptionMedicineItem> medicines = new ArrayList<>();

    @Column(length = 2000)
    private String generalAdvice;

    private String nextFollowUp;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PrescriptionMedicineItem {
        private String medicineName;
        private String strength;
        private String dosage;
        private String duration;
        private String timing; // "Before Food" or "After Food"
        private String instructions;
    }
}
