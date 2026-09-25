package com.dentalclinic.controller;

import com.dentalclinic.dto.AppointmentBookingRequest;
import com.dentalclinic.dto.AppointmentSlotDto;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.AppointmentStatus;
import com.dentalclinic.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Multi-Chair Appointments & Patient Slot Booking.
 *
 * Implements real-time occupied schedule visibility so patients can
 * inspect Dr. Smita Bevle's busy chairs and pick available time slots.
 */
@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    /**
     * View Doctor's occupied schedule & available slots for any date.
     * Accessible by both patients (to pick slots) and doctors.
     */
    @GetMapping("/slots")
    public ResponseEntity<List<AppointmentSlotDto>> getDoctorSlots(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(appointmentService.getDoctorScheduleSlots(queryDate));
    }

    /**
     * Get appointments scheduled on a given date.
     */
    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(queryDate));
    }

    /**
     * Get all appointments for a specific patient.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable String patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(patientId));
    }

    /**
     * Book a new chair appointment.
     */
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody AppointmentBookingRequest request) {
        try {
            Appointment booked = appointmentService.bookAppointment(request);
            return ResponseEntity.ok(booked);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Progress appointment status (SCHEDULED -> CHECKED_IN -> IN_CHAIR -> COMPLETED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        AppointmentStatus status = AppointmentStatus.valueOf(body.get("status").toUpperCase());
        String notes = body.get("notes");
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status, notes));
    }

    /**
     * Cancel an appointment with cancellation reason.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Cancelled by user");
        appointmentService.cancelAppointment(id, reason);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
    }
}
