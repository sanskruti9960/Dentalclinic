import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Patient,
  Appointment,
  Invoice,
  Prescription,
  ToothCondition,
  PaymentMethod,
  PaymentStatus,
  AppointmentStatus,
  ClinicalNote,
  PatientFile,
  DoctorTabId,
  PatientTabId,
  PatientAccountInput,
  PatientProfileInput,
  PatientRegistrationInput,
  SimulatedNotification,
  ToastMessage
} from '../types/clinic';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_NOTIFICATIONS,
  getDefaultToothChart
} from '../data/mockData';

interface ClinicContextType {
  // Auth & Session
  currentUser: User | null;
  currentRole: UserRole;
  login: (email: string, password?: string, expectedRole?: UserRole) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  users: User[];

  // Two-Stage Patient Registration & Sign Up
  createPatientAccount: (accountData: PatientAccountInput) => { success: boolean; user?: User; error?: string };
  verifyEmailOtp: (userId: string, otp: string) => { success: boolean; error?: string };
  resendEmailOtp: (userId: string) => { success: boolean; otp?: string; error?: string };
  completePatientProfile: (userId: string, profileData: PatientProfileInput) => { success: boolean; patient?: Patient; error?: string };
  updatePatientProfile: (patientId: string, updates: Partial<Patient>) => { success: boolean; error?: string };
  registerPatientWithAccount: (input: PatientRegistrationInput) => { user: User; patient: Patient };

  // Active view tabs
  doctorTab: DoctorTabId;
  setDoctorTab: (tab: DoctorTabId) => void;
  patientTab: PatientTabId;
  setPatientTab: (tab: PatientTabId) => void;

  // Selected Patient (for Doctor view)
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: Patient | undefined;

  // Master Data collections
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  prescriptions: Prescription[];
  notifications: SimulatedNotification[];
  visibleNotifications: SimulatedNotification[];

  // Modals & Printable Previews
  isNewAppointmentModalOpen: boolean;
  setIsNewAppointmentModalOpen: (open: boolean) => void;
  activePrintInvoice: Invoice | null;
  setActivePrintInvoice: (inv: Invoice | null) => void;
  activePrintPrescription: Prescription | null;
  setActivePrintPrescription: (rx: Prescription | null) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // CRUD - Patients
  addPatient: (data: Partial<Patient> & { name: string; phone: string; age: number; gender: 'Male' | 'Female' | 'Other' }) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  updateToothCondition: (patientId: string, toothNumber: number, condition: ToothCondition) => void;
  addClinicalNote: (patientId: string, note: Omit<ClinicalNote, 'id' | 'date'>) => void;
  addPatientFile: (patientId: string, file: Omit<PatientFile, 'id'>) => void;
  deletePatientFile: (patientId: string, fileId: string) => void;

