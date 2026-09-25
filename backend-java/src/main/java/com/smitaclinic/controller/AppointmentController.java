package com.smitaclinic.controller;

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

    // READ ALL: Doctor Master Schedule
    @GetMapping
    public List<Appointment> getAllAppointments(@RequestParam(required = false) String date) {
        if (date != null) {
            return appointmentRepository.findByAppointmentDate(LocalDate.parse(date));
        }
        return appointmentRepository.findAll();
    }

    // READ BY PATIENT: Isolated patient appointments
    @GetMapping("/patient/{patientId}")
    public List<Appointment> getPatientAppointments(@PathVariable Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    // CREATE: Book appointment (Always with Dr. Smita Bevle)
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment, @RequestParam Long patientId) {
        var patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        appointment.setPatient(patientOpt.get());
        appointment.setDoctorName("Dr. Smita Bevle"); // Single doctor
        appointment.setAppointmentNumber("APT-" + System.currentTimeMillis());
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    // UPDATE / RESCHEDULE
    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable Long id,
            @RequestParam String newDate,
            @RequestParam String newTime,
            @RequestParam(required = false) String notes) {
        return appointmentRepository.findById(id)
                .map(apt -> {
                    apt.setAppointmentDate(LocalDate.parse(newDate));
                    apt.setTimeSlot(newTime);
                    apt.setStatus(Appointment.AppointmentStatus.RESCHEDULED);
                    if (notes != null) apt.setClinicalNotes(apt.getClinicalNotes() + " | Rescheduled: " + notes);
                    return ResponseEntity.ok(appointmentRepository.save(apt));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE STATUS: Check-in, In Chair, Completed
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestParam Appointment.AppointmentStatus status,
            @RequestParam(required = false) String cancellationReason) {
        return appointmentRepository.findById(id)
                .map(apt -> {
                    apt.setStatus(status);
                    if (cancellationReason != null) apt.setCancellationReason(cancellationReason);
                    return ResponseEntity.ok(appointmentRepository.save(apt));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Permanently cancel/remove
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) return ResponseEntity.notFound().build();
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
