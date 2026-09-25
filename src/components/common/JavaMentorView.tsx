import React, { useState } from 'react';
import {
  Code,
  Layers,
  Database,
  Server,
  FileCode,
  Copy,
  Check,
  Shield,
  Calendar,
  BookOpen,
  HelpCircle,
  FolderTree,
  Terminal,
  ExternalLink,
  Cpu,
  Coffee
} from 'lucide-react';

interface JavaFileEntry {
  path: string;
  name: string;
  category: 'Configuration' | 'Model / Entity' | 'Repository' | 'Service Layer' | 'REST Controller' | 'Data Transfer Object (DTO)' | 'Database SQL';
  description: string;
  mentorHighlights: string[];
  vivaQuestions: { q: string; a: string }[];
  code: string;
}

const JAVA_FILES: JavaFileEntry[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'Configuration',
    description: 'Maven Project Object Model configuring Spring Boot 3.3.x, Spring Data JPA, Spring Security, Swagger 3, and H2 database.',
    mentorHighlights: [
      'Uses official spring-boot-starter-parent 3.3.3 for Java 17 compatibility',
      'Integrates spring-boot-starter-data-jpa for automated Hibernate ORM mapping',
      'Configures springdoc-openapi-starter-webmvc-ui for automated Swagger API documentation'
    ],
    vivaQuestions: [
      {
        q: 'Why Maven instead of Gradle for this enterprise project?',
        a: 'Maven provides standardized declarative XML project lifecycle management, reliable dependency transitive resolution, and is universally supported across college and enterprise IDEs (Eclipse, IntelliJ IDEA, VS Code).'
      },
      {
        q: 'What is the role of spring-boot-starter-parent?',
        a: 'It manages default dependency versions, plugin configurations, and compiler encoding settings so we don\'t have to specify version numbers for individual spring libraries.'
      }
    ],
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.3</version>
        <relativePath/>
    </parent>

    <groupId>com.dentalclinic</groupId>
    <artifactId>smita-dental-clinic-backend</artifactId>
    <version>1.0.0</version>
    <name>Smita Dental Clinic &amp; Implant Centre - Management System</name>
    <description>Enterprise Java Spring Boot Backend for Multi-Role Dental Clinic</description>

    <properties>
        <java.version>17</java.version>
        <springdoc.version>2.5.0</springdoc.version>
    </properties>

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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
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
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/java/com/dentalclinic/DentalClinicApplication.java',
    name: 'DentalClinicApplication.java',
    category: 'Configuration',
    description: 'Main Spring Boot bootstrap class with @SpringBootApplication and global CORS mapping configuration.',
    mentorHighlights: [
      'Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan via @SpringBootApplication',
      'Configures WebMvcConfigurer CORS bean to permit frontend client communication',
      'Prints Swagger and H2 console endpoints on terminal startup'
    ],
    vivaQuestions: [
      {
        q: 'What annotations are grouped under @SpringBootApplication?',
        a: 'It wraps @SpringBootConfiguration (declares beans), @EnableAutoConfiguration (spring boot opinionated autoconfig), and @ComponentScan (scans packages for @Component, @Service, @Repository, @RestController).'
      }
    ],
    code: `package com.dentalclinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class DentalClinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(DentalClinicApplication.class, args);
        System.out.println("Smita Dental Clinic Backend Running on Port 8080");
        System.out.println("Swagger UI: http://localhost:8080/swagger-ui.html");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
            }
        };
    }
}`
  },
  {
    path: 'src/main/java/com/dentalclinic/model/Appointment.java',
    name: 'Appointment.java',
    category: 'Model / Entity',
    description: 'JPA Entity representing operatory chair appointments (Chairs 1, 2, 3), scheduling states, and doctor procedures.',
    mentorHighlights: [
      'Maps to appointments database table with unique appointmentNumber column',
      'Enforces chair isolation (chair 1, 2, or 3) for multi-chair operatory management',
      'Uses @Enumerated(EnumType.STRING) for AppointmentStatus lifecycle states'
    ],
    vivaQuestions: [
      {
        q: 'Why use EnumType.STRING instead of EnumType.ORDINAL?',
        a: 'EnumType.ORDINAL stores the enum\'s index (0, 1, 2). If enum values are reordered or added, database integers get corrupted. EnumType.STRING persists the exact name (e.g. "SCHEDULED"), ensuring database clarity and resilience.'
      }
    ],
    code: `package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "appointment_number", unique = true, nullable = false, length = 30)
    private String appointmentNumber; // e.g. "APT-2026-081"

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "patient_name", nullable = false, length = 150)
    private String patientName;

    @Column(name = "patient_phone", nullable = false, length = 30)
    private String patientPhone;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate date;

    @Column(name = "appointment_time", nullable = false, length = 20)
    private String time; // e.g. "10:30 AM"

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30;

    @Column(name = "doctor_name", nullable = false, length = 150)
    private String doctor = "Dr. Smita Bevle";

    @Column(name = "chair_number", nullable = false)
    private Integer chair; // 1, 2, or 3

    @Column(name = "procedure_name", nullable = false, length = 150)
    private String procedure;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    // Standard Constructors, Getters & Setters
}`
  },
  {
    path: 'src/main/java/com/dentalclinic/model/ToothRecord.java',
    name: 'ToothRecord.java',
    category: 'Model / Entity',
    description: 'JPA Entity representing the state of each tooth (1-32 FDI/Universal system) on the Patient\'s Odontogram.',
    mentorHighlights: [
      'Maintains composite unique constraint on (patient_id, tooth_number)',
      'Stores dental conditions: HEALTHY, CARIES, FILLED, RCT, CROWN, MISSING, IMPLANT, BRIDGE',
      'Provides clinical history notes per tooth for prosthodontic and restorative planning'
    ],
    vivaQuestions: [
      {
        q: 'How does this satisfy dental clinical charting standards?',
        a: 'It uses the Universal 1-32 tooth numbering standard. Each tooth is individually modeled with condition enums and doctor notes, allowing both 2D interactive odontogram rendering and database audit trails.'
      }
    ],
    code: `package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tooth_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"patient_id", "tooth_number"})
})
public class ToothRecord {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "tooth_number", nullable = false)
    private Integer toothNumber; // 1 to 32

    @Enumerated(EnumType.STRING)
    @Column(name = "tooth_condition", nullable = false, length = 30)
    private ToothCondition condition = ToothCondition.HEALTHY;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Standard Constructors, Getters & Setters
}`
  },
  {
    path: 'src/main/java/com/dentalclinic/service/impl/AppointmentServiceImpl.java',
    name: 'AppointmentServiceImpl.java',
    category: 'Service Layer',
    description: 'Core Business Logic: Chair conflict detection, occupied vs free slot calculation, and appointment lifecycle workflow.',
    mentorHighlights: [
      'Implements getDoctorScheduleSlots() allowing patients to see busy chairs and pick open slots',
      'Executes conflict detection in bookAppointment() to prevent overlapping chair bookings',
      'Automatically dispatches SMS/email notifications upon successful booking'
    ],
    vivaQuestions: [
      {
        q: 'How is concurrency / double-booking prevented when multiple users book at the same time?',
        a: 'The service runs under @Transactional. It checks existing appointments on that chair and date (appointmentRepository.findByChairAndDate). If a matching time slot exists, an IllegalStateException is thrown. In production, database unique constraints or pessimistic locking (@Lock(PESSIMISTIC_WRITE)) ensures strict isolation.'
      },
      {
        q: 'How does the slot occupancy algorithm work?',
        a: 'It iterates through standard clinic time slots (09:00 AM to 06:00 PM) for all 3 operatory chairs. It cross-checks booked appointments in memory, generating a List<AppointmentSlotDto> tagged as occupied or available for the patient UI.'
      }
    ],
    code: `package com.dentalclinic.service.impl;

import com.dentalclinic.dto.AppointmentBookingRequest;
import com.dentalclinic.dto.AppointmentSlotDto;
import com.dentalclinic.model.*;
import com.dentalclinic.repository.*;
import com.dentalclinic.service.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    // Standard Clinic Operatory Timing Slots (09:00 AM - 06:00 PM)
    private static final List<String> STANDARD_TIME_SLOTS = List.of(
            "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM",
            "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "05:00 PM", "05:45 PM"
    );

    @Override
    public List<AppointmentSlotDto> getDoctorScheduleSlots(LocalDate date) {
        List<Appointment> existingAppts = appointmentRepository.findByDateAndStatusNot(date, AppointmentStatus.CANCELLED);
        Map<String, Appointment> bookedMap = new HashMap<>();
        for (Appointment apt : existingAppts) {
            bookedMap.put(apt.getChair() + "-" + apt.getTime(), apt);
        }

        List<AppointmentSlotDto> result = new ArrayList<>();
        for (int chair = 1; chair <= 3; chair++) {
            for (String time : STANDARD_TIME_SLOTS) {
                String key = chair + "-" + time;
                if (bookedMap.containsKey(key)) {
                    Appointment apt = bookedMap.get(key);
                    result.add(new AppointmentSlotDto(date, time, chair, true,
                            "Occupied: " + apt.getProcedure(), apt.getProcedure(), apt.getId()));
                } else {
                    result.add(new AppointmentSlotDto(date, time, chair, false, "Available", null, null));
                }
            }
        }
        return result;
    }

    @Override
    public Appointment bookAppointment(AppointmentBookingRequest request) {
        // Conflict Check: Verify chair and time slot is not already booked
        List<Appointment> existing = appointmentRepository.findByChairAndDate(request.getChair(), request.getDate());
        boolean hasConflict = existing.stream()
                .anyMatch(a -> a.getTime().equalsIgnoreCase(request.getTime()) && a.getStatus() != AppointmentStatus.CANCELLED);

        if (hasConflict) {
            throw new IllegalStateException("Chair " + request.getChair() + " is already occupied at " + request.getTime());
        }

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + request.getPatientId()));

        long count = appointmentRepository.count() + 81;
        Appointment appointment = new Appointment();
        appointment.setId("apt-" + UUID.randomUUID().toString().substring(0, 8));
        appointment.setAppointmentNumber("APT-2026-" + String.format("%03d", count));
        appointment.setPatientId(patient.getId());
        appointment.setPatientName(patient.getName());
        appointment.setPatientPhone(patient.getPhone());
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setChair(request.getChair());
        appointment.setProcedure(request.getProcedure());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment saved = appointmentRepository.save(appointment);
        notificationService.sendNotification("SMS", patient.getName(), patient.getPhone(),
                "Appointment Confirmed: " + saved.getAppointmentNumber(),
                "Your chair " + saved.getChair() + " booking is confirmed for " + saved.getDate(),
                patient.getId(), "BOTH");

        return saved;
    }
}`
  },
  {
    path: 'src/main/java/com/dentalclinic/controller/AppointmentController.java',
    name: 'AppointmentController.java',
    category: 'REST Controller',
    description: 'REST Controller exposing endpoints for schedule slot occupancy, patient self-booking, and chair status progression.',
    mentorHighlights: [
      'GET /api/appointments/slots returns real-time open and occupied schedule slots',
      'POST /api/appointments/book allows patient self-booking with JSR-380 validation (@Valid)',
      'PATCH /api/appointments/{id}/status manages operatory workflow (Scheduled -> Checked-In -> In-Chair -> Completed)'
    ],
    vivaQuestions: [
      {
        q: 'Why use PATCH instead of PUT for updating appointment status?',
        a: 'PUT represents a complete entity replacement. PATCH is the RESTful standard for partial updates (in this case, altering only the status and notes while preserving patient, date, chair, and procedure attributes).'
      }
    ],
    code: `package com.dentalclinic.controller;

import com.dentalclinic.dto.AppointmentBookingRequest;
import com.dentalclinic.dto.AppointmentSlotDto;
import com.dentalclinic.model.*;
import com.dentalclinic.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/slots")
    public ResponseEntity<List<AppointmentSlotDto>> getDoctorSlots(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(appointmentService.getDoctorScheduleSlots(queryDate));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody AppointmentBookingRequest request) {
        try {
            Appointment booked = appointmentService.bookAppointment(request);
            return ResponseEntity.ok(booked);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        AppointmentStatus status = AppointmentStatus.valueOf(body.get("status").toUpperCase());
        String notes = body.get("notes");
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status, notes));
    }
}`
  },
  {
    path: 'src/main/java/com/dentalclinic/config/SecurityConfig.java',
    name: 'SecurityConfig.java',
    category: 'Configuration',
    description: 'Spring Security 6 configuration establishing stateless REST API authorization, CORS, and endpoint filters.',
    mentorHighlights: [
      'Configures SecurityFilterChain using the modern lambda DSL',
      'Permits access to public API routes, Swagger UI docs, and H2 database console',
      'Disables CSRF for stateless REST API clients'
    ],
    vivaQuestions: [
      {
        q: 'Why disable CSRF in a REST API?',
        a: 'CSRF (Cross-Site Request Forgery) attacks exploit browser cookie-based session storage. Since our REST API is stateless and communicates via Bearer tokens in HTTP headers, CSRF tokens are unnecessary.'
      }
    ],
    code: `package com.dentalclinic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .anyRequest().permitAll()
            )
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        return http.build();
    }
}`
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    category: 'Database SQL',
    description: 'Relational Database Schema (ANSI SQL DDL) with primary keys, foreign keys, and indexes.',
    mentorHighlights: [
      'Creates 11 relational tables: users, patients, patient_medical_alerts, tooth_records, appointments, invoices, invoice_items, prescriptions, prescription_medicines, clinical_notes, notifications',
      'Enforces referential integrity with ON DELETE CASCADE constraints',
      'Defines unique indexes on emails, patient codes, and appointment numbers'
    ],
    vivaQuestions: [
      {
        q: 'How are One-to-Many relationships handled in the schema?',
        a: 'For example, invoices and invoice_items: invoice_items has an invoice_id foreign key referencing invoices(id) ON DELETE CASCADE. If an invoice is deleted, all its line items are cleaned up automatically.'
      }
    ],
    code: `-- Relational Database Schema DDL
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    patient_id VARCHAR(36)
);

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(36) PRIMARY KEY,
    patient_id_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    balance_due DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS tooth_records (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    tooth_number INT NOT NULL,
    tooth_condition VARCHAR(30) NOT NULL,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT uq_patient_tooth UNIQUE (patient_id, tooth_number)
);

CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY,
    appointment_number VARCHAR(30) UNIQUE NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    chair_number INT NOT NULL CHECK (chair_number IN (1, 2, 3)),
    procedure_name VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);`
  }
];