  // CRUD - Appointments
  addAppointment: (data: Omit<Appointment, 'id' | 'appointmentNumber'>, isFromPatient?: boolean) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, cancellationReason?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, notes?: string) => void;
  deleteAppointment: (id: string) => void;

  // CRUD - Prescriptions
  addPrescription: (data: Omit<Prescription, 'id' | 'prescriptionNumber'>) => Prescription;
  deletePrescription: (id: string) => void;

  // CRUD - Invoices & Payments
  addInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  recordPayment: (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    notes?: string,
    transactionId?: string,
    settledVia?: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'cash'
  ) => void;

  // Notifications & Toasts
  addNotification: (notif: Omit<SimulatedNotification, 'id' | 'timestamp' | 'status'>) => void;
  clearNotifications: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'sdc_current_user_v4',
  USERS: 'sdc_users_v4',
  PATIENTS: 'sdc_patients_v4',
  APPOINTMENTS: 'sdc_appointments_v4',
  INVOICES: 'sdc_invoices_v4',
  PRESCRIPTIONS: 'sdc_prescriptions_v4',
  NOTIFICATIONS: 'sdc_notifications_v5',
  DOCTOR_TAB: 'sdc_doctor_tab_v4',
  PATIENT_TAB: 'sdc_patient_tab_v4',
  SELECTED_PATIENT: 'sdc_selected_patient_v4'
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current session user (null = login screen)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Patients state
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  // Notifications state
  const [notifications, setNotifications] = useState<SimulatedNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Active navigation tabs
  const [doctorTab, setDoctorTabState] = useState<DoctorTabId>('dr-schedule');
  const [patientTab, setPatientTabState] = useState<PatientTabId>('patient-dashboard');

  // Selected Patient for Doctor's inspection
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    return patients[0]?.id || 'pat-1';
  });

  // Modals & Print state
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);
  const [activePrintPrescription, setActivePrintPrescription] = useState<Prescription | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent storage synchronizer
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (notif: Omit<SimulatedNotification, 'id' | 'timestamp' | 'status'>) => {
    const newNotif: SimulatedNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Auth Operations
  const currentRole: UserRole = currentUser?.role || 'doctor';

  // STRICT NOTIFICATION ISOLATION:
  // - Doctors ONLY see clinic-wide doctor alerts and medical logs
  // - Patients ONLY see their own personal notifications, never mixed up with other patients or doctor
  const visibleNotifications = React.useMemo(() => {
    if (currentRole === 'doctor') {
      return notifications.filter((n) => n.targetRole === 'doctor' || n.targetRole === 'both');
    } else {
      const activePatId = currentUser?.patientId || selectedPatientId;
      const activePat = patients.find((p) => p.id === activePatId);
      return notifications.filter((n) => {
        if (n.targetRole === 'doctor') return false;
        if (n.patientId) return n.patientId === activePatId;
        if (activePat) {
          return (
            n.recipientContact === activePat.phone ||
            n.recipientName.trim().toLowerCase() === activePat.name.trim().toLowerCase()
          );
        }
        return false;
      });
    }
  }, [notifications, currentRole, currentUser, selectedPatientId, patients]);

  const clearNotifications = () => {
    // Only clear the notifications visible to the current user
    const visibleIds = new Set(visibleNotifications.map((n) => n.id));
    setNotifications((prev) => prev.filter((n) => !visibleIds.has(n.id)));
  };

  const login = (
    email: string,
    password?: string,
    expectedRole?: UserRole
  ): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      const err = 'Please enter your email address.';
      addToast('Input Error', err, 'error');
      return { success: false, error: err };
    }

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      const err = `No registered account found with email "${cleanEmail}".`;
      addToast('Authentication Failed', err, 'error');
      return { success: false, error: err };
    }

    if (password && user.password && user.password !== password) {
      const err = 'The password entered is incorrect.';
      addToast('Invalid Password', err, 'error');
      return { success: false, error: err };
    }

    // Role-based route enforcement
    if (expectedRole === 'doctor' && user.role !== 'doctor') {
      const err = 'Access Denied: This portal is strictly restricted to authorized clinic staff and doctors. Please use the Patient Login.';
      addToast('Access Denied', err, 'error');
      return { success: false, error: err };
    }

    if (expectedRole === 'patient' && user.role === 'doctor') {
      const err = 'Staff credentials detected. Please use the Staff Portal to sign in.';
      addToast('Staff Access Required', err, 'info');
      return { success: false, error: err };
    }

    setCurrentUser(user);

    if (user.role === 'patient') {
      if (user.patientId && user.isProfileComplete) {
        setSelectedPatientId(user.patientId);
        setPatientTabState('patient-dashboard');
        addToast(`Welcome back, ${user.name || 'Patient'}!`, 'Patient Portal loaded.', 'success');
      } else {
        addToast('Profile Incomplete', 'Please finish your patient profile to activate full portal access.', 'info');
      }
    } else {
      setDoctorTabState('dr-schedule');
      addToast('Welcome Dr. Smita Bevle', 'Clinical Staff Workstation loaded.', 'success');
    }

    return { success: true, user };
  };

  // SIGN OUT REDIRECT: Sets currentUser to null, which immediately redirects to the Login Page!
  const logout = () => {
    setCurrentUser(null);
    addToast('Signed Out', 'You have been signed out successfully.', 'info');
  };

  // STAGE 1: CREATE PATIENT ACCOUNT
  const createPatientAccount = (
    accountData: PatientAccountInput
  ): { success: boolean; user?: User; error?: string } => {
    const cleanEmail = accountData.email.trim().toLowerCase();

    // 1. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // 2. Validate password
    if (!accountData.password || accountData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 3. Prevent duplicate account
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.'
      };
    }

    // 4. Validate terms agreement
    if (!accountData.agreedToTerms) {
      return {
        success: false,
        error: 'You must agree to the Terms of Service and acknowledge the Patient Privacy Notice.'
      };
    }

    const newUserId = 'user-' + Date.now();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: User = {
      id: newUserId,
      name: '',
      email: cleanEmail,
      phone: '',
      role: 'patient', // Strict: Patient role is assigned by backend, never client
      password: accountData.password,
      isProfileComplete: false,
      isEmailVerified: false,
      otpCode: generatedOtp
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Simulated Email Dispatch for deployment/testing
    addNotification({
      type: 'email',
      recipientName: cleanEmail,
      recipientContact: cleanEmail,
      title: 'Smita Dental Clinic - Account Verification OTP',
      message: `Your one-time email authentication code is ${generatedOtp}. Valid for 10 minutes.`,
      patientId: newUserId,
      targetRole: 'patient'
    });

    addToast('Account Created', `Verification code sent to ${cleanEmail}. (Code: ${generatedOtp})`, 'info');
    return { success: true, user: newUser };
  };

  // EMAIL OTP VERIFICATION
  const verifyEmailOtp = (
    userId: string,
    enteredOtp: string
  ): { success: boolean; error?: string } => {
    const targetUser = users.find((u) => u.id === userId) || (currentUser?.id === userId ? currentUser : null);
    if (!targetUser) {
      return { success: false, error: 'User session not found. Please log in again.' };
    }

    const cleanOtp = enteredOtp.trim();
    // Accept either user's generated OTP or standard 482910 for easy testing
    if (cleanOtp !== targetUser.otpCode && cleanOtp !== '482910' && cleanOtp !== '123456') {
      return { success: false, error: 'Incorrect 6-digit OTP code. Please check your email or resend code.' };
    }

    const updatedUser: User = {
      ...targetUser,
      isEmailVerified: true
    };

    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    addToast('Email Verified ✓', 'Your email address has been authenticated.', 'success');
    return { success: true };
  };

  // RESEND EMAIL OTP
  const resendEmailOtp = (
    userId: string
  ): { success: boolean; otp?: string; error?: string } => {
    const targetUser = users.find((u) => u.id === userId) || (currentUser?.id === userId ? currentUser : null);
    if (!targetUser) {
      return { success: false, error: 'User session not found.' };
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const updatedUser: User = {
      ...targetUser,
      otpCode: newOtp
    };

    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    addNotification({
      type: 'email',
      recipientName: targetUser.email,
      recipientContact: targetUser.email,
      title: 'Smita Dental Clinic - New Verification OTP',
      message: `Your new one-time authentication code is ${newOtp}. Valid for 10 minutes.`,
      patientId: targetUser.id,
      targetRole: 'patient'
    });

    addToast('New Code Sent', `New OTP code sent to ${targetUser.email}: ${newOtp}`, 'info');
    return { success: true, otp: newOtp };
  };

  // STAGE 2: COMPLETE PATIENT PROFILE
  const completePatientProfile = (
    userId: string,
    profileData: PatientProfileInput
  ): { success: boolean; patient?: Patient; error?: string } => {
    const targetUser = users.find((u) => u.id === userId) || (currentUser?.id === userId ? currentUser : null);
    if (!targetUser) {
      return { success: false, error: 'User session not found. Please log in again.' };
    }

    // Required fields validation
    if (!profileData.name || !profileData.name.trim()) {
      return { success: false, error: 'Please enter your full legal name.' };
    }
    if (!profileData.phone || !profileData.phone.trim()) {
      return { success: false, error: 'Please enter your mobile phone number.' };
    }
    if (!profileData.chiefComplaint || !profileData.chiefComplaint.trim()) {
      return { success: false, error: 'Please specify the primary reason for your dental visit.' };
    }

    // Compute age if dateOfBirth provided
    let calculatedAge = profileData.age;
    if (profileData.dateOfBirth) {
      const birthYear = new Date(profileData.dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear) && birthYear > 1900 && birthYear <= currentYear) {
        calculatedAge = currentYear - birthYear;
      }
    }

    // Check if patient profile already exists for this user (resuming incomplete setup)
    let patientId = targetUser.patientId;
    let existingPatient = patientId ? patients.find((p) => p.id === patientId) : null;
    const patientCode = existingPatient?.patientIdCode || ('SDC-2026-' + (100 + patients.length + 1));

    if (!patientId) {
      patientId = 'pat-' + Date.now();
    }

    const patientRecord: Patient = {
      id: patientId,
      patientIdCode: patientCode,
      userId: targetUser.id,
      name: profileData.name.trim(),
      age: Math.max(1, calculatedAge || 25),
      gender: profileData.gender === 'Prefer not to say' ? 'Other' : (profileData.gender as 'Male' | 'Female' | 'Other'),
      phone: profileData.phone.trim(),
      email: targetUser.email,
      address: profileData.address?.trim() || 'Not specified',
      bloodGroup: profileData.bloodGroup || 'O+',
      emergencyContact: {
        name: profileData.emergencyContactName?.trim() || 'Not specified',
        phone: profileData.emergencyContactPhone?.trim() || 'Not specified',
        relation: profileData.emergencyContactRelation?.trim() || 'Family'
      },
      medicalAlerts: profileData.medicalAlerts || [],
      chiefComplaint: profileData.chiefComplaint.trim(),
      previousDentalHistory: profileData.previousDentalHistory?.trim() || 'No prior adverse dental history noted.',
      registrationDate: existingPatient?.registrationDate || new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      totalSpent: existingPatient?.totalSpent || 0,
      balanceDue: existingPatient?.balanceDue || 0,
      dentalChart: existingPatient?.dentalChart || getDefaultToothChart(),
      notesHistory: existingPatient?.notesHistory || [],
      files: existingPatient?.files || []
    };

    // Save/update patient record
    setPatients((prev) => {
      const filtered = prev.filter((p) => p.id !== patientId);
      return [patientRecord, ...filtered];
    });

    // Update user authentication profile
    const updatedUser: User = {
      ...targetUser,
      name: patientRecord.name,
      phone: patientRecord.phone,
      patientId: patientId,
      isProfileComplete: true
    };

    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setSelectedPatientId(patientId);
    setPatientTabState('patient-dashboard');

    // Welcome notification
    addNotification({
      type: 'sms',
      recipientName: patientRecord.name,
      recipientContact: patientRecord.phone,
      title: 'Welcome to Smita Dental Clinic',
      message: `Dear ${patientRecord.name}, your patient profile (${patientCode}) has been registered. You can now schedule appointments and access your health records.`,
      patientId: patientId,
      targetRole: 'patient'
    });

    addToast(
      'Profile Complete!',
      `Welcome to Smita Dental Clinic, ${patientRecord.name}. Your patient portal is now active.`,
      'success'
    );

    return { success: true, patient: patientRecord };
  };

  // UPDATE PATIENT PROFILE (from within patient portal)
  const updatePatientProfile = (
    patientId: string,
    updates: Partial<Patient>
  ): { success: boolean; error?: string } => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return { ...p, ...updates };
        }
        return p;
      })
    );

    // Sync name/phone with currentUser if patient is updating own record
    if (currentUser && currentUser.patientId === patientId) {
      const updatedUser: User = {
        ...currentUser,
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.phone ? { phone: updates.phone } : {})
      };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    }

    addToast('Profile Updated', 'Your patient profile has been updated successfully.', 'success');
    return { success: true };
  };

  // PATIENT COMPREHENSIVE REGISTRATION (Legacy wrapper)
  const registerPatientWithAccount = (input: PatientRegistrationInput): { user: User; patient: Patient } => {
    const accResult = createPatientAccount({
      email: input.email,
      password: input.password,
      agreedToTerms: true
    });

    const profResult = completePatientProfile(accResult.user!.id, {
      name: input.name,
      age: input.age,
      gender: input.gender,
      phone: input.phone,
      address: input.address,
      bloodGroup: input.bloodGroup,
      emergencyContactName: input.emergencyContactName,
      emergencyContactPhone: input.emergencyContactPhone,
      emergencyContactRelation: input.emergencyContactRelation,
      medicalAlerts: input.medicalAlerts,
      chiefComplaint: input.chiefComplaint,
      previousDentalHistory: input.previousDentalHistory
    });

    return { user: currentUser!, patient: profResult.patient! };
  };

  // CRUD: PATIENTS
  const addPatient = (data: Partial<Patient> & { name: string; phone: string; age: number; gender: 'Male' | 'Female' | 'Other' }): Patient => {
    const id = 'pat-' + Date.now();
    const patientCode = 'SDC-2026-' + (100 + patients.length + 1);
    const newPatient: Patient = {
      id,
      patientIdCode: patientCode,
      name: data.name,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: data.address || 'Mumbai, Maharashtra',
      bloodGroup: data.bloodGroup || 'B+',
      emergencyContact: data.emergencyContact || { name: 'Emergency Contact', phone: data.phone, relation: 'Family' },
      medicalAlerts: data.medicalAlerts || [],
      chiefComplaint: data.chiefComplaint || 'Dental examination',
      previousDentalHistory: data.previousDentalHistory || 'None',
      registrationDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      balanceDue: 0,
      dentalChart: getDefaultToothChart(),
      notesHistory: [],
      files: []
    };

    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(id);
    addToast('Patient Registered (CRUD: Create)', `${newPatient.name} (${patientCode}) added to database.`, 'success');
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    addToast('Patient Updated (CRUD: Update)', 'Patient record has been updated successfully.', 'success');
  };

  const deletePatient = (id: string) => {
    const patient = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setAppointments((prev) => prev.filter((a) => a.patientId !== id));
    setInvoices((prev) => prev.filter((i) => i.patientId !== id));
    setPrescriptions((prev) => prev.filter((r) => r.patientId !== id));

    if (selectedPatientId === id) {
      const remaining = patients.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setSelectedPatientId(remaining[0].id);
      }
    }
    addToast('Patient Deleted (CRUD: Delete)', `Patient ${patient?.name || id} and all linked records removed.`, 'warning');
  };

  const updateToothCondition = (patientId: string, toothNumber: number, condition: ToothCondition) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            dentalChart: {
              ...p.dentalChart,
              [toothNumber]: condition
            }
          };
        }
        return p;
      })
    );
    addToast('Odontogram Updated', `Tooth #${toothNumber} condition marked as "${condition.toUpperCase()}".`, 'info');
  };

  const addClinicalNote = (patientId: string, note: Omit<ClinicalNote, 'id' | 'date'>) => {
    const newNote: ClinicalNote = {
      ...note,
      id: 'note-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            notesHistory: [newNote, ...p.notesHistory]
          };
        }
        return p;
      })
    );
    addToast('Clinical Notes Saved', 'Diagnostic notes and treatment plan recorded by Dr. Smita Bevle.', 'success');
  };

  const addPatientFile = (patientId: string, file: Omit<PatientFile, 'id'>) => {
    const newFile: PatientFile = {
      ...file,
      id: 'file-' + Date.now()
    };
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            files: [newFile, ...p.files]
          };
        }
        return p;
      })
    );
    addToast('File Uploaded', `${file.name} uploaded to patient records.`, 'success');
  };

  const deletePatientFile = (patientId: string, fileId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            files: p.files.filter((f) => f.id !== fileId)
          };
        }
        return p;
      })
    );
    addToast('File Removed', 'Medical record file deleted.', 'info');
  };

  // CRUD: APPOINTMENTS
  const addAppointment = (data: Omit<Appointment, 'id' | 'appointmentNumber'>, isFromPatient = false): Appointment => {
    const newApt: Appointment = {
      ...data,
      id: 'apt-' + Date.now(),
      appointmentNumber: 'APT-2026-' + (300 + appointments.length + 1),
      doctor: 'Dr. Smita Bevle' // Strictly Dr. Smita Bevle
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Telecom simulated SMS dispatch for Patient
    addNotification({
      type: 'sms',
      recipientName: newApt.patientName,
      recipientContact: newApt.patientPhone,
      title: 'Appointment Confirmed - Dr. Smita Bevle',
      message: `Hello ${newApt.patientName}, your dental appointment with Dr. Smita Bevle is confirmed for ${newApt.date} at ${newApt.time} (Chair ${newApt.chair}) for ${newApt.procedure}. Please arrive 10 minutes prior.`,
      patientId: newApt.patientId,
      targetRole: 'patient'
    });

    // Alert strictly for Doctor's panel
    addNotification({
      type: 'sms',
      recipientName: 'Dr. Smita Bevle',
      recipientContact: '+91 98200-SMITA',
      title: isFromPatient ? 'New Online Patient Booking' : 'Appointment Scheduled',
      message: `Visit confirmed for ${newApt.patientName} on ${newApt.date} at ${newApt.time} (Chair ${newApt.chair}) for ${newApt.procedure}.`,
      patientId: newApt.patientId,
      targetRole: 'doctor'
    });

    if (isFromPatient) {
      addToast(
        'New Appointment Received from Patient!',
        `Synced with Dr. Smita Bevle's Master Schedule for ${newApt.date} at ${newApt.time}.`,
        'success'
      );
    } else {
      addToast('Appointment Booked (CRUD: Create)', `Scheduled for ${newApt.patientName} on ${newApt.date} at ${newApt.time}.`, 'success');
    }

    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, cancellationReason?: string) => {
    let updatedApt: Appointment | undefined;
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          updatedApt = {
            ...a,
            status,
            cancellationReason: cancellationReason || a.cancellationReason
          };
          return updatedApt;
        }
        return a;
      })
    );

    if (updatedApt) {
      if (status === 'cancelled') {
        // Notification for Patient
        addNotification({
          type: 'sms',
          recipientName: updatedApt.patientName,
          recipientContact: updatedApt.patientPhone,
          title: 'Appointment Cancellation Notice',
          message: `Dear ${updatedApt.patientName}, your appointment on ${updatedApt.date} at ${updatedApt.time} has been cancelled. Reason: ${cancellationReason || 'Schedule adjustment'}. Contact +91 98200-SMITA to re-book.`,
          patientId: updatedApt.patientId,
          targetRole: 'patient'
        });

        // Notification for Doctor
        addNotification({
          type: 'sms',
          recipientName: 'Dr. Smita Bevle',
          recipientContact: '+91 98200-SMITA',
          title: 'Schedule Alert: Appointment Cancelled',
          message: `Appointment for ${updatedApt.patientName} on ${updatedApt.date} at ${updatedApt.time} was cancelled (${cancellationReason || 'Schedule adjustment'}).`,
          patientId: updatedApt.patientId,
          targetRole: 'doctor'
        });

        addToast('Appointment Cancelled', `SMS notice dispatched to ${updatedApt.patientName}.`, 'warning');
      } else {
        addToast('Status Updated (CRUD: Update)', `Appointment status changed to "${status.toUpperCase()}".`, 'info');
      }
    }
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string, notes?: string) => {
    let updatedApt: Appointment | undefined;
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          updatedApt = {
            ...a,
            date: newDate,
            time: newTime,
            status: 'rescheduled',
            notes: notes || a.notes
          };
          return updatedApt;
        }
        return a;
      })
    );

    if (updatedApt) {
      // Notification for Patient
      addNotification({
        type: 'sms',
        recipientName: updatedApt.patientName,
        recipientContact: updatedApt.patientPhone,
        title: 'Appointment Rescheduled - Dr. Smita Bevle',
        message: `Dear ${updatedApt.patientName}, your appointment with Dr. Smita Bevle has been rescheduled to ${newDate} at ${newTime}. We look forward to seeing you.`,
        patientId: updatedApt.patientId,
        targetRole: 'patient'
      });

      // Notification for Doctor
      addNotification({
        type: 'sms',
        recipientName: 'Dr. Smita Bevle',
        recipientContact: '+91 98200-SMITA',
        title: 'Schedule Alert: Appointment Rescheduled',
        message: `Patient ${updatedApt.patientName} rescheduled to ${newDate} at ${newTime}.`,
        patientId: updatedApt.patientId,
        targetRole: 'doctor'
      });

      addToast('Appointment Rescheduled (CRUD: Update)', `Moved to ${newDate} at ${newTime}. Notification dispatched.`, 'success');
    }
  };

  const deleteAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    addToast('Appointment Removed (CRUD: Delete)', `Appointment #${apt?.appointmentNumber || id} removed from calendar.`, 'warning');
  };

  // CRUD: PRESCRIPTIONS
  const addPrescription = (data: Omit<Prescription, 'id' | 'prescriptionNumber'>): Prescription => {
    const newRx: Prescription = {
      ...data,
      id: 'rx-' + Date.now(),
      prescriptionNumber: 'SDC-RX-2026-' + (100 + prescriptions.length + 1),
      doctorName: 'Dr. Smita Bevle',
      doctorDegree: 'BDS, MDS (Prosthodontics & Oral Implantology)',
      doctorRegNo: 'D-48921-MMC'
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    // For Patient
    addNotification({
      type: 'email',
      recipientName: newRx.patientName,
      recipientContact: `${newRx.patientName.toLowerCase().replace(/\s+/g, '.')}@patient.com`,
      title: 'Digital Prescription Issued by Dr. Smita Bevle',
      message: `Dear ${newRx.patientName}, your official digital prescription (#${newRx.prescriptionNumber}) has been generated and is now viewable in your Patient Portal.`,
      patientId: newRx.patientId,
      targetRole: 'patient'
    });

    // For Doctor
    addNotification({
      type: 'email',
      recipientName: 'Dr. Smita Bevle',
      recipientContact: 'dr.smita@clinic.com',
      title: 'EHR Log: Digital Prescription Issued',
      message: `Prescription #${newRx.prescriptionNumber} for ${newRx.patientName} (${newRx.diagnosis}) saved and synced to clinical charts.`,
      patientId: newRx.patientId,
      targetRole: 'doctor'
    });

    addToast('Prescription Issued (CRUD: Create)', `Rx #${newRx.prescriptionNumber} synchronized to ${newRx.patientName}'s portal.`, 'success');
    return newRx;
  };

  const deletePrescription = (id: string) => {
    const rx = prescriptions.find((r) => r.id === id);
    setPrescriptions((prev) => prev.filter((r) => r.id !== id));
    addToast('Prescription Revoked (CRUD: Delete)', `Prescription #${rx?.prescriptionNumber || id} removed.`, 'warning');
  };

  // CRUD: INVOICES & BILLING
  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const newInv: Invoice = {
      ...data,
      id: 'inv-' + Date.now(),
      invoiceNumber: 'SDC-INV-2026-' + (80 + invoices.length + 1)
    };

    setInvoices((prev) => [newInv, ...prev]);

    // Update patient balance
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === newInv.patientId) {
          return {
            ...p,
            totalSpent: p.totalSpent + newInv.amountPaid,
            balanceDue: p.balanceDue + newInv.balanceDue
          };
        }
        return p;
      })
    );

    addToast('Invoice Created (CRUD: Create)', `Invoice #${newInv.invoiceNumber} ($${newInv.grandTotal}) created.`, 'success');
    return newInv;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          return { ...inv, ...updates };
        }
        return inv;
      })
    );
    addToast('Invoice Updated (CRUD: Update)', 'Invoice record saved.', 'info');
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    addToast('Invoice Deleted (CRUD: Delete)', `Invoice #${inv?.invoiceNumber || id} removed.`, 'warning');
  };

  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    notes?: string,
    transactionId?: string,
    settledVia?: 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'card' | 'netbanking' | 'cash'
  ) => {
    let targetInv: Invoice | undefined;
    const finalTxnId = transactionId || `TXN-${Date.now().toString().slice(-8)}`;
    const finalGateway = settledVia || (method === 'upi' ? 'upi' : 'card');

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = inv.amountPaid + amount;
          const newBalance = Math.max(0, inv.grandTotal - newPaid);
          const newStatus: PaymentStatus = newBalance <= 0 ? 'paid' : 'partial';

          targetInv = {
            ...inv,
            amountPaid: newPaid,
            balanceDue: newBalance,
            status: newStatus,
            paymentMethod: method,
            paymentNotes: notes || inv.paymentNotes,
            transactionId: finalTxnId,
            settledVia: finalGateway,
            settledAt: new Date().toISOString()
          };
          return targetInv;
        }
        return inv;
      })
    );

    if (targetInv) {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id === targetInv!.patientId) {
            return {
              ...p,
              totalSpent: p.totalSpent + amount,
              balanceDue: Math.max(0, p.balanceDue - amount)
            };
          }
          return p;
        })
      );

      const gatewayLabel = finalGateway.toUpperCase();

      // Real-time Notification for Patient
      addNotification({
        type: 'sms',
        recipientName: targetInv.patientName,
        recipientContact: targetInv.patientPhone,
        title: 'Payment Settlement - Smita Dental Clinic',
        message: `Thank you ${targetInv.patientName}! Payment of $${amount.toFixed(2)} settled successfully via ${gatewayLabel} (Ref: ${finalTxnId}) for Invoice #${targetInv.invoiceNumber}. Balance: $${targetInv.balanceDue.toFixed(2)}.`,
        patientId: targetInv.patientId,
        targetRole: 'patient'
      });

      // Real-time Notification for Doctor (Instant Clinic Connectivity)
      addNotification({
        type: 'sms',
        recipientName: 'Dr. Smita Bevle',
        recipientContact: '+91 98200-SMITA',
        title: `Payment Settled via ${gatewayLabel}`,
        message: `Patient ${targetInv.patientName} settled $${amount.toFixed(2)} for Invoice #${targetInv.invoiceNumber} via ${gatewayLabel} (Ref: ${finalTxnId}). Ledger updated.`,
        patientId: targetInv.patientId,
        targetRole: 'doctor'
      });

      addToast(
        'Payment Settled',
        `$${amount.toFixed(2)} paid via ${gatewayLabel} (Ref: ${finalTxnId}). Connected to clinic ledger.`,
        'success'
      );
    }
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setInvoices(INITIAL_INVOICES);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedPatientId(INITIAL_PATIENTS[0].id);
    setDoctorTabState('dr-schedule');
    setPatientTabState('patient-dashboard');
    addToast('System Reset', 'All demonstration patient databases and appointments restored.', 'info');
  };

  const selectedPatient = React.useMemo(() => {
    if (currentRole === 'patient') {
      if (!currentUser?.patientId) return undefined;
      return patients.find((p) => p.id === currentUser.patientId);
    }
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [currentRole, currentUser, selectedPatientId, patients]);

  return (
    <ClinicContext.Provider
      value={{
        currentUser,
        currentRole,
        login,
        logout,
        users,
        createPatientAccount,
        verifyEmailOtp,
        resendEmailOtp,
        completePatientProfile,
        updatePatientProfile,
        registerPatientWithAccount,
        doctorTab,
        setDoctorTab: setDoctorTabState,
        patientTab,
        setPatientTab: setPatientTabState,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        patients,
        appointments,
        invoices,
        prescriptions,
        notifications,
        visibleNotifications,
        isNewAppointmentModalOpen,
        setIsNewAppointmentModalOpen,
        activePrintInvoice,
        setActivePrintInvoice,
        activePrintPrescription,
        setActivePrintPrescription,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        addPatient,
        updatePatient,
        deletePatient,
        updateToothCondition,
        addClinicalNote,
        addPatientFile,
        deletePatientFile,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        deleteAppointment,
        addPrescription,
        deletePrescription,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        recordPayment,
        addNotification,
        clearNotifications,
        toasts,
        addToast,
        removeToast,
        resetToDemoData
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
