import { Patient, Appointment, Invoice, Prescription, ToothCondition, User, SimulatedNotification } from '../types/clinic';

export const getDefaultToothChart = (): Record<number, ToothCondition> => {
  const chart: Record<number, ToothCondition> = {};
  for (let i = 1; i <= 32; i++) {
    chart[i] = 'healthy';
  }
  return chart;
};

// Seeded Users supporting Doctor and Multiple Patients
export const INITIAL_USERS: User[] = [
  {
    id: 'user-doc-1',
    name: 'Dr. Smita Bevle',
    email: 'dr.smita@clinic.com',
    phone: '+91 98200 11223',
    role: 'doctor',
    password: 'doctor123',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'user-pat-1',
    name: 'Rahul Sharma',
    email: 'rahul@patient.com',
    phone: '+91 98201 44521',
    role: 'patient',
    patientId: 'pat-1',
    password: 'patient123'
  },
  {
    id: 'user-pat-2',
    name: 'Priya Mehta',
    email: 'priya@patient.com',
    phone: '+91 97112 88900',
    role: 'patient',
    patientId: 'pat-2',
    password: 'patient123'
  },
  {
    id: 'user-pat-3',
    name: 'Amit Patel',
    email: 'amit@patient.com',
    phone: '+91 98220 33410',
    role: 'patient',
    patientId: 'pat-3',
    password: 'patient123'
  },
  {
    id: 'user-pat-4',
    name: 'Sunita Rao',
    email: 'sunita@patient.com',
    phone: '+91 98230 77612',
    role: 'patient',
    patientId: 'pat-4',
    password: 'patient123'
  }
];

export const DENTAL_TARIFF_ITEMS = [
  { code: 'CON-01', description: 'Comprehensive Oral Consultation & RVG', price: 40 },
  { code: 'RAD-01', description: 'Digital RVG Periapical X-Ray', price: 25 },
  { code: 'RAD-02', description: 'Full Mouth Panoramic OPG X-Ray', price: 55 },
  { code: 'SCL-01', description: 'Ultrasonic Scaling & Dental Polishing', price: 85 },
  { code: 'RES-01', description: 'Composite Restorative Filling (Light Cure)', price: 110 },
  { code: 'RCT-01', description: 'Single-Visit Rotary Root Canal Therapy', price: 320 },
  { code: 'CRN-01', description: 'Monolithic Zirconia CAD/CAM Crown', price: 450 },
  { code: 'EXT-01', description: 'Surgical Wisdom Tooth Impaction Extraction', price: 220 },
  { code: 'IMP-01', description: 'Titanium Dental Implant Surgery (Stage 1)', price: 850 },
  { code: 'BLC-01', description: 'In-Office Laser Teeth Whitening', price: 300 }
];