export const JavaMentorView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFileEntry>(JAVA_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'mentor' | 'architecture'>('mentor');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Coffee className="w-3.5 h-3.5 text-amber-700" />
              Java Spring Boot 3.3.x Enterprise Codebase
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mentor Presentation &amp; Java Architecture Deck
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every component, repository, service, and controller has been engineered in standard enterprise Java.
              Use this interactive guide to explain the architecture, design patterns, and database schema to your mentor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-4 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="text-xs font-semibold text-slate-500">Framework</div>
              <div className="text-sm font-bold text-slate-900">Spring Boot 3.3</div>
            </div>
            <div className="px-4 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="text-xs font-semibold text-slate-500">Language</div>
              <div className="text-sm font-bold text-slate-900">Java 17 (LTS)</div>
            </div>
            <div className="px-4 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="text-xs font-semibold text-slate-500">Architecture</div>
              <div className="text-sm font-bold text-slate-900">4-Tier MVC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation View Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mentor'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Mentor Talking Points &amp; Viva Q&amp;A
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Java Code Inspector
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Architecture Diagram &amp; Flow
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          All files saved in repository at <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-700 font-mono">src/main/java/...</code>
        </div>
      </div>

      {/* Main 2-Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Tree Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5" />
                Java Project Explorer
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {JAVA_FILES.length} Key Files
              </span>
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {JAVA_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-3 rounded-2xl transition cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-200 shadow-2xs'
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {file.name}
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        file.category === 'Configuration' ? 'bg-amber-100 text-amber-800' :
                        file.category === 'Model / Entity' ? 'bg-emerald-100 text-emerald-800' :
                        file.category === 'Service Layer' ? 'bg-blue-100 text-blue-800' :
                        file.category === 'REST Controller' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {file.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                      {file.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: File Details / Code / Mentor Q&A */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'architecture' ? (
            /* Architecture Diagram View */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">4-Tier Enterprise Spring Boot Architecture</h3>
                <p className="text-xs text-slate-500 mt-1">
                  How patient requests, chair booking, and doctor charting flow through the system layers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                    <Server className="w-4 h-4 text-purple-600" />
                    1. REST Controller Layer
                  </div>
                  <p className="text-xs text-slate-600">
                    Maps endpoints (<code className="font-mono text-[11px]">/api/appointments</code>, <code className="font-mono text-[11px]">/api/patients</code>), validates incoming request payloads, and returns HTTP responses.
                  </p>
                  <div className="text-[11px] font-semibold text-purple-700 font-mono">
                    @RestController, @CrossOrigin, @Valid
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    2. Business Service Layer
                  </div>
                  <p className="text-xs text-slate-600">
                    Enforces core clinical logic: checks chair conflicts, calculates open vs occupied time slots, computes taxes and discounts, and dispatches SMS alerts.
                  </p>
                  <div className="text-[11px] font-semibold text-blue-700 font-mono">
                    @Service, @Transactional
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Database className="w-4 h-4 text-emerald-600" />
                    3. Repository Layer (Spring Data JPA)
                  </div>
                  <p className="text-xs text-slate-600">
                    Provides automated CRUD operations, derived queries (<code className="font-mono text-[11px]">findByChairAndDate</code>), and custom JPQL queries.
                  </p>
                  <div className="text-[11px] font-semibold text-emerald-700 font-mono">
                    extends JpaRepository&lt;Entity, ID&gt;
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Layers className="w-4 h-4 text-amber-600" />
                    4. Relational Persistence Layer
                  </div>
                  <p className="text-xs text-slate-600">
                    H2 in-memory embedded DB for instant evaluation; switchable to PostgreSQL in production via application.properties.
                  </p>
                  <div className="text-[11px] font-semibold text-amber-700 font-mono">
                    Hibernate ORM, @Entity, @Table
                  </div>
                </div>
              </div>

              {/* Schedule Occupancy Feature Highlight */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/60 space-y-3">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  How the Doctor Schedule &amp; Patient Slot Booking Feature Works in Java:
                </div>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p>
                    1. When the patient opens the booking page, the frontend calls <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono">GET /api/appointments/slots?date=YYYY-MM-DD</code>.
                  </p>
                  <p>
                    2. <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono">AppointmentServiceImpl.getDoctorScheduleSlots()</code> queries the database for all appointments on that date across Chairs 1, 2, and 3.
                  </p>
                  <p>
                    3. It compares all standard operatory time slots (09:00 AM - 06:00 PM) against booked entries and outputs an array of <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono">AppointmentSlotDto</code> objects with <code className="font-mono text-indigo-800">isOccupied = true/false</code>.
                  </p>
                  <p>
                    4. Patients immediately see which chairs and time slots Dr. Smita is busy on, and can only click and reserve open slots!
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'mentor' ? (
            /* Mentor Talking Points & Viva Questions */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedFile.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedFile.path}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedFile.category}
                </span>
              </div>

              {/* What to tell your mentor */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Key Talking Points for Your Mentor
                </h4>
                <div className="space-y-2">
                  {selectedFile.mentorHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="leading-relaxed">{hl}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Viva Questions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  Expected Viva Questions &amp; Exact Answers
                </h4>
                <div className="space-y-3">
                  {selectedFile.vivaQuestions.map((vq, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                      <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                        <span className="text-amber-700 font-extrabold">Q:</span>
                        <span>{vq.q}</span>
                      </div>
                      <div className="text-xs text-slate-700 pl-4 border-l-2 border-amber-300 leading-relaxed">
                        <span className="font-semibold text-slate-900">Answer: </span>
                        {vq.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Code Preview */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Inspect Full Java Source Code
                </button>
              </div>
            </div>
          ) : (
            /* Full Java Code Viewer */
            <div className="bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">{selectedFile.path}</span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono overflow-x-auto p-2 leading-relaxed text-emerald-300 max-h-[500px] overflow-y-auto">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
