# Smita Dental Clinic - Java Spring Boot Backend

Comprehensive Java Spring Boot 3 REST API for **Smita Dental Clinic**.
- **Sole Attending Doctor:** Dr. Smita Bevle, BDS, MDS (Prosthodontics & Oral Implantology)
- **Role Isolation:** Doctor (Practice Management, Master Schedule, Clinical Charting, Prescriptions) vs Patient (Private Portal, Appointment Self-booking, Digital Health Records, Invoicing)
- **Full CRUD:** Patients, Appointments, Prescriptions, Invoices, Clinical Records

## Architecture & Technology Stack
- **Framework:** Spring Boot 3.2.3
- **Language:** Java 17+
- **Persistence:** Spring Data JPA + Hibernate
- **Database:** H2 In-Memory (Dev) / PostgreSQL (Production)
- **Security:** Spring Security 6 with BCrypt & Role-based Access Control (`ROLE_DOCTOR`, `ROLE_PATIENT`)
- **Build Tool:** Maven

## Running the Java Backend
```bash
cd backend-java
mvn clean spring-boot:run
```
Server runs on: `http://localhost:8080`
H2 In-Memory DB Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:smitaclinicdb`, User: `sa`, Password: `password`)

## Core REST Endpoints & CRUD

### 1. Authentication & Patient Medical Intake
- `POST /api/auth/patient/signup`: Collects full patient intake (Demographics, Blood Group, Emergency Contact, Medical Alerts/Allergies, Chief Dental Complaint, Dental History) and feeds into database.
- `POST /api/auth/doctor/login`: Dedicated login for Dr. Smita Bevle (`dr.smitabevle@clinic.com` / `doctor123`).
- `POST /api/auth/patient/login`: Patient authentication into private portal.

### 2. Patients (CRUD)
- `GET /api/patients`: Doctor only - list all patients.
- `GET /api/patients/{id}`: Patient can view their own; Doctor can view any.
- `POST /api/patients`: Doctor only - add patient.
- `PUT /api/patients/{id}`: Update patient details.
- `DELETE /api/patients/{id}`: Doctor only - delete patient and cascade history.

### 3. Appointments (CRUD)
- `GET /api/appointments`: Doctor master schedule.
- `GET /api/appointments/patient/{patientId}`: Patient isolated appointment history.
- `POST /api/appointments?patientId={id}`: Book appointment with Dr. Smita Bevle.
- `PUT /api/appointments/{id}/reschedule`: Update appointment date/time.
- `PATCH /api/appointments/{id}/status`: Transition status (`CHECKED_IN`, `IN_CHAIR`, `COMPLETED`, `CANCELLED`).
- `DELETE /api/appointments/{id}`: Cancel/remove appointment.

### 4. Prescriptions (CRUD)
- `GET /api/prescriptions`: Doctor view.
- `GET /api/prescriptions/patient/{patientId}`: Patient view of digital prescriptions issued by Dr. Smita Bevle.
- `POST /api/prescriptions?patientId={id}`: Doctor creates new digital prescription.
- `DELETE /api/prescriptions/{id}`: Delete prescription.

### 5. Invoices & Billing (CRUD)
- `GET /api/invoices`: Doctor ledger.
- `GET /api/invoices/patient/{patientId}`: Patient balance and invoices.
- `POST /api/invoices?patientId={id}`: Generate itemized invoice.
- `POST /api/invoices/{id}/pay`: Record payment (Cash, Card, UPI, Bank Transfer).
- `DELETE /api/invoices/{id}`: Void/delete invoice.
