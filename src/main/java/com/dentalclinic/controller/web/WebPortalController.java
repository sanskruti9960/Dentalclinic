package com.dentalclinic.controller.web;

import com.dentalclinic.dto.AppointmentSlotDto;
import com.dentalclinic.model.*;
import com.dentalclinic.service.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring MVC Web Controller rendering the Java Frontend Views using Thymeleaf.
 * 
 * Enforces the complete Java Full-Stack architecture:
 * Injects business domain objects into org.springframework.ui.Model and returns
 * server-side rendered HTML templates with Tailwind CSS styling and the exact same UI/UX.
 */
@Controller
@RequestMapping("/portal")
public class WebPortalController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final BillingService billingService;
    private final PrescriptionService prescriptionService;
    private final NotificationService notificationService;

    public WebPortalController(PatientService patientService,
                               AppointmentService appointmentService,
                               BillingService billingService,
                               PrescriptionService prescriptionService,
                               NotificationService notificationService) {
        this.patientService = patientService;
        this.appointmentService = appointmentService;
        this.billingService = billingService;
        this.prescriptionService = prescriptionService;
        this.notificationService = notificationService;
    }

    /**
     * Auth Login Page
     */
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("title", "Smita Dental Clinic - Login");
        return "auth/login";
    }

    /**
     * Doctor Master Operatory Schedule View
     * Displays Chairs 1, 2, 3 and status progression.
     */
    @GetMapping("/doctor/schedule")
    public String showDoctorSchedule(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Model model) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        List<Appointment> dailyAppointments = appointmentService.getAppointmentsByDate(queryDate);
        List<AppointmentSlotDto> operatorySlots = appointmentService.getDoctorScheduleSlots(queryDate);

        model.addAttribute("currentDate", queryDate);
        model.addAttribute("appointments", dailyAppointments);
        model.addAttribute("slots", operatorySlots);
        model.addAttribute("doctorName", "Dr. Smita Bevle");
        model.addAttribute("regNo", "MH-DENT-48921");
        model.addAttribute("activeTab", "dr-schedule");

        return "doctor/schedule";
    }

    /**
     * Doctor Patient Database View
     */
    @GetMapping("/doctor/patients")
    public String showDoctorPatients(
            @RequestParam(value = "search", required = false) String search,
            Model model) {
        List<Patient> patients = (search != null && !search.trim().isEmpty())
                ? patientService.searchPatients(search)
                : patientService.getAllPatients();

        model.addAttribute("patients", patients);
        model.addAttribute("searchQuery", search);
        model.addAttribute("activeTab", "dr-patients");
        return "doctor/patients";
    }

    /**
     * Doctor Patient Detailed Chart & 32-Tooth Odontogram View
     */
    @GetMapping("/doctor/patient/{id}")
    public String showPatientClinicalDetail(@PathVariable String id, Model model) {
        Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + id));

        List<ToothRecord> dentalChart = patientService.getPatientDentalChart(id);
        List<Appointment> appointmentHistory = appointmentService.getAppointmentsForPatient(id);
        List<Invoice> invoiceHistory = billingService.getInvoicesForPatient(id);
        List<Prescription> prescriptionHistory = prescriptionService.getPrescriptionsForPatient(id);
        List<ClinicalNote> clinicalNotes = prescriptionService.getClinicalNotesForPatient(id);

        model.addAttribute("patient", patient);
        model.addAttribute("dentalChart", dentalChart);
        model.addAttribute("appointments", appointmentHistory);
        model.addAttribute("invoices", invoiceHistory);
        model.addAttribute("prescriptions", prescriptionHistory);
        model.addAttribute("clinicalNotes", clinicalNotes);
        model.addAttribute("activeTab", "dr-patients");

        return "doctor/patient-detail";
    }

    /**
     * Doctor Practice Ledger & Billing View
     */
    @GetMapping("/doctor/billing")
    public String showDoctorBilling(Model model) {
        List<Invoice> invoices = billingService.getAllInvoices();
        model.addAttribute("invoices", invoices);
        model.addAttribute("activeTab", "dr-billing");
        return "doctor/billing";
    }

    /**
     * Patient Self-Service Dashboard View
     */
    @GetMapping("/patient/dashboard")
    public String showPatientDashboard(
            @RequestParam(value = "patientId", defaultValue = "pat-101") String patientId,
            Model model) {
        Patient patient = patientService.getPatientById(patientId).orElse(null);
        List<Appointment> upcomingAppointments = appointmentService.getAppointmentsForPatient(patientId);
        List<Invoice> patientInvoices = billingService.getInvoicesForPatient(patientId);
        List<Prescription> patientPrescriptions = prescriptionService.getPrescriptionsForPatient(patientId);

        model.addAttribute("patient", patient);
        model.addAttribute("appointments", upcomingAppointments);
        model.addAttribute("invoices", patientInvoices);
        model.addAttribute("prescriptions", patientPrescriptions);
        model.addAttribute("activeTab", "patient-dashboard");

        return "patient/dashboard";
    }

    /**
     * Patient Live Schedule Booking View
     * Implements key feature: Patient views Dr. Smita's occupied schedule and books open slots.
     */
    @GetMapping("/patient/book")
    public String showPatientBookAppointment(
            @RequestParam(value = "patientId", defaultValue = "pat-101") String patientId,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Model model) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        Patient patient = patientService.getPatientById(patientId).orElse(null);
        List<AppointmentSlotDto> doctorSlots = appointmentService.getDoctorScheduleSlots(queryDate);

        model.addAttribute("patient", patient);
        model.addAttribute("selectedDate", queryDate);
        model.addAttribute("slots", doctorSlots);
        model.addAttribute("activeTab", "patient-book");

        return "patient/book";
    }

    /**
     * Patient Clinical Records & Digital Prescriptions View
     */
    @GetMapping("/patient/records")
    public String showPatientRecords(
            @RequestParam(value = "patientId", defaultValue = "pat-101") String patientId,
            Model model) {
        Patient patient = patientService.getPatientById(patientId).orElse(null);
        List<ToothRecord> dentalChart = patientService.getPatientDentalChart(patientId);
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsForPatient(patientId);
        List<ClinicalNote> notes = prescriptionService.getClinicalNotesForPatient(patientId);

        model.addAttribute("patient", patient);
        model.addAttribute("dentalChart", dentalChart);
        model.addAttribute("prescriptions", prescriptions);
        model.addAttribute("notes", notes);
        model.addAttribute("activeTab", "patient-records");

        return "patient/records";
    }

    /**
     * Patient Invoices & Online Receipts View
     */
    @GetMapping("/patient/billing")
    public String showPatientBilling(
            @RequestParam(value = "patientId", defaultValue = "pat-101") String patientId,
            Model model) {
        Patient patient = patientService.getPatientById(patientId).orElse(null);
        List<Invoice> invoices = billingService.getInvoicesForPatient(patientId);

        model.addAttribute("patient", patient);
        model.addAttribute("invoices", invoices);
        model.addAttribute("activeTab", "patient-billing");

        return "patient/billing";
    }
}
