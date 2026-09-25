package com.smitaclinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Smita Dental Clinic - Main Spring Boot Application Entry Point
 * 
 * Lead Dental Surgeon: Dr. Smita Bevle (BDS, MDS)
 * Features: Role-based isolation (Doctor vs Patient), CRUD on Patients,
 * Appointments, Prescriptions, Odontogram Records, and Financial Invoicing.
 */
@SpringBootApplication
public class SmitaDentalClinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmitaDentalClinicApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" Smita Dental Clinic Backend Running on Port 8080");
        System.out.println(" Sole Practitioner: Dr. Smita Bevle (BDS, MDS)");
        System.out.println(" H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("==================================================");
    }
}