export const STANDARD_DENTAL_DRUGS = [
  { name: 'Augmentin (Amoxicillin + Clavulanic Acid)', strength: '625 mg', defaultDosage: '1 tab 3 times daily (TDS)', defaultDuration: '5 Days', timing: 'After Food' as const, note: 'Complete full antibiotic course.' },
  { name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)', strength: '100mg/325mg/15mg', defaultDosage: '1 tab twice daily (BD)', defaultDuration: '3 Days', timing: 'After Food' as const, note: 'Take after meal for relief from discomfort and swelling.' },
  { name: 'Chlorhexidine Gluconate 0.2% Mouthwash', strength: '0.2% w/v', defaultDosage: '10 ml rinse twice daily', defaultDuration: '7 Days', timing: 'After Food' as const, note: 'Swish for 60 seconds; do not rinse with plain water immediately.' },
  { name: 'Pantocid (Pantoprazole)', strength: '40 mg', defaultDosage: '1 tab once daily', defaultDuration: '5 Days', timing: 'Before Food' as const, note: 'Take 30 mins before breakfast.' },
  { name: 'Metrogyl (Metronidazole)', strength: '400 mg', defaultDosage: '1 tab 3 times daily', defaultDuration: '5 Days', timing: 'After Food' as const, note: 'Avoid alcohol completely during course.' }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    patientIdCode: 'SDC-2026-088',
    userId: 'user-pat-1',
    name: 'Rahul Sharma',
    age: 38,
    gender: 'Male',
    phone: '+91 98201 44521',
    email: 'rahul@patient.com',
    address: 'Flat 402, Lotus Towers, Andheri West, Mumbai',
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'Sunita Sharma',
      phone: '+91 98201 44522',
      relation: 'Spouse'
    },
    medicalAlerts: ['Type II Diabetes', 'Mild Hypertension'],
    chiefComplaint: 'Severe throbbing pain in lower right back tooth radiating to ear especially at night.',
    previousDentalHistory: 'Previous fillings done 2 years ago; regular checkups.',
    registrationDate: '2026-01-12',
    lastVisitDate: '2026-09-24',
    totalSpent: 860,
    balanceDue: 240,
    dentalChart: {
      ...getDefaultToothChart(),
      30: 'caries',
      31: 'rct',
      19: 'filled'
    },
    notesHistory: [
      {
        id: 'note-1',
        patientId: 'pat-1',
        date: '2026-09-24',
        chiefComplaint: 'Severe spontaneous throbbing pain in lower right quadrant.',
        clinicalExamination: 'Deep disto-occlusal caries #30 extending to pulp chamber. Cold test lingers. Tenderness on vertical percussion (+).',
        radiographicFindings: 'Periapical radiolucency distal root apex #30.',
        proposedTreatment: 'Single-visit rotary RCT followed by full zirconia crown.',
        chairNumber: 1,
        attendingDoctor: 'Dr. Smita Bevle',
        toothNumbers: [30]
      }
    ],
    files: [
      {
        id: 'file-1',
        patientId: 'pat-1',
        name: 'Pre-op RVG Tooth 30 Periapical.jpg',
        category: 'X-Ray IOPA',
        date: '2026-09-24',
        size: '1.8 MB',
        url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        notes: 'Periapical radiolucency visible on distal apex of tooth #30.'
      }
    ]
  },
  {
    id: 'pat-2',
    patientIdCode: 'SDC-2026-092',
    userId: 'user-pat-2',
    name: 'Priya Mehta',
    age: 29,
    gender: 'Female',
    phone: '+91 97112 88900',
    email: 'priya@patient.com',
    address: 'C-12 sea breeze apts, Bandra West, Mumbai',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Karan Mehta',
      phone: '+91 97112 88901',
      relation: 'Brother'
    },
    medicalAlerts: ['Penicillin Allergy'],
    chiefComplaint: 'Interested in aesthetic smile enhancement and teeth whitening.',
    previousDentalHistory: 'Orthodontic braces completed 4 years ago.',
    registrationDate: '2026-02-05',
    lastVisitDate: '2026-09-24',
    totalSpent: 420,
    balanceDue: 0,
    dentalChart: {
      ...getDefaultToothChart(),
      8: 'healthy',
      9: 'healthy'
    },
    notesHistory: [
      {
        id: 'note-2',
        patientId: 'pat-2',
        date: '2026-09-24',
        chiefComplaint: 'Mild generalized tea/coffee extrinsic stains on enamel.',
        clinicalExamination: 'Good periodontal condition, healthy pink gingiva, no active caries.',
        proposedTreatment: 'In-office Zoom Laser whitening session with desensitizing gel.',
        chairNumber: 3,
        attendingDoctor: 'Dr. Smita Bevle'
      }
    ],
    files: []
  },
  {
    id: 'pat-3',
    patientIdCode: 'SDC-2026-095',
    userId: 'user-pat-3',
    name: 'Amit Patel',
    age: 52,
    gender: 'Male',
    phone: '+91 98220 33410',
    email: 'amit@patient.com',
    address: 'B-201, Green Heights, Powai, Mumbai',
    bloodGroup: 'A+',
    emergencyContact: {
      name: 'Neeta Patel',
      phone: '+91 98220 33411',
      relation: 'Spouse'
    },
    medicalAlerts: ['Hypertension'],
    chiefComplaint: 'Missing lower left molar, difficulty chewing on that side.',
    previousDentalHistory: 'Extraction of #19 done 6 months ago.',
    registrationDate: '2026-03-10',
    lastVisitDate: '2026-09-24',
    totalSpent: 1200,
    balanceDue: 450,
    dentalChart: {
      ...getDefaultToothChart(),
      19: 'missing'
    },
    notesHistory: [
      {
        id: 'note-3',
        patientId: 'pat-3',
        date: '2026-09-24',
        chiefComplaint: 'Edentulous space tooth #19.',
        clinicalExamination: 'Adequate alveolar bone ridge width and height on digital CBCT.',
        proposedTreatment: 'Titanium dental implant fixture placement tooth #19.',
        chairNumber: 1,
        attendingDoctor: 'Dr. Smita Bevle',
        toothNumbers: [19]
      }
    ],
    files: []
  },
  {
    id: 'pat-4',
    patientIdCode: 'SDC-2026-099',
    userId: 'user-pat-4',
    name: 'Sunita Rao',
    age: 44,
    gender: 'Female',
    phone: '+91 98230 77612',
    email: 'sunita@patient.com',
    address: '704 Palm Grove, Juhu, Mumbai',
    bloodGroup: 'AB+',
    emergencyContact: {
      name: 'Ramesh Rao',
      phone: '+91 98230 77613',
      relation: 'Spouse'
    },
    medicalAlerts: [],
    chiefComplaint: 'Routine annual checkup and cleaning.',
    previousDentalHistory: 'Regular cleanings every 12 months.',
    registrationDate: '2026-04-18',
    lastVisitDate: '2026-09-24',
    totalSpent: 180,
    balanceDue: 0,
    dentalChart: getDefaultToothChart(),
    notesHistory: [],
    files: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNumber: 'APT-2026-301',
    patientId: 'pat-1',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98201 44521',
    date: '2026-09-24',
    time: '10:00 AM',
    durationMinutes: 45,
    doctor: 'Dr. Smita Bevle',
    chair: 1,
    procedure: 'Root Canal Treatment (Step 1 - Access & BMP)',
    status: 'in-chair',
    notes: 'Tooth #30 acute pulpitis. LA administered.'
  },
  {
    id: 'apt-2',
    appointmentNumber: 'APT-2026-302',
    patientId: 'pat-2',
    patientName: 'Priya Mehta',
    patientPhone: '+91 97112 88900',
    date: '2026-09-24',
    time: '11:30 AM',
    durationMinutes: 30,
    doctor: 'Dr. Smita Bevle',
    chair: 3,
    procedure: 'In-Office Laser Teeth Whitening',
    status: 'checked-in',
    notes: 'Patient in reception waiting area.'
  },
  {
    id: 'apt-3',
    appointmentNumber: 'APT-2026-303',
    patientId: 'pat-3',
    patientName: 'Amit Patel',
    patientPhone: '+91 98220 33410',
    date: '2026-09-24',
    time: '03:00 PM',
    durationMinutes: 60,
    doctor: 'Dr. Smita Bevle',
    chair: 1,
    procedure: 'Titanium Dental Implant Surgery (Stage 1)',
    status: 'scheduled',
    notes: 'Implant surgery planned for site #19.'
  },
  {
    id: 'apt-4',
    appointmentNumber: 'APT-2026-304',
    patientId: 'pat-4',
    patientName: 'Sunita Rao',
    patientPhone: '+91 98230 77612',
    date: '2026-09-25',
    time: '11:00 AM',
    durationMinutes: 30,
    doctor: 'Dr. Smita Bevle',
    chair: 2,
    procedure: 'Ultrasonic Scaling & Dental Polishing',
    status: 'scheduled',
    notes: 'Annual hygiene recall.'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionNumber: 'SDC-RX-2026-104',
    patientId: 'pat-1',
    patientName: 'Rahul Sharma',
    patientAge: 38,
    patientGender: 'Male',
    date: '2026-09-24',
    doctorName: 'Dr. Smita Bevle',
    doctorDegree: 'BDS, MDS (Prosthodontics & Oral Implantology)',
    doctorRegNo: 'D-48921-MMC',
    diagnosis: 'Acute Irreversible Pulpitis #30 with Apical Periodontitis',
    vitals: {
      bp: '124/82 mmHg',
      pulse: '76 bpm'
    },
    medicines: [
      {
        id: 'med-1',
        name: 'Augmentin (Amoxicillin + Clavulanic Acid)',
        strength: '625 mg',
        dosage: '1 tab 3 times daily (TDS)',
        frequency: 'Every 8 hours',
        duration: '5 Days',
        timing: 'After Food',
        instructions: 'Complete full antibiotic course.'
      },
      {
        id: 'med-2',
        name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)',
        strength: '100mg/325mg/15mg',
        dosage: '1 tab twice daily (BD)',
        frequency: 'Morning & Night',
        duration: '3 Days',
        timing: 'After Food',
        instructions: 'Take after meal for relief from discomfort and swelling.'
      },
      {
        id: 'med-3',
        name: 'Chlorhexidine Gluconate 0.2% Mouthwash',
        strength: '0.2% w/v',
        dosage: '10 ml rinse BD',
        frequency: 'Twice daily',
        duration: '7 Days',
        timing: 'After Food',
        instructions: 'Swish for 60 seconds; do not rinse with plain water immediately.'
      }
    ],
    generalAdvice: 'Avoid chewing hard or sticky food on right side. Warm saline gargles 3-4 times daily after 24 hours. Maintain oral hygiene.',
    nextFollowUp: 'In 5 days for canal obturation and crown preparation.',
    toothNumbers: [30]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'SDC-INV-2026-081',
    patientId: 'pat-1',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98201 44521',
    date: '2026-09-24',
    dueDate: '2026-09-29',
    items: [
      {
        id: 'item-1',
        description: 'Single-Visit Rotary Root Canal Therapy (#30)',
        quantity: 1,
        unitPrice: 320,
        total: 320
      },
      {
        id: 'item-2',
        description: 'Digital RVG Diagnostic Periapical X-Ray',
        quantity: 1,
        unitPrice: 25,
        total: 25
      }
    ],
    subtotal: 345,
    discount: 25,
    tax: 0,
    grandTotal: 320,
    amountPaid: 80,
    balanceDue: 240,
    status: 'partial',
    paymentMethod: 'upi',
    paymentNotes: 'Advance payment of $80 received via UPI.'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'SDC-INV-2026-082',
    patientId: 'pat-2',
    patientName: 'Priya Mehta',
    patientPhone: '+91 97112 88900',
    date: '2026-09-24',
    dueDate: '2026-09-24',
    items: [
      {
        id: 'item-3',
        description: 'In-Office Zoom Laser Teeth Whitening',
        quantity: 1,
        unitPrice: 300,
        total: 300
      }
    ],
    subtotal: 300,
    discount: 0,
    tax: 0,
    grandTotal: 300,
    amountPaid: 300,
    balanceDue: 0,
    status: 'paid',
    paymentMethod: 'credit-card',
    paymentNotes: 'Settled in full via Card.'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'SDC-INV-2026-083',
    patientId: 'pat-3',
    patientName: 'Amit Patel',
    patientPhone: '+91 98220 33410',
    date: '2026-09-24',
    dueDate: '2026-10-01',
    items: [
      {
        id: 'item-4',
        description: 'Titanium Dental Implant Surgery Stage 1 (#19)',
        quantity: 1,
        unitPrice: 850,
        total: 850
      }
    ],
    subtotal: 850,
    discount: 50,
    tax: 0,
    grandTotal: 800,
    amountPaid: 350,
    balanceDue: 450,
    status: 'partial',
    paymentMethod: 'bank-transfer',
    paymentNotes: 'Implant booking deposit paid.'
  }
];

