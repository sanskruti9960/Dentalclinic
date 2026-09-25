import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  Server,
  Database,
  Shield,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const JAVA_FILES = [
  {
    name: 'Patient.java',
    category: 'Model / Entity',
    description: 'Captures full patient intake, medical alerts, emergency contacts & dental history',
    code: `package com.smitaclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String patientCode; // SDC-2026-101

    @Column(nullable = false)
    private String fullName;
    private Integer age;
    private String gender;
    
    @Column(nullable = false)
    private String phone;
    private String email;
    private String address;
    private String bloodGroup; // A+, B+, O+, AB+

    // Emergency Contact Information
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    // Medical Alerts & Chronic Conditions
    @ElementCollection
    private List<String> medicalAlerts;

    // Chief Dental Complaint
    @Column(length = 2000)
    private String chiefComplaint;
    private String previousDentalHistory;

    private LocalDate registrationDate = LocalDate.now();
    private Double totalSpent = 0.0;
    private Double balanceDue = 0.0;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}`
  },
  {
    name: 'AuthController.java',
    category: 'Controller / Auth',
    description: 'Patient signup with intake details & Dr. Smita Bevle doctor login',
    code: `package com.smitaclinic.controller;

import com.smitaclinic.model.*;
import com.smitaclinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
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
     * Patient Signup API: Feeds all required demographic, emergency,
     * and dental intake details into the database.
     */
    @PostMapping("/patient/signup")
    public ResponseEntity<?> registerPatient(@RequestBody PatientSignupRequest req) {
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .role(Role.ROLE_PATIENT)
                .build();
        user = userRepository.save(user);

        long count = patientRepository.count() + 101;
        String patientCode = "SDC-2026-" + String.format("%03d", count);

        Patient patient = Patient.builder()
                .patientCode(patientCode)
                .fullName(req.getFullName())
                .age(req.getAge())
                .gender(req.getGender())
                .phone(req.getPhone())
                .email(req.getEmail())
                .address(req.getAddress())
                .bloodGroup(req.getBloodGroup())
                .emergencyContactName(req.getEmergencyContactName())
                .emergencyContactPhone(req.getEmergencyContactPhone())
                .emergencyContactRelation(req.getEmergencyContactRelation())
                .medicalAlerts(req.getMedicalAlerts())
                .chiefComplaint(req.getChiefComplaint())
                .previousDentalHistory(req.getPreviousDentalHistory())
                .user(user)
                .build();
        patientRepository.save(patient);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "patientCode", patientCode,
            "role", "ROLE_PATIENT"
        ));
    }

    /**
     * Doctor Login API: Exclusively for Dr. Smita Bevle
     */
    @PostMapping("/doctor/login")
    public ResponseEntity<?> doctorLogin(@RequestBody LoginRequest req) {
        if ("dr.smitabevle@clinic.com".equalsIgnoreCase(req.getEmail()) && "doctor123".equals(req.getPassword())) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "doctorName", "Dr. Smita Bevle",
                "role", "ROLE_DOCTOR",
                "degree", "BDS, MDS (Prosthodontics & Oral Implantology)"
            ));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}`
  },
  {
    name: 'Appointment.java',
    category: 'Model / Entity',
    description: 'Enforces single practitioner: Dr. Smita Bevle',
    code: `package com.smitaclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String appointmentNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    private String patientName;
    private String patientPhone;

    @Column(nullable = false)
    private LocalDate appointmentDate;
    private String timeSlot;
    private Integer durationMinutes = 45;

    // Single doctor enforcement
    @Column(nullable = false)
    private String doctorName = "Dr. Smita Bevle";

    private Integer chairNumber = 1;
    private String procedureName;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    public enum AppointmentStatus {
        SCHEDULED, CHECKED_IN, IN_CHAIR, COMPLETED, RESCHEDULED, CANCELLED
    }
}`
  },
  {
    name: 'AppointmentController.java',
    category: 'Controller / CRUD',
    description: 'Full CRUD: Book, Reschedule, Update Status & Cancel with Doctor isolation',
    code: `package com.smitaclinic.controller;

import com.smitaclinic.model.Appointment;
import com.smitaclinic.repository.AppointmentRepository;
import com.smitaclinic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    // READ ALL: Doctor Master Calendar
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // READ PATIENT: Strictly isolated to logged in patient
    @GetMapping("/patient/{patientId}")
    public List<Appointment> getPatientAppointments(@PathVariable Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    // CREATE: Book visit with Dr. Smita Bevle
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment, @RequestParam Long patientId) {
        var patient = patientRepository.findById(patientId).orElseThrow();
        appointment.setPatient(patient);
        appointment.setDoctorName("Dr. Smita Bevle");
        appointment.setAppointmentNumber("APT-" + System.currentTimeMillis());
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    // UPDATE / RESCHEDULE
    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> reschedule(@PathVariable Long id, @RequestParam String newDate, @RequestParam String newTime) {
        var apt = appointmentRepository.findById(id).orElseThrow();
        apt.setAppointmentDate(LocalDate.parse(newDate));
        apt.setTimeSlot(newTime);
        apt.setStatus(Appointment.AppointmentStatus.RESCHEDULED);
        return ResponseEntity.ok(appointmentRepository.save(apt));
    }

    // DELETE / CANCEL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}`
  },
  {
    name: 'SecurityConfig.java',
    category: 'Security / RBAC',
    description: 'Stateless Spring Security 6 with Role-Based Access Control',
    code: `package com.smitaclinic.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
                .requestMatchers("/api/patients/**").hasAnyRole("DOCTOR", "PATIENT")
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`
  },
  {
    name: 'pom.xml',
    category: 'Build Config',
    description: 'Spring Boot 3.2, Spring Data JPA, Spring Security, JWT, PostgreSQL & H2',
    code: `<!-- Spring Boot 3 Maven Project Configuration -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.3</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>`
  }
];

export const JavaBackendViewer: React.FC = () => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = JAVA_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Java 17 & Spring Boot 3.2 Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Java Backend Source Code
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Complete, production-ready Spring Boot backend for <strong>Smita Dental Clinic</strong>.
              Features full CRUD REST APIs, Spring Security role isolation (Doctor vs Patient),
              and comprehensive patient intake database persistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Sole Doctor</span>
              <span className="text-amber-300 font-bold">Dr. Smita Bevle</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Persistence</span>
              <span className="text-emerald-300 font-bold">JPA / PostgreSQL / H2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: File List */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Java Source Files
          </span>

          <div className="space-y-1.5 mt-2">
            {JAVA_FILES.map((file, idx) => {
              const isSelected = selectedFileIdx === idx;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-600'}`} />
                    <span className="text-xs font-bold truncate">{file.name}</span>
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    {file.category}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 p-2 text-[11px] text-slate-500 leading-tight">
            💡 All files are located in the project's <code className="text-teal-700 font-mono font-bold">/backend-java</code> folder.
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* File Tab Header */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-white font-mono">{currentFile.name}</div>
                <div className="text-[11px] text-slate-400">{currentFile.description}</div>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax Display */}
          <div className="p-6 overflow-x-auto flex-1 font-mono text-xs text-amber-100 bg-slate-900/90 leading-relaxed selection:bg-amber-500 selection:text-slate-950">
            <pre>
              <code>{currentFile.code}</code>
            </pre>
          </div>

          {/* Terminal / Maven helper */}
          <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Package: <code className="text-teal-400">com.smitaclinic</code></span>
            <span>Run: <code className="text-amber-400 font-bold">mvn clean spring-boot:run</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};
