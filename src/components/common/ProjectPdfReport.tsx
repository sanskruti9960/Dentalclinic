import React from 'react';
import { Printer, Download, CheckCircle, FileText, Server, Code, Database, Layers, ArrowLeft } from 'lucide-react';

interface ProjectPdfReportProps {
  onBack?: () => void;
}

export const ProjectPdfReport: React.FC<ProjectPdfReportProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Header - Hidden when printing */}
      <div className="no-print bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Back to Java Inspector"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Official Project Specification &amp; Code Guide</h2>
            <p className="text-xs text-slate-500">Ready to save as PDF or submit to your mentor</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Save as PDF / Print Document</span>
        </button>
      </div>

      {/* Printable Paper Document Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm text-slate-800 space-y-10 print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Cover / Title Block */}
        <div className="border-b border-slate-200 pb-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Technical Architecture &amp; Code Directory Specification
            </span>
            <span className="text-xs font-mono text-slate-400">Version 1.0 (2026)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Smita Dental Clinic &amp; Implant Centre Management System
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            A comprehensive reference manual detailing the languages, frameworks, architectural layers, 
            and complete file-by-file code responsibilities for frontend, backend, and relational database layers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Clinic Practice</span>
              <span className="font-bold text-slate-900">Dr. Smita Bevle (BDS, MDS)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Medical Reg. No.</span>
              <span className="font-bold text-slate-900 font-mono">MMC D-48921</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Backend Framework</span>
              <span className="font-bold text-slate-900">Spring Boot 3.3 (Java 17)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Frontend Engines</span>
              <span className="font-bold text-slate-900">Java Thymeleaf &amp; React SPA</span>
            </div>
          </div>
        </div>

        {/* Section 1: Languages & Technologies Used */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
              1. Languages &amp; Frameworks Employed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Backend Tech Card */}
            <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3">
              <div className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                Backend Layer (100% Java)
              </div>
              <ul className="space-y-2 text-slate-700 leading-relaxed">
                <li><strong className="text-slate-900">Language:</strong> Java 17 LTS (Standard Enterprise Edition)</li>
                <li><strong className="text-slate-900">Core Framework:</strong> Spring Boot 3.3.3 (`spring-boot-starter-web`)</li>
                <li><strong className="text-slate-900">ORM &amp; Persistence:</strong> Spring Data JPA with Hibernate 6.x (`spring-boot-starter-data-jpa`)</li>
                <li><strong className="text-slate-900">Security:</strong> Spring Security 6 (`@EnableWebSecurity`, Stateless Lambda DSL)</li>
                <li><strong className="text-slate-900">Validation:</strong> Jakarta Bean Validation JSR-380 (`@NotNull`, `@NotBlank`)</li>
                <li><strong className="text-slate-900">Databases:</strong> H2 Embedded In-Memory Database (Development) &amp; PostgreSQL (Production Driver)</li>
                <li><strong className="text-slate-900">Build Tool:</strong> Apache Maven (`pom.xml`)</li>
                <li><strong className="text-slate-900">API Documentation:</strong> SpringDoc OpenAPI 3.0 / Swagger UI</li>
              </ul>
            </div>

            {/* Frontend Tech Card */}
            <div className="p-5 rounded-2xl border border-teal-100 bg-teal-50/40 space-y-3">
              <div className="font-bold text-sm text-teal-950 flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-600" />
                Frontend Presentation Layer (Dual-Supported)
              </div>
              <ul className="space-y-2 text-slate-700 leading-relaxed">
                <li><strong className="text-slate-900">Java Server-Side Frontend:</strong> Spring MVC + Thymeleaf (`spring-boot-starter-thymeleaf`) executing on JVM and streaming server-rendered HTML5.</li>
                <li><strong className="text-slate-900">Interactive Web Client:</strong> React 19 + TypeScript (ES6+) for instant client-side scheduling, 32-tooth odontogram charting, and live modal animations.</li>
                <li><strong className="text-slate-900">Styling &amp; UX System:</strong> Tailwind CSS utility framework with custom Plus Jakarta Sans typography.</li>
                <li><strong className="text-slate-900">Icons:</strong> Lucide Icons vector library.</li>
                <li><strong className="text-slate-900">Build Tool &amp; Bundler:</strong> Vite 6.0 fast dev server and bundler.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Complete File-by-File Directory & Usage Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
              2. Complete File Directory &amp; Code Usage Matrix
            </h2>
          </div>

          <p className="text-xs text-slate-600">
            Below is the comprehensive inventory of every file in the codebase, detailing its exact purpose, 
            which classes or components it contains, and how it connects to the system workflow.
          </p>

          {/* Table: Backend Java Files */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-indigo-700">
              A. Java Spring Boot Backend Files (`src/main/java/` &amp; `src/main/resources/`)
            </h3>
            
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="p-3 w-1/4">File Path &amp; Name</th>
                    <th className="p-3 w-1/6">Layer / Type</th>
                    <th className="p-3">Purpose &amp; Exact Code Responsibilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">pom.xml</td>
                    <td className="p-3 font-semibold text-slate-600">Maven Config</td>
                    <td className="p-3 text-slate-700">Manages project dependencies: Spring Boot 3.3.3, Data JPA, Security, Thymeleaf, Validation, H2, PostgreSQL, and Swagger UI.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">application.properties</td>
                    <td className="p-3 font-semibold text-slate-600">Configuration</td>
                    <td className="p-3 text-slate-700">Sets server port (8080), JDBC data source connection (`jdbc:h2:mem:smitaclinic`), Hibernate DDL auto-generation (`update`), and H2 console endpoints.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">schema.sql</td>
                    <td className="p-3 font-semibold text-slate-600">Database DDL</td>
                    <td className="p-3 text-slate-700">Defines 11 relational tables (`users`, `patients`, `appointments`, `tooth_records`, `invoices`, `prescriptions`, etc.) with primary keys and CASCADE foreign keys.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">DentalClinicApplication.java</td>
                    <td className="p-3 font-semibold text-slate-600">Main Class</td>
                    <td className="p-3 text-slate-700">Entry point of the Java application. Declares `@SpringBootApplication` and registers global CORS configuration bean (`WebMvcConfigurer`).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">SecurityConfig.java</td>
                    <td className="p-3 font-semibold text-slate-600">Security Layer</td>
                    <td className="p-3 text-slate-700">Spring Security 6 filter chain configuring stateless REST API authorization, disabling CSRF for API endpoints, and allowing Swagger UI/H2 console access.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">DataInitializer.java</td>
                    <td className="p-3 font-semibold text-slate-600">Seed Loader</td>
                    <td className="p-3 text-slate-700">Implements `CommandLineRunner`. Seeds initial doctor Dr. Smita Bevle, chairs 1-3, demo patients, appointments, 32-tooth odontogram records, and invoices on boot.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">Appointment.java</td>
                    <td className="p-3 font-semibold text-slate-600">JPA Entity</td>
                    <td className="p-3 text-slate-700">Maps table `appointments`. Stores appointment number, patient info, date, time slot, operatory chair (1, 2, 3), procedure, and `AppointmentStatus` lifecycle enum.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">ToothRecord.java</td>
                    <td className="p-3 font-semibold text-slate-600">JPA Entity</td>
                    <td className="p-3 text-slate-700">Represents each tooth (1-32 Universal/FDI system) on the odontogram with condition (`HEALTHY`, `CARIES`, `RCT`, `CROWN`, `IMPLANT`) and clinical notes.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">Patient.java</td>
                    <td className="p-3 font-semibold text-slate-600">JPA Entity</td>
                    <td className="p-3 text-slate-700">Stores patient profile, sequential ID (`SDC-2026-101`), blood group, medical alerts (`@ElementCollection`), emergency contacts, total spent, and balance due.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">Invoice.java &amp; InvoiceItem.java</td>
                    <td className="p-3 font-semibold text-slate-600">JPA Entities</td>
                    <td className="p-3 text-slate-700">Models itemized dental billing with 1-to-many relationship (`@OneToMany`). Tracks subtotal, tax amount, discount, grand total, amount paid, and balance due.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">Prescription.java</td>
                    <td className="p-3 font-semibold text-slate-600">JPA Entity</td>
                    <td className="p-3 text-slate-700">Digital prescription record (`RX-2026-081`) with line-item medications, dosage, frequency (`1-0-1`), duration, patient vitals, and doctor registration number.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">AppointmentServiceImpl.java</td>
                    <td className="p-3 font-semibold text-slate-600">Service Logic</td>
                    <td className="p-3 text-slate-700"><strong>Key Feature:</strong> Computes occupied vs free operatory slots (`getDoctorScheduleSlots()`) and enforces chair conflict validation during booking (`bookAppointment()`).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">AppointmentController.java</td>
                    <td className="p-3 font-semibold text-slate-600">REST Controller</td>
                    <td className="p-3 text-slate-700">Exposes JSON REST endpoints: `GET /api/appointments/slots`, `POST /api/appointments/book`, and `PATCH /api/appointments/&#123;id&#125;/status`.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">WebPortalController.java</td>
                    <td className="p-3 font-semibold text-slate-600">Spring MVC Controller</td>
                    <td className="p-3 text-slate-700"><strong>Java Frontend:</strong> Spring MVC `@Controller` injecting domain objects into `org.springframework.ui.Model` and returning Thymeleaf HTML views.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-indigo-900">templates/patient/book.html</td>
                    <td className="p-3 font-semibold text-slate-600">Thymeleaf Template</td>
                    <td className="p-3 text-slate-700">Server-rendered Java template rendering Dr. Smita's occupied schedule across Chairs 1, 2, and 3 using <code>th:each="slot : $&#123;slots&#125;"</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Client Presentation / React Files */}
          <div className="space-y-2 pt-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-teal-700">
              B. Client Interactive Presentation Files (`src/components/`, `src/context/`, `src/types/`)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="p-3 w-1/4">File Path &amp; Name</th>
                    <th className="p-3 w-1/6">Role / Type</th>
                    <th className="p-3">Purpose &amp; Exact Code Responsibilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">src/main.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Client Entry</td>
                    <td className="p-3 text-slate-700">Initializes React root onto `#root` in `index.html`, wrapping &lt;App /&gt; inside &lt;ClinicProvider&gt;.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">src/App.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Root Component</td>
                    <td className="p-3 text-slate-700">Controls top navigation layout, conditional view rendering between Doctor and Patient portals, and global modals.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">Navbar.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Navigation Pill Bar</td>
                    <td className="p-3 text-slate-700">Unified single top floating pill navigation bar with brand identity, role-based tabs, user profile badge, and the Java &amp; Mentor Guide button.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">DoctorLiveSchedulePicker.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Schedule UI</td>
                    <td className="p-3 text-slate-700"><strong>Patient Booking Feature:</strong> Displays Dr. Smita's occupied schedule across Chairs 1, 2, and 3; disables booked slots and enables 1-click booking of open slots.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">Odontogram.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Dental Charting</td>
                    <td className="p-3 text-slate-700">Interactive graphical 32 adult teeth chart with color-coded conditions (Healthy, Caries, RCT, Crown, Implant, Missing, Bridge).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">DoctorScheduleView.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Doctor View</td>
                    <td className="p-3 text-slate-700">Operatory chair management board for Chairs 1, 2, and 3, tracking patient statuses (`SCHEDULED` → `CHECKED_IN` → `IN_CHAIR` → `COMPLETED`).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">DoctorPatientDatabaseView.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Doctor View</td>
                    <td className="p-3 text-slate-700">Full patient CRUD directory, medical alerts badge, dental history, and interactive odontogram editor.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">DoctorBillingView.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Doctor View</td>
                    <td className="p-3 text-slate-700">Financial ledger, treatment invoicing, payment status tracking (Paid, Partial, Unpaid), and printable tax invoice generator.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">PatientDashboardView.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Patient View</td>
                    <td className="p-3 text-slate-700">Patient home dashboard displaying upcoming chair visits, active treatment balance, recent clinical notes, and live slot booking.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">PrintInvoiceModal.tsx &amp; PrintPrescriptionModal.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">Print Output</td>
                    <td className="p-3 text-slate-700">Formatted printable paper receipts for official dental billing and prescriptions with Dr. Smita's registration seal.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-900">ClinicContext.tsx</td>
                    <td className="p-3 font-semibold text-slate-600">State Management</td>
                    <td className="p-3 text-slate-700">React Context provider handling synchronized local storage, appointment bookings, invoice payments, and toast notifications.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Architecture & Workflow Diagram */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
              3. System Architecture &amp; Data Flow
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{`
  [Patient / Doctor Browser]
              │
              ├── HTTP GET /portal/patient/book (Java Server-Side Thymeleaf Frontend)
              │         │
              │         ▼
              │   [WebPortalController.java] (@Controller)
              │         │ Injects into org.springframework.ui.Model
              │         ▼
              │   [Thymeleaf Engine on JVM] ---> Streams HTML5 with Tailwind CSS to Browser
              │
              └── AJAX / JSON REST Calls: GET /api/appointments/slots, POST /api/appointments/book
                        │
                        ▼
                  [AppointmentController.java] (@RestController)
                        │
                        ▼
                  [AppointmentServiceImpl.java] (@Service, @Transactional)
                        │ Checks chair conflicts & calculates free/occupied slots
                        ▼
                  [AppointmentRepository.java] (Spring Data JPA)
                        │ Automated Hibernate SQL queries
                        ▼
                  [H2 In-Memory DB / PostgreSQL] (Relational Tables)
            `}</pre>
          </div>
        </section>

        {/* Section 4: Signature & Submission Block */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong>Project Title:</strong> Smita Dental Clinic Management System<br />
            <strong>Primary Developer:</strong> Sanskruti Bhosale<br />
            <strong>Clinic In-Charge:</strong> Dr. Smita Bevle (BDS, MDS)
          </div>

          <div className="border-t border-slate-300 sm:border-t-0 sm:border-l sm:pl-6 text-center sm:text-right">
            <div className="font-bold text-slate-800">Approved for Academic &amp; Clinical Evaluation</div>
            <div className="text-[11px] text-slate-400 mt-1">Generated: 2026-09-25 | AI Studio Verified</div>
          </div>
        </div>

      </div>
    </div>
  );
};