export const INITIAL_NOTIFICATIONS: SimulatedNotification[] = [
  // Doctor Clinic Notifications
  {
    id: 'notif-doc-1',
    type: 'sms',
    recipientName: 'Dr. Smita Bevle',
    recipientContact: '+91 98200-SMITA',
    title: 'Daily Schedule Summary',
    message: 'Good morning Dr. Smita. You have 4 clinical procedures scheduled today across Operatory Chairs 1-3.',
    timestamp: '08:30 AM',
    status: 'delivered',
    targetRole: 'doctor'
  },
  {
    id: 'notif-doc-2',
    type: 'sms',
    recipientName: 'Dr. Smita Bevle',
    recipientContact: '+91 98200-SMITA',
    title: 'Payment Received: $80.00',
    message: 'Advance payment of $80.00 collected from Rahul Sharma for RCT procedure (Invoice #SDC-INV-2026-081).',
    timestamp: '09:15 AM',
    status: 'delivered',
    patientId: 'pat-1',
    targetRole: 'doctor'
  },
  {
    id: 'notif-doc-3',
    type: 'email',
    recipientName: 'Dr. Smita Bevle',
    recipientContact: 'dr.smita@clinic.com',
    title: 'New Online Patient Booking',
    message: 'Priya Mehta booked In-Office Zoom Whitening for 11:30 AM in Operatory Chair 3.',
    timestamp: '09:45 AM',
    status: 'delivered',
    patientId: 'pat-2',
    targetRole: 'doctor'
  },

  // Rahul Sharma (pat-1) Notifications
  {
    id: 'notif-pat1-1',
    type: 'sms',
    recipientName: 'Rahul Sharma',
    recipientContact: '+91 98201 44521',
    title: 'Appointment Confirmed - Dr. Smita Bevle',
    message: 'Hello Rahul, your Single-Visit Rotary Root Canal Therapy is confirmed for today at 10:00 AM (Chair 1). Please arrive 10 minutes early.',
    timestamp: '09:00 AM',
    status: 'delivered',
    patientId: 'pat-1',
    targetRole: 'patient'
  },
  {
    id: 'notif-pat1-2',
    type: 'sms',
    recipientName: 'Rahul Sharma',
    recipientContact: '+91 98201 44521',
    title: 'Payment Receipt - Smita Dental Clinic',
    message: 'Thank you Rahul! Payment of $80.00 received via UPI for Invoice #SDC-INV-2026-081. Outstanding balance: $240.00.',
    timestamp: '09:16 AM',
    status: 'delivered',
    patientId: 'pat-1',
    targetRole: 'patient'
  },
  {
    id: 'notif-pat1-3',
    type: 'email',
    recipientName: 'Rahul Sharma',
    recipientContact: 'rahul@patient.com',
    title: 'Digital Prescription Issued by Dr. Smita Bevle',
    message: 'Dear Rahul, your official digital prescription (#SDC-RX-2026-101) has been generated and is now viewable in your Patient Portal.',
    timestamp: '10:45 AM',
    status: 'delivered',
    patientId: 'pat-1',
    targetRole: 'patient'
  },

  // Priya Mehta (pat-2) Notifications
  {
    id: 'notif-pat2-1',
    type: 'sms',
    recipientName: 'Priya Mehta',
    recipientContact: '+91 97112 88900',
    title: 'Appointment Reminder - Dr. Smita Bevle',
    message: 'Hello Priya, your In-Office Zoom Laser Teeth Whitening session is scheduled for today at 11:30 AM in Operatory Chair 3.',
    timestamp: '09:30 AM',
    status: 'delivered',
    patientId: 'pat-2',
    targetRole: 'patient'
  },
  {
    id: 'notif-pat2-2',
    type: 'sms',
    recipientName: 'Priya Mehta',
    recipientContact: '+91 97112 88900',
    title: 'Payment Settled in Full',
    message: 'Thank you Priya! Full settlement of $300.00 received via Credit Card for Invoice #SDC-INV-2026-082. Balance: $0.00.',
    timestamp: '12:15 PM',
    status: 'delivered',
    patientId: 'pat-2',
    targetRole: 'patient'
  },

  // Amit Patel (pat-3) Notifications
  {
    id: 'notif-pat3-1',
    type: 'sms',
    recipientName: 'Amit Patel',
    recipientContact: '+91 98220 33410',
    title: 'Upcoming Procedure - Dr. Smita Bevle',
    message: 'Hello Amit, your Titanium Dental Implant Surgery Stage 1 is scheduled for today at 03:00 PM (Chair 1). Please follow pre-op fasting guidelines.',
    timestamp: '10:00 AM',
    status: 'delivered',
    patientId: 'pat-3',
    targetRole: 'patient'
  },

  // Sunita Rao (pat-4) Notifications
  {
    id: 'notif-pat4-1',
    type: 'sms',
    recipientName: 'Sunita Rao',
    recipientContact: '+91 98230 77612',
    title: 'Welcome to Smita Dental Clinic',
    message: 'Dear Sunita, welcome to Smita Dental Clinic! Your registered Patient ID is SDC-2026-099. Dr. Smita Bevle looks forward to your routine hygiene visit.',
    timestamp: '09:00 AM',
    status: 'delivered',
    patientId: 'pat-4',
    targetRole: 'patient'
  }
];

